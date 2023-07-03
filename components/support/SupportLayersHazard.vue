<template>
  <l-layer-group
    name="supportLayersHazard"
    :visible="showFeaturesSupportLayersHazard"
  >
    <template v-for="layer in supportLayersCategoryFire">
      <SupportLayerItem
        :key="layer.id"
        :layer="layer"
      />
    </template>
  </l-layer-group>
</template>

<script>
import { mapState } from 'vuex';

import SupportLayerItem from './SupportLayerItem';

export default {
  name: 'SupportLayersHazard',

  components: {
    SupportLayerItem,
  },

  computed: mapState('supportLayers', [
    'supportLayers',
    'showFeaturesSupportLayersHazard',
    'supportLayersCategoryFire',
  ]),
};
</script>
