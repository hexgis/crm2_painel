<template>
  <v-container
    fluid
    class="overflow-auto container-height"
  >
    <v-toolbar
      class="background__toolbar"
      absolute
      min-width="100vw"
      color="secondary"
    >
      <v-btn icon>
        <v-icon color="#FFFFFF">
          mdi-chart-box
        </v-icon>
      </v-btn>
    </v-toolbar>
    <v-row class="mt-8 py-8">
      <v-col cols="6">
        <v-card elevation="6">
          <AreaChart class="py-2 px-2" />
        </v-card>
      </v-col>

      <v-col cols="6">
        <v-card elevation="6">
          <PieChart class="py-2 px-2" />
        </v-card>
      </v-col>

      <v-col cols="6">
        <v-card elevation="6">
          <BarChart class="py-2 px-2" />
        </v-card>
      </v-col>

      <v-col cols="6">
        <v-card elevation="6">
          <RadarChart class="py-2 px-2" />
        </v-card>
      </v-col>

      <v-col cols="6">
        <v-card elevation="6">
          <LineChart class="py-2 px-2" />
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card elevation="6">
          <DoughnutChart class="py-2 px-2" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import AnalyticsFilter from '@/components/analytics/AnalyticsFilter';
import AreaChart from '@/components/graphics/AreaChart.vue';
import PieChart from '@/components/graphics/PieChart.vue';
import BarChart from '@/components/graphics/BarChart.vue';
import RadarChart from '@/components/graphics/RadarChart.vue';
import LineChart from '@/components/graphics/LineChart.vue';
import DoughnutChart from '~/components/graphics/DoughnutChart.vue';

export default {
  name: 'AnalyticsPriorConsolidDashboard',

  components: {
    AnalyticsFilter,
    AreaChart,
    PieChart,
    BarChart,
    RadarChart,
    LineChart,
    DoughnutChart,
  },

  layout: 'analytics',

  data() {
    return {
      chartData: {
        Books: 24,
        Magazine: 30,
        Newspapers: 10,
      },
    };
  },
  computed: {
    ...mapState('priority', ['table']),
  },
};
</script>

<style scoped>
.container-height {
    max-height: 100vh;
}
.background__toolbar {
  background: linear-gradient(to bottom, rgb(28, 65, 113), rgb(28, 65, 113));
}
</style>
