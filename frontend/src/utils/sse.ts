// Read a Server-Sent Events stream, calling onEvent with each parsed `data:` payload.
// Buffers across network chunks so events split mid-line aren't dropped.
export async function readSSE(
  response: Response,
  onEvent: (data: Record<string, unknown>) => void
): Promise<void> {
  const reader = response.body?.getReader()
  if (!reader) return

  const decoder = new TextDecoder()
  let buffer = ''

  const handleLine = (line: string) => {
    if (!line.startsWith('data: ')) return
    let data: Record<string, unknown>
    try {
      data = JSON.parse(line.slice(6))
    } catch {
      return // Malformed event - skip it
    }
    onEvent(data)
  }

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? '' // Keep the trailing partial line for the next chunk
    lines.forEach(handleLine)
  }

  buffer += decoder.decode()
  if (buffer) handleLine(buffer)
}
