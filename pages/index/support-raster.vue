<template>
  <v-container class="pa-0">
    <div class="tab-header justify-space-between">
      <v-row>
        <h4 class="subtitle-2 text-uppercase font-weight-regular tab-title">
          {{ $t('title') }}
        </h4>
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
    <v-list
      v-if="!$fetchState.pending"
      expand
    >
      <template v-for="group in orderedSupportLayersGroups">
        <SupportLayersGroupRaster
          :key="group.id"
          :group="group"
        />
      </template>
    </v-list>
    <div v-if="$fetchState.pending">
      <template v-for="i in 6">
        <v-skeleton-loader
          :key="i"
          type="text"
          class="mx-4 my-5"
        />
      </template>
    </div>

  </v-container>
</template>

<i18n>
{
    "en": {

        "title": "High Resolution and Mosaics",
        "data-source-label": "Datasource: Geoserver - FUNAI"
    },

    "pt-br": {
        "title": "Alta Resolução e Mosaicos",
        "data-source-label": "Fonte de dados: Geoserver - FUNAI"

    }
}
</i18n>

<script>
import { mapState } from 'vuex';
import _ from 'lodash';

import SupportLayersGroupRaster from '@/components/support/SupportLayersGroupRaster';

export default {
  name: 'SupportRaster',

  components: { SupportLayersGroupRaster },

  transition: 'scroll-y-transition',

  async fetch() {
    if (!Object.keys(this.supportCategoryGroupsRaster).length) {
      await this.$store.dispatch('supportLayers/getCategoryGroupsRasters');
    }
  },

  computed: {
    orderedSupportLayersGroups() {
      return _.sortBy(this.supportCategoryGroupsRaster, 'order');
    },
    showFeatures: {
      get() {
        return this.$store.state.supportLayers.showFeaturesSupportLayersRaster;
      },
      set(value) {
        this.$store.commit(
          'supportLayers/setshowFeaturesSupportLayersRaster',
          value,
        );
      },
    },

    ...mapState('supportLayers', [
      'supportCategoryGroupsRaster',
      'loading',
      'showFeaturesSupportLayersRaster',
    ]),
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
