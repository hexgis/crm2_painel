export const state = () => ({
    features: null,
    showFeatures: false,
    visualizationStage: 'stage1',
    isLoadingCSV: false,
    isLoadingGeoJson: false,
    isLoadingFeatures: false,
    filterOptions: {
        regionalFilters: [],
    },
    filters: {
        startDate: null,
        endDate: null,
        csv: 'csv',
        json: 'json',
    },
    
    opacity: 100,
    heatMap: true,
    total: null,
    tableMonitoring: [],
    tableCSVMonitoring: []
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
    setDownloadTable(state, tableCSVMonitoring) {
        state.tableCSVMonitoring = tableCSVMonitoring
    },

    setHeatMap(state, heatMap) {
        state.heatMap = heatMap
    },
    setLoadingCSV(state, payload) {
        state.isLoadingCSVMonitoring = payload
    },
    setTable(state, tableMonitoring) {
        state.tableMonitoring = tableMonitoring
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
    async getDataTableMonitoring({ commit, state, rootGetters }) {
        const params = {
            start_date: state.filters.startDate,
            end_date: state.filters.endDate,
        }

        if (state.filters.ti && state.filters.ti.length)
            params.co_funai = state.filters.ti.toString()

        if (state.filters.priority && state.filters.priority.length)
            params.priority = state.filters.priority.toString()

        if (state.filters.cr && state.filters.cr.length)
            params.co_cr = state.filters.cr.toString()

        if (state.filters.currentView) params.in_bbox = rootGetters['map/bbox']

        const tableMonitoring = await this.$api.$get('monitoring/consolidated/table/', {
            params,
        })

        if (tableMonitoring) commit('setTable', tableMonitoring)

        const total = await this.$api.$get('monitoring/consolidated/total/', {
            params,
        })
        if (total) commit('setTotal', total)
    },
    async downloadTableMonitoring({ commit, state, rootGetters }) {
        commit('setLoadingCSV', true)

        const params = {
            start_date: state.filters.startDate,
            end_date: state.filters.endDate,
            format: state.filters.csv,
        }

        if (state.filters.ti && state.filters.ti.length)
            params.co_funai = state.filters.ti.toString()

        if (state.filters.priority && state.filters.priority.length)
            params.priority = state.filters.priority.toString()

        if (state.filters.cr && state.filters.cr.length)
            params.co_cr = state.filters.cr.toString()

        if (state.filters.currentView) params.in_bbox = rootGetters['map/bbox']

        const tableCSVMonitoring = await this.$api.get('monitoring/consolidated/table/', {
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
                tableCSVMonitoring.data,
                't_poligono-prioritario.csv',
                'text/csv'
            )
        } finally {
            commit('setLoadingCSV', false)
        }
    },
    async downloadGeoJsonMonitoring({ commit, state, rootGetters }) {
        commit('setLoadingGeoJson', true)

        const params = {
            start_date: state.filters.startDate,
            end_date: state.filters.endDate,
            format: state.filters.csv,
            format: state.filters.json,
        }

        if (state.filters.ti && state.filters.ti.length)
            params.co_funai = state.filters.ti.toString()

        if (state.filters.priority && state.filters.priority.length)
            params.priority = state.filters.priority.toString()

        if (state.filters.cr && state.filters.cr.length)
            params.co_cr = state.filters.cr.toString()

        if (state.filters.currentView) params.in_bbox = rootGetters['map/bbox']

        const GeoJson = await this.$api.get('monitoring/consolidated/', {
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
                'p_poligono-Monitoring.json',
                'application/json'
            )
        } finally {
            commit('setLoadingGeoJson', false)
        }
    },
}
