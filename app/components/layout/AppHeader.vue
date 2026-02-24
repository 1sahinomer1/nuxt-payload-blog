<script setup lang="ts">
import { SITE_NAME } from '~/constants/meta'
</script>

<template>
  <header class="border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
    <nav class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between" aria-label="Main navigation">
      <NuxtLink to="/" class="text-xl font-bold tracking-tight text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
        {{ SITE_NAME }}
      </NuxtLink>
      <div class="flex items-center gap-6">
        <ul class="flex items-center gap-8">
          <li>
            <NuxtLink
              to="/"
              class="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              active-class="!text-primary-600 dark:!text-primary-400"
            >
              Home
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/blog"
              class="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              active-class="!text-primary-600 dark:!text-primary-400"
            >
              Blog
            </NuxtLink>
          </li>
        </ul>
        <ColorModeToggle />
      </div>
    </nav>
  </header>
</template>
