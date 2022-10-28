<template>
  <v-col
    v-if="data.datasets.length"
    :cols="cols"
  >
    <v-card class="elevation-5 chart-card">
      <v-card-title> {{ name }}</v-card-title>
      <client-only>
        <DoughnutChartWithFilling
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
  name: 'AnalyticsChartPie',

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
      const langType = this.$t('lang-type');
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
                                += `${parseFloat(
                  parseFloat(
                    data.datasets[tooltipItem.datasetIndex]
                      .data[tooltipItem.index],
                  ).toFixed(2),
                ).toLocaleString(langType)} km²`;
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
        center: {
          text: 'Red is 2/3 of the total numbers',
          color: '#FF6384', // Default is #000000
          fontStyle: 'Arial', // Default is Arial
          sidePadding: 20, // Default is 20 (as a percentage)
          minFontSize: 25, // Default is 20 (in px), set to false and text will not wrap.
          lineHeight: 25, // Default is 25 (in px), used for when text wraps
        },
      };
    },

    ...mapState('analytics', ['colors']),
  },
};
</script>
