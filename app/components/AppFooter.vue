<template>
  <footer class="border-t border-gray-100 bg-gray-50" role="contentinfo">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-sm text-gray-500">
          &copy; {{ new Date().getFullYear() }} BlogCMS. Built with Nuxt &amp; Payload CMS.
        </p>
        <nav aria-label="Footer navigation">
          <ul class="flex items-center gap-6">
            <li>
              <NuxtLink to="/" class="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                Home
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/blog" class="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                Blog
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </footer>
</template>
