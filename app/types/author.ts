import type { Media } from './media'

export interface Author {
  id: string
  name: string
  bio?: string
  avatar?: Media | string
}
