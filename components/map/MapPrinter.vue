<template>
    <div class="button-print-map d-flex mt-3">
        <v-tooltip right>
            <template #activator="{ on }">
                <v-btn v-on="on" fab ripple height="36" width="36">
                    <v-icon @click="dialogPrint = true"> mdi-printer </v-icon>
                </v-btn>
            </template>
            <span> {{ $t('print-icon-label') }} </span>
        </v-tooltip>
        <v-dialog
            v-model="dialogPrint"
            persistent
            transition="dialog-transition"
            max-width="100vw"
        >
            <v-toolbar dark color="secondary">
                <h3>{{ $t('print-dialog-label') }}</h3>
                <v-spacer></v-spacer>
                <v-btn icon @click="closeDialogPrinter(false)">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-stepper v-model="currentStep" value="3">
                <v-stepper-items>
                    <v-stepper-content step="1">
                        <v-container fluid>
                            <v-row>
                                <v-card-text class="pa-0 mt-2">
                                    {{ $t('dialog-text-first-step') }}
                                </v-card-text>
                            </v-row>

                            <v-row>
                                <v-text-field
                                    v-model="titleMap"
                                    :label="$t('input-title-label')"
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
                                    :hint="`${$t('input-size-hint')}: ${
                                        select.type
                                    }`"
                                    :items="items"
                                ></v-select>
                            </v-row>
                            <v-row class="mt-8 mb-2">
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click="currentStep++">
                                    {{ $t('input-button-first-step') }}
                                </v-btn>
                            </v-row>
                        </v-container>
                    </v-stepper-content>
                    <v-stepper-content step="2" class="ma-1 pa-1">
                        <v-container v-if="currentStep == 2">
                            <div style="overflow-x: auto; overflow-y: auto">
                                <MapForPrint
                                    id="printableMap"
                                    class="pa-1"
                                    :titleMap="titleMap"
                                    :leafSize="select"
                                />
                            </div>
                        </v-container>

                        <div class="d-flex flex-row mx-2">
                            <v-btn text @click="currentStep--">
                                {{ $t('input-button-back-second-step') }}
                            </v-btn>

                            <v-spacer></v-spacer>

                            <v-btn
                                color="primary"
                                class="mr-2"
                                :loading="loadingPrintImage"
                                @click="saveImage"
                            >
                                <v-icon dark> mdi-file-image-outline </v-icon>
                                {{ $t('input-button-print-image') }}
                            </v-btn>
                            <!-- <v-btn color="primary" @click="generatePdf">
                            <v-icon dark> mdi-file-export-outline </v-icon>
                            Gerar PDF
                        </v-btn> -->
                        </div>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>
        </v-dialog>
    </div>
</template>

<i18n>
{
    "en": {
        "print-icon-label": "print out",
        "print-dialog-label": "Print Out",
        "dialog-text-first-step": "Type below the title of the map to be printed or, if you prefer, leave it blank",
        "input-title-label": "Map Title",
        "input-size-hint": "Print Size",
        "input-button-first-step": "Continue",
        "input-button-back-second-step": "Back",
        "input-button-print-image": "Save Image"
    },
    "pt-br": {
        "print-icon-label": "Imprimir",
        "print-dialog-label": "Impressão",
        "dialog-text-first-step": "Digite abaixo o título do mapa a ser impresso ou, se preferir, deixe em branco",
        "input-title-label": "Título do Mapa",
        "input-size-hint": "Tamanho da Impressão",
        "input-button-first-step": "Continuar",
        "input-button-back-second-step": "Voltar",
        "input-button-print-image": "Salvar Imagem"
    }
}
</i18n>

<script>
import MapForPrint from '@/components/map/MapForPrint.vue'
import MiniMapForPrint from '@/components/map/MiniMapForPrint.vue'
import domtoimage from 'dom-to-image'

export default {
    name: 'MapPrinter',

    components: { MapForPrint, MiniMapForPrint },

    data: () => ({
        dialogPrint: false,
        currentStep: 1,
        loadingPrintImage: false,
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
    }),

    methods: {
        async saveImage() {
            this.loadingPrintImage = true
            try {
                let nameImageDownaload = this.titleMap
                let options = {
                    quality: 1,
                    bgcolor: 'white',
                }
                let node = document.getElementById('printableMap')
                let infoControlRight = document.getElementsByClassName(
                    'leaflet-control-attribution'
                )[1]
                if (window.navigator.userAgent.indexOf('Firefox') > -1) {
                    infoControlRight.setAttribute('style', 'width: 120%')
                }
                await domtoimage.toJpeg(node, options).then(function (image) {
                    var link = document.createElement('a')
                    link.href = image
                    link.download = nameImageDownaload
                        ? nameImageDownaload + '.jpeg'
                        : 'Mapa.jpeg'
                    link.click()
                })
                this.loadingPrintImage = false
                infoControlRight.setAttribute('style', 'width: 100%')
            } catch (error) {
                alert('Ocorreu um erro ao gerar a imagem.')
                this.loadingPrintImage = false
                infoControlRight.setAttribute('style', 'width: 100%')
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
