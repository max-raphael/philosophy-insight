"""
Manifest of all philosophy texts to import from Project Gutenberg.
Each entry contains metadata and Gutenberg ID for import.
"""

from import_gutenberg import TextConfig

# =============================================================================
# ANCIENT PHILOSOPHY
# =============================================================================

PLATO = [
    TextConfig(
        gutenberg_id=1497, id='republic', title='Republic', author='Plato',
        translator='Benjamin Jowett', year='c. 375 BCE', category='ancient',
        description="Plato's masterwork on justice, the ideal state, and the nature of the soul. Features the Allegory of the Cave and theory of Forms."
    ),
    TextConfig(
        gutenberg_id=1600, id='symposium', title='Symposium', author='Plato',
        translator='Benjamin Jowett', year='c. 385 BCE', category='ancient',
        description="A philosophical dialogue on the nature of love, featuring speeches by Aristophanes, Socrates, and Alcibiades."
    ),
    TextConfig(
        gutenberg_id=1658, id='phaedo', title='Phaedo', author='Plato',
        translator='Benjamin Jowett', year='c. 360 BCE', category='ancient',
        description="Socrates' final hours, presenting arguments for the immortality of the soul and the philosopher's attitude toward death."
    ),
    TextConfig(
        gutenberg_id=1656, id='apology', title='Apology', author='Plato',
        translator='Benjamin Jowett', year='c. 399 BCE', category='ancient',
        description="Socrates' defense speech at his trial, exploring the examined life and the pursuit of wisdom."
    ),
    TextConfig(
        gutenberg_id=1643, id='meno', title='Meno', author='Plato',
        translator='Benjamin Jowett', year='c. 385 BCE', category='ancient',
        description="A dialogue on virtue and knowledge, featuring the famous slave-boy geometry demonstration and theory of recollection."
    ),
    TextConfig(
        gutenberg_id=1636, id='phaedrus', title='Phaedrus', author='Plato',
        translator='Benjamin Jowett', year='c. 370 BCE', category='ancient',
        description="On love, beauty, and the art of rhetoric. Contains the famous chariot allegory of the soul."
    ),
    TextConfig(
        gutenberg_id=1726, id='theaetetus', title='Theaetetus', author='Plato',
        translator='Benjamin Jowett', year='c. 369 BCE', category='ancient',
        description="A profound exploration of the nature of knowledge, examining perception, true belief, and justified true belief."
    ),
    TextConfig(
        gutenberg_id=1687, id='parmenides', title='Parmenides', author='Plato',
        translator='Benjamin Jowett', year='c. 370 BCE', category='ancient',
        description="A challenging dialogue where Parmenides critiques the young Socrates' theory of Forms."
    ),
    TextConfig(
        gutenberg_id=1735, id='sophist', title='Sophist', author='Plato',
        translator='Benjamin Jowett', year='c. 360 BCE', category='ancient',
        description="An investigation into the nature of being and non-being, featuring the Eleatic Stranger's method of division."
    ),
    TextConfig(
        gutenberg_id=1672, id='gorgias', title='Gorgias', author='Plato',
        translator='Benjamin Jowett', year='c. 380 BCE', category='ancient',
        description="A dialogue on rhetoric, power, and justice. Socrates argues that doing wrong is worse than suffering it."
    ),
    TextConfig(
        gutenberg_id=1591, id='protagoras', title='Protagoras', author='Plato',
        translator='Benjamin Jowett', year='c. 380 BCE', category='ancient',
        description="Socrates debates the great sophist Protagoras on whether virtue can be taught."
    ),
    TextConfig(
        gutenberg_id=1642, id='euthyphro', title='Euthyphro', author='Plato',
        translator='Benjamin Jowett', year='c. 399 BCE', category='ancient',
        description="On the nature of piety and the relationship between the gods and morality. The Euthyphro dilemma remains influential."
    ),
    TextConfig(
        gutenberg_id=1657, id='crito', title='Crito', author='Plato',
        translator='Benjamin Jowett', year='c. 399 BCE', category='ancient',
        description="Socrates explains why he refuses to escape from prison, exploring the citizen's obligation to the laws."
    ),
    TextConfig(
        gutenberg_id=1635, id='ion', title='Ion', author='Plato',
        translator='Benjamin Jowett', year='c. 390 BCE', category='ancient',
        description="A short dialogue on poetry and inspiration, questioning whether rhapsodes possess true knowledge."
    ),
    TextConfig(
        gutenberg_id=1750, id='laws', title='Laws', author='Plato',
        translator='Benjamin Jowett', year='c. 347 BCE', category='ancient',
        description="Plato's longest and final work, a detailed discussion of legislation and political philosophy."
    ),
    TextConfig(
        gutenberg_id=1572, id='timaeus', title='Timaeus', author='Plato',
        translator='Benjamin Jowett', year='c. 360 BCE', category='ancient',
        description="Plato's cosmology and natural philosophy, describing the creation of the universe by the Demiurge."
    ),
    TextConfig(
        gutenberg_id=1584, id='laches', title='Laches', author='Plato',
        translator='Benjamin Jowett', year='c. 380 BCE', category='ancient',
        description="A dialogue on the nature of courage, featuring Socrates questioning two Athenian generals."
    ),
    TextConfig(
        gutenberg_id=1580, id='charmides', title='Charmides', author='Plato',
        translator='Benjamin Jowett', year='c. 380 BCE', category='ancient',
        description="A dialogue exploring temperance (sophrosyne) and self-knowledge through conversation with the young Charmides."
    ),
    TextConfig(
        gutenberg_id=1579, id='lysis', title='Lysis', author='Plato',
        translator='Benjamin Jowett', year='c. 380 BCE', category='ancient',
        description="A dialogue on the nature of friendship and love, set in a wrestling school with young Athenians."
    ),
    TextConfig(
        gutenberg_id=1598, id='euthydemus', title='Euthydemus', author='Plato',
        translator='Benjamin Jowett', year='c. 384 BCE', category='ancient',
        description="Socrates confronts two sophists using eristic arguments, exposing the limits of verbal trickery."
    ),
    TextConfig(
        gutenberg_id=1616, id='cratylus', title='Cratylus', author='Plato',
        translator='Benjamin Jowett', year='c. 360 BCE', category='ancient',
        description="A dialogue on the philosophy of language: are names natural or conventional?"
    ),
    TextConfig(
        gutenberg_id=1744, id='philebus', title='Philebus', author='Plato',
        translator='Benjamin Jowett', year='c. 360 BCE', category='ancient',
        description="A dialogue on pleasure and the good life, arguing that the best life combines pleasure with intelligence."
    ),
    TextConfig(
        gutenberg_id=1738, id='statesman', title='Statesman', author='Plato',
        translator='Benjamin Jowett', year='c. 360 BCE', category='ancient',
        description="The Eleatic Stranger defines the statesman through the method of division, exploring political art."
    ),
    TextConfig(
        gutenberg_id=1571, id='critias', title='Critias', author='Plato',
        translator='Benjamin Jowett', year='c. 360 BCE', category='ancient',
        description="The unfinished sequel to Timaeus, containing the most detailed account of Atlantis."
    ),
    TextConfig(
        gutenberg_id=1676, id='alcibiades-i', title='Alcibiades I', author='Plato',
        translator='Benjamin Jowett', year='c. 390 BCE', category='ancient',
        description="A dialogue on self-knowledge and the nature of justice, featuring Socrates and the young Alcibiades."
    ),
    TextConfig(
        gutenberg_id=1677, id='alcibiades-ii', title='Alcibiades II', author='Plato',
        translator='Benjamin Jowett', year='c. 390 BCE', category='ancient',
        description="A dialogue on prayer and wisdom, exploring what we should ask of the gods."
    ),
]

