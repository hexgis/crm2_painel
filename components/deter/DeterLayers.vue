<template>
  <l-layer-group
    name="deter"
    :visible="showFeatures"
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
        @ready="onDeterReady"
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
    vectorGrid: null,

    style: {
      CR: {
        weight: 2.5,
        color: '#ff3333',
        fill: true,
        fillOpacity: 1,
      },
      DG: {
        weight: 2.5,
        color: '#ff8000',
        fill: true,
        fillOpacity: 1,
      },
      FF: {
        weight: 2.5,
        color: '#b35900',
        fill: true,
        fillOpacity: 1,
      },
      DR: {
        weight: 2.5,
        color: '#990099',
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
      'showFeatures',
    ]),
    ...mapGetters('deter', ['featuresLoaded']),
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
          ...this.style.DR,
          fillOpacity: this.opacity / 100,
        });
        this.vectorGrid.setFeatureStyle(2, {
          ...this.style.FF,
          fillOpacity: this.opacity / 100,
        });
        this.vectorGrid.setFeatureStyle(3, {
          ...this.style.DG,
          fillOpacity: this.opacity / 100,
        });
        this.vectorGrid.setFeatureStyle(4, {
          ...this.style.CR,
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
          if (i == 'fillOpacity') {
            this.style[item][i] = this.opacity / 100;
          }
        });
      });
      switch (classname) {
        case 'CR':
          return this.style.CR;
        case 'DG':
          return this.style.DG;
        case 'FF':
          return this.style.FF;
        case 'DR':
          return this.style.DR;
      }
    },

    addFeatures() {
      this.$refs.deterPolygons.mapObject.clearLayers();
      if (
        this.isVectorGrid
                && this.features
                && this.features.features
                && this.features.features.length
      ) {
        this.createDeterHeatLayer();
        this.flyTo();

        this.vectorGrid = this.$L.vectorGrid
          .slicer(this.features, {
            maxZoom: 21,
            vectorTileLayerStyles: {
              sliced: (e) => this.vectorGridStyleFunction(e.classname),
            },
            interactive: true,
            getFeatureId: (e) => {
              switch (e.properties.classname) {
                case 'CR':
                  return 4;
                case 'DG':
                  return 3;
                case 'FF':
                  return 2;
                case 'DR':
                  return 1;
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
        case 'Corte Raso':
          style.color = '#ff3333';
          break;
        case 'Degradação':
          style.color = '#ff8000';
          break;
        case 'Fogo em Floresta':
          style.color = '#b35900';
          break;
        case 'Desmatamento em Regeneração':
          style.color = '#990099';
          break;
      }
      return style;
    },

    onDeterReady() {
      if (this.features.features && this.features.features.length) {
        this.map.fitBounds(
          this.$refs.deterPolygons.mapObject.getBounds(),
        );
        this.createDeterHeatLayer();
      }
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
        (feature) => feature.properties.Areatotalkm,
      );
      const maxArea = Math.max.apply(null, areas);

      const heatData = [];
      this.features.features.forEach((feature) => {
        heatData.push([
          feature.properties.nu_latitude,
          feature.properties.nu_longitude,
          feature.properties.Areatotalkm / maxArea, // normalize by maximum area
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
  },
};
</script>
