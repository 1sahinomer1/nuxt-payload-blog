import { describe, it, expect, vi } from 'vitest'
import { twitterShareUrl, linkedinShareUrl, copyToClipboard } from '../share'

describe('twitterShareUrl', () => {
    it('generates correct twitter intent URL', () => {
        const url = twitterShareUrl('https://example.com', 'Hello World')
        expect(url).toContain('https://twitter.com/intent/tweet?')
        expect(url).toContain('url=')
        expect(url).toContain('text=')
    })

    it('encodes special characters', () => {
        const url = twitterShareUrl('https://example.com/blog?q=1', 'A & B')
        expect(url).toContain(encodeURIComponent('https://example.com/blog?q=1'))
    })
})

describe('linkedinShareUrl', () => {
    it('generates correct linkedin share URL', () => {
        const url = linkedinShareUrl('https://example.com', 'My Post')
        expect(url).toContain('https://www.linkedin.com/shareArticle?')
        expect(url).toContain('mini=true')
        expect(url).toContain('url=')
        expect(url).toContain('title=')
    })
})

describe('copyToClipboard', () => {
    it('returns true on success', async () => {
        const writeText = vi.fn().mockResolvedValue(undefined)
        Object.defineProperty(navigator, 'clipboard', {
            value: { writeText },
            writable: true,
            configurable: true,
        })
        const result = await copyToClipboard('hello')
        expect(result).toBe(true)
        expect(writeText).toHaveBeenCalledWith('hello')
    })

    it('returns false on failure', async () => {
        const writeText = vi.fn().mockRejectedValue(new Error('fail'))
        Object.defineProperty(navigator, 'clipboard', {
            value: { writeText },
            writable: true,
            configurable: true,
        })
        const result = await copyToClipboard('hello')
        expect(result).toBe(false)
    })
})
