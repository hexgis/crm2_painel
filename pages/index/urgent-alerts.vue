<template>
  <v-container class="overflow-auto container-height">
    <div class="tab-header flex justify-space-between">
      <h4 class="subtitle-2 text-uppercase font-weight-regular">
        {{ $t('title') }}
      </h4>
      <v-switch
        v-if="features"
        v-model="showFeaturesAlert"
        class="mt-n1 ml-5"
        hide-details
      />
    </div>

    <AlertFilter @onSearch="search()" />
    <ShowDialog />
    <div
      v-if="showFeaturesUrgentAlert && !isLoadingFeatures"
      class="px-4"
    >
      <v-divider class="mt-1" />
      <p class="font-weight-regular pt-2 grey--text text--darken-2">
        Legenda:
      </p>
      <v-col class="grey--text text--darken-2">
        <v-row class="mb-2">
          <v-icon
            class="mr-2"
            color="#965213"
          >
            mdi-square
          </v-icon>
          CR
        </v-row>
        <v-row class="mb-2">
          <v-icon
            class="mr-2"
            color="#337f1e"
          >
            mdi-square
          </v-icon>
          DR
        </v-row>
        <v-row class="mb-2">
          <v-icon
            class="mr-2"
            color="#ba1a1a"
          >
            mdi-square
          </v-icon>
          FF
        </v-row>
        <v-row class="mb-2">
          <v-icon
            class="mr-2"
            color="#e0790b"
          >
            mdi-square
          </v-icon>
          DG
        </v-row>
        <v-spacer />
      </v-col>
    </div>

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
            disabled
            color="accent"
            @click="changeVisualizationStage('chart')"
          >
            <v-icon large>
              mdi-chart-box
            </v-icon>
          </v-btn>
          <v-btn
            icon
            color="accent"
            @click="showTableAlert(true)"
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
            v-if="tableDialogAlert"
            class="d-none"
          >
            <TableDialog
              :table="tableDialogAlert"
              :value="table"
              :headers="headers"
              :loading-table="isLoadingTable"
              :loading-c-s-v="isLoadingCSV"
              :f-download-c-s-v="downloadTable"
              :f-close-table="closeTable"
              :table-name="$t('table-name')"
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
            "title": "Urgent Alerts",
            "analytics-label": "Analytics",
            "map-label": "Map",
            "table-name": "Table Urgent Alerts"
        },
        "pt-br": {
            "title": "Alerta Urgente",
            "analytics-label": "Analytics",
            "map-label": "Mapa",
            "table-name": "Tabela de Alerta Urgente"
        }
    }
</i18n>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import AlertFilter from '@/components/urgent-alerts/AlertFilter.vue';
import ShowDialog from '@/components/show-dialog/ShowDialog';
import TableDialog from '@/components/table-dialog/TableDialog.vue';

export default {
  components: { AlertFilter, ShowDialog, TableDialog },

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
        { text: 'Classe', value: 'no_estagio' },
        { text: 'Data da Imagem', value: 'dt_imagem' },
        { text: 'Área do Polígono (ha)', value: 'nu_area_ha' },
        { text: 'Latitude', value: 'nu_latitude' },
        { text: 'Longitude', value: 'nu_longitude' },
      ],
      checkNewFilters: false,
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

    showFeaturesAlert: {
      get() {
        return this.$store.state['urgent-alerts']
          .showFeaturesUrgentAlert;
      },

      set(value) {
        this.$store.commit(
          'urgent-alerts/setshowFeaturesUrgentAlert',
          value,
        );
      },
    },

    ...mapState('urgent-alerts', [
      'showFeaturesUrgentAlert',
      'features',
      'table',
      'visualizationStage',
      'tableDialogAlert',
      'isLoadingTable',
      'isLoadingCSV',
      'isLoadingFeatures',
      'total',
    ]),
  },

  methods: {
    search() {
      if (this.tableDialogAlert) {
        this.checkNewFilters = true;
        this.getDataTable();
      }
      if (!this.tableDialogAlert) this.getFeatures();
    },

    searchDataTable() {
      this.getDataTable();
    },

    changeVisualizationStage(tab) {
      this.setVisualizationStage(tab);
    },

    showTableAlert(value) {
      if (this.features) {
        this.settableDialogAlert(value);
        this.setshowTableDialog(value);
        this.getDataTable();
      }
    },

    closeTable(value) {
      if (!this.checkNewFilters) {
        this.settableDialogAlert(value);
        this.setshowTableDialog(value);
      } else {
        this.settableDialogAlert(value);
        this.setshowTableDialog(value);
        this.getFeatures();
        this.checkNewFilters = false;
      }
    },

    ...mapActions('urgent-alerts', [
      'getFeatures',
      'getDataTable',
      'downloadTable',
    ]),

    ...mapMutations('tableDialog', ['setshowTableDialog']),
    ...mapMutations('urgent-alerts', [
      'setVisualizationStage',
      'settableDialogAlert',
    ]),
  },
};
</script>

<style scoped>
.container-height {
    max-height: 90vh;
}
</style>
