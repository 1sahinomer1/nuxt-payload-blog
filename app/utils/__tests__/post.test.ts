import { describe, it, expect } from 'vitest'
import { extractAuthor, extractAuthorName, getPostDate } from '../post'
import type { Post, Author } from '~/types'

function makePost(overrides: Partial<Post> = {}): Post {
    return {
        id: '1',
        title: 'Test Post',
        slug: 'test-post',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-02T00:00:00Z',
        ...overrides,
    }
}

const mockAuthor: Author = { id: 'a1', name: 'Jane Doe' }

describe('extractAuthor', () => {
    it('returns null when author is undefined', () => {
        expect(extractAuthor(makePost())).toBeNull()
    })

    it('returns null when author is a string (unresolved)', () => {
        expect(extractAuthor(makePost({ author: 'author-id' }))).toBeNull()
    })

    it('returns the author object when populated', () => {
        expect(extractAuthor(makePost({ author: mockAuthor }))).toEqual(mockAuthor)
    })
})

describe('extractAuthorName', () => {
    it('returns null when no author', () => {
        expect(extractAuthorName(makePost())).toBeNull()
    })

    it('returns null for string author', () => {
        expect(extractAuthorName(makePost({ author: 'author-id' }))).toBeNull()
    })

    it('returns author name when populated', () => {
        expect(extractAuthorName(makePost({ author: mockAuthor }))).toBe('Jane Doe')
    })
})

describe('getPostDate', () => {
    it('returns publishedAt when available', () => {
        const post = makePost({ publishedAt: '2025-06-15T10:00:00Z' })
        expect(getPostDate(post)).toBe('2025-06-15T10:00:00Z')
    })

    it('falls back to createdAt when publishedAt is undefined', () => {
        const post = makePost()
        expect(getPostDate(post)).toBe('2025-01-01T00:00:00Z')
    })
})
