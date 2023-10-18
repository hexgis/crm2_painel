<template>
  <v-container class="overflow-auto container-height">
    <div class="tab-header">
      <v-row>
        <h4 class="subtitle-2 text-uppercase font-weight-regular">
          {{ $t('title') }}
        </h4>
        <v-tooltip>
          <template #activator="{ on }">
            <v-icon
              class="mr-2 ml-2"
              v-on="on"
            >
              mdi-information
            </v-icon>
          </template>
          <span>
            Atualizado frequentemente pela equipe de cartografia do CMR.
            <br>
            Fonte de dados: Banco de dados - FUNAI
          </span>
        </v-tooltip>
      </v-row>
      <v-switch
        v-if="features"
        v-model="showFeaturesAlert"
        class="mt-n1 ml-5"
        hide-details
      />
    </div>

    <AlertFilter @onSearch="search()" />
    <ShowDialog />
    <div
      v-if="showFeaturesUrgentAlert && !isLoadingFeatures"
      class="mx-4"
    >
      <v-divider class="mt-1" />
      <p class="font-weight-regular pt-2 grey--text text--darken-2">
        Legenda:
      </p>
      <v-col class="grey--text text--darken-2">
        <v-row class="mb-2">
          <v-icon
            class="mr-2"
            color="#990099"
          >
            mdi-square
          </v-icon>
          Desmatamento em Regeneração
        </v-row>
        <v-row class="mb-2">
          <v-icon
            class="mr-2"
            color="#b35900"
          >
            mdi-square
          </v-icon>
          Fogo em Floresta
        </v-row>
        <v-row class="mb-2">
          <v-icon
            class="mr-2"
            color="#ff8000"
          >
            mdi-square
          </v-icon>
          Degradação
        </v-row>
        <v-row class="mb-2">
          <v-icon
            class="mr-2"
            color="#ff3333"
          >
            mdi-square
          </v-icon>
          Corte Raso
        </v-row>
        <v-spacer />
      </v-col>
    </div>

    <v-footer
      absolute
      class="priority-footer"
      elevation="4"
    >
      <v-col>
        <v-row class="d-flex justify-center">
          <v-img
            max-width="200"
            src="/img/logo-inteira-antiga.svg"
          />
        </v-row>
      </v-col>
    </v-footer>
  </v-container>
</template>

<i18n>
    {
        "en": {
            "title": "Urgent Alerts",
            "analytics-label": "Analytics",
            "map-label": "Map",
            "table-name": "Table Urgent Alerts"
        },
        "pt-br": {
            "title": "Alerta Urgente",
            "analytics-label": "Analytics",
            "map-label": "Mapa",
            "table-name": "Tabela de Alerta Urgente"
        }
    }
</i18n>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import AlertFilter from '@/components/urgent-alerts/AlertFilter.vue';
import ShowDialog from '@/components/show-dialog/ShowDialog';

export default {
  components: { AlertFilter, ShowDialog },

  data() {
    return {
      tab: null,
      items: ['MapStage', 'AnalytcalStage'],
      text: 'Texto de teste.',
      timer: '',
      checkNewFilters: false,
    };
  },
  computed: {
    hasFeatures() {
      return (
        !!this.features
                && !!this.features.features
                && this.features.features.length > 0
      );
    },

    showFeaturesAlert: {
      get() {
        return this.$store.state['urgent-alerts']
          .showFeaturesUrgentAlert;
      },

      set(value) {
        this.$store.commit(
          'urgent-alerts/setshowFeaturesUrgentAlert',
          value,
        );
      },
    },

    ...mapState('urgent-alerts', [
      'showFeaturesUrgentAlert',
      'features',
      'table',
      'tableDialogAlert',
      'isLoadingFeatures',
    ]),
  },

  methods: {
    search() {
      if (this.tableDialogAlert) {
        this.checkNewFilters = true;
        this.getDataTable();
      }
      if (!this.tableDialogAlert) this.getFeatures();
    },

    ...mapActions('urgent-alerts', [
      'getFeatures',
      'getDataTable',
    ]),
  },
};
</script>

<style scoped>
.container-height {
    max-height: 90vh;
}
</style>
