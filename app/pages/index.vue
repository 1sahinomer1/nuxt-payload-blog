<script setup lang="ts">
const { getPosts } = usePosts()
const { data, pending, error, refresh } = await getPosts(1, 3)

useHead({
  title: 'BlogCMS — Insights & Ideas',
  meta: [
    { name: 'description', content: 'Explore our latest articles on technology, design, and modern web development.' },
    { property: 'og:title', content: 'BlogCMS — Insights & Ideas' },
    { property: 'og:description', content: 'Explore our latest articles on technology, design, and modern web development.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'BlogCMS — Insights & Ideas' },
    { name: 'twitter:description', content: 'Explore our latest articles on technology, design, and modern web development.' },
  ],
})
</script>

<template>
  <div>
    <HeroSection />

    <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="flex items-center justify-between mb-10">
        <h2 class="text-2xl font-bold tracking-tight text-gray-900">Latest Posts</h2>
        <NuxtLink
          to="/blog"
          class="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          View all &rarr;
        </NuxtLink>
      </div>

      <!-- Skeleton Loading -->
      <div v-if="pending" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <PostCardSkeleton v-for="i in 3" :key="i" />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-gray-700 font-medium">Could not load latest posts</p>
        <button
          class="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
          @click="refresh()"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
          </svg>
          Try Again
        </button>
      </div>

      <!-- Posts -->
      <div v-else-if="data?.docs?.length" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <PostCard v-for="post in data.docs" :key="post.id" :post="post" />
      </div>

      <!-- Empty -->
      <div v-else class="text-center py-12">
        <p class="text-gray-500">No posts yet. Start by adding content in the CMS.</p>
      </div>
    </section>
  </div>
</template>
