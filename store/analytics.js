import graph1Query from '@/assets/es_dailyData.json'
import graph24Query from '@/assets/es_monthPerYear.json'
import graph3Query from '@/assets/es_yearComparison.json'
import graph5Query from '@/assets/es_statesPerYear.json'
import graph7Query from '@/assets/es_statesComparison.json'
import agroSumQuery from '@/assets/es_agroSum.json'
import agroFiltered from '@/assets/es_agroFiltered.json'

export const state = () => ({
    filters: null,
    agroFilters: null,
    stageList: [],

    esBuckets: {},

    isLoadingData: false,
    isLoadingAgroData: false,

    analyticsError: false,

    params: {},
    agroParams: {},

    colors: {
        type: {
            CMR: '#FF6347',
            DETHEX: '#8B008B',
            'DETER-B': '#4682B4',
        },
        state: {
            AC: '#F08080',
            AP: '#B8860B',
            AM: '#483D8B',
            MA: '#BD5C5C',
            MT: '#778899',
            PA: '#66CDAA',
            RO: '#FF7F50',
            RR: '#008080',
            TO: '#9ACD32',
        },
        year: {},
    },
})

export const mutations = {
    setFilters(state, filters) {
        state.filters = filters
    },

    setAgroFilters(state, filters) {
        state.agroFilters = filters
    },

    setStages(state, stages) {
        state.stageList = stages
    },

    setGraph1(state, data) {
        state.esBuckets.graph1 = data.aggregations.graph1.buckets.reduce(
            (aggs, agg) => {
                const day = new Date(agg.key)
                const date = `${day.getUTCFullYear()}-${(
                    day.getUTCMonth() + 1
                ).toLocaleString('pt-BR', {
                    minimumIntegerDigits: 2,
                })}-${day.getUTCDate().toLocaleString('pt-BR', {
                    minimumIntegerDigits: 2,
                })}`

                aggs.CMR = {
                    ...aggs.CMR,
                    [date]: agg.area.value,
                }
                return aggs
            },
            {}
        )
    },

    setGraph2(state, data) {
        state.esBuckets.graph2 = data.aggregations.graph2.buckets.reduce(
            (aggs, agg) => {
                const [year, month] = agg.key_as_string.split('-')
                aggs[year] = {
                    ...aggs[year],
                    [parseInt(month)]: agg.area.value,
                }
                return aggs
            },
            {}
        )
    },

    setGraph3(state, data) {
        state.esBuckets.graph3 = data.aggregations.graph3.buckets.reduce(
            (aggs, agg) => {
                const year = agg.key_as_string

                aggs[year] = agg.area.value

                return aggs
            },
            {}
        )
    },

    setGraph4(state, data) {
        state.esBuckets.rates = {}
        const previousMonth = (parseInt(state.params.month) - 1).toLocaleString(
            'pt-BR',
            {
                minimumIntegerDigits: 2,
            }
        )

        state.esBuckets.graph4 = data.aggregations.graph2.buckets.reduce(
            (aggs, agg) => {
                const [year, month] = agg.key_as_string.split('-')

                if (month === state.params.month) aggs[year] = agg.area.value

                // Sets rates
                if (year === state.params.year) {
                    if (month === state.params.month)
                        state.esBuckets.rates[`${year}-${month}`] =
                            (state.esBuckets.rates[`${year}-${month}`] || 0) +
                            agg.area.value
                    else if (month === previousMonth)
                        state.esBuckets.rates[`${year}-${month}`] =
                            (state.esBuckets.rates[`${year}-${month}`] || 0) +
                            agg.area.value
                }

                if (parseInt(month) <= parseInt(state.params.month)) {
                    state.esBuckets.rates[year] =
                        (state.esBuckets.rates[year] || 0) + agg.area.value
                }

                return aggs
            },
            {}
        )
    },
    setGraph5(state, data) {
        state.esBuckets.graph5 = data.aggregations.graph5.buckets.reduce(
            (aggs, agg) => {
                const year = agg.key.year
                const state = agg.key.state

                aggs[year] = { ...aggs[year], [state]: agg.area.value }

                return aggs
            },
            {}
        )
    },
    setGraph6(state, data) {
        state.esBuckets.graph6 = data.aggregations.graph5.buckets.reduce(
            (aggs, agg) => {
                const state = agg.key.state
                aggs.CMR = { ...aggs.CMR, [state]: agg.area.value }

                return aggs
            },
            {}
        )
    },
    setGraph7(state, data) {
        state.esBuckets.graph7 = data.aggregations.graph7.buckets.reduce(
            (aggs, agg) => {
                const state = agg.key.state
                aggs.CMR = { ...aggs.CMR, [state]: agg.area.value }
                return aggs
            },
            {}
        )
    },

    setAgro(state, graph) {
        const { data, key } = graph

        state.esBuckets[key] = data.buckets.reduce((aggs, agg) => {
            const state = agg.key.state

            aggs[state] = { ...aggs[state], [agg.key.year]: agg.area.value }

            return aggs
        }, {})
    },

    setAgroSum(state, data) {
        state.esBuckets.agroSum = data.aggregations.sum.buckets.reduce(
            (aggs, agg) => {
                aggs[agg.key] = {
                    area_plantada: agg.graph1.value,
                    area_produtividade: agg.graph2.value,
                }

                return aggs
            },
            {}
        )
    },

    setAgroData(state, graph) {
        const { data, key, field } = graph

        state.esBuckets[key] = data.hits.hits.reduce((aggs, agg) => {
            const { uf, ano } = agg._source

            aggs[uf] = { ...aggs[uf], [ano]: agg._source[field] }

            return aggs
        }, {})
    },

    setAnalyticsError(state, payload) {
        state.analyticsError = payload
    },

    setLoadingData(state, payload) {
        state.isLoadingData = payload
    },

    setLoadingAgroData(state, payload) {
        state.isLoadingAgroData = payload
    },

    setParams(state, params) {
        state.params = {
            ...state.params,
            ...params,
        }
    },
    setAgroParams(state, params) {
        state.agroParams = {
            ...state.agroParams,
            ...params,
        }
    },

    generateAgroColors(state) {
        const states = Object.keys(state.esBuckets.agroPlantada).concat(
            Object.keys(state.esBuckets.agroProdutividade)
        )

        states.forEach((stt) => {
            if (!state.colors.state[stt]) {
                state.colors.state[stt] =
                    '#' + ((Math.random() * 0xFFFFFF) << 0).toString(16)
            }
        })
    },

    generateDataColors(state) {
        const systems = Object.keys(state.esBuckets.graph6)

        systems.forEach((system) => {
            if (!state.colors.type[system]) {
                state.colors.type[system] =
                    '#' + ((Math.random() * 0xFFFFFF) << 0).toString(16)
            }

            const states = Object.keys(state.esBuckets.graph6[system])

            states.forEach((stt) => {
                if (!state.colors.state[stt]) {
                    state.colors.state[stt] =
                        '#' + ((Math.random() * 0xffffff) << 0).toString(16)
                }
            })
        })

        const year = state.params.year
        const previousYear = parseInt(year) - 1
        if (!state.colors.year[year]) {
            state.colors.year[year] =
                '#' + ((Math.random() * 0xffffff) << 0).toString(16)
        }

        if (!state.colors.year[previousYear]) {
            state.colors.year[previousYear] =
                '#' + ((Math.random() * 0xFFFFFF) << 0).toString(16)
        }
    },
}

