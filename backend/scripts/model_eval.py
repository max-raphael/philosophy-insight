#!/usr/bin/env python3
"""
Compare tutor models side by side on real reading questions.

Builds prompts through the app's own ChatService (whole-book context, system
prompt, highlight formatting), so results reflect what users would get.
Writes a Markdown report (answers side by side) and a JSON file with raw data.

Usage:
    cd backend && source venv/bin/activate
    python scripts/model_eval.py                       # all configs
    python scripts/model_eval.py --configs gpt-6-luna  # subset
"""

import argparse
import json
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from config import settings  # noqa: E402

EVAL_TEXT_IDS = ["meditations", "groundwork-metaphysics-morals"]
settings.full_text_ids = EVAL_TEXT_IDS

from dependencies import get_openai_client, get_text_service  # noqa: E402
from models.api import ChatRequest, ReadingContext  # noqa: E402
from services.chat import ChatService  # noqa: E402
from services.conversation import ConversationService, InMemoryConversationStore  # noqa: E402

# Price per 1M tokens: (input, cached input, output). From the OpenAI pricing page, 2026-10-29.
PRICES = {
    "gpt-6-luna": (0.10, 0.01, 0.50),
    "gpt-6.1-terra": (1.00, 0.05, 5.00),
    "gpt-6.1-sol": (2.00, 0.10, 10.00),
    "gpt-5.2": (1.75, 0.175, 14.00),
}
CACHE_WRITE_30M = 1.25  # Multiplier on uncached input when prompt_cache_options.ttl = "30m"

# Each config: model, reasoning effort, and prompt cache TTL (None = default caching)
CONFIGS = {
    "gpt-5.2 (previous deep model)": {"model": "gpt-5.2", "effort": "high", "ttl": None},
    "gpt-6-luna": {"model": "gpt-6-luna", "effort": "medium", "ttl": "30m"},
    "gpt-6.1-terra": {"model": "gpt-6.1-terra", "effort": "medium", "ttl": "30m"},
    "gpt-6.1-sol": {"model": "gpt-6.1-sol", "effort": "medium", "ttl": "30m"},
}

# (text_id, sections index or None, highlighted phrase or None, mode, question, what a good answer does)
QUESTIONS = [
    ("meditations", 19, "there is necessity, and the utility of the Universe", "tutor",
     "What's he saying here? Is this just 'everything happens for a reason'?",
     "Explains Stoic providence/nature-of-the-whole; distinguishes it from the pop slogan"),
    ("meditations", 52, "you may retire into yourself at any hour you please", "tutor",
     "Isn't this just escapism? How is it different from running away from your problems?",
     "Takes the objection seriously; inner retreat as renewal for returning to duty"),
    ("meditations", 160, None, "tutor",
     "Why does he keep bringing up atoms? Where else in the book does he do this?",
     "Providence-or-atoms dilemma; cites several real other passages"),
    ("meditations", 226, "indifference to all things that lie between good and bad", "tutor",
     "What does he mean by indifferent things?",
     "Stoic 'indifferents' (adiaphora), briefly and clearly"),
    ("meditations", 17, None, "tutor",
     "This feels kind of cynical, expecting everyone to be awful. Is that the point?",
     "Reads the morning passage charitably: kinship, ignorance of good/evil, not cynicism"),
    ("meditations", 52, None, "socratic",
     "I don't get why being calm inside matters if the world is still a mess.",
     "Asks a guiding question grounded in the passage instead of lecturing"),
    ("meditations", None, None, "tutor",
     "Who was Marcus writing this for?",
     "Himself; private notebook; brief"),
    ("meditations", 226, None, "tutor",
     "Does Marcus actually believe in providence, or is he agnostic? He seems to go back and forth.",
     "Nuanced; uses the 'providence or atoms' passages across the book with citations"),
    ("groundwork-metaphysics-morals", 15, "except a good will", "tutor",
     "What does he mean by 'good without qualification'?",
     "Unconditional vs conditional goods; jewel image; precise"),
    ("groundwork-metaphysics-morals", 29, "Duty is the necessity of acting from respect for the law", "tutor",
     "I don't get this sentence at all. What is 'respect for the law'?",
     "Respect as a feeling produced by reason; links to first two propositions"),
    ("groundwork-metaphysics-morals", 77, None, "tutor",
     "How is this different from the golden rule?",
     "Ideally finds Kant's own footnote rejecting the golden rule [Book 1, Section 100]"),
    ("groundwork-metaphysics-morals", 94, "as an end in himself", "tutor",
     "Does this mean I can never use anyone, like a cashier?",
     "'merely as a means' distinction; quotes the formula"),
    ("groundwork-metaphysics-morals", 109, None, "tutor",
     "How does the kingdom of ends connect to the earlier formulas?",
     "Maps the formulas (universal law, humanity, autonomy) to the kingdom of ends"),
    ("groundwork-metaphysics-morals", 26, "To secure one's own happiness is a duty, at least indirectly", "tutor",
     "Wait, I thought Kant said happiness doesn't matter morally?",
     "Indirect duty; gout example; corrects the misconception gently"),
    ("groundwork-metaphysics-morals", 145, None, "tutor",
     "Why does he need to presuppose freedom here? What problem is he solving?",
     "Section III: deducing the moral law needs freedom; the apparent circle"),
    ("groundwork-metaphysics-morals", 77, None, "socratic",
     "Would this rule really forbid lying to a murderer at the door?",
     "Socratic; ideally notes that example isn't in the Groundwork (it's a later essay)"),
]

