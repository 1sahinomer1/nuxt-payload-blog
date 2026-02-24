import { describe, it, expect } from 'vitest'
import { slugify } from '../slug'

describe('slugify', () => {
    it('converts text to lowercase', () => {
        expect(slugify('Hello World')).toBe('hello-world')
    })

    it('replaces spaces with hyphens', () => {
        expect(slugify('foo bar baz')).toBe('foo-bar-baz')
    })

    it('removes special characters', () => {
        expect(slugify('Hello! @World#')).toBe('hello-world')
    })

    it('collapses multiple hyphens', () => {
        expect(slugify('foo---bar')).toBe('foo-bar')
    })

    it('trims leading and trailing hyphens', () => {
        expect(slugify('-hello-world-')).toBe('hello-world')
    })

    it('handles empty string', () => {
        expect(slugify('')).toBe('')
    })

    it('handles multiple spaces', () => {
        expect(slugify('foo   bar')).toBe('foo-bar')
    })

    it('removes non-latin characters', () => {
        expect(slugify('über cool')).toBe('ber-cool')
    })
})
