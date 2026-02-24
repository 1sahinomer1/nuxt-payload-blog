<script setup lang="ts">
import { BLOG_META } from '~/constants/meta'

const route = useRoute()
const currentPage = computed(() => Number(route.query.page) || 1)

const { getPosts } = usePosts()
const { data, pending, error, refresh } = await getPosts(currentPage.value, 9)

watch(currentPage, () => refresh())

const config = useRuntimeConfig()

useHead({
  title: BLOG_META.title,
  meta: [
    { name: 'description', content: BLOG_META.description },
    { property: 'og:title', content: BLOG_META.title },
    { property: 'og:description', content: BLOG_META.description },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  link: [
    { rel: 'canonical', href: `${config.public.siteUrl}/blog` },
  ],
})
</script>

<template>
  <div>
    <section class="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 transition-colors">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Blog</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">All articles on technology, design, and modern web development.</p>
      </div>
    </section>

    <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div v-if="pending" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <PostCardSkeleton v-for="i in 9" :key="i" />
      </div>

      <ErrorState
        v-else-if="error"
        title="Could not load posts"
        description="Something went wrong while fetching. Please try again."
        @retry="refresh()"
      />

      <div v-else-if="data?.docs?.length" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <PostCard v-for="(post, i) in data.docs" :key="post.id" :post="post" :priority="i < 3" />
      </div>

      <EmptyState v-else icon="document" message="No posts published yet." />

      <nav
        v-if="!pending && !error && data && data.totalPages > 1"
        class="mt-12 flex items-center justify-center gap-2"
        aria-label="Pagination"
      >
        <NuxtLink
          v-if="data.hasPrevPage"
          :to="{ query: { page: data.prevPage } }"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          &larr; Previous
        </NuxtLink>
        <span class="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
          Page {{ data.page }} of {{ data.totalPages }}
        </span>
        <NuxtLink
          v-if="data.hasNextPage"
          :to="{ query: { page: data.nextPage } }"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Next &rarr;
        </NuxtLink>
      </nav>
    </section>
  </div>
</template>
