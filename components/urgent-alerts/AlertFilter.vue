<template>
  <v-col class="px-4">
    <v-row class="px-3">
      <v-checkbox
        v-model="filters.currentView"
        :label="$t('current-view-label')"
      />
    </v-row>
    <v-row class="px-3 pb-1 py-3">
      <v-combobox
        v-model="filters.cr"
        label="Coordenação Regional (Todas)"
        :items="flattened"
        item-value="co_cr"
        item-text="ds_cr"
        hide-details
        clearable
        multiple
      />
    </v-row>

    <v-slide-y-transition>
      <v-row
        v-if="filters.cr && filterOptions.tiFilters"
        class="px-3 pb-1"
      >
        <v-combobox
          v-model="filters.ti"
          label="Terras Indigenas (Todas)"
          :items="filterOptions.tiFilters"
          item-text="no_ti"
          item-value="co_funai"
          clearable
          multiple
          hide-details
        />
      </v-row>
    </v-slide-y-transition>

    <v-row class="pt-5">
      <v-col class="py-0">
        <BaseDateField
          v-model="filters.startDate"
          :label="$t('start-date-label')"
          :required="true"
          outlined
        />
      </v-col>

      <v-col class="py-0">
        <BaseDateField
          v-model="filters.endDate"
          :label="$t('end-date-label')"
          :required="true"
          :min-date="filters.startDate"
          outlined
        />
      </v-col>
    </v-row>

    <v-row
      no-gutters
      align="center"
    >
      <v-col v-show="showFeaturesUrgentAlert">
        <v-btn
          color="accent"
          :loading="isLoadingGeoJson"
          icon
          small
          @click="downloadGeoJson()"
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
          :loading="isLoadingTable"
          small
          icon
          color="accent"
          @click="showTableAlert(true)"
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
      <v-col v-if="!showFeaturesUrgentAlert">
        <v-btn
          small
          block
          color="primary"
          outlined
          :loading="isLoadingFeatures"
          @click="search"
        >
          {{ $t('search-label') }}
        </v-btn>
      </v-col>
      <v-col
        v-if="showFeaturesUrgentAlert"
        class="ml-6"
      >
        <v-btn
          small
          block
          color="primary"
          outlined
          :loading="isLoadingFeatures"
          @click="search"
        >
          {{ $t('search-label') }}
        </v-btn>
      </v-col>
    </v-row>
    <v-divider
      v-if="showFeaturesUrgentAlert && !isLoadingFeatures"
      class="mt-4"
    />
    <div
      v-if="isLoadingFeatures"
      class="mt-5"
    >
      <v-row justify="center">
        <v-col cols="6">
          <v-skeleton-loader type="table-cell@4" />
        </v-col>
        <v-col cols="6">
          <div class="d-flex justify-end">
            <v-skeleton-loader type="table-cell@4" />
          </div>
        </v-col>
      </v-row>
      <v-divider />
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
            class="mt-1"
          >
            <v-skeleton-loader type="text" />
          </v-col>
        </v-row>
      </div>
    </div>

    <v-row
      v-if="showFeaturesUrgentAlert && total"
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
        class="text-right"
      >
        {{ total.total }}
      </v-col>
    </v-row>

    <v-row
      v-if="
        showFeaturesUrgentAlert &&
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
        class="text-right"
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
      v-if="showFeaturesUrgentAlert && !isLoadingFeatures"
      align="center"
    >
      <v-col
        cols="4"
        class="grey--text text--darken-2 mt-1"
      >
        {{ $t('opacity-label') }}
      </v-col>
      <v-col cols="8">
        <v-slider
          v-model="opacity"
          class="my-n2"
          hide-details
          thumb-label
        />
      </v-col>
    </v-row>

    <v-row
      v-if="showFeaturesUrgentAlert && !isLoadingFeatures"
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
  </v-col>
</template>

<i18n>
    {
        "en": {
            "search-label": "Search",
            "opacity-label": "Opacity",
            "current-view-label": "Search in current area?",
            "start-date-label": "Start Date",
            "total-area-label": "Total Area",
            "heat-map-label": "Heat Map",
            "polygon-label": "Polygon count",
            "end-date-label": "End Date",
            "table-name": "Urgent Alerts"
        },
        "pt-br": {
            "search-label": "Buscar",
            "opacity-label": "Opacidade",
            "current-view-label": "Pesquisar nesta área?",
            "total-area-label": "Área total",
            "heat-map-label": "Mapa de Calor",
            "polygon-label": "Total de polígonos",
            "start-date-label": "Data Início",
            "end-date-label": "Data Fim",
            "table-name": "Alertas Urgentes"
        }
    }
</i18n>

<script>
import { mapMutations, mapState, mapActions } from 'vuex';
import BaseDateField from '@/components/base/BaseDateField';
import legend from '@/assets/legend.png';
import TableDialog from '@/components/table-dialog/TableDialog.vue';

export default {
  name: 'AlertFilter',

  components: { BaseDateField, TableDialog },

  data() {
    return {
      isGeoserver: process.env.MONITORING_GEOSERVER === 'true',
      filters: {
        startDate: this.$moment()
          .subtract(30, 'days')
          .format('YYYY-MM-DD'),
        endDate: this.$moment().format('YYYY-MM-DD'),
        cr: [],
        ti: null,
      },
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
      isLoadingTotal: false,
      legendData: legend,
      flattened: [],
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
    'filterOptions.regionalFilters': function () {
      this.populateCrOptions();
    },
  },

  computed: {
    opacity: {
      get() {
        return this.$store.state['urgent-alerts'].opacity;
      },
      set(value) {
        this.$store.commit('urgent-alerts/setOpacity', value);
      },
    },

    heatMap: {
      get() {
        return this.$store.state['urgent-alerts'].heatMap;
      },
      set(value) {
        this.$store.commit('urgent-alerts/setHeatMap', value);
      },
    },

    ...mapState('urgent-alerts', [
      'isLoadingGeoJson',
      'isLoadingFeatures',
      'filterOptions',
      'showFeaturesUrgentAlert',
      'total',
      'params',
      'tableDialogAlert',
      'table',
      'isLoadingTable',
      'isLoadingCSV',
      'features',
    ]),
  },

  mounted() {
    this.getFilterOptions();
  },

  methods: {
    populateCrOptions() {
      const groups = {};

      this.filterOptions.regionalFilters.forEach((x) => {
        groups[x.no_regiao] = groups[x.no_regiao] || { ds_cr: x.ds_cr, list: [] };

        groups[x.no_regiao].list.push(x);
      });

      Object.keys(groups).forEach((categoryId) => {
        const category = groups[categoryId];
        const categoryRegiao = categoryId;
        this.flattened.push({ header: categoryRegiao });
        this.flattened.push(...category.list);
      });

      return this.flattened;
    },

    populateTiOptions(cr) {
      if (cr) this.$store.dispatch('urgent-alerts/getTiOptions', cr);
      else this.filters.ti = null;
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

    showTableAlert(value) {
      if (this.features) {
        this.settableDialogAlert(value);
        this.setshowTableDialog(value);
        this.getDataTable();
      }
    },

    search() {
      this.setFilters(this.filters);
      this.$emit('onSearch');
    },

    ...mapMutations('urgent-alerts', ['setFilters', 'settableDialogAlert']),
    ...mapMutations('tableDialog', ['setshowTableDialog']),
    ...mapActions('urgent-alerts', ['getFilterOptions', 'downloadGeoJson', 'downloadTable', 'getDataTable', 'getFeatures']),
  },
};
</script>

<style scoped lang="sass"></style>
