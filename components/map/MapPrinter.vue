<template>
  <div class="button-print-map d-flex mt-3">
    <v-tooltip right>
      <template #activator="{ on }">
        <v-btn
          fab
          ripple
          height="36"
          width="36"
          v-on="on"
        >
          <v-icon @click="dialogPrint = true">
            mdi-printer
          </v-icon>
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
      <v-toolbar
        dark
        color="secondary"
      >
        <h3>{{ $t('print-dialog-label') }}</h3>
        <v-spacer />
        <v-btn
          icon
          @click="closeDialogPrinter(false)"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-stepper
        v-model="currentStep"
        value="3"
      >
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
                />
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
                />
              </v-row>
              <v-row class="mt-8 mb-2">
                <v-spacer />
                <v-btn
                  color="primary"
                  @click="currentStep++"
                >
                  {{ $t('input-button-first-step') }}
                </v-btn>
              </v-row>
            </v-container>
          </v-stepper-content>
          <v-stepper-content
            step="2"
            class="ma-1 pa-1"
          >
            <v-container v-if="currentStep === 2">
              <div style="overflow-x: auto; overflow-y: auto">
                <MapForPrint
                  id="printableMap"
                  class="pa-1"
                  :title-map="titleMap"
                  :leaf-size="select"
                  :map="map"
                  :selected-base-map="selectedBaseMap"
                />
              </div>
            </v-container>

            <div class="d-flex flex-row mx-2">
              <v-btn
                text
                @click="currentStep--"
              >
                {{ $t('input-button-back-second-step') }}
              </v-btn>

              <v-spacer />

              <v-btn
                color="primary"
                class="mr-2"
                :loading="loadingPrintImage"
                @click="saveImage"
              >
                <v-icon dark>
                  mdi-file-image-outline
                </v-icon>
                {{ $t('input-button-print-image') }}
              </v-btn>

              <v-btn
                color="primary"
                class="mr-2"
                :loading="loadingGeneratePdf"
                @click="generatePdf"
              >
                <v-icon dark>
                  mdi-file-pdf
                </v-icon>
                {{ $t('input-button-generate-pdf') }}
              </v-btn>
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
        "input-button-print-image": "Save Image",
        "input-button-generate-pdf": "Generate PDF"
    },
    "pt-br": {
        "print-icon-label": "Imprimir",
        "print-dialog-label": "Impressão",
        "dialog-text-first-step": "Digite abaixo o título do mapa a ser impresso ou, se preferir, deixe em branco",
        "input-title-label": "Título do Mapa",
        "input-size-hint": "Tamanho da Impressão",
        "input-button-first-step": "Continuar",
        "input-button-back-second-step": "Voltar",
        "input-button-print-image": "Salvar Imagem",
        "input-button-generate-pdf": "Gerar PDF"
    }
}
</i18n>

<script>
import domtoimage from 'dom-to-image';
import { jsPDF } from 'jspdf';
import MapForPrint from '@/components/map/MapForPrint.vue';
import MiniMapForPrint from '@/components/map/MiniMapForPrint.vue';

export default {
  name: 'MapPrinter',

  components: { MapForPrint, MiniMapForPrint },

  props: {
    value: {
      type: Boolean,
      require: true,
      default: false,
    },
    map: {
      type: Object,
      default: null,
    },

    selectedBaseMap: {
      type: Object,
      default: null,
    },
  },

  data: () => ({
    dialogPrint: false,
    currentStep: 1,
    loadingPrintImage: false,
    loadingGeneratePdf: false,
    titleMap: '',
    dataUrlImagePrint: null,
    select: { type: 'A4' },
    items: [
      { type: 'A4' },
      { type: 'A0' },
      { type: 'A1' },
      { type: 'A2' },
      { type: 'A3' },
    ],
  }),

  mounted() {
    this.dialogPrint = this.value;
  },

  methods: {
    async saveImage() {
      this.loadingPrintImage = true;
      try {
        const nameImageDownload = this.titleMap;
        const options = {
          quality: 1,
          bgcolor: 'white',
        };
        const node = document.getElementById('printableMap');
        const infoControlRight = document.getElementsByClassName(
          'leaflet-control-attribution',
        )[1];
        if (window.navigator.userAgent.indexOf('Firefox') > -1) {
          infoControlRight.setAttribute('style', 'width: 120%');
        }
        await domtoimage.toJpeg(node, options).then((image) => {
          const link = document.createElement('a');
          link.href = image;
          link.download = nameImageDownload
            ? `${nameImageDownload}.jpeg`
            : 'Mapa.jpeg';
          link.click();
        });
        this.loadingPrintImage = false;
        infoControlRight.setAttribute('style', 'width: 100%');
      } catch (error) {
        alert('Ocorreu um erro ao gerar a imagem.');
        this.loadingPrintImage = false;
        infoControlRight.setAttribute('style', 'width: 100%');
      }
    },
    async generatePdf() {
      this.loadingGeneratePdf = true;
      try {
        const nameImageDownload = this.titleMap;
        const options = {
          quality: 1,
          bgcolor: 'white',
        };
        const node = document.getElementById('printableMap');
        await domtoimage.toJpeg(node, options).then((image) => {
          const doc = new jsPDF({
            orientation: 'portrait',
            format: this.select.type,
            compression: 'SLOW',
          });

          const width = doc.internal.pageSize.getWidth();
          const height = doc.internal.pageSize.getHeight();
          const aspectRatio = node.offsetWidth / node.offsetHeight;
          const imageWidth = aspectRatio >= 1 ? width : height * aspectRatio;
          const imageHeight = aspectRatio >= 1 ? width / aspectRatio : height;

          doc.addImage(image, 'JPEG', 0, 0, imageWidth, imageHeight);
          doc.save(`${nameImageDownload}.pdf`);
        });
        this.loadingGeneratePdf = false;
      } catch (error) {
        this.$store.commit('alert/addAlert', {
          message: this.$t('image-error'),
        });
        this.loadingGeneratePdf = false;
      }
    },

    closeDialogPrinter(value) {
      this.dialogPrint = value;
      this.currentStep = 1;
    },
  },
};
</script>

<style scoped>
.background__toolbar {
    background: linear-gradient(to bottom, rgb(28, 65, 113), rgb(28, 65, 113));
}
</style>

<style>
.remove-control-zoom {
    display: none !important;
    visibility: hidden;
}
</style>
