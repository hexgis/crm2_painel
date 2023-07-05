<template>
  <div v-if="showLayer">
    <div
      v-for="layer in filteredLayers"
      :key="layer.id"
    >
      <SearchDrawLayers
        :key="layer.id"
        :layer="layer"
        :cql_filter="cqlFilter"
      />
    </div>
  </div>
</template>

<i18n>
{
    "en": {
        "polygon-label": "Draw a polygon",
        "rectangle-label": "Draw a rectangle"
    },
    "pt-br": {
        "polygon-label": "Desenhar um poligono",
        "rectangle-label": "Desenhar um retangulo"
    }
}
</i18n>

<script>
/* eslint-disable no-underscore-dangle --
 * Underscore attributes defined by "Leafleat" plugin
 */

import { mapMutations, mapState } from 'vuex';
import getGeometryArea from '~/plugins/getGeometryArea';

import SearchDrawLayers from './SearchDrawLayers.vue';

const { stringify } = require('wkt');
const circleToPolygon = require('circle-to-polygon');

export default {
  components: { SearchDrawLayers },
  props: {
    map: {
      type: Object,
      default: null,
    },
  },

  data: () => ({
    layerDraw: null,
    createdControl: false,
    enableDrawer: false,
    filteredGroups: [],
    filteredLayers: [],
    filterCql: null,
    enableSearchComponent: false,
    controlType: '',
  }),

  computed: {
    ...mapState('map', ['startDraw']),
    ...mapState('searchInArea', [
      'searchLayers',
      'layersGroups',
      'showLayer',
      'cqlFilter',
      'requestTool',
    ]),
    ...mapState('supportLayers', [
      'supportLayers',

    ]),
  },

  watch: {
    startDraw: {
      deep: true,
      handler(type) {
        if (type) {
          if (this.layerDraw) this.map.removeLayer(this.layerDraw);
          if (type !== 'Delete') {
            this.createDrawControl(type);
            this.enableSearchDraw(true);
          } else {
            this.filteredLayers = [];
            this.setDraw(false);
            this.setResultGroups(false);
          }
        }
      },
    },

    searchLayers() {
      if (this.searchLayers) {
        this.showResult(this.searchLayers);
      }
    },

    showLayer() {
      if (this.layerDraw) {
        if (!this.showLayer) this.map.removeLayer(this.layerDraw);
        else this.map.addLayer(this.layerDraw);
      }
    },
  },

  methods: {
    createDrawControl(type) {
      if (!this.createdControl) {
        this.map.on('draw:created', this.finishDraw);
        this.createdControl = true;
      }
      if (this.enableDrawer) {
        this.enableDrawer.disable();
      }
      this.controlType = type;
      this.enableDrawer = new this.$L.Draw[type](this.map);
      this.enableDrawer.enable();
    },

    finishDraw(event) {
      if (this.enableSearchComponent) {
        this.setCurrentAreaValue(getGeometryArea(event.layer));
        this.layerDraw = event.layer;
        let wkt;
        const polygon = this.layerDraw.toGeoJSON();
        if (this.controlType === 'Circle') {
          const coordinates = [polygon.geometry.coordinates[0], polygon.geometry.coordinates[1]];
          const raio = event.layer._mRadius;
          const circle = circleToPolygon(coordinates, raio, 32);
          wkt = stringify(circle);
        } else {
          wkt = stringify(polygon.geometry);
        }
        this.filterCql = `INTERSECTS(geom,${wkt})`;
        this.setCqlFilter(this.filterCql);
        this.setRequestTool('SearchInArea');
        this.layerDraw.options.fillOpacity = 0;
        this.map.addLayer(this.layerDraw);
        this.setDraw(true);
        this.enableSearchDraw(false);
        this.setIsDrawing(false);
      }
    },

    enableSearchDraw(value) {
      this.enableSearchComponent = value;
    },

    getUrl(layer, maxFeatures = '1') {
      if (layer.wms) {
        let cql = this.cqlFilter;
        if (this.requestTool !== 'SearchInArea') {
          const support = Object.values(this.supportLayers).filter((item) => item.id === layer.id);
          cql = support.length && support[0].cql ? `${this.cqlFilter} AND (${support[0].cql})` : this.cqlFilter;
        }
        let url = `${layer.wms.geoserver.wms_url
        }&service=WFS`
                    + '&version=1.0.0'
                    + '&request=GetFeature'
                    + `&typeName=${layer.wms.geoserver_layer_namespace}:${layer.wms.geoserver_layer_name
                    }&maxFeatures=${maxFeatures
                    }&cql_filter=${cql
                    }&outputFormat=application/json`;
        url = url.replace('wms', 'ows');
        return url;
      }
      return '';
    },

    includeGroup(group) {
      if (!this.filteredGroups.includes(group)) {
        this.filteredGroups = this.filteredGroups.concat(group);
      }
    },

    includeLayer(layer) {
      this.filteredLayers = this.filteredLayers.concat(layer);
    },

    async showResult(selectedIcons) {
      this.filteredGroups = [];
      this.filteredLayers = [];
      this.setLoadingRequest(true);
      this.updateLayers({ display: false, visible: true });

      for (const group of this.layersGroups) {
        // checks if a group has been filtered
        for (const item of selectedIcons) {
          if (`${group.name}_${group.id}` === item) {
            for (const layer of group.layers) {
              await this.getGeoserverFeaturesLength(layer, group);
            }
          } else {
            // checks if a layers has been filtered
            for (const layer of group.layers) {
              if (`${layer.name}_${layer.id}` === item) {
                await this.getGeoserverFeaturesLength(
                  layer,
                  group,
                );
              }
            }
          }
        }
      }

      if (this.filteredGroups.length === 0) {
        this.$store.commit('alert/addAlert', {
          message: this.$t('no-result'),
        });
      }

      this.setResultGroups(this.filteredGroups);
      this.setResultLayers(this.filteredLayers);
      this.setShowLayer(true);
      this.setLoadingRequest(false);
    },

    async getGeoserverFeaturesLength(layer, group) {
      const currentLayer = layer;
      const url = this.getUrl(currentLayer);
      if (url) {
        await this.$axios
          .get(url)
          .then(({ data }) => {
            if (data.totalFeatures) {
              currentLayer.length = data.totalFeatures;
              this.includeGroup(group);
              this.includeLayer(currentLayer);
            }
          })
          .catch((error) => {
            console.log(`${currentLayer.name}:${error}`);
          });
      }
    },

    ...mapMutations('searchInArea', [
      'setResultGroups',
      'setResultLayers',
      'updateLayers',
      'setDraw',
      'setShowLayer',
      'setLoadingRequest',
      'setCqlFilter',
      'setRequestTool',
    ]),
    ...mapMutations('map', ['setIsDrawing']),
    ...mapMutations('searchInArea', ['setCurrentAreaValue']),
  },

};
</script>

<style lang="sass">
</style>
