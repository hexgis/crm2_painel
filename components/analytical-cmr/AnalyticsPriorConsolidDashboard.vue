<template>
    <v-container fluid class="overflow-auto container-height">
        <v-toolbar absolute width="100vw" color="secondary">
            <v-btn icon>
                <v-icon color="#FFFFFF">mdi-chart-box</v-icon>
            </v-btn>
        </v-toolbar>
        <v-row class="lucas">
            <v-col cols="6">
                <v-card elevation="6">
                    <AreaChart class="py-2 px-2" />
                </v-card>
            </v-col>

            <v-col cols="6">
                <v-card elevation="6">
                    <PieChart class="py-2 px-2" />
                </v-card>
            </v-col>

            <v-col cols="6">
                <v-card elevation="6">
                    <BarChart class="py-2 px-2" />
                </v-card>
            </v-col>

            <v-col cols="6">
                <v-card elevation="6">
                    <RadarChart class="py-2 px-2" />
                </v-card>
            </v-col>

            <v-col cols="6">
                <v-card elevation="6">
                    <LineChart class="py-2 px-2" />
                </v-card>
            </v-col>
            <v-col cols="6">
                <v-card elevation="6">
                    <DonutChart class="py-2 px-2" />
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapActions } from 'vuex'

import AnalyticsFilter from '@/components/analytics/AnalyticsFilter'
import AreaChart from '@/components/graphics/AreaChart.vue'
import PieChart from '@/components/graphics/PieChart.vue'
import BarChart from '@/components/graphics/BarChart.vue'
import RadarChart from '@/components/graphics/RadarChart.vue'
import LineChart from '@/components/graphics/LineChart.vue'
import DonutChart from '@/components/graphics/DonutChart.vue'

export default {
    name: 'AnalyticsPriorConsolidDashboard',

    layout: 'analytics',

    components: {
        AnalyticsFilter,
        AreaChart,
        PieChart,
        BarChart,
        RadarChart,
        LineChart,
        DonutChart
    },

    data() {
        return {
            chartData: {
                Books: 24,
                Magazine: 30,
                Newspapers: 10,
            },
        }
    },
}
</script>

<style scoped>
.container-height {
    max-height: 100vh;
}

.lucas{
    margin-top: 90px;
}


</style>
