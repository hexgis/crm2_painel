<template>
  <v-list-group v-if="group">
    <template #activator>
      <v-row>
        <v-list-item-content>
          <v-row>
            <v-list-item-title class="text-wrap">
              <span class="text-cursor">
                {{ group.name }}
              </span>
            </v-list-item-title>

            <v-tooltip v-if="group.pk == 5">
              <template #activator="{ on }">
                <v-icon
                  class="mr-2 ml-2"
                  v-on="on"
                >
                  mdi-information
                </v-icon>
              </template>
              <span>
                O Monitoramento é baseado na interpretação
                <br>
                visual do Landsat-8 com intervalo de 32 dias.
                <br>
                As detecções do monitoramento são contempladas
                <br>
                a partir de 30 de agosto de 2015 (variável por órbita-ponto).
              </span>
            </v-tooltip>
          </v-row>
        </v-list-item-content>
      </v-row>
    </template>

    <v-container class="py-0">
      <v-list expand>
        <template v-for="layer in orderedSupportLayers">
          <SupportLayersGroupItem
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

import SupportLayersGroupItem from '@/components/support/SupportLayersGroupItem';

export default {
  name: 'SupportLayersGroupBase',

  components: { SupportLayersGroupItem },

  props: {
    group: {
      type: Object,
      default: null,
    },
  },

  computed: {
    supportLayers() {
      return this.supportCategoryGroupsBase[this.group.id].layers;
    },

    orderedSupportLayers() {
      return _.sortBy(this.supportLayers, 'order');
    },

    ...mapState('supportLayers', ['supportCategoryGroupsBase']),
  },
};
</script>
