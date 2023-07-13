import messages from './plugins/i18n-messages.js';

require('dotenv').config();

export default {
  mode: 'universal',
  /*
     ** Headers of the page
     */
  head: {
    titleTemplate: `%s - ${process.env.APP_NAME}`,
    title: 'CMR' || '',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
     ** Customize the progress-bar color
     */
  loading: { color: '#C2293D', height: '4px' },
  /*
     ** Global CSS
     */
  css: ['@mdi/font/css/materialdesignicons.css'],
  /*
     ** Plugins to load before mounting the App
     */
  plugins: [
    '~/plugins/axios.js',
    '~/plugins/filters.js',
    '~/plugins/v-mask.js',
    '~/plugins/i18n.js',
    { src: '~/plugins/vue-chartjs.js', mode: 'client' },
    { src: '~/plugins/vue2-leaflet-markercluster.js', mode: 'client' },
  ],
  /*
     ** Nuxt.js dev-modules
     */
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify',
    '@nuxtjs/moment',
  ],
  /*
     ** Nuxt.js modules
     */
  modules: [
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    'nuxt-leaflet',
    'cookie-universal-nuxt',
    'nuxt-i18n',
  ],
  /*
     ** vuetify module configuration
     ** https://github.com/nuxt-community/vuetify-module
     */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      light: true,
      dark: false,
      themes: {
        light: {
          primary: '#3573B7',
          secondary: '#1C4171',
          accent: '#165396',
          error: '#D8573C',
          warning: '#F5C035',
          info: '#395989',
          success: '#26A69A',
        },
        dark: {
          primary: '#63676c',
          secondary: '#4d5155',
          accent: '#63676c',
          error: '#2F4D6A',
          warning: '#1E3d59',
          info: '#63676c',
          success: '#26A69A',
        },
      },
    },
  },

  i18n: {
    vueI18nLoader: true,
    locales: ['pt-br', 'en'],
    defaultLocale: 'en',
    vueI18n: {
      fallbackLocale: 'en',
      messages,
    },
  },

  moment: {
    locales: ['pt-br'],
    defaultLocale: 'en',
  },
  /*
     ** Build configuration
     */
  build: {
    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map';
      }
    },
  },

  router: {
    middleware: 'auth',
  },
};
