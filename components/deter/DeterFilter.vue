<template>
  <v-col class="px-4">
    <v-row class="px-3">
      <v-checkbox
        v-model="filters.currentView"
        :label="$t('current-view-label')"
      />
    </v-row>

    <v-row class="px-3 pb-3">
      <v-combobox
        v-model="filters.cr"
        label="Coordenação Regional (Todas)"
        :items="filterOptions.regionalFilters"
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
        class="px-3 pb-3"
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
    <v-row class="pt-1">
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
      <v-col v-show="showFeaturesDeter">
        <v-btn
          color="accent"
          :loading="isLoadingGeoJson"

          @click="downloadGeoJson()"
        >
          <v-icon>mdi-download</v-icon>
        </v-btn>

        <v-btn

          :loading="isLoadingGeoJson"
          color="accent"
          @click="showTableDeter(true)"
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
      <v-col>
        <v-btn
          block
          color="accent"
          :loading="isLoadingFeatures"
          @click="search"
        >
          {{ $t('search-label') }}
        </v-btn>
      </v-col>
    </v-row>
    <v-divider
      v-if="!isLoadingFeatures && showFeaturesDeter"
      class="mt-4"
    />

    <div
      v-if="isLoadingFeatures"
      class="mt-4"
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
          v-for="n in 5"
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
      v-if="total && !isLoadingFeatures"
      class="px-3 py-1 mt-7"
    >
      <v-row v-if="showFeaturesDeter && total && !isLoadingFeatures">
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
          showFeaturesDeter && total && total.area_km&& !isLoadingFeatures
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
            total.area_km.toLocaleString($i18n.locale, {
              maximumFractionDigits: 2,
            })
          }}
          km
        </v-col>
      </v-row>
    </v-row>

    <v-row
      v-if="showFeaturesDeter && !isLoadingFeatures"
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
      v-if="showFeaturesDeter && !isLoadingFeatures"
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
    <v-row
      align="center"
      justify="space-around"
    >
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
    </v-row>
  </v-col>
</template>

<i18n>
    {
        "en": {
            "search-label": "Search",
            "opacity-label": "Opacity",
            "current-view-label": "Search in current area?",
            "start-date-label": "Start Date",
            "total-area-label": "Total area",
            "heat-map-label": "Heat map",
            "polygon-label": "Polygon count",
            "end-date-label": "End Date",
            "table-name": "Deter Table"
        },
        "pt-br": {
            "search-label": "Buscar",
            "opacity-label": "Opacidade",
            "current-view-label": "Pesquisar nesta área?",
            "total-area-label": "Área total",
            "heat-map-label": "Mapa de calor",
            "polygon-label": "Total de polígonos",
            "start-date-label": "Data Início",
            "end-date-label": "Data Fim",
            "table-name": "Tabela deter"
        }
    }
</i18n>

<script>
import { mapMutations, mapState, mapActions } from 'vuex';
import BaseDateField from '@/components/base/BaseDateField';
import legend from '@/assets/legend.png';
import TableDialog from '@/components/table-dialog/TableDialog.vue';

export default {
  name: 'DeterFilter',

  components: { BaseDateField, TableDialog },

  data() {
    return {
      isGeoserver: process.env.MONITORING_GEOSERVER === 'true',
      filters: {
        startDate: this.$moment()
          .subtract(30, 'days')
          .format('YYYY-MM-DD'),
        endDate: this.$moment().format('YYYY-MM-DD'),
        currentView: false,
        cr: null,
        ti: null,
      },
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
      isLoadingTotal: false,
      legendData: legend,
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
        return this.$store.state.deter.opacity;
      },
      set(value) {
        this.$store.commit('deter/setOpacity', value);
      },
    },

    heatMap: {
      get() {
        return this.$store.state.deter.heatMap;
      },
      set(value) {
        this.$store.commit('deter/setHeatMap', value);
      },
    },

    ...mapState('deter', [
      'isLoadingGeoJson',
      'isLoadingFeatures',
      'filterOptions',
      'showFeaturesDeter',
      'total',
      'params',
      'tableDialogDeter',
      'isLoadingTable',
      'isLoadingCSV',
      'features',
      'table',
    ]),
  },

  mounted() {
    this.getFilterOptions();
  },

  methods: {
    populateTiOptions(cr) {
      if (cr) this.$store.dispatch('deter/getTiOptions', cr);
      else this.filters.ti = null;
    },

    searchDataTable() {
      this.getDataTable();
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

    search() {
      this.setFilters(this.filters);
      this.$emit('onSearch');
    },
    ...mapActions('deter', [
      'getFeatures',
      'getDataTable',
      'downloadTable',
    ]),
    ...mapMutations('tableDialog', ['setshowTableDialog']),
    ...mapMutations('deter', ['setFilters', 'settableDialogDeter', 'setVisualizationStage']),
    ...mapActions('deter', ['getFilterOptions', 'downloadGeoJson']),
  },
};
</script>

<style scoped lang="sass"></style>
