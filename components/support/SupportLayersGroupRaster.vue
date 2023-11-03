<template>
  <v-list-group v-if="group">
    <template #activator>
      <v-list-item-content>
        <v-list-item-title class="text-wrap">
          <span class="text-cursor">
            {{ group.name }}
          </span>
        </v-list-item-title>
      </v-list-item-content>
      <v-col v-if="group.name == 'Alta Resolução'">
        <div>
          <v-tooltip>
            <template #activator="{ on }">
              <v-icon

                v-on="on"
              >
                mdi-information
              </v-icon>
            </template>
            <span>
              O mosaico de imagens de alta resolução
              <br>
              é formado por imagens dos satélites Spot 6 e 7,
              <br>
              com uma resolução espacial de 1,5 metros,
              <br>
              abrangendo datas entre os anos de 2018 e 2019.
              <br>
            </span>
          </v-tooltip>
        </div>
      </v-col>
    </template>

    <v-container class="py-0">
      <v-list expand>
        <template v-for="layer in orderedSupportLayers">
          <SupportLayersGroupItemRaster
            :key="layer"
            :layer-id="layer"
          />
        </template>
      </v-list>
    </v-container>

    <v-divider />
  </v-list-group>
</template>

<script>
import { mapState } from 'vuex';
import _ from 'lodash';

import SupportLayersGroupItemRaster from '@/components/support/SupportLayersGroupItemRaster';

export default {
  name: 'SupportLayersGroupRaster',

  components: { SupportLayersGroupItemRaster },

  props: {
    group: {
      type: Object,
      default: null,
    },
  },

  computed: {
    supportLayers() {
      return this.supportCategoryGroupsRaster[this.group.id].layers;
    },

    orderedSupportLayers() {
      return _.sortBy(this.supportLayers, 'order');
    },

    ...mapState('supportLayers', ['supportCategoryGroupsRaster']),
  },
};
</script>
