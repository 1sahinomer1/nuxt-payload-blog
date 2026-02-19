<script setup lang="ts">
import type { Media, Author } from '~/types'
import { renderRichText } from '~/utils/richtext'

const route = useRoute()
const slug = route.params.slug as string

const { getPostBySlug } = usePosts()
const { data, error } = await getPostBySlug(slug)

if (error.value || !data.value?.docs?.length) {
  throw createError({ statusCode: 404, message: 'Post not found' })
}

const post = computed(() => data.value!.docs[0]!)

const config = useRuntimeConfig()

const coverImage = computed(() => {
  if (!post.value.coverImage) return null
  if (typeof post.value.coverImage === 'string') return null
  const media = post.value.coverImage as Media
  const url = media.url?.startsWith('http') ? media.url : `${config.public.payloadUrl}${media.url}`
  return { url, alt: media.alt ?? post.value.title, width: media.width, height: media.height }
})

const author = computed(() => {
  if (!post.value.author || typeof post.value.author === 'string') return null
  return post.value.author as Author
})

const formattedDate = computed(() => {
  const date = post.value.publishedAt ?? post.value.createdAt
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const isoDate = computed(() => {
  const date = post.value.publishedAt ?? post.value.createdAt
  return new Date(date).toISOString()
})

const htmlContent = computed(() => renderRichText(post.value.content))

const canonicalUrl = computed(() => `${config.public.siteUrl}/blog/${post.value.slug}`)

useHead({
  title: `${post.value.title} — BlogCMS`,
  meta: [
    { name: 'description', content: post.value.excerpt ?? '' },
    { property: 'og:title', content: post.value.title },
    { property: 'og:description', content: post.value.excerpt ?? '' },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: canonicalUrl.value },
    ...(coverImage.value ? [{ property: 'og:image', content: coverImage.value.url }] : []),
    { property: 'article:published_time', content: isoDate.value },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: post.value.title },
    { name: 'twitter:description', content: post.value.excerpt ?? '' },
    ...(coverImage.value ? [{ name: 'twitter:image', content: coverImage.value.url }] : []),
  ],
  link: [
    { rel: 'canonical', href: canonicalUrl.value },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.value.title,
        description: post.value.excerpt ?? '',
        datePublished: isoDate.value,
        url: canonicalUrl.value,
        ...(coverImage.value ? { image: coverImage.value.url } : {}),
        ...(author.value ? {
          author: {
            '@type': 'Person',
            name: author.value.name,
          },
        } : {}),
      }),
    },
  ],
})
</script>

<template>
  <article class="pb-16">
    <header class="bg-gray-50 border-b border-gray-100">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <NuxtLink to="/blog" class="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
          &larr; Back to blog
        </NuxtLink>

        <h1 class="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
          {{ post.title }}
        </h1>

        <div class="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <time :datetime="isoDate">{{ formattedDate }}</time>
          <template v-if="author">
            <span aria-hidden="true">&middot;</span>
            <span>{{ author.name }}</span>
          </template>
        </div>

        <div v-if="post.tags?.length" class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="item in post.tags"
            :key="item.tag"
            class="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700"
          >
            {{ item.tag }}
          </span>
        </div>
      </div>
    </header>

    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <figure v-if="coverImage" class="mb-10">
        <img
          :src="coverImage.url"
          :alt="coverImage.alt"
          :width="coverImage.width ?? undefined"
          :height="coverImage.height ?? undefined"
          class="w-full rounded-xl object-cover"
          fetchpriority="high"
        />
      </figure>

      <div class="prose" v-html="htmlContent" />
    </div>
  </article>
</template>
