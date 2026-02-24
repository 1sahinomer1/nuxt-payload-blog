import { describe, it, expect } from 'vitest'
import { extractTocItems } from '../toc'

describe('extractTocItems', () => {
    it('returns empty array for empty string', () => {
        expect(extractTocItems('')).toEqual([])
    })

    it('returns empty array for HTML without headings', () => {
        expect(extractTocItems('<p>Just a paragraph</p>')).toEqual([])
    })

    it('extracts h2 headings', () => {
        const html = '<h2 id="intro">Introduction</h2>'
        const items = extractTocItems(html)
        expect(items).toEqual([{ id: 'intro', text: 'Introduction', level: 2 }])
    })

    it('extracts h3 headings', () => {
        const html = '<h3 id="sub">Subsection</h3>'
        const items = extractTocItems(html)
        expect(items).toEqual([{ id: 'sub', text: 'Subsection', level: 3 }])
    })

    it('extracts h4 headings', () => {
        const html = '<h4 id="deep">Deep Section</h4>'
        const items = extractTocItems(html)
        expect(items).toEqual([{ id: 'deep', text: 'Deep Section', level: 4 }])
    })

    it('does NOT extract h1 or h5 headings', () => {
        const html = '<h1 id="title">Title</h1><h5 id="tiny">Tiny</h5>'
        expect(extractTocItems(html)).toEqual([])
    })

    it('extracts multiple headings in order', () => {
        const html = '<h2 id="a">First</h2><h3 id="b">Second</h3><h2 id="c">Third</h2>'
        const items = extractTocItems(html)
        expect(items).toHaveLength(3)
        expect(items[0]!.id).toBe('a')
        expect(items[1]!.id).toBe('b')
        expect(items[2]!.id).toBe('c')
    })

    it('strips nested HTML from heading text', () => {
        const html = '<h2 id="x"><strong>Bold</strong> text</h2>'
        const items = extractTocItems(html)
        expect(items[0]!.text).toBe('Bold text')
    })

    it('ignores headings without id', () => {
        const html = '<h2>No ID</h2>'
        expect(extractTocItems(html)).toEqual([])
    })
})
