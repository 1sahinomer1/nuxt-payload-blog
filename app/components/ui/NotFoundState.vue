<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  backTo?: string
  backLabel?: string
  actionTo?: string
  actionLabel?: string
}>()
</script>

<template>
  <div class="pb-16">
    <header v-if="backTo" class="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <NuxtLink :to="backTo" class="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
          &larr; {{ backLabel ?? 'Go back' }}
        </NuxtLink>
      </div>
    </header>
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div class="mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </div>
      <p class="text-gray-700 dark:text-gray-200 font-medium text-lg">{{ title ?? 'Not found' }}</p>
      <p v-if="description" class="mt-1 text-gray-500 dark:text-gray-400 text-sm">{{ description }}</p>
      <NuxtLink
        v-if="actionTo"
        :to="actionTo"
        class="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary-600 dark:bg-primary-500 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
      >
        {{ actionLabel ?? 'Go back' }}
      </NuxtLink>
    </div>
  </div>
</template>
