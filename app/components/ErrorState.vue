<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  backTo?: string
  backLabel?: string
}>()

defineEmits<{
  retry: []
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
      <div class="mx-auto w-16 h-16 rounded-full bg-red-50 dark:bg-red-950 flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
      </div>
      <p class="text-gray-700 dark:text-gray-200 font-medium text-lg">{{ title ?? 'Something went wrong' }}</p>
      <p v-if="description" class="mt-1 text-gray-500 dark:text-gray-400 text-sm">{{ description }}</p>
      <button
        class="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary-600 dark:bg-primary-500 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
        @click="$emit('retry')"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
        </svg>
        Try Again
      </button>
    </div>
  </div>
</template>
