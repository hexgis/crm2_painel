<template>
    <v-col v-if="data.length" :cols="cols">
        <v-card class="elevation-5 chart-card">
            <v-card-title> {{ name }}</v-card-title>
            <client-only>
                <component
                    :is="chartComponent"
                    :data="generateData()"
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
import Vue from 'vue'
import { mapState } from 'vuex'
import moment from 'moment'

const BarChart = Vue.component('BarChart')
const LineChart = Vue.component('LineChart')

function getTooltipDate(date) {
    return moment(date).format('LL')
}

export default {
    name: 'AnalyticsChartTime',

    props: {
        name: {
            type: String,
            default: '',
        },
        data: {
            type: Array,
            default: () => {
                return []
            },
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
        chartType: {
            type: String,
            default: 'bar',
        },
        cumulative: {
            type: Boolean,
            default: false,
        },
        filled: {
            type: Boolean,
            default: false,
        },
        cols: {
            type: Number,
            default: 6,
        },
    },

    data: () => ({
        chartComponent: BarChart,
    }),

    computed: {
        chartOptions() {
            return {
                responsive: true,
                maintainAspectRatio: false,
                tooltips: {
                    mode: 'x',
                    callbacks: {
                        title(tooltip) {
                            return getTooltipDate(tooltip[0].xLabel)
                        },
                        label(tooltipItem, data) {
                            let label =
                                data.datasets[tooltipItem.datasetIndex].label ||
                                ''

                            if (label) {
                                label += ': '
                            }
                            label += tooltipItem.yLabel.toFixed(2) + ' km²'
                            return label
                        },
                    },
                },
                scales: {
                    xAxes: [
                        {
                            type: 'time',
                            time: {
                                unit: 'day',
                                displayFormats: {
                                    day: this.$t('date-axis-format'),
                                },
                            },
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
            }
        },

        ...mapState('analytics', ['colors']),
    },

    mounted() {
        if (this.chartType === 'line') {
            this.chartComponent = LineChart
        } else if (this.chartType === 'bar') {
            this.chartComponent = BarChart
        }
    },

    methods: {
        generateData() {
            const values = {}
            const previousValue = {}
            const returnData = {
                datasets: [],
            }

            this.data.forEach((item) => {
                const xIdentifier = item[this.xAxis]
                const yIdentifier = item[this.yAxis]

                if (!values[xIdentifier]) {
                    values[xIdentifier] = {}
                }

                if (!previousValue[xIdentifier]) {
                    previousValue[xIdentifier] = 0
                }

                if (!values[xIdentifier][yIdentifier]) {
                    values[xIdentifier][yIdentifier] =
                        item[this.valueIdentifier]
                    if (this.cumulative) {
                        values[xIdentifier][yIdentifier] +=
                            previousValue[xIdentifier]
                    }
                } else {
                    values[xIdentifier][yIdentifier] +=
                        item[this.valueIdentifier]
                }

                previousValue[xIdentifier] = values[xIdentifier][yIdentifier]
            })

            for (const label in values) {
                const points = []
                for (const time in values[label]) {
                    points.push({
                        x: this.$moment(time),
                        y: values[label][time],
                    })
                }

                returnData.datasets.push({
                    label,
                    data: points,
                    fill: this.filled,
                    lineTension: 0,
                    backgroundColor: this.colors[this.xAxis][label],
                    borderColor: this.colors[this.xAxis][label],
                    borderWidth: 2,
                    pointHitRadius: 6,
                })
            }

            return returnData
        },
    },
}
</script>
