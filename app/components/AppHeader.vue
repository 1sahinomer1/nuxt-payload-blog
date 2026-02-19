<template>
  <header class="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
    <nav class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between" aria-label="Main navigation">
      <NuxtLink to="/" class="text-xl font-bold tracking-tight text-gray-900 hover:text-primary-600 transition-colors">
        BlogCMS
      </NuxtLink>
      <ul class="flex items-center gap-8">
        <li>
          <NuxtLink
            to="/"
            class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            active-class="text-primary-600"
          >
            Home
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/blog"
            class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            active-class="text-primary-600"
          >
            Blog
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>
