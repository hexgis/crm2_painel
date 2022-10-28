<template>
  <v-card
    :key="index"
    ref="cards"
    tile
    outlined
    width="100%"
    :color="hover ? 'grey lighten-4' : 'transparent'"
    @mouseenter="setHoveredScene(index)"
    @mouseleave="setHoveredScene(null)"
  >
    <ImagerySceneListItem
      :scene="scene"
      :index="index"
    />

    <v-divider />

    <ImagerySceneListItemActions
      :scene="scene"
      :index="index"
      @openDetails="$emit('selectScene')"
    />
  </v-card>
</template>

<script>
import { mapMutations } from 'vuex';

import ImagerySceneListItem from './ImagerySceneListItem';
import ImagerySceneListItemActions from './ImagerySceneListItemActions';

export default {
  components: {
    ImagerySceneListItem,
    ImagerySceneListItemActions,
  },
  props: {
    scene: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    hover: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    ...mapMutations('imagery', ['setHoveredScene']),
  },
};
</script>
