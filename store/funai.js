export const state = () => ({
    features: null,
    showFeatures: false,
    heatMap: true,
    isLoadingFeatures: false,
    unitMeasurement: [],
    // displayAnalitcs: null, // responsável por exibir qual dos 4 Dashboards será exibido na tela: Filtro Aplicado; CR; TI; Municípios. Também encaminhar o filtro aplicado.
    visualizationStage: 'stage1',
    filterOptions: {
        regionalFilters: [],
        tiFilters: [],
        priority: [],
    },

    filters: {
        startDate: null,
        endDate: null,
        currentView: false,
        priority: null,
    },

    opacity: 100,
    total: null,
    table: {},
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

    setFeatures(state, features) {
        state.features = features
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

    setOpacity(state, opacity) {
        state.opacity = opacity
    },

    setTable(state, table) {
        state.table = table
    },

    setFilterOptions(state, data) {
        state.filterOptions = data
    },

    setTotal(state, total) {
        state.total = total
    },

    setHeatMap(state, heatMap) {
        state.heatMap = heatMap
    },
    //
    setUnitMeasurement(state, unitMeasurement) {
        state.unitMeasurement = unitMeasurement
    },
    setVisualizationStage(state, visualizationStage) {
        state.visualizationStage = visualizationStage
    },
    //
}

export const actions = {
    async getFeatures({ state, commit, rootGetters }) {
        commit('setLoadingFeatures', true)
        commit('clearFeatures')

        const params = {
            start_date: state.filters.startDate,
            end_date: state.filters.endDate,
            currentView: state.filters.currentView,
            co_cr: state.filters.cr,
        }

        if (state.filters.ti && state.filters.ti.length)
            params.co_funai = state.filters.ti.join(',')

        if (state.filters.priority && state.filters.priority.length)
            params.priority = state.filters.priority.join(',')

        if (state.filters.currentView) params.in_bbox = rootGetters['map/bbox']

        try {
            const response = await this.$api.$get('priority/consolidated/', {
                params,
            })

            commit('setFeatures', response)

            if (!response.features || !response.features.length) {
                commit('setShowFeatures', false)
                commit(
                    'alert/addAlert',
                    { message: this.$i18n.t('no-result') },
                    { root: true }
                )
            } else {
                commit('setShowFeatures', true)

                const table = await this.$api.$get(
                    'priority/consolidated/table/',
                    {
                        params,
                    }
                )

                const total = await this.$api.$get(
                    'priority/consolidated/total/',
                    {
                        params,
                    }
                )
                if (table) commit('setTable', table)
                if (total) commit('setTotal', total)
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
        }
    },

    async getFilterOptions({ commit }) {
        const regional = await this.$api.$get('funai/cr/')
        const priorities = await this.$api.$get(
            'priority/consolidated/priorities/'
        )

        const data = {}

        if (regional) {
            data.regionalFilters = regional.sort((a, b) => a.ds_cr > b.ds_cr)
        }

        if (priorities) {
            data.priority = priorities
        }

        commit('setFilterOptions', data)
    },

    async getTiOptions({ commit, state }, cr) {
        const params = {
            co_cr: cr,
        }

        const tis = await this.$api.$get('funai/ti/', { params })

        if (tis)
            commit('setFilterOptions', {
                ...state.filterOptions,
                tiFilters: tis.sort((a, b) => a.no_ti > b.no_ti),
            })
    },
}
