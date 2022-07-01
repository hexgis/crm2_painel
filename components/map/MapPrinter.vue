<template>
    <div class="d-flex mt-3">
        <div id="divprintmap" style="display: none"></div>

        <v-btn fab ripple height="36" width="36">
            <v-icon @click="dialogPrint = true"> mdi-printer </v-icon>
        </v-btn>
        <v-dialog
            v-model="dialogPrint"
            max-width="80vw"
            max-height="80vh"
            persistent
            transition="dialog-transition"
            :overlay="false"
        >
            <v-toolbar dark color="secondary">
                <h3>Impressão</h3>
                <v-spacer></v-spacer>
                <v-btn icon @click="closeDialogPrinter(false)">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-stepper class="" v-model="currentStep" value="3">
                <v-stepper-header>
                    <v-stepper-step :complete="currentStep > 1" step="1">
                        Título do mapa
                    </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step step="2"> Posicionamento </v-stepper-step>
                </v-stepper-header>
                <v-stepper-items>
                    <v-stepper-content step="1">
                        <v-container fluid>
                            <v-row>
                                <v-card-text class="pa-0 mt-2">
                                    Digite abaixo o título do mapa a ser
                                    impresso ou, se preferir, deixe em branco
                                </v-card-text>
                            </v-row>

                            <v-row>
                                <v-text-field
                                    v-model="titleMap"
                                    label="Titulo do Mapa"
                                    class="mt-6 pa-0"
                                ></v-text-field>
                            </v-row>

                            <v-row>
                                <v-select
                                    v-model="select"
                                    item-text="type"
                                    item-value="type"
                                    persistent-hint
                                    return-object
                                    single-line
                                    required
                                    :hint="`Tamanho da Impressão: ${select.type}`"
                                    :items="items"
                                ></v-select>
                            </v-row>
                            <v-row class="mt-8 mb-2">
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click="currentStep++">
                                    Continue
                                </v-btn>
                            </v-row>
                        </v-container>
                    </v-stepper-content>
                    <v-stepper-content step="2">
                        <v-container id="printableMap" v-if="currentStep == 2">
                            <MapForPrint :titleMap="titleMap" />
                        </v-container>

                        <v-btn text @click="currentStep--"> Voltar </v-btn>

                        <v-btn
                            color="primary"
                            class="mr-2"
                            :loading="loading"
                            @click="Baixar"
                        >
                            <v-icon dark> mdi-file-image-outline </v-icon>
                            Salvar Imagem
                        </v-btn>
                        <!-- <v-btn color="primary" @click="generatePdf">
                            <v-icon dark> mdi-file-export-outline </v-icon>
                            Gerar PDF
                        </v-btn> -->
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>
        </v-dialog>
    </div>
</template>

<script>
import MapForPrint from '@/components/map/MapForPrint.vue'
import MiniMapForPrint from '@/components/map/MiniMapForPrint.vue'
import domtoimage from 'dom-to-image'

export default {
    name: 'MapPrinter',

    components: { MapForPrint, MiniMapForPrint },

    data() {
        return {
            dialogPrint: false,
            currentStep: 1,
            loading: false,
            titleMap: '',
            dataUrlImagePrint: null,
            select: { type: 'A4' },
            items: [
                { type: 'A4' },
                // { type: 'A0' },
                // { type: 'A1' },
                // { type: 'A2' },
                // { type: 'A3' },
            ],
        }
    },

    methods: {
        Baixar() {
            let zoomControl = document.getElementsByClassName(
                'leaflet-control-zoom'
            )[0]
            try {
                this.loading = true
                let nameImageDownaload = this.titleMap
                let options = {
                    quality: 1,
                    bgcolor: 'white',
                }
                let node = document.getElementById('printableMap')
                domtoimage.toJpeg(node, options).then(function (dataUrl) {
                    var link = document.createElement('a')
                    link.download = nameImageDownaload
                        ? nameImageDownaload + '.jpeg'
                        : 'Mapa.jpeg'
                    link.href = dataUrl
                    link.click()
                })
            } catch (error) {
                alert('Ocorreu um erro ao gerar a imagem.' + error)
            } finally {
                this.loading = false
            }
        },
        closeDialogPrinter(value) {
            this.dialogPrint = value
            this.currentStep = 1
        },
    },
}
</script>

<style scoped>
.background__toolbar {
    background: linear-gradient(to bottom, rgb(30, 33, 50), rgb(44, 54, 73));
}
</style>

<style>
.remove-control-zoom {
    display: none !important;
    visibility: hidden;
}
</style>
