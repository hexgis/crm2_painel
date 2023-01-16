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
      <v-card v-if="dialog">
        <v-card-title class="text-h5 grey lighten-2">
          {{ $t('title-label') }}
        </v-card-title>
        <v-card-actions>
          <v-container grid-list-xs>
            <v-row>
              <v-col
                sm="12"
                md="6"
              >
                <v-select
                  v-model="filters.ac"
                  :label="$t('action-label')"
                  :items="filterOptions.actions"
                  item-text="no_action"
                  item-value="id_action"
                  hide-details
                  required
                  clearable
                  class="mb-4"
                />
                <BaseDateField
                  v-model="filters.date"
                  :label="$t('date-label')"
                  required
                />
              </v-col>
              <v-col
                sm="12"
                md="6"
              >
                <v-select
                  v-model="filters.ti"
                  label="Terras Indigenas (Todas)"
                  :items="filterOptions.tiFiltersUpload"
                  item-text="no_ti"
                  item-value="co_funai"
                  multiple
                  clearable
                  hide-details
                  required
                />
                <v-file-input
                  v-model="filters.file"
                  placeholder="Upload your documents"
                  label="File input"
                  multiple
                  prepend-icon="mdi-paperclip"
                  class="mt-4"
                >
                  <template #selection="{ text }">
                    <v-chip
                      small
                      label
                      color="primary"
                    >
                      {{ text }}
                    </v-chip>
                  </template>
                </v-file-input>
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="secondary"
            text
            @click="dialog = false"
          >
            {{ $t('cancel-label') }}
          </v-btn>
          <v-btn
            color="secondary"
            text
            :loading="isLoadingUploadDocument"
            @click="save()"
          >
            {{ $t('save-label') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<i18n>
    {
        "en": {
            "date-label": "Document Date",
            "action-label": "Actions",
            "title-label": "REGISTRATION OF INDIGENOUS LAND DOCUMENTS",
            "save-label": "Save",
            "cancel-label": "Cancel"

        },
        "pt-br": {
            "date-label": "Data do Documento",
            "action-label": "Ações",
            "title-label": "CADASTRO DE DOCUMENTOS DE TERRAS INDÍGENAS",
            "save-label": "Salvar",
            "cancel-label": "Cancelar"
        }
    }
</i18n>
<script>
import { mapMutations, mapState, mapActions } from 'vuex';
import BaseDateField from '@/components/base/BaseDateField';

export default {
  components: { BaseDateField },

  data() {
    return {
      dialog: false,
      image: '',
      isGeoserver: process.env.MONITORING_GEOSERVER === 'true',
      filters: {
        date: this.$moment().format('YYYY-MM-DD'),
        cr: [],
        ti: null,
        ac: [],
        file: null,
      },
    };
  },

  computed: {
    ...mapState('document', ['filterOptions', 'showDialogDocument', 'isLoadingUploadDocument']),
  },

  mounted() {
    this.getTiUploadOptions();
  },

  methods: {
    save() {
      this.uploadFile();
    },

    uploadFile() {
      const formData = new FormData();
      formData.append('id_acao', this.filters.ac);
      formData.append('file', this.filters.file);
      formData.append('id_document', Math.random() * (10000 - 100) + 100);
      formData.append('no_document', 'Hex');

      this.uploadIndigenousDocuments({ formData, filters: this.filters });
    },

    ...mapMutations('document', ['setShowDialogDocument']),
    ...mapActions('document', [
      'getTiUploadOptions',
      'sendData',
      'uploadIndigenousDocuments',
    ]),
  },

};
</script>
