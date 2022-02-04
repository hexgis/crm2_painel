<template>
    <v-row>
        <v-col cols="3" class="d-flex flex-column">
            <v-card class="py-3 elevation-5 d-flex flex-column">
                <v-row class="mx-0">
                    <v-col cols="12" class="d-flex flex-column align-center justify-center">
                        <v-card-actions class=" px-3 py-3 align-center justify-center">
                            <v-btn color="blue"
                                :loading="isLoadingPCData"
                                :disabled="false"
                                @click="statusMeasurement('filtro_aplicado')"
                            >
                                {{ $t("selector-button-Applied-Filter")}}
                            </v-btn>
                        </v-card-actions>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
        <v-col cols="3" class="d-flex flex-column">
            <v-card class="py-3 elevation-5 d-flex flex-column">
                <v-row class="mx-0">
                    <v-col cols="12" class="d-flex flex-column align-center justify-center">
                        <v-card-actions class=" px-3 py-3 align-center justify-center">
                            <v-btn color="blue"
                                :loading="isLoadingPCData"
                                :disabled="false"
                                @click="x"
                            >
                                {{ $t("selector-button-CR")}}
                            </v-btn>
                        </v-card-actions>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
        <v-col cols="3" class="d-flex flex-column">
            <v-card class="py-3 elevation-5 d-flex flex-column">
                <v-row class="mx-0">
                    <v-col cols="12" class="d-flex flex-column align-center justify-center">
                        <v-card-actions class=" px-3 py-3 align-center justify-center">
                            <v-btn color="blue"
                                :loading="isLoadingPCData"
                                :disabled="false"
                                @click="x"
                            >
                                {{ $t("selector-button-TI")}}
                            </v-btn>
                        </v-card-actions>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
        <v-col cols="3" class="d-flex flex-column">
            <v-card class="py-3 elevation-5 d-flex flex-column">
                <v-row class="mx-0">
                    <v-col cols="12" class="d-flex flex-column align-center justify-center">
                        <v-card-actions class=" px-3 py-3 align-center justify-center">
                            <v-btn color="blue"
                                :loading="isLoadingPCData"
                                :disabled="false"
                                @click="x"
                            >
                                {{ $t("selector-button-County")}}
                            </v-btn>
                        </v-card-actions>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
        <v-col cols="3" class="d-flex flex-column">
            <v-card class="py-3 elevation-5 d-flex flex-column">
                <v-row class="mx-0">
                    <v-col cols="12" class="d-flex flex-column align-center justify-center">
                        <v-card-actions class=" px-3 py-3 align-center justify-center">
                            <v-btn color="blue"
                                :loading="isLoadingPCData"
                                :disabled="false"
                                @click="x"
                            >
                                {{ $t("selector-button-Per-km2")}}
                            </v-btn>
                            <v-btn color="blue"
                                :loading="isLoadingPCData"
                                :disabled="false"
                                @click="x"
                            >
                                {{ $t("selector-button-Per-Ha")}}
                            </v-btn>
                        </v-card-actions>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
        <v-col cols="3" class="d-flex flex-column">
            <v-card class="py-3 elevation-5 d-flex flex-column">
                <v-row class="mx-0">
                    <v-col cols="12" class="d-flex flex-column align-center justify-center">
                        <v-card-actions class=" px-3 py-3 align-center justify-center">
                            <v-btn color="blue"
                                :loading="isLoadingPCData"
                                :disabled="false"
                                @click="x"
                            >
                                {{ $t("selector-button-Per-Month")}}
                            </v-btn>
                            <v-btn color="blue"
                                :loading="isLoadingPCData"
                                :disabled="false"
                                @click="x"
                            >
                                {{ $t("selector-button-Per-Year")}}
                            </v-btn>
                        </v-card-actions>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
        <v-row>
            <!--
            Menu iferior, filtro por:
                Km²
                Ha
                Mês
                Ano
            -->
        </v-row>
    </v-row>


</template>

