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
                  <v-data-table
                    :headers="headers"
                    :items="desserts"
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
        {
          text: 'Dessert (100g serving)',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Calories', value: 'calories' },
        { text: 'Fat (g)', value: 'fat' },
        { text: 'Carbs (g)', value: 'carbs' },
        { text: 'Protein (g)', value: 'protein' },
        { text: 'Iron (%)', value: 'iron' },
      ],
      desserts: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: '1%',
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: '1%',
        },
        {
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: '7%',
        },
        {
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: '8%',
        },
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: '16%',
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: '0%',
        },
        {
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: '2%',
        },
        {
          name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: '45%',
        },
        {
          name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: '22%',
        },
        {
          name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: '6%',
        },
      ],
    };
  },

  mounted() {
    this.dialog = this.value;
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
        width: 70%;
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