ARISTOTLE = [
    TextConfig(
        gutenberg_id=8438, id='nicomachean-ethics', title='Nicomachean Ethics', author='Aristotle',
        translator='W. D. Ross', year='c. 340 BCE', category='ancient',
        description="The foundational text of virtue ethics, exploring happiness, virtue, friendship, and the good life."
    ),
    TextConfig(
        gutenberg_id=6762, id='politics', title='Politics', author='Aristotle',
        translator='Benjamin Jowett', year='c. 350 BCE', category='ancient',
        description="Aristotle's examination of political community, citizenship, and forms of government."
    ),
    TextConfig(
        gutenberg_id=1974, id='poetics', title='Poetics', author='Aristotle',
        translator='S. H. Butcher', year='c. 335 BCE', category='ancient',
        description="The foundational work of literary criticism, analyzing tragedy, plot, character, and catharsis."
    ),
    TextConfig(
        gutenberg_id=2154, id='rhetoric', title='Rhetoric', author='Aristotle',
        translator='W. Rhys Roberts', year='c. 350 BCE', category='ancient',
        description="The art of persuasion examined systematically: ethos, pathos, logos, and the means of persuasion."
    ),
    TextConfig(
        gutenberg_id=6763, id='metaphysics', title='Metaphysics', author='Aristotle',
        translator='W. D. Ross', year='c. 350 BCE', category='ancient',
        description="Aristotle's investigation into being qua being, substance, causation, and the unmoved mover."
    ),
    TextConfig(
        gutenberg_id=5733, id='physics', title='Physics', author='Aristotle',
        translator='R. P. Hardie and R. K. Gaye', year='c. 350 BCE', category='ancient',
        description="Aristotle's natural philosophy: motion, change, time, place, and the infinite."
    ),
    TextConfig(
        gutenberg_id=5765, id='on-the-soul', title='On the Soul (De Anima)', author='Aristotle',
        translator='J. A. Smith', year='c. 350 BCE', category='ancient',
        description="Aristotle's psychology examining the soul as the form of the body, sensation, and intellect."
    ),
    TextConfig(
        gutenberg_id=5765, id='categories', title='Categories', author='Aristotle',
        translator='E. M. Edghill', year='c. 350 BCE', category='ancient',
        description="Aristotle's classification of the fundamental kinds of being: substance, quantity, quality, relation, etc."
    ),
    TextConfig(
        gutenberg_id=5763, id='history-of-animals', title='History of Animals', author='Aristotle',
        translator='D\'Arcy Wentworth Thompson', year='c. 343 BCE', category='ancient',
        description="Aristotle's biological treatise, systematically cataloguing animal life and laying foundations for zoology."
    ),
]

