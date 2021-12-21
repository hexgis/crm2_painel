export const state = () => ({
    showFeatures: false,
    scenes: [],
    otherPageScenes: [],
    sceneCount: null,
    scenesPerPage: 20,
    page: 1,

    isLoadingScenes: false,
    filters: null,

    satellite: null,
    bands: [],
    compositions: [],

    zoomedScene: null,
    hoveredScene: null,
    hoveredGridScene: null,

    diffSceneProduct: null,
    diffGeom: null,
    loadingDiff: false,

    wmtsConfirm: false,
})

export const getters = {
    showScenes(state) {
        return state.scenes && state.scenes.length > 0
    },

    isHighResSatellite(state) {
        return state.satellite
            ? state.satellite.agency === 'AIRBUS' ||
                  state.satellite.agency === 'HEAD'
            : false
    },

    hasImageType: (state) => (index, type) => {
        return state.scenes[index].properties.images
            ? state.scenes[index].properties.images.find(
                  (image) =>
                      image.type.localeCompare(type, undefined, {
                          sensitivity: 'base',
                      }) === 0
              )
            : false
    },

    sceneImage: (state) => (index, bandOrComp) => {
        return state.scenes[index].properties.images.find(
            (image) =>
                image.type.localeCompare(bandOrComp.type, undefined, {
                    sensitivity: 'base',
                }) === 0
        )
    },
}

