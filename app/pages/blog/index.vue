<script setup lang="ts">
const route = useRoute()
const currentPage = computed(() => Number(route.query.page) || 1)

const { getPosts } = usePosts()
const { data, pending, error, refresh } = await getPosts(currentPage.value, 9)

useHead({
  title: 'Blog — BlogCMS',
  meta: [
    { name: 'description', content: 'Browse all articles on technology, design, and modern web development.' },
    { property: 'og:title', content: 'Blog — BlogCMS' },
    { property: 'og:description', content: 'Browse all articles on technology, design, and modern web development.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
})

const config = useRuntimeConfig()

useHead({
  link: [
    { rel: 'canonical', href: `${config.public.siteUrl}/blog` },
  ],
})
</script>

<template>
  <div>
    <section class="bg-gray-50 border-b border-gray-100">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">Blog</h1>
        <p class="mt-2 text-gray-600">All articles on technology, design, and modern web development.</p>
      </div>
    </section>

    <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Skeleton Loading -->
      <div v-if="pending" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <PostCardSkeleton v-for="i in 9" :key="i" />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-16">
        <div class="mx-auto w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        </div>
        <p class="text-gray-700 font-medium text-lg">Could not load posts</p>
        <p class="mt-1 text-gray-500 text-sm">Something went wrong while fetching. Please try again.</p>
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

      <!-- Posts Grid -->
      <div v-else-if="data?.docs?.length" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <PostCard v-for="post in data.docs" :key="post.id" :post="post" />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <div class="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
          </svg>
        </div>
        <p class="text-gray-500 text-lg">No posts published yet.</p>
      </div>

      <!-- Pagination -->
      <nav
        v-if="!pending && !error && data && data.totalPages > 1"
        class="mt-12 flex items-center justify-center gap-2"
        aria-label="Pagination"
      >
        <NuxtLink
          v-if="data.hasPrevPage"
          :to="{ query: { page: data.prevPage } }"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          &larr; Previous
        </NuxtLink>
        <span class="px-4 py-2 text-sm text-gray-500">
          Page {{ data.page }} of {{ data.totalPages }}
        </span>
        <NuxtLink
          v-if="data.hasNextPage"
          :to="{ query: { page: data.nextPage } }"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Next &rarr;
        </NuxtLink>
      </nav>
    </section>
  </div>
</template>
