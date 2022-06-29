<template>
    <v-row>
        <v-col cols="8" style="height: 68vh; width: 60vh">
            <client-only>
                <l-map
                    ref="printMap"
                    id="printMap"
                    :zoom.sync="zoom"
                    :options="options"
                    :bounds.sync="bounds"
                >
                    <l-tile-layer
                        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                        :attribution="attribution"
                    ></l-tile-layer>
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
                <div class="text-center text-caption">
                    <p>
                        Centro de Monitoramento Remoto - Fundação Nacional do
                        Índio
                    </p>
                    <p class="font-weight-bold">
                        SISTEMA DE INTEGRAÇÃO DE DADOS GEOESPACIAIS DAS TERRAS
                        INDÍGENAS
                    </p>
                    <p class="font-weight-bold">
                        {{ titleMap }}
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
                            :zoom.sync="zoom"
                            :options="optionsMiniMap"
                            :bounds.sync="bounds"
                        >
                            <l-tile-layer
                                url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                                :attribution="attribution"
                            ></l-tile-layer>
                            <l-rectangle
                                :bounds="bounds"
                                :zoom.sync="zoom"
                                :l-style="rectangle.style"
                            ></l-rectangle>
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
        zoom: 5,
        boundsMiniMap: null,
        attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        options: {
            zoomControl: false,
            name: 'printMap',
        },
        optionsMiniMap: {
            zoomControl: false,
            name: 'printMap',
            dragging: false,
            boxZoom: false,
        },
        rectangle: {
            bounds: [
                [47.341456, -1.397133],
                [47.303901, -1.243813],
            ],
            style: { color: 'red', weight: 3 },
        },
        // bounds: [
        //     [-33.8689056, -73.9830625],
        //     [5.2842873, -28.6341164],
        // ],
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
            return `${dd}/${mm < 10 ? '0' + mm : mm}/${yyyy}`
        },
        createMap() {
            this.map = this.$refs.printMap.mapObject

            this.boundsMiniMap = this.map.getBounds()
        },
    },
}
</script>

<style scoped>
p {
    font-size: xx-small;
}
</style>