STOICS = [
    TextConfig(
        gutenberg_id=2680, id='meditations', title='Meditations', author='Marcus Aurelius',
        translator='George Long', year='c. 170 CE', category='ancient',
        description="The Roman Emperor's private philosophical journal, a cornerstone of Stoic literature on self-improvement."
    ),
    TextConfig(
        gutenberg_id=10661, id='discourses', title='Discourses', author='Epictetus',
        translator='George Long', year='c. 108 CE', category='ancient',
        description="The teachings of the former slave turned Stoic philosopher on freedom, virtue, and living according to nature."
    ),
    TextConfig(
        gutenberg_id=45109, id='enchiridion', title='Enchiridion', author='Epictetus',
        translator='Elizabeth Carter', year='c. 125 CE', category='ancient',
        description="The Stoic handbook: a concise manual of practical philosophy on what is and isn't within our control."
    ),
    TextConfig(
        gutenberg_id=64576, id='minor-dialogues', title='Minor Dialogues', author='Seneca',
        translator='Aubrey Stewart', year='c. 60 CE', category='ancient',
        description="Seneca's philosophical essays including On Providence, On Anger, On the Shortness of Life, and On Clemency."
    ),
    TextConfig(
        gutenberg_id=56075, id='morals-happy-life', title='Morals of a Happy Life', author='Seneca',
        translator='Roger L\'Estrange', year='c. 60 CE', category='ancient',
        description="Seneca's moral philosophy on happiness, benefits, anger, and clemency - core Stoic teachings."
    ),
    TextConfig(
        gutenberg_id=47001, id='on-duties', title='On Duties', author='Cicero',
        translator='Walter Miller', year='44 BCE', category='ancient',
        description="Cicero's treatise on moral obligations, examining honorable conduct in public and private life."
    ),
    TextConfig(
        gutenberg_id=14988, id='tusculan-disputations', title='Tusculan Disputations', author='Cicero',
        translator='C. D. Yonge', year='45 BCE', category='ancient',
        description="Cicero's philosophical dialogues on death, pain, grief, emotions, and virtue as sufficient for happiness."
    ),
    TextConfig(
        gutenberg_id=2808, id='on-friendship-and-old-age', title='On Friendship and Old Age', author='Cicero',
        translator='E. S. Shuckburgh', year='44 BCE', category='ancient',
        description="Two of Cicero's most beloved essays: Laelius on friendship and Cato on the art of growing old gracefully."
    ),
    TextConfig(
        gutenberg_id=54161, id='the-republic', title='The Republic', author='Cicero',
        translator='Francis Barham', year='54 BCE', category='ancient',
        description="Cicero's dialogue on the ideal state, justice, and the best form of government, modeled on Plato's Republic."
    ),
    TextConfig(
        gutenberg_id=14970, id='academica', title='Academica', author='Cicero',
        translator='James S. Reid', year='45 BCE', category='ancient',
        description="Cicero's exposition of Academic skepticism, examining the limits of human knowledge and certainty."
    ),
]

EPICUREANS_AND_OTHERS = [
    TextConfig(
        gutenberg_id=785, id='on-the-nature-of-things', title='On the Nature of Things', author='Lucretius',
        translator='William Ellery Leonard', year='c. 50 BCE', category='ancient',
        description="The great Epicurean poem explaining atomic theory, the mortality of the soul, and freedom from fear."
    ),
    TextConfig(
        gutenberg_id=57342, id='lives-of-philosophers', title='Lives of the Eminent Philosophers', author='Diogenes Laertius',
        translator='C. D. Yonge', year='c. 230 CE', category='ancient',
        description="Biographical sketches and doctrines of ancient Greek philosophers from Thales to Epicurus."
    ),
    TextConfig(
        gutenberg_id=42930, id='enneads-vol-1', title='Enneads, Volume 1', author='Plotinus',
        translator='Kenneth Sylvan Guthrie', year='c. 270 CE', category='ancient',
        description="The first volume of Plotinus's Neoplatonist philosophy, exploring the One, Intellect, and Soul."
    ),
    TextConfig(
        gutenberg_id=29510, id='essay-on-the-beautiful', title='An Essay on the Beautiful', author='Plotinus',
        translator='Thomas Taylor', year='c. 260 CE', category='ancient',
        description="Plotinus's treatise on beauty and its relation to the divine, foundational to Neoplatonist aesthetics."
    ),
    TextConfig(
        gutenberg_id=1177, id='memorabilia', title='Memorabilia', author='Xenophon',
        translator='H. G. Dakyns', year='c. 370 BCE', category='ancient',
        description="Xenophon's recollections of Socrates, offering a different portrait than Plato's dialogues."
    ),
]

# =============================================================================
# MEDIEVAL PHILOSOPHY
# =============================================================================

