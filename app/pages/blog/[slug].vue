<script setup lang="ts">
import type { Media, Author } from '~/types'
import { renderRichText } from '~/utils/richtext'

const route = useRoute()
const slug = route.params.slug as string

const { getPostBySlug } = usePosts()
const { data, pending, error, refresh } = await getPostBySlug(slug)

const post = computed(() => data.value?.docs?.[0] ?? null)

const config = useRuntimeConfig()

const coverImage = computed(() => {
  if (!post.value?.coverImage) return null
  if (typeof post.value.coverImage === 'string') return null
  const media = post.value.coverImage as Media
  const url = media.url?.startsWith('http') ? media.url : `${config.public.payloadUrl}${media.url}`
  return { url, alt: media.alt ?? post.value.title, width: media.width, height: media.height }
})

const author = computed(() => {
  if (!post.value?.author || typeof post.value.author === 'string') return null
  return post.value.author as Author
})

const formattedDate = computed(() => {
  if (!post.value) return ''
  const date = post.value.publishedAt ?? post.value.createdAt
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const isoDate = computed(() => {
  if (!post.value) return ''
  const date = post.value.publishedAt ?? post.value.createdAt
  return new Date(date).toISOString()
})

const htmlContent = computed(() => {
  if (!post.value?.content) return ''
  return renderRichText(post.value.content)
})

const canonicalUrl = computed(() => `${config.public.siteUrl}/blog/${slug}`)

watchEffect(() => {
  if (!pending.value && !error.value && post.value) {
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
  }
})
</script>

<template>
  <!-- Skeleton Loading -->
  <article v-if="pending" class="pb-16 animate-pulse">
    <header class="bg-gray-50 border-b border-gray-100">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="h-4 w-24 rounded bg-gray-200" />
        <div class="mt-6 space-y-3">
          <div class="h-9 w-full rounded bg-gray-200" />
          <div class="h-9 w-2/3 rounded bg-gray-200" />
        </div>
        <div class="mt-4 flex items-center gap-4">
          <div class="h-3.5 w-28 rounded bg-gray-200" />
          <div class="h-3.5 w-20 rounded bg-gray-200" />
        </div>
        <div class="mt-4 flex gap-2">
          <div class="h-6 w-16 rounded-full bg-gray-200" />
          <div class="h-6 w-20 rounded-full bg-gray-200" />
        </div>
      </div>
    </header>
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <div class="aspect-[16/9] w-full rounded-xl bg-gray-200 mb-10" />
      <div class="space-y-4">
        <div class="h-4 w-full rounded bg-gray-200" />
        <div class="h-4 w-full rounded bg-gray-200" />
        <div class="h-4 w-5/6 rounded bg-gray-200" />
        <div class="h-4 w-full rounded bg-gray-200" />
        <div class="h-4 w-4/6 rounded bg-gray-200" />
        <div class="h-8 w-0" />
        <div class="h-4 w-full rounded bg-gray-200" />
        <div class="h-4 w-full rounded bg-gray-200" />
        <div class="h-4 w-3/4 rounded bg-gray-200" />
      </div>
    </div>
  </article>

  <!-- Error State -->
  <div v-else-if="error" class="pb-16">
    <header class="bg-gray-50 border-b border-gray-100">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <NuxtLink to="/blog" class="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
          &larr; Back to blog
        </NuxtLink>
      </div>
    </header>
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div class="mx-auto w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
      </div>
      <p class="text-gray-700 font-medium text-lg">Could not load article</p>
      <p class="mt-1 text-gray-500 text-sm">Something went wrong. Please try again.</p>
      <button
        class="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
        @click="refresh()"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
        </svg>
        Try Again
      </button>
    </div>
  </div>

  <!-- 404 State -->
  <div v-else-if="!post" class="pb-16">
    <header class="bg-gray-50 border-b border-gray-100">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <NuxtLink to="/blog" class="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
          &larr; Back to blog
        </NuxtLink>
      </div>
    </header>
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div class="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </div>
      <p class="text-gray-700 font-medium text-lg">Post not found</p>
      <p class="mt-1 text-gray-500 text-sm">The article you're looking for doesn't exist or has been removed.</p>
      <NuxtLink
        to="/blog"
        class="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
      >
        Browse all posts
      </NuxtLink>
    </div>
  </div>

  <!-- Post Content -->
  <article v-else class="pb-16">
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
