export interface TocItem {
  id: string
  text: string
  level: number
}

export function extractTocItems(html: string): TocItem[] {
  const regex = /<(h[2-4])\s+id="([^"]*)"[^>]*>(.*?)<\/\1>/gi
  const items: TocItem[] = []
  let match: RegExpExecArray | null

  while ((match = regex.exec(html)) !== null) {
    const tag = match[1]!.toLowerCase()
    const id = match[2] ?? ''
    const text = (match[3] ?? '').replace(/<[^>]*>/g, '')
    items.push({ id, text, level: parseInt(tag[1]!) })
  }

  return items
}
