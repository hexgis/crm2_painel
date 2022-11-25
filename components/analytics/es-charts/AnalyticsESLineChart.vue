<template>
  <v-col
    v-if="data.datasets.length"
    :cols="cols"
  >
    <v-card class="elevation-5 chart-card">
      <v-card-title> {{ name }}</v-card-title>
      <client-only>
        <LineChart
          :data="data"
          :options="chartOptions"
        />
      </client-only>
    </v-card>
  </v-col>
</template>

<i18n>
{
    "en": {
        "date-axis-format": "MMM D"
    },
    "pt-br": {
        "date-axis-format": "DD/MM"
    }
}
</i18n>

<script>
import { mapState } from 'vuex';

export default {
  name: 'AnalyticsChartTime',

  props: {
    name: {
      type: String,
      default: '',
    },
    data: {
      type: Object,
      default: () => {},
    },
    xAxis: {
      type: String,
      default: 'type',
    },
    yAxis: {
      type: String,
      default: 'time',
    },
    valueIdentifier: {
      type: String,
      default: 'area_km',
    },
    cols: {
      type: Number,
      default: 6,
    },
  },

  computed: {
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          mode: 'x',
          callbacks: {
            label(tooltipItem, data) {
              let label = data.datasets[tooltipItem.datasetIndex].label
                                || '';

              if (label) {
                label += ': ';
              }
              label += `${tooltipItem.yLabel.toFixed(2)} km²`;
              return label;
            },
          },
        },
        scales: {
          xAxes: [
            {
              ticks: {
                padding: 1,
              },
              offset: true,
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
        legend: {
          position: 'bottom',
        },
        elements: {
          point: {
            radius: 1,
          },
        },
      };
    },

    ...mapState('analytics', ['colors']),
  },
};
</script>
