<script setup lang="ts">
import { HOME_META } from '~/constants/meta'

const { getPosts } = usePosts()
const { data, pending, error, refresh } = await getPosts(1, 3)

useHead({
  title: HOME_META.title,
  meta: [
    { name: 'description', content: HOME_META.description },
    { property: 'og:title', content: HOME_META.title },
    { property: 'og:description', content: HOME_META.description },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: HOME_META.title },
    { name: 'twitter:description', content: HOME_META.description },
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

      <div v-if="pending" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <PostCardSkeleton v-for="i in 3" :key="i" />
      </div>

      <ErrorState
        v-else-if="error"
        title="Could not load latest posts"
        @retry="refresh()"
      />

      <div v-else-if="data?.docs?.length" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <PostCard v-for="post in data.docs" :key="post.id" :post="post" />
      </div>

      <div v-else class="text-center py-12">
        <p class="text-gray-500">No posts yet. Start by adding content in the CMS.</p>
      </div>
    </section>
  </div>
</template>
