<template>
  <v-container class="pa-0">
    <div class="tab-header ">
      <v-row>
        <h4 class="subtitle-2 text-uppercase font-weight-regular">
          {{ $t('title') }}
        </h4>
        <v-tooltip>
          <template #activator="{ on }">
            <v-icon
              class="ml-2"
              v-on="on"
            >
              mdi-information
            </v-icon>
          </template>
          <span>
            PRODES é um projeto que utiliza os
            <br>
            satélites Landsat, CBERS e IRS-2,
            <br>
            e detecta áreas maiores que 6,25 ha.
            <br>
            As detecções contempladas pelo PRODES
            <br>
            são a partir do ano de 2005.
          </span>
        </v-tooltip>
      </v-row>
    </div>
    <v-list
      v-if="!$fetchState.pending"
      expand
    >
      <template v-for="group in orderedSupportLayersGroups">
        <SupportLayersGroupProdes
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
    <v-container>
      <v-container>
        <v-footer
          absolute
          color="white"
          elevation="6"
          class="d-flex justify-center"
        >
          <v-img
            max-width="200"
            src="/img/logo-inteira-antiga.svg"
          />
        </v-footer>
      </v-container>
    </v-container>
  </v-container>
</template>

<i18n>
{
    "en": {
        "title": "Layer Prodes (INPE)"
    },
    "pt-br": {
        "title": "Camada Prodes (INPE)"
    }
}
</i18n>

<script>
import { mapState } from 'vuex';
import _ from 'lodash';

import SupportLayersGroupProdes from '@/components/support/SupportLayersGroupProdes';

export default {
  name: 'SupportProdes',

  components: { SupportLayersGroupProdes },

  transition: 'scroll-y-transition',

  async fetch() {
    if (!Object.keys(this.supportCategoryGroupsProdes).length) {
      await this.$store.dispatch('supportLayers/getCategoryGroupsProdes');
    }
  },

  computed: {
    orderedSupportLayersGroups() {
      return _.sortBy(this.supportCategoryGroupsProdes, 'order');
    },
    showFeatures: {
      get() {
        return this.$store.state.supportLayers.showFeaturesSupportLayersProdes;
      },
      set(value) {
        this.$store.commit(
          'supportLayers/setshowFeaturesSupportLayersProdes',
          value,
        );
      },
    },

    ...mapState('supportLayers', [
      'supportCategoryGroupsProdes',
      'loading',
      'showFeaturesSupportLayersProdes',
    ]),
  },
};
</script>

<style scoped></style>
