<template>
  <v-app id="analytics">
    <v-main class="grey lighten-3">
      <v-icon
        class="ma-2 map-button"
        @click="$router.push('/')"
      >
        mdi-arrow-left
      </v-icon>
      
      <nuxt />
    </v-main>
  </v-app>
</template>

<i18n>
{
    "en": {
        "map-button": "Map"
    },
    "pt-br": {
        "map-button": "Mapa"
    }
}
</i18n>

<script>
export default {
  name: 'App',
};
</script>

<style lang="sass">
#analytics
    height: 100vh
    overflow-y: auto

.map-button
    position: fixed
    z-index: 5
</style>
