<template>
    <div class="d-flex mt-3">
        <v-btn fab ripple height="36" width="36">
            <v-icon @click="dialog = true"> mdi-printer </v-icon>
        </v-btn>
        <v-row>
            <v-dialog
                v-model="dialog"
                scrollable
                persistent
                :overlay="false"
                transition="dialog-transition"
                width="80%"
            >
                <v-card>
                    <v-toolbar class="background__toolbar" dark color="primary">
                        <h3>Impressão</h3>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="dialog = false">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-toolbar>

                    <v-stepper class="" v-model="e1" value="3">
                        <v-stepper-header>
                            <v-stepper-step :complete="e1 > 1" step="1">
                                Título do mapa
                            </v-stepper-step>

                            <v-divider></v-divider>

                            <v-stepper-step step="2">
                                Posicionamento
                            </v-stepper-step>
                        </v-stepper-header>
                        <v-stepper-items>
                            <v-stepper-content step="1" class="ma-0 pa-0">
                                <v-row cols="2">
                                    <v-container fluid>
                                        <v-col class="ma-2" cols="auto">
                                            <v-card-text class="pa-0 mt-2">
                                                Digite abaixo o título do mapa a
                                                ser impresso ou, se preferir,
                                                deixe em branco
                                            </v-card-text>

                                            <v-text-field
                                                label="Titulo do Mapa"
                                                class="mt-6 pa-0"
                                            ></v-text-field>
                                            <v-select
                                                v-model="select"
                                                :hint="`Tamanho da Impressão: ${select.type}`"
                                                :items="items"
                                                item-text="type"
                                                item-value="type"
                                                label="Select"
                                                persistent-hint
                                                return-object
                                                single-line
                                                required
                                                class="ma-0 pa-0"
                                            ></v-select>
                                        </v-col>
                                    </v-container>

                                    <v-col cols="8"> </v-col>
                                </v-row>
                                <v-row class="ma-2">
                                    <v-col class="d-flex flex-row-reverse">
                                        <v-btn color="primary" @click="e1++">
                                            Continue
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-stepper-content>
                            <v-stepper-content step="2">
                                <v-row>
                                    <v-col>
                                        <v-container
                                            class="ma-0 pa-0"
                                            height="200px"
                                            fluid
                                        >
                                            <div
                                                style="
                                                    width: 300px;
                                                    height: 300px;
                                                "
                                            >
                                                <client-only>
                                                    <l-map
                                                        ref="mapPrint"
                                                        :zoom="4"
                                                        :bounds="[
                                                            [
                                                                -14.2401,
                                                                -53.1805,
                                                            ],
                                                            [
                                                                -14.2401,
                                                                -53.1805,
                                                            ],
                                                        ]"
                                                        :max-zoom="21"
                                                        :min-zoom="2"
                                                    >
                                                        <l-tile-layer
                                                            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
                                                            attribution="&copy; <a href='//www.openstreetmap.org/'>OpenStreetMap</a> contributors"
                                                        ></l-tile-layer>
                                                    </l-map>
                                                </client-only>
                                            </div>
                                        </v-container>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        <v-btn text @click="e1--">
                                            Voltar
                                        </v-btn>
                                    </v-col>
                                    <v-col class="d-flex flex-row-reverse">
                                        <v-btn color="primary" @click="Baixar">
                                            <v-icon dark>
                                                mdi-file-export-outline
                                            </v-icon>
                                            Gerar PDF
                                        </v-btn>
                                        <v-btn
                                            color="primary"
                                            class="mr-2"
                                            @click="Baixar"
                                        >
                                            <v-icon dark>
                                                mdi-file-image-outline
                                            </v-icon>
                                            Salvar Imagem
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-stepper-content>
                        </v-stepper-items>
                    </v-stepper>
                </v-card>
            </v-dialog>
        </v-row>
        <!-- <v-dialog v-model="dialog" persistent max-width="1100" max-height="600">
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
                        <v-btn text onclick="window.print()"> SALVAR </v-btn>
                    </v-card-actions>
                </v-footer>
            </v-card>
        </v-dialog> -->
    </div>
</template>

<script>
import MapForPrint from '@/components/map/MapForPrint.vue'
import MiniMapForPrint from '@/components/map/MiniMapForPrint.vue'
import domtoimage from 'dom-to-image'
import Map from './Map.vue'

export default {
    name: 'MapPrinter',

    components: { MapForPrint, MiniMapForPrint, Map },

    data() {
        return {
            dialog: false,
            e1: 1,
            select: { type: 'A4' },
            items: [
                { type: 'A4' },
                { type: 'A0' },
                { type: 'A1' },
                { type: 'A2' },
                { type: 'A3' },
            ],
        }
    },

    methods: {
        Baixar() {
            let options = { cacheBust: true, quality: 1 }
            let node = document.getElementById('map')
            domtoimage.toJpeg(node, options).then(function (dataUrl) {
                var link = document.createElement('a')
                link.download = 'my-image-name.jpeg'
                link.href = dataUrl
                link.click()
            })

            // const doImage = (err, canvas) => {
            //     // now you have canvas
            //     // example thing to do with that canvas:
            //     var img = document.createElement('img')
            //     var dimensions = map.getSize()
            //     img.width = dimensions.x
            //     img.height = dimensions.y
            //     img.src = canvas.toDataURL()
            //     img.down
            //     document.getElementById('images').innerHTML = ''
            //     document.getElementById('images').appendChild(img)
            //     if (err) {
            //         console.log(err)
            //     }
            // }
            // leafletImage(map, doImage)
        },
    },
}
</script>

<style scoped>
.background__toolbar {
    background: linear-gradient(to bottom, rgb(30, 33, 50), rgb(44, 54, 73));
}
</style>
