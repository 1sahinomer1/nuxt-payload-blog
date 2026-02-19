<script setup lang="ts">
import type { Post, Media } from '~/types'

const props = defineProps<{
  post: Post
}>()

const coverUrl = computed(() => {
  if (!props.post.coverImage) return null
  if (typeof props.post.coverImage === 'string') return props.post.coverImage
  return (props.post.coverImage as Media).url ?? null
})

const coverAlt = computed(() => {
  if (!props.post.coverImage || typeof props.post.coverImage === 'string') return props.post.title
  return (props.post.coverImage as Media).alt ?? props.post.title
})

const formattedDate = computed(() => {
  const date = props.post.publishedAt ?? props.post.createdAt
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const authorName = computed(() => {
  if (!props.post.author) return null
  if (typeof props.post.author === 'string') return null
  return props.post.author.name
})

const config = useRuntimeConfig()
const resolvedCoverUrl = computed(() => {
  if (!coverUrl.value) return null
  if (coverUrl.value.startsWith('http')) return coverUrl.value
  return `${config.public.payloadUrl}${coverUrl.value}`
})
</script>

<template>
  <article class="group">
    <NuxtLink :to="`/blog/${post.slug}`" class="block">
      <div v-if="resolvedCoverUrl" class="aspect-[16/10] overflow-hidden rounded-xl bg-gray-100">
        <img
          :src="resolvedCoverUrl"
          :alt="coverAlt"
          class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div v-else class="aspect-[16/10] overflow-hidden rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
        <span class="text-primary-300 text-4xl font-bold">{{ post.title.charAt(0) }}</span>
      </div>
      <div class="mt-4">
        <div class="flex items-center gap-3 text-sm text-gray-500">
          <time :datetime="post.publishedAt ?? post.createdAt">{{ formattedDate }}</time>
          <span v-if="authorName" class="flex items-center gap-1">
            <span aria-hidden="true">&middot;</span>
            {{ authorName }}
          </span>
        </div>
        <h2 class="mt-2 text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors leading-snug">
          {{ post.title }}
        </h2>
        <p v-if="post.excerpt" class="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-2">
          {{ post.excerpt }}
        </p>
        <div v-if="post.tags?.length" class="mt-3 flex flex-wrap gap-2">
          <span
            v-for="item in post.tags"
            :key="item.tag"
            class="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700"
          >
            {{ item.tag }}
          </span>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>
