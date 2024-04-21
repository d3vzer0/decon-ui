// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', "@nuxtjs/tailwindcss"],
  css: ['~/assets/css/main.css'],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
    // and more...
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  }
})