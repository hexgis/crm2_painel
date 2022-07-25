<template>
    <v-row no-gutters style="width: 1123px; height: 700px">
        <v-col cols="8" class="pr-0">
            <client-only>
                <l-map
                    ref="printMap"
                    id="printMap"
                    :zoom="zoom"
                    :options="optionsMap"
                    :bounds="bounds"
                >
                    <l-tile-layer
                        url="//{s}.tile.osm.org/{z}/{x}/{y}.png"
                        :attribution="attribution"
                    ></l-tile-layer>

                    <l-control-scale v-if="valueScale" position="bottomleft" />
                    <l-control v-if="valueNorthArrow" position="bottomleft">
                        <img
                            src="@/assets/north-arrow.png"
                            alt="northarrow"
                            class="north-arrow"
                        />
                    </l-control>
                    <PriorityLayers :map="map" />
                    <MonitoringLayers :map="map" />
                    <SupportLayers />
                    <AlertLayers :map="map" />
                </l-map>
            </client-only>
        </v-col>
        <v-col cols="4" class="pl-1">
            <div class="border_container">
                <div class="d-flex justify-center align-center ma-2">
                    <div style="width: 20%">
                        <v-img contain class="mr-4" src="/img/funai.svg" />
                    </div>
                    <div style="width: 25%">
                        <v-img contain src="/img/logocmr_normal_min.png" />
                    </div>
                </div>
                <div class="text-center font-weight-bold">
                    <p class="font-weight-bold mb-1">
                        {{ titleMap }}
                    </p>
                    <p class="mb-2">
                        Centro de Monitoramento Remoto - Fundação Nacional do
                        Índio
                    </p>
                </div>
                <div class="d-flex justify-center hight_container_mini_map">
                    <client-only>
                        <l-map
                            ref="miniPrintMap"
                            id="miniPrintMap"
                            :zoom="zoomMiniMap"
                            :options="optionsMiniMap"
                        >
                            <l-tile-layer
                                url="//{s}.tile.osm.org/{z}/{x}/{y}.png"
                                :attribution="attribution"
                            ></l-tile-layer>
                            <l-control position="topleft" class="ma-0 pa-0">
                                <p class="ma-1 pa-0 print-mini-map-text">
                                    LOCALIZAÇÃO DA ÁREA
                                </p>
                            </l-control>
                        </l-map>
                    </client-only>
                </div>
                <div>
                    <p class="d-block ma-1">Legenda:</p>
                    <div class="ma-1 flex-wrap" style="width: 100%">
                        <div v-if="showFeatures">
                            <v-row no-gutters align="center">
                                <v-icon x-small color="#9400D3"
                                    >mdi-square</v-icon
                                >
                                <v-col no-gutters cols="6">
                                    <p>Polígonos Prioritários: Muito Alta</p>
                                </v-col>
                            </v-row>
                            <v-row no-gutters align="center">
                                <v-icon x-small color="#FF0000"
                                    >mdi-square</v-icon
                                >
                                <v-col no-gutters cols="6">
                                    <p>Polígonos Prioritários: Alta</p>
                                </v-col>
                            </v-row>
                            <v-row no-gutters align="center">
                                <v-icon x-small color="#FF8C00"
                                    >mdi-square</v-icon
                                >
                                <v-col no-gutters cols="6">
                                    <p>Polígonos Prioritários: Média</p>
                                </v-col>
                            </v-row>
                            <v-row no-gutters align="center">
                                <v-icon x-small color="#FFD700"
                                    >mdi-square</v-icon
                                >
                                <v-col no-gutters cols="6">
                                    <p>Polígonos Prioritários: Baixa</p>
                                </v-col>
                            </v-row>
                            <v-row no-gutters align="center">
                                <v-icon x-small color="#008000"
                                    >mdi-square</v-icon
                                >
                                <v-col no-gutters cols="6">
                                    <p>Polígonos Prioritários: Muito Baixa</p>
                                </v-col>
                            </v-row>
                        </div>
                        <div v-if="showFeaturesUrgentAlert">
                            <v-row no-gutters align="center">
                                <v-icon x-small color="#965213"
                                    >mdi-square</v-icon
                                >
                                <v-col no-gutters cols="6">
                                    <p>Alerta Urgente: CR</p>
                                </v-col>
                            </v-row>
                            <v-row no-gutters align="center">
                                <v-icon x-small color="#337f1e"
                                    >mdi-square</v-icon
                                >
                                <v-col no-gutters cols="6">
                                    <p>Alerta Urgente: DR</p>
                                </v-col>
                            </v-row>
                            <v-row no-gutters align="center">
                                <v-icon x-small color="#ba1a1a"
                                    >mdi-square</v-icon
                                >
                                <v-col no-gutters cols="6">
                                    <p>Alerta Urgente: FF</p>
                                </v-col>
                            </v-row>
                            <v-row no-gutters align="center">
                                <v-icon x-small color="#e0790b"
                                    >mdi-square</v-icon
                                >
                                <v-col no-gutters cols="6">
                                    <p>Alerta Urgente: DG</p>
                                </v-col>
                            </v-row>
                        </div>
                        <div v-if="showFeaturesMonitoring">
                            <v-row no-gutters align="center">
                                <v-icon x-small color="#dd2c00"
                                    >mdi-square</v-icon
                                >
                                <v-col no-gutters cols="6">
                                    <p>Monitoramento Diário: CR</p>
                                </v-col>
                            </v-row>
                            <v-row no-gutters align="center">
                                <v-icon x-small color="#800080"
                                    >mdi-square</v-icon
                                >
                                <v-col no-gutters cols="6">
                                    <p>Monitoramento Diário: DR</p>
                                </v-col>
                            </v-row>
                            <v-row no-gutters align="center">
                                <v-icon x-small color="#a93130"
                                    >mdi-square</v-icon
                                >
                                <v-col no-gutters cols="6">
                                    <p>Monitoramento Diário: FF</p>
                                </v-col>
                            </v-row>
                            <v-row no-gutters align="center">
                                <v-icon x-small color="#ff7f00"
                                    >mdi-square</v-icon
                                >
                                <v-col no-gutters cols="6">
                                    <p>Monitoramento Diário: DG</p>
                                </v-col>
                            </v-row>
                        </div>
                        <div v-if="showFeaturesSupportLayers">
                            <div
                                v-for="layer in supportLayersCategoryAntropismo"
                                :key="layer.id"
                            >
                                <v-row
                                    no-gutters
                                    align="center"
                                    v-if="layer.visible"
                                >
                                    <img
                                        :src="
                                            layer.wms.geoserver.preview_url +
                                            layer.wms.geoserver_layer_name
                                        "
                                        width="13vw"
                                        alt="CorLayer"
                                    />
                                    <v-col>
                                        <p class="ml-1">{{ layer.name }}</p>
                                    </v-col>
                                </v-row>
                            </div>
                        </div>
                        <div v-if="showFeaturesSupportLayers">
                            <div
                                v-for="layer in supportLayersCategoryFire"
                                :key="layer.id"
                            >
                                <v-row
                                    no-gutters
                                    align="center"
                                    v-if="layer.visible"
                                >
                                    <img
                                        :src="
                                            layer.wms.geoserver.preview_url +
                                            layer.wms.geoserver_layer_name
                                        "
                                        width="13vw"
                                        alt="CorLayer"
                                    />
                                    <v-col>
                                        <p class="ml-1">{{ layer.name }}</p>
                                    </v-col>
                                </v-row>
                            </div>
                        </div>
                        <div v-if="showFeaturesSupportLayers">
                            <div
                                v-for="layer in supportLayersCategoryRaster"
                                :key="layer.id"
                            >
                                <v-row
                                    no-gutters
                                    align="center"
                                    v-if="layer.visible"
                                >
                                    <img
                                        :src="
                                            layer.wms.geoserver.preview_url +
                                            layer.wms.geoserver_layer_name
                                        "
                                        width="13vw"
                                        alt="CorLayer"
                                    />
                                    <v-col>
                                        <p class="ml-1">{{ layer.name }}</p>
                                    </v-col>
                                </v-row>
                            </div>
                        </div>
                        <div v-if="showFeaturesSupportLayers">
                            <div v-for="layer in supportLayers" :key="layer.id">
                                <v-row
                                    no-gutters
                                    align="center"
                                    v-if="layer.visible"
                                >
                                    <img
                                        :src="
                                            layer.wms.geoserver.preview_url +
                                            layer.wms.geoserver_layer_name
                                        "
                                        width="13vw"
                                        alt="CorLayer"
                                    />
                                    <v-col>
                                        <p class="ml-1">{{ layer.name }}</p>
                                    </v-col>
                                </v-row>
                            </div>
                        </div>
                    </div>
                    <v-divider></v-divider>
                    <div class="ma-1">
                        <p class="font-weight-bold">Bases Cartográficas:</p>
                        <div v-if="showFeatures">
                            <p>
                                - Polígonos Prioritários presentes no território
                                Brasileiro. Fonte: Banco de Dados Funai - 2022
                            </p>
                        </div>
                        <div v-if="showFeaturesMonitoring">
                            <p>
                                - Monitoramento Diário. Fonte: Banco de Dados
                                Funai - 2022
                            </p>
                        </div>
                        <div v-if="showFeaturesUrgentAlert">
                            <p>
                                - Alerta Urgente. Fonte: Banco de Dados Funai -
                                2022
                            </p>
                        </div>
                        <div v-if="showFeaturesSupportLayers">
                            <div
                                v-for="layer in supportLayers"
                                :key="layer.name"
                            >
                                <v-row no-gutters v-if="layer.visible">
                                    <v-col>
                                        <p>
                                            - {{ layer.name }} presente no
                                            território brasileiro.
                                        </p>
                                    </v-col>
                                </v-row>
                            </div>
                        </div>
                        <div v-if="supportLayersCategoryAntropismo">
                            <div
                                v-for="layer in supportLayersCategoryAntropismo"
                                :key="layer.name"
                            >
                                <v-row no-gutters v-if="layer.visible">
                                    <v-col>
                                        <p>
                                            - {{ layer.name }} presente no
                                            território brasileiro.
                                        </p>
                                    </v-col>
                                </v-row>
                            </div>
                        </div>
                        <div v-if="supportLayersCategoryFire">
                            <div
                                v-for="layer in supportLayersCategoryFire"
                                :key="layer.id"
                            >
                                <v-row no-gutters v-if="layer.visible">
                                    <v-col>
                                        <p>
                                            - {{ layer.name }} presente no
                                            território brasileiro.
                                        </p>
                                    </v-col>
                                </v-row>
                            </div>
                        </div>
                    </div>
                    <v-divider></v-divider>

                    <div class="ma-1">
                        <p>
                            CENTRO DE MONITORAMENTO REMOTO -
                            https://cmr.funai.gov.br | Data da impressão:
                            {{ todayDate() }}
                        </p>
                    </div>
                    <v-divider></v-divider>
                    <div class="ma-1">
                        <p>
                            As informações podem apresentar distorções em função
                            das bases cartográficas utilizadas.
                        </p>
                        <p>Modelo de mapa adaptado para formato A4.</p>
                    </div>
                </div>
            </div>
        </v-col>
    </v-row>
