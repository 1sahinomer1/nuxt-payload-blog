export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function toIsoDate(dateString: string): string {
  return new Date(dateString).toISOString()
}

const WORDS_PER_MINUTE = 200

/**
 * Tahmini okuma süresini (dakika) hesaplar.
 * Regex açıklamaları:
 * - /<[^>]*>/g: Tüm HTML tag'lerini (<...>) tek boşlukla değiştirir. [^>]* = ">" hariç herhangi karakter.
 * - /\s+/g: Ardışık boşlukları (space, tab, newline) tek boşluğa indirger.
 */
export function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const wordCount = text.split(' ').filter(Boolean).length
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE))
}
