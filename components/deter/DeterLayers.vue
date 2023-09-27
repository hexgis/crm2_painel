<template>
  <l-layer-group
    name="deter"
    :visible="showFeaturesDeter"
  >
    <l-layer-group
      ref="deterHeat"
      :visible="heatMap"
    />

    <l-feature-group ref="deterPolygons">
      <l-popup
        ref="popup"
        :options="{
          minWidth: 500,
          className: 'card-popup',
        }"
      >
        <BaseMetadataPopup
          ref="popupComponent"
          :feature="selectedDeterFeature"
        />
      </l-popup>

      <l-geo-json
        v-if="!isVectorGrid && featuresLoaded"
        :geojson="features"
        :options="{ onEachFeature }"
      />
    </l-feature-group>
  </l-layer-group>
</template>

<i18n>
{
    "en": {
        "detail-api-error": "Error while retrieving polygon data, contact a system administrator in case it persists."
    },
    "pt-br": {
        "detail-api-error": "Não foi possível resgatar os dados do polígono, entre em contato com um administrador caso persista."
    }
}
</i18n>

<script>
import { mapState, mapGetters } from 'vuex';

import BaseMetadataPopup from '@/components/base/BaseMetadataPopup';

if (typeof window !== 'undefined') {
  require('leaflet.vectorgrid');
  require('leaflet.heat');
}

