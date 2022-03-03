export const state = () => ({
    features: null,
    showFeatures: false,

    isLoadingFeatures: false,
    filters: {
        startDate: null,
        endDate: null,
    },

    opacity: 100,
    heatMap: true,
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

    setLoadingFeatures(state, payload) {
        state.isLoadingFeatures = payload
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

        try {
            const response = await this.$api.$get('monitoring/', {
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
}