CITATION_PATTERN = re.compile(r"\[Book (\d+), Sections? (\d+)(?:\s*[–-]\s*(\d+))?\]")


def build_request(text_service, idx, q):
    text_id, section_idx, highlight, mode, question, _ = q
    text = text_service.get(text_id)
    reading = None
    message = question
    if section_idx is not None:
        s = text.sections[section_idx]
        if highlight:
            assert highlight in s["content"], f"highlight not in passage for question {idx}"
            # Same format the frontend sends for a highlighted passage
            message = (
                f"[Book {s['book']}, Section {s['number']}]\n"
                f"> {s['content']}\n\n[Highlighted: \"{highlight}\"]\n\n{question}"
            )
        else:
            reading = ReadingContext(book=s["book"], section=s["number"], paragraph=s["content"])
    return ChatRequest(
        conversation_id=f"eval-{idx}", text_id=text_id, user_message=message,
        mode=mode, history=[], reading_context=reading,
    )


def check_citations(text, answer):
    """Return (valid, invalid) citation strings found in the answer."""
    existing = {(s["book"], s["number"]) for s in text.sections}
    valid, invalid = [], []
    for m in CITATION_PATTERN.finditer(answer):
        key = (int(m.group(1)), int(m.group(2)))
        (valid if key in existing else invalid).append(m.group(0))
    return valid, invalid


def cost(model, usage, ttl):
    price_in, price_cached, price_out = PRICES[model]
    cached = usage["cached_tokens"]
    uncached = usage["input_tokens"] - cached
    write_multiplier = CACHE_WRITE_30M if ttl else 1.0
    return (uncached * price_in * write_multiplier + cached * price_cached + usage["output_tokens"] * price_out) / 1e6


def run_one(client, text_service, config, idx, q):
    cfg = CONFIGS[config]
    request = build_request(text_service, idx, q)
    chat = ChatService(
        client, ConversationService(InMemoryConversationStore(), client),
        model=cfg["model"], effort=cfg["effort"], cache_ttl=cfg["ttl"] or "",
    )

    started = time.time()
    ctx = chat.prepare_context(request, text_service.get(request.text_id), text_service.full_text(request.text_id))
    # Same call options the app uses in production
    options = chat._request_options(ctx)

    answer, first_token, usage = "", None, None
    for event in client.responses.create(**options, stream=True):
        if event.type == "response.output_text.delta":
            first_token = first_token or time.time()
            answer += event.delta
        elif event.type == "response.completed":
            u = event.response.usage
            usage = {
                "input_tokens": u.input_tokens,
                "cached_tokens": u.input_tokens_details.cached_tokens if u.input_tokens_details else 0,
                "output_tokens": u.output_tokens,
                "reasoning_tokens": u.output_tokens_details.reasoning_tokens if u.output_tokens_details else 0,
            }
    finished = time.time()

    valid, invalid = check_citations(text_service.get(request.text_id), answer)
    return {
        "config": config, "question": idx, "model": cfg["model"], "effort": cfg["effort"],
        "answer": answer, "usage": usage, "cost": cost(ctx.model, usage, cfg.get("ttl")),
        "seconds_to_first_token": round((first_token or finished) - started, 1),
        "total_seconds": round(finished - started, 1),
        "citations_valid": valid, "citations_invalid": invalid,
    }


