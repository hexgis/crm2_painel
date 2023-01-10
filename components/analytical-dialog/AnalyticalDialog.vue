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
                  <!-- <v-col>
                    <div>
                      <v-select
                        v-model="selectedHeaders"
                        :items="groupingData"
                        label="Agrupar por"
                        outlined
                        return-object
                        :disabled="isLoadingFeatures"
                        @input="groupByFunai()"
                      >
                        <template #selection="{ item, index }">
                          <span>{{ item }}</span>
                        </template>
                      </v-select>
                    </div>
                  </v-col> -->

                  <v-spacer />

                  <div>
                    <span class="text-uppercase">Agrupar por</span>
                  </div>

                  <v-col cols="11">
                    <div class="mb-2">
                      <v-chip
                        :disabled="isLoadingFeatures"
                        @click="groupByFunai()"
                      >
                        Terra Indigena
                      </v-chip>
                      <v-chip
                        :disabled="isLoadingFeatures"
                        @click="groupByFunaiMonthYear()"
                      >
                        Terra Indigena, Mês e Ano
                      </v-chip>
                      <v-chip
                        :disabled="isLoadingFeatures"
                        @click="groupByMonthYear()"
                      >
                        Mês e Ano
                      </v-chip>
                      <v-chip
                        :disabled="isLoadingFeatures"
                        @click="groupByYear()"
                      >
                        Ano
                      </v-chip>
                      <v-chip
                        :disabled="isLoadingFeatures"
                        @click="groupByDay()"
                      >
                        Dia
                      </v-chip>
                      <v-chip
                        :disabled="isLoadingFeatures"
                        @click="groupByFunaiYear()"
                      >
                        Terra Indigena e Ano
                      </v-chip>
                    </div>
                  </v-col>

                  <v-spacer />

                  <v-col>
                    <div>
                      <v-select
                        v-model="selectedHeaders"
                        :items="headers"
                        label="Selecione as Colunas que Serão Apresentadas"
                        multiple
                        outlined
                        return-object
                      >
                        <template #selection="{ item, index }">
                          <v-chip v-if="index < 8">
                            <span>{{ item.text }}</span>
                          </v-chip>
                          <span
                            v-if="index === 8"
                            class="grey--text caption"
                          >(+{{ selectedHeaders.length - 8 }} colunas)</span>
                        </template>
                      </v-select>
                    </div>
                  </v-col>
                </v-row>
                <v-divider class="my-2" />
                <v-data-table
                  :headers="showHeaders"
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
        { text: 'CR Área Perc', value: 'cr_nu_area_perc' },
        { text: 'DG Área Perc', value: 'dg_nu_area_perc' },
        { text: 'DR Área Perc', value: 'dr_nu_area_perc' },
        { text: 'FF Área Perc', value: 'ff_nu_area_perc' },
      ],
      groupingHeadeers: '',
      groupingData: [
        'Terra Indigena',
        'Terra Indigena, Mês e Ano',
        'Mês e Ano',
        'Ano',
        'Dia',
        'Terra Indigena e Ano',
      ],
      selectedHeaders: [],
      filters: {
        grouping: '',
      },
      checkNewFilters: false,

    };
  },

  computed: {
    showHeaders() {
      return this.headers.filter((s) => this.selectedHeaders.includes(s));
    },

    ...mapState('monitoring', [
      'analyticsMonitoring',
      'features',
      'isLoadingFeatures',
    ]),

    ...mapMutations('monitoring', [
      'setanalyticsMonitoringDialog',
      'setFilters',
      'isLoadingGeoJson',
    ]),

    ...mapMutations('tableDialog', ['setshowTableDialog']),

  },

  created() {
    this.headers = Object.values(this.headers);
    this.selectedHeaders = this.headers;
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
    groupByMonthYear() {
      this.getDataAnalyticsMonitoringByMonthYear();
    },
    groupByFunaiMonthYear() {
      this.getDataAnalyticsMonitoringByFunaiMonthYear();
    },

    ...mapActions('monitoring', [
      'getDataAnalyticsMonitoringByFunaiYear',
      'getDataAnalyticsMonitoringByDay',
      'getDataAnalyticsMonitoringByFunai',
      'getDataAnalyticsMonitoringByYear',
      'downloadTableMonitoringAnalytics',
      'getDataAnalyticsMonitoringByPercentage',
      'getDataAnalyticsMonitoringByMonthYear',
      'getDataAnalyticsMonitoringByFunaiMonthYear',
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
