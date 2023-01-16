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
          class="background__toolbar"
          dark
          color="primary"
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
      <v-container
        fluid
        white
      >
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
            @click:row="handleClick"
          >
            <template
              v-if="[item.prioridade]"
              #[`item.prioridade`]="{ item }"
            >
              <v-row>
                <v-col
                  cols="8"
                >
                  <v-chip
                    class="mt-3"
                    :color="getColor(item.prioridade)"
                    :dark="getColor(item.prioridade) !== 'yellow'"
                  >
                    {{ item.prioridade }}
                  </v-chip>
                </v-col>
                <v-col
                  cols="2"
                >
                  <!-- <v-btn

                    class="mx-2"
                    fab
                    dark
                    small
                    color="secondary"

                    @click:row="handleClick()"
                    @click="dialogPrint = true"
                  >
                    <v-icon dark>
                      mdi-download
                    </v-icon>
                  </v-btn> -->

                  <MapPrinterPriority
                    :value="dialogPrint"
                  />
                </v-col>
              </v-row>
            </template>
          </v-data-table>
        </v-card>
      </v-container>
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
    };
  },

  // computed: {
  //   ...mapState('priority', [
  //     'detail',
  //   ]),
  // },

  methods: {

    onButtonClick(item) {
      console.log(item.id);
    },
    // handleClick(row) {
    //   console.log(row.id);
    // },

    async handleClick(row) {
      try {
        console.log(row);
        this.detail = await this.$api.$get(
          `priority/consolidated/detail/${row.id}/`,

        );
        console.log(this.detail);
        this.setDetail(this.detail);
      } catch (exception) {
        this.$store.commit('alert/addAlert', {
          message: this.$t('detail-api-error'),
        });
      }
    },

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
    background: linear-gradient(to bottom, rgb(30, 33, 50), rgb(44, 54, 73));
}
</style>
