<template>
    <client-only>
        <l-map
            id="printMap"
            ref="printMap"
            :bounds="tmsToPrint.bounds || bounds"
        >
            <l-layer-group v-if="tmsToPrint.visible">
                <l-tile-layer
                    :tms="true"
                    :url="
                        tmsToPrint.tmsUrl.replace('.xml', '.tms') +
                        '/{z}/{x}/{y}.png'
                    "
                    :visible="tmsToPrint.visible"
                    :options="{
                        zIndex: 2,
                        maxZoom: 21,
                        maxNativeZoom: 18,
                    }"
                />
            </l-layer-group>

            <l-lwms-tile-layer
                ref="wmsLayer"
                :base-url="tmsToPrint.wmsUrl"
                :layers="tmsToPrint.geoserverName"
                format="image/png"
                :transparent="true"
                :z-index="3"
                :visible="tmsToPrint.visible"
                :options="wmsOptions"
            />

            <l-tile-layer
                v-if="!selectedBaseMap"
                :url="'//{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png'"
                :attribution="attribution"
                :options="optionsMap"
            />
            <l-tile-layer
                v-if="
                    selectedBaseMap && selectedBaseMap.options.label != 'Bing'
                "
                :url="selectedBaseMap._url"
                :attribution="selectedBaseMap.options.attribution"
                :options="optionsMap"
            />
            <l-control-scale v-if="valueScale" position="bottomleft" />
            <l-control v-if="valueNorthArrow" position="bottomleft">
                <img
                    src="@/assets/north-arrow.png"
                    alt="northarrow"
                    class="north-arrow"
                />
            </l-control>
            <l-control v-if="legend" position="bottomright">
                <v-row no-gutters>
                    <v-col cols="12" class="pl-1">
                        <div class="border_container_legend">
                            <div>
                                <p class="font-weight-bold d-block ma-1 pt-1">
                                    Legenda:
                                </p>
                                <div class="ma-1 flex-wrap" style="width: 100%">
                                    <div v-if="showFeaturesSupportLayers">
                                        <div
                                            v-for="layer in supportLayers"
                                            :key="layer.id"
                                        >
                                            <v-row
                                                v-if="layer.visible"
                                                no-gutters
                                                align="center"
                                            >
                                                <img
                                                    v-if="layer.wms"
                                                    :src="
                                                        layer.wms.geoserver
                                                            .preview_url +
                                                        layer.wms
                                                            .geoserver_layer_name
                                                    "
                                                    class="layer-thumbnail"
                                                    alt="CorLayer"
                                                />
                                                <img
                                                    v-else-if="
                                                        vectorImage(layer)
                                                    "
                                                    :src="`data:image/png;base64,${vectorImage(
                                                        layer
                                                    )}`"
                                                    class="layer-thumbnail"
                                                    alt="CorLayer"
                                                />
                                                <v-col>
                                                    <p
                                                        class="ml-1"
                                                        style="
                                                            margin-bottom: 1px;
                                                        "
                                                    >
                                                        {{ layer.name }}
                                                    </p>
                                                </v-col>
                                            </v-row>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </v-col>
                </v-row>
            </l-control>

            <PriorityLayers :map="map" />
            <MonitoringLayers :map="map" />
            <SupportLayers />
            <SupportUserLayersMap />
            <SupportLayersHazard />
            <SupportLayersProdes />
            <SupportLayersRaster />
            <AlertLayers :map="map" />
            <DeterLayers :map="map" />
            <LandUseLayers :map="map" />
        </l-map>
    </client-only>
</template>

<i18n>
{
  "en": {
    "map-error": "Error generating the map."
  },
  "pt-br": {
    "map-error": "Erro ao gerar o mapa."
  }
}
</i18n>

<script>
/* eslint-disable no-underscore-dangle --
 * Underscore attributes defined by "Leafleat" plugin
 */

import { mapState } from 'vuex'

import MiniMapForPrint from '@/components/map/MiniMapForPrint.vue'
import PriorityLayers from '@/components/priority/PriorityLayers'
import MonitoringLayers from '@/components/monitoring/MonitoringLayers'
import SupportLayers from '@/components/support/SupportLayers'
import SupportLayersHazard from '@/components/support/SupportLayersHazard'
import SupportLayersProdes from '@/components/support/SupportLayersProdes'
import SupportLayersRaster from '@/components/support/SupportLayersRaster'
import AlertLayers from '@/components/urgent-alerts/AlertLayers'
import DeterLayers from '@/components/deter/DeterLayers'
import LandUseLayers from '@/components/land-use/LandUseLayers'
import SupportUserLayersMap from '@/components/support/SupportUserLayersMap'

if (typeof window !== 'undefined') {
    require('leaflet-bing-layer')
}

const cloneLayer = require('leaflet-clonelayer')

const intervalZooms = require('../../../utils/zoomIntervalsGraticule')

export default {
    components: {
        MiniMapForPrint,
        PriorityLayers,
        MonitoringLayers,
        SupportLayers,
        AlertLayers,
        DeterLayers,
        SupportLayersProdes,
        SupportLayersRaster,
        SupportLayersHazard,
        LandUseLayers,
        SupportUserLayersMap,
    },

    props: {
        leafSize: {
            type: Object,
            default: null,
        },
        mainMap: {
            type: Object,
            default: null,
        },
        selectedBaseMap: {
            type: Object,
            default: null,
        },
        legend: {
            type: Boolean,
            default: false,
        },
    },

    data: () => ({
        currentBounds: null,
        map: null,
        miniMap: null,
        zoom: 1,
        valueScale: null,
        valueNorthArrow: null,
        bingKey:
            'AuhiCJHlGzhg93IqUH_oCpl_-ZUrIE6SPftlyGYUvr9Amx5nzA-WqGcPquyFZl4L',
        attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        optionsMap: {
            name: 'printMap',
            zoomControl: false,
            maxZoom: 21,
            max_native_zoom: 18,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            boxZoom: true,
            keyboard: false,
        },
    }),

    computed: {
        wmsOptions() {
            const options = {
                name: 'Change Detection',
                maxZoom: 21,
                maxNativeZoom: 19,
                queryable: false,
            }

            return options
        },
        ...mapState('map', ['bounds', 'tmsToPrint']),
        ...mapState('supportLayers', [
            'showFeaturesSupportLayers',
            'supportLayers',
        ]),
    },

    mounted() {
        this.$nextTick(() => {
            this.createMap()
        })
    },

    methods: {
        vectorImage(layer) {
            return layer.vector.thumbnail_blob || layer.vector.image
        },

        todayDate() {
            const date = new Date()
            const dd = date.getDate()
            const mm = date.getMonth() + 1
            const yyyy = date.getFullYear()
            return `${dd < 10 ? `0${dd}` : dd}/${
                mm < 10 ? `0${mm}` : mm
            }/${yyyy}`
        },

        createMap() {
            try {
                require('@/plugins/L.SimpleGraticule')
                require('@/plugins/L.Control.MapBounds')

                this.map = this.$refs.printMap.mapObject

                window.L = this.$L // define leaflet global

                this.currentBouldMap = this.map.getBounds()
                this.$emit('updateBounds', this.currentBouldMap)
                this.map.invalidateSize()
                this.map.on('move', this.onMainMapMoving)
                this.map.on('moveend', this.onMainMapMoved)

                this.$L.control
                    .mapBounds({
                        type: 'center',
                        position: 'bottomleft',
                        template: 'Centroide do mapa: {y} , {x} ',
                    })
                    .addTo(this.map)
                const options = {
                    interval: 20,
                    showOriginLabel: true,
                    redraw: 'move',
                    zoomIntervals: intervalZooms.default[this.leafSize.type],
                }

                this.$L.simpleGraticule(options).addTo(this.map)

                if (
                    this.selectedBaseMap &&
                    this.selectedBaseMap.options.label === 'Bing'
                ) {
                    const bingLayer = this.createBingLayer()
                    this.map.addLayer(bingLayer)
                }

                this.mainMap.eachLayer((layer) => {
                    if (layer._events) {
                        const cloned = cloneLayer(layer)
                        this.map.addLayer(cloned)
                    }
                })

                this.valueScale = true
                this.valueNorthArrow = true
            } catch (error) {
                this.$store.commit('alert/addAlert', {
                    message: 'Erro ao adicionar camada ao mapa',
                })
            }
        },

        onMainMapMoved() {
            const center = this.map.getCenter()
            this.$emit('getCenter', center)
        },

        onMainMapMoving() {
            const bounds = this.map.getBounds()
            this.$emit('updateBounds', bounds)
        },

        createBingLayer() {
            // Bing layer has need to be generated before being inserted
            // on tileLayers array, and is generated by the Plugin
            // leaflet-bing-layer
            const bingLayer = this.$L.tileLayer.bing(this.bingKey, {
                imagerySet: 'AerialWithLabelsOnDemand',
                maxZoom: 21,
                maxNativeZoom: 16,
            })
            bingLayer.options.attribution = 'Map data &copy; Bing contributors'
            bingLayer.options.iconURL = '/img/bing.png'
            bingLayer.options.label = 'Bing'
            bingLayer.options.tag = 'Bing'

            return bingLayer
        },
    },
}
</script>

<style>
.layer-thumbnail {
    width: 0.8vw;
}

.north-arrow,
.north-arrow:after {
    height: 35px;
    width: 30px;
}

.border_container_legend {
    border: 0.5px gray;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 0 5px #bbb !important;
    height: 100%;
}
</style>
