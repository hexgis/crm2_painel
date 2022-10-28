<template>
  <v-list-group :disabled="edit">
    <template #activator>
      <v-list-item-content>
        <v-expand-transition>
          <template v-if="edit">
            <v-text-field
              v-model="data.name"
              outlined
              dense
              hide-details
            />
          </template>
        </v-expand-transition>
        <v-expand-transition>
          <template v-if="!edit">
            <span> {{ data.name }} </span>
          </template>
        </v-expand-transition>
      </v-list-item-content>
    </template>

    <v-divider />

    <v-row
      justify="space-around"
      align="center"
      class="button-row"
      no-gutters
    >
      <template v-if="edit">
        <v-col>
          <v-tooltip bottom>
            <template #activator="{ on }">
              <v-btn
                text
                block
                large
                color="grey darken-3"
                :disabled="
                  !data.layers.length && !data.catalogs.length
                "
                v-on="on"
                @click.stop="updateBookmark"
              >
                <v-icon> mdi-check </v-icon>
              </v-btn>
            </template>
            <span> {{ $t('edit-save-button') }} </span>
          </v-tooltip>
        </v-col>
        <v-col>
          <v-tooltip bottom>
            <template #activator="{ on }">
              <v-btn
                text
                block
                large
                color="grey darken-3"
                v-on="on"
                @click.stop="closeEdit"
              >
                <v-icon> mdi-close </v-icon>
              </v-btn>
            </template>
            <span> {{ $t('cancel-button') }} </span>
          </v-tooltip>
        </v-col>
      </template>

      <template v-else>
        <v-col>
          <v-tooltip bottom>
            <template #activator="{ on }">
              <v-btn
                text
                block
                large
                color="grey darken-3"
                v-on="on"
                @click.stop="zoomToBookmark()"
              >
                <v-icon> mdi-crosshairs-gps </v-icon>
              </v-btn>
            </template>
            <span> {{ $t('zoom-button') }} </span>
          </v-tooltip>
        </v-col>
        <v-col>
          <v-tooltip bottom>
            <template #activator="{ on }">
              <v-btn
                text
                block
                large
                color="grey darken-3"
                v-on="on"
                @click.stop="editBookmark()"
              >
                <v-icon> mdi-pencil </v-icon>
              </v-btn>
            </template>
            <span> {{ $t('edit-button') }} </span>
          </v-tooltip>
        </v-col>
        <v-col>
          <v-dialog
            v-model="dialog"
            width="300"
          >
            <template #activator="{ on: dialog }">
              <v-tooltip bottom>
                <template #activator="{ on: tooltip }">
                  <v-btn
                    text
                    block
                    large
                    color="grey darken-3"
                    v-on="{
                      ...dialog,
                      ...tooltip,
                    }"
                  >
                    <v-icon> mdi-delete </v-icon>
                  </v-btn>
                </template>
                <span>
                  {{ $t('remove-button') }}
                </span>
              </v-tooltip>
            </template>

            <v-card>
              <v-card-title class="headline">
                {{ $t('remove-title') }}
              </v-card-title>
              <v-card-text class="py-6">
                {{ $t('remove-text') }}
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn
                  color=""
                  text
                  @click="dialog = false"
                >
                  {{ $t('cancel-button') }}
                </v-btn>
                <v-btn
                  color="accent"
                  text
                  @click="deleteBookmark"
                >
                  {{ $t('confirm-button') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </template>
    </v-row>

    <v-divider />

    <v-container>
      <div>
        <template v-for="(layer, j) in data.layers">
          <v-row
            :key="layer"
            no-gutters
            class="mt-0"
            align="center"
          >
            <v-col :cols="edit ? 10 : 12">
              <SupportLayersGroupItem
                :layer-id="layer"
                hide-preview
              />
            </v-col>
            <v-col
              v-if="edit"
              cols="2"
            >
              <v-btn
                icon
                @click="removeBookmarkLayer(j)"
              >
                <v-icon> mdi-delete </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </template>
      </div>

      <div>
        <v-list-group
          v-for="(layer, j) in data.catalogs"
          :key="j"
          append-icon=""
        >
          <template #activator>
            <v-list-item-content>
              {{ layer.properties.satellite }} -
              {{ $date(layer.properties.date) }}
            </v-list-item-content>
            <v-list-item-action>
              <div class="d-flex align-center">
                <v-switch
                  :input-value="layer.visible"
                  @change="
                    toggleCatalogLayer({
                      bookmarkId: index,
                      layerId: j,
                      visible: !layer.visible,
                    })
                  "
                />
                <v-btn
                  v-if="edit"
                  icon
                  class="ml-4"
                  @click="removeBookmarkCatalog(j)"
                >
                  <v-icon> mdi-delete </v-icon>
                </v-btn>
              </div>
            </v-list-item-action>
          </template>
        </v-list-group>
      </div>
    </v-container>

    <v-divider />
  </v-list-group>
</template>

<i18n>
{
    "en": {
        "zoom-button": "Zoom to area",
        "edit-button": "Edit bookmark",
        "edit-save-button": "Save",
        "remove-button": "Remove bookmark",
        "remove-title": "Remove bookmark?",
        "remove-text": "This action cannot be undone",
        "confirm-button": "Remove",
        "cancel-button": "Cancel",
        "api-error-update": "Error while updating bookmark, contact a system administrator in case it persists.",
        "api-error-delete": "Error while removing bookmark, contact a system administrator in case it persists."
    },
    "pt-br": {
        "zoom-button": "Aproximar para área",
        "edit-button": "Editar bookmark",
        "edit-save-button": "Save",
        "remove-button": "Remover bookmark",
        "remove-title": "Remover bookmark?",
        "remove-text": "Essa ação não pode ser desfeita",
        "confirm-button": "Remover",
        "cancel-button": "Cancelar",
        "api-error-update": "Não foi possível atualizar o bookmark, entre em contato com um administrador caso persista.",
        "api-error-delete": "Não foi possível remover o bookmark, entre em contato com um administrador caso persista."
    }
}
</i18n>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

import SupportLayersGroupItem from '@/components/support/SupportLayersGroupItem';

export default {
  name: 'BookmarkListItem',

  components: { SupportLayersGroupItem },

  props: {
    bookmark: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },

  data: () => ({
    dialog: false,
    edit: false,
    data: null,
  }),

  computed: {
    ...mapState('supportLayers', ['supportLayers']),
  },

  created() {
    this.data = JSON.parse(JSON.stringify(this.bookmark));
  },

  methods: {
    zoomToBookmark() {
      this.zoomToBounds(this.$L.geoJSON(this.bookmark.bbox).getBounds());
    },

    editBookmark() {
      this.edit = true;
    },

    closeEdit() {
      this.edit = false;
      this.data = JSON.parse(JSON.stringify(this.bookmark));
    },

    removeBookmarkLayer(index) {
      this.data.layers.splice(index, 1);
    },

    removeBookmarkCatalog(index) {
      this.data.catalogs.splice(index, 1);
    },

    async updateBookmark() {
      try {
        await this.$api.$put(
          `bookmark/${this.bookmark.id}/update`,
          {
            name: this.data.name,
            layers: this.data.layers,
            catalogs_images: this.data.catalogs.map(
              (catalog) => catalog.properties.image,
            ),
          },
        );
        this.edit = false;
        this.getBookmarks();
      } catch (exc) {
        this.$store.commit('alert/addAlert', {
          message: this.$t('api-error-update'),
        });
      }
    },

    async deleteBookmark() {
      this.dialog = false;
      try {
        await this.$api.$delete(
          `bookmark/${this.bookmark.id}/delete`,
        );
        this.getBookmarks();
      } catch (exc) {
        this.$store.commit('alert/addAlert', {
          message: this.$t('api-error-delete'),
        });
      }
    },

    ...mapMutations('bookmarks', ['toggleCatalogLayer']),
    ...mapActions('map', ['zoomToBounds']),
    ...mapActions('bookmarks', ['getBookmarks']),
  },
};
</script>

<style lang="sass">
.button-row
    .col:not(:first-child)
        border-left: 1px solid rgba(0,0,0,0.2)
</style>
