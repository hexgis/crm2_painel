<template>
  <v-card-actions class="pa-0 scene-action">
    <v-row
      justify="space-around"
      align="center"
      no-gutters
    >
      <v-col
        class="d-flex align-center"
        @click.stop=""
      >
        <v-tooltip bottom>
          <template #activator="{ on }">
            <div v-on="on">
              <v-switch
                :input-value="scene.visible"
                :disabled="!scene.properties.preview"
                color="accent"
                class="mt-0 ml-7"
                dense
                hide-details
                @change="toggleMapPreview"
              />
            </div>
          </template>
          <span> {{ $t('view-label') }} </span>
        </v-tooltip>
      </v-col>

      <v-col
        v-show="scene.properties.wmts && scene.properties.preview"
        @click.stop=""
      >
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-btn
              text
              block
              large
              color="grey darken-3"
              v-on="on"
              @click.stop="checkWmtsConfirm"
            >
              <v-icon :color="scene.wmtsVisible ? 'accent' : ''">
                mdi-eye
              </v-icon>
            </v-btn>
          </template>
          <span> {{ $t('full-res-label') }} </span>
        </v-tooltip>

        <v-dialog
          v-model="wmtsDialog"
          max-width="360"
        >
          <v-card>
            <v-card-title class="headline text-break">
              {{ $t('full-res-title') }}
            </v-card-title>
            <v-card-text class="py-6">
              {{ $t('full-res-text') }}
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="accent"
                text
                @click="wmtsDialog = false"
              >
                {{ $t('cancel-button') }}
              </v-btn>
              <v-btn
                color="accent"
                text
                @click="confirmWmtsPreview"
              >
                {{ $t('confirm-button') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>

      <v-col>
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-btn
              text
              block
              large
              color="grey darken-3"
              v-on="on"
              @click.stop="setZoomedScene(index)"
            >
              <v-icon> mdi-crosshairs-gps </v-icon>
            </v-btn>
          </template>
          <span> {{ $t('zoom-label') }} </span>
        </v-tooltip>
      </v-col>

      <v-col>
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-btn
              text
              block
              large
              color="grey darken-3"
              v-on="on"
              @click.stop="openMetadata()"
            >
              <v-icon> mdi-clipboard-text </v-icon>
            </v-btn>
          </template>
          <span> {{ $t('metadata-label') }} </span>
        </v-tooltip>
      </v-col>

      <v-col v-if="satellite.path === 'landsat/'">
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-btn
              text
              block
              large
              color="grey darken-3"
              :disabled="loadingDiff"
              :loading="loadingDiff"
              v-on="on"
              @click.stop="differentiateScenes"
            >
              <v-icon
                v-if="!loadingDiff"
                :color="
                  diffSceneProduct ===
                    scene.properties.product
                    ? 'accent'
                    : 'default'
                "
              >
                mdi-vector-difference
              </v-icon>

              <v-progress-circular
                v-else
                indeterminate
                size="18"
                :width="2"
                color="accent"
              />
            </v-btn>
          </template>
          <span> {{ $t('change-detection-label') }} </span>
        </v-tooltip>
      </v-col>

      <v-col
        v-if="
          satellite.path === 'sentinel1/' &&
            !scene.properties.download_available
        "
      >
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-btn
              text
              block
              large
              color="grey darken-3"
              :disabled="loadingSentinelRequest"
              :loading="loadingSentinelRequest"
              v-on="on"
              @click.stop="requestSentinelDownload"
            >
              <v-icon v-if="!loadingSentinelRequest">
                mdi-image-plus
              </v-icon>

              <v-progress-circular
                v-else
                indeterminate
                size="18"
                :width="2"
                color="accent"
              />
            </v-btn>
          </template>
          <span> {{ $t('sentinel-request-label') }} </span>
        </v-tooltip>
      </v-col>

      <v-col
        v-else-if="
          satellite.path === 'sentinel1/' &&
            scene.properties.download_available &&
            scene.properties.download_link
        "
      >
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-btn
              text
              block
              large
              color="grey darken-3"
              v-on="on"
              @click.stop="downloadSentinelScene"
            >
              <v-icon> mdi-download </v-icon>
            </v-btn>
          </template>
          <span> {{ $t('sentinel-download-label') }} </span>
        </v-tooltip>
      </v-col>
    </v-row>
  </v-card-actions>
</template>

<i18n>
{
    "en": {
        "view-label": "View miniature",
        "full-res-label": "View full resolution image",
        "full-res-title": "View image in full resolution?",
        "full-res-text": "Enabling this feature will entail additional costs to the plataform as the images are presented. It is suggested that this feature is disabled after visualization to lower operational costs.",
        "zoom-label": "Zoom to area",
        "metadata-label": "Metadata",
        "change-detection-label": "Change detection",
        "sentinel-request-label": "Request Sentinel download",
        "sentinel-request-message": "Successful download request for Sentinel scene.",
        "sentinel-request-error": "Unable to request download for Sentinel scene.",
        "sentinel-download-label": "Download Sentinel image",
        "confirm-button": "Confirm",
        "cancel-button": "Cancel",
        "change-detection-message": "Select a second image for change detection",
        "generating-change-detection": "Gerando change detection das imagens. Por favor, aguarde."
    },
    "pt-br": {
        "view-label": "Visualizar miniatura",
        "full-res-label": "Visualizar imagem com máxima resolução",
        "full-res-title": "Visualizar imagem em resolução máxima?",
        "full-res-text": "A ativação deste recurso acarretará em custos adicionais à plataforma à medida que as imagens forem apresentadas. Sugere-se a desativação da imagem após sua visualização visando diminuir custos operacionais.",
        "zoom-label": "Aproximar para área",
        "metadata-label": "Metadados",
        "change-detection-label": "Change detection",
        "sentinel-request-label": "Solicitar download Sentinel",
        "sentinel-request-message": "Requisição de download para a cena Sentinel bem sucedida.",
        "sentinel-request-error": "Não foi possível requisitar o download para a cena Sentinel.",
        "sentinel-download-label": "Baixar imagem Sentinel",
        "confirm-button": "Confirmar",
        "cancel-button": "Cancelar",
        "change-detection-message": "Selecione a segunda imagem para o change detection",
        "generating-change-detection": "Gerando change detection das imagens. Por favor, aguarde."
    }
}
</i18n>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'ImagerySceneListItemActions',

  props: {
    scene: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },

  data: () => ({
    wmtsDialog: false,
    loadingSentinelRequest: false,
  }),

  computed: {
    wmtsConfirm: {
      set(val) {
        this.$store.commit('imagery/setWmtsConfirm', val);
      },
      get() {
        return this.$store.state.imagery.wmtsConfirm;
      },
    },

    ...mapState('imagery', [
      'diffSceneProduct',
      'loadingDiff',
      'satellite',
    ]),
  },

  methods: {
    toggleMapPreview() {
      this.toggleScenePreview({
        index: this.index,
        visible: !this.scene.visible,
      });
      this.$forceUpdate();
    },

    checkWmtsConfirm() {
      if (!this.wmtsConfirm) {
        this.wmtsDialog = true;
      } else {
        this.toggleWmtsPreview();
      }
    },

    confirmWmtsPreview() {
      this.wmtsDialog = false;
      this.wmtsConfirm = true;
      this.toggleWmtsPreview();
    },

    toggleWmtsPreview() {
      if (!this.scene.wmtsVisible && this.scene.visible) {
        this.toggleScenePreview({
          index: this.index,
          visible: false,
        });
      }
      this.toggleSceneWmtsPreview({
        index: this.index,
        wmtsVisible: !this.scene.wmtsVisible,
      });
      this.$forceUpdate();
    },

    openMetadata() {
      this.$emit('openDetails');
    },

    differentiateScenes() {
      if (this.diffSceneProduct) {
        if (this.diffSceneProduct === this.scene.properties.product) {
          this.setDiffSceneProduct(null);
        } else {
          this.$store.commit('alert/addAlert', {
            message: this.$t('generating-change-detection'),
          });
          this.$store.dispatch(
            'imagery/getDiffData',
            this.scene.properties.product,
          );
        }
      } else {
        this.setDiffSceneProduct(this.scene.properties.product);

        this.$store.commit('alert/addAlert', {
          message: this.$t('change-detection-message'),
        });
      }
    },

    async requestSentinelDownload() {
      this.loadingSentinelRequest = true;
      try {
        await this.$apiSkynet.$post(
          `${this.satellite.path
          }scene/request/${
            this.scene.properties.product
          }/`,
        );

        this.$store.commit('alert/addAlert', {
          message: this.$t('sentinel-request-message'),
        });
      } catch (error) {
        this.$store.commit('alert/addAlert', {
          message: this.$t('sentinel-request-error'),
        });
      } finally {
        this.loadingSentinelRequest = false;
      }
    },

    downloadSentinelScene() {
      window.location.assign(this.scene.properties.download_link);
    },

    ...mapMutations('imagery', [
      'setZoomedScene',
      'toggleScenePreview',
      'toggleSceneWmtsPreview',
      'setDiffSceneProduct',
    ]),
  },
};
</script>

<style lang="sass">
.scene-action
    .col:not(:first-child)
        border-left: 1px solid rgba(0,0,0,0.2)
</style>
