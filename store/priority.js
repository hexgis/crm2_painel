export const state = () => ({
    showFeatures: false,
    showFilters: true,

    scenes: [],
    otherPageScenes: [],
    sceneCount: null,
    scenesPerPage: 20,
    page: 1,

    hoveredScene: null,
    hoveredGridScene: null,
    zoomedScene: null,

    scenesToCompare: {
        leftIndex: null,
        leftImage: null,
        leftInOtherPage: false,
        rightIndex: null,
        rightImage: null,
        rightInOtherPage: false,
    },
    isComparing: false,

    isLoadingScenes: false,

    filters: null,
})

export const getters = {
    showScenes(state) {
        return state.scenes && state.scenes.length > 0
    },

    activeImages(state) {
        const activeImages = []
        for (const scene of state.scenes) {
            if (scene.tmsVisible) {
                activeImages.push(scene.properties.image)
            }
        }
        return activeImages
    },
}

export const mutations = {
    setShowFeatures(state, showFeatures) {
        state.showFeatures = showFeatures
    },

    setScenes(state, { scenes, page }) {
        state.scenes = []
        for (const scene of scenes) {
            scene.tmsVisible = false
            scene.page = page
            state.scenes.push(scene)
        }
    },

    setSceneCount(state, count) {
        state.sceneCount = count
    },

    setPage(state, page) {
        state.page = page
    },

    toggleTmsVisibility(state, { index, tmsVisible }) {
        state.scenes.splice(index, 1, {
            ...state.scenes[index],
            tmsVisible,
        })
    },

    clearScenes(state) {
        state.scenes = []
        state.otherPageScenes = []
        state.sceneCount = 0
    },

    setLoadingScenes(state, payload) {
        state.isLoadingScenes = payload
    },

    setFilters(state, filters) {
        state.filters = {
            ...state.filters,
            ...filters,
        }
    },

    setHoveredScene(state, scene) {
        state.hoveredScene = scene
    },

    setHoveredGridScene(state, sceneIndex) {
        state.hoveredGridScene = sceneIndex
    },

    setZoomedScene(state, scene) {
        state.zoomedScene = scene
    },

    toggleSceneToCompare(state, sceneIndex) {
        if (
            state.scenesToCompare.leftIndex === sceneIndex &&
            !state.scenesToCompare.leftInOtherPage
        ) {
            state.scenesToCompare.leftIndex = null
        } else if (
            state.scenesToCompare.rightIndex === sceneIndex &&
            !state.scenesToCompare.rightInOtherPage
        ) {
            state.scenesToCompare.rightIndex = null
        } else if (
            state.scenesToCompare.leftIndex == null &&
            !state.scenesToCompare.leftInOtherPage
        ) {
            state.scenesToCompare.leftIndex = sceneIndex
            state.scenesToCompare.leftImage =
                state.scenes[sceneIndex].properties.image
        } else if (
            state.scenesToCompare.rightIndex == null &&
            !state.scenesToCompare.rightInOtherPage
        ) {
            state.scenesToCompare.rightIndex = sceneIndex
            state.scenesToCompare.rightImage =
                state.scenes[sceneIndex].properties.image
        }

        if (
            state.scenesToCompare.leftIndex != null &&
            state.scenesToCompare.rightIndex != null &&
            !state.isComparing
        ) {
            state.isComparing = true
        } else if (
            state.scenesToCompare.leftIndex == null &&
            state.scenesToCompare.rightIndex == null
        ) {
            state.isComparing = false
        }
    },

    setIsComparing(state, payload) {
        state.isComparing = payload
    },

    clearScenesToCompare(state) {
        state.scenesToCompare = {
            leftIndex: null,
            leftInOtherPage: false,
            rightIndex: null,
            rightInOtherPage: false,
        }
    },

    storeActivePageScenes(state) {
        state.scenes.forEach((scene, index) => {
            if (scene.tmsVisible) {
                state.otherPageScenes.push(scene)

                const newIndex = state.otherPageScenes.length - 1

                if (
                    index === state.scenesToCompare.leftIndex &&
                    !state.scenesToCompare.leftInOtherPage &&
                    scene.properties.image === state.scenesToCompare.leftImage
                ) {
                    state.scenesToCompare.leftIndex = newIndex
                    state.scenesToCompare.leftInOtherPage = true
                } else if (
                    index === state.scenesToCompare.rightIndex &&
                    !state.scenesToCompare.rightInOtherPage &&
                    scene.properties.image === state.scenesToCompare.rightImage
                ) {
                    state.scenesToCompare.rightIndex = newIndex
                    state.scenesToCompare.rightInOtherPage = true
                }
            }
        })
    },

    checkPreviousActiveScenes(state, newPage) {
        const postRemove = []

        state.otherPageScenes.forEach((oldScene, index) => {
            if (oldScene.page === newPage) {
                const newSceneIndex = state.scenes.findIndex((scene) => {
                    return scene.properties.image === oldScene.properties.image
                })

                if (newSceneIndex !== -1) {
                    state.scenes[newSceneIndex].tmsVisible = true

                    if (state.scenesToCompare.leftInOtherPage) {
                        if (
                            state.scenesToCompare.leftIndex === index &&
                            state.scenes[newSceneIndex].properties.image ===
                                state.scenesToCompare.leftImage
                        ) {
                            state.scenesToCompare.leftIndex = newSceneIndex
                            state.scenesToCompare.leftInOtherPage = false
                        }
                    }

                    if (state.scenesToCompare.rightInOtherPage) {
                        if (
                            state.scenesToCompare.rightIndex === index &&
                            state.scenes[newSceneIndex].properties.image ===
                                state.scenesToCompare.rightImage
                        ) {
                            state.scenesToCompare.rightIndex = newSceneIndex
                            state.scenesToCompare.rightInOtherPage = false
                        }
                    }

                    postRemove.push(index)
                }
            }
        })

        state.otherPageScenes = state.otherPageScenes.filter((_, index) => {
            return !postRemove.includes(index)
        })

        if (postRemove.length > 0) {
            if (state.scenesToCompare.leftInOtherPage) {
                state.scenesToCompare.leftIndex =
                    state.otherPageScenes.findIndex((otherScene) => {
                        return (
                            otherScene.properties.image ===
                            state.scenesToCompare.leftImage
                        )
                    })
            }
            if (state.scenesToCompare.rightInOtherPage) {
                state.scenesToCompare.rightIndex =
                    state.otherPageScenes.findIndex((otherScene) => {
                        return (
                            otherScene.properties.image ===
                            state.scenesToCompare.rightImage
                        )
                    })
            }
        }
    },

    setShowFilters(state, payload) {
        state.showFilters = payload
    },
}

