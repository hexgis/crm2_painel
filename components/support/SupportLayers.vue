<template>
  <l-layer-group
    name="supportLayers"
    :visible="showFeaturesSupportLayers"
  >
    <template v-for="layer in supportLayers">
      <SupportLayerItem
        :key="layer.id"
        :layer="layer"
      />
    </template>
    <template v-for="layer in supportLayersCategoryFire">
      <SupportLayerItem
        :key="layer.id"
        :layer="layer"
      />
    </template>
    <template v-for="layer in supportLayersCategoryRaster">
      <SupportLayerItem
        :key="layer.id"
        :layer="layer"
      />
    </template>
    <template v-for="layer in supportLayersCategoryProdes">
      <SupportLayerItem
        :key="layer.id"
        :layer="layer"
      />
    </template>
    <template v-for="layer in supportLayersCategoryAntropismo">
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
  name: 'SupportLayers',

  components: {
    SupportLayerItem,
  },

  computed: mapState('supportLayers', [
    'supportLayers',
    'showFeaturesSupportLayers',
    'supportLayersCategoryFire',
    'supportLayersCategoryRaster',
    'supportLayersCategoryProdes',
    'supportLayersCategoryAntropismo',
  ]),
};
</script>
