export default defineNuxtConfig({
  ssr: false,
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    }
  },
  compatibilityDate: '2026-05-17',
  vite: {
    optimizeDeps: {
      include: [
        '@supabase/supabase-js',
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ]
    }
  }
})