def run_config(client, text_service, config):
    # Sequential within a config, so later questions hit the cached book prefix
    results = []
    for idx, q in enumerate(QUESTIONS):
        try:
            results.append(run_one(client, text_service, config, idx, q))
            r = results[-1]
            print(f"  {config} q{idx}: ${r['cost']:.4f} {r['total_seconds']}s", flush=True)
        except Exception as e:  # Keep going; record the failure
            results.append({"config": config, "question": idx, "error": str(e)})
            print(f"  {config} q{idx}: ERROR {e}", flush=True)
    return results


def write_report(results, out_dir):
    stamp = datetime.now().strftime("%Y-%m-%d-%H%M")
    (out_dir / f"model-eval-{stamp}.json").write_text(json.dumps(results, indent=2))

    by_key = {(r["config"], r["question"]): r for r in results}
    configs = list(dict.fromkeys(r["config"] for r in results))
    lines = [f"# Tutor model comparison ({stamp})", "", "## Summary", "",
             "| Config | Total cost | Avg cost / answer | Avg first token | Avg output tokens | Citations valid / invalid | Errors |",
             "|---|---|---|---|---|---|---|"]
    for c in configs:
        rs = [r for r in results if r["config"] == c and "error" not in r]
        errors = sum(1 for r in results if r["config"] == c and "error" in r)
        if not rs:
            lines.append(f"| {c} | – | – | – | – | – | {errors} |")
            continue
        total = sum(r["cost"] for r in rs)
        lines.append(
            f"| {c} | ${total:.3f} | ${total / len(rs):.4f} | "
            f"{sum(r['seconds_to_first_token'] for r in rs) / len(rs):.1f}s | "
            f"{sum(r['usage']['output_tokens'] for r in rs) // len(rs)} | "
            f"{sum(len(r['citations_valid']) for r in rs)} / {sum(len(r['citations_invalid']) for r in rs)} | {errors} |"
        )

    for idx, (text_id, section_idx, highlight, mode, question, rubric) in enumerate(QUESTIONS):
        lines += ["", "---", "", f"## Q{idx + 1}. {question}", "",
                  f"*{text_id}*, passage index {section_idx}, mode: {mode}"
                  + (f', highlighted: "{highlight}"' if highlight else "")
                  + f"  \n**A good answer:** {rubric}"]
        for c in configs:
            r = by_key.get((c, idx))
            lines += ["", f"### {c}"]
            if r is None or "error" in r:
                lines.append(f"ERROR: {r['error'] if r else 'missing'}")
                continue
            lines += [f"*{r['model']} ({r['effort']}), ${r['cost']:.4f}, first token {r['seconds_to_first_token']}s, "
                      f"{r['usage']['output_tokens']} output tokens ({r['usage']['reasoning_tokens']} reasoning)"
                      + (f", invalid citations: {r['citations_invalid']}" if r["citations_invalid"] else "") + "*",
                      "", r["answer"]]
    report = out_dir / f"model-eval-{stamp}.md"
    report.write_text("\n".join(lines) + "\n")
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--configs", nargs="*", default=list(CONFIGS), help="Configs to run (default: all)")
    args = parser.parse_args()

    client = get_openai_client()
    text_service = get_text_service()
    with ThreadPoolExecutor(max_workers=len(args.configs)) as pool:
        batches = pool.map(lambda c: run_config(client, text_service, c), args.configs)
    results = [r for batch in batches for r in batch]

    out_dir = Path(__file__).resolve().parent.parent / "evals"
    out_dir.mkdir(exist_ok=True)
    report = write_report(results, out_dir)
    print(f"\nTotal cost: ${sum(r.get('cost', 0) for r in results):.3f}\nReport: {report}")


if __name__ == "__main__":
    main()
