<template>
  <l-layer-group
    name="supportLayersProdes"
    :visible="showFeaturesSupportLayersProdes"
  >
    <template v-for="layer in supportLayersCategoryProdes">
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
  name: 'SupportLayersProdes',

  components: {
    SupportLayerItem,
  },

  computed: mapState('supportLayers', [
    'supportLayers',
    'showFeaturesSupportLayersProdes',
    'supportLayersCategoryProdes',

  ]),
};
</script>