export const actions = {

    async getScenes({ state, commit, rootGetters }, filters) {
        commit('setLoadingScenes', true)
        commit('clearScenes')
        commit('setPage', 1)

        if (filters.currentView) {
            filters.bbox = rootGetters['map/bbox']
        }

        commit('setFilters', filters)

        const params = {
            start_date: state.filters.startDate,
            end_date: state.filters.endDate,
            in_bbox: state.filters.bbox,
            page: 1,
        }

        try {
            const response = await this.$api.$get('catalog/images', {
                params,
            })
            commit('setSceneCount', response.count)
            commit('setScenes', { scenes: response.features, page: 1 })
            commit('setShowFeatures', true)
            
        } finally {
            commit('setLoadingScenes', false)
            commit('setShowFilters', false)
        }
    },

    async changeScenePage({ state, commit }) {
        commit('setLoadingScenes', true)
        commit('storeActivePageScenes')

        const params = {
            start_date: state.filters.startDate,
            end_date: state.filters.endDate,
            in_bbox: state.filters.bbox,
            page: state.page,
        }

        try {
            const response = await this.$api.$get('catalog/images', {
                params,
            })
            commit('setScenes', { scenes: response.features, page: state.page })
            if (!response.features.length) {
                
            } else {
                commit('checkPreviousActiveScenes', state.page)
            }
        } finally {
            commit('setLoadingScenes', false)
        }
    },

    async getImagesOnDates({ commit, rootGetters }, filters) {
        const { t0, t1, locator } = filters

        const catalogFilters = {
            startDate: t0,
            endDate: t1,
            locator,
            page: 1,
            currentView: filters.currentView,
        }

        commit('setLoadingScenes', true)
        commit('clearScenes')
        commit('setPage', 1)

        if (filters.currentView) {
            catalogFilters.bbox = rootGetters['map/bbox']
        }

        commit('setFilters', catalogFilters)

        try {
            const response = await this.$api.$get(`catalog/images/changes`, {
                params: {
                    date__in: `${t0},${t1}`,
                    locator,
                },
            })

            if (response) {
                commit('setSceneCount', response.count)
                commit('setScenes', { scenes: response.features, page: 1 })
                commit('setShowFeatures', true)

                if (!response.features.length) {
                    commit(
                        'alert/addAlert',
                        { message: this.$i18n.t('no-result') },
                        { root: true }
                    )
                }
            }
        } catch (exception) {
            commit(
                'alert/addAlert',
                {
                    message: this.$i18n.t('default-error', {
                        action: this.$i18n.t('retrieve'),
                        resource: this.$i18n.tc('catalog', 2),
                    }),
                },
                { root: true }
            )
        } finally {
            commit('setLoadingScenes', false)
            commit('setShowFilters', false)
        }
    },
}
