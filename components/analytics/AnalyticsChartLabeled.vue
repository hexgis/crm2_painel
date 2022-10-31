<template>
  <v-col
    v-if="data.length"
    :cols="cols"
  >
    <v-card class="elevation-5 chart-card">
      <v-card-title> {{ name }}</v-card-title>
      <client-only>
        <BarChart
          :data="generateData()"
          :options="chartOptions"
        />
      </client-only>
    </v-card>
  </v-col>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'AnalyticsChartLabeled',

  props: {
    name: {
      type: String,
      default: '',
    },
    data: {
      type: Array,
      default: () => [],
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
      return {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          mode: 'x',
          callbacks: {
            title(tooltip) {
              return tooltip[0].xLabel;
            },
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
        elements: {
          point: {
            radius: 0,
          },
        },
        scales: {
          xAxes: [
            {
              offset: true,
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

  methods: {
    generateData() {
      const values = {};
      const labels = [];
      const returnData = {
        labels: [],
        datasets: [],
      };

      this.data.forEach((item) => {
        const xIdentifier = item[this.xAxis];
        let yIdentifier = item[this.yAxis];

        if (this.monthLabel) {
          yIdentifier = this.$moment()
            .month(parseInt(yIdentifier) - 1)
            .format('MMM');
        }

        if (!labels.includes(yIdentifier)) {
          labels.push(yIdentifier);
        }

        if (!values[xIdentifier]) {
          values[xIdentifier] = {};
        }

        if (!values[xIdentifier][yIdentifier]) {
          values[xIdentifier][yIdentifier] = item[this.valueIdentifier];
        } else {
          values[xIdentifier][yIdentifier]
                        += item[this.valueIdentifier];
        }
      });

      for (const label in values) {
        const groups = [];
        for (const relation in values[label]) {
          groups.push(values[label][relation]);
        }

        returnData.datasets.push({
          label,
          data: groups,
          lineTension: 0,
          backgroundColor: this.colors[this.xAxis][label],
          borderColor: this.colors[this.xAxis][label],
        });
      }
      returnData.labels = labels;

      return returnData;
    },
  },
};
</script>
