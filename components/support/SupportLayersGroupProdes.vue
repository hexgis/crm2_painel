<template>
    <v-container class="py-0">
        <template v-for="layer in orderedSupportLayers">
          <SupportLayersGroupItemProdes
            :key="layer"
            :layer-id="layer"
          />
        </template>
    </v-container>
</template>

<script>
import { mapState } from 'vuex';
import _ from 'lodash';

import SupportLayersGroupItemProdes from '@/components/support/SupportLayersGroupItemProdes';

export default {
  name: 'SupportLayersGroupProdes',

  components: { SupportLayersGroupItemProdes },

  props: {
    group: {
      type: Object,
      default: null,
    },
  },

  computed: {
    supportLayers() {
      return this.supportCategoryGroupsProdes[this.group.id].layers;
    },

    orderedSupportLayers() {
      return _.sortBy(this.supportLayers, 'order');
    },

    ...mapState('supportLayers', ['supportCategoryGroupsProdes']),
  },
};
</script>
