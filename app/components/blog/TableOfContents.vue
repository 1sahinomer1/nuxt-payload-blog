<script setup lang="ts">
import type { TocItem } from '~/utils/toc'

defineProps<{
  items: TocItem[]
}>()

const activeId = ref('')

onMounted(() => {
  const headings = document.querySelectorAll('.prose h2[id], .prose h3[id], .prose h4[id]')
  if (!headings.length) return

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      }
    },
    { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 },
  )

  headings.forEach((el) => observer.observe(el))
  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <nav v-if="items.length" aria-label="Table of contents" class="hidden xl:block">
    <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">On this page</p>
    <ul class="space-y-1.5 border-l border-gray-200 dark:border-gray-700">
      <li v-for="item in items" :key="item.id">
        <a
          :href="`#${item.id}`"
          class="block text-sm leading-snug py-1 transition-colors border-l-2 -ml-px"
          :class="[
            item.level === 3 ? 'pl-6' : item.level === 4 ? 'pl-9' : 'pl-3',
            activeId === item.id
              ? 'border-primary-500 text-primary-600 dark:text-primary-400 font-medium'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600',
          ]"
        >
          {{ item.text }}
        </a>
      </li>
    </ul>
  </nav>
</template>
