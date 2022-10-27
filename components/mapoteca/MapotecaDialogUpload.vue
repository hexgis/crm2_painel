<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      max-width="40vw"
      persistent
    >
      <template #activator="{ on, attrs }">
        <v-btn
          fab
          ripple
          small
          color="secondary"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon rounded>
            mdi-upload
          </v-icon>
        </v-btn>
      </template>
      <v-card style="width: 100vw">
        <v-card-title class="text-h5 grey lighten-2">
          {{ $t('title-label') }}
        </v-card-title>
        <v-card-actions>
          <v-col class="cols">
            <v-select
              :label="$t('action-label')"
              :items="filterOptions.actions"
              item-text="no_acao"
              item-value="id_acao"
              hide-details
              required
              clearable
            />
            <v-select
              label="Terras Indigenas (Todas)"
              :items="filterOptions.tiFiltersUpload"
              item-text="no_ti"
              item-value="co_funai"
              multiple
              clearable
              hide-details
              required
            />
          </v-col>
          <v-col class="mt-2">
            <BaseDateField
              v-model="filters.date"
              :label="$t('date-label')"
              required
              outlined
            />
            <v-btn color="secondary">
              <input
                ref="fileInput"
                type="file"
              >
              <v-icon> mdi-paperclip </v-icon>
            </v-btn>
          </v-col>
        </v-card-actions>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="secondary"
            text
            @click="dialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="secondary"
            text
            @click="save()"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<i18n>
    {
        "en": {
            "date-label": "Date of Map",
            "action-label": "Actions",
            "title-label": "REGISTRATION OF MAPAS"

        },
        "pt-br": {
            "date-label": "Data do Mapa",
            "action-label": "Ações",
            "title-label": "CADASTRO DE MAPAS"
        }
    }
</i18n>
<script>
import { mapMutations, mapState, mapActions } from 'vuex';
import BaseDateField from '@/components/base/BaseDateField';

export default {
  name: 'MapotecaDialogUpload',

  components: { BaseDateField },

  data() {
    return {
      dialog: false,
      image: '',
      isGeoserver: process.env.MONITORING_GEOSERVER === 'true',
      filters: {
        date: this.$moment().format('YYYY-MM-DD'),
        ti: null,
        ac: [],
      },
    };
  },

  computed: {
    ...mapState('mapoteca', ['filterOptions', 'showDialogDocument']),
  },

  mounted() {
    this.getTiUploadOptions();
    this.getActionsUploadOptions();
  },

  methods: {
    save() {
      // this.uploadFile()
    },
    uploadFile() {
      const params = {
        co_funai: this.ti,
        id_acao: this.ac,
        dt_cadastro: this.date,
      };
      const fileToUpload = this.$refs.fileInput.files[0];
      const formData = new FormData();
      formData.append('fileToUpload', fileToUpload);
      this.$api
        .$post('url', formData, params)
        .then(() => { console.log('Enviado com sucesso'); });
    },
    ...mapMutations('mapoteca', ['setFilters', 'setShowDialogDocument']),
    ...mapActions('mapoteca', [
      'getTiUploadOptions',
      'sendData',
      'getActionsUploadOptions',
    ]),
  },
};
</script>
