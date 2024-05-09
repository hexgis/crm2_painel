<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.mobile"
    scrollable
    :max-width="!!showMap ? 2000 : 800"
  >
    <v-card
      v-if="!showMap"
      min-height="600"
      
    >
      <v-card-title
        class="ml-n2 primary"
      >
        {{ $t('settings-label') }} dasfa
        <v-spacer />
        <v-btn
          icon
          class="mr-n4 mt-n2"
          @click="closeDialog()"
        >
          <v-icon> mdi-close </v-icon>
        </v-btn>
      </v-card-title>
      <v-tabs
        v-model="activeTab"
        :vertical="!$vuetify.breakpoint.mobile"
        background-color="#bfbfbf"
        class="settings-tabs fill-height"
      >
        <template v-for="(tab, index) in tabs">
          <v-tab :key="index">
            <span>{{ tab.name }}</span>
          </v-tab>

          <v-tab-item
            v-if="tab.component"
            :key="index"
          >
            <component
              :is="tab.component"
              keep-alive
              :new-bounding-box="bounding"
              @toggle-map="toggleMap"
            />
          </v-tab-item>
        </template>
      </v-tabs>
    </v-card>

    <ProfileLeafletMap
      v-if="showMap"
      :initial-bounds="bounding || user.settings.initial_extent"
      @toggle-map="toggleMap"
      @save-bounding-box="newBoundingBox"
    />
  </v-dialog>
</template>

<i18n>
{
    "en": {
        "settings-label": "Settings",
        "map-label": "Map settings",
        "password-label": "Change password",
        "theme-label": "View mode"
    },
    "pt-br": {
        "settings-label": "Configurações",
        "map-label": "Configurações de mapa",
        "password-label": "Alterar senha",
        "theme-label": "Modo de visualização"
    }
}
</i18n>

<script>
import { mapState } from 'vuex';
import { useTheme } from 'vuetify';
import ProfilePanelPassword from '@/components/profile/ProfilePanelPassword';
import ProfilePanelSettingsMap from '@/components/profile/ProfilePanelSettingsMap';
import ProfileLeafletMap from '@/components/profile/ProfileLeafletMap';
import ProfilePanelTheme from '@/components/profile/ProfilePanelTheme';

export default {
  name: 'ProfilePanel',

  components: {
    ProfilePanelPassword,
    ProfilePanelSettingsMap,
    ProfileLeafletMap,
    ProfilePanelTheme,
  },

  data: () => ({
    activeTab: 0,
    dialog: true,
    showMap: false,
    bounding: null,
  }),

  computed: {
    ...mapState('userProfile', ['user']),
    tabs() {
      return [
        {
          name: this.$t('map-label'),
          component: ProfilePanelSettingsMap,
          props: {
            'toggle-map': this.toggleMap,
          },
        },
        {
          name: this.$t('password-label'),
          component: ProfilePanelPassword,
        },
        {
          name: this.$t('theme-label'),
          component: ProfilePanelTheme,
        },
      ];
    },
  },

  watch: {
    dialog() {
      if (!this.dialog) {
        this.closeDialog();
      }
    },
  },

  methods: {
    closeDialog() {
      this.dialog = false;
      this.showMap = false;
      this.$emit('onDialogClose');
    },

    changeTheme() {
      const theme = useTheme();
      return {
        theme,
        toggleTheme: () => theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark',
      };
    },

    toggleMap() {
      this.showMap = !this.showMap;
    },
    newBoundingBox(bounding) {
      this.bounding = this.$L
        .polygon([
          bounding.getSouthWest(),
          bounding.getNorthWest(),
          bounding.getNorthEast(),
          bounding.getSouthEast(),
          bounding.getSouthWest(),
        ])
        .toGeoJSON().geometry;
    },
  },
};
</script>

<style lang="sass">
@media (min-width: 960px)
    .settings-tabs
        > .v-slide-group > .v-slide-group__wrapper > .v-slide-group__content
            > .v-tab
                justify-content: flex-end
            > .v-tabs-slider-wrapper
                left: 230px !important
                width: 3px !important

        > .v-window, > .v-window > .v-window__container > .v-window-item
            overflow-y: auto
            height: 100%
            .v-card
                height: 100%
                display: flex
                justify-content: space-between
                flex-direction: column
</style>
