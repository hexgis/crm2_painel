<template>
  <div class="map-container">
    <client-only>
      <l-map
        ref="map"
        class="map-container"
        :zoom="zoom"
        :bounds="localBounds"
        :min-zoom="minZoom"
        :max-zoom="21"
        :max-bounds="maxBounds"
        :max-bounds-viscosity="1"
        :options="mapOptions"
        @update:bounds="updateBounds"
      >
        <l-control position="topleft">
          <div class="pa-1 map-action-buttons">
            <MapSearch />

            <div v-if="user.settings.map_zoom_buttons_visible">
              <div class="d-flex">
                <v-tooltip right>
                  <template #activator="{ on }">
                    <v-btn
                      fab
                      ripple
                      height="36"
                      width="36"
                      class="mt-3"
                      v-on="on"
                      @click.stop="map.setZoom(map.getZoom() + 1)"
                    >
                      <v-icon medium> mdi-plus </v-icon>
                    </v-btn>
                  </template>
                  <span> {{ $t("zoom-in") }} </span>
                </v-tooltip>
              </div>

              <div class="d-flex">
                <v-tooltip right>
                  <template #activator="{ on }">
                    <v-btn
                      fab
                      ripple
                      height="36"
                      width="36"
                      class="mt-3"
                      v-on="on"
                      @click.stop="map.setZoom(map.getZoom() - 1)"
                    >
                      <v-icon medium> mdi-minus </v-icon>
                    </v-btn>
                  </template>
                  <span> {{ $t("zoom-out") }} </span>
                </v-tooltip>
              </div>
            </div>

            <div class="div-spacer" />

            <ZoomToCoords v-if="!$vuetify.breakpoint.mobile" :map="map" />

            <FileLoaderControl
              :map="map"
              :files="loadedFiles"
              @loading="isLoading()"
              @loads="loaded()"
            />
          </div>
        </l-control>

        <l-control class="leaflet-coordinates-control" position="bottomleft">
        </l-control>

        <l-control-scale position="bottomleft" />

        <l-geo-json
          ref="interestArea"
          :geojson="interestArea"
          :options-style="interestStyle"
          :visible="showInterestArea"
        />

        <SupportLayers />

        <BaseWmsMetadataPopup :map="map" />
      </l-map>

      <div v-if="mapLoading" class="loading-background">
        <div>
          <v-skeleton-loader type="chip" width="32"></v-skeleton-loader>
          <v-skeleton-loader type="chip" width="32"></v-skeleton-loader>
          <v-skeleton-loader type="chip" width="32"></v-skeleton-loader>
        </div>
      </div>
    </client-only>
  </div>
</template>

<i18n>
{
    "en": {
        "zoom-in": "Zoom in",
        "zoom-out": "Zoom out"
    },
    "pt-br": {
        "zoom-in": "Aproximar",
        "zoom-out": "Reduzir"
    }
}
</i18n>

<script>
import { mapState, mapMutations } from "vuex";
import interestArea from "@/assets/interest_area.json";

// import MapSearch from '@/components/map/MapSearch.vue'
// import ZoomToCoords from '@/components/map/ZoomToCoords.vue'
import FileLoaderLayers from "@/components/map/file-loader/FileLoaderLayers.vue";
import SupportLayers from "@/components/support/SupportLayers";
import BaseWmsMetadataPopup from "@/components/base/BaseWmsMetadataPopup";
import "leaflet/dist/leaflet.css";
import "leaflet-basemaps/L.Control.Basemaps.css";
import "leaflet-minimap/dist/Control.MiniMap.min.css";

if (typeof window !== "undefined") {
  require("leaflet-bing-layer");
  require("leaflet-basemaps");
  require("leaflet-minimap");
}

