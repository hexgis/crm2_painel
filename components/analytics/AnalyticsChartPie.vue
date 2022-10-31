<template>
  <v-col
    v-if="data.length"
    :cols="cols"
  >
    <v-card class="elevation-5 chart-card">
      <v-card-title> {{ name }}</v-card-title>
      <client-only>
        <PieChart
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
  name: 'AnalyticsChartPie',

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
          mode: 'point',
          callbacks: {
            title(tooltip) {
              return tooltip[0].yLabel;
            },
            label(tooltipItem, data) {
              let label = data.labels[tooltipItem.index] || '';

              if (label) {
                label += ': ';
              }
              label
                                += `${parseInt(
                  data.datasets[tooltipItem.datasetIndex]
                    .data[tooltipItem.index],
                ).toFixed(2)} km²`;
              return label;
            },
          },
        },
        layout: {
          padding: 30,
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
      const returnData = {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      };

      this.data.forEach((item) => {
        const xIdentifier = item[this.xAxis];
        if (!values[xIdentifier]) {
          values[xIdentifier] = item[this.valueIdentifier];
        } else {
          values[xIdentifier] += item[this.valueIdentifier];
        }
      });

      for (const label in values) {
        returnData.labels.push(label);
        returnData.datasets[0].data.push(values[label]);
        returnData.datasets[0].backgroundColor.push(
          this.colors[this.xAxis][label],
        );
      }

      return returnData;
    },
  },
};
</script>