</template>

<script>
import { mapState } from 'vuex'
import MiniMapForPrint from '@/components/map/MiniMapForPrint.vue'
import PriorityLayers from '@/components/priority/PriorityLayers'
import MonitoringLayers from '@/components/monitoring/MonitoringLayers'
import SupportLayers from '@/components/support/SupportLayers'
import AlertLayers from '@/components/urgent-alerts/AlertLayers'
const intervalZooms = require('@/utils/zoomIntervalsGraticule')

export default {
    props: {
        titleMap: {
            type: String,
            default: '',
        },
        leafSize: {
            type: Object,
            default: '',
        },
    },
    components: {
        MiniMapForPrint,
        PriorityLayers,
        MonitoringLayers,
        SupportLayers,
        AlertLayers,
    },
    data: () => ({
        map: null,
        miniMap: null,
        zoom: 1,
        zoomMiniMap: 4,
        valueScale: null,
        valueNorthArrow: null,

        attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors | <span style="color: red; font-weight: bold; width: 100%">Mapa não oficial</span>',
        optionsMap: {
            name: 'printMap',
            zoomControl: false,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            boxZoom: true,
            keyboard: false,
        },
        optionsMiniMap: {
            name: 'printMiniMap',
            zoomControl: false,
            dragging: false,
            boxZoom: false,
            touchZoom: false,
            keyboard: false,
            attributionControl: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
        },
    }),

    computed: {
        ...mapState('map', ['bounds']),
        ...mapState('priority', ['showFeatures']),
        ...mapState('monitoring', ['showFeaturesMonitoring']),
        ...mapState('urgent-alerts', ['showFeaturesUrgentAlert']),
        ...mapState('supportLayers', [
            'showFeaturesSupportLayers',
            'supportLayers',
            'supportLayersCategoryAntropismo',
            'supportLayersCategoryFire',
            'supportLayersCategoryRaster',
        ]),
    },

    mounted() {
        this.$nextTick(() => {
            this.createMap()
        })
    },

    methods: {
        todayDate() {
            let date = new Date()
            let dd = date.getDate()
            let mm = date.getMonth() + 1
            let yyyy = date.getFullYear()
            return `${dd < 10 ? '0' + dd : dd}/${
                mm < 10 ? '0' + mm : mm
            }/${yyyy}`
        },

        createMap() {
            try {
                require('@/plugins/L.SimpleGraticule')
                require('@/plugins/L.Control.MapBounds')

                this.map = this.$refs.printMap.mapObject
                this.miniMap = this.$refs.miniPrintMap.mapObject

                window.L = this.$L // define leaflet global

                let currentBouldMap = this.map.getBounds()
                this.aimingRect = L.rectangle(currentBouldMap, {
                    color: '#e31a1c',
                    weight: 3,
                    opacity: 0.37,
                    fillOpacity: 0,
                }).addTo(this.miniMap)

                this.map.invalidateSize()
                this.map.on('move', this.onMainMapMoving)
                this.map.on('moveend', this.onMainMapMoved)
                this.miniMap.fitBounds(this.map.getBounds())

                L.control
                    .mapBounds({
                        type: 'center',
                        position: 'bottomleft',
                        template: 'Centroide do mapa: {y} , {x} ',
                    })
                    .addTo(this.map)
                let options = {
                    interval: 20,
                    showOriginLabel: true,
                    redraw: 'move',
                    zoomIntervals: intervalZooms.default[this.leafSize.type],
                }

                L.simpleGraticule(options).addTo(this.map)

                this.miniMap.setZoom(4)

                this.valueScale = true
                this.valueNorthArrow = true
            } catch (error) {
                alert('Erro ao gerar o mapa.' + error)
            }
        },

        onMainMapMoved(e) {
            this.miniMap.setView(this.map.getCenter(), 4)
        },

        onMainMapMoving(e) {
            this.aimingRect.setBounds(this.map.getBounds())
        },
    },
}
</script>

