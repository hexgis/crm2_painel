<template>
  <div>
    <p class="text-caption text-right text--secondary mr-2 mt-2 mb-1">
      {{ sceneCount }} {{ $t('results') }}
    </p>
    <v-divider />
    <template v-for="(scene, i) in scenes">
      <v-hover :key="i">
        <template #default="{ hover }">
          <CatalogSceneListItem
            :scene="scene"
            :index="i"
            :hover="hover || hoveredGridScene === i"
            @openMetadata="openMetadata(scene)"
          />
        </template>
      </v-hover>
      <v-divider :key="i + '_divider'" />
    </template>

    <v-row class="mx-0">
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
      :title="$t('modal-title')"
      :feature="selectedScene"
      :img-src="selectedScene.preview"
      :exclude-props="['image_path', 'preview']"
      @onDialogClose="selectedScene = null"
    />
  </div>
</template>

<i18n>
{
    "en": {
        "results": "results",
        "modal-title": "Image metadata"
    },
    "pt-br": {
        "results": "resultados",
        "modal-title": "Metadados da imagem"
    }
}
</i18n>

<script>
import { mapState, mapActions } from 'vuex';

import BaseMetadataModal from '@/components/base/BaseMetadataModal';
import CatalogSceneListItem from './CatalogSceneListItem';

export default {
  name: 'CatalogSceneList',

  components: {
    BaseMetadataModal,
    CatalogSceneListItem,
  },

  data: () => ({
    selectedScene: null,
  }),

  computed: {
    page: {
      get() {
        return this.$store.state.catalog.page;
      },
      set(val) {
        this.$store.commit('catalog/setPage', val);
      },
    },

    paginationLength() {
      return Math.ceil(this.sceneCount / this.scenesPerPage);
    },

    ...mapState('catalog', [
      'scenes',
      'sceneCount',
      'scenesPerPage',
      'hoveredGridScene',
    ]),
  },

  methods: {
    openMetadata(scene) {
      this.selectedScene = {
        ...scene.properties,
        cloud_cover: scene.properties.cloud_cover
          ? scene.properties.cloud_cover
          : 'Indisponível',
      };
    },

    reloadScenes() {
      this.changeScenePage();
    },

    ...mapActions('catalog', ['changeScenePage']),
  },
};
</script>
