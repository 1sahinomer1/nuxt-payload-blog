<script setup lang="ts">
const { init } = useColorMode()
onMounted(() => init())
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
