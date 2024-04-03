<template>
  <v-container class="d-flex flex-column">
    <div class="tab-header flex justify-space-between">
      <h4 class="subtitle-2 text-uppercase font-weight-regular">
        {{ $t('title') }}
      </h4>
      <!-- <v-switch
                v-if="features"
                v-model="showFeaturesMonitoring"
                class="mt-n1 ml-5"
                hide-details
            /> -->
    </div>
    <v-card-text>
      <p>
        Ambiente de pesquisa de mapas.
        Somente mapas são permitidos.
      </p>

      <v-list-item-content style="list-style: circle">
        <v-list-item-title class="list__text mb-4 font-weight-black">
          Relacionados:
        </v-list-item-title>
        <ul
          v-for="(item, index) in items"
          :key="index"
        >
          <li>{{ item.value }}</li>
        </ul>
      </v-list-item-content>
    </v-card-text>

    <v-btn
      color="accent"
      class=""
      @click="showDialog(true)"
    >
      {{ $t('input-label') }}
    </v-btn>
    <div v-if="showDialogMapoteca">
      <MapotecaDialog />
    </div>
   
  </v-container>
</template>

<i18n>
    {
        "en": {
            "title": "Map Library",
            "analytics-label": "Analytics",
            "map-label": "Map",
            "input-label": "Search"
        },
        "pt-br": {
            "title": "Mapoteca",
            "analytics-label": "Analytics",
            "map-label": "Mapa",
            "input-label": "Pesquisar"
        }
    }
</i18n>

<script>
import { mapMutations, mapState } from 'vuex';
import MapotecaDialog from '@/components/mapoteca/MapotecaDialog';

export default {
  name: 'PageMapoteca',

  components: { MapotecaDialog },

  data() {
    return {
      items: [
        { value: 'Imagem de Alta Resolução ​' },
        { value: 'Uso e Ocupação do Solo' },
        { value: 'Uso e Ocupação com Imagem de Alta Resolução' },
      ],
    };
  },

  computed: {
    ...mapState('mapoteca', [
      'showDialogMapoteca',
      'showFeatures',
      'features',
    ]),
  },

  methods: {
    showDialog(value) {
      this.setShowDialogMapoteca(value);
    },

    ...mapMutations('mapoteca', ['setShowDialogMapoteca']),
  },
};
</script>

<style scoped>
.list__text {
    font-size: 0.875rem;
    margin-bottom: 3px;
    list-style: circle !important;
}
</style>
