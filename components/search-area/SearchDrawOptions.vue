<template>
  <div class="pt-6">
    <div v-if="!loading">
      <v-row>
        <v-col class="pt-0 v-label theme--light">
          {{ $t('select-area-label') }}
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="4"
          align="center"
        >
          <v-tooltip top>
            <template #activator="{ on }">
              <v-btn
                fab
                elevation="2"
                depressed
                color="primary"
                @click="startDraw('Rectangle')"
                v-on="on"
              >
                <v-icon>mdi-checkbox-blank-outline </v-icon>
              </v-btn>
            </template>
            <span> {{ $t('rectangle-label') }} </span>
          </v-tooltip>
        </v-col>
        <v-col
          cols="4"
          align="center"
        >
          <v-tooltip top>
            <template #activator="{ on }">
              <v-btn
                fab
                elevation="2"
                depressed
                color="primary"
                @click="startDraw('Polygon')"
                v-on="on"
              >
                <v-icon>mdi-hexagon-outline </v-icon>
              </v-btn>
            </template>
            <span> {{ $t('polygon-label') }} </span>
          </v-tooltip>
        </v-col>
        <v-col
          cols="4"
          align="center"
        >
          <v-tooltip top>
            <template #activator="{ on }">
              <v-btn
                fab
                elevation="2"
                depressed
                color="primary"
                @click="startDraw('Circle')"
                v-on="on"
              >
                <v-icon>mdi-circle-outline </v-icon>
              </v-btn>
            </template>
            <span> {{ $t('circle-label') }} </span>
          </v-tooltip>
        </v-col>
      </v-row>

      <template v-if="layersGroups">
        <v-row>
          <v-col
            cols="12"
            class="pb-6"
          >
            <div>
              <treeselect
                v-model="value"
                :multiple="true"
                :options="orderGroup"
                placeholder="Select layers"
                :normalizer="normalizer"
              />
            </div>
          </v-col>

          <v-col cols="12">
            <v-btn
              block
              color="accent"
              :disabled="!hasDraw || !value"
              @click="startFilter()"
            >
              {{ $t('search-button') }}
            </v-btn>
          </v-col>
        </v-row>
      </template>
    </div>
    <div v-if="loading">
      <template v-for="i in 6">
        <v-skeleton-loader
          :key="i"
          type="text"
          class="mx-4 my-5"
        />
      </template>
    </div>
  </div>
</template>

<i18n>
{
    "en": {
        "search-button": "Search",
        "select-area-label":"Select the interest area :",
        "polygon-label": "Draw a polygon",
        "rectangle-label": "Draw a rectangle",
        "circle-label": "Draw a Circle"

    },
    "pt-br": {
        "search-button": "Pesquisar",
        "select-area-label":"Selecione a área de interesse:",
        "polygon-label": "Desenhar um poligono",
        "rectangle-label": "Desenhar um retangulo",
        "circle-label": "Desenhar um círculo"

    }
}
</i18n>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import _ from 'lodash';

export default {
  name: 'SearchDrawOptions',
  components: { Treeselect },

  data: () => ({
    value: null,
    normalizer(node) {
      return {
        id: `${node.name}_${node.id}`,
        label: node.name,
        children: node.layers,
      };
    },
  }),

  computed: {
    orderGroup() {
      return _.sortBy(this.layersGroups, 'order');
    },

    ...mapState('searchInArea', ['layersGroups', 'loading', 'hasDraw']),
  },

  created() {
    this.getGeoserverLayers();
  },

  methods: {
    startDraw(type) {
      this.setStartDraw(type);
      this.setIsDrawing(true);
    },

    startFilter() {
      this.setResultGroups(false);
      this.setSearch(this.value);
    },

    ...mapMutations('map', ['setStartDraw', 'setIsDrawing']),
    ...mapMutations('searchInArea', ['setSearch', 'setResultGroups']),
    ...mapActions('searchInArea', ['getGeoserverLayers']),
  },
};
</script>

<style lang="sass" scoped></style>
