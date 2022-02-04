import Vue from 'vue'

export const state = () => ({
    showFeatures: false,
    supportLayersGroups: {},
    supportLayers: {},

    loading: false,
})

export const getters = {
    activeLayerIds(state) {
        const activeLayerIds = []
        for (const layer of Object.values(state.supportLayers)) {
            if (layer.visible) {
                activeLayerIds.push(layer.id)
            }
        }
        return activeLayerIds
    },
}

export const mutations = {
    setShowFeatures(state, showFeatures) {
        state.showFeatures = showFeatures
    },

    setSupportLayersGroups(state, layersGroups) {
        state.supportLayersGroups = {}
        state.supportLayers = {}

        for (const group of layersGroups) {
            const layers = group.layers
            group.layers = []

            for (const layer of layers) {
                layer.visible = false

                if (layer.layer_type === 'wms' && layer.wms.default_opacity) {
                    layer.opacity = layer.wms.default_opacity
                } else {
                    layer.opacity = 100
                }

                layer.loading = false
                layer.filters = []
                layer.data = []

                group.layers.push(layer.id)
                Vue.set(state.supportLayers, layer.id, layer)
            }

            Vue.set(state.supportLayersGroups, group.id, group)
        }
    },

    setLayerFilters(state, { id, filters }) {
        state.supportLayers[id].filters = {
            ...state.supportLayers[id].filters,
            ...filters,
        }
    },

    toggleLayerVisibility(state, { id, visible }) {
        state.supportLayers[id].visible = visible
    },

    setLayerOpacity(state, { id, opacity }) {
        state.supportLayers[id].opacity = opacity
    },

    setLayerLoading(state, { id, loading }) {
        state.supportLayers[id].loading = loading
    },

    setHeatLayerData(state, { id, data }) {
        state.supportLayers[id].data = data
        state.supportLayers[id].visible = true
    },

    setLoading(state, loading) {
        state.loading = loading
    },
}

export const actions = {
    async getLayersGroups({ commit }) {
        commit('setLoading', true)
        try {
            const response = await this.$api.$get('support/layers-groups')

            commit('setSupportLayersGroups', response)
            commit('setShowFeatures', true)
        } catch (exception) {
            commit(
                'alert/addAlert',
                {
                    message: this.$i18n.t('default-error', {
                        action: this.$i18n.t('retrieve'),
                        resource: this.$i18n.tc('layer', 2),
                    }),
                },
                { root: true }
            )
        } finally {
            commit('setLoading', false)
        }
    },

    async getHeatMapLayer({ state, commit }, { id, filters }) {
        const heatLayer = state.supportLayers[id]
        const params = {
            ...filters,
            type: heatLayer.heatmap.heatmap_type.identifier,
        }

        commit('setLayerLoading', { id, loading: true })

        try {
            const data = await this.$api.$get('monitoring/heatmap', {
                params,
            })

            commit('setHeatLayerData', { id, data })
            commit('setLayerLoading', { id, loading: false })
            commit('setShowFeatures', true)
        } catch (exception) {
            commit(
                'alert/addAlert',
                {
                    message: this.$i18n.t('default-error', {
                        action: this.$i18n.t('retrieve'),
                        resource: this.$i18n.tc('layer', 1),
                    }),
                },
                { root: true }
            )
        }
    },
}