MEDIEVAL = [
    TextConfig(
        gutenberg_id=3296, id='confessions', title='Confessions', author='Augustine of Hippo',
        translator='E. B. Pusey', year='397 CE', category='medieval',
        description="Augustine's spiritual autobiography, exploring memory, time, and the soul's journey to God."
    ),
    TextConfig(
        gutenberg_id=45304, id='city-of-god', title='City of God', author='Augustine of Hippo',
        translator='Marcus Dods', year='426 CE', category='medieval',
        description="Augustine's monumental defense of Christianity against paganism, contrasting the earthly and heavenly cities."
    ),
    TextConfig(
        gutenberg_id=14328, id='consolation-of-philosophy', title='Consolation of Philosophy', author='Boethius',
        translator='H. R. James', year='524 CE', category='medieval',
        description="Philosophy personified consoles the imprisoned Boethius, discussing fate, free will, and true happiness."
    ),
    TextConfig(
        gutenberg_id=17611, id='summa-theologica', title='Summa Theologica', author='Thomas Aquinas',
        translator='Fathers of the English Dominican Province', year='1274', category='medieval',
        description="Aquinas's systematic theology synthesizing Christian doctrine with Aristotelian philosophy."
    ),
    TextConfig(
        gutenberg_id=50896, id='guide-for-the-perplexed', title='Guide for the Perplexed', author='Moses Maimonides',
        translator='M. Friedländer', year='1190', category='medieval',
        description="Maimonides reconciles Jewish theology with Aristotelian philosophy, addressing divine attributes and prophecy."
    ),
]

# =============================================================================
# EARLY MODERN / ENLIGHTENMENT
# =============================================================================

BACON = [
    TextConfig(
        gutenberg_id=45988, id='novum-organum', title='Novum Organum', author='Francis Bacon',
        translator=None, year='1620', category='enlightenment',
        description="Bacon's foundational work on scientific method, introducing inductive reasoning to replace Aristotelian logic."
    ),
    TextConfig(
        gutenberg_id=5500, id='advancement-of-learning', title='The Advancement of Learning', author='Francis Bacon',
        translator=None, year='1605', category='enlightenment',
        description="Bacon's influential treatise on the organization and progress of human knowledge."
    ),
]

RATIONALISTS = [
    TextConfig(
        gutenberg_id=59, id='discourse-on-method', title='Discourse on Method', author='René Descartes',
        translator='John Veitch', year='1637', category='enlightenment',
        description="Descartes' foundational work introducing systematic doubt and the famous 'cogito ergo sum'."
    ),
    TextConfig(
        gutenberg_id=3800, id='ethics', title='Ethics', author='Baruch Spinoza',
        translator='R. H. M. Elwes', year='1677', category='enlightenment',
        description="Spinoza's masterwork using geometric method to explore God, mind, emotions, and human freedom."
    ),
    TextConfig(
        gutenberg_id=989, id='theological-political-treatise', title='Theological-Political Treatise', author='Baruch Spinoza',
        translator='R. H. M. Elwes', year='1670', category='enlightenment',
        description="Spinoza's defense of freedom of thought, biblical criticism, and the separation of philosophy from theology."
    ),
    TextConfig(
        gutenberg_id=39441, id='monadology', title='Monadology', author='Gottfried Wilhelm Leibniz',
        translator='George Montgomery', year='1714', category='enlightenment',
        description="Leibniz's compact presentation of his metaphysics of monads, pre-established harmony, and the best of all possible worlds."
    ),
]

EMPIRICISTS = [
    TextConfig(
        gutenberg_id=10615, id='essay-concerning-human-understanding', title='Essay Concerning Human Understanding', author='John Locke',
        translator=None, year='1689', category='enlightenment',
        description="Locke's foundational empiricist work on the origins, extent, and certainty of human knowledge."
    ),
    TextConfig(
        gutenberg_id=7370, id='two-treatises-of-government', title='Two Treatises of Government', author='John Locke',
        translator=None, year='1689', category='enlightenment',
        description="Locke's political philosophy: natural rights, government by consent, and the right of revolution."
    ),
    TextConfig(
        gutenberg_id=4723, id='principles-of-human-knowledge', title='Principles of Human Knowledge', author='George Berkeley',
        translator=None, year='1710', category='enlightenment',
        description="Berkeley's idealism: 'to be is to be perceived.' A radical empiricist rejection of material substance."
    ),
    TextConfig(
        gutenberg_id=4724, id='three-dialogues', title='Three Dialogues between Hylas and Philonous', author='George Berkeley',
        translator=None, year='1713', category='enlightenment',
        description="Berkeley defends immaterialism through lively dialogue, arguing that matter does not exist independently of perception."
    ),
    TextConfig(
        gutenberg_id=4705, id='treatise-of-human-nature', title='A Treatise of Human Nature', author='David Hume',
        translator=None, year='1739', category='enlightenment',
        description="Hume's ambitious attempt to introduce experimental method into moral subjects, examining understanding, passions, and morals."
    ),
    TextConfig(
        gutenberg_id=9662, id='enquiry-concerning-human-understanding', title='An Enquiry Concerning Human Understanding', author='David Hume',
        translator=None, year='1748', category='enlightenment',
        description="Hume's accessible reworking of his epistemology, famous for its analysis of causation and the problem of induction."
    ),
    TextConfig(
        gutenberg_id=4320, id='enquiry-concerning-morals', title='An Enquiry Concerning the Principles of Morals', author='David Hume',
        translator=None, year='1751', category='enlightenment',
        description="Hume's moral philosophy grounding ethics in sentiment and utility rather than reason alone."
    ),
    TextConfig(
        gutenberg_id=4583, id='dialogues-concerning-natural-religion', title='Dialogues Concerning Natural Religion', author='David Hume',
        translator=None, year='1779', category='enlightenment',
        description="Hume's posthumous critique of arguments for God's existence, presented through three philosophical characters."
    ),
]