export default {
  name: "Map",

  components: {
    SupportLayers,
    // MapSearch,
    // ZoomToCoords,
    FileLoaderLayers,
    BaseWmsMetadataPopup,
  },

  data: () => ({
    map: null,
    zoom: 4,
    minZoom: 2,
    maxBounds: [
      [-90, -280],
      [90, 280],
    ],
    mapOptions: {
      zoomControl: false,
    },
    initialBounds: [
      [-33.8689056, -73.9830625],
      [5.2842873, -28.6341164],
    ],

    loadedFiles: [],
    mapLoading: false,

    interestArea,
    showInterestArea: process.env.INTEREST_AREA_OUTLINE === "true",
    interestStyle: {
      fillOpacity: 0,
      fill: false,
      color: "#fcd40d",
      dashArray: "5",
    },

    showImagery: process.env.IMAGERY === "true",
    monitoringGeoserver: process.env.MONITORING_GEOSERVER === "true",

    baseLayers: [
      {
        url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
        options: {
          label: "Open Street Map",
          tag: "OSM",
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
          maxZoom: 21,
          maxNativeZoom: 18,
          zIndex: 1,
        },
      },
      {
        url: "//{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
        options: {
          label: "Google Satellite",
          tag: "Google Satellite",
          attribution:
            'Map data &copy; <a href="https://maps.google.com/">Google</a> sattelite imagery',
          maxZoom: 21,
          maxNativeZoom: 19,
          subdomains: ["mt0", "mt1", "mt2", "mt3"],
          zIndex: 1,
        },
      },
      {
        url: "http://mt0.google.com/vt/lyrs=r&hl=en&x={x}&y={y}&z={z}",
        options: {
          label: "Google Roadmap",
          tag: "Google Roadmap",
          attribution:
            'Map data &copy; <a href="https://maps.google.com/">Google</a> Altered roadmap',
          maxZoom: 21,
          maxNativeZoom: 19,
          subdomains: ["mt0", "mt1", "mt2", "mt3"],
          zIndex: 1,
        },
      },
      {
        url: "http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}",
        options: {
          label: "Google Hybrid",
          tag: "Google Hybrid",
          attribution:
            'Map data &copy; <a href="https://maps.google.com/">Google</a> Hybrid',
          maxZoom: 21,
          maxNativeZoom: 19,
          subdomains: ["mt0", "mt1", "mt2", "mt3"],
          zIndex: 1,
        },
      },
      {
        url: "//{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        options: {
          label: "CartoDB",
          tag: "CartoDB",
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, CartoDB Imagery <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
          maxZoom: 21,
          maxNativeZoom: 19,
          zIndex: 1,
        },
      },
      {
        url: "https://view.geoapi-airbusds.com/maps/wmts/52a994d7-f215-4c66-aa10-439221c29ee0/tile/1.0.0/8659bd97-ea52-474d-a3e9-072c335cd6bb/default/3857/{z}/{y}/{x}",
        options: {
          label: "AirBus OneAtlas",
          tag: "AirBus OneAtlas",
          attribution:
            'GeoAPI Airbus Service; Powered by: <a href="https://oneatlas.airbus.com/">OneAtlas - AIRBUS</a>',
          maxZoom: 21,
          maxNativeZoom: 14,
          zIndex: 1,
        },
      },
      {
        url: "https://view.geoapi-airbusds.com/maps/wmts/eebb802c-9605-475f-8830-b7c00107cdc8/tile/1.0.0/61476829-d968-4588-821c-b0f9fae6ff8c/default/3857/{z}/{y}/{x}.png",
        options: {
          label: "AirBus WorldDEM",
          tag: "AirBus WorldDEM",
          attribution:
            'GeoAPI Airbus Service; Powered by: <a href="https://oneatlas.airbus.com/">OneAtlas - AIRBUS</a>',
          maxZoom: 21,
          maxNativeZoom: 14,
          zIndex: 1,
        },
      },
      {
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        options: {
          label: "ArcMap",
          tag: "ArcMap",
          attribution:
            'Map data &copy; <a href="https://desktop.arcgis.com/en/arcmap/">ArcGis Basemap</a>',
          maxZoom: 21,
          maxNativeZoom: 19,
          zIndex: 1,
        },
      },
      {
        url: "https://tiles.planet.com/basemaps/v1/planet-tiles/planet_medres_visual_2020-10_mosaic/gmap/{z}/{x}/{y}.png?api_key=57cd3a8c44024cfdb7446ac37d8d1fe9",
        options: {
          label: "Planet - Out/2020",
          tag: "Planet - Out/2020",
          attribution:
            'Map data &copy; <a href="https://www.planet.com/">Planet</a>',
          maxZoom: 21,
          maxNativeZoom: 15,
          zIndex: 1,
        },
      },
    ],
    bingKey: "AuhiCJHlGzhg93IqUH_oCpl_-ZUrIE6SPftlyGYUvr9Amx5nzA-WqGcPquyFZl4L",

    lastZoom: null,
    zoomControlGrid: 7,

    tooltipsRef: null,
    tooltipsGridRef: null,
    cursorCoordinates: {
      lat: "",
      lng: "",
    },
    miniMap: null,
    miniMapLayer: null,
    miniMapLayerOptions: {
      minZoom: 0,
      maxZoom: 18,
    },
    localBounds: [],
  }),

  computed: {
    ...mapState("map", ["bounds", "boundsZoomed"]),
  },

  watch: {
    boundsZoomed() {
      this.map.flyToBounds(this.bounds);
    },

    minimapVisibleSettings(visible) {
      visible ? this.miniMap.addTo(this.map) : this.miniMap.remove();
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.createMap();
    });
  },

  methods: {
    isLoading() {
      this.mapLoading = true;
    },
    loaded() {
      this.mapLoading = false;
    },
    createMap() {
      this.map = this.$refs.map.mapObject;
      this.map.on("zoomend", this.onZoomEnd);
      this.map.addEventListener("mousemove", this.refreshCoordinates);

      this.createMapLayers();
      this.createCssRefs();

      this.$emit("mapCreated");
    },

    createMapLayers() {
      const tileLayers = [];
      for (const layer of this.baseLayers) {
        const tileLayer = this.$L.tileLayer(layer.url, layer.options);

        tileLayers.push(tileLayer);
      }

      const bingLayer = this.createBingLayer();
      tileLayers.push(bingLayer);

      this.map.addControl(
        this.$L.control.basemaps({
          basemaps: tileLayers,
          tileX: 0,
          tileY: 0,
          tileZ: 1,
        })
      );
    },

    createBingLayer() {
      const bingLayer = this.$L.tileLayer.bing(this.bingKey, {
        imagerySet: "AerialWithLabelsOnDemand",
        maxZoom: 21,
        maxNativeZoom: 16,
      });
      bingLayer.options.attribution = "Map data &copy; Bing contributors";
      bingLayer.options.iconURL = "/img/bing.png";
      bingLayer.options.label = "Bing";
      bingLayer.options.tag = "Bing";

      return bingLayer;
    },

    createMiniMap() {
      const osm = this.baseLayers[0];

      const miniMapLayer = this.$L.tileLayer(osm.url, this.miniMapLayerOptions);

      this.miniMap = new this.$L.Control.MiniMap(
        miniMapLayer,
        this.miniMapOptions
      );

      if (this.minimapVisibleSettings) {
        this.miniMap.addTo(this.map);
      }
    },

    createCssRefs() {
      this.tooltipsRef = this.map.getPane("tooltipPane");
      this.tooltipsRef.style.visibility = "hidden";
    },

    onZoomEnd(event) {
      const map = event.target;
      const zoom = map.getZoom();

      if (
        zoom < this.zoomControlGrid &&
        (!this.lastZoom || this.lastZoom >= this.zoomControlGrid)
      ) {
        this.tooltipsRef.style.visibility = "hidden";
      } else if (
        zoom >= this.zoomControlGrid &&
        (!this.lastZoom || this.lastZoom < this.zoomControlGrid)
      ) {
        this.tooltipsRef.style.visibility = "visible";
      }

      this.lastZoom = zoom;
    },

    updateBounds(latLngBounds) {
      this.setBounds(latLngBounds);
    },

    refreshCoordinates(event) {
      this.cursorCoordinates.lat = event.latlng.lat.toFixed(4);
      this.cursorCoordinates.lng = event.latlng.lng.toFixed(4);
    },

    ...mapMutations("map", ["setBounds"]),
  },
};
</script>

