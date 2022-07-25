<template>
    <v-col v-if="data.length || previousData.length" :cols="cols">
        <v-card class="elevation-5 chart-card">
            <v-card-title> {{ name }}</v-card-title>
            <client-only>
                <HorizontalBarChart
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
        "annual-value": "Total annual value",
        "monthly-value": "Total monthly value",
        "diff": "Difference"
    },
    "pt-br": {
        "annual-value": "Valor total do ano",
        "monthly-value": "Valor total do mês",
        "diff": "Diferença"
    }
}
</i18n>

<script>
import { mapState } from 'vuex'

export default {
    name: 'AnalyticsChartStacked',

    props: {
        name: {
            type: String,
            default: '',
        },
        dateRange: {
            type: String,
            default: 'month',
        },
        data: {
            type: Array,
            default: () => {
                return []
            },
        },
        previousData: {
            type: Array,
            default: () => {
                return []
            },
        },
        labelIdentifier: {
            type: String,
            default: 'year',
        },
        dateIdentifier: {
            type: String,
            default: 'date',
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
                    mode: 'y',
                    callbacks: {
                        title(tooltip) {
                            return tooltip[0].yLabel
                        },
                        label(tooltipItem, data) {
                            let label =
                                data.datasets[tooltipItem.datasetIndex].label

                            if (label) {
                                label += ': '
                            }
                            if (tooltipItem.datasetIndex === 0) {
                                label +=
                                    data.datasets[
                                        tooltipItem.datasetIndex
                                    ].values[tooltipItem.index].toFixed(2) +
                                    ' km²'
                            } else {
                                label += tooltipItem.xLabel.toFixed(2) + ' km²'

                                if (!tooltipItem.xLabel) {
                                    return ''
                                }
                            }

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
                animation: {
                    onComplete: () => {
                        delayed = true
                    },
                    delay: (context) => {
                        let delay = 0
                        if (
                            context.type === 'data' &&
                            context.mode === 'default' &&
                            !delayed
                        ) {
                            delay =
                                context.dataIndex * 300 +
                                context.datasetIndex * 100
                        }
                        return delay
                    },
                },
            }
        },

        ...mapState('analytics', ['colors']),
    },

    methods: {
        generateData() {
            let values = 0
            let previousValues = 0
            let currentLabel = this.data.length
                ? this.data[0][this.labelIdentifier]
                : ''
            let previousLabel = this.previousData.length
                ? this.previousData[0][this.labelIdentifier]
                : ''

            if (this.data.length || this.previousData.length) {
                if (this.dateRange === 'month') {
                    if (this.data.length && !this.previousData.length) {
                        currentLabel = this.$moment(
                            this.data[0][this.dateIdentifier]
                        ).format('MMM YYYY')

                        previousLabel = this.$moment(
                            this.data[0][this.dateIdentifier]
                        )
                            .subtract(1, 'year')
                            .format('MMM YYYY')
                    } else if (!this.data.length && this.previousData.length) {
                        previousLabel = this.$moment(
                            this.previousData[0][this.dateIdentifier]
                        ).format('MMM YYYY')

                        currentLabel = this.$moment(
                            this.previousData[0][this.dateIdentifier]
                        )
                            .add(1, 'year')
                            .format('MMM YYYY')
                    } else {
                        currentLabel = this.$moment(
                            this.data[0][this.dateIdentifier]
                        ).format('MMM YYYY')

                        previousLabel = this.$moment(
                            this.previousData[0][this.dateIdentifier]
                        ).format('MMM YYYY')
                    }
                }
            }
            const returnData = {
                labels: [previousLabel, currentLabel],
                datasets: [],
            }

            this.data.forEach((item) => {
                values += item[this.valueIdentifier]
            })

            this.previousData.forEach((item) => {
                previousValues += item[this.valueIdentifier]
            })

            const oldValues = [previousValues, values]
            let dataYear = []
            let dataDifference = []
            let difference = 0
            if (previousValues > values) {
                difference = previousValues - values
                dataYear = [values, values]
                dataDifference = [difference, 0]
            } else {
                difference = values - previousValues
                dataYear = [previousValues, previousValues]
                dataDifference = [0, difference]
            }

            returnData.datasets = [
                {
                    label:
                        this.dateRange === 'month'
                            ? this.$t('monthly-value')
                            : this.$t('annual-value'),
                    data: dataYear,
                    lineTension: 0,
                    backgroundColor: '#038cfc',
                    borderColor: '#038cfc',
                    values: oldValues,
                },
                {
                    label: this.$t('diff'),
                    data: dataDifference,
                    lineTension: 0,
                    backgroundColor: '#e00038',
                    borderColor: '#e00038',
                },
            ]
            return returnData
        },
    },
}
</script>
