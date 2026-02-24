import { describe, it, expect } from 'vitest'
import { renderRichText } from '../richtext'
import type { LexicalContent } from '~/types'

function makeContent(children: any[]): LexicalContent {
    return { root: { type: 'root', version: 1, children } }
}

describe('renderRichText', () => {
    it('returns empty string for null input', () => {
        expect(renderRichText(null)).toBe('')
    })

    it('returns empty string for undefined input', () => {
        expect(renderRichText(undefined)).toBe('')
    })

    it('returns empty string for content without root', () => {
        expect(renderRichText({} as any)).toBe('')
    })

    it('renders a paragraph with text', () => {
        const content = makeContent([
            { type: 'paragraph', version: 1, children: [{ type: 'text', version: 1, text: 'Hello world' }] },
        ])
        expect(renderRichText(content)).toBe('<p>Hello world</p>')
    })

    it('escapes HTML in text nodes', () => {
        const content = makeContent([
            { type: 'paragraph', version: 1, children: [{ type: 'text', version: 1, text: '<script>alert("xss")</script>' }] },
        ])
        const result = renderRichText(content)
        expect(result).not.toContain('<script>')
        expect(result).toContain('&lt;script&gt;')
    })

    it('applies bold formatting', () => {
        const content = makeContent([
            { type: 'paragraph', version: 1, children: [{ type: 'text', version: 1, text: 'bold', format: 1 }] },
        ])
        expect(renderRichText(content)).toBe('<p><strong>bold</strong></p>')
    })

    it('applies italic formatting', () => {
        const content = makeContent([
            { type: 'paragraph', version: 1, children: [{ type: 'text', version: 1, text: 'italic', format: 2 }] },
        ])
        expect(renderRichText(content)).toBe('<p><em>italic</em></p>')
    })

    it('applies combined formatting (bold + italic)', () => {
        const content = makeContent([
            { type: 'paragraph', version: 1, children: [{ type: 'text', version: 1, text: 'both', format: 3 }] },
        ])
        const result = renderRichText(content)
        expect(result).toContain('<strong>')
        expect(result).toContain('<em>')
    })

    it('applies code formatting', () => {
        const content = makeContent([
            { type: 'paragraph', version: 1, children: [{ type: 'text', version: 1, text: 'code', format: 16 }] },
        ])
        expect(renderRichText(content)).toBe('<p><code>code</code></p>')
    })

    it('renders headings with id attributes', () => {
        const content = makeContent([
            { type: 'heading', version: 1, tag: 'h2', children: [{ type: 'text', version: 1, text: 'My Heading' }] },
        ])
        const result = renderRichText(content)
        expect(result).toBe('<h2 id="my-heading">My Heading</h2>')
    })

    it('renders unordered lists', () => {
        const content = makeContent([
            {
                type: 'list', version: 1, listType: 'bullet', children: [
                    { type: 'listitem', version: 1, children: [{ type: 'text', version: 1, text: 'Item 1' }] },
                    { type: 'listitem', version: 1, children: [{ type: 'text', version: 1, text: 'Item 2' }] },
                ],
            },
        ])
        const result = renderRichText(content)
        expect(result).toBe('<ul><li>Item 1</li><li>Item 2</li></ul>')
    })

    it('renders ordered lists', () => {
        const content = makeContent([
            {
                type: 'list', version: 1, listType: 'number', children: [
                    { type: 'listitem', version: 1, children: [{ type: 'text', version: 1, text: 'First' }] },
                ],
            },
        ])
        expect(renderRichText(content)).toContain('<ol>')
    })

    it('renders blockquotes', () => {
        const content = makeContent([
            { type: 'quote', version: 1, children: [{ type: 'text', version: 1, text: 'A quote' }] },
        ])
        expect(renderRichText(content)).toBe('<blockquote>A quote</blockquote>')
    })

    it('renders links with href', () => {
        const content = makeContent([
            {
                type: 'link', version: 1, fields: { url: 'https://example.com' },
                children: [{ type: 'text', version: 1, text: 'Click me' }],
            },
        ])
        const result = renderRichText(content)
        expect(result).toContain('href="https://example.com"')
        expect(result).toContain('Click me')
    })

    it('renders links with target _blank and rel', () => {
        const content = makeContent([
            {
                type: 'link', version: 1, fields: { url: 'https://example.com', newTab: true },
                children: [{ type: 'text', version: 1, text: 'External' }],
            },
        ])
        const result = renderRichText(content)
        expect(result).toContain('target="_blank"')
        expect(result).toContain('rel="noopener noreferrer"')
    })

    it('renders code blocks with language attribute', () => {
        const content = makeContent([
            {
                type: 'code', version: 1, language: 'javascript',
                children: [{ type: 'text', version: 1, text: 'const x = 1' }],
            },
        ])
        const result = renderRichText(content)
        expect(result).toContain('data-language="javascript"')
        expect(result).toContain('<pre')
        expect(result).toContain('<code>')
    })

    it('renders horizontal rules', () => {
        const content = makeContent([
            { type: 'horizontalrule', version: 1 },
        ])
        expect(renderRichText(content)).toBe('<hr />')
    })

    it('renders linebreaks', () => {
        const content = makeContent([
            {
                type: 'paragraph', version: 1, children: [
                    { type: 'text', version: 1, text: 'Line 1' },
                    { type: 'linebreak', version: 1 },
                    { type: 'text', version: 1, text: 'Line 2' },
                ],
            },
        ])
        expect(renderRichText(content)).toContain('<br />')
    })

    it('handles unknown node types gracefully', () => {
        const content = makeContent([
            { type: 'unknown-node', version: 1, children: [{ type: 'text', version: 1, text: 'fallback' }] },
        ])
        expect(renderRichText(content)).toBe('fallback')
    })
})
