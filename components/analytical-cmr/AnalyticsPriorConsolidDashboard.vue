<template>
    <v-container fluid class="container">
        <v-tabs dark background-color="secondary">
            <v-tab>
                <v-icon>mdi-chart-bar </v-icon>
            </v-tab>
            
            <v-tab-item class="tab-content">
                <v-row>
                    <v-col>
                        
                    </v-col>
                </v-row>
            </v-tab-item>
        </v-tabs>
        
            <div >
                <v-row>

                <v-col cols="6">
                <v-card elevation="6">
                <AreaChart />
                </v-card>
                </v-col>
                
                <v-col cols="6">
                <v-card elevation="6">
                <PieChart />
                </v-card>
                </v-col>

                <v-col cols="6">
                <v-card elevation="6">
                <BarChart />
                </v-card>
                </v-col>

                <v-col cols="6">
                <v-card elevation="6">
                <RadarChart />
                </v-card>
                </v-col>

                <v-col cols="6">
                <v-card elevation="6">
                <LineChart />
                </v-card>
                </v-col>

                </v-row>
            </div>
        
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

.small {
    max-width: 350px;
}
</style>
