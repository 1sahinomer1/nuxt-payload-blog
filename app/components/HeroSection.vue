<template>
  <section class="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
      <div class="max-w-2xl">
        <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
          Insights &amp; Ideas
        </h1>
        <p class="mt-4 text-lg sm:text-xl text-gray-600 leading-relaxed">
          Explore our latest articles on technology, design, and modern web development.
        </p>
        <div class="mt-8">
          <NuxtLink
            to="/blog"
            class="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-colors"
          >
            Read the blog
            <span aria-hidden="true">&rarr;</span>
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="absolute inset-0 -z-10 opacity-30" aria-hidden="true">
      <div class="absolute top-0 right-0 w-96 h-96 bg-primary-200 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
      <div class="absolute bottom-0 left-0 w-72 h-72 bg-primary-100 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
    </div>
  </section>
</template>
