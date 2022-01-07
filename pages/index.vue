<template>
  <v-tabs
    v-model="activeTab"
    vertical
    optional
    background-color="secondary"
    class="right-tabs fill-height"
  >
    <div class="top-buttons d-sm-none">
      <v-btn
        key="close"
        class="back-mobile-button"
        @click.prevent="closeRightDrawer()"
      >
        <v-tooltip left>
          <template #activator="{ on }">
            <v-icon v-on="on"> mdi-close </v-icon>
          </template>
          <span>Fechar Menu</span>
        </v-tooltip>
      </v-btn>
    </div>

    <v-tab
      v-for="(tab, i) in tabs"
      :key="i"
      :to="localePath(tab.route)"
      exact
      nuxt
    >
      <v-tooltip left>
        <template #activator="{ on }">
          <v-icon v-on="on">{{ tab.icon }}</v-icon>
        </template>
        <span>{{ tab.name }}</span>
      </v-tooltip>
    </v-tab>

    <v-tab-item :transition="false" :reverse-transition="false">
      <nuxt-child keep-alive />

      <div
        v-if="isIndex"
        class="info fill-height d-flex flex-column align-content-space-between"
      >
        <v-list class="pt-0" dark>
          <v-list-item
            v-for="(tab, i) in tabs"
            :key="i"
            :to="localePath(tab.route)"
          >
            <v-list-item-title class="text-right">
              {{ tab.name }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
    </v-tab-item>

    <ProfilePanel v-model="settings" />
  </v-tabs>
</template>

<i18n>
{
    "en": {
        "catalog-tab": "My image database",
        "imagery-tab": "Search and acquire images",
        "search-tab": "Search",
        "layers-tab": "Layers",
        "change-detection-tab": "Change detection",
        "bookmarks-tab": "Bookmarks",
        "analytics-tab": "Analytics",
        "compare-tab": "Compare images",
        "algorithms-tab": "Algorithms",
        "webhooks-tab": "Webhooks"
    },
    "pt-br": {
        "search-tab": "Pesquisar dados",
        "layers-tab": "Camadas",
        "bookmarks-tab": "Bookmarks",
        "analytics-tab": "Analytics",
        "compare-tab": "Comparar imagens",
        "webhooks-tab": "Webhooks"
    }
}
</i18n>

<script>
import { mapState } from "vuex";
import ProfilePanel from "@/components/profile/ProfilePanel";

export default {
  name: "MapLayersPanel",

  components: { ProfilePanel },

  transition: "scroll-y-transition",

  data: () => ({
    activeTab: 0,
    compareTabIndex: null,
    settings: false,
  }),

  computed: {
    isIndex() {
      return this.getRouteBaseName() === "index";
    },

    tabs() {
      return [
        {
          name: this.$t("Camadas de Apoio"),
          icon: "mdi-layers",
          route: "/support",
        },
        {
          name: this.$t("bookmarks-tab"),
          icon: "mdi-bookmark-multiple",
          route: "/bookmarks",
        },
        {
          name: this.$t("Estatísticas"),
          icon: "mdi-chart-box",
          route: "/analytics",
        },
        {
          name: this.$t("webhooks-tab"),
          icon: "mdi-webhook",
          route: "/webhooks",
        },
        {
          name: this.$t("Polígonos Prioritários"),
          icon: "mdi-magnify",
          route: "/priority",
        },
        {
          name: this.$t("xpto"),
          icon: "mdi-magnify",
          route: "/monitoring",
        },
      ];
    },
  },

  watch: {
    // isComparing() {
    //     this.handleCompareTab()
    // },
  },

  methods: {
    closeRightDrawer() {
      this.$emit("closedrawer");
    },
  },
};
</script>

<style lang="sass">
.right-tabs
    flex-direction: row-reverse

    > .v-slide-group > .v-slide-group__wrapper > .v-slide-group__content
        > .v-tab
            min-width: 0px
        > .v-tabs-slider-wrapper
            left: 52px !important

    > .v-window, > .v-window > .v-window__container > .v-window-item
        overflow-y: auto
        height: 100%
        display: block !important

.scroll-y-transition-enter-active,
.scroll-y-transition-leave-active
    transition: 0.15s cubic-bezier(0.25, 0.8, 0.5, 1) !important

.back-mobile-button
    min-width: 0 !important
    display: block
    border-radius: none
    box-shadow: none
    height: 64px !important
    background-color: transparent !important
    color: white !important

.top-buttons
    padding: 0
    border-radius: 0
    top: 0
    background-color: #171924

.v-dialog > .v-card > .v-card__title
    background: linear-gradient(to bottom,rgb(30, 33, 50),rgb(44, 54, 73))
    color: whitesmoke

    > .v-btn--icon
        color: whitesmoke
</style>
