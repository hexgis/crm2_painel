export const state = () => ({
    features: null,
    showFeatures: false,
    tableDialogAlert: false,
    isLoadingFeatures: false,
    isLoadingMapotecainstitution: false,
    showDialogMapoteca: false,
    unitMeasurement: [],
    visualizationStage: 'map',
    filterOptions: {
        regionalFilters: [],
        tiFilters: [],
        actions: [],
    },
    filters: {
        startDate: null,
        endDate: null,
    },
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

    setShowDialogMapoteca(state, payload) {
        state.showDialogMapoteca = payload
    },

    setActions(state, actions) {
        state.actions = actions
    },

    setParams(state, params) {
        state.params = params
    },

    setFeatures(state, features) {
        state.features = features
    },

    settableDialogAlert(state, tableDialogAlert) {
        state.tableDialogAlert = tableDialogAlert
    },

    setLoadingFeatures(state, payload) {
        state.isLoadingFeatures = payload
    },

    setMapotecaActions(state, payload) {
        state.filterOptions.actions = payload
    },

    setisLoadingMapotecaInstitution(state, payload) {
        state.isLoadingMapotecainstitution = payload
    },

    setFilterOptionsTi(state, data) {
        state.filterOptions.tiFilters = data
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

    setFilterOptions(state, data) {
        state.filterOptions.regionalFilters = data.regionalFilters
    },

    setUnitMeasurement(state, unitMeasurement) {
        state.unitMeasurement = unitMeasurement
    },

    setVisualizationStage(state, visualizationStage) {
        state.visualizationStage = visualizationStage
    },
}

export const actions = {
    async getFeatures({ state, commit }, data) {
        commit('setLoadingFeatures', true)
        const params = { ...data }
        params.id_acao = params.id_acao.toString()
        params.cr ? (params.cr = params.cr.toString()) : null
        params.ti ? (params.ti = params.ti.toString()) : null
        try {
            const response = await this.$api.$get('/documental/list/', {
                params,
            })
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

    async getMapotecaActions({ state, commit }, actionType) {
        commit('setisLoadingMapotecaInstitution', true)

        try {
            const documentActions = await this.$api.$get(
                `documental/list-actions/?action_type=${actionType}`
            )

            if (documentActions) commit('setMapotecaActions', documentActions)
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
            commit('setisLoadingMapotecaInstitution', false)
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
            commit(
                'setFilterOptionsTi',
                tis.sort((a, b) => a.no_ti > b.no_ti)
            )
    },

    async getActionsUploadMapoteca({ commit }) {
        const tis = await this.$api.$get('documental/list-actions/')
        commit('setActions', actions)
    },
}
