<template>
  <v-container class="overflow-auto container-height">
    <div class="tab-header">
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
            O INPE enfatiza que o DETER é um sistema de alerta
            <br>
            desenvolvido para suporte à fiscalização de desmatamento.
          </span>
        </v-tooltip>
      </v-row>
      <v-switch
        v-if="features"
        v-model="showFeatures"
        class="mt-n1"
        hide-details
      />
    </div>

    <div>
      <DeterFilter @onSearch="search()" />
    </div>
    <div
      v-if="showFeaturesDeter && !isLoadingFeatures"
      class="px-4"
    >
      <v-divider />
      <p class="font-weight-regular pt-2 grey--text text--darken-2">
        Legenda:
      </p>
      <v-col class="grey--text text--darken-2">
        <v-row class="mb-2">
          <v-icon
            class="mr-2"
            color="#330000"
          >
            mdi-square
          </v-icon>
          Cicatriz de Queimada
        </v-row>
        <v-row class="mb-2">
          <v-icon
            class="mr-2"
            color="#b2b266"
          >
            mdi-square
          </v-icon>
          Desmatamento Veg
        </v-row>
        <v-row class="mb-2">
          <v-icon
            class="mr-2"
            color="#ff4dff"
          >
            mdi-square
          </v-icon>
          Cs Desordenado
        </v-row>
        <v-row class="mb-2">
          <v-icon
            class="mr-2"
            color="#cca300"
          >
            mdi-square
          </v-icon>
          Desmatamento Cr
        </v-row>
        <v-row class="mb-2">
          <v-icon
            class="mr-2"
            color="#669999"
          >
            mdi-square
          </v-icon>
          Cs Geométrico
        </v-row>
        <v-row class="mb-2">
          <v-icon
            class="mr-2"
            color="#ff8000"
          >
            mdi-square
          </v-icon>
          Degradação
        </v-row>
        <v-row class="mb-2">
          <v-icon
            class="mr-2"
            color="#cccc00"
          >
            mdi-square
          </v-icon>
          Mineração
        </v-row>
        <v-spacer />
      </v-col>
    </div>

    <ShowDialog />

    <v-footer
      absolute
      class="priority-footer"
      elevation="4"
    >
      <v-col>
        <v-row class="d-flex justify-center">
          <v-img
            max-width="200"
            src="/img/logocmr_normal.png"
          />
        </v-row>
      </v-col>
    </v-footer>
  </v-container>
</template>

<i18n>
    {
        "en": {
            "title": "Deter Polygons(INPE)"

        },
        "pt-br": {
            "title": "Polígonos Deter(INPE)"

        }
    }
</i18n>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import DeterFilter from '@/components/deter/DeterFilter';
import ShowDialog from '@/components/show-dialog/ShowDialog';

export default {
  name: 'DeterComponent',

  components: {
    DeterFilter, ShowDialog,
  },

  data() {
    return {
      tab: null,
      items: ['MapStage', 'AnalytcalStage'],
      text: 'Texto de teste.',
      timer: '',
      checkNewFilters: false,
      dialog: false,
    };
  },
  computed: {
    hasFeatures() {
      return (
        !!this.features
                && !!this.features.features
                && this.features.features.length > 0
      );
    },
    showFeatures: {
      get() {
        return this.$store.state.deter.showFeaturesDeter;
      },

      set(value) {
        this.$store.commit('deter/setShowFeatures', value);
      },
    },

    ...mapState('deter', [
      'showFeaturesDeter',
      'features',
      'tableDialogDeter',
      'isLoadingFeatures',

    ]),
  },

  methods: {
    search() {
      if (this.tableDialogDeter) {
        this.checkNewFilters = true;
        this.getDataTable();
      }
      if (!this.tableDialogDeter) this.getFeatures();
    },

    ...mapActions('deter', [
      'getFeatures',
      'getDataTable',
    ]),
    ...mapMutations('deter', [
      'setShowFeatures',
    ]),
  },
};
</script>

<style scoped>
.container-height {
    max-height: 90vh;
}
</style>
