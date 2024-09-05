<template>
  <v-container class="pa-0">
    <div class="tab-header justify-space-between">
      <v-row>
        <h6 class="subtitle-2 text-uppercase font-weight-regular tab-title">
          {{ $t('title') }}
        </h6>
        <v-tooltip>
          <template #activator="{ on }">
            <v-icon
              class="infoIconMargin"
              v-on="on"
            >
              mdi-information
            </v-icon>
          </template>
          <span>
           {{ $t('data-source-label') }}
          </span>
        </v-tooltip>
        <v-switch
          v-show="!loading"
          v-model="showFeatures"
          class="mt-n1 switch-margin"
          hide-details
        />
      </v-row>


    </div>
    <v-col
      cols="12"
      class="pb-0"
    >
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
    <v-list
      v-if="!$fetchState.pending"
      expand
      class="pt-0"
    >
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
    "title": "High Resolution and Mosaics",
    "data-source-label": "Datasource: Geoserver - FUNAI"
  },
  "pt-br": {
    "search-label": "Buscar camada",
    "title": "Alta Resolução e Mosaicos",
    "data-source-label": "Fonte de dados: Geoserver - FUNAI"
  }
}
</i18n>

<script>
import { mapState, mapMutations } from 'vuex';
import _ from 'lodash';
import SupportLayersGroupRaster from '@/components/support/SupportLayersGroupRaster';

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
      await this.$store.dispatch('supportLayers/getCategoryGroupsRasters');
    }
  },
  computed: {
    orderedSupportLayersGroups() {
      return _.sortBy(this.supportCategoryGroupsRaster, 'order');
    },

    orderedSupportLayersGroupsItens() {
      return _.sortBy(this.supportLayersCategoryRaster, 'order');
    },

    showFeatures: {
      get() {
        return this.$store.state.supportLayers
          .showFeaturesSupportLayersRaster;
      },
      set(value) {
        this.$store.commit(
          'supportLayers/setshowFeaturesSupportLayersRaster',
          value,
        );
      },
    },

    /**
   * Filtra os grupos de camadas de suporte com base nas camadas selecionadas.
   * - Se `selectedLayers` estiver vazio, retorna todos os grupos ordenados.
   * - Caso contrário, retorna apenas os grupos que contêm camadas que foram selecionadas.
   * - Atualiza os IDs das camadas filtradas para uso em outras partes do sistema.
   *
   * @returns {Array} Lista de grupos filtrados com base nas camadas selecionadas.
    */
    filteredGroups() {
      if (!this.selectedLayers.length) {
        this.setSearchLayer(false);
        this.setFilteredLayers(null);
        return _.sortBy(this.orderedSupportLayersGroups, 'order');
      }

      this.setSearchLayer(true);

      const selectedLayersSet = new Set(this.selectedLayers);

      const filteredLayersItens = this.orderedSupportLayersGroupsItens.filter(
        (item) => selectedLayersSet.has(item.name),
      );

      const filteredItemsMap = filteredLayersItens.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});

      const { filteredLayersId, filteredGroups } = this.orderedSupportLayersGroups.reduce(
        (acc, group) => {
          const { layers } = group;
          const matchedLayers = layers.filter((layer) => filteredItemsMap[layer]);

          if (matchedLayers.length) {
            matchedLayers.forEach((layer) => acc.filteredLayersId.add(layer));
            acc.filteredGroups.push(group);
          }

          return acc;
        },
        { filteredLayersId: new Set(), filteredGroups: [] },
      );

      this.setFilteredLayers(Array.from(filteredLayersId));
      return filteredGroups;
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
      this.selectedLayers = [];
    },
  },
};
</script>

<style scoped lang="scss">
.container-height {
    max-height: 90vh;
}

.selected {
    background-color: red
}

.infoIconMargin {
    margin-left: 4px;
  }

.switch-margin {
    margin-left: 60px

  }

@media (max-width: 768px) {
  .infoIconMargin {
    margin-left: 2px;
  }

  .tab-title {
    font-size: 90% !important;
  }

  .switch-margin {
    margin-top: 10px;
    margin-left: 0px
  }
}
</style>