KANT = [
    TextConfig(
        gutenberg_id=4280, id='critique-of-pure-reason', title='Critique of Pure Reason', author='Immanuel Kant',
        translator='J. M. D. Meiklejohn', year='1781', category='enlightenment',
        description="Kant's revolutionary examination of the limits and possibilities of human knowledge, establishing transcendental idealism."
    ),
    TextConfig(
        gutenberg_id=5683, id='critique-of-practical-reason', title='Critique of Practical Reason', author='Immanuel Kant',
        translator='Thomas Kingsmill Abbott', year='1788', category='enlightenment',
        description="Kant's moral philosophy establishing the categorical imperative as the supreme principle of morality."
    ),
    TextConfig(
        gutenberg_id=48433, id='critique-of-judgment', title='Critique of Judgment', author='Immanuel Kant',
        translator='J. H. Bernard', year='1790', category='enlightenment',
        description="Kant's aesthetics and teleology, bridging the gap between nature and freedom through beauty and purposiveness."
    ),
    TextConfig(
        gutenberg_id=5682, id='groundwork-metaphysics-morals', title='Groundwork of the Metaphysics of Morals', author='Immanuel Kant',
        translator='Thomas Kingsmill Abbott', year='1785', category='enlightenment',
        description="Kant's foundational work in ethics, arguing for duty-based morality and the categorical imperative."
    ),
    TextConfig(
        gutenberg_id=52821, id='prolegomena', title='Prolegomena to Any Future Metaphysics', author='Immanuel Kant',
        translator='Paul Carus', year='1783', category='enlightenment',
        description="Kant's accessible summary of the Critique of Pure Reason, explaining how synthetic a priori knowledge is possible."
    ),
    TextConfig(
        gutenberg_id=50922, id='perpetual-peace', title='Perpetual Peace', author='Immanuel Kant',
        translator='W. Hastie', year='1795', category='enlightenment',
        description="Kant's vision for lasting international peace through republicanism, federation, and cosmopolitan law."
    ),
]

POLITICAL_PHILOSOPHY = [
    TextConfig(
        gutenberg_id=3207, id='leviathan', title='Leviathan', author='Thomas Hobbes',
        translator=None, year='1651', category='enlightenment',
        description="Hobbes' social contract theory: life in the state of nature is 'solitary, poor, nasty, brutish, and short.'"
    ),
    TextConfig(
        gutenberg_id=46333, id='social-contract', title='The Social Contract', author='Jean-Jacques Rousseau',
        translator='G. D. H. Cole', year='1762', category='enlightenment',
        description="Rousseau's political philosophy: 'Man is born free, and everywhere he is in chains.' On the general will and legitimate government."
    ),
    TextConfig(
        gutenberg_id=11136, id='discourse-on-inequality', title='Discourse on Inequality', author='Jean-Jacques Rousseau',
        translator='G. D. H. Cole', year='1755', category='enlightenment',
        description="Rousseau traces the origins of inequality, arguing that civilization has corrupted natural human goodness."
    ),
    TextConfig(
        gutenberg_id=1232, id='the-prince', title='The Prince', author='Niccolò Machiavelli',
        translator='W. K. Marriott', year='1532', category='enlightenment',
        description="The foundational text of modern political philosophy on power, statecraft, and political leadership."
    ),
    TextConfig(
        gutenberg_id=10827, id='discourses-on-livy', title='Discourses on Livy', author='Niccolò Machiavelli',
        translator='Ninian Hill Thomson', year='1531', category='enlightenment',
        description="Machiavelli's republican political theory, analyzing Roman history for lessons on liberty and civic virtue."
    ),
]

OTHER_ENLIGHTENMENT = [
    TextConfig(
        gutenberg_id=18269, id='pensees', title='Pensées', author='Blaise Pascal',
        translator='W. F. Trotter', year='1670', category='enlightenment',
        description="Pascal's fragmentary reflections on faith, reason, and the human condition, including the famous 'wager' argument."
    ),
    TextConfig(
        gutenberg_id=19942, id='candide', title='Candide', author='Voltaire',
        translator=None, year='1759', category='enlightenment',
        description="Voltaire's satirical masterpiece ridiculing optimism and religious hypocrisy through the misadventures of Candide."
    ),
    TextConfig(
        gutenberg_id=31270, id='rights-of-man', title='Rights of Man', author='Thomas Paine',
        translator=None, year='1791', category='enlightenment',
        description="Paine's defense of the French Revolution and natural rights against Burke's conservative critique."
    ),
    TextConfig(
        gutenberg_id=3743, id='age-of-reason', title='The Age of Reason', author='Thomas Paine',
        translator=None, year='1794', category='enlightenment',
        description="Paine's deist critique of organized religion and biblical authority, advocating reason over revelation."
    ),
    TextConfig(
        gutenberg_id=5427, id='emile', title='Emile, or On Education', author='Jean-Jacques Rousseau',
        translator='Barbara Foxley', year='1762', category='enlightenment',
        description="Rousseau's influential treatise on education and human nature, tracing development from infancy to adulthood."
    ),
    TextConfig(
        gutenberg_id=18569, id='philosophical-dictionary', title='Philosophical Dictionary', author='Voltaire',
        translator=None, year='1764', category='enlightenment',
        description="Voltaire's encyclopedic collection of essays attacking religious intolerance and promoting Enlightenment values."
    ),
    TextConfig(
        gutenberg_id=67363, id='theory-of-moral-sentiments', title='The Theory of Moral Sentiments', author='Adam Smith',
        translator=None, year='1759', category='enlightenment',
        description="Adam Smith's moral philosophy grounding ethics in sympathy and the impartial spectator, foundational to his economic theory."
    ),
    TextConfig(
        gutenberg_id=3600, id='essays-montaigne', title='Essays', author='Michel de Montaigne',
        translator='Charles Cotton', year='1580', category='enlightenment',
        description="Montaigne's revolutionary personal essays, exploring skepticism, self-knowledge, and the human condition."
    ),
]

