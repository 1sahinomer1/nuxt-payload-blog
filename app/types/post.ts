import type { Media } from './media'
import type { Author } from './author'
import type { LexicalContent } from './lexical'

export interface PostTag {
  tag: string
  id?: string
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  content?: LexicalContent
  coverImage?: Media | string
  publishedAt?: string
  tags?: PostTag[]
  author?: Author | string
  createdAt: string
  updatedAt: string
}
