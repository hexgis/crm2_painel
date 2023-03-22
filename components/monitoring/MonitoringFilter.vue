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
        v-if="filters.cr && filterOptions.tiFilters"
        class="px-3 pb-5"
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
    >
      <v-col v-show="showFeaturesMonitoring">
        <v-btn
          color="accent"
          :loading="isLoadingGeoJson"
          fab
          small
          @click="downloadGeoJsonMonitoring()"
        >
          <v-icon>mdi-download</v-icon>
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
      v-if="showFeaturesMonitoring && !isLoadingFeatures"
      class="mt-3"
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
            "polygon-label": "Polygon Count"
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
            "polygon-label": "Total de polígonos"
        }
    }
</i18n>

<script>
import { mapMutations, mapState, mapActions } from 'vuex';
import BaseDateField from '@/components/base/BaseDateField';
import legend from '@/assets/legend.png';

export default {
  name: 'MonitoringFilter',

  components: { BaseDateField },

  data() {
    return {
      isGeoserver: process.env.MONITORING_GEOSERVER === 'true',
      filters: {
        startDate: this.$moment().format('YYYY-MM-DD'),
        endDate: this.$moment().format('YYYY-MM-DD'),
        currentView: false,
        priority: null,
        cr: [],
        ti: null,
      },
      isLoadingTotal: false,
      legendData: legend,
      error: false,
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
      'showFeaturesMonitoring',
      'total',
      'isLoadingGeoJson',
    ]),
  },

  mounted() {
    this.getFilterOptions();
  },

  methods: {
    populateTiOptions(cr) {
      if (cr) this.$store.dispatch('monitoring/getTiOptions', cr);
      else this.filters.ti = null;
    },

    search() {
      if (
        (this.filters.currentView
                    && this.filters.startDate
                    && this.filters.endDate)
                || (this.filters.cr.length
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

    ...mapMutations('monitoring', ['setFilters']),
    ...mapActions('monitoring', [
      'getFilterOptions',
      'downloadGeoJsonMonitoring',
    ]),
  },
};
</script>

<style scoped lang="sass"></style>
