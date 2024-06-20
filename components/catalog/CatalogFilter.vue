<template>
  <v-form v-model="valid">
    <v-row dense>
      <v-col cols="12">
        <v-checkbox
          v-model="filters.currentView"
          :label="$t('current-view-label')"
        />
      </v-col>

      <v-col
        cols="12"
        class=""
      >
        <v-autocomplete
          v-model="filters.satellites"
          :label="$t('satellite-label')"
          multiple
          :items="satellites"
          item-text="name"
          item-value="identifier"
          outlined
          :search-input.sync="searchInput"
          @input="searchInput = null"
        />
      </v-col>

      <v-col class="py-0 full-width">
        <BaseDateField
          v-model="filters.startDate"
          :label="$t('start-date-label')"
          :required="true"
          outlined
        />
      </v-col>

      <v-col class="py-0 full-width">
        <BaseDateField
          v-model="filters.endDate"
          :label="$t('end-date-label')"
          :required="true"
          :min-date="filters.startDate"
          outlined
        />
      </v-col>

      <v-col cols="12">
        <v-row align="center">
          <v-col
            cols="8"
            class="pt-0 v-label teste "
          >
            {{ $t('cloud-cover-label') }}
          </v-col>

          <v-col
            cols="4"
            class="pt-0"
          >
            <v-text-field
              v-model="filters.cloudCover"
              v-mask="'###'"
              dense
              outlined
              suffix="%"
              hide-details
            />
          </v-col>
        </v-row>
        <v-slider
          v-model="filters.cloudCover"
          thumb-label
        />
      </v-col>

      <v-col cols="12">
        <v-btn
          block
          color="primary"
          outlined
          small
          :loading="isLoadingScenes"
          :disabled="!valid"
          @click="submit"
        >
          {{ $t('search-button') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<i18n>
{
    "en": {
        "current-view-label": "Search in current area?",
        "satellite-label": "Satellite",
        "start-date-label": "Start date",
        "end-date-label": "End date",
        "cloud-cover-label": "Max cloud cover",
        "search-button": "Search"
    },
    "pt-br": {
        "current-view-label": "Pesquisar nesta área?",
        "satellite-label": "Satélite",
        "start-date-label": "Data inicial",
        "end-date-label": "Data final",
        "cloud-cover-label": "Taxa máxima de nuvens",
        "search-button": "Pesquisar"
    }
}
</i18n>

<script>
import {
  mapMutations, mapActions, mapState, mapGetters,
} from 'vuex';

import BaseDateField from '@/components/base/BaseDateField';

export default {
  name: 'Filters',

  components: { BaseDateField },

  data() {
    return {
      searchInput: null,
      valid: null,
      filters: {
        satellites: [],
        currentView: true,
        startDate: this.$moment(
          process.env.CATALOG_DEFAULT_START_DATE,
        ).format('YYYY-MM-DD'),
        endDate: this.$moment().format('YYYY-MM-DD'),
        cloudCover: 100,
        imageName: '',
      },
    };
  },

  computed: {
    ...mapState('catalog', ['satellites', 'isLoadingScenes']),
    ...mapGetters('catalog', ['showScenes']),
  },

  created() {
    this.getSatellites();

    if (this.showScenes) {
      const storeFilters = this.$store.state.catalog.filters;
      this.filters.satellites = storeFilters.satellites;
      this.filters.currentView = storeFilters.currentView;
      this.filters.startDate = storeFilters.startDate;
      this.filters.endDate = storeFilters.endDate;
      this.filters.cloudCover = storeFilters.cloudCover;
      this.filters.imageName = storeFilters.imageName;
    }
  },

  methods: {
    submit() {
      this.getScenes(this.filters);
      this.clearScenesToCompare();
      this.setIsComparing(false);
    },

    ...mapMutations('catalog', ['clearScenesToCompare', 'setIsComparing']),

    ...mapActions('catalog', ['getScenes', 'getSatellites']),
  },
};
</script>

<style scoped lang="scss">
@media (max-width: 768px) {
  .full-width {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .teste {
    font-size: 0.9rem;
  }
}
</style>