export const actions = {
    async getStages({ commit }) {
        const stages = await this.$api.$get('monitoring/stages/')

        if (stages) {
            commit('setStages', stages)
        }
    },

    async getAgroData({ commit }, agroFilters) {
        commit('setLoadingAgroData', true)

        const params = {
            state: agroFilters.state ? agroFilters.state : '',
            yearFrom: agroFilters.yearFrom || '',
            yearTo: agroFilters.yearTo || '',
        }

        commit('setAgroParams', params)

        try {
            agroSumQuery.query.bool.filter = []

            agroSumQuery.query.bool.filter.push({
                range: {
                    ano: {
                        gte: params.yearFrom,
                        lte: params.yearTo,
                    },
                },
            })

            const agroSum = await this.$apiES.$post('soy/_search', {
                ...agroSumQuery,
            })

            if (agroSum) {
                commit('setAgroSum', agroSum)
            }

            agroFiltered.query.bool.filter = []

            if (agroFilters.yearFrom || agroFilters.yearTo)
                agroFiltered.query.bool.filter.push({
                    range: {
                        ano: {
                            gte: agroFilters.yearFrom,
                            lte: agroFilters.yearTo,
                        },
                    },
                })

            if (agroFilters.state && agroFilters.state.length)
                agroFiltered.query.bool.filter.push({
                    terms: {
                        'uf.keyword': agroFilters.state,
                    },
                })

            const agroData = await this.$apiES.$post('soy/_search', {
                ...agroFiltered,
            })

            if (agroData) {
                commit('setAgroData', {
                    data: agroData,
                    field: 'area_produtividade',
                    key: 'agroProdutividade',
                })
                commit('setAgroData', {
                    data: agroData,
                    field: 'area_plantada',
                    key: 'agroPlantada',
                })
            }

            commit('generateAgroColors')
        } catch (exception) {
            commit('setAnalyticsError', true)
        } finally {
            commit('setLoadingAgroData', false)
        }
    },

    async getData({ commit }, filters) {
        commit('setLoadingData', true)
        let params = {}
        if (filters.month) {
            params = {
                year: filters.month.split('-')[0],
                month: filters.month.split('-')[1],
                state: filters.state ? filters.state : '',
                type: filters.type,
                stage: filters.stage ? filters.stage.join(',') : '',
            }

            commit('setParams', params)
        }

        try {
            graph1Query.query.bool.filter = []
            let stageTerms, ufTerms

            if (!!filters.stage && filters.stage.length) {
                stageTerms = {
                    terms: {
                        no_estagio: filters.stage,
                    },
                }
            } else stageTerms = null

            if (params.state.length)
                ufTerms = {
                    terms: {
                        sg_uf: [params.state],
                    },
                }
            else ufTerms = null

            graph1Query.query.bool.filter.push({
                range: {
                    dt_t_um: {
                        gte: `${params.year}-${params.month}-01`,
                        lt:
                            parseInt(params.month) === 12
                                ? `${parseInt(params.year) + 1}-01-01`
                                : `${params.year}-${(
                                    parseInt(params.month) + 1
                                ).toLocaleString('pt-BR', {
                                    minimumIntegerDigits: 2,
                                })}-01`,
                    },
                },
            })
            if (stageTerms) graph1Query.query.bool.filter.push(stageTerms)
            if (ufTerms) graph1Query.query.bool.filter.push(ufTerms)

            const graph1 = await this.$apiES.$post('detection/_search', {
                ...graph1Query,
            })
            if (graph1) {
                commit('setGraph1', graph1)
            }

            graph24Query.query.bool.filter = []

            graph24Query.query.bool.filter.push({
                range: {
                    dt_t_um: {
                        gte: `${parseInt(params.year) - 1}-01-01`,
                        lte: `${params.year}-12-31`,
                    },
                },
            })

            if (stageTerms) graph24Query.query.bool.filter.push(stageTerms)
            if (ufTerms) graph24Query.query.bool.filter.push(ufTerms)

            const graph24 = await this.$apiES.$post('detection/_search', {
                ...graph24Query,
            })

            if (graph24) {
                commit('setGraph2', graph24)
                commit('setGraph4', graph24)
            }

            graph3Query.query.bool.filter = []

            graph3Query.query.bool.filter.push({
                range: {
                    dt_t_um: {
                        gte: `${parseInt(params.year) - 1}-01-01`,
                        lte: `${params.year}-12-31`,
                    },
                },
            })

            if (stageTerms) graph3Query.query.bool.filter.push(stageTerms)
            if (ufTerms) graph3Query.query.bool.filter.push(ufTerms)

            const graph3 = await this.$apiES.$post('detection/_search', {
                ...graph3Query,
            })

            if (graph3) {
                commit('setGraph3', graph3)
            }

            graph5Query.query.bool.filter = []

            graph5Query.query.bool.filter.push({
                range: {
                    dt_t_um: {
                        gte: `${parseInt(params.year) - 1}-01-01`,
                        lt:
                            parseInt(params.month) === 12
                                ? `${parseInt(params.year) + 1}-01-01`
                                : `${params.year}-${(
                                    parseInt(params.month) + 1
                                ).toLocaleString('pt-BR', {
                                    minimumIntegerDigits: 2,
                                })}-01`,
                    },
                },
            })

            if (stageTerms) graph5Query.query.bool.filter.push(stageTerms)
            if (ufTerms) graph5Query.query.bool.filter.push(ufTerms)

            const graph5 = await this.$apiES.$post('detection/_search', {
                ...graph5Query,
            })

            if (graph5) {
                commit('setGraph5', graph5)
                commit('setGraph6', graph5)
            }

            graph7Query.query.bool.filter = []

            graph7Query.query.bool.filter.push({
                range: {
                    dt_t_um: {
                        gte: `${params.year}-${params.month}-01`,
                        lt:
                            parseInt(params.month) === 12
                                ? `${parseInt(params.year) + 1}-01-01`
                                : `${params.year}-${(
                                    parseInt(params.month) + 1
                                ).toLocaleString('pt-BR', {
                                    minimumIntegerDigits: 2,
                                })}-01`,
                    },
                },
            })

            if (stageTerms) graph7Query.query.bool.filter.push(stageTerms)
            if (ufTerms) graph7Query.query.bool.filter.push(ufTerms)

            const graph7 = await this.$apiES.$post('detection/_search', {
                ...graph7Query,
            })

            if (graph7) {
                commit('setGraph7', graph7)
            }

            commit('generateDataColors')
        } catch (exception) {
            commit('setAnalyticsError', true)
        } finally {
            commit('setLoadingData', false)
        }
    },
}
