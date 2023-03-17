<template>
  <v-container
    class="overflow-auto container-height"
    color="surface"
  >
    <div class="tab-header flex justify-space-between">
      <h4 class="subtitle-2 text-uppercase font-weight-regular">
        {{ $t('title') }}
      </h4>
      <v-switch
        v-if="features"
        v-model="showFeaturesPriority"
        class="mt-n1 ml-5"
        hide-details
      />
    </div>

    <FunaiFilter @onSearch="search()" />

    <div
      v-if="showFeatures && !isLoadingFeatures"
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
            color="#9400D3"
          >
            mdi-square
          </v-icon>
          Muito Alta
        </v-row>
        <v-row class="mb-2">
          <v-icon
            class="mr-2"
            color="#FF0000"
          >
            mdi-square
          </v-icon>
          Alta
        </v-row>
        <v-row class="mb-2">
          <v-icon
            class="mr-2"
            color="#FF8C00"
          >
            mdi-square
          </v-icon>
          Média
        </v-row>
        <v-row class="mb-2">
          <v-icon
            class="mr-2"
            color="#FFD700"
          >
            mdi-square
          </v-icon>
          Baixa
        </v-row>
        <v-row class="mb-2">
          <v-icon
            class="mr-2"
            color="#008000"
          >
            mdi-square
          </v-icon>
          Muito Baixa
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
            @click="showTablePriority(true)"
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
            v-if="tableDialogPriority"
            class="d-none"
          >
            <TableDialog
              :table="tableDialogPriority"
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
            "title": "Priority Polygons",
            "analytics-label": "Analytics",
            "map-label": "Map",
            "table-name": "Priority Table"
        },
        "pt-br": {
            "title": "Polígonos Prioritários",
            "analytics-label": "Analytics",
            "map-label": "Mapa",
            "table-name": "Tabela de Prioridade"
        }
    }
</i18n>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import FunaiFilter from '@/components/priority/PriorityFilter';
import ShowDialog from '@/components/show-dialog/ShowDialog';
import TableDialog from '@/components/table-dialog/TableDialog.vue';
import AnalyticalDialog from '../../components/analytical-dialog/AnalyticalDialog.vue';

export default {
  name: 'PriorityComponent',

  components: {
    FunaiFilter, ShowDialog, TableDialog, AnalyticalDialog,
  },

  data() {
    return {
      item: [],

      tab: null,
      selected: [],
      items: ['MapStage', 'AnalytcalStage'],
      text: 'Texto de teste.',
      timer: '',
      headers: [
        { text: 'Identificador', value: 'id' },
        { text: 'Código Funai', value: 'co_funai' },
        { text: 'Terra Indígena', value: 'no_ti' },
        { text: 'Coordenação Regional', value: 'ds_cr' },
        { text: 'Classe', value: 'no_estagio' },
        { text: 'Data da Imagem', value: 'dt_imagem' },
        { text: 'Área do Polígono (ha)', value: 'nu_area_ha' },
        { text: 'Latitude', value: 'nu_latitude' },
        { text: 'Longitude', value: 'nu_longitude' },
        { text: 'Prioridade', value: 'prioridade' },
        { text: 'Ações', value: 'actions' },
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
    showFeaturesPriority: {
      get() {
        return this.$store.state.priority.showFeatures;
      },

      set(value) {
        this.$store.commit('priority/setShowFeatures', value);
      },
    },
    ...mapState('priority', [
      'showFeatures',
      'features',
      'table',
      'visualizationStage',
      'tableDialogPriority',
      'isLoadingTable',
      'isLoadingCSV',
      'isLoadingFeatures',
      'total',
    ]),
  },

  methods: {
    search() {
      if (this.tableDialogPriority) {
        this.checkNewFilters = true;
        this.getDataTable();
      }
      if (!this.tableDialogPriority) this.getFeatures();
    },

    searchDataTable() {
      this.getDataTable();
    },

    changeVisualizationStage(tab) {
      this.setVisualizationStage(tab);
    },

    showTablePriority(value) {
      if (this.features) {
        this.settableDialogPriority(value);
        this.setshowTableDialog(value);
        this.getDataTable();
      }
    },

    closeTable(value) {
      if (!this.checkNewFilters) {
        this.settableDialogPriority(value);
        this.setshowTableDialog(value);
      } else {
        this.settableDialogPriority(value);
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

    ...mapActions('priority', [
      'getFeatures',
      'getDataTable',
      'downloadTable',
    ]),

    ...mapMutations('tableDialog', ['setshowTableDialog']),
    ...mapMutations('priority', [
      'setVisualizationStage',
      'settableDialogPriority',
    ]),
  },
};
</script>

<style scoped>
.container-height {
    max-height: 90vh;
}
.selected {
    background-color: red
}
</style>
