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
