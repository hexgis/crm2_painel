<template>
  <v-dialog
    v-model="dialog"
    color="secondary"
    width="75vw"
    persistent
    hide-overlay
    scrollable
    transition="dialog-transition"
  >
    <v-card>
      <v-toolbar
        class="background__toolbar"
        dark
        color="primary"
      >
        <h3>Analytics</h3>
        <v-spacer />
        <v-btn
          icon
          @click="closeDialog(false)"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-container fluid>
          <v-tabs>
            <v-tab v-ripple="{ center: true }">
              <span> Tabela </span>
            </v-tab>
            <v-tab-item>
              <v-container grid-list-xs>
                <v-row>
                  <v-col cols="11">
                    <div class="mb-2">
                      <v-chip
                        @click="groupByFunai()"
                      >
                        Terra Indigena
                      </v-chip>
                      <v-chip
                        @click="groupByYear()"
                      >
                        Ano
                      </v-chip>
                      <v-chip
                        @click="groupByDay()"
                      >
                        Dia
                      </v-chip>
                      <v-chip
                        @click="groupByFunaiYear()"
                      >
                        Terra Indigena e Ano
                      </v-chip>
                    </div>
                  </v-col>
                  <v-spacer />

                  <v-col>
                    <!-- <v-btn
                      color="accent"
                      :loading="isLoadingGeoJson"
                      fab
                      small
                      @click="downloadTableMonitoringAnalytics()"
                    >
                      <v-icon>mdi-download</v-icon>
                    </v-btn> -->
                  </v-col>
                </v-row>
                <v-divider class="my-2" />
                <v-data-table
                  :headers="headers"
                  :items="analyticsMonitoring"
                  :items-per-page="5"
                  class="elevation-1"
                  multi-sort
                />
              </v-container>
            </v-tab-item>
          </v-tabs>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import AnalyticsFilter from '@/components/analytics/AnalyticsFilter';
import AreaChart from '@/components/graphics/AreaChart.vue';
import PieChart from '@/components/graphics/PieChart.vue';
import BarChart from '@/components/graphics/BarChart.vue';
import RadarChart from '@/components/graphics/RadarChart.vue';
import LineChart from '@/components/graphics/LineChart.vue';
import DoughnutChart from '~/components/graphics/DoughnutChart.vue';

export default {
  name: 'AnalyticalDialog',

  components: {
    AnalyticsFilter,
    AreaChart,
    PieChart,
    BarChart,
    RadarChart,
    LineChart,
    DoughnutChart,
  },

  props: {
    value: {
      type: Boolean,
      require: true,
      default: false,
    },
    closeDialog: {
      type: Function,
      require: true,
      default: null,
    },
  },

  data() {
    return {
      dialog: false,
      chipSelected: false,
      headers: [
        { text: 'Código Funai', value: 'co_funai' },
        { text: 'Nome TI', value: 'no_ti' },
        { text: 'Ano', value: 'ano' },
        { text: 'CR Área Ha', value: 'cr_nu_area_ha' },
        { text: 'DG Área Ha', value: 'dg_nu_area_ha' },
        { text: 'DR Área Ha', value: 'dr_nu_area_ha' },
        { text: 'FF Área Ha', value: 'ff_nu_area_ha' },
        { text: 'Total Área Ha', value: 'total_nu_area_ha' },
        { text: 'TI Área Ha', value: 'ti_nu_area_ha' },
        { text: 'Data', value: 'dt_t_um' },
      ],
      filters: {
        grouping: '',
      },
      checkNewFilters: false,

    };
  },

  computed: {

    ...mapState('monitoring', [
      'analyticsMonitoring',
      'features',
    ]),

    ...mapMutations('monitoring', [
      'setanalyticsMonitoringDialog',
      'setFilters',
      'isLoadingGeoJson',
    ]),

    ...mapMutations('tableDialog', ['setshowTableDialog']),

  },

  mounted() {
    this.dialog = this.value;
  },

  methods: {
    groupByFunaiYear() {
      this.getDataAnalyticsMonitoringByFunaiYear();
    },
    groupByDay() {
      this.getDataAnalyticsMonitoringByDay();
    },
    groupByFunai() {
      this.getDataAnalyticsMonitoringByFunai();
    },
    groupByYear() {
      this.getDataAnalyticsMonitoringByYear();
    },

    ...mapActions('monitoring', [
      'getDataAnalyticsMonitoringByFunaiYear',
      'getDataAnalyticsMonitoringByDay',
      'getDataAnalyticsMonitoringByFunai',
      'getDataAnalyticsMonitoringByYear',
      'downloadTableMonitoringAnalytics',
    ]),
  },

};
</script>

<style scoped>
.v-dialog__content {
    justify-content: flex-start;
}
.background__toolbar {
    background: linear-gradient(to bottom, rgb(30, 33, 50), rgb(44, 54, 73));
}

@media (max-width: 900px) {
    .v-dialog__content {
        justify-content: center;
    }
}

@media (min-width: 901px) {
    .v-dialog__content {
        width: 55%;
    }
}

@media (min-width: 1000px) {
    .v-dialog__content {
        width: 60%;
    }
}

@media (min-width: 1200px) {
    .v-dialog__content {
        width: 66%;
    }
}

@media (min-width: 1264px) {
    .v-dialog__content {
        width: 68%;
    }
}

@media (min-width: 1600px) {
    .v-dialog__content {
        width: 75%;
    }
}

@media (min-width: 1920px) {
    .v-dialog__content {
        width: 100%;
    }
}
</style>
