import type { LexicalNode, LexicalContent } from '~/types'
import { slugify } from '~/utils/slug'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function extractText(node: LexicalNode): string {
  if (node.type === 'text') return node.text ?? ''
  return (node.children ?? []).map(extractText).join('')
}

function applyTextFormat(text: string, format: number): string {
  let result = text
  if (format & 1) result = `<strong>${result}</strong>`
  if (format & 2) result = `<em>${result}</em>`
  if (format & 4) result = `<s>${result}</s>`
  if (format & 8) result = `<u>${result}</u>`
  if (format & 16) result = `<code>${result}</code>`
  return result
}

function renderNode(node: LexicalNode): string {
  if (node.type === 'text') {
    const escaped = escapeHtml(node.text ?? '')
    return typeof node.format === 'number' ? applyTextFormat(escaped, node.format) : escaped
  }

  if (node.type === 'linebreak') {
    return '<br />'
  }

  const children = (node.children ?? []).map(renderNode).join('')

  switch (node.type) {
    case 'root':
      return children
    case 'paragraph':
      return `<p>${children}</p>`
    case 'heading': {
      const tag = node.tag ?? 'h2'
      const id = slugify(extractText(node))
      return `<${tag} id="${id}">${children}</${tag}>`
    }
    case 'list':
      return node.listType === 'number'
        ? `<ol>${children}</ol>`
        : `<ul>${children}</ul>`
    case 'listitem':
      return `<li>${children}</li>`
    case 'quote':
      return `<blockquote>${children}</blockquote>`
    case 'link':
    case 'autolink': {
      const url = node.fields?.url ?? ''
      const target = node.fields?.newTab ? ' target="_blank" rel="noopener noreferrer"' : ''
      return `<a href="${escapeHtml(url)}"${target}>${children}</a>`
    }
    case 'code': {
      const lang = node.language ?? ''
      const langAttr = lang ? ` data-language="${escapeHtml(lang)}"` : ''
      return `<pre${langAttr}><code>${children}</code></pre>`
    }
    case 'horizontalrule':
      return '<hr />'
    default:
      return children
  }
}

export function renderRichText(content: LexicalContent | null | undefined): string {
  if (!content?.root) return ''
  return renderNode(content.root)
}
