<template>
  <div>
    <v-row
      v-if="isHighResSatellite"
      class="mx-0 py-3"
    >
      <v-col class="d-flex align-center">
        <v-select
          v-model="sortKey"
          :label="$t('sort-label')"
          :items="sortOptions"
          item-text="name"
          item-value="id"
          outlined
          dense
          prepend-icon="mdi-filter-variant"
          hide-details
          @change="sortScenes"
        />
        <v-btn-toggle
          v-model="sortDirection"
          mandatory
          class="ml-4"
          color="primary"
          @change="sortScenes"
        >
          <v-btn
            color="white"
            value=""
          >
            <v-icon>mdi-arrow-up</v-icon>
          </v-btn>

          <v-btn
            color="white"
            value="-"
          >
            <v-icon>mdi-arrow-down</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <p
      v-else
      class="text-caption text-right text--secondary mr-2 mt-2 mb-1"
    >
      {{ sceneCount }} {{ $t('results') }}
    </p>
    <v-divider />

    <v-list
      expand
      class="pt-0"
    >
      <template v-for="(scene, i) in scenes">
        <v-list-group
          :key="`${page}_${i}`"
          append-icon=""
          class="no-padding"
          @mouseenter="setHoveredScene(i)"
          @mouseleave="setHoveredScene(null)"
        >
          <template #activator>
            <v-hover :key="i">
              <template #default="{ hover }">
                <ImagerySceneListItemCard
                  :scene="scene"
                  :index="i"
                  :hover="hover || hoveredGridScene === i"
                  @selectScene="
                    setSelectedScene(scene.properties)
                  "
                />
              </template>
            </v-hover>
          </template>

          <template v-if="!isHighResSatellite">
            <v-divider />
            <ImagerySceneImages
              :scene="scene"
              :index="i"
            />
          </template>
        </v-list-group>

        <v-divider :key="i + '_divider'" />
      </template>
    </v-list>

    <v-row
      v-if="satellite && satellite.agency !== 'HEAD'"
      class="mx-0"
    >
      <v-col>
        <v-pagination
          v-model="page"
          color="primary"
          :length="paginationLength"
          total-visible="5"
          @input="reloadScenes"
        />
      </v-col>
    </v-row>

    <BaseMetadataModal
      v-if="selectedScene"
      :feature="selectedScene"
      :img-src="selectedScene.preview || ''"
      :exclude-props="['preview', 'images']"
      @onDialogClose="selectedScene = null"
    />
  </div>
</template>

<i18n>
{
    "en": {
        "results": "results",
        "sort-label": "Sort by",
        "date-label": "Date",
        "cloud-label": "Cloud cover"
    },
    "pt-br": {
        "results": "resultados",
        "sort-label": "Ordenar por",
        "date-label": "Data",
        "cloud-label": "Taxa de nuvens"
    }
}
</i18n>

<script>
import {
  mapState, mapGetters, mapMutations, mapActions,
} from 'vuex';

import BaseMetadataModal from '@/components/base/BaseMetadataModal';
import ImagerySceneImages from './ImagerySceneImages';
import ImagerySceneListItem from './ImagerySceneListItem';
import ImagerySceneListItemActions from './ImagerySceneListItemActions';
import ImagerySceneListItemCard from './ImagerySceneListItemCard';

export default {
  name: 'ImagerySceneList',

  components: {
    BaseMetadataModal,
    ImagerySceneImages,
    ImagerySceneListItem,
    ImagerySceneListItemActions,
    ImagerySceneListItemCard,
  },

  data: () => ({
    selectedScene: null,
    sortKey: 'acquisitionDate',
    sortDirection: '-',
    style: {
      hover: 'hover-grid-scene',
      default: '',
    },
  }),

  computed: {
    sortOptions() {
      return [
        { name: this.$t('date-label'), id: 'acquisitionDate' },
        { name: this.$t('cloud-label'), id: 'cloudCover' },
      ];
    },

    page: {
      get() {
        return this.$store.state.imagery.page;
      },
      set(val) {
        this.$store.commit('imagery/setPage', val);
      },
    },

    paginationLength() {
      return Math.ceil(this.sceneCount / this.scenesPerPage);
    },

    ...mapState('imagery', [
      'scenes',
      'sceneCount',
      'scenesPerPage',
      'satellite',
      'hoveredGridScene',
    ]),

    ...mapGetters('imagery', ['isHighResSatellite']),
  },

  methods: {
    setSelectedScene(sceneProp) {
      this.selectedScene = sceneProp;
    },

    reloadScenes() {
      this.changePage();
    },

    sortScenes() {
      const sortKey = (this.sortDirection ? this.sortDirection : '') + this.sortKey;
      this.setFilters({ sortKey });
      this.changePage();
    },

    ...mapMutations('imagery', ['setFilters', 'setHoveredScene']),
    ...mapActions('imagery', ['changePage']),
  },
};
</script>

<style lang="sass">
.no-padding
    > .v-list-item
        padding: 0 !important
</style>
