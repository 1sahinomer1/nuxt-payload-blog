<script setup lang="ts">
import { renderRichText } from '~/utils/richtext'
import { formatDate, toIsoDate, estimateReadingTime } from '~/utils/format'
import { resolveCoverImage } from '~/utils/media'
import { extractAuthor, getPostDate } from '~/utils/post'
import { extractTocItems } from '~/utils/toc'
import { SITE_NAME } from '~/constants/meta'

const route = useRoute()
const slug = route.params.slug as string

const { getPostBySlug } = usePosts()
const { data, pending, error, refresh } = await getPostBySlug(slug)

const post = computed(() => data.value?.docs?.[0] ?? null)

const config = useRuntimeConfig()

const coverImage = computed(() => {
  if (!post.value) return null
  return resolveCoverImage(post.value.coverImage, post.value.title, config.public.payloadUrl)
})

const author = computed(() => post.value ? extractAuthor(post.value) : null)

const formattedDate = computed(() => post.value ? formatDate(getPostDate(post.value)) : '')

const isoDate = computed(() => post.value ? toIsoDate(getPostDate(post.value)) : '')

const htmlContent = computed(() => {
  if (!post.value?.content) return ''
  return renderRichText(post.value.content)
})

const readingTime = computed(() => htmlContent.value ? estimateReadingTime(htmlContent.value) : 0)

const tocItems = computed(() => extractTocItems(htmlContent.value))

const canonicalUrl = computed(() => `${config.public.siteUrl}/blog/${slug}`)

watchEffect(() => {
  if (!pending.value && !error.value && post.value) {
    useHead({
      title: `${post.value.title} — ${SITE_NAME}`,
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
  <BlogPostSkeleton v-if="pending" />

  <ErrorState
    v-else-if="error"
    title="Could not load article"
    description="Something went wrong. Please try again."
    back-to="/blog"
    back-label="Back to blog"
    @retry="refresh()"
  />

  <NotFoundState
    v-else-if="!post"
    title="Post not found"
    description="The article you're looking for doesn't exist or has been removed."
    back-to="/blog"
    back-label="Back to blog"
    action-to="/blog"
    action-label="Browse all posts"
  />

  <article v-else class="pb-16">
    <ScrollProgress />

    <header class="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 transition-colors">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="flex items-center justify-between">
          <NuxtLink to="/blog" class="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
            &larr; Back to blog
          </NuxtLink>
          <ShareButtons :url="canonicalUrl" :title="post.title" />
        </div>

        <h1 class="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
          {{ post.title }}
        </h1>

        <div class="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <time :datetime="isoDate">{{ formattedDate }}</time>
          <template v-if="author">
            <span aria-hidden="true">&middot;</span>
            <span>{{ author.name }}</span>
          </template>
          <template v-if="readingTime">
            <span aria-hidden="true">&middot;</span>
            <span>{{ readingTime }} min read</span>
          </template>
        </div>

        <div v-if="post.tags?.length" class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="item in post.tags"
            :key="item.tag"
            class="inline-flex items-center rounded-full bg-primary-50 dark:bg-primary-950 px-3 py-1 text-xs font-medium text-primary-700 dark:text-primary-300"
          >
            {{ item.tag }}
          </span>
        </div>
      </div>
    </header>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <div class="grid grid-cols-1 xl:grid-cols-[1fr_220px] xl:gap-12">
        <div class="min-w-0">
          <figure v-if="coverImage" class="mb-10">
            <img
              :src="coverImage.url"
              :alt="coverImage.alt"
              :width="coverImage.width ?? undefined"
              :height="coverImage.height ?? undefined"
              class="w-full rounded-xl object-cover"
              fetchpriority="high"
              @error="(e) => (e.currentTarget!.src = '/placeholder-image.svg')"
            />
          </figure>

          <div class="prose max-w-4xl" v-html="htmlContent" />
        </div>

        <aside class="hidden xl:block shrink-0">
          <div class="sticky top-24">
            <TableOfContents :items="tocItems" />
          </div>
        </aside>
      </div>
    </div>
  </article>
</template>
