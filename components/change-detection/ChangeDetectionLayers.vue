<template>
  <l-layer-group :visible="showFeatures">
    <l-feature-group ref="detectionsGeom">
      <l-popup
        ref="popup"
        :options="{
          className: 'card-popup',
          minWidth: 300,
        }"
      />
    </l-feature-group>

    <BaseMetadataPopup
      v-show="false"
      ref="popupComponent"
      :feature="selectedDetectionFeature"
    />

    <l-feature-group
      ref="detectionGrid"
      name="detectionGrid"
    >
      <l-geo-json
        v-for="(grid, i) in detectionsGrid"
        :key="i"
        :geojson="grid"
        :options-style="styles.default"
      />
    </l-feature-group>

    <l-layer-group>
      <template v-for="(detection, i) in changeDetections">
        <l-image-overlay
          :key="`${i}_t0`"
          :url="detection.scene_t0.preview"
          :bounds="getBounds(detection, i)"
          :visible="detection.visibleT0"
        />

        <l-image-overlay
          :key="`${i}_t1`"
          :url="detection.scene_t1.preview"
          :bounds="getBounds(detection, i)"
          :visible="detection.visibleT1"
        />
      </template>
    </l-layer-group>
  </l-layer-group>
</template>

<i18n>
{
    "en": {
        "feature-details-error": "Error while acquiring polygon data, contact a system administrator in case it persists."
    },
    "pt-br": {
        "feature-details-error": "Não foi possível resgatar os dados do polígono, entre em contato com um administrador caso persista."
    }
}
</i18n>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';

import BaseMetadataPopup from '@/components/base/BaseMetadataPopup';

if (typeof window !== 'undefined') {
  require('leaflet.vectorgrid');
}

export default {
  name: 'ChangeDetectionLayers',

  components: { BaseMetadataPopup },

  props: {
    map: {
      type: Object,
      default: null,
    },
  },

  data: () => ({
    selectedGridLayer: null,
    selectedDetectionFeature: null,
    vectorGrids: [],

    styles: {
      default: {
        weight: 1,
        color: '#4C527C',
        fill: null,
      },
      hover: {
        weight: 2.5,
        color: '#C2293D',
      },
      diff: {
        weight: 1,
        color: '#4C527C',
        fill: true,
        fillOpacity: 0.3,
      },
    },
  }),

  computed: {
    detectionsGrid() {
      const grid = [];

      this.changeDetections.forEach((detection) => {
        const geom = {
          type: 'Feature',
          geometry: detection.grid_geom,
        };

        geom.properties = {
          id: detection.id,
        };

        grid.push(geom);
      });

      return grid;
    },

    ...mapGetters('change-detection', ['detectionsGeom']),

    ...mapState('change-detection', [
      'changeDetections',
      'hoveredDetection',
      'zoomedDetection',
      'showFeatures',
    ]),
  },

  watch: {
    detectionsGeom() {
      this.addDetectionsGeom();
    },

    hoveredDetection(index) {
      if (index !== null) {
        const detection = this.changeDetections[index];
        if (detection) {
          this.$refs.detectionGrid.mapObject.eachLayer((layer) => {
            if (
              layer.getLayers()[0].feature.properties.id
                            === detection.id
            ) {
              this.highlightLayer(layer);
            }
          });
        }
      } else if (this.selectedGridLayer) {
        this.clearHighlight();
      }
    },

    zoomedDetection(index) {
      if (index !== null) {
        const detection = this.changeDetections[index];
        if (detection) {
          this.$refs.detectionGrid.mapObject.eachLayer((layer) => {
            if (
              layer.getLayers()[0].feature.properties.id
                            === detection.id
            ) {
              this.map.flyToBounds(layer.getBounds());
            }
          });
          this.setZoomedDetection(null);
        }
      }
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.addDetectionsGeom();
    });
  },

  methods: {
    highlightLayer(layer) {
      if (this.selectedGridLayer) {
        this.selectedGridLayer.setStyle(this.styles.default);
      }
      this.selectedGridLayer = layer;
      this.selectedGridLayer.setStyle(this.styles.hover);
    },

    clearHighlight() {
      this.selectedGridLayer.setStyle(this.styles.default);
      this.selectedGridLayer = null;
    },

    getBounds(detection) {
      return this.$L.geoJSON(detection.grid_geom).getBounds();
    },

    addDetectionsGeom() {
      this.$refs.detectionsGeom.mapObject.clearLayers();
      this.vectorGrids = [];

      if (this.detectionsGeom.length) {
        this.detectionsGeom.forEach((detection) => {
          const newGrid = this.$L.vectorGrid
            .slicer(detection, {
              maxZoom: 21,
              zIndex: 2,
              vectorTileLayerStyles: {
                sliced: () => this.styles.diff,
              },
              interactive: true,
              getFeatureId: (_) => 1,
            })
            .on('click', (e) => {
              this.getFeatureDetails(e.layer.properties.id);
            })
            .addTo(this.$refs.detectionsGeom.mapObject);

          this.vectorGrids.push(newGrid);
        });
      }
    },

    async getFeatureDetails(featureId) {
      this.selectedDetectionFeature = null;
      this.$nextTick(() => {
        this.$refs.popup.mapObject.setContent(
          this.$refs.popupComponent.$el.innerHTML,
        );
      });

      try {
        this.selectedDetectionFeature = await this.$apiSkynet.$get(
          `landsat/changes/detail/${featureId}/`,
        );

        this.$nextTick(() => {
          this.$refs.popup.mapObject.setContent(
            this.$refs.popupComponent.$el.innerHTML,
          );
        });
      } catch (exception) {
        this.$store.commit('alert/addAlert', {
          message: this.$t('feature-details-error'),
        });
      }
    },

    ...mapMutations('change-detection', ['setZoomedDetection']),
  },
};
</script>

<style lang="sass">
.tooltip-grid
    border-radius: 50% !important
    width: 52px
    height: 52px
    display: flex
    align-items: center
    border: none !important
    background-color: #4c527c !important
    color: #fff !important
    font-size: 12px !important
    margin: 0 -1.7rem !important
    opacity: 1 !important
</style>
