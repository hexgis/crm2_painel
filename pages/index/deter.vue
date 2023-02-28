<template>
  <v-container class="overflow-auto container-height">
    <div class="tab-header flex justify-space-between">
      <h4 class="subtitle-2 text-uppercase font-weight-regular">
        {{ $t('title') }}
      </h4>
      <v-switch
        v-if="features"
        v-model="showFeatures"
        class="mt-n1 ml-5"
        hide-details
      />
    </div>

    <DeterFilter @onSearch="search()" />

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
      color="#FFFFFF"
      elevation="4"
    >
      <v-col>
        <v-row
          align="center"
          justify="space-around"
        >
          <v-btn
            depressed
            icon
            color="accent"
            @click="changeVisualizationStage('map')"
          >
            <v-tooltip left>
              <template #activator="{ on }">
                <v-icon
                  large
                  v-on="on"
                >
                  mdi-map
                </v-icon>
              </template>
              <span>Mapa</span>
            </v-tooltip>
          </v-btn>
          <v-btn
            icon
            color="accent"
            @click="dialog = true"
          >
            <v-icon large>
              mdi-chart-box
            </v-icon>
          </v-btn>
          <v-btn
            icon
            color="accent"
            @click="showTableDeter(true)"
          >
            <v-tooltip left>
              <template #activator="{ on }">
                <v-icon
                  large
                  v-on="on"
                >
                  mdi-table
                </v-icon>
              </template>
              <span>Tabela</span>
            </v-tooltip>
          </v-btn>
          <div
            v-if="tableDialogDeter"
            class="d-none"
          >
            <TableDialog
              :table="tableDialogDeter"
              :value="table"
              :headers="headers"
              :loading-table="isLoadingTable"
              :loading-c-s-v="isLoadingCSV"
              :f-download-c-s-v="downloadTable"
              :f-close-table="closeTable"
              :table-name="$t('table-name')"
            />
          </div>
          <div
            v-if="dialog"
            class="d-none"
          >
            <AnalyticalDialog
              :value="dialog"
              :close-dialog="closeAnalyticalDialog"
            />
          </div>
        </v-row>

        <v-row class="py-2">
          <v-divider />
        </v-row>

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
            "title": "Deter Polygons",
            "analytics-label": "Analytics",
            "map-label": "Map",
            "table-name": "Deter Table"
        },
        "pt-br": {
            "title": "Polígonos Deter",
            "analytics-label": "Analytics",
            "map-label": "Mapa",
            "table-name": "Tabela Deter"
        }
    }
</i18n>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import DeterFilter from '@/components/deter/DeterFilter';
import ShowDialog from '@/components/show-dialog/ShowDialog';
import TableDialog from '@/components/table-dialog/TableDialog.vue';
import AnalyticalDialog from '../../components/analytical-dialog/AnalyticalDialog.vue';

export default {
  name: 'DeterComponent',

  components: {
    DeterFilter, ShowDialog, TableDialog, AnalyticalDialog,
  },

  data() {
    return {
      tab: null,
      items: ['MapStage', 'AnalytcalStage'],
      text: 'Texto de teste.',
      timer: '',
      headers: [
        { text: 'Código Funai', value: 'co_funai' },
        { text: 'Terra Indígena', value: 'no_ti' },
        { text: 'Coordenação Regional', value: 'ds_cr' },
        { text: 'Área Total Km', value: 'areatotalkm' },
        { text: 'Área Mun Km', value: 'areamunkm' },
        { text: 'Área Uc Km', value: 'areauckm' },
        { text: 'Sensor Óptico', value: 'sensor' },
        { text: 'Classe', value: 'classname' },
        { text: 'Satélite', value: 'satellite' },
      ],
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
      'table',
      'visualizationStage',
      'tableDialogDeter',
      'isLoadingTable',
      'isLoadingCSV',
      'isLoadingFeatures',
      'total',
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

    searchDataTable() {
      this.getDataTable();
    },

    changeVisualizationStage(tab) {
      this.setVisualizationStage(tab);
    },

    showTableDeter(value) {
      if (this.features) {
        this.settableDialogDeter(value);
        this.setshowTableDialog(value);
        this.getDataTable();
      }
    },

    closeTable(value) {
      if (!this.checkNewFilters) {
        this.settableDialogDeter(value);
        this.setshowTableDialog(value);
      } else {
        this.settableDialogDeter(value);
        this.setshowTableDialog(value);
        this.getFeatures();
        this.checkNewFilters = false;
      }
    },

    closeAnalyticalDialog(value) {
      this.dialog = value;
    },

    // showAnalyticalDialog() {
    //   this.dialog = true;
    // },

    ...mapActions('deter', [
      'getFeatures',
      'getDataTable',
      'downloadTable',
    ]),

    ...mapMutations('tableDialog', ['setshowTableDialog']),
    ...mapMutations('deter', [
      'setVisualizationStage',
      'settableDialogDeter',
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
