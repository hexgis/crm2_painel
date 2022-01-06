<template>
  <v-app>
    <v-btn
      ripple
      class="right-drawer-btn"
      :class="{ 'drawer-btn-opened': layerDrawer }"
      color="secondary"
      @click.stop="layerDrawer = !layerDrawer"
    >
      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-icon v-on="on">
            {{ layerDrawer ? "mdi-chevron-right" : "mdi-chevron-left" }}
          </v-icon>
        </template>
        <span> {{ $t("tooltip") }} </span>
      </v-tooltip>
    </v-btn>

    <v-navigation-drawer
      v-model="layerDrawer"
      absolute
      right
      clipped
      app
      width="420"
      disable-resize-watcher
      class="elevation-4 navigation-drawer"
      @input="changeControlsStyle()"
    >
      <nuxt @closedrawer="layerDrawer = false" />
    </v-navigation-drawer>

    <v-main class="pa-0">
      <Map2 />
    </v-main>
  </v-app>
</template>

<i18n>
{
    "en": {
        "tooltip": "Search menu",
        "welcome": "Welcome,"
    },
    "pt-br": {
        "tooltip": "Search menu",
        "welcome": "Bem vindo,"
    }
}
</i18n>

<script>
import { mapState } from "vuex";

import Map2 from "~/components/map/Map2.vue";

export default {
  name: "App",

  components: {
    Map2,
  },

  data: () => ({
    layerDrawer: false,
    leafletRightControl: null,
    snackbar: true,
    timeout: 3000,
  }),

  watch: {
    user() {
      if (this.user && this.user.settings.drawer_open_on_init) {
        this.layerDrawer = true;
      }
    },
  },

  mounted() {
    this.$nextTick(function () {
      this.getLeafletControlRef();

      if (this.user && this.user.settings.drawer_open_on_init) {
        this.layerDrawer = true;
      }
    });
  },

  methods: {
    getLeafletControlRef() {
      this.leafletRightControl =
        document.getElementsByClassName("leaflet-right");
    },

    changeControlsStyle() {
      if (this.layerDrawer) {
        Array.from(this.leafletRightControl).forEach((element) => {
          element.classList.add("leaflet-right-drawer--offset");
        });
      } else {
        Array.from(this.leafletRightControl).forEach((element) => {
          element.classList.remove("leaflet-right-drawer--offset");
        });
      }
    },
  },

  head: () => ({
    title: "CMR2_PAINEL",
  }),
};
</script>

<style lang="sass">
html,
body,
.map-container
    height: 100vh
    width: 100vw
    overflow: hidden !important
    padding: 0

.leaflet-pane
    z-index: 2 !important

.leaflet-bottom
    z-index: 3 !important

.leaflet-left,
.leaflet-right,
.leaflet-top
    z-index: 3 !important

.leaflet-right
    transition: right .2s
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)

.leaflet-right-drawer--offset
    right: 420px!important

.tab-header
    width: 100%
    min-height: 64px
    display: flex
    align-items: center
    font-size: .9375rem
    padding: 16px 24px
    border-bottom: solid 1px rgba(0,0,0,.2)
    box-shadow: 0px 3px 3px -3px rgba(0, 0, 0, 0.2) !important

.list-separator:not(:first-child)
    border-top: solid 1px rgba(0,0,0,.12)
</style>

<style scoped lang="sass">
.navigation-drawer
    z-index: 5 !important

.vertical-divider
    height: 40px
    min-height: 0
    margin: 8px -14px 0px 24px

.right-drawer-btn
    padding: 0 !important
    width: 34px !important
    min-width: 34px !important
    height: 64px !important
    position: absolute
    border-radius: 0
    top: 0
    z-index: 4
    right: 0px
    transition: right .2s
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)

.drawer-btn-opened
    right: 420px
</style>
