<script setup lang="ts">
const route = useRoute()
const currentPage = computed(() => Number(route.query.page) || 1)

const { getPosts } = usePosts()
const { data } = await getPosts(currentPage.value, 9)

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
      <div v-if="data?.docs?.length" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <PostCard v-for="post in data.docs" :key="post.id" :post="post" />
      </div>

      <div v-else class="text-center py-16">
        <p class="text-gray-500 text-lg">No posts published yet.</p>
      </div>

      <nav
        v-if="data && data.totalPages > 1"
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
