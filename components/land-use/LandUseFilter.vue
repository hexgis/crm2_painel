<template>
  <v-col class="px-4">
    <v-row class="px-3 py-3">
      <v-select
        v-model="filters.cr"
        label="Coordenação Regional"
        :items="filterOptions.regionalFilters"
        item-value="co_cr"
        item-text="ds_cr"
        multiple
        hide-details
        clearable
        required
        :error="errorRegional"
      />
    </v-row>

    <v-slide-y-transition>
      <v-row
        v-if="filters.cr && filterOptions.tiFilters"
        class="px-3 pb-3"
      >
        <v-select
          v-model="filters.ti"
          label="Terras Indigenas"
          :items="filterOptions.tiFilters"
          item-text="no_ti"
          item-value="co_funai"
          hide-details
          clearable
          required
          multiple
          :error="errorTi"
        />
      </v-row>
    </v-slide-y-transition>

    <v-row
      v-if="filterOptions.tiFilters && filterOptions.year"
      class="pt-1 px-3"
    >
      <v-select
        v-model="filters.year"
        label="Ano"
        :items="filterOptions.year"
        item-text="nu_ano"
        item-value="map_year"
        clearable
        multiple
        :error="errorAno"
        required
      />
    </v-row>
    <v-row
      no-gutters
      align="center"
      class="pt-3"
    >
      <v-col v-show="showFeaturesLandUse">
        <v-btn
          color="accent"
          :loading="isLoadingGeoJson"
          fab
          small
          icon
          @click="downloadGeoJsonLandUse()"
        >
          <v-icon>mdi-download</v-icon>
        </v-btn>
        <v-btn
          :loading="isLoadingTable"
          icon
          fab
          small
          color="accent"
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

      <v-col>
        <v-btn
          block
          small
          color="accent"
          :loading="isLoadingFeatures"
          @click="search()"
        >
          {{ $t('search-label') }}
        </v-btn>
      </v-col>
    </v-row>
    <v-divider
      v-if="showFeaturesLandUse && !isLoadingFeatures"
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
      <v-divider class="mt-1" />
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
            cols="4"
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
      <v-row v-if="showFeaturesLandUse && total && total.area_ha">
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
    </v-row>

    <v-row
      v-if="showFeaturesLandUse && !isLoadingFeatures"
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
      v-if="showFeaturesLandUse && !isLoadingFeatures"
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
      v-if="tableDialogLand"
      class="d-none"
    >
      <TableDialog
        :table="tableDialogLand"
        :headers="headers"
        :value="tableLandUse"
        :loading-table="isLoadingTable"
        :loading-c-s-v="isLoadingCSV"
        :table-name="$t('table-name')"
        :f-download-c-s-v="downloadTableLandUse"
        :f-close-table="closeTable"
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
            "total-area-label": "Total area",
            "heat-map-label": "Heat map",
            "polygon-label": "Total polygons count",
            "end-date-label": "End Date",
            "table-name": "Table Land Use"
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
            "table-name": "Tabela de Uso e Ocupação do Solo"
        }
    }
</i18n>

<script>
import { mapMutations, mapState, mapActions } from 'vuex';
import BaseDateField from '@/components/base/BaseDateField';
import legend from '@/assets/legend.png';
import TableDialog from '@/components/table-dialog/TableDialog.vue';

export default {
  name: 'LandUseFilter',

  components: { BaseDateField, TableDialog },

  data() {
    return {
      isGeoserver: process.env.MONITORING_GEOSERVER === 'true',
      filters: {
        currentView: false,
        year: [],
        cr: null,
        ti: null,
      },
      headers: [
        { text: 'Código Funai', value: 'co_funai' },
        { text: 'Terra Indígena', value: 'no_ti' },
        { text: 'Coordenação Regional', value: 'ds_cr' },
        { text: 'Data Cadastro', value: 'dt_cadastro' },
        { text: 'Nu Área Km2', value: 'nu_area_km2' },
        { text: 'Área do Polígono (ha)', value: 'nu_area_ha' },
      ],
      isLoadingTotal: false,
      legendData: legend,
      errorRegional: false,
      errorAno: false,
      errorTi: false,
    };
  },

  watch: {
    'filters.cr': function (value) {
      this.populateTiOptions(value);
    },

    'filters.ti': function (value) {
      this.populateYearsOptions(value);
    },

  },

  computed: {
    opacity: {
      get() {
        return this.$store.state['land-use'].opacity;
      },
      set(value) {
        this.$store.commit('land-use/setOpacity', value);
      },
    },

    heatMap: {
      get() {
        return this.$store.state['land-use'].heatMap;
      },
      set(value) {
        this.$store.commit('land-use/setHeatMap', value);
      },
    },

    ...mapState('land-use', [
      'features',
      'isLoadingGeoJson',
      'isLoadingFeatures',
      'filterOptions',
      'showFeaturesLandUse',
      'total',
      'params',
      'tableDialogLand',
      'tableLandUse',
      'isLoadingCSV',
      'isLoadingTable',
      'isLoadingFeatures',
    ]),
  },

  mounted() {
    this.getFilterOptions();
  },

  methods: {
    populateTiOptions(cr) {
      if (cr) this.$store.dispatch('land-use/getTiOptions', cr);
      else this.filters.ti = null;
    },

    populateYearsOptions(ti) {
      if (ti) this.$store.dispatch('land-use/getYearsOptions', ti);
      else this.filters.year = null;
    },

    search() {
      this.errorRegional = !this.filters.cr.length;
      this.errorAno = !this.filters.year.length;
      this.errorTi = !this.filters.ti.length;

      if (
        !this.errorRegional
        && !this.errorAno
        && !this.errorTi
      ) {
        this.setFilters(this.filters);
        this.$emit('onSearch');
      }
    },

    closeTable(value) {
      if (!this.checkNewFilters) {
        this.settableDialogLand(value);
        this.setshowTableDialog(value);
      } else {
        this.settableDialogLand(value);
        this.setshowTableDialog(value);
        this.getFeatures();
        this.checkNewFilters = false;
      }
    },

    showTableDialog(value) {
      if (this.features) {
        this.settableDialogLand(value);
        this.setshowTableDialog(value);
        this.getDataTableLandUse();
      }
    },

    ...mapMutations('tableDialog', ['setshowTableDialog']),

    ...mapMutations('land-use', ['setFilters', 'settableDialogLand', 'setshowTableDialog']),
    ...mapActions('land-use', [
      'getFilterOptions',
      'downloadGeoJsonLandUse',
      'getDataTableLandUse',
      'getFeatures',
      'downloadTableLandUse',
    ]),
  },
};
</script>

<style scoped lang="sass"></style>
