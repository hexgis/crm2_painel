<template>
  <v-container class="overflow-auto container-height">
    <div class="tab-header flex justify-space-between">
      <h4 class="subtitle-2 text-uppercase font-weight-regular">
        {{ $t('title') }}
      </h4>
      <v-switch
        v-if="features"
        v-model="featuresMonitoring"
        class="mt-n1 ml-5"
        hide-details
      />
    </div>

    <ShowDialog />

    <v-container class="pa-0">
      <v-list
        v-if="!$fetchState.pending"
        expand
      >
        <template v-for="group in orderedSupportLayersGroups">
          <SupportLayersGroupAntropismo
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
    <v-divider />
    <div>
      <MonitoringFilter @onSearch="search()" />
    </div>
    <div
      v-if="showFeaturesMonitoring && !isLoadingFeatures"
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
            color="#990099"
          >
            mdi-square
          </v-icon>
          Desmatamento em Regeneração
        </v-row>
        <v-row class="mb-2">
          <v-icon
            class="mr-2"
            color="#b35900"
          >
            mdi-square
          </v-icon>
          Fogo em Floresta
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
            color="#ff3333"
          >
            mdi-square
          </v-icon>
          Corte Raso
        </v-row>
        <v-spacer />
      </v-col>
    </div>
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
            @click="showTableDialog(true)"
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
            v-if="tableDialogMonitoring"
            class="d-none"
          >
            <TableDialog
              :table="tableDialogMonitoring"
              :headers="headers"
              :value="tableMonitoring"
              :loading-table="isLoadingTableMonitoring"
              :loading-c-s-v="isLoadingCSVMonitoring"
              :f-download-c-s-v="downloadTableMonitoring"
              :table-name="$t('table-name')"
              :f-close-table="closeTable"
            />
          </div>
        </v-row>
        <div
          v-if="dialog"
          class="d-none"
        >
          <AnalyticalDialog
            :value="dialog"
            :close-dialog="closeAnalyticalDialog"
          />
        </div>
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
            "title": "Monitoring",
            "analytics-label": "Analytics",
            "map-label": "Map",
            "table-name": "Monitoring Table"
        },
        "pt-br": {
            "title": "Monitoramento Diário",
            "analytics-label": "Analytics",
            "map-label": "Mapa",
            "table-name": "Tabela de Monitoramento"
        }
    }
</i18n>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import _ from 'lodash';
import MonitoringFilter from '@/components/monitoring/MonitoringFilter';
import ShowDialog from '@/components/show-dialog/ShowDialog';
import SupportLayersGroupAntropismo from '@/components/support/SupportLayersGroupAntropismo';
import TableDialog from '@/components/table-dialog/TableDialog.vue';
import AnalyticalDialog from '../../components/analytical-dialog/AnalyticalDialog.vue';

export default {
  components: {
    MonitoringFilter,
    ShowDialog,
    SupportLayersGroupAntropismo,
    TableDialog,
    AnalyticalDialog,
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
        { text: 'Classe', value: 'no_estagio' },
        { text: 'Data da Imagem', value: 'dt_imagem' },
        { text: 'Área do Polígono (ha)', value: 'nu_area_ha' },
        { text: 'Latitude', value: 'nu_latitude' },
        { text: 'Longitude', value: 'nu_longitude' },
      ],
      dialog: false,
      checkNewFilters: false,
    };
  },

  async fetch() {
    if (!Object.keys(this.supportCategoryGroupsAntropismo).length) {
      await this.$store.dispatch(
        'supportLayers/getCategoryGroupsAntropismo',
      );
    }
  },
  computed: {
    hasFeatures() {
      return (
        !!this.features
                && !!this.features.features
                && this.features.features.length > 0
      );
    },

    featuresMonitoring: {
      get() {
        return this.$store.state.monitoring.showFeaturesMonitoring;
      },

      set(value) {
        this.$store.commit(
          'monitoring/setshowFeaturesMonitoring',
          value,
        );
      },
    },

    orderedSupportLayersGroups() {
      return _.sortBy(this.supportCategoryGroupsAntropismo, 'order');
    },

    showFeaturesAntropismo: {
      get() {
        return this.$store.state.supportLayers.showFeaturesSupportLayers;
      },
      set(value) {
        this.$store.commit(
          'supportLayers/setshowFeaturesSupportLayers',
          value,
        );
      },
    },

    ...mapState('supportLayers', [
      'supportCategoryGroupsAntropismo',
      'loading',
    ]),

    ...mapState('monitoring', [
      'showFeaturesMonitoring',
      'analyticsMonitoring',
      'features',
      'total',
      'visualizationStage',
      'isLoadingTableMonitoring',
      'tableDialogMonitoring',
      'tableMonitoring',
      'isLoadingCSVMonitoring',
      'isLoadingFeatures',
    ]),
  },

  methods: {
    search() {
      if (this.tableDialogMonitoring) {
        this.checkNewFilters = true;
        this.getDataTableMonitoring();
        this.getDataAnalyticsMonitoring();
      }
      if (this.analyticsMonitoring) {
        this.checkNewFilters = true;
        this.getDataAnalyticsMonitoring();
      }
      if (!this.tableDialogMonitoring) this.getFeatures();
    },

    changeVisualizationStage(tab) {
      this.setVisualizationStage(tab);
    },

    closeAnalyticalDialog(value) {
      this.dialog = value;
    },

    showTableDialog(value) {
      if (this.features) {
        this.settableDialogMonitoring(value);
        this.setshowTableDialog(value);
        this.getDataTableMonitoring();
      }
    },
    closeTableAnalytics(value) {
      if (!this.checkNewFilters) {
        this.setanalyticsMonitoringDialog(value);
        this.setshowTableDialog(value);
      } else {
        this.setanalyticsMonitoringDialog(value);
        this.setshowTableDialog(value);
        this.checkNewFilters = false;
      }
    },

    showTableDialogAnalytics(value) {
      if (this.features) {
        this.setshowTableDialog(value);
        this.getDataAnalyticsMonitoring();
      }
    },

    closeTable(value) {
      if (!this.checkNewFilters) {
        this.settableDialogMonitoring(value);
        this.setshowTableDialog(value);
      } else {
        this.settableDialogMonitoring(value);
        this.setshowTableDialog(value);
        this.getFeatures();
        this.checkNewFilters = false;
      }
    },

    ...mapActions('monitoring', [
      'getFeatures',
      'getDataTableMonitoring',
      'downloadTableMonitoring',
      'getDataAnalyticsMonitoring',
    ]),

    ...mapMutations('priority', ['setVisualizationStage']),

    ...mapMutations('tableDialog', ['setshowTableDialog']),

    ...mapMutations('monitoring', [
      'settableDialogMonitoring',
      'setLoadingTable',
    ]),
  },
};
</script>

<style scoped>
.container-height {
    max-height: 90vh;
}
</style>
