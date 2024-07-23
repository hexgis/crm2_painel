<template>
  <v-container class="pa-0">
    <div class="tab-header justify-space-between">
      <v-row>
        <h6 class="subtitle-2 text-uppercase font-weight-regular tab-title">
          {{ $t('title') }}
        </h6>
        <v-tooltip>
          <template #activator="{ on }">
            <v-icon class="infoIconMargin" v-on="on">
              mdi-information
            </v-icon>
          </template>
          <span> Fonte de dados: Geoserver - FUNAI </span>
        </v-tooltip>
        <v-switch
          v-show="!loading"
          v-model="showFeatures"
          class="mt-n1 switch-margin"
          hide-details
        />
      </v-row>
    </div>
    <v-col cols="12" class="pb-0">
      <v-autocomplete
        v-model="selectedLayers"
        :label="$t('search-label')"
        multiple
        clearable
        :items="orderedSupportLayersGroupsItens"
        :item-text="(layer) => layer.name"
        outlined
        :search-input.sync="searchInput"
        @input="searchInput = null"
        @click:clear="clearInput"
      />
    </v-col>
    <v-list v-if="!$fetchState.pending" expand class="pt-0">
      <template v-for="group in filteredGroups">
        <SupportLayersGroupRaster
          :key="group.id"
          :group="group"
          :open-group="searchLayer"
        />
      </template>
    </v-list>
    <div v-if="$fetchState.pending">
      <v-skeleton-loader
        v-for="i in 6"
        :key="i"
        type="text"
        class="mx-4 my-5"
      />
    </div>
  </v-container>
</template>

<i18n>
{
  "en": {
    "search-label": "Search layer",
    "title": "High Resolution and Mosaics"
  },
  "pt-br": {
    "search-label": "Buscar camada",
    "title": "Alta Resolução e Mosaicos"
  }
}
</i18n>

<script>
import { mapState, mapMutations } from 'vuex'
import _ from 'lodash'
import SupportLayersGroupRaster from '@/components/support/SupportLayersGroupRaster'

export default {
  name: 'SupportRaster',
  components: { SupportLayersGroupRaster },
  data: () => ({
    showFooter: process.env.SHOW_FOOTER === 'true',
    selectedLayers: [],
    searchInput: null,
    searchLayer: false,
  }),
  async fetch() {
    if (!Object.keys(this.supportCategoryGroupsRaster).length) {
      await this.$store.dispatch('supportLayers/getCategoryGroupsRasters')
    }
  },
  computed: {
    orderedSupportLayersGroups() {
      return _.sortBy(this.supportCategoryGroupsRaster, 'order')
    },

    orderedSupportLayersGroupsItens() {
      return _.sortBy(this.supportLayersCategoryRaster, 'order')
    },

    showFeatures: {
      get() {
        return this.$store.state.supportLayers
          .showFeaturesSupportLayersRaster
      },
      set(value) {
        this.$store.commit(
          'supportLayers/setshowFeaturesSupportLayersRaster',
          value
        )
      },
    },

    filteredGroups() {
      if (this.selectedLayers.length) {
        this.setSearchLayer(true);
        let filteredLayersId = [];
        const filteredItens = [];
        const filteredGroup = [];
        for (const filter of this.selectedLayers) {
          filteredItens.push(
            ...this.orderedSupportLayersGroupsItens.filter(
              (layer) => layer.name === filter
            )
          )
        }
        for (const group of this.orderedSupportLayersGroups) {
          const { layers } = group;
          for (const layer of layers) {
            for (const item of filteredItens) {
              if (item.id === layer) {
                filteredLayersId = filteredLayersId.concat(item.id);
                if (!filteredGroup.includes(group)) {
                  filteredGroup.push(group);
                }
              }
            }
          }
        }
        this.setFilteredLayers(filteredLayersId);
        return filteredGroup;
      }
      this.setSearchLayer(false);
      this.setFilteredLayers(null);
      return _.sortBy(this.orderedSupportLayersGroups, 'order');
    },

    ...mapState('supportLayers', [
      'supportCategoryGroupsRaster',
      'supportLayersCategoryRaster',
      'loading',
      'showFeaturesSupportLayersRaster',
    ]),
  },
  methods: {
    ...mapMutations('supportLayers', {
      setFilteredLayers: 'setFilteredLayers',
      setSearchLayer: 'setSearchLayer',
    }),
    clearInput() {
      this.selectedLayers = []
    },
  },
}
</script>
