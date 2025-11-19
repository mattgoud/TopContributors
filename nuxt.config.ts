import tailwindcss from '@tailwindcss/vite'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { PuikResolver } from '@prestashopcorp/puik-resolver'

export default defineNuxtConfig({

  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/test-utils'],

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  devtools: { enabled: true },

  app: {
    head: {
      title: 'PrestaShop Top Contributors',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        {
          name: 'description',
          content: 'A list of PrestaShop contributors',
        },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',
  vite: {
    plugins: [
      tailwindcss(),
      Components({
        resolvers: [PuikResolver()],
      }),
      AutoImport({
        resolvers: [PuikResolver()],
      }),
    ],
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
