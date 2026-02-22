import type { Media } from '~/types'

export function resolveMediaUrl(url: string | undefined, payloadBaseUrl: string): string | null {
  if (!url) return null
  return url.startsWith('http') ? url : `${payloadBaseUrl}${url}`
}

export interface ResolvedImage {
  url: string
  alt: string
  width?: number
  height?: number
}

export function resolveCoverImage(
  coverImage: Media | string | undefined | null,
  fallbackAlt: string,
  payloadBaseUrl: string,
): ResolvedImage | null {
  if (!coverImage || typeof coverImage === 'string') return null
  const media = coverImage as Media
  const url = resolveMediaUrl(media.url, payloadBaseUrl)
  if (!url) return null
  return { url, alt: media.alt ?? fallbackAlt, width: media.width, height: media.height }
}
