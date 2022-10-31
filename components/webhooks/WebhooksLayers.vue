<template>
  <l-feature-group
    ref="points"
    name="points"
    :visible="showFeatures"
  >
    <v-marker-cluster>
      <l-circle-marker
        v-for="(point, i) in points"
        :key="i"
        :lat-lng="point"
        color="#b30000"
        fill-color="#b30000"
        :weight="1"
      />
    </v-marker-cluster>
  </l-feature-group>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'WebhooksLayers',

  computed: {
    ...mapState('webhooks', ['points', 'showFeatures']),
  },
};
</script>
