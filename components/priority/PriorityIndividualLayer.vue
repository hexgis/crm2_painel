<template>
  <l-layer-group
    name="priorities"
    :visible="showFeatures"
  >
    <l-layer-group />

    <l-feature-group ref="priorityPolygons">
      <l-geo-json
        v-if="!isVectorGrid && featuresLoaded"
        :geojson="featuresIndividual"
        :options="{ onEachFeature }"
      />
    </l-feature-group>
  </l-layer-group>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import BaseMetadataPopup from '@/components/base/BaseMetadataPopup';

export default {
  name: 'PriorityIndividualLayer',

  components: {
    BaseMetadataPopup,
  },

  props: {
    map: {
      type: Object,
      default: null,
    },
  },

  data: () => ({
    selectedMonitoringFeature: null,
    heatmapLayer: null,
    isVectorGrid: process.env.MONITORING_VECTOR2TILES === 'true',
    style: {
      lowest: {
        weight: 2.5,
        color: '#008000', // Green
        fill: true,
        fillOpacity: null,
      },
      low: {
        weight: 2.5,
        color: '#FFD700', // Gold
        fill: true,
        fillOpacity: null,
      },
      medium: {
        weight: 2.5,
        color: '#FF8C00', // DarkOrange
        fill: true,
        fillOpacity: null,
      },
      high: {
        weight: 2.5,
        color: '#FF0000', // red
        fill: true,
        fillOpacity: null,
      },
      highest: {
        weight: 2.5,
        color: '#9400D3', // DarkViolet
        fill: true,
        fillOpacity: null,
      },
    },
  }),

  computed: {
    ...mapState('priority', [
      'showFeatures',
      'featuresIndividual',
      'opacity',
      'heatMap',
    ]),
  },

  watch: {
    features() {
      this.addFeatures();
    },

    map() {
      this.addFeatures();
    },

    opacity() {
      if (this.isVectorGrid) {
        this.vectorGrid.setFeatureStyle(1, {
          ...this.style.lowest,
          fillOpacity: this.opacity / 100,
        });
        this.vectorGrid.setFeatureStyle(2, {
          ...this.style.low,
          fillOpacity: this.opacity / 100,
        });
        this.vectorGrid.setFeatureStyle(3, {
          ...this.style.medium,
          fillOpacity: this.opacity / 100,
        });
        this.vectorGrid.setFeatureStyle(4, {
          ...this.style.high,
          fillOpacity: this.opacity / 100,
        });
        this.vectorGrid.setFeatureStyle(5, {
          ...this.style.highest,
          fillOpacity: this.opacity / 100,
        });
      } else {
        this.$refs.monitoringPolygons.mapObject.invoke(
          'setStyle',
          this.setMonitoringStyle,
        );
      }
    },
  },

  methods: {
    vectorGridStyleFunction(prioridade) {
      Object.keys(this.style).forEach((item) => {
        Object.keys(this.style[item]).forEach((i) => {
          if (i == 'fillOpacity') {
            this.style[item][i] = this.opacity / 100;
          }
        });
      });

      switch (prioridade) {
        case 'Muito Alta':
          return this.style.highest;
        case 'Alta':
          return this.style.high;
        case 'Media':
          return this.style.medium;
        case 'Baixa':
          return this.style.low;
        default:
        case 'Muito Baixa':
          return this.style.lowest;
      }
    },
    addFeatures() {
      this.$refs.priorityPolygons.mapObject.clearLayers();
      if (this.isVectorGrid && this.featuresLoaded()) {
        this.flyTo();

        this.vectorGrid = this.$L.vectorGrid
          .slicer(this.featuresIndividual, {
            maxZoom: 21,
            zIndex: 4,
            vectorTileLayerStyles: {
              sliced: (e) => this.vectorGridStyleFunction(e.prioridade),
            },
            interactive: true,
            getFeatureId: (e) => {
              switch (e.properties.prioridade) {
                case 'Muito Alta':
                  return 5;
                case 'Alta':
                  return 4;
                case 'Media':
                  return 3;
                case 'Baixa':
                  return 2;
                default:
                  return 1;
              }
            },
          })
          .addTo(this.$refs.priorityPolygons.mapObject);
      }
    },

    onEachFeature(feature, layer) {
      layer.setStyle(this.setMonitoringStyle(feature));
    },

    flyTo() {
      this.map.flyTo([
        this.featuresIndividual.properties.nu_latitude,
        this.featuresIndividual.properties.nu_longitude,
      ], 16);
    },

    ...mapGetters('priority', ['featuresLoaded']),
  },
};
</script>

<style lang="sass" scoped></style>