# =============================================================================
# 19TH CENTURY
# =============================================================================

GERMAN_IDEALISM = [
    TextConfig(
        gutenberg_id=6698, id='phenomenology-of-spirit', title='Phenomenology of Spirit', author='G. W. F. Hegel',
        translator='J. B. Baillie', year='1807', category='modern',
        description="Hegel's account of consciousness's development from sense-certainty to absolute knowing, including the master-slave dialectic."
    ),
    TextConfig(
        gutenberg_id=857, id='philosophy-of-history', title='Philosophy of History', author='G. W. F. Hegel',
        translator='J. Sibree', year='1837', category='modern',
        description="Hegel's lectures on world history as the progress of the consciousness of freedom."
    ),
    TextConfig(
        gutenberg_id=38427, id='world-as-will-and-representation', title='The World as Will and Representation', author='Arthur Schopenhauer',
        translator='R. B. Haldane and J. Kemp', year='1818', category='modern',
        description="Schopenhauer's pessimistic philosophy: the world is driven by blind will, and salvation lies in aesthetic contemplation and asceticism."
    ),
]

EXISTENTIALIST_PRECURSORS = [
    TextConfig(
        gutenberg_id=45644, id='fear-and-trembling', title='Fear and Trembling', author='Søren Kierkegaard',
        translator='Walter Lowrie', year='1843', category='modern',
        description="Kierkegaard's meditation on Abraham and Isaac, exploring faith as a leap beyond rational ethics."
    ),
]

NIETZSCHE = [
    TextConfig(
        gutenberg_id=4363, id='beyond-good-and-evil', title='Beyond Good and Evil', author='Friedrich Nietzsche',
        translator='Helen Zimmern', year='1886', category='modern',
        description="Nietzsche's critique of traditional morality with provocative aphorisms on truth, morality, and the will to power."
    ),
    TextConfig(
        gutenberg_id=1998, id='thus-spoke-zarathustra', title='Thus Spoke Zarathustra', author='Friedrich Nietzsche',
        translator='Thomas Common', year='1885', category='modern',
        description="Nietzsche's philosophical novel introducing the Übermensch, eternal recurrence, and the death of God."
    ),
    TextConfig(
        gutenberg_id=52319, id='genealogy-of-morals', title='On the Genealogy of Morals', author='Friedrich Nietzsche',
        translator='Horace B. Samuel', year='1887', category='modern',
        description="Nietzsche traces the origins of moral concepts, distinguishing master and slave morality."
    ),
    TextConfig(
        gutenberg_id=7372, id='birth-of-tragedy', title='The Birth of Tragedy', author='Friedrich Nietzsche',
        translator='William A. Haussmann', year='1872', category='modern',
        description="Nietzsche's first book on Greek tragedy, the Apollonian and Dionysian, and the death of tragedy through Socratic rationalism."
    ),
    TextConfig(
        gutenberg_id=52263, id='twilight-of-the-idols', title='Twilight of the Idols', author='Friedrich Nietzsche',
        translator='Anthony M. Ludovici', year='1889', category='modern',
        description="Nietzsche's concise critique of Western philosophy and culture, 'philosophizing with a hammer.'"
    ),
    TextConfig(
        gutenberg_id=19322, id='antichrist', title='The Antichrist', author='Friedrich Nietzsche',
        translator='H. L. Mencken', year='1895', category='modern',
        description="Nietzsche's polemical attack on Christianity as a religion of weakness and resentment."
    ),
    TextConfig(
        gutenberg_id=38145, id='human-all-too-human', title='Human, All Too Human', author='Friedrich Nietzsche',
        translator='Alexander Harvey', year='1878', category='modern',
        description="Nietzsche's break with Wagner and metaphysics, applying psychological analysis to moral and cultural phenomena."
    ),
    TextConfig(
        gutenberg_id=52881, id='gay-science', title='The Gay Science', author='Friedrich Nietzsche',
        translator='Thomas Common', year='1882', category='modern',
        description="'God is dead': Nietzsche announces the death of God and explores its implications for knowledge, art, and life."
    ),
    TextConfig(
        gutenberg_id=52190, id='ecce-homo', title='Ecce Homo', author='Friedrich Nietzsche',
        translator='Anthony M. Ludovici', year='1888', category='modern',
        description="Nietzsche's intellectual autobiography: 'Why I Am So Wise, Why I Am So Clever, Why I Write Such Good Books.'"
    ),
]

