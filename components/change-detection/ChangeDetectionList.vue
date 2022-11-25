<template>
  <div>
    <template v-for="(detection, i) in changeDetections">
      <v-hover :key="i">
        <template #default="{ hover }">
          <ChangeDetectionListItem
            :detection="detection"
            :index="i"
            :hover="hover"
          />
        </template>
      </v-hover>
      <v-divider :key="i + '_divider'" />
    </template>

    <!-- <v-row class="mx-0">
            <v-col>
                <v-pagination
                    v-model="page"
                    color="primary"
                    :length="paginationLength"
                    total-visible="5"
                    @input="reloadChangeDetections"
                />
            </v-col>
        </v-row> -->
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import ChangeDetectionListItem from './ChangeDetectionListItem';

export default {
  name: 'CatalogSceneList',

  components: {
    ChangeDetectionListItem,
  },

  data: () => ({
    page: 1,
  }),

  computed: {
    ...mapState('change-detection', [
      'changeDetections',
      'changeDetectionsCount',
      'changeDetectionsPerPage',
    ]),

    paginationLength() {
      return Math.ceil(
        this.changeDetectionsCount / this.changeDetectionsPerPage,
      );
    },
  },

  watch: {
    changeDetectionsCount() {
      this.page = 1;
    },
  },

  methods: {
    reloadChangeDetections() {
      this.changeDetectionsPage(this.page);
    },

    ...mapActions('change-detection', ['changeDetectionsPage']),
  },
};
</script>
