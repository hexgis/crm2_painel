<template>
  <l-map style="height: 100%" :zoom="zoom" :center="center">
    <l-control-layers position="topleft"></l-control-layers>
    <l-tile-layer
      v-for="tileProvider in tileProviders"
      :key="tileProvider.name"
      :name="tileProvider.name"
      :visible="tileProvider.visible"
      :url="tileProvider.url"
      :attribution="tileProvider.attribution"
      layer-type="base"
    />
    <l-control>
      <SupportLayers />
    </l-control>
  </l-map>
</template>

<script>
import { LMap, LTileLayer, LControlLayers } from "vue2-leaflet";
import SupportLayers from "@/components/support/SupportLayers.vue";
import MonitoringLayers from "@/components/monitoring/MonitoringLayers.vue";

export default {
  components: {
    LMap,
    LTileLayer,
    LControlLayers,
    SupportLayers,
    MonitoringLayers
  },
  data() {
    return {
      zoom: 8,
      center: [47.31322, -1.319482],
      tileProviders: [
        {
          name: "OpenStreetMap",
          visible: true,
          attribution:
            '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        },
        {
          name: "OpenTopoMap",
          visible: false,
          url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
          attribution:
            'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
        },
        {
          name: "Google Satellite",
          url: "//{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
          visible: false,
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
          name: "Google Roadmap",
          url: "http://mt0.google.com/vt/lyrs=r&hl=en&x={x}&y={y}&z={z}",
          visible: false,
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
          name: "Google Hybrid",
          url: "http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}",
          visible: false,
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
          name: "CartoDB",
          url: "//{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
          visible: false,
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
          name: "AirBus OneAtlas",
          url: "https://view.geoapi-airbusds.com/maps/wmts/52a994d7-f215-4c66-aa10-439221c29ee0/tile/1.0.0/8659bd97-ea52-474d-a3e9-072c335cd6bb/default/3857/{z}/{y}/{x}",
          visible: false,
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
          name: "AirBus WorldDEM",
          url: "https://view.geoapi-airbusds.com/maps/wmts/eebb802c-9605-475f-8830-b7c00107cdc8/tile/1.0.0/61476829-d968-4588-821c-b0f9fae6ff8c/default/3857/{z}/{y}/{x}.png",
          visible: false,
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
          name: "ArcMap",
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          visible: false,
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
          name: "Planet - Out/2020",
          url: "https://tiles.planet.com/basemaps/v1/planet-tiles/planet_medres_visual_2020-10_mosaic/gmap/{z}/{x}/{y}.png?api_key=57cd3a8c44024cfdb7446ac37d8d1fe9",
          visible: false,
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
    };
  },
};
</script>
