export interface Media {
  id: string
  url: string
  alt?: string
  width?: number
  height?: number
  filename?: string
  mimeType?: string
}

export interface Author {
  id: string
  name: string
  bio?: string
  avatar?: Media | string
}

export interface PostTag {
  tag: string
  id?: string
}

export interface LexicalNode {
  type: string
  version: number
  children?: LexicalNode[]
  text?: string
  format?: number | string
  tag?: string
  listType?: string
  url?: string
  direction?: string
  indent?: number
  language?: string
  fields?: {
    url?: string
    newTab?: boolean
    linkType?: string
  }
}

export interface LexicalContent {
  root: LexicalNode
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

export interface PayloadResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}
