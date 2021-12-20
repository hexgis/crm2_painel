<template>
  <l-map style="height: 1000px" :zoom="zoom" :center="center" :options="{zoomControl: false}">
    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    <MapSearch/>
    <l-marker :lat-lng="markerLatLng"></l-marker>
    <l-control-zoom position="bottomright"  ></l-control-zoom>
  </l-map>
</template>

<script>
import {LMap, LTileLayer, LMarker, LControlZoom} from 'vue2-leaflet';
import 'leaflet-minimap/dist/Control.MiniMap.min.css'

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LControlZoom,
  },
  data () {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 15,
      center: [-15.7801, -47.9292],
      markerLatLng: [-15.7801, -47.9292]
    };
  }
}



</script>