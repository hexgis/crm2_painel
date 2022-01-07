<template>
  <v-form v-model="valid">
    <v-row dense>
      <v-col cols="12">
        <v-checkbox
          v-model="filters.currentView"
          :label="$t('current-view-label')"
        />
      </v-col>

      <v-col cols="6">
        <BaseDateField
          v-model="filters.startDate"
          :label="$t('start-date-label')"
          :required="true"
          outlined
        />
      </v-col>

      <v-col cols="6">
        <BaseDateField
          v-model="filters.endDate"
          :label="$t('end-date-label')"
          :required="true"
          :min-date="filters.startDate"
          outlined
        />
      </v-col>
      <v-col cols="12">
        <v-btn
          block
          color="blue"
          :loading="isLoadingScenes"
          :disabled="!valid"
          @click="submit"
        >
          {{ $t("search-button") }}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<i18n>
{
    "en": {
        "current-view-label": "Search in current area?",
        "start-date-label": "Start date",
        "end-date-label": "End date",
        "search-button": "Search"
    },
    "pt-br": {
        "current-view-label": "Pesquisar nesta área?",
        "start-date-label": "Data inicial",
        "end-date-label": "Data final",
        "search-button": "Pesquisar"
    }
}
</i18n>

<script>
import { mapMutations, mapActions, mapState, mapGetters } from "vuex";

import BaseDateField from "@/components/base/BaseDateField";

export default {
  name: "FiltersPriority",

  components: { BaseDateField },

  data() {
    return {
      searchInput: null,
      valid: null,
      filters: {
        currentView: true,
        //modificar linha abaixo
        startDate: this.$moment().format("YYYY-MM-DD"),
        endDate: this.$moment().format("YYYY-MM-DD"),
        imageName: "",
      },
    };
  },

  created() {
    // seria o setShowFeatures no lugar do ShowScenes
    // no inspect ta retornando undifinid
    if (this.showScenes) {
      const storeFilters = this.$store.state.monitoring.filters;
      this.filters.startDate = storeFilters.startDate;
      this.filters.endDate = storeFilters.endDate;
    }
  },

  methods: {
    submit() {
      this.setFilters(this.filters);
      this.getFeatures(this.filters);
      //   this.getScenes(this.filters);
      //   this.clearScenesToCompare();
      //   this.setIsComparing(false);
    },

    ...mapMutations("monitoring", ["setFilters", "setShowFeatures"]),

    ...mapActions("monitoring", ["getFeatures"]),
  },
};
</script>
