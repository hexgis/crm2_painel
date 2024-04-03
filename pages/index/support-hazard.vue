<template>
  <v-container class="pa-0">
    <div class="tab-header">
      <v-row>
        <h4 class="subtitle-2 text-uppercase font-weight-regular">
          {{ $t('title') }}
        </h4>
        <v-tooltip>
          <template #activator="{ on }">
            <v-icon
              class="mr-2 ml-2"
              v-on="on"
            >
              mdi-information
            </v-icon>
          </template>
          <span>
            INPE - Instituto Nacional de Pesquisas Espaciais, 2020.
            <br>
            Dados fornecidos pelo Portal do Monitoramento de Queimadas e Incêndios Florestais.
            <br>
            Disponível em http://www.inpe.br/queimadas.
            <br>
            Acesso: Dado atualizado ontem.
            <br>
            * FOCOS DE CALOR
            <br>
            Descrição: Mapeamento dos pontos de foco de
            <br>
            calor aferidos pelo satélites AQUA M-M e AQUA M-T.
            <br>
            * RISCO DE FOGO
            <br>
            Descrição: Produto resultado da metodologia criada pelo Programa Queimadas do INPE.
            <br>
            Metodologia em https://queimadas.dgi.inpe.br/~rqueimadas/documentos/RiscoFogo_Sucinto.pdf

          </span>
        </v-tooltip>
      </v-row>
    </div>
    <v-list
      v-if="!$fetchState.pending"
      expand
    >
      <template v-for="group in orderedSupportLayersGroups">
        <SupportLayersGroupHazard
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

        "title": "Layers Hazard (INPE)"
    },
    "pt-br": {
        "title": "Camadas Fogo (INPE)"

    }

}
</i18n>

<script>
import { mapState } from 'vuex';
import _ from 'lodash';

import SupportLayersGroupHazard from '@/components/support/SupportLayersGroupHazard';

export default {
  name: 'SupportHazard',

  components: { SupportLayersGroupHazard },

  transition: 'scroll-y-transition',

  async fetch() {
    if (!Object.keys(this.supportCategoryGroupsFire).length) {
      await this.$store.dispatch('supportLayers/getCategoryGroupsFire');
    }
  },

  computed: {
    orderedSupportLayersGroups() {
      return _.sortBy(this.supportCategoryGroupsFire, 'order');
    },
    showFeatures: {
      get() {
        return this.$store.state.supportLayers.showFeaturesSupportLayersHazard;
      },
      set(value) {
        this.$store.commit(
          'supportLayers/setshowFeaturesSupportLayersHazard',
          value,
        );
      },
    },

    ...mapState('supportLayers', ['supportCategoryGroupsFire', 'loading', 'showFeaturesSupportLayersHazard']),
  },
};
</script>

<style scoped></style>