BRITISH_PHILOSOPHY = [
    TextConfig(
        gutenberg_id=34901, id='on-liberty', title='On Liberty', author='John Stuart Mill',
        translator=None, year='1859', category='modern',
        description="Mill's classic defense of individual freedom against the tyranny of the majority and social conformity."
    ),
    TextConfig(
        gutenberg_id=11224, id='utilitarianism', title='Utilitarianism', author='John Stuart Mill',
        translator=None, year='1863', category='modern',
        description="Mill's systematic defense of the greatest happiness principle as the foundation of morality."
    ),
    TextConfig(
        gutenberg_id=27083, id='subjection-of-women', title='The Subjection of Women', author='John Stuart Mill',
        translator=None, year='1869', category='modern',
        description="Mill's feminist argument for legal and social equality between the sexes."
    ),
    TextConfig(
        gutenberg_id=6726, id='principles-of-morals', title='An Introduction to the Principles of Morals and Legislation', author='Jeremy Bentham',
        translator=None, year='1789', category='modern',
        description="Bentham's foundational utilitarian text introducing the principle of utility and felicific calculus."
    ),
    TextConfig(
        gutenberg_id=27942, id='system-of-logic', title='A System of Logic', author='John Stuart Mill',
        translator=None, year='1843', category='modern',
        description="Mill's comprehensive treatise on inductive reasoning, scientific method, and the logic of the moral sciences."
    ),
    TextConfig(
        gutenberg_id=10378, id='autobiography-mill', title='Autobiography', author='John Stuart Mill',
        translator=None, year='1873', category='modern',
        description="Mill's candid account of his unusual education, mental crisis, and intellectual development."
    ),
    TextConfig(
        gutenberg_id=55046, id='first-principles', title='First Principles', author='Herbert Spencer',
        translator=None, year='1862', category='modern',
        description="Spencer's evolutionary philosophy synthesizing science and philosophy into a unified system."
    ),
    TextConfig(
        gutenberg_id=46743, id='methods-of-ethics', title='The Methods of Ethics', author='Henry Sidgwick',
        translator=None, year='1874', category='modern',
        description="Sidgwick's systematic examination of ethical methods: egoism, intuitionism, and utilitarianism."
    ),
    TextConfig(
        gutenberg_id=4212, id='culture-and-anarchy', title='Culture and Anarchy', author='Matthew Arnold',
        translator=None, year='1869', category='modern',
        description="Arnold's critique of Victorian society and defense of culture as the pursuit of perfection."
    ),
    TextConfig(
        gutenberg_id=36541, id='unto-this-last', title='Unto This Last', author='John Ruskin',
        translator=None, year='1860', category='modern',
        description="Ruskin's influential critique of industrial capitalism and laissez-faire economics."
    ),
    TextConfig(
        gutenberg_id=1091, id='on-heroes', title='On Heroes, Hero-Worship, and the Heroic in History', author='Thomas Carlyle',
        translator=None, year='1841', category='modern',
        description="Carlyle's lectures on great men as the driving force of history, from Odin to Napoleon."
    ),
    TextConfig(
        gutenberg_id=19690, id='apologia-pro-vita-sua', title='Apologia Pro Vita Sua', author='John Henry Newman',
        translator=None, year='1864', category='modern',
        description="Newman's spiritual autobiography defending his conversion from Anglicanism to Roman Catholicism."
    ),
]

POLITICAL_ECONOMIC = [
    TextConfig(
        gutenberg_id=61, id='communist-manifesto', title='The Communist Manifesto', author='Karl Marx and Friedrich Engels',
        translator='Samuel Moore', year='1848', category='modern',
        description="'Workers of the world, unite!' The founding document of modern communism analyzing class struggle."
    ),
    TextConfig(
        gutenberg_id=360, id='what-is-property', title='What is Property?', author='Pierre-Joseph Proudhon',
        translator='Benjamin Tucker', year='1840', category='modern',
        description="'Property is theft!' Proudhon's anarchist critique of private property and advocacy of mutualism."
    ),
    TextConfig(
        gutenberg_id=815, id='democracy-in-america', title='Democracy in America', author='Alexis de Tocqueville',
        translator='Henry Reeve', year='1835', category='modern',
        description="Tocqueville's classic analysis of American democracy, equality, and the dangers of democratic tyranny."
    ),
    TextConfig(
        gutenberg_id=39257, id='socialism-utopian-scientific', title='Socialism: Utopian and Scientific', author='Friedrich Engels',
        translator='Edward Aveling', year='1880', category='modern',
        description="Engels' accessible introduction to scientific socialism, contrasting it with earlier utopian movements."
    ),
    TextConfig(
        gutenberg_id=3420, id='vindication-rights-woman', title='A Vindication of the Rights of Woman', author='Mary Wollstonecraft',
        translator=None, year='1792', category='enlightenment',
        description="Wollstonecraft's pioneering feminist argument for women's education and equality, a founding text of feminism."
    ),
    TextConfig(
        gutenberg_id=36568, id='god-and-the-state', title='God and the State', author='Mikhail Bakunin',
        translator='Benjamin Tucker', year='1882', category='modern',
        description="Bakunin's anarchist critique of religion and the state as interconnected systems of oppression."
    ),
    TextConfig(
        gutenberg_id=4341, id='mutual-aid', title='Mutual Aid: A Factor of Evolution', author='Peter Kropotkin',
        translator=None, year='1902', category='modern',
        description="Kropotkin's argument that cooperation, not competition, is the key factor in evolution and human progress."
    ),
    TextConfig(
        gutenberg_id=23428, id='conquest-of-bread', title='The Conquest of Bread', author='Peter Kropotkin',
        translator=None, year='1892', category='modern',
        description="Kropotkin's vision of anarchist communism, outlining how a society without government could function."
    ),
    TextConfig(
        gutenberg_id=34580, id='ego-and-its-own', title='The Ego and Its Own', author='Max Stirner',
        translator='Steven T. Byington', year='1844', category='modern',
        description="Stirner's radical individualist philosophy rejecting all higher powers, states, and abstract ideals."
    ),
    TextConfig(
        gutenberg_id=47025, id='essence-of-christianity', title='The Essence of Christianity', author='Ludwig Feuerbach',
        translator='George Eliot', year='1841', category='modern',
        description="Feuerbach's influential critique arguing that God is a projection of human nature and desires."
    ),
    TextConfig(
        gutenberg_id=53799, id='general-view-positivism', title='A General View of Positivism', author='Auguste Comte',
        translator='J. H. Bridges', year='1848', category='modern',
        description="Comte's accessible summary of positivism: the religion of humanity and worship of science as the pinnacle of progress."
    ),
]

