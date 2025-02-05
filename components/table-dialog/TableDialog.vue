<template>
  <v-row>
    <v-dialog
      v-model="table"
      transition="dialog-bottom-transition"
      persistent
      no-click-animation
      hide-overlay
      width="75vw"
    >
      <v-card>
        <v-toolbar
          dark
          color="secondary"
        >
          <h3>{{ tableName }}</h3>
          <v-spacer />
          <v-btn
            icon
            @click="fCloseTable(false)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
      </v-card>
      <v-skeleton-loader
        v-if="loadingTable"
        type="table-row-divider@8"
      />
      <v-card v-if="!loadingTable">
        <a class="d-flex justify-end">
          <v-btn
            small
            fab
            class="mx-2 my-2"
            color="secondary"
            :loading="loadingCSV"
            @click="fDownloadCSV()"
          >
            <v-icon>mdi-download</v-icon>
          </v-btn>
        </a>
        <v-data-table
          :headers="headers"
          :items-per-page="15"
          :items="value"
          class="font-weight-regular"
          multi-sort
          fixed-header
          height="65vh"
        >
          <template
            v-if="[item.prioridade]"
            #[`item.prioridade`]="{ item }"
          >
            <v-row>
              <v-col>
                <v-chip
                  class="mt-2"
                  :color="getColor(item.prioridade)"
                  :dark="getColor(item.prioridade) !== 'yellow'"
                >
                  {{ item.prioridade }}
                </v-chip>
              </v-col>
            </v-row>
          </template>
          <template
            v-if="[item.action]"
            #[`item.actions`]="{ item }"
          >
            <MapPrinterPriority
              class="mx-2 mb-2"
              :value="dialogPrint"
            />
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

import PdfReport from '@/components/priority/PdfReport';
import MapPrinterPriority from '@/components/priority/MapPrinterPriority.vue';

export default {
  name: 'TableDialog',

  components: { PdfReport, MapPrinterPriority },

  props: {
    table: {
      type: Boolean,
      require: true,
    },
    headers: {
      type: Array,
      require: true,
    },
    value: {
      type: Array,
      require: true,
    },
    loadingTable: {
      type: Boolean,
      require: true,
    },
    loadingCSV: {
      type: Boolean,
      require: true,
    },
    fDownloadCSV: {
      type: Function,
      require: true,
    },
    fCloseTable: {
      type: Function,
      require: true,
    },
    tableName: {
      type: String,
      require: true,
    },
  },

  data() {
    return {
      row: null,
      dialogPrint: false,
      selected: [],
      detail: [],
      featuresIndividual: null,
      geometry: true,
    };
  },

  methods: {

   

    getColor(prioridade) {
      switch (prioridade) {
        case 'Muito Alta':
          return '#9400D3';
          break;
        case 'Alta':
          return 'red';
          break;
        case 'Media':
          return 'orange';
          break;
        case 'Baixa':
          return 'yellow';
          break;
        case 'Muito Baixa':
          return 'green';
          break;
        default:
          break;
      }
    },
    closeAnalyticalDialog(value) {
      this.dialog = value;
    },
    ...mapMutations('priority', [
      'setDetail',
      'setfeaturesIndividual',

    ]),
  },
};
</script>

<style scoped>
.container-height {
    max-height: 100vh;
}
.align-right {
    text-align: right;
}

.v-dialog__content {
    justify-content: flex-start;
    margin: 0 0.5%;
    height: 100vh;
}

@media (max-width: 900px) {
    .v-dialog__content {
        justify-content: center;
    }
}

@media (min-width: 901px) {
    .v-dialog__content {
        width: 55%;
    }
}

@media (min-width: 1000px) {
    .v-dialog__content {
        width: 60%;
    }
}

@media (min-width: 1200px) {
    .v-dialog__content {
        width: 66%;
    }
}

@media (min-width: 1264px) {
    .v-dialog__content {
        width: 70%;
    }
}

@media (min-width: 1600px) {
    .v-dialog__content {
        width: 75%;
    }
}

@media (min-width: 1920px) {
    .v-dialog__content {
        width: 100%;
    }
}

.background__toolbar {
  background: linear-gradient(to bottom, rgb(28, 65, 113), rgb(28, 65, 113));
}
</style>
