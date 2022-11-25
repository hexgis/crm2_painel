<template>
  <v-card-text>
    <v-row
      align="center"
      justify="space-between"
    >
      <v-col cols="6">
        <v-hover v-slot="{ hover }">
          <div>
            <v-img
              v-if="!scene.loadingPreview"
              :src="previewUrl"
              :lazy-src="previewUrl"
              :alt="scene.properties.product"
              width="145"
              height="145"
            >
              <v-fade-transition>
                <div
                  v-if="!hasPreview"
                  class="
                                        fill-height
                                        d-flex
                                        align-center
                                        justify-center
                                        transition-fast-in-fast-out
                                        grey
                                        text-h6
                                        white--text
                                    "
                  :class="{
                    'lighten-2': !hover,
                  }"
                  @click.stop="getPreview"
                >
                  <v-icon
                    color="white"
                    class="mr-2"
                  >
                    mdi-eye
                  </v-icon>
                  {{ $t('view-label') }}
                </div>
              </v-fade-transition>
            </v-img>
          </div>
        </v-hover>
        <v-skeleton-loader
          v-if="scene.loadingPreview"
          type="image"
          height="145"
          width="145"
          tile
          transition="fade-transition"
        />
      </v-col>

      <v-col
        cols="6"
        class="pl-0"
      >
        <v-card-text class="pa-2">
          <div class="d-flex flex-row-reverse mb-1">
            <v-icon> mdi-calendar </v-icon>
            <span class="mr-3">
              {{ $date(scene.properties.date) }}
            </span>
          </div>

          <div
            v-if="isHighResSatellite"
            class="d-flex flex-row-reverse mb-1"
          >
            <v-icon> mdi-clock-time-four </v-icon>
            <span class="mr-3">
              {{ timeFormatted }}
            </span>
          </div>

          <div class="d-flex flex-row-reverse mb-1">
            <v-icon> mdi-satellite-variant </v-icon>
            <span class="mr-3">
              {{ satellite.name }}
            </span>
          </div>

          <div
            v-if="!isHighResSatellite"
            class="d-flex flex-row-reverse mb-1"
          >
            <v-icon> mdi-web </v-icon>
            <span
              v-if="satellite.path == 'landsat/'"
              class="mr-3"
            >
              {{ scene.properties.path }}
              /
              {{ scene.properties.row }}
            </span>
            <span
              v-else-if="satellite.path == 'sentinel2/'"
              class="mr-3"
            >
              {{ scene.properties.tile }}
            </span>
            <span
              v-else
              class="mr-3"
            >
              {{ scene.properties.orbit_number }}
            </span>
          </div>

          <div class="d-flex flex-row-reverse">
            <v-icon> mdi-weather-partly-cloudy </v-icon>
            <span class="mr-3">
              {{
                scene.properties.cloud_cover
                  ? scene.properties.cloud_cover.toFixed(1) +
                    ' %'
                  : $t('unavailable')
              }}
            </span>
          </div>

          <div
            v-if="satellite.agency === 'AIRBUS'"
            class="d-flex flex-row-reverse mb-1"
          >
            <v-icon>
              {{
                scene.properties.wmts
                  ? 'mdi-check'
                  : 'mdi-cancel'
              }}
            </v-icon>
            <span class="mr-3"> {{ $t('streaming-label') }} </span>
          </div>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<i18n>
{
    "en": {
        "view-label": "View",
        "streaming-label": "Streaming",
        "preview-error": "Error while retrieving image preview. Contact a system administrator in case it persists.",
        "unavailable": "Unavailable"
    },
    "pt-br": {
        "view-label": "Visualizar",
        "streaming-label": "Streaming",
        "preview-error": "Ocorreu um erro ao resgatar a prévia da imagem. Caso o problema persista, contate o administrador do sistema.",
        "unavailable": "Indisponível"
    }
}
</i18n>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'ImagerySceneListItem',

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

  computed: {
    isGridSelected() {
      return this.hoveredGridScene === this.index;
    },

    previewUrl() {
      return this.scene.properties.preview || '/img/placeholder.png';
    },

    hasPreview() {
      return !!this.scene.properties.preview;
    },

    timeFormatted() {
      return this.isHighResSatellite
        ? this.$moment(this.scene.properties.date).format('HH:mm')
        : '';
    },

    ...mapState('imagery', ['satellite', 'hoveredGridScene']),
    ...mapGetters('imagery', ['isHighResSatellite']),
  },

  methods: {
    getPreview() {
      if (this.isHighResSatellite) {
        this.getHighResSatPreview();
      } else {
        this.getDefaultScenePreview(this.satellite.id);
      }
    },

    async getDefaultScenePreview() {
      const params = {
        sat_id: this.satellite.id,
      };
      this.togglePreviewLoading({ index: this.index, loading: true });

      try {
        const scene = await this.$apiSkynet.$get(
          `${this.satellite.path
          }scene/preview/${
            this.scene.properties.product}`,
          { params },
        );
        this.updateScene({ index: this.index, scene });
      } catch (exception) {
        this.$store.commit('alert/addAlert', {
          message: this.$t('preview-error'),
        });
      } finally {
        this.togglePreviewLoading({ index: this.index, loading: false });
      }
    },

    async getHighResSatPreview() {
      const params = {
        product: this.scene.properties.product
          ? this.scene.properties.product
          : undefined,
        identifier: this.scene.properties.identifier
          ? this.scene.properties.identifier
          : undefined,
        date: this.scene.properties.date.substr(0, 10),
        preview_url: this.scene.properties.quicklook
          ? this.scene.properties.quicklook
          : undefined,
      };
      this.togglePreviewLoading({ index: this.index, loading: true });

      try {
        const { preview, bbox } = await this.$apiSkynet.$get(
          `${this.satellite.path}scene/preview`,
          { params },
        );
        this.setScenePreview({ index: this.index, preview });
        if (bbox) {
          this.updateScene({
            index: this.index,
            scene: { ...this.scene, previewBbox: bbox },
          });
        }
      } catch (exception) {
        this.$store.commit('alert/addAlert', {
          message: this.$t('preview-error'),
        });
      } finally {
        this.togglePreviewLoading({ index: this.index, loading: false });
      }
    },

    ...mapMutations('imagery', [
      'updateScene',
      'setScenePreview',
      'togglePreviewLoading',
    ]),
  },
};
</script>
