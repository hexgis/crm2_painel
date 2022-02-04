// export const state = () => ({
//     unitMeansurement: {
//         area: null,
//         mesuare: null,
//     },
//     displayAnalitcs: null, // responsável por exibir qual dos 4 Dashboards será exibido na tela: Filtro Aplicado; CR; TI; Municípios. Também encaminhar o filtro aplicado.
//     dataPC: null, //verificar se esse dataPC será o mesmo que o filterdataPC
//     filters: {
//         isLoadingPCDataPC: null,
//         startDate: null,
//         endDate: null,

//     },
//     filtersDataPC: {
//         priorityConsolidated: {
//             area_km: null,
//             area_ha: null,
//             total: null,
//         },
//         maxDate: null,
//         minDate: null,
//         priorityDataPC: {
//             highest: null,
//             high: null,
//             medium: null,
//             low: null,
//             lowest: null,
//         }
//     },
// })

// export const getters = {
//     dataPCLoaded(state) {
//         return (
//             !!stete.dataPC &&
//             state.dataPC.dataPC &&
//             state.dataPC.dataPC.length > 0
//         )
//     },
//     // xpto(state) {
//     //     return state.municipios.filter(municipios => municipios.verdadeiro)
//     // }

// }

// export const mutations = {
//     setIsLoadingPCDataPC(state, isLoadingPCDataPC) {
//         state.isLoadingPCDataPC = isLoadingPCDataPC
//     },
//     clearDataPC(state) {
//         state.dataPC = null
//     },
//     //
//     setStartDateMin(state, startDate) {
//         state.startDate = startDate
//     },
//     setEndeDateMax(state, endDate) {
//         state.endDate = endDate
//     },
//     setStartDate(state, startDate) {
//         state.startDate = startDate
//     },
//     setEndeDate(state, endData) {
//         state.endDate = endData
//     },
//     setMaxDate(state, maxDate) {
//         state.maxDate = maxDate
//     },
//     setMinDate(state, minDate) {
//         state.minDate = minDate
//     },
//     //
//     setFiltersDataPC(state, data){
//         state.filtersDataPC = data
//     },

// },

// export const action = {
//     async getDateMaxMin ({commit, state}) {
//         const response = await this.$api.$get(
//             'priority/consolidated/maxEndMinDate'
//         )

//         const data = {}

//         if (response){
//             commit ('setMaxDate', {
//                 ...state.filtersDataPC,
//                 maxData: response
//             })
//             commit ('setMinDate', {
//                 ...state.filtersDataPC,
//                 minData: response
//             })
//         }
//         // commit ('setMaxDate', params.maxData)
//         // commmit ('setMinDate', params.minData)
//         if (this.startDate && this.endDate === null)
//             commit ('setStartDateMin', this.maxDate)
//             commit ('setEndeDateMax', this.minDate)
//     },
//     async getAppliedFiltersDataPC({commit}) {
//         // Pegar o filtro aplicado no Funai
//         commit ()
//     },
//     async getCRFiltersDataPC({commit}) {
//         const cr = await this.$api.$get('funai/cr') // puxa novamente para esse store ou reaproveita da requisição feita na store Funai
//         const data = {}
//         if (cr) {
//             data.crFiltered = cr.sort((a, b) => a.no_cr > b.no_cr)
//         }
//         commit ()
//     },
//     async getTIFiltersDataPC({commit}) {
//         const ti = await this.$api.$get('funai/ti') // Esses municípios seram condicionados ao filtros aplicados CR e TI
//         const data = {}
//         if (ti) {
//             data.tiFiltered = ti.sort((a, b) => a.no_cr > b.no_cr)
//         }
//         commit ()
//     },
//     async getMunicipioFiltersDataPC({commit}) {
//         const municipios = await this.$api.$get('funai/ti') // Esses municípios seram condicionados ao filtros aplicados CR e TI
//         const data = {}
//         if (municipios) {
//             data.municipiosFiltered = municipios.sort((a, b) => a.no_cr > b.no_cr)
//         }
//         commit ()
//     },
//     async getDataPC({state, commit,}) {
//         commit('setIsLoadingPCDataPC', true)
//         commit('clearDataPC')

//         const paramsFilters = {

//         }
// }

// export const mutations = {
//     setDisplayAnalitcs (state, displayAnalitcs) {
//         state.displayAnalitcs = displayAnalitcs
//     },
//     setIsLoadingPCDataPC(state, isLoadingPCDataPC) {
//         state.isLoadingPCDataPC = isLoadingPCDataPC
//     },
//     clearDataPC(state) {
//         state.dataPC = null
//     },
//     //
//     setStartDateMin(state, startDate) {
//         state.startDate = startDate
//     },
//     setEndeDateMax(state, endDate, ) {
//         state.endDate = endDate
//     },
//     setStartDate(state, startDate) {
//         state.startDate = startDate
//     },
//     setEndeDate(state, endData) {
//         state.endDate = endData
//     },
//     setMaxDate(state, maxDate) {
//         state.maxDate = maxDate
//     },
//     setMinDate(state, minDate) {
//         state.minDate = minDate
//     },
//     //
//     setFiltersDataPC(state, data){
//         state.filtersDataPC = data
//     }
// },

// export const action = {
//     async getDateMaxMin ({commit, state}) {
//         const response = await this.$api.$get(
//             'priority/consolidated/maxEndMinDate'
//         )

//         const data = {}

//         if (response){
//             commit ('setMaxDate', {
//                 ...state.filtersDataPC,
//                 maxData: response
//             })
//             commit ('setMinDate', {
//                 ...state.filtersDataPC,
//                 minData: response
//             })
//         }
//         // commit ('setMaxDate', params.maxData)
//         // commmit ('setMinDate', params.minData)
//         if (this.startDate && this.endDate === null)
//             commit ('setStartDateMin', this.maxDate)
//             commit ('setEndeDateMax', this.minDate)
//     },
//     async getAppliedFiltersDataPC({commit}) {
//         // Pegar o filtro aplicado no Monitoring
//         commit ()
//     },
//     async getCRFiltersDataPC({commit}) {
//         const cr = await this.$api.$get('funai/cr') // puxa novamente para esse store ou reaproveita da requisição feita na store Funai
//         const data = {}
//         if (cr) {
//             data.crFiltered = cr.sort((a, b) => a.no_cr > b.no_cr)
//         }
//         commit ()
//     },
//     async getTIFiltersDataPC({commit}) {
//         const ti = await this.$api.$get('funai/ti') // Esses municípios seram condicionados ao filtros aplicados CR e TI
//         const data = {}
//         if (ti) {
//             data.tiFiltered = ti.sort((a, b) => a.no_cr > b.no_cr)
//         }
//         commit ()
//     },
//     async getMunicipioFiltersDataPC({commit}) {
//         const municipios = await this.$api.$get('funai/ti') // Esses municípios seram condicionados ao filtros aplicados CR e TI
//         const data = {}
//         if (municipios) {
//             data.municipiosFiltered = municipios.sort((a, b) => a.no_cr > b.no_cr)
//         }
//         commit ()
//     },
//     async getDataPC({state, commit,}) {
//         commit('setIsLoadingPCDataPC', true)
//         commit('clearDataPC')

//         const paramsFilters = {

//         }
//         commit()
//     },
// }
