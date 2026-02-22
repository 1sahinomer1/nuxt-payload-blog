import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  ssr: true,
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    public: {
      payloadUrl: process.env.NUXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
      script: [
        {
          innerHTML: `(function(){try{var m=localStorage.getItem('color-mode');if(m==='dark'||(!m&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          type: 'text/javascript',
        },
      ],
    },
  },

  routeRules: {
    '/**': { swr: 60 },
  },

  nitro: {
    compressPublicAssets: true,
  },

  experimental: {
    payloadExtraction: false,
  },
})
