<template>
    <div v-if="!isLoadingData">
        <AnalyticsPCRatesChart
            :totol-poligons="total"
            :poligons-data="priorityDataPC"
            :area-km="area_km"
            :area-ha="area_ha"
            :unit-measurement="unitMeasurement"
        />
        <v-row>
            <AnalyticsPCBarChart />
            <AnalyticsPCBarChart />
        </v-row>
    </div>
</template>

<script>
//Descrição:
//Dashboard Filtrado, contendo a aplicação dos filtros iseridos em Funai
import AnalyticsPCRatesChart from '@/components/analytics/analyticsPriorConsolid/AnalyticsPCRatesChart'

export default {
    name: 'AnalyticsPriorConsolidChartFiltered',

    data() {
        return {}
    },

    props: {},

    watch: {},

    components: {
        AnalyticsPCRatesChart,
        AnalyticsPCLineChart,
        AnalyticsPCBarChart,
    },

    computed: {
        ...mapState('analytics-prior-consolid', ['isLoadingData']),
    },
    data: {},

    methods: {},
}
</script>

<style scoped></style>