<i18n>
{
    "en":{
        "selector-button-Applied-Filter":"Applied Filter",
        "selector-button-CR":"Regional Coordination",
        "selector-button-TI":"Indigenous Land",
        "selector-button-County":"County",
        "selector-button-Per-km2": "Per Km²",
        "selector-button-Per-Ha": "Per Ha",
        "selector-button-Per-Month": "Per Month",
        "selector-button-Per-Year": "Per Year"
    },
    "pt-br":{
        "selector-button-Applied-Filter":"Filtro Aplicado",
        "selector-button-CR": "Coordenação Regional",
        "selector-button-TI": "Terra Indígena",
        "selector-button-County": "Município",
        "selector-button-Per-km2": "Por Km²",
        "selector-button-Per-Ha": "Por Ha",
        "selector-button-Per-Month": "Por Mês",
        "selector-button-Per-Year": "Por Ano"
    }
}
</i18n>

<script>
//Descrição:
    //Tela principal Pai do Dashboard que vai ser chamada no Analytics
        //Chamamento ao trocar a visão MAP po ANALYTIC
    //Visões dos 4 tipos de Dasboards no menu superior:
        // Filtro Aplicado; CR; TI; Municípios
    //Modificadores aplicados na unidade de medida de todos os Dasbords
        //Visualização por:
            //Km²
            //Ha
            //Mês
            //Ano
        //Aplicados em:
            // AnalyticsPriorConsolidChartFull.vue
            // AnalyticsPriorConsolidChartFiltered.vue
// export default {
//     data() {
//         return {
//             valid: null,
//             unitMeasurement: {
//                 areaUnit: [
//                     {title: "km2", flag: true},
//                     {title: "ha", flag: false}
//                 ],
//                 timeUnit: [
//                     {title: 'mes', flag: true},
//                     {title: 'ano', flag: false}
//                 ]
//             }, // Default button: selector-button-Applied-Filter
//             displayAnalitcs: '', // Default button: selector-button-Per-km2
//         }
//     },

//     computed: {

//         ...mapState('analytics-prior-consolid', [
//             'isLoadingPCData',
//         ]),
//         ...mapAction('analytics-prior-consolid', [
//             'getAppliedFiltersDataPC',
//             'getCRFiltersDataPC',
//             'getTIFiltersDataPC',
//             'getMunicipioFiltersDataPC',
//         ])
//     },

//     methods: {
//         changeDashboards(click) {
//             const buttonAppliedFilter = null //"valor do @click"
//             switch (buttonAppliedFilter){
//                 case (buttonAppliedFilter = "selector-button-CR"):{
//                     displayAnalitcs = "Coordenação Regional"
//                     this.$store.dispatch('analytics-prior-consolid/getCRFiltersDataPC', unitMeansurement)
//                 }
//                 case (buttonAppliedFilter = "selector-button-TI"):{
//                     displayAnalitcs = "Terra Indígena"
//                     this.$store.dispatch('analytics-prior-consolid/getTIFiltersDataPC', unitMeansurement)
//                 }
//                 case (buttonAppliedFilter = "selector-button-County"):{
//                     displayAnalitcs = "Município"
//                     this.$store.dispatch('analytics-prior-consolid/getMunicipioFiltersDataPC', unitMeansurement)
//                 }
//                 default:
//                 case (buttonAppliedFilter = "selector-button-Applied-Filter"):{
//                     displayAnalitcs = "Filtro Aplicado"
//                     this.$store.dispatch('analytics-prior-consolid/getAppliedFiltersDataPC', unitMeansurement)
//                 }
//             }
//         },
//         statusMeasurement(data) {
//             data.unitMeasurement.areaUnit.filter(areaUnit => areaUnit.flag),
//             data.unitMeasurement.timeUnit.filter(timeUnit => timeUnit.flag)
//             this.$store.commit('setUnitMeasurement', this.unitMeasurement)
//         },
//         statusDisplayAnalitcs(data) {
//             data.displayAnalitcs = data,
//             this.$store.commit('setDisplayAnalitcs', this.displayAnalitcs)
//         }
//     }

// }
</script>


<style scoped>

</style>