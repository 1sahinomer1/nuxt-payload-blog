import { defineEventHandler } from 'h3'

interface SitemapPost {
  slug: string
  updatedAt: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl || 'http://localhost:3000'
  const payloadUrl = config.public.payloadUrl || 'http://localhost:3001'

  let posts: SitemapPost[] = []

  try {
    const response = await $fetch<{ docs: SitemapPost[] }>(`${payloadUrl}/api/posts`, {
      params: { limit: 1000, depth: 0 },
    })
    posts = response.docs
  } catch {
    posts = []
  }

  interface SitemapUrl {
    loc: string
    changefreq: string
    priority: string
    lastmod?: string
  }

  const urls: SitemapUrl[] = [
    { loc: siteUrl, changefreq: 'daily', priority: '1.0' },
    { loc: `${siteUrl}/blog`, changefreq: 'daily', priority: '0.9' },
    ...posts.map((post) => ({
      loc: `${siteUrl}/blog/${post.slug}`,
      lastmod: post.updatedAt?.split('T')[0],
      changefreq: 'weekly',
      priority: '0.8',
    })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`

  event.node.res.setHeader('content-type', 'application/xml')
  return xml
})
