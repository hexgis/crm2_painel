<template>
  <v-col class="px-4">
    <v-row class="px-3">
      <v-checkbox
        v-model="filters.currentView"
        :label="$t('current-view-label')"
        :error="error"
      />
    </v-row>
    <v-row class="px-3 pb-5">
      <v-combobox
        v-model="filters.cr"
        label="Coordenação Regional (Todas)"
        :items="filterOptions.regionalFilters"
        item-value="co_cr"
        item-text="ds_cr"
        hide-details
        clearable
        multiple
        :error="error"
      />
    </v-row>
    <v-slide-y-transition>
      <v-row
        class="px-3 pb-3"
      >
        <v-combobox
          v-model="filters.ti"
          label="Terras Indigenas"
          :items="filterOptions.tiFilters"
          item-text="no_ti"
          item-value="co_funai"
          hide-details
          required
          multiple
          clearable
          :error="error"
        />
      </v-row>
    </v-slide-y-transition>
    <v-row class="pt-1">
      <v-col class="py-0">
        <BaseDateField
          v-model="filters.startDate"
          :label="$t('start-date-label')"
          required
          outlined
        />
      </v-col>
      <v-col class="py-0">
        <BaseDateField
          v-model="filters.endDate"
          :label="$t('end-date-label')"
          required
          :min-date="filters.startDate"
          outlined
        />
      </v-col>
    </v-row>
    <v-row
      no-gutters
      align="center"
    >
      <v-col
        v-show="showFeaturesMonitoring"
      >
        <v-btn
          color="accent"
          :loading="isLoadingGeoJson"
          icon
          small
          @click="downloadGeoJsonMonitoring()"
        >
          <v-tooltip left>
            <template #activator="{ on }">
              <v-icon

                v-on="on"
              >
                mdi-download
              </v-icon>
            </template>
            <span>Download</span>
          </v-tooltip>
        </v-btn>
        <v-btn
          :loading="isLoadingStatistic "
          small
          color="accent"
          icon
          @click="showTableDialogAnalytics(true), dialog = true"
        >
          <v-tooltip left>
            <template #activator="{ on }">
              <v-icon

                v-on="on"
              >
                mdi-chart-box
              </v-icon>
            </template>
            <span>Estatística</span>
          </v-tooltip>
        </v-btn>

        <v-btn
          small
          :loading="isLoadingTableMonitoring"
          color="accent"
          icon
          @click="showTableDialog(true)"
        >
          <v-tooltip left>
            <template #activator="{ on }">
              <v-icon

                v-on="on"
              >
                mdi-table
              </v-icon>
            </template>
            <span>Tabela</span>
          </v-tooltip>
        </v-btn>
      </v-col>

      <v-col
        v-if="showFeaturesMonitoring"
        class="ml-5"
      >
        <v-btn
          block
          small
          color="accent"
          :loading="isLoadingFeatures"
          @click="search"
        >
          {{ $t('search-label') }}
        </v-btn>
      </v-col>
      <v-col v-if="!showFeaturesMonitoring">
        <v-btn
          block
          small
          color="accent"
          :loading="isLoadingFeatures"
          @click="search"
        >
          {{ $t('search-label') }}
        </v-btn>
      </v-col>
    </v-row>
    <v-divider
      v-if="showFeaturesMonitoring && !isLoadingFeatures"
      class="mt-4"
    />

    <div
      v-if="isLoadingFeatures"
      class="mt-1"
    >
      <v-row
        no-gutters
        justify="center"
      >
        <v-col cols="6">
          <v-skeleton-loader type="table-cell@4" />
        </v-col>
        <v-col cols="6">
          <div class="d-flex justify-end">
            <v-skeleton-loader type="table-cell@4" />
          </div>
        </v-col>
      </v-row>
      <v-divider class="mt-1" />
      <div>
        <v-skeleton-loader type="table-cell" />
        <v-row
          v-for="n in 4"
          :key="n"
          no-gutters
          align="center"
          class="mb-4"
        >
          <v-col cols="1">
            <v-skeleton-loader
              width="20"
              height="20"
              tile
              type="avatar"
            />
          </v-col>

          <v-col
            cols="10"
          >
            <v-skeleton-loader type="text" />
          </v-col>
        </v-row>
      </div>
    </div>

    <v-row
      v-if="showFeaturesMonitoring && total && !isLoadingFeatures"
      class="mt-3"
    >
      <v-col
        cols="7"
        class="grey--text text--darken-2"
      >
        {{ $t('polygon-label') }}:
      </v-col>
      <v-col
        cols="5"
        class="text-right grey--text text--darken-2"
      >
        {{ total.total }}
      </v-col>
    </v-row>

    <v-row
      v-if="
        showFeaturesMonitoring &&
          total &&
          total.area_ha &&
          !isLoadingFeatures
      "
    >
      <v-col
        cols="7"
        class="grey--text text--darken-2"
      >
        {{ $t('total-area-label') }}:
      </v-col>
      <v-col
        cols="5"
        class="text-right grey--text text--darken-2"
      >
        {{
          total.area_ha.toLocaleString($i18n.locale, {
            maximumFractionDigits: 2,
          })
        }}
        ha
      </v-col>
    </v-row>
    <v-row
      v-if="showFeaturesMonitoring && !isLoadingFeatures"
      align="center"
    >
      <v-col
        cols="4"
        class="grey--text text--darken-2"
      >
        {{ $t('opacity-label') }}
      </v-col>
      <v-col cols="8">
        <v-slider
          v-model="opacity"
          hide-details
          thumb-label
        />
      </v-col>
    </v-row>
    <v-row
      v-if="showFeaturesMonitoring && !isLoadingFeatures"
      align="center"
      justify="space-between"
    >
      <v-col>
        <span class="grey--text text--darken-2">
          {{ $t('heat-map-label') }}
        </span>
      </v-col>
      <v-col
        cols="3"
        class="d-flex justify-end"
      >
        <v-switch
          v-model="heatMap"
          class="mt-0 pt-0"
          hide-details
        />
      </v-col>
    </v-row>

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
    <div
      v-if="dialog"
      class="d-none"
    >
      <AnalyticalDialog
        :value="analyticsMonitoringDialog"
        :close-dialog="closeAnalyticalDialog"
      />
    </div>
  </v-col>
