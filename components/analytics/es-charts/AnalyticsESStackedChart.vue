<template>
  <v-col
    v-if="
      data.datasets.length &&
        data.datasets[0].values.reduce((aggs, agg) => aggs + agg, 0)
    "
    :cols="cols"
  >
    <v-card class="elevation-5 chart-card">
      <v-card-title> {{ name }}</v-card-title>
      <client-only>
        <HorizontalBarChart
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
        "lang-type": "en-US"
    },
    "pt-br": {
        "lang-type": "pt-BR"
    }
}
</i18n>

<script>
import { mapState } from 'vuex';

export default {
  name: 'AnalyticsESStackedChart',

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
    monthLabel: {
      type: Boolean,
      default: false,
    },
    cols: {
      type: Number,
      default: 6,
    },
  },

  computed: {
    chartOptions() {
      const lang = this.$t('lang-type');

      return {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          mode: 'y',
          callbacks: {
            label(tooltipItem, data) {
              let { label } = data.datasets[tooltipItem.datasetIndex];

              if (label) {
                label += ': ';
              }
              if (tooltipItem.datasetIndex === 0) {
                label
                                    += `${parseFloat(
                    data.datasets[
                      tooltipItem.datasetIndex
                    ].values[tooltipItem.index].toFixed(2),
                  ).toLocaleString(lang)} km²`;
              } else {
                label
                                    += `${parseFloat(
                    tooltipItem.xLabel.toFixed(2),
                  ).toLocaleString(lang)} km²`;

                if (!tooltipItem.xLabel) {
                  return '';
                }
              }

              return label;
            },
          },
        },
        elements: {
          point: {
            radius: 0,
          },
        },
        scales: {
          xAxes: [
            {
              stacked: true,
            },
          ],
          yAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
        legend: {
          position: 'bottom',
        },
      };
    },
    ...mapState('analytics', ['colors']),
  },

  methods: {},
};
</script>
