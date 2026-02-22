import type { Post, Author } from '~/types'

export function extractAuthor(post: Post): Author | null {
  if (!post.author || typeof post.author === 'string') return null
  return post.author as Author
}

export function extractAuthorName(post: Post): string | null {
  const author = extractAuthor(post)
  return author?.name ?? null
}

export function getPostDate(post: Post): string {
  return post.publishedAt ?? post.createdAt
}