</template>

  <i18n>
    {
    "en": {
    "monitoring-label": "Daily Monitoring",
    "search-label": "Search",
    "opacity-label": "Opacity",
    "current-view-label": "Search in current area?",
    "start-date-label": "Start Date",
    "end-date-label": "End Date",
    "total-area-label": "Total Area",
    "heat-map-label": "Heat Map",
    "polygon-label": "Polygon Count",
    "table-name": "Monitoring Table"
    },
    "pt-br": {
    "monitoring-label": "Monitoramento Diário",
    "search-label": "Buscar",
    "opacity-label": "Opacidade",
    "current-view-label": "Pesquisar nesta área?",
    "start-date-label": "Data Início",
    "end-date-label": "Data Final",
    "total-area-label": "Área total",
    "heat-map-label": "Mapa de Calor",
    "polygon-label": "Total de polígonos",
    "table-name": "Tabela de monitoramento"
    }
    }
  </i18n>

<script>
import { mapMutations, mapState, mapActions } from 'vuex';
import BaseDateField from '@/components/base/BaseDateField';
import legend from '@/assets/legend.png';
import TableDialog from '@/components/table-dialog/TableDialog.vue';
import AnalyticalDialog from '../analytical-dialog/AnalyticalDialog.vue';

export default {
  name: 'MonitoringFilter',

  components: {
    BaseDateField,
    TableDialog,
    AnalyticalDialog,
  },

  data() {
    return {
      isGeoserver: process.env.MONITORING_GEOSERVER === 'true',
      filters: {
        startDate: this.$moment().format('YYYY-MM-DD'),
        endDate: this.$moment().format('YYYY-MM-DD'),
        currentView: false,
        cr: [],
        ti: [],
      },
      isLoadingTotal: false,
      legendData: legend,
      error: false,
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
  watch: {
    'filters.cr': function (value) {
      const arrayCrPoulate = [];
      Object.values(value).forEach((item) => {
        arrayCrPoulate.push(item.co_cr);
      });
      this.populateTiOptions(arrayCrPoulate);
    },
  },

  computed: {
    opacity: {
      get() {
        return this.$store.state.monitoring.opacity;
      },

      set(value) {
        this.$store.commit('monitoring/setOpacity', value);
      },
    },

    heatMap: {
      get() {
        return this.$store.state.monitoring.heatMap;
      },

      set(value) {
        this.$store.commit('monitoring/setHeatMap', value);
      },
    },

    ...mapState('monitoring', [
      'isLoadingFeatures',
      'filterOptions',
      'features',
      'showFeaturesMonitoring',
      'total',
      'analyticsMonitoring',
      'isLoadingGeoJson',
      'tableDialogMonitoring',
      'tableMonitoring',
      'isLoadingTableMonitoring',
      'isLoadingCSVMonitoring',
      'isLoadingStatistic',
      'analyticsMonitoringDialog',

    ]),
  },

  mounted() {
    this.getFilterOptions();
    this.getTiTotal();
  },

  methods: {
    populateTiOptions(cr) {
      if (cr) this.$store.dispatch('monitoring/getTiOptions', cr);
      else this.filters.ti = null;
    },

    closeAnalyticalDialog(value) {
      this.dialog = value;
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

    showTableDialog(value) {
      if (this.features) {
        this.settableDialogMonitoring(value);
        this.setshowTableDialog(value);
        this.getDataTableMonitoring();
      }
    },

    showTableDialogAnalytics(value) {
      if (this.features) {
        this.setanalyticsMonitoringDialog(value);
        this.getDataAnalyticsMonitoringByFunaiYear();
      }
    },

    search() {
      if (
        (this.filters.currentView
    && this.filters.startDate
    && this.filters.endDate)
    || (this.filters.cr.length
    && this.filters.startDate
    && this.filters.endDate)
    || (this.filters.ti.length
    && this.filters.startDate
    && this.filters.endDate)
      ) {
        this.error = false;
        this.setFilters(this.filters);
        this.$emit('onSearch');
        return;
      }
      this.error = true;
    },
    ...mapMutations('tableDialog', ['setshowTableDialog']),
    ...mapMutations('monitoring', ['setFilters', 'settableDialogMonitoring',
      'setLoadingTable', 'setLoadingStatistic', 'setanalyticsMonitoringDialog']),
    ...mapActions('monitoring', [
      'getFilterOptions',
      'getTiTotal',
      'getFeatures',
      'getDataAnalyticsMonitoringByDay',
      'downloadGeoJsonMonitoring',
      'downloadTableMonitoring',
      'getDataTableMonitoring',
      'getDataAnalyticsMonitoringByFunaiYear',
    ]),
  },
};
</script>
