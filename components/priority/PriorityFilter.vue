<template>
  <v-col class="px-4">
    <v-row class="px-3">
      <v-checkbox
        v-model="filters.currentView"
        :label="$t('current-view-label')"
      />
    </v-row>

    <v-row class="px-3 pb-1">
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

    <v-row class="px-3 pb-1">
      <v-select
        v-model="filters.priority"
        label="Prioridade (Todas)"
        :items="filterOptions.priority"
        item-text="no_pr"
        item-value="co_pr"
        clearable
        multiple
      />
    </v-row>

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
      <v-col v-show="showFeatures">
        <v-btn
          color="accent"
          :loading="isLoadingGeoJson"
          fab
          small
          @click="downloadGeoJson()"
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
      v-if="!isLoadingFeatures && showFeatures"
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
      <v-row v-if="showFeatures && total">
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
          showFeatures && total && total.area_ha && !isLoadingFeatures
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
    </v-row>

    <v-row
      v-if="showFeatures && !isLoadingFeatures"
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
      v-if="showFeatures && !isLoadingFeatures"
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
    </v-divider>
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
            "polygon-label": "Polygon Count",
            "end-date-label": "End Date"
        },
        "pt-br": {
            "search-label": "Buscar",
            "opacity-label": "Opacidade",
            "current-view-label": "Pesquisar nesta área?",
            "total-area-label": "Área total",
            "heat-map-label": "Mapa de Calor",
            "polygon-label": "Total de polígonos",
            "start-date-label": "Data Início",
            "end-date-label": "Data Fim"
        }
    }
</i18n>

<script>
import { mapMutations, mapState, mapActions } from 'vuex';
import BaseDateField from '@/components/base/BaseDateField';
import legend from '@/assets/legend.png';

export default {
  name: 'FunaiFilter',

  components: { BaseDateField },

  data() {
    return {
      isGeoserver: process.env.MONITORING_GEOSERVER === 'true',
      filters: {
        startDate: this.$moment()
          .subtract(30, 'days')
          .format('YYYY-MM-DD'),
        endDate: this.$moment().format('YYYY-MM-DD'),
        currentView: false,
        priority: null,
        cr: null,
        ti: null,
      },
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
        return this.$store.state.priority.opacity;
      },
      set(value) {
        this.$store.commit('priority/setOpacity', value);
      },
    },

    heatMap: {
      get() {
        return this.$store.state.priority.heatMap;
      },
      set(value) {
        this.$store.commit('priority/setHeatMap', value);
      },
    },

    ...mapState('priority', [
      'isLoadingGeoJson',
      'isLoadingFeatures',
      'filterOptions',
      'showFeatures',
      'total',
      'params',
    ]),
  },

  mounted() {
    this.getFilterOptions();
  },

  methods: {
    populateTiOptions(cr) {
      if (cr) this.$store.dispatch('priority/getTiOptions', cr);
      else this.filters.ti = null;
    },

    search() {
      this.setFilters(this.filters);
      this.$emit('onSearch');
    },
    ...mapMutations('priority', ['setFilters']),
    ...mapActions('priority', ['getFilterOptions', 'downloadGeoJson']),
  },
};
</script>

<style scoped lang="sass"></style>
