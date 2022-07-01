<template>
    <v-row>
        <v-col cols="8" style="height: 68vh; width: 60vh">
            <client-only>
                <l-map
                    ref="printMap"
                    id="printMap"
                    :zoom="zoom"
                    :options="optionsMap"
                    :bounds="bounds"
                >
                    <l-tile-layer
                        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                        :attribution="attribution"
                    ></l-tile-layer>

                    <l-control-scale v-if="valueScale" position="bottomleft" />
                    <l-control v-if="valueNorthArrow" position="bottomleft">
                        <img
                            src="../../assets/north-arrow.png"
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
        <v-col cols="4">
            <div style="border: 0.5px solid gray; height: 100%">
                <v-container class="d-flex" style="width: 60%; height: 13%">
                    <v-img
                        contain
                        width="60"
                        class="mr-4"
                        src="/img/funai.svg"
                    />
                    <v-img
                        contain
                        width="100"
                        src="/img/logocmr_normal_min.png"
                    />
                </v-container>
                <div class="text-center text-caption font-weight-bold">
                    <p class="font-weight-bold">
                        {{ titleMap }}
                    </p>
                    <p>
                        Centro de Monitoramento Remoto - Fundação Nacional do
                        Índio
                    </p>
                </div>
                <div
                    class="d-flex justify-center"
                    style="height: 15vh; width: 100%"
                >
                    <client-only>
                        <l-map
                            ref="miniPrintMap"
                            id="miniPrintMap"
                            :zoom="zoomMiniMap"
                            :options="optionsMiniMap"
                        >
                            <l-tile-layer
                                url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                                :attribution="attribution"
                            ></l-tile-layer>
                        </l-map>
                    </client-only>
                </div>
                <div class="text-caption">
                    <div class="text-caption ma-1">
                        <p>Legenda:</p>
                    </div>
                    <v-divider></v-divider>
                    <div class="text-caption ma-1">
                        <p class="font-weight-bold">Bases Cartograficas:</p>
                    </div>
                    <v-divider></v-divider>

                    <div class="text-caption ma-1">
                        <p class="size-text ma-0">
                            CENTRO DE MONITORAMENTO REMOTO -
                            https://cmr.funai.gov.br
                        </p>
                        <p>Data da impressão: {{ todayDate() }}</p>
                    </div>
                    <v-divider></v-divider>
                    <div class="text-caption ma-1">
                        <p class="size-text ma-0">
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

export default {
    props: {
        titleMap: {
            type: String,
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

        zoomIntervals: {
            A4: [
                { start: 0, end: 3, interval: 50 },
                { start: 4, end: 5, interval: 5 },
                { start: 6, end: 7, interval: 1 },
                { start: 8, end: 9, interval: 0.5 },
                { start: 10, end: 11, interval: 0.25 },
                { start: 12, end: 13, interval: 0.1 },
                { start: 14, end: 16, interval: 0.01 },
                { start: 17, end: 20, interval: 0.001 },
            ],
            A3: [
                { start: 0, end: 3, interval: 50 },
                { start: 4, end: 5, interval: 5 },
                { start: 6, end: 7, interval: 1 },
                { start: 8, end: 9, interval: 0.5 },
                { start: 10, end: 11, interval: 0.25 },
                { start: 12, end: 12, interval: 0.1 },
                { start: 13, end: 16, interval: 0.01 },
                { start: 17, end: 20, interval: 0.001 },
            ],
            A2: [
                { start: 0, end: 3, interval: 50 },
                { start: 4, end: 4, interval: 10 },
                { start: 5, end: 6, interval: 5 },
                { start: 7, end: 8, interval: 1 },
                { start: 9, end: 9, interval: 0.5 },
                { start: 10, end: 11, interval: 0.25 },
                { start: 12, end: 13, interval: 0.1 },
                { start: 14, end: 16, interval: 0.01 },
                { start: 17, end: 20, interval: 0.001 },
            ],
            A1: [
                { start: 0, end: 3, interval: 50 },
                { start: 4, end: 4, interval: 25 },
                { start: 5, end: 7, interval: 5 },
                { start: 8, end: 8, interval: 1 },
                { start: 9, end: 9, interval: 0.5 },
                { start: 10, end: 11, interval: 0.25 },
                { start: 12, end: 14, interval: 0.1 },
                { start: 15, end: 17, interval: 0.01 },
                { start: 18, end: 20, interval: 0.001 },
            ],
            A0: [
                { start: 0, end: 3, interval: 50 },
                { start: 4, end: 5, interval: 25 },
                { start: 6, end: 7, interval: 5 },
                { start: 8, end: 9, interval: 1 },
                { start: 10, end: 10, interval: 0.5 },
                { start: 11, end: 11, interval: 0.25 },
                { start: 12, end: 14, interval: 0.1 },
                { start: 15, end: 17, interval: 0.01 },
                { start: 18, end: 20, interval: 0.001 },
            ],
        },
        attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors | <span style="color: red !important; font-weight: bold !important">Mapa não oficial</span>',
        optionsMap: {
            name: 'printMap',
            zoomControl: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
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
                        template: 'Centroide do mapa: {y}, {x}',
                    })
                    .addTo(this.map)

                let options = {
                    interval: 20,
                    showOriginLabel: true,
                    redraw: 'move',
                    zoomIntervals: this.zoomIntervals.A4,
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
</style>
