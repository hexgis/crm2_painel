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

    <div>
      <MonitoringFilter @onSearch="search()" />
    </div>
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
    <ShowDialog />
    <v-footer
      absolute
      class="priority-footer"
      color="#FFFFFF"
      elevation="4"
    >
      <v-col>
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
            "title": "Monitoring"

        },
        "pt-br": {
            "title": "Monitoramento Diário"

        }
    }
</i18n>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import _ from 'lodash';
import MonitoringFilter from '@/components/monitoring/MonitoringFilter';
import ShowDialog from '@/components/show-dialog/ShowDialog';

export default {
  components: {
    MonitoringFilter,
    ShowDialog,
  },

  data() {
    return {
      tab: null,
      items: ['MapStage', 'AnalytcalStage'],
      text: 'Texto de teste.',
      timer: '',
      dialog: false,
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
      'isLoadingStatistic',
      'analyticsMonitoringDialog',
    ]),
  },

  methods: {
    search() {
      if (this.tableDialogMonitoring) {
        this.checkNewFilters = true;
        this.getDataTableMonitoring();
      }
      if (this.analyticsMonitoringDialog) {
        this.checkNewFilters = true;
        this.isLoadingStatistic = true;
        this.getDataAnalyticsMonitoringByFunaiYear();
      }
      if (!this.tableDialogMonitoring) this.getFeatures();
    },

    ...mapActions('monitoring', [
      'getFeatures',
      'getDataTableMonitoring',
      'downloadTableMonitoring',
      'getDataAnalyticsMonitoringByDay',
      'getDataAnalyticsMonitoringByFunaiYear',
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
