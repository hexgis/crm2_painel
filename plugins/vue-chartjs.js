import Vue from 'vue'
import { Line, Bar, Pie, HorizontalBar, Doughnut } from 'vue-chartjs'

Vue.component('LineChart', {
    extends: Line,
    props: {
        data: {
            type: Object,
            required: true,
        },
        options: {
            type: Object,
            required: true,
        },
    },

    mounted() {
        this.renderChart(this.data, this.options)
    },
})

Vue.component('BarChart', {
    extends: Bar,
    props: {
        data: {
            type: Object,
            required: true,
        },
        options: {
            type: Object,
            required: true,
        },
    },

    mounted() {
        this.renderChart(this.data, this.options)
    },
})

Vue.component('DoughnutChart', {
    extends: Doughnut,
    props: {
        data: {
            type: Object,
            required: true,
        },
        options: {
            type: Object,
            required: true,
        },
    },

    mounted() {
        this.renderChart(this.data, this.options)
    },
})

Vue.component('DoughnutChartWithFilling', {
    extends: Doughnut,
    props: {
        data: {
            type: Object,
            required: true,
        },
        options: {
            type: Object,
            required: true,
        },
    },

    mounted() {
        this.addPlugin({
            id: 'my-plugin',
            beforeDraw: (chart) => {
                const width = chart.chart.width
                const height = chart.chart.height
                const ctx = chart.chart.ctx

                ctx.restore()
                const fontSize = (height / 450).toFixed(2)
                ctx.font = fontSize + 'em sans-serif'
                ctx.textBaseline = 'middle'

                const text = chart.data.insideLabel || ''

                let labelGap = 0
                if (chart.data.labels)
                    labelGap = chart.data.labels.length > 9 ? 20 : 8

                const textX = Math.round(
                    (width - ctx.measureText(text).width) / 2
                )
                const textY = height / 2 - labelGap

                ctx.fillText(text, textX, textY)
                ctx.save()
            },
        })
        this.renderChart(this.data, this.options)
    },
})

Vue.component('HorizontalBarChart', {
    extends: HorizontalBar,
    props: {
        data: {
            type: Object,
            required: true,
        },
        options: {
            type: Object,
            required: true,
        },
    },

    mounted() {
        this.renderChart(this.data, this.options)
    },
})

Vue.component('PieChart', {
    extends: Pie,
    props: {
        data: {
            type: Object,
            required: true,
        },
        options: {
            type: Object,
            required: true,
        },
    },

    mounted() {
        this.renderChart(this.data, this.options)
    },
})