export const mutations = {
    setShowFeatures(state, showFeatures) {
        state.showFeatures = showFeatures
    },

    setScenes(state, { scenes, page }) {
        state.scenes = []
        for (const scene of scenes) {
            scene.visible = false
            scene.page = page
            scene.wmtsVisible = false
            state.scenes.push(scene)
        }
        state.showFeatures = true
    },

    setSceneCount(state, count) {
        state.sceneCount = count
    },

    setPage(state, page) {
        state.page = page
    },

    clearScenes(state) {
        state.scenes = []
        state.otherPageScenes = []
        state.sceneCount = 0
    },

    toggleScenePreview(state, { index, visible }) {
        state.scenes.splice(index, 1, {
            ...state.scenes[index],
            visible,
        })
    },

    toggleSceneWmtsPreview(state, { index, wmtsVisible }) {
        state.scenes.splice(index, 1, {
            ...state.scenes[index],
            wmtsVisible,
        })
    },

    toggleImagePreview(state, { index, imageType, visible }) {
        const imageIndex = state.scenes[index].properties.images.findIndex(
            (image) =>
                image.type.localeCompare(imageType, undefined, {
                    sensitivity: 'base',
                }) === 0
        )
        const image = state.scenes[index].properties.images[imageIndex]

        state.scenes[index].properties.images.splice(imageIndex, 1, {
            ...image,
            visible,
        })
    },

    setScenePreview(state, { index, preview }) {
        state.scenes[index].properties.preview = preview
    },

    updateScene(state, { index, scene }) {
        state.scenes.splice(index, 1, {
            ...state.scenes[index],
            ...scene,
        })
    },

    updateImage(state, { index, identifier, image }) {
        const imageIndex = state.scenes[index].properties.images.findIndex(
            (image) => image.identifier === identifier
        )
        const oldImage = state.scenes[index].properties.images[imageIndex]

        state.scenes[index].properties.images.splice(imageIndex, 1, {
            ...oldImage,
            ...image,
        })
    },

    togglePreviewLoading(state, { index, loading }) {
        state.scenes.splice(index, 1, {
            ...state.scenes[index],
            loadingPreview: loading,
        })
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

    setSatellite(state, satellite) {
        state.satellite = satellite
    },

    setBands(state, bands) {
        state.bands = bands.sort((a, b) => {
            return a.type.localeCompare(b.type, undefined, {
                numeric: true,
                sensitivity: 'base',
            })
        })
    },

    setCompositions(state, compositions) {
        state.compositions = compositions
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

    setDiffSceneProduct(state, scene) {
        state.diffSceneProduct = scene
    },

    setDiffGeom(state, feature) {
        state.diffGeom = feature
    },

    setLoadingDiff(state, loading) {
        state.loadingDiff = loading
    },

    setWmtsConfirm(state, confirm) {
        state.wmtsConfirm = confirm
    },

    storeActivePageScenes(state) {
        state.scenes.forEach((scene) => {
            let sceneHasCompositionVisible = false

            if (scene.properties && scene.properties.images) {
                const filtered = scene.properties.images.filter(
                    (image) => image.visible
                )

                if (filtered.length) {
                    sceneHasCompositionVisible = true
                }
            }

            if (scene.visible || sceneHasCompositionVisible) {
                state.otherPageScenes.push(scene)
            }
        })
    },

    removeOtherPageScenes(state, removeIndexes) {
        state.otherPageScenes = state.otherPageScenes.filter((_, index) => {
            return !removeIndexes.includes(index)
        })
    },
}

export const actions = {
    async getScenes({ state, commit, getters, rootGetters }, { filters }) {
        commit('setLoadingScenes', true)
        commit('clearScenes')
        commit('setPage', 1)
        commit('setDiffSceneProduct', null)
        commit('setSatellite', filters.satellite)
        commit('setFilters', {
            ...filters,
            bbox: rootGetters['map/bbox'],
        })

        if (!state.filters.sortKey) {
            commit('setFilters', { sortKey: '-acquisitionDate' })
        }

        const params = {
            page: 1,
            start_date: filters.startDate,
            end_date: filters.endDate,
            cloud_cover: filters.cloudCover,
            path: filters.path,
            row: filters.row,
            tile: filters.tile,
            in_bbox: rootGetters['map/bbox'],
            incidence_angle: getters.isHighResSatellite
                ? filters.incidenceAngle
                : undefined,
            processing_level: filters.streamOTF ? 'SENSOR' : undefined,
            sort_key: state.filters.sortKey,
            sat_id: state.filters.satellite.id,
        }

        try {
            const response = await this.$apiSkynet.$get(
                filters.satellite.path + 'scenes',
                {
                    params,
                }
            )

            commit('setSceneCount', response.count)
            commit('setScenes', { scenes: response.features, page: 1 })

            if (!response.features.length) {
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
                        resource: this.$i18n.tc('imagery', 2),
                    }),
                },
                { root: true }
            )
        } finally {
            commit('setLoadingScenes', false)
        }
    },

    async changePage({ state, commit, dispatch, getters }) {
        commit('setLoadingScenes', true)
        commit('storeActivePageScenes')

        const params = {
            page: state.page,
            start_date: state.filters.startDate,
            end_date: state.filters.endDate,
            cloud_cover: state.filters.cloudCover,
            path: state.filters.path,
            row: state.filters.row,
            tile: state.filters.tile,
            in_bbox: state.filters.bbox,
            incidence_angle: getters.isHighResSatellite
                ? state.filters.incidenceAngle
                : undefined,
            processing_level: state.filters.streamOTF ? 'SENSOR' : undefined,
            sort_key: state.filters.sortKey,
            sat_id: state.filters.satellite.id,
        }

        try {
            const response = await this.$apiSkynet.$get(
                state.satellite.path + 'scenes',
                {
                    params,
                }
            )

            commit('setScenes', { scenes: response.features, page: state.page })

            if (!response.features.length) {
                commit(
                    'alert/addAlert',
                    { message: this.$i18n.t('no-result') },
                    { root: true }
                )
            } else {
                dispatch('checkPreviousActiveScenes', state.page)
            }
        } catch (exception) {
            commit(
                'alert/addAlert',
                {
                    message: this.$i18n.t('default-error', {
                        action: this.$i18n.t('retrieve'),
                        resource: this.$i18n.tc('imagery', 2),
                    }),
                },
                { root: true }
            )
        } finally {
            commit('setLoadingScenes', false)
        }
    },

    async getBands({ commit }, satellite) {
        try {
            const response = await this.$apiSkynet.$get('bands', {
                params: { sat_id: satellite.id },
            })
            commit('setBands', response)
        } catch (exception) {
            commit(
                'alert/addAlert',
                {
                    message: this.$i18n.t('default-error', {
                        action: this.$i18n.t('retrieve'),
                        resource: this.$i18n.tc('band', 2),
                    }),
                },
                { root: true }
            )
        }
    },

    async getCompositions({ commit }, satellite) {
        try {
            const response = await this.$apiSkynet.$get('compositions', {
                params: { sat_id: satellite.id },
            })
            commit('setCompositions', response)
        } catch (exception) {
            commit(
                'alert/addAlert',
                {
                    message: this.$i18n.t('default-error', {
                        action: this.$i18n.t('retrieve'),
                        resource: this.$i18n.tc('composition', 2),
                    }),
                },
                { root: true }
            )
        }
    },

    async getDiffData({ state, commit }, product) {
        commit('setLoadingDiff', true)

        try {
            const response = await this.$apiSkynet.$get('landsat/changes', {
                params: {
                    product_t0: state.diffSceneProduct,
                    product_t1: product,
                },
            })
            commit('setDiffGeom', response)
        } catch (exception) {
            commit(
                'alert/addAlert',
                {
                    message: this.$i18n.t('default-error', {
                        action: this.$i18n.t('generate'),
                        resource: this.$i18n.tc('change-detection', 1),
                    }),
                },
                { root: true }
            )
        } finally {
            commit('setLoadingDiff', false)
            commit('setDiffSceneProduct', null)
        }
    },

    async updateScene({ state, commit }, { index, product }) {
        try {
            const scene = await this.$apiSkynet.$get(
                state.satellite.path + 'scene/' + product
            )
            commit('updateScene', { index, scene })
        } catch (exception) {
            commit(
                'alert/addAlert',
                {
                    message: this.$i18n.t('default-error', {
                        action: this.$i18n.t('update'),
                        resource: this.$i18n.tc('imagery', 1),
                    }),
                },
                { root: true }
            )
        }
    },

    checkPreviousActiveScenes({ state, commit, dispatch, getters }, newPage) {
        const postRemove = []

        state.otherPageScenes.forEach((oldScene, index) => {
            if (oldScene.page === newPage) {
                const newSceneIndex = state.scenes.findIndex((scene) => {
                    return (
                        scene.properties.product === oldScene.properties.product
                    )
                })

                if (newSceneIndex !== -1) {
                    if (oldScene.visible) {
                        commit('toggleScenePreview', {
                            index: newSceneIndex,
                            visible: true,
                        })
                    }

                    if (getters.isHighResSatellite) {
                        commit('setScenePreview', {
                            index: newSceneIndex,
                            preview: oldScene.properties.preview,
                        })
                    } else if (oldScene.properties.images) {
                        dispatch('updateScene', {
                            index: newSceneIndex,
                            product:
                                state.scenes[newSceneIndex].properties.product,
                        }).then(() => {
                            oldScene.properties.images.forEach((image) => {
                                if (image.visible) {
                                    commit('toggleImagePreview', {
                                        index: newSceneIndex,
                                        imageType: image.type,
                                        visible: true,
                                    })
                                }
                            })
                        })
                    }

                    postRemove.push(index)
                }
            }
        })

        commit('removeOtherPageScenes', postRemove)
    },

    checkCatalogCreated({ commit }, { image, action }) {
        const intervalId = setInterval(async () => {
            try {
                const catalog = await this.$api.$get('catalog/image/' + image)
                clearInterval(intervalId)
                commit(
                    'alert/addAlert',
                    {
                        message: this.$i18n.t('catalog-creation-done'),
                        timeout: -1,
                        actionLabel: this.$i18n.t('go-to-catalog'),
                        action,
                        payload: catalog,
                    },
                    { root: true }
                )
            } catch (error) {}
        }, 30000)
    },
}
