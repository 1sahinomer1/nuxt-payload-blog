import { getPayload } from 'payload'
import config from '../payload.config'

async function seed() {
  const payload = await getPayload({ config })

  console.log('Seeding database...')

  const existingUsers = await payload.find({ collection: 'users', limit: 1 })
  if (existingUsers.docs.length === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@example.com',
        password: 'changeme123',
      },
    })
    console.log('Created admin user: admin@example.com / changeme123')
  }

  const existingAuthors = await payload.find({ collection: 'authors', limit: 1 })
  let authorId: number | string

  if (existingAuthors.docs.length > 0) {
    authorId = existingAuthors.docs[0]!.id
    console.log('Author already exists, skipping.')
  } else {
    const author = await payload.create({
      collection: 'authors',
      data: {
        name: 'Alex Morgan',
        bio: 'Full-stack developer and technical writer. Passionate about modern web technologies and sharing knowledge with the community.',
      },
    })
    authorId = author.id
    console.log('Created author: Alex Morgan')
  }

  const existingPosts = await payload.find({ collection: 'posts', limit: 1 })
  if (existingPosts.docs.length > 0) {
    console.log('Posts already exist, skipping.')
    process.exit(0)
  }

  const posts = [
    {
      title: 'Getting Started with Nuxt 4',
      slug: 'getting-started-with-nuxt-4',
      excerpt: 'Nuxt 4 brings a new app directory structure, improved performance, and a better developer experience. Learn how to get started.',
      publishedAt: '2025-12-01T10:00:00.000Z',
      tags: [{ tag: 'Nuxt' }, { tag: 'Vue' }, { tag: 'SSR' }],
      content: {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'heading',
              format: '',
              indent: 0,
              version: 1,
              tag: 'h2',
              children: [{ type: 'text', format: 0, text: 'Why Nuxt 4?', version: 1, mode: 'normal', detail: 0, style: '' }],
              direction: 'ltr',
            },
            {
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              children: [{ type: 'text', format: 0, text: 'Nuxt 4 represents a major step forward for the Vue ecosystem. With its new app directory structure, developers can organize their projects more intuitively while taking advantage of improved server-side rendering capabilities.', version: 1, mode: 'normal', detail: 0, style: '' }],
              direction: 'ltr',
              textFormat: 0,
            },
            {
              type: 'heading',
              format: '',
              indent: 0,
              version: 1,
              tag: 'h2',
              children: [{ type: 'text', format: 0, text: 'Key Features', version: 1, mode: 'normal', detail: 0, style: '' }],
              direction: 'ltr',
            },
            {
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              children: [
                { type: 'text', format: 0, text: 'The new ', version: 1, mode: 'normal', detail: 0, style: '' },
                { type: 'text', format: 16, text: 'app/', version: 1, mode: 'normal', detail: 0, style: '' },
                { type: 'text', format: 0, text: ' directory replaces the previous root-level structure, providing cleaner separation between application code and configuration. Combined with Vue 3.5 reactivity improvements, Nuxt 4 delivers a faster, more efficient development experience.', version: 1, mode: 'normal', detail: 0, style: '' },
              ],
              direction: 'ltr',
              textFormat: 0,
            },
            {
              type: 'heading',
              format: '',
              indent: 0,
              version: 1,
              tag: 'h2',
              children: [{ type: 'text', format: 0, text: 'Getting Started', version: 1, mode: 'normal', detail: 0, style: '' }],
              direction: 'ltr',
            },
            {
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              children: [{ type: 'text', format: 0, text: 'To create a new Nuxt 4 project, you can use the Nuxi CLI. The setup process is straightforward and gets you up and running in minutes with TypeScript, Tailwind CSS, and ESLint preconfigured.', version: 1, mode: 'normal', detail: 0, style: '' }],
              direction: 'ltr',
              textFormat: 0,
            },
          ],
          direction: 'ltr',
        },
      },
    },
    {
      title: 'Building a Headless CMS with Payload',
      slug: 'building-headless-cms-with-payload',
      excerpt: 'Payload CMS 3 is a powerful, code-first headless CMS built on Next.js. Discover how to set up collections, manage content, and build APIs.',
      publishedAt: '2025-12-15T10:00:00.000Z',
      tags: [{ tag: 'Payload CMS' }, { tag: 'Headless CMS' }, { tag: 'API' }],
      content: {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'heading',
              format: '',
              indent: 0,
              version: 1,
              tag: 'h2',
              children: [{ type: 'text', format: 0, text: 'What is Payload CMS?', version: 1, mode: 'normal', detail: 0, style: '' }],
              direction: 'ltr',
            },
            {
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              children: [{ type: 'text', format: 0, text: 'Payload is an open-source, code-first headless CMS that gives developers full control over their content architecture. Unlike traditional CMS platforms, Payload lets you define your schema in TypeScript, providing type safety from the database to the front-end.', version: 1, mode: 'normal', detail: 0, style: '' }],
              direction: 'ltr',
              textFormat: 0,
            },
            {
              type: 'heading',
              format: '',
              indent: 0,
              version: 1,
              tag: 'h2',
              children: [{ type: 'text', format: 0, text: 'Defining Collections', version: 1, mode: 'normal', detail: 0, style: '' }],
              direction: 'ltr',
            },
            {
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              children: [
                { type: 'text', format: 0, text: 'Collections in Payload are defined using simple JavaScript objects. Each collection defines its fields, access control, hooks, and admin configuration. The ', version: 1, mode: 'normal', detail: 0, style: '' },
                { type: 'text', format: 1, text: 'code-first approach', version: 1, mode: 'normal', detail: 0, style: '' },
                { type: 'text', format: 0, text: ' means your content model lives right alongside your application code.', version: 1, mode: 'normal', detail: 0, style: '' },
              ],
              direction: 'ltr',
              textFormat: 0,
            },
            {
              type: 'heading',
              format: '',
              indent: 0,
              version: 1,
              tag: 'h2',
              children: [{ type: 'text', format: 0, text: 'REST API Out of the Box', version: 1, mode: 'normal', detail: 0, style: '' }],
              direction: 'ltr',
            },
            {
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              children: [{ type: 'text', format: 0, text: 'Payload automatically generates a full REST API for every collection you define. This means you can immediately start fetching content from any front-end framework, including Nuxt, React, or even a mobile app.', version: 1, mode: 'normal', detail: 0, style: '' }],
              direction: 'ltr',
              textFormat: 0,
            },
          ],
          direction: 'ltr',
        },
      },
    },
    {
      title: 'Modern CSS with Tailwind v4',
      slug: 'modern-css-with-tailwind-v4',
      excerpt: 'Tailwind CSS v4 introduces a new engine, CSS-first configuration, and dramatically improved performance. Here is what you need to know.',
      publishedAt: '2026-01-05T10:00:00.000Z',
      tags: [{ tag: 'CSS' }, { tag: 'Tailwind' }, { tag: 'Design' }],
      content: {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'heading',
              format: '',
              indent: 0,
              version: 1,
              tag: 'h2',
              children: [{ type: 'text', format: 0, text: 'A New Engine', version: 1, mode: 'normal', detail: 0, style: '' }],
              direction: 'ltr',
            },
            {
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              children: [{ type: 'text', format: 0, text: 'Tailwind CSS v4 has been rebuilt from the ground up with a new high-performance engine written in Rust. This results in significantly faster build times and a smaller CSS output. The new engine also supports CSS-first configuration, meaning you can configure your design system directly in CSS.', version: 1, mode: 'normal', detail: 0, style: '' }],
              direction: 'ltr',
              textFormat: 0,
            },
            {
              type: 'heading',
              format: '',
              indent: 0,
              version: 1,
              tag: 'h2',
              children: [{ type: 'text', format: 0, text: 'CSS-first Configuration', version: 1, mode: 'normal', detail: 0, style: '' }],
              direction: 'ltr',
            },
            {
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              children: [
                { type: 'text', format: 0, text: 'Instead of a ', version: 1, mode: 'normal', detail: 0, style: '' },
                { type: 'text', format: 16, text: 'tailwind.config.js', version: 1, mode: 'normal', detail: 0, style: '' },
                { type: 'text', format: 0, text: ' file, you now use the ', version: 1, mode: 'normal', detail: 0, style: '' },
                { type: 'text', format: 16, text: '@theme', version: 1, mode: 'normal', detail: 0, style: '' },
                { type: 'text', format: 0, text: ' directive directly in your CSS. This makes it easier to see your design tokens and reduces configuration overhead.', version: 1, mode: 'normal', detail: 0, style: '' },
              ],
              direction: 'ltr',
              textFormat: 0,
            },
            {
              type: 'heading',
              format: '',
              indent: 0,
              version: 1,
              tag: 'h2',
              children: [{ type: 'text', format: 0, text: 'Composable Variants', version: 1, mode: 'normal', detail: 0, style: '' }],
              direction: 'ltr',
            },
            {
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              children: [{ type: 'text', format: 0, text: 'Tailwind v4 introduces composable variants that let you combine utility classes in more powerful ways. Combined with the new @theme directive and improved color system, it is the most flexible version of Tailwind yet.', version: 1, mode: 'normal', detail: 0, style: '' }],
              direction: 'ltr',
              textFormat: 0,
            },
          ],
          direction: 'ltr',
        },
      },
    },
  ]

  for (const postData of posts) {
    await payload.create({
      collection: 'posts',
      data: {
        ...postData,
        author: authorId,
      } as any,
    })
    console.log(`Created post: ${postData.title}`)
  }

  console.log('Seeding complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
