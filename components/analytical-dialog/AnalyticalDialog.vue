<template>
  <v-dialog
    v-model="dialog"
    width="75vw"
    persistent
    hide-overlay
    scrollable
    color="primary"

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
      <v-container fluid>
        <v-container grid-list-xs>
          <v-row>
            <v-col cols="11">
              <div>
                <span class="text-uppercase">Agrupar por:</span>
              </div>
              <div class="mb-2">
                <v-btn
                  :class="btn_ti"
                  :disabled="isLoadingFeatures"
                  @click="groupByFunai()"
                >
                  Terra Indigena
                </v-btn>
                <v-btn
                  :class="btn_ti_month_year"
                  :disabled="isLoadingFeatures"
                  @click="groupByFunaiMonthYear()"
                >
                  Terra Indigena, Mês e Ano
                </v-btn>
                <v-btn
                  :class="btn_month_year"
                  :disabled="isLoadingFeatures"
                  @click="groupByMonthYear()"
                >
                  Mês e Ano
                </v-btn>
                <v-btn
                  :class="btn_year"
                  :disabled="isLoadingFeatures"
                  @click="groupByYear()"
                >
                  Ano
                </v-btn>
                <v-btn
                  :class="btn_day"
                  :disabled="isLoadingFeatures"
                  @click="groupByDay()"
                >
                  Dia
                </v-btn>
                <v-btn
                  :class="btn_ti_year"
                  :disabled="isLoadingFeatures"
                  @click="groupByFunaiYear()"
                >
                  Terra Indigena e Ano
                </v-btn>
              </div>
            </v-col>

            <v-spacer />

            <v-col>
              <div>
                <v-select
                  v-model="selectedHeaders"
                  :items="headers"
                  :disabled="isLoadingFeatures"
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
            :loading="isLoadingFeatures"
            class="elevation-1"
            multi-sort
          />
        </v-container>
      </v-container>
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
    // content: String,
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
      selectedHeaders: [],
      filters: {
        grouping: '',
      },
      checkNewFilters: false,
      btn_ti: '',
      btn_ti_month_year: '',
      btn_month_year: '',
      btn_year: '',
      btn_ti_year: '',
      btn_day: '',
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
      this.btn_ti = '';
      this.btn_ti_month_year = '';
      this.btn_month_year = '';
      this.btn_year = '';
      this.btn_ti_year = 'button-pressed';
      this.btn_day = '';
      this.getDataAnalyticsMonitoringByFunaiYear();
      console.log(this.content);
    },
    groupByFunaiMonthYear() {
      this.btn_ti = '';
      this.btn_ti_month_year = 'button-pressed';
      this.btn_month_year = '';
      this.btn_year = '';
      this.btn_ti_year = '';
      this.btn_day = '';
      this.getDataAnalyticsMonitoringByFunaiMonthYear();
    },
    groupByDay() {
      this.btn_ti = '';
      this.btn_ti_month_year = '';
      this.btn_month_year = '';
      this.btn_year = '';
      this.btn_ti_year = '';
      this.btn_day = 'button-pressed';
      this.getDataAnalyticsMonitoringByDay();
    },
    groupByFunai() {
      this.btn_ti = 'button-pressed';
      this.btn_ti_month_year = '';
      this.btn_month_year = '';
      this.btn_year = '';
      this.btn_ti_year = '';
      this.btn_day = '';
      this.getDataAnalyticsMonitoringByFunai();
    },
    groupByYear() {
      this.btn_ti = '';
      this.btn_ti_month_year = '';
      this.btn_month_year = '';
      this.btn_year = 'button-pressed';
      this.btn_ti_year = '';
      this.btn_day = '';
      this.getDataAnalyticsMonitoringByYear();
    },
    groupByMonthYear() {
      this.btn_ti = '';
      this.btn_ti_month_year = '';
      this.btn_month_year = 'button-pressed';
      this.btn_year = '';
      this.btn_ti_year = '';
      this.btn_day = '';
      this.getDataAnalyticsMonitoringByMonthYear();
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
.button-pressed {
  background-color: #3e8e41;
  box-shadow: 0 5px #666;
  transform: translateY(4px);
}

.v-dialog__content {
    justify-content: flex-start;
}
.background__toolbar {
    background: linear-gradient(to bottom, rgb(30, 33, 50), rgb(28, 65, 113));
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
