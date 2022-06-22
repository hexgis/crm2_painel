<template>
    <div class="d-flex mt-3">
        <v-dialog v-model="dialog" persistent>
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    fab
                    ripple
                    height="36"
                    width="36"
                    v-bind="attrs"
                    v-on="on"
                >
                    <v-icon> mdi-printer </v-icon>
                </v-btn>
            </template>
            <v-card max-height="800" min-height="">
                <v-card-title class="text-h8" absolute color="secondary">
                    IMPRESSÃO DO MAPA DE POLÍGONS PRIORITÁRIOS
                </v-card-title>

                <v-row id="PDF">
                    <v-col>
                        <v-card>
                            <MapForPrint />
                        </v-card>
                    </v-col>
                    <v-col>
                        <v-card min-height="740">
                            <div>
                                <v-col
                                    class="pa-2 d-inline-flex justify-center"
                                >
                                    <a class="mt-5">
                                        <v-img
                                            contain
                                            width="100"
                                            src="/img/logocmr_normal_min.png"
                                        />
                                    </a>
                                    <a>
                                        <v-img
                                            class="mx-4"
                                            contain
                                            width="60"
                                            src="/img/funai.svg"
                                        />
                                    </a>
                                </v-col>
                            </div>
                            <br />
                            <h5
                                class="
                                    text-center
                                    d-inline-flex
                                    justify-center
                                    pa-2
                                "
                            >
                                Centro de Monitoramento Remoto - Fundação
                                Nacional do Índio
                            </h5>
                            <br />
                            <h6
                                class="
                                    text-center
                                    d-inline-flex
                                    justify-center
                                    pa-2
                                "
                            >
                                SISTEMA DE INTEGRAÇÃO DE DADOS GEOESPACIAIS DAS
                                TERRAS INDÍGENAS
                            </h6>

                            <MiniMapForPrint />

                            <v-divider></v-divider>
                            <div class="px-4">
                                <p class="font-weight-regular pt-2">Legenda:</p>
                                <v-col>
                                    <v-row class="mb-2">
                                        <v-icon class="mr-2" color="#9400D3"
                                            >mdi-square</v-icon
                                        >
                                        Muito Alta
                                    </v-row>
                                    <v-row class="mb-2">
                                        <v-icon class="mr-2" color="#FF0000"
                                            >mdi-square</v-icon
                                        >
                                        Alta
                                    </v-row>
                                    <v-row class="mb-2">
                                        <v-icon class="mr-2" color="#FF8C00"
                                            >mdi-square</v-icon
                                        >
                                        Média
                                    </v-row>
                                    <v-row class="mb-2">
                                        <v-icon class="mr-2" color="#FFD700"
                                            >mdi-square</v-icon
                                        >
                                        Baixa
                                    </v-row>
                                    <v-row class="mb-2">
                                        <v-icon class="mr-2" color="#008000"
                                            >mdi-square</v-icon
                                        >
                                        Muito Baixa
                                    </v-row>
                                    <v-spacer></v-spacer>
                                </v-col>
                            </div>
                            <br />
                            <v-divider></v-divider>

                            <h4 class="font-weight-regular pt-2 px-4">
                                Bases Cartográficas:
                            </h4>
                            <div class="mt-2 mb-8 px-4">
                                <h5 class="font-weight-regular pt-2">
                                    Polígonos Prioritários presentes no
                                    território Brasileiro. Fonte: Banco de Dados
                                    Funai - 2022
                                </h5>
                            </div>
                            <v-divider></v-divider>
                            <h5 class="font-weight-regular pt-2 px-4">
                                CENTRO DE MONITORAMENTO REMOTO -
                                https://cmr.funai.gov.br
                            </h5>
                        </v-card>
                    </v-col>
                </v-row>

                <v-divider></v-divider>
                <v-footer>
                    <v-spacer></v-spacer>
                    <v-card-actions>
                        <v-btn text @click="dialog = false"> CANCELAR </v-btn>
                        <v-btn text @click="Baixar"> SALVAR </v-btn>
                    </v-card-actions>
                </v-footer>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import MapForPrint from '@/components/map/MapForPrint.vue'
import MiniMapForPrint from '@/components/map/MiniMapForPrint.vue'

export default {
    name: 'MapPrinter',

    components: { MapForPrint, MiniMapForPrint },

    data() {
        return {
            dialog: false,
            janela: window.open(
                '',
                'JanelaSecundaria',
                'scrollbars=yes,width=400,height=230'
            ),
        }
    },

    computed: {
        ...mapState('map', [
            'bounds',
            'boundsZoomed',
            'loading',
            'fileList',
            'localBounds',
        ]),
    },

    methods: {
        Baixar() {
            //     var style = "<style>";
            // style = style + "table {width: 100%;font: 20px Calibri;}";
            // style = style + "table, th, td {border: solid 1px #DDD; border-collapse: collapse;";
            // style = style + "padding: 2px 3px;text-align: center;}";
            // style = style + "</style>";
            // win.document.write('<html><head>');
            // win.document.write('<title>Polígonos Prioritários</title>');
            // win.document.write('</head>');
            // win.document.write();
            // win.document.write('<body>');
            // win.document.write('</body></html>');

            // this.janela = window.open()

            // console.log(this.bounds._northEast)
            // console.log(this.boundsZoomed)
            // console.log(this.fileList)
            // console.log(this.localBounds)

            let janela = window.open(
                '',
                'JanelaSecundaria',
                'scrollbars=yes,width=400,height=230'
            )

            let script = document.createElement('script')

            // script.type = 'text/javascript'
            script.src = 'https://unpkg.com/leaflet@1.8.0/dist/leaflet.js'
            script.integrity =
                'sha512-BB3hKbKWOc9Ez/TAwyWxNXeoV9c1v6FIeYiBieIWkpLjauysF18NzgR1MBNBXf8/KABdlkX68nAhlwcDFLGPCQ=='
            script.crossOrigin = ''
            // script.defer = true

            janela.document.head.appendChild(script)
            // let title = document.createElement('title')
            // janela.document.head.appendChild(title)
            let cssMap = document.createElement('link')
            cssMap.rel = 'stylesheet'
            cssMap.href = 'https://unpkg.com/leaflet@1.8.0/dist/leaflet.css'
            cssMap.integrity =
                'sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ=='
            cssMap.crossOrigin = ''
            cssMap.async = ''

            janela.document.head.appendChild(cssMap)

            let script2 = document.createElement('script')
            script2.innerHTML = `setTimeout(() => {var map = L.map('map').setView([51.505, -0.09], 13);

            console.log(${this.dialog})
            
                var tiles = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="//www.openstreetmap.org/">OpenStreetMap</a> contributors'
             }).addTo(map);

        document.onload = window.print()

            }, 1000)

            `

            janela.document.body.appendChild(script2)

            let divMap = document.createElement('div')
            divMap.id = 'map'
            divMap.style = 'width: 100%; height: 300px;'
            janela.document.body.appendChild(divMap)

            // janela.onload = window.print()
        },
    },
}
</script>
