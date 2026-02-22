export interface TocItem {
  id: string
  text: string
  level: number
}

/**
 * HTML içindeki h2, h3, h4 başlıklarından TOC (Table of Contents) öğeleri çıkarır.
 * Regex: /<(h[2-4])\s+id="([^"]*)"[^>]*>(.*?)<\/\1>/gi
 * - (h[2-4]): h2, h3 veya h4 tag'i (capture 1)
 * - \s+id="([^"]*)": id attribute, değer capture grubu 2
 * - [^>]*>: tag kapanışına kadar
 * - (.*?): içerik (non-greedy), capture grubu 3
 * - <\/\1>: açılış tag'iyle eşleşen kapanış tag'i
 * - gi: global, case-insensitive
 */
export function extractTocItems(html: string): TocItem[] {
  const regex = /<(h[2-4])\s+id="([^"]*)"[^>]*>(.*?)<\/\1>/gi
  const items: TocItem[] = []
  let match: RegExpExecArray | null

  while ((match = regex.exec(html)) !== null) {
    const tag = match[1]!.toLowerCase()
    const id = match[2] ?? ''
    // Başlık içindeki nested HTML (örn. <strong>) temizlenir: /<[^>]*>/g
    const text = (match[3] ?? '').replace(/<[^>]*>/g, '')
    items.push({ id, text, level: parseInt(tag[1]!) })
  }

  return items
}
