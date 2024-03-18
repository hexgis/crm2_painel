<template>
  <l-layer-group
    name="supportLayers"
    :visible="showFeaturesSupportLayers"
  >
    <template v-for="layer in supportLayers">
      <SupportLayerItem
        :key="'support_' + layer.id"
        :layer="layer"
      />
    </template>
    <template v-for="layer in supportLayersCategoryAntropismo">
      <SupportLayerItem
        :key="'antropismo_' + layer.id"
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
    'supportLayersCategoryAntropismo',
  ]),
};
</script>
