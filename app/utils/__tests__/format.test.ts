import { describe, it, expect } from 'vitest'
import { formatDate, toIsoDate, estimateReadingTime } from '../format'

describe('formatDate', () => {
    it('formats a date string to US locale', () => {
        const result = formatDate('2025-06-15T10:00:00Z')
        expect(result).toBe('June 15, 2025')
    })

    it('handles ISO date strings', () => {
        const result = formatDate('2024-01-01T00:00:00.000Z')
        expect(result).toContain('2024')
        expect(result).toContain('January')
    })
})

describe('toIsoDate', () => {
    it('converts date string to ISO format', () => {
        const result = toIsoDate('2025-06-15T10:00:00Z')
        expect(result).toBe('2025-06-15T10:00:00.000Z')
    })

    it('returns valid ISO string', () => {
        const result = toIsoDate('2024-12-25')
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    })
})

describe('estimateReadingTime', () => {
    it('returns 1 for very short content', () => {
        expect(estimateReadingTime('hello')).toBe(1)
    })

    it('returns 1 for empty string', () => {
        expect(estimateReadingTime('')).toBe(1)
    })

    it('strips HTML tags before counting', () => {
        const html = '<p>word</p>'.repeat(200)
        const result = estimateReadingTime(html)
        expect(result).toBe(1) // 200 words / 200 WPM = 1
    })

    it('calculates correct reading time for longer content', () => {
        const words = Array(600).fill('word').join(' ')
        const html = `<p>${words}</p>`
        const result = estimateReadingTime(html)
        expect(result).toBe(3) // 600 / 200 = 3
    })

    it('handles nested HTML tags', () => {
        const html = '<div><p><strong>hello</strong> <em>world</em></p></div>'
        const result = estimateReadingTime(html)
        expect(result).toBe(1)
    })
})
