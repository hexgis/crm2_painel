export const state = () => ({
    features: null,
    showFeatures: false,
    heatMap: true,
    tableDialogAlert: false,
    isLoadingTable: false,
    isLoadingFeatures: false,
    showDialogDocument: false,
    unitMeasurement: [],
    // displayAnalitcs: null, // responsável por exibir qual dos 4 Dashboards será exibido na tela: Filtro Aplicado; CR; TI; Municípios. Também encaminhar o filtro aplicado.
    visualizationStage: 'map',
    filterOptions: {
        regionalFilters: [],
        tiFilters: [],
        tiFiltersUpload: [],
        actions: []
    },

    filters: {
        startDate: null,
        endDate: null,
    },

    table: [],
})

export const getters = {
    featuresLoaded(state) {
        return (
            !!state.features &&
            state.features.features &&
            state.features.features.length > 0
        )
    },
}

export const mutations = {
    setFilters(state, filters) {
        state.filters = {
            ...state.filters,
            ...filters,
        }
    },

    setShowDialogDocument(state, payload) {
        state.showDialogDocument = payload
    },

    setParams(state, params) {
        state.params = params
    },

    setFeatures(state, features) {
        state.features = features
    },

    setActions(state, actions) {
        state.actions = actions
    },

    settableDialogAlert(state, tableDialogAlert) {
        state.tableDialogAlert = tableDialogAlert
    },

    setLoadingTable(state, loadingTable) {
        state.isLoadingTable = loadingTable
    },

    setLoadingFeatures(state, payload) {
        state.isLoadingFeatures = payload
    },

    clearFeatures(state) {
        state.features = null
    },

    setShowFeatures(state, showFeatures) {
        state.showFeatures = showFeatures
    },

    setTable(state, table) {
        state.table = table
    },

    setDownloadTable(state, tableCSV) {
        state.tableCSV = tableCSV
    },

    setFilterOptions(state, data) {
        state.filterOptions = data
    },

    setUnitMeasurement(state, unitMeasurement) {
        state.unitMeasurement = unitMeasurement
    },

    setVisualizationStage(state, visualizationStage) {
        state.visualizationStage = visualizationStage
    },
}

export const actions = {
    async getFeatures({ state, commit, rootGetters }) {
        commit('setLoadingGeoJson', true)
        commit('setLoadingFeatures', true)
        commit('clearFeatures')

        const params = {
            start_date: state.filters.startDate,
            end_date: state.filters.endDate,
        }

        if (state.filters.ti && state.filters.ti.length)
            params.co_funai = state.filters.ti.toString()

        if (state.filters.cr && state.filters.cr.length)
            params.co_cr = state.filters.cr.toString()

        if (state.filters.currentView) params.in_bbox = rootGetters['map/bbox']
        try {
            const response = await this.$api.$get('', {
                params,
            })

            if (!response.features || !response.features.length) {
                commit('setShowFeatures', false)
                commit(
                    'alert/addAlert',
                    { message: this.$i18n.t('no-result') },
                    { root: true }
                )
            } else {
                commit('setShowFeatures', true)
                commit('setFeatures', response)
            }
        } catch (exception) {
            commit(
                'alert/addAlert',
                {
                    message: this.$i18n.t('default-error', {
                        action: this.$i18n.t('retrieve'),
                        resource: this.$i18n.t('monitoring'),
                    }),
                },
                { root: true }
            )
        } finally {
            commit('setLoadingFeatures', false)
            commit('setParams', params)
            commit('setLoadingGeoJson', false)
        }
    },

    async getFilterOptions({ commit }) {
        const regional_coordinators = await this.$api.$get('funai/cr/')

        const data = {}

        if (regional_coordinators) {
            data.regionalFilters = regional_coordinators.sort(
                (a, b) => a.ds_cr > b.ds_cr
            )
        }

        commit('setFilterOptions', data)
    },

    async getTiOptions({ commit, state }, cr) {
        const params = {
            co_cr: cr.toString(),
        }

        const tis = await this.$api.$get('funai/ti/', { params })

        if (tis)
            commit('setFilterOptions', {
                ...state.filterOptions,
                tiFilters: tis.sort((a, b) => a.no_ti > b.no_ti),
            })
    },

    async getTiUploadOptions({ commit, state }, cr) {
        const tis = await this.$api.$get('funai/ti/')

        if (tis)
            commit('setFilterOptions', {
                ...state.filterOptions,
                tiFiltersUpload: tis.sort((a, b) => a.no_ti > b.no_ti),
            })
    },

    async getActionsUploadOptions({ commit }) {
        const tis = await this.$api.$get('documental/list-actions/')

        commit('setActions', actions)
    },

    async getDataTable({ commit, state, rootGetters }) {
        commit('setLoadingFeatures', true)
        commit('setLoadingTable', true)
        const params = {
            start_date: state.filters.startDate,
            end_date: state.filters.endDate,
        }

        if (state.filters.ti && state.filters.ti.length)
            params.co_funai = state.filters.ti.toString()

        if (state.filters.cr && state.filters.cr.length)
            params.co_cr = state.filters.cr.toString()

        if (state.filters.currentView) params.in_bbox = rootGetters['map/bbox']

        try {
            const table = await this.$api.$get('', {
                params,
            })

            if (table) commit('setTable', table)

        } catch (error) {
            commit(
                'alert/addAlert',
                {
                    message: this.$i18n.t('default-error', {
                        action: this.$i18n.t('retrieve'),
                        resource: this.$i18n.t('monitoring'),
                    }),
                },
                { root: true }
            )
        } finally {
            commit('setLoadingFeatures', false)
            commit('setLoadingTable', false)
        }
    },
}
