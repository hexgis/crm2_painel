<template>
    <vue-scrollbar>
        <v-container
            fluid
            class="container"
            scroll-off-screen
            scroll-target="#scrolling-techniques"
        >
            <v-tabs dark background-color="secondary">
                <v-tab>
                    <v-icon>mdi-chart-bar </v-icon>
                </v-tab>
                <v-tab>
                    <v-icon>mdi-file-chart-outline </v-icon>
                </v-tab>
                <v-tab-item class="tab-content">
                    <v-row>
                        <v-col>
                            <v-card elevation="6">
                                <v-card-title>
                                    Estatísticas Filtradas
                                </v-card-title>
                                <v-card-text>
                                    Dados de acordo com o filtro de polígonos
                                    prioritários
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-tab-item>
                <v-tab-item class="tab-content">
                    <AnalyticsFilter />
                </v-tab-item>
            </v-tabs>

            <div>
                <AreaChart />
                <PieChart />
                <BarChart />
                <RadarChart />
                <LineChart />
            </div>
        </v-container>
    </vue-scrollbar>
</template>

<script>
import { mapActions } from 'vuex'

import AnalyticsFilter from '@/components/analytics/AnalyticsFilter'
import AreaChart from '@/components/graphics/AreaChart.vue'
import PieChart from '@/components/graphics/PieChart.vue'
import BarChart from '@/components/graphics/BarChart.vue'
import RadarChart from '@/components/graphics/RadarChart.vue'
import LineChart from '@/components/graphics/LineChart.vue'
import VueScrollbar from 'vue-scrollbar-simple'

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
        VueScrollbar,
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
.container {
    width: 90%;
    height: 100%;
}

.tab-content {
    padding: 20px;
}
</style>
