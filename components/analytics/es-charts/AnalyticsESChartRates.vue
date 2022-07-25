<template>
    <v-row>
        <v-col cols="3" class="d-flex flex-column">
            <v-card class="py-3 elevation-5 flex d-flex flex-column">
                <v-row class="mx-0">
                    <v-col cols="6" class="mini-chart">
                        <client-only>
                            <DoughnutChart
                                :data="DoughnutDataset(vaaRate)"
                                :options="chartOptions"
                            />
                        </client-only>
                    </v-col>

                    <v-col
                        cols="6"
                        class="d-flex flex-column align-center justify-center"
                    >
                        <span class="grey--text text--darken-2">
                            {{ $t('vaa-rate') }}
                        </span>
                        <h1 class="grey--text text--darken-3">
                            {{ (vaaData * 100).toFixed(0) }}%
                        </h1>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
        <v-col cols="3" class="d-flex flex-column">
            <v-card class="py-3 elevation-5 flex d-flex flex-column">
                <v-row class="mx-0">
                    <v-col cols="6" class="mini-chart">
                        <client-only>
                            <DoughnutChart
                                :data="DoughnutDataset(vmaRate)"
                                :options="chartOptions"
                            />
                        </client-only>
                    </v-col>

                    <v-col
                        cols="6"
                        class="d-flex flex-column align-center justify-center"
                    >
                        <span class="grey--text text--darken-2">
                            {{ $t('vma-rate') }}
                        </span>
                        <h1 class="grey--text text--darken-3">
                            {{ (vmaData * 100).toFixed(0) }}%
                        </h1>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
        <v-col cols="3" class="d-flex flex-column">
            <v-card class="elevation-5 flex d-flex flex-column">
                <v-row class="mx-0">
                    <v-col
                        cols="12"
                        class="d-flex flex-column align-center justify-center"
                    >
                        <span class="grey--text text--darken-2">
                            {{ $t('monthly-total') }}
                        </span>
                        <h1 class="grey--text text--darken-3">
                            {{ month }}
                            km<sup>2</sup>
                        </h1>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
        <v-col cols="3" class="d-flex flex-column">
            <v-card class="elevation-5 flex d-flex flex-column">
                <v-row class="mx-0">
                    <v-col
                        cols="12"
                        class="d-flex flex-column align-center justify-center"
                    >
                        <span class="grey--text text--darken-2">
                            {{ $t('annual-total') }}
                        </span>
                        <h1 class="grey--text text--darken-3">
                            {{ year }}
                            km<sup>2</sup>
                        </h1>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
    </v-row>
</template>

<i18n>
{
    "en": {
        "vaa-rate": "VAA Rate",
        "vma-rate": "VMA Rate",
        "monthly-total": "Monthly Total",
        "annual-total": "Annual Total"
    },
    "pt-br": {
        "vaa-rate": "Taxa VAA",
        "vma-rate": "Taxa VMA",
        "monthly-total": "Total Mensal",
        "annual-total": "Total Anual"
    }
}
</i18n>

<script>
export default {
    name: 'AnalyticsChartRates',

    props: {
        year: {
            type: Number,
            default: 0,
        },
        month: {
            type: Number,
            default: 0,
        },
        previousYear: {
            type: Number,
            default: 0,
        },
        previousMonth: {
            type: Number,
            default: 0,
        },
    },

    data: () => ({
        chartOptions: {
            rotation: 1 * Math.PI,
            circumference: 1 * Math.PI,
            tooltips: {
                enabled: false,
            },
        },
        positiveColor: '#81bf48',
        negativeColor: '#b73838',
        grayColor: '#F6F6F6',
        vaaPercent: 0,
        vmaPercent: 0,
    }),

    computed: {
        vaaRate() {
            if (parseFloat(this.year) === 0) return -1
            else if (parseFloat(this.previousYear) === 0) return 1
            return parseFloat(this.year) / parseFloat(this.previousYear)
        },

        vmaRate() {
            if (parseFloat(this.month) === 0) return -1
            else if (parseFloat(this.previousMonth) === 0) return 1
            return parseFloat(this.month) / parseFloat(this.previousMonth)
        },

        vaaData() {
            return this.rateData(
                this.vaaRate,
                parseFloat(this.previousYear),
                parseFloat(this.year)
            )
        },
        vmaData() {
            return this.rateData(
                this.vmaRate,
                parseFloat(this.previousMonth),
                parseFloat(this.month)
            )
        },
    },

    methods: {
        rateData(rate, previous, actual) {
            if (actual === 0) return -1
            else if (previous === 0) return 1
            return rate < 1 ? rate * -1 : rate - 1
        },

        DoughnutDataset(rate) {
            let rateData =
                rate <= 1 ? [rate, 1 - rate] : [rate - 1, Math.max(2 - rate, 0)]

            if (rate === -1) rateData = [1, 0]

            return {
                datasets: [
                    {
                        data: rateData,
                        backgroundColor: [
                            rate < 1 ? this.positiveColor : this.negativeColor,
                            this.grayColor,
                        ],
                    },
                ],
            }
        },
    },
}
</script>

<style lang="sass">
.mini-chart
    border-right: 1px solid rgba(0,0,0,0.1)
</style>