AMERICAN_PHILOSOPHY = [
    TextConfig(
        gutenberg_id=16643, id='essays-emerson', title='Essays', author='Ralph Waldo Emerson',
        translator=None, year='1841', category='modern',
        description="Emerson's transcendentalist essays including 'Self-Reliance,' 'The Over-Soul,' and 'Circles.'"
    ),
    TextConfig(
        gutenberg_id=205, id='walden', title='Walden', author='Henry David Thoreau',
        translator=None, year='1854', category='modern',
        description="Thoreau's transcendentalist masterpiece on simple living, self-reliance, and communion with nature."
    ),
    TextConfig(
        gutenberg_id=71, id='civil-disobedience', title='On the Duty of Civil Disobedience', author='Henry David Thoreau',
        translator=None, year='1849', category='modern',
        description="Thoreau's influential essay on resistance to unjust government, inspiring Gandhi and MLK."
    ),
    TextConfig(
        gutenberg_id=5116, id='pragmatism', title='Pragmatism', author='William James',
        translator=None, year='1907', category='modern',
        description="James's accessible introduction to pragmatism as a method and theory of truth."
    ),
    TextConfig(
        gutenberg_id=621, id='varieties-of-religious-experience', title='The Varieties of Religious Experience', author='William James',
        translator=None, year='1902', category='modern',
        description="James's empirical study of religious experience, examining mysticism, conversion, and saintliness."
    ),
    TextConfig(
        gutenberg_id=852, id='democracy-and-education', title='Democracy and Education', author='John Dewey',
        translator=None, year='1916', category='modern',
        description="Dewey's influential philosophy of education connecting learning to democratic participation and social growth."
    ),
    TextConfig(
        gutenberg_id=15000, id='life-of-reason', title='The Life of Reason', author='George Santayana',
        translator=None, year='1905', category='modern',
        description="Santayana's naturalistic philosophy examining reason's role in common sense, society, religion, art, and science."
    ),
    TextConfig(
        gutenberg_id=65274, id='chance-love-and-logic', title='Chance, Love, and Logic', author='Charles Sanders Peirce',
        translator=None, year='1923', category='modern',
        description="Essays by the founder of pragmatism, exploring chance, evolution, logic, and the scientific method."
    ),
    TextConfig(
        gutenberg_id=57628, id='principles-of-psychology-vol-1', title='The Principles of Psychology, Vol. 1', author='William James',
        translator=None, year='1890', category='modern',
        description="James's groundbreaking work in psychology examining consciousness, habit, emotion, and the stream of thought."
    ),
    TextConfig(
        gutenberg_id=57634, id='principles-of-psychology-vol-2', title='The Principles of Psychology, Vol. 2', author='William James',
        translator=None, year='1890', category='modern',
        description="The second volume of James's psychology, covering sensation, perception, reasoning, and the will."
    ),
]

# =============================================================================
# COMBINED LIST
# =============================================================================

ALL_TEXTS = (
    PLATO +
    ARISTOTLE +
    STOICS +
    EPICUREANS_AND_OTHERS +
    MEDIEVAL +
    BACON +
    RATIONALISTS +
    EMPIRICISTS +
    KANT +
    POLITICAL_PHILOSOPHY +
    OTHER_ENLIGHTENMENT +
    GERMAN_IDEALISM +
    EXISTENTIALIST_PRECURSORS +
    NIETZSCHE +
    BRITISH_PHILOSOPHY +
    POLITICAL_ECONOMIC +
    AMERICAN_PHILOSOPHY
)

# Texts we already have (don't reimport)
EXISTING_IDS = {
    'meditations',
    'enchiridion',
    'nicomachean-ethics',
    'republic',
    'beyond-good-evil',
    'on-liberty',
    'enquiry',  # This is Hume's Enquiry
}

# Filter to only new texts
NEW_TEXTS = [t for t in ALL_TEXTS if t.id not in EXISTING_IDS]

if __name__ == '__main__':
    print(f"Total texts in manifest: {len(ALL_TEXTS)}")
    print(f"Already imported: {len(EXISTING_IDS)}")
    print(f"New texts to import: {len(NEW_TEXTS)}")
    print("\nBy category:")
    from collections import Counter
    counts = Counter(t.category for t in ALL_TEXTS)
    for cat, count in sorted(counts.items()):
        print(f"  {cat}: {count}")
