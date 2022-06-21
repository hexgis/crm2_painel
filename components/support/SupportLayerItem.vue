<template>
    <l-lwms-tile-layer
        v-if="layer.layer_type == 'wms'"
        ref="wmsLayer"
        :base-url="wmsBaseUrl"
        :layers="geoserverLayer"
        format="image/png"
        :transparent="true"
        :z-index="3"
        :visible="layer.visible"
        :options="wmsOptions"
    />

    <l-tile-layer
        v-else-if="layer.layer_type == 'tms'"
        :url="layer.tms.url_tms"
        :visible="layer.visible"
        :z-index="3"
        :options="{
            maxNativeZoom: layer.tms.max_native_zoom
                ? layer.tms.max_native_zoom
                : 15,
        }"
    />

    <l-layer-group
        v-else-if="layer.layer_type == 'heatmap'"
        ref="heatmap"
        :visible="layer.visible"
    />
</template>

<script>
import { filter } from 'jszip'
import { mapMutations, mapActions } from 'vuex'

if (typeof window !== 'undefined') {
    require('leaflet.heat')
}

export default {
    name: 'SupportLayerItem',

    props: {
        layer: {
            type: Object,
            required: true,
        },
    },

    computed: {
        defaultFilters() {
            const filters = {}

            this.layer.layer_filters.forEach((layerFilter) => {
                const label = layerFilter.filter_type
                const value = layerFilter.default
                filters[label] = value
            })

            return filters
        },

        geoserverLayer() {
            if (
                this.layer.wms &&
                this.layer.wms.geoserver_layer_namespace &&
                this.layer.wms.geoserver_layer_name
            ) {
                return (
                    this.layer.wms.geoserver_layer_namespace +
                    ':' +
                    this.layer.wms.geoserver_layer_name
                )
            } else return ''
        },

        wmsOptions() {
            let options = {}
            if (this.layer.layer_type === 'wms') {
                options = {
                    name: this.layer.name,
                    maxZoom: 21,
                    maxNativeZoom: 19,
                    queryable: this.layer.wms.queryable,
                }

                if (this.layer.wms && this.layer.wms.geoserver_layer_options) {
                    options = {
                        ...options,
                        ...this.layer.wms.geoserver_layer_options,
                    }
                }
            }

            return options
        },

        wmsBaseUrl() {
            let wmsUrl = ''
            if (this.layer.layer_type === 'wms') {
                
                wmsUrl = `${this.layer.wms.geoserver.wms_url}&env=percentage:${
                    this.layer.opacity / 100
                }`

                const filters = this.layer.filters
                if (filters.startData || filters.endData) {
                    let [aliasStartDate, aliasEndDate] =
                        this.layer.layer_filters // Destructuring filter alias

                    // wmsUrl = `${
                    //     this.layer.wms.geoserver.wms_url
                    // }&env=percentage:${this.layer.opacity / 100}`

                    if (filters.startData.length && filters.endData.length) {
                        let valueStartData = filters.startData
                        let valueEndData = filters.endData

                        wmsUrl += `&CQL_FILTER=${aliasStartDate.filter_alias} >= (${valueStartData}) AND ${aliasEndDate.filter_alias} <= (${valueEndData})`

                        this.$nextTick(() => {
                            this.$refs.wmsLayer.mapObject.setUrl(wmsUrl)
                        })
                        return wmsUrl
                    }
                }

                if (filters.co_cr || filters.co_funai) {
                    let [aliasCoordenacao, aliasTi] = this.layer.layer_filters // Destructuring filter alias

                    // wmsUrl = `${
                    //     this.layer.wms.geoserver.wms_url
                    // }&env=percentage:${this.layer.opacity / 100}`

                    if (filters.co_cr.length && filters.co_funai.length) {
                        let valueCo_cr = filters.co_cr.join(',')
                        let valueCo_funai = filters.co_funai.join(',')

                        wmsUrl += `&CQL_FILTER=${aliasCoordenacao.filter_alias} IN (${valueCo_cr}) AND ${aliasTi.filter_alias} IN (${valueCo_funai})`

                        this.$nextTick(() => {
                            this.$refs.wmsLayer.mapObject.setUrl(wmsUrl)
                        })
                        return wmsUrl
                    }

                    if (filters.co_cr.length) {
                        let list_coord = filters.co_cr.join(',')
                        wmsUrl += `&CQL_FILTER=${aliasCoordenacao.filter_alias} IN (${list_coord})`
                    }

                    if (filters.co_funai.length) {
                        let list_funaiTi = filters.co_funai.join(',')
                        wmsUrl += `&CQL_FILTER=${aliasTi.filter_alias} IN (${list_funaiTi})`
                    }

                    this.$nextTick(() => {
                        this.$refs.wmsLayer.mapObject.setUrl(wmsUrl)
                    })

                    return wmsUrl
                }

                let wmsUrlBase = `${
                    this.layer.wms.geoserver.wms_url
                }&env=percentage:${this.layer.opacity / 100}`
                return wmsUrlBase
            }
        },
    },

    watch: {
        'layer.data': {
            handler(data) {
                if (data.length) {
                    this.createHeatLayer()
                }
            },
            deep: true,
        },
    },

    mounted() {
        if (this.layer.active_on_init) {
            if (this.layer.layer_type === 'heatmap') {
                this.getHeatMapLayer({
                    id: this.layer.id,
                    filters: this.defaultFilters,
                })
            } else {
                if (this.layer.layer_type === 'wms') {
                    this.setLayerFilters({
                        id: this.layer.id,
                        filters: this.defaultFilters,
                    })
                }
                this.toggleLayerVisibility({
                    id: this.layer.id,
                    visible: true,
                })
            }
        }
    },

    methods: {
        createHeatLayer() {
            const areas = this.layer.data.map((data) => data.area_ha)
            const maxArea = Math.max.apply(null, areas)

            this.$refs.heatmap.mapObject.clearLayers()

            const heatData = []
            this.layer.data.forEach((data) => {
                heatData.push([
                    data.nu_latitude,
                    data.nu_longitude,
                    data.area_ha / maxArea, // normalize by maximum area
                ])
            })
            this.$L
                .heatLayer(heatData, {
                    minOpacity: 0.5,
                    maxZoom: 18,
                    radius: 20,
                    blur: 15,
                    zIndex: 4,
                })
                .addTo(this.$refs.heatmap.mapObject)
        },

        ...mapMutations('supportLayers', [
            'setLayerFilters',
            'toggleLayerVisibility',
        ]),

        ...mapActions('supportLayers', ['getHeatMapLayer']),
    },
}
</script>
