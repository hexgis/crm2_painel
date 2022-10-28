<template>
  <div v-if="!isLoadingData">
    <AnalyticsPCRatesChart />
  </div>
</template>

<script>
// Descrição:
// Dashboard Full, sem a adoção de alguns filtros aplicados em Monitoring
// Sem os filtros de
// startDate, endDate e prioridades
// Com os filtros de
// CR, TI e BonderyBox(verificar com o Guilherme)
// Destinados ao Dashboards de: CR, TI, Municipios
export default {
  name: 'AnalyticsPriorConsolidChartFull',

  components: {
    AnalyticsPCChartRates,
  },

  data() {
    return {
      x: null,
    };
  },
};
</script>

<style scoped></style>
