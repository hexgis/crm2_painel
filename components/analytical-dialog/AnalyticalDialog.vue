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
            <v-tab>Gráfico</v-tab>
            <v-tab-item>
              <v-card>
                <v-container grid-list-xs>
                  <div class="mb-2">
                    <v-chip
                      :outlined="chipSelected === 'ti'"
                      @click="chipSelected = 'ti'"
                    >
                      Terra Indigena
                    </v-chip>
                    <v-chip
                      :outlined="chipSelected === 'ano'"
                      @click="chipSelected = 'ano'"
                    >
                      Ano
                    </v-chip>
                    <v-chip
                      :outlined="chipSelected === 'dia'"
                      @click="chipSelected = 'dia'"
                    >
                      Dia
                    </v-chip>
                    <v-chip
                      :outlined="chipSelected === 'tiano'"
                      @click="chipSelected = 'tiano'"
                    >
                      Terra Indigena e Ano
                    </v-chip>
                  </div>
                  <v-divider class="mb-2" />
                  <v-data-table
                    :headers="headers"
                    :items="analyticsMonitoring"
                    :items-per-page="5"
                    class="elevation-1"
                  />
                </v-container>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card>
                <v-container
                  grid-list-xs
                  fluid
                >
                  <div class="mt-2">
                    <v-chip
                      v-model="filters.byFunai"
                      :outlined="chipSelected === 'ti'"
                      @click="search()"
                    >
                      Terra Indigena
                    </v-chip>
                    <v-chip
                      v-model="filters.byYear"
                      :outlined="chipSelected === 'ano'"
                      @click="search()"
                    >
                      Ano
                    </v-chip>
                    <v-chip
                      v-model="filters.byDay"
                      :outlined="chipSelected === 'dia'"
                      @click="search()"
                    >
                      Dia
                    </v-chip>
                    <v-chip
                      v-model="filters.byFunaiYear"
                      :outlined="chipSelected === 'tiano'"
                      @click="search()"
                    >
                      Terra Indigena e Ano
                    </v-chip>
                  </div>
                  <v-divider class="mt-2" />
                </v-container>
                <v-container
                  grid-list-xs
                  fluid
                >
                  <div class="d-flex justify-space-around">
                    <div
                      style="width: 300px"
                      class="mr-8"
                    >
                      <PieChart />
                    </div>
                    <div style="width: 600px">
                      <AreaChart />
                    </div>
                  </div>
                  <v-divider class="mt-4" />
                  <div class="d-flex justify-space-around">
                    <div
                      style="width: 500px"
                      class="mr-8"
                    >
                      <LineChart />
                    </div>
                    <div style="width: 500px">
                      <RadarChart />
                    </div>
                  </div>
                </v-container>
              </v-card>
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
        byFunai: 'monitoring_by_co_funai',
        byYear: 'monitoring_by_year',
        byDay: 'monitoring_by_day',
        byFunaiYear: 'monitoring_by_co_funai_and_year',
      },
      checkNewFilters: false,

    };
  },

  computed: {

    ...mapState('monitoring', [
      'analyticsMonitoring',
      'features',
    ]),

    ...mapActions('monitoring', [
      'getDataAnalyticsMonitoring',
    ]),

    ...mapMutations('monitoring', [
      'setanalyticsMonitoringDialog',
      'setFilters',
    ]),

    ...mapMutations('tableDialog', ['setshowTableDialog']),

  },

  mounted() {
    this.dialog = this.value;
  },

  methods: {
    search() {
      this.setFilters(this.filters);
      this.getDataAnalyticsMonitoring();
    },
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