<style scoped>
p {
    font-size: xx-small;
    margin: 0;
}
.print-mini-map-text {
    color: dimgray !important;
    font-size: xx-small;
    white-space: nowrap;
}
.border_container {
    border-right: 0.5px solid gray;
    border-top: 0.5px solid gray;
    border-bottom: 0.5px solid gray;
    height: 100%;
}
.hight_container_mini_map {
    height: 150px;
    max-height: 150px;
    width: 100%;
}
</style>

<style>
.leaflet-grid-label .gridlabel-vert {
    margin-left: 8px;
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
}

.leaflet-grid-label .gridlabel-vert,
.leaflet-grid-label .gridlabel-horiz {
    padding-left: 2px;
    text-shadow: -2px 0 #ffffff, 0 2px #ffffff, 2px 0 #ffffff, 0 -2px #ffffff;
}
.leaflet-container .leaflet-control-mapbounds {
    background-color: rgba(255, 255, 255, 0.7) !important;
    box-shadow: 0 0 5px #bbb !important;
    padding: 0 5px !important;
    margin: 0 !important;
    color: #333 !important;
    font: 11px/1.5 'Helvetica Neue', Arial, Helvetica, sans-serif !important;
}
.north-arrow,
.north-arrow:after {
    height: 35px;
    width: 30px;
}

.leaflet-control-attribution {
    white-space: nowrap !important;
}
</style>
