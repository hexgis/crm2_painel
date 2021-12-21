export const state = () => ({
    showFeatures: false,
    changeDetections: [],
    changeDetectionsCount: null,
    changeDetectionsPerPage: 10,

    isLoadingDetections: false,
    filters: null,

    zoomedDetection: null,
    hoveredDetection: null,
})

export const getters = {
    showChangeDetections(state) {
        return state.changeDetections && state.changeDetections.length > 0
    },

    detectionsGeom(state) {
        const detectionsWithResult = state.changeDetections.filter(
            (detection) => {
                return detection.result && detection.visible
            }
        )

        const data = []
        detectionsWithResult.forEach((detection) => {
            data.push(detection.result)
        })

        return data
    },
}

export const mutations = {
    setShowFeatures(state, showFeatures) {
        state.showFeatures = showFeatures
    },

    setChangeDetections(state, changeDetections) {
        state.changeDetections = []
        for (const detection of changeDetections) {
            detection.visible = false
            // detection.visibleScene = [false, false]
            detection.visibleT0 = false
            detection.visibleT1 = false

            detection.loadingGeometry = false

            state.changeDetections.push(detection)
        }
    },

    setChangeDetectionsCount(state, count) {
        state.changeDetectionsCount = count
    },

    clearChangeDetections(state) {
        state.changeDetections = []
        state.changeDetectionsCount = 0
    },

    toggleDetectionVisibility(state, { index, visible }) {
        state.changeDetections.splice(index, 1, {
            ...state.changeDetections[index],
            visible,
        })
    },

    toggleDetectionSceneVisibility(state, { index, sceneIndex, visible }) {
        // state.changeDetections[index].visibleScene[sceneIndex] = visible
        if (sceneIndex === 0) {
            state.changeDetections[index].visibleT0 = visible
        } else {
            state.changeDetections[index].visibleT1 = visible
        }
    },

    toggleGeometryLoading(state, { index, loading }) {
        state.changeDetections.splice(index, 1, {
            ...state.changeDetections[index],
            loadingGeometry: loading,
        })
    },

    setLoadingChangeDetections(state, payload) {
        state.isLoadingDetections = payload
    },

    setFilters(state, filters) {
        state.filters = {
            ...state.filters,
            ...filters,
        }
    },

    setHoveredDetection(state, index) {
        state.hoveredDetection = index
    },

    setZoomedDetection(state, index) {
        state.zoomedDetection = index
    },

    setChangeDetectionResult(state, { index, geometry }) {
        state.changeDetections.splice(index, 1, {
            ...state.changeDetections[index],
            result: geometry,
        })
    },
}

export const actions = {
    async getChangeDetections({ commit, rootGetters }, filters) {
        commit('setLoadingChangeDetections', true)
        commit('clearChangeDetections')
        commit('setFilters', {
            ...filters,
            bbox: rootGetters['map/bbox'],
        })

        const params = {
            start_date: filters.startDate,
            end_date: filters.endDate,
            in_bbox: rootGetters['map/bbox'],
        }

        try {
            const response = await this.$apiSkynet.$get(
                'landsat/changes/list',
                {
                    params,
                }
            )

            commit('setChangeDetectionsCount', response.length)
            commit('setChangeDetections', response)
            commit('setShowFeatures', true)

            if (!response.length) {
                commit(
                    'alert/addAlert',
                    { message: this.$i18n.t('no-result') },
                    { root: true }
                )
            }
        } catch (exception) {
            commit(
                'alert/addAlert',
                {
                    message: this.$i18n.t('default-error', {
                        action: this.$i18n.t('retrieve'),
                        resource: this.$i18n.tc('change-detection', 2),
                    }),
                },
                { root: true }
            )
        } finally {
            commit('setLoadingChangeDetections', false)
        }
    },

    async getChangeDetectionGeometry({ state, commit }, index) {
        const detection = state.changeDetections[index]

        commit('toggleGeometryLoading', { index, loading: true })

        const params = {
            product_t0: detection.scene_t0.product,
            product_t1: detection.scene_t1.product,
        }

        try {
            const response = await this.$apiSkynet.$get('landsat/changes/', {
                params,
            })

            commit('toggleDetectionVisibility', { index, visible: true })
            commit('setChangeDetectionResult', { index, geometry: response })
        } catch (exception) {
            commit(
                'alert/addAlert',
                {
                    message: this.$i18n.t('default-error', {
                        action: this.$i18n.t('retrieve'),
                        resource: this.$i18n.tc('change-detection-geom', 1),
                    }),
                },
                { root: true }
            )
        } finally {
            commit('toggleGeometryLoading', { index, loading: false })
        }
    },
}
