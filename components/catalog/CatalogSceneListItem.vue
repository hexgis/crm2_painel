<template>
  <v-card
    tile
    outlined
    :color="hover ? 'grey lighten-4' : 'transparent'"
    @mouseenter="setHoveredScene(index)"
    @mouseleave="setHoveredScene(null)"
  >
    <v-card-text>
      <v-row>
        <v-col cols="6">
          <v-img
            :src="getSceneUrl(scene)"
            :lazy-src="'/img/placeholder.png'"
            :alt="scene.image"
          />
        </v-col>

        <v-col cols="6">
          <v-card-text class="pa-2">
            <div class="d-flex flex-row-reverse mb-1">
              <v-icon> mdi-calendar </v-icon>
              <span class="mr-3">
                {{ $date(scene.date) }}
              </span>
            </div>
            <div class="d-flex flex-row-reverse mb-1">
              <v-icon> mdi-clock-outline </v-icon>
              <span class="mr-3">
                {{ $time(scene.date) }}
              </span>
            </div>
            <div class="d-flex flex-row-reverse mb-1">
              <v-icon> mdi-web </v-icon>
              <span class="mr-3">
                {{ scene.locator }}
              </span>
            </div>
            <div class="d-flex flex-row-reverse mb-1">
              <v-icon> mdi-satellite-variant </v-icon>
              <span class="mr-3">
                {{ scene.satellite }}
              </span>
            </div>
            <div class="d-flex flex-row-reverse mb-1">
              <v-icon> mdi-shape </v-icon>
              <span class="mr-3 text-uppercase">
                {{ scene.type }}
              </span>
            </div>
            <div class="d-flex flex-row-reverse">
              <v-icon> mdi-weather-partly-cloudy </v-icon>
              <span class="mr-3">
                {{
                  scene.cloud_cover
                    ? scene.cloud_cover.toFixed(
                      1
                    ) + '%'
                    : 'Indisponível'
                }}
              </span>
            </div>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card-text>

    <v-divider class="" />

    <v-card-actions class="action-button-grid pa-0">
      <v-row
        justify="space-around"
        align="center"
        no-gutters
      >
        <v-col>
          <v-tooltip bottom>
            <template #activator="{ on }">
              <div v-on="on">
                <v-switch
                  :input-value="scene.tmsVisible"
                  :disabled="isActiveCompare(index)"
                  color="accent"
                  class="mt-0 ml-4 mr-2"
                  dense
                  hide-details
                  @change="toggleTms(scene, index)"
                />
              </div>
            </template>
            <span> {{ $t('view-label') }} </span>
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
                @click="setZoomedScene(index)"
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
                @click="openMetadata(scene)"
              >
                <v-icon> mdi-clipboard-text </v-icon>
              </v-btn>
            </template>
            <span> {{ $t('metadata-label') }} </span>
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
                @click="downloadScene(scene)"
              >
                <v-icon> mdi-cloud-download </v-icon>
              </v-btn>
            </template>
            <span> {{ $t('download-label') }} </span>
          </v-tooltip>
        </v-col>

        <v-col>
          <v-tooltip bottom>
            <template #activator="{ on }">
              <v-btn
                :disabled="
                  disableCompare && !isActiveCompare(index)
                "
                text
                block
                large
                color="grey darken-3"
                v-on="on"
                @click="compareScene(scene, index)"
              >
                <v-icon
                  :class="{
                    'active-compare':
                      isActiveCompare(index),
                  }"
                >
                  mdi-compare
                </v-icon>
              </v-btn>
            </template>
            <span> {{ $t('compare-label') }} </span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<i18n>
{
    "en": {
        "view-label": "View image",
        "zoom-label": "Zoom to area",
        "metadata-label": "Metadata",
        "download-label": "Download image",
        "compare-label": "Compare image",
        "compare-alert": "Select another image to compare"
    },
    "pt-br": {
        "view-label": "Visualizar imagem",
        "zoom-label": "Aproximar para área",
        "metadata-label": "Metadados",
        "download-label": "Download da imagem",
        "compare-label": "Comparar imagem",
        "compare-alert": "Selecione outra imagem para comparar"
    }
}
</i18n>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'CatalogSceneListItem',

  props: {
    scene: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    hover: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    ...mapState('catalog', ['scenesToCompare']),

    disableCompare() {
      if (
        this.scenesToCompare.leftIndex != null
                && this.scenesToCompare.rightIndex != null
      ) {
        return true;
      }
      return false;
    },
  },

  methods: {
    toggleTms(scene, index) {
      if (scene.tmsVisible) {
        this.toggleTmsVisibility({
          index,
          tmsVisible: false,
        });
      } else {
        this.toggleTmsVisibility({
          index,
          tmsVisible: true,
        });
      }
      this.$forceUpdate();
    },

    openMetadata() {
      this.$emit('openMetadata');
    },

    downloadScene(scene) {
      window.open(scene.image_path);
    },

    isActiveCompare(index) {
      if (this.scenesToCompare.leftIndex === index) {
        if (this.scenesToCompare.leftInOtherPage === false) {
          return true;
        }
      } else if (this.scenesToCompare.rightIndex === index) {
        if (this.scenesToCompare.rightInOtherPage === false) {
          return true;
        }
      } else {
        return false;
      }
    },

    compareScene(scene, index) {
      if (!this.isActiveCompare(index)) {
        if (!scene.tmsVisible) {
          this.toggleTmsVisibility({
            index,
            tmsVisible: true,
          });
        }
      } else {
        this.toggleTmsVisibility({
          index,
          tmsVisible: false,
        });
      }

      if (
        this.scenesToCompare.rightIndex == null
                && this.scenesToCompare.leftIndex == null
      ) {
        this.$store.commit('alert/addAlert', {
          message: this.$t('compare-alert'),
        });
      }

      this.toggleSceneToCompare(index);

      this.$forceUpdate();
    },

    getSceneUrl(scene) {
      return scene.preview || '/img/placeholder.png';
    },

    ...mapMutations('catalog', [
      'setHoveredScene',
      'toggleTmsVisibility',
      'setZoomedScene',
      'toggleSceneToCompare',
      'setIsComparing',
    ]),
  },
};
</script>

<style scoped lang="sass">
.action-button-grid
    .col:not(:first-child)
        border-left: 1px solid rgba(0,0,0,0.2)

.active-compare
    color: red !important
</style>
