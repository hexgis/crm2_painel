<template>
    <l-lwms-tile-layer
        v-if="layer.layer_type == 'wms'"
        ref="wmsLayer"
        format="image/png"
        :base-url="wmsBaseUrl"
        :layers="geoserverLayer"
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
import { mapMutations, mapActions } from 'vuex'

if (typeof window !== 'undefined') {
    require('leaflet.heat')
}

export default {
    name: 'SupportLayerItemFire',

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
                const filters = this.layer.filters

                if (filters) {
                    wmsUrl =
                        this.layer.wms.geoserver.wms_url +
                        '&env=percentage:' +
                        this.layer.opacity / 100

                    if (Object.keys(filters).length) {

                        wmsUrl += '&CQL_FILTER='

                        for (const idx in this.layer.layer_filters) {
                            let layer_filter = this.layer.layer_filters[idx]

                            if (layer_filter.filter_type == 'start_date' && filters.startDate){
                                wmsUrl +=
                                    layer_filter.filter_alias +
                                    ' >= ' + 
                                    filters.startDate +
                                    ' AND '
                            }

                            if (layer_filter.filter_type == 'end_date' && filters.endDate){
                                wmsUrl +=
                                    layer_filter.filter_alias +
                                    ' <= ' + 
                                    filters.startDate +
                                    ' AND '
                            }
                        }

                        wmsUrl = wmsUrl.slice(0, -4)
                    }
                } else {
                    wmsUrl =
                        this.layer.wms.geoserver.wms_url +
                        '&env=percentage:' +
                        this.layer.opacity / 100
                }

                this.$nextTick(() => {
                    this.$refs.wmsLayer.mapObject.setUrl(wmsUrl)
                })
            }
                        console.log(wmsUrl)

            return wmsUrl
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
                    this.setLayerFiltersFire({
                        id: this.layer.id,
                        filters: this.defaultFilters,
                    })
                }
                this.toggleLayerVisibilityFire({
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
            'setLayerFiltersFire',
            'toggleLayerVisibilityFire',
        ]),

        ...mapActions('supportLayers', ['getHeatMapLayer']),
    },
}
</script>
