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

            // let alias = {
            //     cordenacao: this.layer.layer_filters[0].filter_alias,
            //     ti: this.layer.layer_filters[1].filter_alias,
            // }
            if (this.layer.layer_type === 'wms') {
                const filters = this.layer.filters
                console.log(this.layer.filters)

                if (filters) {
                    wmsUrl =
                        this.layer.wms.geoserver.wms_url +
                        '&env=percentage:' +
                        this.layer.opacity / 100

                    // const keys = Object.keys(filters)
                    // if (Object.keys(filters).length) {
                    wmsUrl += '&CQL_FILTER='

                    // console.log(this.layer.layer_filters[1].filter_alias)

                    // for (const idx in this.layer.layer_filters) {
                    //     let layer_filter = this.layer.layer_filters[idx]

                    // console.log(this.layer.layer_filters[0].filter_alias)

                    if (filters.co_cr) {
                        let result = filters.co_cr.join(',')
                        wmsUrl +=
                            // this.layer.layer_filters[0].filter_alias
                            'co_cr' + ' IN ' + '(' + result + ')' + ' AND '
                    }

                    if (filters.co_funai) {
                        let result = filters.co_funai.join(',')

                        wmsUrl +=
                            // this.layer.layer_filters[1].filter_alias
                            'co_funai' + ' IN ' + '(' + result + ')' + ' AND '
                    }

                    // }

                    // if (keys.length) {
                    //     wmsUrl += '&CQL_FILTER='

                    //     for (const filter in this.layer.filters) {
                    //         let i = 0
                    //         console.log(this.layer.layer_filters)
                    //         if (this.layer.filters[filter].length) {
                    //             wmsUrl +=
                    //                 this.layer.layer_filters[i].filter_alias +
                    //                 ' IN ' +
                    //                 '(' +
                    //                 this.layer.filters[filter] +
                    //                 ')' +
                    //                 ' AND '

                    //             i++
                    //         }
                    //     }
                    // }
                    wmsUrl = wmsUrl.slice(0, -4)
                    // }
                } else {
                    let wmsUrl2 =
                        this.layer.wms.geoserver.wms_url +
                        '&env=percentage:' +
                        this.layer.opacity / 100

                    console.log('URL 2 !!!')

                    return wmsUrl2
                }

                this.$nextTick(() => {
                    this.$refs.wmsLayer.mapObject.setUrl(wmsUrl)
                })
            }
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
