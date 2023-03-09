<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="800"
    >
      <v-card>
        <v-card-title class="text-h6 grey lighten-2">
          Relatório Individual
        </v-card-title>
        <v-btn
          icon
          @click="closeDialog(false)"
        />

        <v-data-table
          :headers="headers"
          :items-per-page="15"

          :items="selected"
          class="font-weight-regular"
          multi-sort
          fixed-header
          height="65vh"
        >
          <v-divider />

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              text
              @click="dialog = false"
            >
              I accept
            </v-btn>
          </v-card-actions>
        </v-data-table>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

export default {

  name: 'PdfReport',

  props: {
    selected: {
      type: Object,
      require: true,
      default: null,
    },

    value: {
      type: Boolean,
      require: true,
      default: false,
    },

    closeDialog: {
      type: Function,
      require: true,
      default: null,
    },
  },

  data() {
    return {
      dialog: false,

      headers: [
        { text: 'Identificador', value: 'id' },
        { text: 'Código Funai', value: 'co_funai' },
        { text: 'Terra Indígena', value: 'no_ti' },
        { text: 'Coordenação Regional', value: 'ds_cr' },
        { text: 'Prioridade', value: 'prioridade' },
        { text: 'Classe', value: 'no_estagio' },
        { text: 'Data da Imagem', value: 'dt_imagem' },
        { text: 'Área do Polígono (ha)', value: 'nu_area_ha' },
        { text: 'Latitude', value: 'nu_latitude' },
        { text: 'Longitude', value: 'nu_longitude' },
      ],
    };
  },

  mounted() {
    this.dialog = this.value;
  },

  computed: {
    ...mapState('priority', [
      'showFeatures',
      'features',
      'table',
      'visualizationStage',
      'tableDialogPriority',
      'isLoadingTable',
      'isLoadingCSV',
      'isLoadingFeatures',
      'total',
    ]),
  },
};
</script>
