<template>
  <v-container
    class="overflow-auto container-height"
    color="surface"
  >
    <div class="tab-header flex justify-space-between">
      <h4 class="subtitle-2 text-uppercase font-weight-regular">
        {{ $t('title') }}
      </h4>
      <v-switch
        v-if="features"
        v-model="showFeaturesPriority"
        class="mt-n1 ml-5"
        hide-details
      />
    </div>

    <FunaiFilter @onSearch="search()" />

    <div
      v-if="showFeatures && !isLoadingFeatures"
      class="px-4"
    >
      <v-divider />
      <p class="font-weight-regular pt-2 grey--text text--darken-2">
        Legenda:
      </p>
      <v-col class="grey--text text--darken-2">
        <v-row class="mb-2">
          <v-icon
            class="mr-2"
            color="#9400D3"
          >
            mdi-square
          </v-icon>
          Muito Alta
        </v-row>
        <v-row class="mb-2">
          <v-icon
            class="mr-2"
            color="#FF0000"
          >
            mdi-square
          </v-icon>
          Alta
        </v-row>
        <v-row class="mb-2">
          <v-icon
            class="mr-2"
            color="#FF8C00"
          >
            mdi-square
          </v-icon>
          Média
        </v-row>
        <v-row class="mb-2">
          <v-icon
            class="mr-2"
            color="#FFD700"
          >
            mdi-square
          </v-icon>
          Baixa
        </v-row>
        <v-row class="mb-2">
          <v-icon
            class="mr-2"
            color="#008000"
          >
            mdi-square
          </v-icon>
          Muito Baixa
        </v-row>
        <v-spacer />
      </v-col>
    </div>

    <ShowDialog />

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
            "title": "Priority Polygons",
            "analytics-label": "Analytics",
            "map-label": "Map",
            "table-name": "Priority Table"
        },
        "pt-br": {
            "title": "Polígonos Prioritários",
            "analytics-label": "Analytics",
            "map-label": "Mapa",
            "table-name": "Tabela de Prioridade"
        }
    }
</i18n>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import FunaiFilter from '@/components/priority/PriorityFilter';
import ShowDialog from '@/components/show-dialog/ShowDialog';

export default {
  name: 'PriorityComponent',

  components: {
    FunaiFilter, ShowDialog,
  },

  data() {
    return {
      item: [],

      tab: null,
      selected: [],
      items: ['MapStage', 'AnalytcalStage'],
      text: 'Texto de teste.',
      timer: '',
      checkNewFilters: false,
      dialog: false,
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
    showFeaturesPriority: {
      get() {
        return this.$store.state.priority.showFeatures;
      },

      set(value) {
        this.$store.commit('priority/setShowFeatures', value);
      },
    },
    ...mapState('priority', [
      'showFeatures',
      'features',
      'table',
      'tableDialogPriority',
      'isLoadingFeatures',
    ]),
  },

  methods: {
    search() {
      if (this.tableDialogPriority) {
        this.checkNewFilters = true;
        this.getDataTable();
      }
      if (!this.tableDialogPriority) this.getFeatures();
    },

    ...mapActions('priority', [
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
.selected {
    background-color: red
}
</style>
