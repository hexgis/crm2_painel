export const state = () => ({
    features: null,
    showFeatures: false,
    heatMap: true,
    tableDialogAlert: false,
    isLoadingTable: false,
    isLoadingFeatures: false,
    isLoadingDocumentActions: false,
    showDialogDocument: false,
    unitMeasurement: [],
    // displayAnalitcs: null, // responsável por exibir qual dos 4 Dashboards será exibido na tela: Filtro Aplicado; CR; TI; Municípios. Também encaminhar o filtro aplicado.
    visualizationStage: 'map',
    filterOptions: {
        regionalFilters: [],
        tiFilters: [],
        tiFiltersUpload: [],
        actions: [],
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

    setFeatures(state, features) {
        state.features = features
    },

    setLoadingDocumentActions(state, payload) {
        state.isLoadingDocumentActions = payload
    },

    setDocumentActions(state, payload) {
        state.filterOptions.actions = payload
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

    setFilterOptionsCr(state, data) {
        state.filterOptions.regionalFilters = data.regionalFilters
    },

    setFilterOptionsTi(state, data) {
        state.filterOptions.tiFilters = data
    },

    setUnitMeasurement(state, unitMeasurement) {
        state.unitMeasurement = unitMeasurement
    },

    setVisualizationStage(state, visualizationStage) {
        state.visualizationStage = visualizationStage
    },
}

export const actions = {
    async getFeatures({ state, commit, rootGetters }, filters) {
        commit('setLoadingFeatures', true)
        try {
            const response = await this.$api.$get('/documental/list/', filters)
            commit('setFeatures', response)
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
        }
    },

    async getDocumentActions({ state, commit }, actionType) {
        commit('setLoadingDocumentActions', true)

        try {
            const documentActions = await this.$api.$get(
                `documental/list-actions/?action_type=${actionType}`
            )

            if (documentActions) commit('setDocumentActions', documentActions)
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
            commit('setLoadingDocumentActions', false)
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
        commit('setFilterOptionsCr', data)
    },

    async getTiOptions({ commit, state }, cr) {
        const params = {
            co_cr: cr.toString(),
        }
        const tis = await this.$api.$get('funai/ti/', { params })
        if (tis)
            commit(
                'setFilterOptionsTi',
                tis.sort((a, b) => a.no_ti > b.no_ti)
            )
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
}
