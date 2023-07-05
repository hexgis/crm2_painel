<template>
  <v-tabs
    v-model="activeTab"
    vertical
    dark
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
            <v-icon v-on="on">
              mdi-close
            </v-icon>
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
      :disabled="showTableDialog"
    >
      <v-tooltip left>
        <template #activator="{ on }">
          <v-icon v-on="on">
            {{ tab.icon }}
          </v-icon>
        </template>
        <span>{{ tab.name }}</span>
      </v-tooltip>
    </v-tab>

    <v-tab-item
      :transition="false"
      :reverse-transition="false"
    >
      <nuxt-child keep-alive />

      <div
        v-if="isIndex"
        class="
                    info
                    fill-height
                    d-flex
                    flex-column
                    align-content-space-between
                "
      >
        <v-list
          class="pt-0"
          dark
        >
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
        "search-tab": "Monitoring",
        "layers-tab": "Layers",
        "high-resolution-mosaics-tab": "High Resolution and Mosaics",
        "support-fire-tab": "Fire Hazard and Hot Spots",
        "landuse-tab": "Land Use And Occupation",
        "compare-tab": "Compare images",
        "prodes-tab": "PRODES (INPE)",
        "algorithms-tab": "Algorithms",
        "urgent-alerts-tab": "Urgent Alerts",
        "webhooks-tab": "Webhooks",
        "priority-tab": "Priorities",
        "document-tab": "Document",
        "mapoteca-tab": "Map Library",
        "deter-tab": "Deter"
    },
    "pt-br": {
        "catalog-tab": "Meu acervo de imagens",
        "imagery-tab": "Pesquisar e adquirir imagens",
        "search-tab": "Monitoramento Diário",
        "layers-tab": "Camadas de Sobreposição",
        "high-resolution-mosaics-tab": "Alta Resolução e Mosaicos",
        "support-fire-tab": "Risco de Fogo e Focos de Calor",
        "landuse-tab": "Uso e Ocupação do Solo",
        "compare-tab": "Comparar imagens",
        "prodes-tab": "PRODES (INPE)",
        "algorithms-tab": "Algoritmos",
        "urgent-alerts-tab": "Alerta Urgente",
        "webhooks-tab": "Webhooks",
        "priority-tab": "Polígonos Prioritários",
        "document-tab": "Documental",
        "mapoteca-tab": "Mapoteca",
        "deter-tab": "Deter"
    }
}
</i18n>

<script>
import { mapState, mapMutations } from 'vuex';
import ProfilePanel from '@/components/profile/ProfilePanel';

export default {
  name: 'MapLayersPanel',

  components: { ProfilePanel },

  transition: 'scroll-y-transition',

  data: () => ({
    activeTab: 0,
    compareTabIndex: null,
    settings: false,
  }),

  computed: {
    isIndex() {
      return this.getRouteBaseName() === 'index';
    },

    allTabs() {
      return [
        {
          name: this.$t('layers-tab'),
          icon: 'mdi-layers',
          route: '/support',
          show: process.env.ROUTE_SUPPORT === 'true',
        },
        {
          name: this.$t('priority-tab'),
          icon: 'mdi-map-marker-alert',
          route: '/priority',
          show: process.env.ROUTE_PRIORITY === 'true',
        },
        {
          name: this.$t('search-tab'),
          icon: 'mdi-map-search',
          route: '/monitoring',
          show: process.env.ROUTE_MONITORING === 'true',
        },
        {
          name: this.$t('urgent-alerts-tab'),
          icon: 'mdi-alarm-light',
          route: '/urgent-alerts',
          show: process.env.ROUTE_URGENT_ALERTS === 'true',
        },
        {
          name: this.$t('high-resolution-mosaics-tab'),
          icon: 'mdi-book-open-page-variant',
          route: '/support-raster',
          show: process.env.ROUTE_SUPPORT_RASTER === 'true',
        },
        {
          name: this.$t('support-fire-tab'),
          icon: 'mdi-fire',
          route: '/support-hazard',
          show: process.env.ROUTE_SUPPORT_HAZARD === 'true',
        },
        {
          name: this.$t('landuse-tab'),
          icon: 'mdi-sprout',
          route: '/land-use',
          show: process.env.ROUTE_LAND_USE === 'true',
        },
        {
          name: this.$t('prodes-tab'),
          icon: 'mdi-view-dashboard',
          route: '/support-prodes',
          show: process.env.ROUTE_SUPPORT_PRODES === 'true',
        },
        {
          name: this.$t('document-tab'),
          icon: 'mdi-file-document',
          route: '/document',
          show: process.env.ROUTE_DOCUMENT === 'true',
        },
        {
          name: this.$t('catalog-tab'),
          icon: 'mdi-folder-multiple-image',
          route: '/catalog',
          show: process.env.ROUTE_CATALOG === 'true',
        },
        {
          name: this.$t('mapoteca-tab'),
          icon: 'mdi-dresser',
          route: '/mapoteca',
          show: process.env.ROUTE_MAPOTECA === 'true',
        },
        {
          name: this.$t('deter-tab'),
          icon: 'mdi-leaf',
          route: '/deter',
          show: process.env.ROUTE_DETER === 'true',
        },
      ];
    },

    tabs() {
      return this.allTabs.filter((t) => t.show);
    },

    ...mapState('catalog', ['isComparing']),
    ...mapState('tableDialog', ['showTableDialog']),
  },

  watch: {
    isComparing() {
      this.handleCompareTab();
    },
  },

  created() {
    if (process.env.IMAGERY === 'false') {
      this.tabs.splice(1, 1);
    }

    this.handleCompareTab();
  },

  methods: {
    handleCompareTab() {
      if (this.isComparing) {
        this.tabs.push({
          name: this.$t('compare-tab'),
          icon: 'mdi-compare',
          route: '/catalog/comparator',
        });
        this.compareTabIndex = this.tabs.length - 1;
        this.$router.push(this.localePath('/catalog/comparator'));
      } else if (this.compareTabIndex) {
        this.tabs.splice(this.compareTabIndex, 1);
        this.compareTabIndex = null;
      }
    },

    closeRightDrawer() {
      this.closeDrawer();
    },
    ...mapMutations('userProfile', ['closeDrawer']),
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
