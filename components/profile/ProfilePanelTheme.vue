<template>
  <v-form class="fill-height">
    <v-card class="px-3 py-3" elevation="0">
      <v-row>
        <v-col cols="12 ">
          <v-switch
            :label="$t('info-message')"
            @click="$vuetify.theme.dark=!$vuetify.theme.dark"
          />
        </v-col>
      </v-row>
    </v-card>
  </v-form>
</template>
<i18n>
{
    "en": {
        "Theme": "Display theme",
        "info-message": "Change system visual theme: [Black] or [Light] for a view according to your needs."
    },
    "pt-br": {
        "Theme": "Tema de visualização",
        "info-message": "Troque o tema visual do sistema: [Black] ou [Light] para uma visualização de acordo com suas necessidades."
    }
}

</i18n>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import Vuetify from 'vuetify';

export default {
  name: 'ProfilePanelSettingsMap',
  props: {
    newBoundingBox: {
      type: Object,
      default: () => null,
    },
  },

  data: () => ({

  }),
  mounted() {
    const theme = localStorage.getItem('useDarkTheme');
    if (theme) {
      if (theme == 'true') {
        this.$vuetify.theme.dark = true;
      } else this.$vuetify.theme.dark = false;
    }
  },
  methods: {
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem('useDarkTheme', this.$vuetify.theme.dark.toString());
    },
  },
};
</script>
<style scoped lang="sass">
</style>
