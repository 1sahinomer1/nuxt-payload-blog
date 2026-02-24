import { describe, it, expect } from 'vitest'
import { resolveMediaUrl, resolveCoverImage } from '../media'
import type { Media } from '~/types'

describe('resolveMediaUrl', () => {
    it('returns null for undefined url', () => {
        expect(resolveMediaUrl(undefined, 'http://cms.test')).toBeNull()
    })

    it('returns null for empty string url', () => {
        expect(resolveMediaUrl('', 'http://cms.test')).toBeNull()
    })

    it('returns absolute url as-is', () => {
        expect(resolveMediaUrl('https://cdn.example.com/img.jpg', 'http://cms.test')).toBe('https://cdn.example.com/img.jpg')
    })

    it('prepends base url for relative paths', () => {
        expect(resolveMediaUrl('/media/img.jpg', 'http://cms.test')).toBe('http://cms.test/media/img.jpg')
    })

    it('handles http urls', () => {
        expect(resolveMediaUrl('http://other.com/img.jpg', 'http://cms.test')).toBe('http://other.com/img.jpg')
    })
})

describe('resolveCoverImage', () => {
    const base = 'http://cms.test'

    it('returns null for undefined cover', () => {
        expect(resolveCoverImage(undefined, 'fallback', base)).toBeNull()
    })

    it('returns null for null cover', () => {
        expect(resolveCoverImage(null, 'fallback', base)).toBeNull()
    })

    it('returns null for string cover (unresolved relation)', () => {
        expect(resolveCoverImage('some-id', 'fallback', base)).toBeNull()
    })

    it('resolves media object with relative url', () => {
        const media: Media = { id: '1', url: '/media/hero.jpg', alt: 'Hero' }
        const result = resolveCoverImage(media, 'Fallback Alt', base)
        expect(result).toEqual({
            url: 'http://cms.test/media/hero.jpg',
            alt: 'Hero',
            width: undefined,
            height: undefined,
        })
    })

    it('uses fallback alt when media alt is undefined', () => {
        const media: Media = { id: '1', url: '/media/hero.jpg' }
        const result = resolveCoverImage(media, 'My Fallback', base)
        expect(result!.alt).toBe('My Fallback')
    })

    it('preserves width and height', () => {
        const media: Media = { id: '1', url: '/media/hero.jpg', alt: 'Test', width: 1200, height: 630 }
        const result = resolveCoverImage(media, 'fallback', base)
        expect(result!.width).toBe(1200)
        expect(result!.height).toBe(630)
    })

    it('returns null when media url is empty', () => {
        const media: Media = { id: '1', url: '' }
        expect(resolveCoverImage(media, 'fallback', base)).toBeNull()
    })
})
