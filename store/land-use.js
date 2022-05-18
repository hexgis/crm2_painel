export const state = () => ({
    features: null,
    showFeatures: false,
    visualizationStage: 'stage1',
    isLoadingCSV: false,
    isLoadingGeoJson: false,
    isLoadingFeatures: false,
    filterOptions: {
        regionalFilters: [],
        year: [],
        tiFilters: [],
    },
    filters: {
        csv: 'csv',
        json: 'json',
    },

    opacity: 100,
    heatMap: true,
    total: null,
    tableLandUse: [],
    tableCSVLandUse: [],
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

    setLoadingGeoJson(state, payload) {
        state.isLoadingGeoJson = payload
    },

    clearFeatures(state) {
        state.features = null
    },
    setTotal(state, total) {
        state.total = total
    },
    setVisualizationStage(state, visualizationStage) {
        state.visualizationStage = visualizationStage
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
    setDownloadTable(state, tableCSVLandUse) {
        state.tableCSVLandUse = tableCSVLandUse
    },

    setHeatMap(state, heatMap) {
        state.heatMap = heatMap
    },
    setLoadingCSV(state, payload) {
        state.isLoadingCSV = payload
    },
    setTable(state, tableLandUse) {
        state.tableLandUse = tableLandUse
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
        commit('setLoadingGeoJson', true)
        commit('setLoadingFeatures', true)
        commit('clearFeatures')

        const params = {}

        if (state.filters.currentView) params.in_bbox = rootGetters['map/bbox']

        if (state.filters.ti && state.filters.ti.length)
            params.co_funai = state.filters.ti.toString()

        if (state.filters.year && state.filters.year.length)
            params.map_year = state.filters.year.toString()

        if (state.filters.cr && state.filters.cr.length)
            params.co_cr = state.filters.cr.toString()

        try {
            const response = await this.$api.$get('land-use/', {
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
                const total = await this.$api.$get('land-use/stats/', {
                    params,
                })
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
            commit('setLoadingGeoJson', false)
        }
    },
    async getFilterOptions({ commit }) {
        const regional_coordinators = await this.$api.$get('funai/cr/')
        const years = await this.$api.$get('land-use/years/')
        const data = {}

        if (regional_coordinators) {
            data.regionalFilters = regional_coordinators.sort(
                (a, b) => a.ds_cr > b.ds_cr
            )
        }
        if (years) {
            data.year = years
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
    async getDataTableLandUse({ commit, state, rootGetters }) {
        commit('setLoadingGeoJson', true)
        commit('setLoadingFeatures', true)

        const params = {}

        if (state.filters.ti && state.filters.ti.length)
            params.co_funai = state.filters.ti.toString()

        if (state.filters.year && state.filters.year.length)
            params.map_year = state.filters.year.toString()

        if (state.filters.cr && state.filters.cr.length)
            params.co_cr = state.filters.cr.toString()

        if (state.filters.currentView) params.in_bbox = rootGetters['map/bbox']

        const tableLandUse = await this.$api.$get('land-use/table/', {
            params,
        })

        try {
            if (tableLandUse) commit('setTable', tableLandUse)

            const total = await this.$api.$get('land-use/total/', {
                params,
            })
            if (total) commit('setTotal', total)
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
            commit('setLoadingGeoJson', false)
            commit('setLoadingFeatures', false)
        }
    },
    async downloadTableLandUse({ commit, state, rootGetters }) {
        commit('setLoadingCSV', true)

        const params = {
            format: state.filters.csv,
        }

        if (state.filters.ti && state.filters.ti.length)
            params.co_funai = state.filters.ti.toString()

        if (state.filters.year && state.filters.year.length)
            params.map_year = state.filters.year.toString()

        if (state.filters.cr && state.filters.cr.length)
            params.co_cr = state.filters.cr.toString()

        if (state.filters.currentView) params.in_bbox = rootGetters['map/bbox']

        const tableCSVLandUse = await this.$api.get('land-use/table/', {
            params,
        })

        function saveData(data, fileName, type) {
            var elementBtn, blob, url

            elementBtn = document.createElement('a')
            elementBtn.style = 'display: none'
            document.body.appendChild(elementBtn)

            if (type !== 'text/csv') {
                data = JSON.stringify(data)
            }

            blob = new Blob([data], { type: type })
            url = window.URL.createObjectURL(blob)

            elementBtn.href = url
            elementBtn.download = fileName
            elementBtn.click()
            window.URL.revokeObjectURL(url)
        }

        try {
            saveData(
                tableCSVLandUse.data,
                'land_use_and_ocupation.csv',
                'text/csv'
            )
        } finally {
            commit('setLoadingCSV', false)
        }
    },
    async downloadGeoJsonLandUse({ commit, state, rootGetters }) {
        commit('setLoadingGeoJson', true)

        const params = {
            format: state.filters.csv,
            format: state.filters.json,
        }

        if (state.filters.ti && state.filters.ti.length)
            params.co_funai = state.filters.ti.toString()

        if (state.filters.year && state.filters.year.length)
            params.year_map = state.filters.year.toString()

        if (state.filters.cr && state.filters.cr.length)
            params.co_cr = state.filters.cr.toString()

        if (state.filters.currentView) params.in_bbox = rootGetters['map/bbox']

        const GeoJson = await this.$api.get('land-use/', {
            params,
        })

        function saveData(data, fileName, type) {
            var elementBtn, blob, url

            elementBtn = document.createElement('a')
            elementBtn.style = 'display: none'
            document.body.appendChild(elementBtn)

            if (type !== 'text/csv') {
                data = JSON.stringify(data)
            }

            blob = new Blob([data], { type: type })
            url = window.URL.createObjectURL(blob)

            elementBtn.href = url
            elementBtn.download = fileName
            elementBtn.click()
            window.URL.revokeObjectURL(url)
        }

        try {
            saveData(
                GeoJson.data,
                'land_use_and_ocupation.json',
                'application/json'
            )
        } finally {
            commit('setLoadingGeoJson', false)
        }
    },
}
