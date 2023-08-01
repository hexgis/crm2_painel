<template>
  <v-list-group append-icon="">
    <template #activator>
      <v-list-item-avatar
        v-if="
          (layer.layer_type == 'wms' && layer.wms.has_preview) ||
            layer.layer_type == 'tms'
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
            {{ layer.name }} ({{ layer.length }})
          </span>
        </v-list-item-title>
      </v-list-item-content>
      <v-list-item-action @click.stop="">
        <v-switch
          :input-value="layer.visible"
          @change="toggleLayer(layer, groupId)"
        />
      </v-list-item-action>
    </template>
    <v-container class="py-0">
      <v-row
        v-if="
          layer.layer_type === 'wms' &&
            layer.visible &&
            layer.wms.has_opacity
        "
        class="black--text text--lighten-2"
        align="center"
      >
        <v-col cols="4">
          Opacidade
        </v-col>
        <v-col cols="8">
          <v-slider
            :value="layer.opacity"
            class="mb-n4"
            thumb-label
            @input="updateLayerOpacity(layer, groupId, $event)"
          />
        </v-col>
      </v-row>
      <v-row v-if="layer.layer_type === 'wms' && layer.wms.has_detail ">
        <v-col cols="12">
          <v-img
            contain
            :src="layerPreview"
            :lazy-src="layerPreview"
            :max-width="layer.wms.detail_width"
            position="center center"
          />
        </v-col>
      </v-row>
      <v-row
        v-if="layer.is_downloadable"
        justify="space-around"
        align="center"
        no-gutters
      >
        <v-col>
          <div class="down pb-2">
            <DownloadLayer
              :layer="layer"
              class="mb-2"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-list-group>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

import tmsLegend from '../../assets/tmsLegend.png';
import DownloadLayer from './DownloadLayer.vue';

export default {
  components: { DownloadLayer },
  props: {
    layer: {
      type: Object,
      required: true,
    },
    groupId: {
      type: Number,
      required: true,
    },
  },
  computed: {
    layerPreview() {
      if (this.layer.layer_type === 'tms') return tmsLegend;
      return (
        this.layer.wms.geoserver.preview_url
                    + this.layer.wms.geoserver_layer_name
      );
    },
    ...mapState('searchInArea', ['resultLayers']),
  },

  methods: {
    toggleLayer(layer, groupId) {
      this.setVisibility({
        groupId,
        layerId: layer.id,
        visible: !layer.visible,
      });
    },

    updateLayerOpacity(layer, groupId, opacity) {
      this.setOpacity({
        groupId,
        layerId: layer.id,
        opacity,
      });
    },
    ...mapMutations('searchInArea', ['setVisibility', 'setOpacity']),
  },
};
</script>