export default {
  name: 'DeterLayers',

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
    selectedDeterFeature: null,
    heatmapLayer: null,

    isVectorGrid: process.env.MONITORING_VECTOR2TILES === 'true',

    style: {
      CICATRIZ_DE_QUEIMADA: {
        weight: 2.5,
        color: '#330000',
        fill: true,
        fillOpacity: 1,
      },
      DESMATAMENTO_VEG: {
        weight: 2.5,
        color: '#b2b266',
        fill: true,
        fillOpacity: 1,
      },
      CS_DESORDENADO: {
        weight: 2.5,
        color: '#ff4dff',
        fill: true,
        fillOpacity: 1,
      },
      DESMATAMENTO_CR: {
        weight: 2.5,
        color: '#cca300',
        fill: true,
        fillOpacity: 1,
      },
      CS_GEOMETRICO: {
        weight: 2.5,
        color: '#669999',
        fill: true,
        fillOpacity: 1,
      },
      DEGRADACAO: {
        weight: 2.5,
        color: '#ff8000',
        fill: true,
        fillOpacity: 1,
      },
      MINERACAO: {
        weight: 2.5,
        color: '#cccc00',
        fill: true,
        fillOpacity: 1,
      },
    },
  }),

  computed: {
    ...mapState('deter', [
      'features',
      'opacity',
      'heatMap',
      'showFeaturesDeter',
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
        this.vectorGrid.setFeatureStyle(7, {
          ...this.style.CICATRIZ_DE_QUEIMADA,
          fillOpacity: this.opacity / 100,
        });
        this.vectorGrid.setFeatureStyle(6, {
          ...this.style.DESMATAMENTO_VEG,
          fillOpacity: this.opacity / 100,
        });
        this.vectorGrid.setFeatureStyle(5, {
          ...this.style.CS_DESORDENADO,
          fillOpacity: this.opacity / 100,
        });
        this.vectorGrid.setFeatureStyle(4, {
          ...this.style.DESMATAMENTO_CR,
          fillOpacity: this.opacity / 100,
        });
        this.vectorGrid.setFeatureStyle(3, {
          ...this.style.CS_GEOMETRICO,
          fillOpacity: this.opacity / 100,
        });
        this.vectorGrid.setFeatureStyle(2, {
          ...this.style.DEGRADACAO,
          fillOpacity: this.opacity / 100,
        });
        this.vectorGrid.setFeatureStyle(1, {
          ...this.style.MINERACAO,
          fillOpacity: this.opacity / 100,
        });
      } else {
        this.$refs.deterPolygons.mapObject.invoke(
          'setStyle',
          this.setDeterStyle,
        );
      }
    },
  },

  methods: {
    vectorGridStyleFunction(classname) {
      Object.keys(this.style).forEach((item) => {
        Object.keys(this.style[item]).forEach((i) => {
          if (i === 'fillOpacity') {
            this.style[item][i] = this.opacity / 100;
          }
        });
      });
      switch (classname) {
        case 'CICATRIZ_DE_QUEIMADA':
          return this.style.CICATRIZ_DE_QUEIMADA;
        case 'DESMATAMENTO_VEG':
          return this.style.DESMATAMENTO_VEG;
        case 'CS_DESORDENADO':
          return this.style.CS_DESORDENADO;
        case 'DESMATAMENTO_CR':
          return this.style.DESMATAMENTO_CR;
        case 'CS_GEOMETRICO':
          return this.style.CS_GEOMETRICO;
        case 'DEGRADACAO':
          return this.style.DEGRADACAO;
        case 'MINERACAO':
          return this.style.MINERACAO;
      }
    },

    addFeatures() {
      this.$refs.deterPolygons.mapObject.clearLayers();
      if (
        this.isVectorGrid && this.featuresLoaded()
      ) {
        this.createDeterHeatLayer();
        this.flyTo();

        this.vectorGrid = this.$L.vectorGrid
          .slicer(this.features, {
            maxZoom: 21,
            zIndex: 4,
            vectorTileLayerStyles: {
              sliced: (e) => this.vectorGridStyleFunction(e.classname),
            },
            interactive: true,
            getFeatureId: (e) => {
              switch (e.properties.classname) {
                case 'CICATRIZ_DE_QUEIMADA':
                  return 7;
                case 'DESMATAMENTO_VEG':
                  return 6;
                case 'CS_DESORDENADO':
                  return 5;
                case 'DESMATAMENTO_CR':
                  return 4;
                case 'CS_GEOMETRICO':
                  return 3;
                case 'DEGRADACAO':
                  return 2;
                case 'MINERACAO':
                  return 1;
                default:
                  return 0;
              }
            },
          })
          .on('click', (e) => {
            this.getFeatureDetails(e.layer.properties.id);
          })
          .addTo(this.$refs.deterPolygons.mapObject);
      }
    },

    onEachFeature(feature, layer) {
      layer.setStyle(this.setDeterStyle(feature));

      layer.on('click', () => {
        this.getFeatureDetails(feature.properties.id);
      });
    },

    setDeterStyle(feature) {
      const { style } = this;
      style.fillOpacity = this.opacity / 100;

      switch (feature.properties.classname) {
        case 'CICATRIZ_DE_QUEIMADA':
          style.color = '#330000';
          break;
        case 'DESMATAMENTO_VEG':
          style.color = '#b2b266';
          break;
        case 'CS_DESORDENADO':
          style.color = '#ff4dff';
          break;
        case 'DESMATAMENTO_CR':
          style.color = '#cca300';
          break;
        case 'CS_GEOMETRICO':
          style.color = '#669999';
          break;
        case 'DEGRADACAO':
          style.color = '#ff8000';
          break;
        case 'MINERACAO':
          style.color = '#cccc00';
          break;
      }
      return style;
    },

    async getFeatureDetails(featureId) {
      this.selectedDeterFeature = null;

      try {
        this.selectedDeterFeature = await this.$api.$get(
          `monitoring/deter/detail/${featureId}/`,
        );
      } catch (exception) {
        this.$store.commit('alert/addAlert', {
          message: this.$t('detail-api-error'),
        });
      }
    },

    flyTo() {
      const bounds = this.$L.geoJSON(this.features).getBounds();
      if (bounds.getNorthEast() && bounds.getSouthWest()) { this.map.flyToBounds(bounds); }
    },

    createDeterHeatLayer() {
      const areas = this.features.features.map(
        (feature) => feature.properties.areatotalkm,
      );
      const maxArea = Math.max.apply(null, areas);

      const heatData = [];
      this.features.features.forEach((feature) => {
        heatData.push([
          feature.properties.nu_latitude,
          feature.properties.nu_longitude,
          feature.properties.areatotalkm / maxArea, // normalize by maximum area
        ]);
      });

      if (this.heatmapLayer) {
        this.heatmapLayer.removeFrom(
          this.$refs.deterHeat.mapObject,
        );
      }

      this.heatmapLayer = this.$L.heatLayer(heatData, {
        minOpacity: 0.5,
        maxZoom: 18,
        radius: 20,
        blur: 15,
        zIndex: 4,
      });
      this.heatmapLayer.addTo(this.$refs.deterHeat.mapObject);
    },
    ...mapGetters('deter', ['featuresLoaded']),
  },
};
</script>