<style lang="sass">
.map-action-buttons
    z-index: 4
    opacity: 0.84

    .v-icon
        font-size: 18px !important

.leaflet-tooltip-right:before,
.leaflet-tooltip-left:before
    right: 0
    left: 0
    margin-left: 0px
    border-right-color: transparent !important
    border-left-color: transparent !important

.leaflet-container
    font-family: 'Roboto', sans-serif !important
    line-height: 1.5 !important

.card-popup
    .leaflet-popup-content
        margin: 0px

    .leaflet-popup-scrolled
        border: none

.leaflet-popup-content-wrapper
    padding: 0px
    border: 0px !important
    border-radius: 4px !important
    box-shadow: none
    -webkit-box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12) !important
    box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12) !important

.leaflet-coordinates-control
    background: rgba(255, 255, 255, 0.7)
    padding: 0 5px
    font-size: 11px
    color: #333
    margin-left: 0 !important
    margin-bottom: 0 !important

.leaflet-logo-control
    margin-left: 6px !important
    margin-bottom: 15px

.basemap.active
    border: 0

.loading-background
    position: absolute
    top: 0px
    left: 0px
    height: 100%
    width: 100%
    background-color: rgba(245, 245, 245, 0.4)
    z-index: 3
    display: flex
    align-items: center
    justify-content: center

    div
        display: flex
        align-items: center
        justify-content: space-around
        width: 140px
.div-spacer
    height: 20px
</style>
