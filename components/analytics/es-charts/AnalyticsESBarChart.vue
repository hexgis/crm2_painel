<template>
    <v-col v-if="data.datasets.length" :cols="cols">
        <v-card class="elevation-5 chart-card">
            <v-card-title> {{ name }}</v-card-title>
            <client-only>
                <BarChart :data="data" :options="chartOptions" />
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
import { mapState } from 'vuex'

export default {
    name: 'AnalyticsESBarChart',

    props: {
        name: {
            type: String,
            default: '',
        },
        data: {
            type: Object,
            default: () => {},
        },
        graphType: {
            type: String,
            default: 'bar',
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
            const lang = this.$t('lang-type')

            return {
                responsive: true,
                maintainAspectRatio: false,
                tooltips: {
                    mode: 'x',
                    callbacks: {
                        label(tooltipItem, data) {
                            let label =
                                data.datasets[tooltipItem.datasetIndex].label ||
                                ''
                            if (label) {
                                label += ': '
                            }

                            label +=
                                parseFloat(
                                    tooltipItem.yLabel.toFixed(2)
                                ).toLocaleString(lang) + ' km²'
                            return label
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
            }
        },
        ...mapState('analytics', ['colors']),
    },
}
</script>
