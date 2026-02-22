export function twitterShareUrl(url: string, text: string): string {
  const params = new URLSearchParams({ url, text })
  return `https://twitter.com/intent/tweet?${params}`
}

export function linkedinShareUrl(url: string, title: string): string {
  const params = new URLSearchParams({ mini: 'true', url, title })
  return `https://www.linkedin.com/shareArticle?${params}`
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
