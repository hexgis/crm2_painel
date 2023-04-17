<template>
  <v-list-group
    v-if="layer"
    v-model="isOpen"
    append-icon=""
    active-class="active"
    :disabled="
      !(
        layer.layer_type === 'wms' &&
        (layer.visible || layer.wms.has_detail)
      )
    "
  >
    <template #activator>
      <v-list-item-avatar
        v-if="
          !hidePreview &&
            ((layer.layer_type == 'wms' && layer.wms.has_preview) ||
              layer.layer_type == 'tms')
        "
        tile
        size="40"
      >
        <v-img
          :src="layerPreview"
          :lazy-src="layerPreview"
        />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-wrap">
          <span class="text-cursor">
            {{ layer.name }}
          </span>
        </v-list-item-title>
      </v-list-item-content>

    </template>

    <v-container class="py-0">
      <SupportLayerFiltersProdes :layer="layer" />

      <v-row
        v-if="
          layer.layer_type === 'wms' &&
            layer.visible &&
            layer.wms.has_opacity
        "
        class="black--text text--lighten-2"
        align="center"
      />

      <v-row
        v-if="layer.layer_type === 'wms' && layer.wms.has_detail"
        justify="center"
        class=""
      >
        <v-col>
          <v-img
            contain
            :src="layerPreview"
            :lazy-src="layerPreview"
            :max-width="layer.wms.detail_width"
            position="center center"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-list-group>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import tmsLegend from '@/assets/tmsLegend.png';

import SupportLayerFiltersProdes from '@/components/support/SupportLayerFiltersProdes';

export default {
  name: 'SupportLayersGroupItemProdes',

  components: { SupportLayerFiltersProdes },

  props: {
    layerId: {
      type: Number,
      required: true,
    },

    hidePreview: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    isOpen: true,
  }),

  computed: {
    ...mapState('supportLayers', ['supportLayersCategoryProdes']),

    layer() {
      return this.supportLayersCategoryProdes[this.layerId] || null;
    },

    layerPreview() {
      if (this.layer.layer_type === 'tms') return tmsLegend;

      return (
        this.layer.wms.geoserver.preview_url
                + this.layer.wms.geoserver_layer_name
      );
    },

    disabledHeatmap() {
      return (
        this.layer.layer_filters.length > 0
                && this.layer.layer_type === 'heatmap'
                && Object.keys(this.layer.filters).length === 0
                && !this.layer.loading
      );
    },
  },

  methods: {
    toggleLayer() {
      this.toggleLayerVisibilityProdes({
        id: this.layerId,
        visible: !this.layer.visible,
      });

      this.isOpen = this.layer.visible;
    },

    updateLayerOpacity(opacity) {
      this.setLayerOpacityProdes({
        id: this.layerId,
        opacity,
      });
    },

    ...mapMutations('supportLayers', [
      'toggleLayerVisibilityProdes',
      'setLayerOpacityProdes',
    ]),
  },
};
</script>

<style lang="sass">
.v-list-group--active
    border-bottom: solid 0px black !important
    border-top: solid 0px black !important
</style>
