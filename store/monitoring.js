export const state = () => ({
    features: null,
    showFeatures: false,

    isLoadingFeatures: false,
    filterOptions: {
        regionalFilters: [],
    },
    filters: {
        startDate: null,
        endDate: null,
    },

    opacity: 100,
    heatMap: true,
    total: null,
})

export const getters = {
    featuresLoaded(state) {
        return (
           state.features &&
            state.features.features &&
            state.features.features.length > 0
        )
    },
}

export const mutations = {
    setFeatures(state, features) {
        state.features = features
        state.isLoadingFeatures = false
    },

    setShowFeatures(state, showFeatures) {
        state.showFeatures = showFeatures
    },

    clearFeatures(state) {
        state.features = null
    },
    setTotal(state, total) {
        state.total = total
    },

    setLoadingFeatures(state, payload) {
        state.isLoadingFeatures = payload
    },
    setFilterOptions(state, data) {
        state.filterOptions = data
    },

    setOpacity(state, opacity) {
        state.opacity = opacity
    },

    setHeatMap(state, heatMap) {
        state.heatMap = heatMap
    },

    setFilters(state, filters) {
        state.filters = {
            ...state.filters,
            ...filters,
        }
    },
}

export const actions = {
    async getFeatures({ state, commit, rootGetters }) {
        commit('setLoadingFeatures', true)
        commit('clearFeatures')

        const params = {
            start_date: state.filters.startDate,
            end_date: state.filters.endDate,
        }

        if (state.filters.currentView) params.in_bbox = rootGetters['map/bbox']

        if (state.filters.cr && state.filters.cr.length)
            params.co_cr = state.filters.cr.toString()
        
        try {
            const response = await this.$api.$get('monitoring/consolidated/', {
                params,
            })

            if (!response.features || !response.features.length) {
                commit(
                    'alert/addAlert',
                    { message: this.$i18n.t('no-result') },
                    { root: true }
                )
            } else {
                commit('setFeatures', response)
                commit('setShowFeatures', true)
                const total = await this.$api.$get(
                    'monitoring/consolidated/stats/',
                    {
                        params,
                    }
                )
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
        const regional_coordinators = await this.$api.$get('funai/cr/')

        const data = {}

        if (regional_coordinators) {
            data.regionalFilters = regional_coordinators.sort(
                (a, b) => a.ds_cr > b.ds_cr
            )
        }

        commit('setFilterOptions', data)
    },
}
