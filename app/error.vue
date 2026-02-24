<script setup lang="ts">
import { SITE_NAME } from '~/constants/meta'

const props = defineProps<{
  error: {
    statusCode: number
    statusMessage?: string
    message?: string
  }
}>()

const title = computed(() => {
  if (props.error.statusCode === 404) return 'Page Not Found'
  return props.error.statusMessage ?? 'Something went wrong'
})

const description = computed(() => {
  if (props.error.statusCode === 404) {
    return 'The page you\'re looking for doesn\'t exist or has been moved.'
  }
  return props.error.message ?? 'An unexpected error occurred. Please try again later.'
})

useHead({
  title: `${title.value} — ${SITE_NAME}`,
})

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
    <div class="flex-1 flex items-center justify-center px-4">
      <div class="text-center max-w-md">
        <p class="text-6xl font-extrabold text-primary-500 mb-4">
          {{ error.statusCode }}
        </p>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ title }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mb-8">
          {{ description }}
        </p>
        <button
          class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary-600 dark:bg-primary-500 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
          @click="handleError"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          Go Home
        </button>
      </div>
    </div>
  </div>
</template>
