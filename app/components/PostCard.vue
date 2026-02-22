<script setup lang="ts">
import type { Post } from '~/types'
import { formatDate } from '~/utils/format'
import { resolveCoverImage } from '~/utils/media'
import { extractAuthorName, getPostDate } from '~/utils/post'

const props = defineProps<{
  post: Post
}>()

const config = useRuntimeConfig()

const cover = computed(() =>
  resolveCoverImage(props.post.coverImage, props.post.title, config.public.payloadUrl),
)

const formattedDate = computed(() => formatDate(getPostDate(props.post)))

const authorName = computed(() => extractAuthorName(props.post))
</script>

<template>
  <article class="group">
    <NuxtLink :to="`/blog/${post.slug}`" class="block">
      <div v-if="cover" class="aspect-[16/10] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
        <img
          :src="cover.url"
          :alt="cover.alt"
          class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div v-else class="aspect-[16/10] overflow-hidden rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900 dark:to-primary-950 flex items-center justify-center">
        <span class="text-primary-300 dark:text-primary-600 text-4xl font-bold">{{ post.title.charAt(0) }}</span>
      </div>
      <div class="mt-4">
        <div class="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <time :datetime="post.publishedAt ?? post.createdAt">{{ formattedDate }}</time>
          <span v-if="authorName" class="flex items-center gap-1">
            <span aria-hidden="true">&middot;</span>
            {{ authorName }}
          </span>
        </div>
        <h2 class="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
          {{ post.title }}
        </h2>
        <p v-if="post.excerpt" class="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
          {{ post.excerpt }}
        </p>
        <div v-if="post.tags?.length" class="mt-3 flex flex-wrap gap-2">
          <span
            v-for="item in post.tags"
            :key="item.tag"
            class="inline-flex items-center rounded-full bg-primary-50 dark:bg-primary-950 px-2.5 py-0.5 text-xs font-medium text-primary-700 dark:text-primary-300"
          >
            {{ item.tag }}
          </span>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>
