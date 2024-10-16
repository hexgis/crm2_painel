<template>
  <div>
    <v-row v-if="isActiveLayer" no-gutters align="center" class="image-container">
      <v-icon
        v-if="!layers.wms"
        :color="layers.properties?.color || layers.color"
        class="layer-thumbnail">
        mdi-square
      </v-icon>
      <img
        v-else-if="vectorImage(layers)"
        :src="`data:image/png;base64,${vectorImage(layers)}`"
        class="layer-thumbnail"
        alt="CorLayer">
      <img v-else
        :src="layers.wms.geoserver.preview_url + layers.wms.geoserver_layer_name"
        :class="prodes ? 'prodes-thumbnail' : 'layer-thumbnail'"
        alt="Layer Image" />
      <v-col>
        <p class="ml-1">{{ layers.name }}</p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    layers: {
      type: [Array, Object],
      required: true
    },
    monitoring: {
      type: Boolean
    },
    prodes: {
      type: Boolean
    }
  },
  computed: {
    isActiveLayer() {
      if (this.monitoring) {
        return true
      }
      return this.layers.visible || this.layers.active;
    },
  },
  methods: {
    vectorImage(layers) {
      return layers.vector?.thumbnail_blob || layers.vector?.image;
    }
  }
}
</script>

<style scoped lang="sass">
.layer-thumbnail
  width: 24px
  height: 24px

.prodes-thumbnail
  width: 30px
  height: auto
  margin-left: 5px

p
  font-size: xx-small
  margin: 0

.image-container
    width: 100%

.row
  margin: 0!important
</style>
