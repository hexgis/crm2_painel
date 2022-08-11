<template>
    <div class="text-center">
        <v-dialog v-model="dialog" max-width="40vw" persistent>
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    fab
                    ripple
                    small
                    color="secondary"
                    v-bind="attrs"
                    v-on="on"
                >
                    <v-icon rounded> mdi-upload </v-icon>
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
                            hide-details
                            multiple
                            required
                        >
                        </v-select>
                        <v-select
                            label="Terras Indigenas (Todas)"
                            :items="filterOptions.tiFiltersUpload"
                            item-text="no_ti"
                            item-value="co_funai"
                            multiple
                            clearable
                            hide-details
                            required
                        >
                        </v-select>
                    </v-col>
                    <v-col class="mt-2">
                        <BaseDateField
                            v-model="filters.date"
                            :label="$t('date-label')"
                            required
                            outlined
                        />
                        <v-btn color="secondary">
                            <input type="file" ref="fileInput" />
                            <v-icon> mdi-paperclip </v-icon>
                        </v-btn>
                    </v-col>
                </v-card-actions>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="secondary" text @click="dialog = false">
                        Cancelar
                    </v-btn>
                    <v-btn color="secondary" text @click="save()">
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
            "date-label": "Date of Document",
            "action-label": "Actions",
            "title-label": "REGISTRATION OF INDIGENOUS LAND DOCUMENTS"
            
        },
        "pt-br": {
            "date-label": "Data do Documento",
            "action-label": "Ações",
            "title-label": "CADASTRO DE DOCUMENTOS DE TERRAS INDÍGENAS"
        }
    }
</i18n>
<script>
import { mapMutations, mapState, mapActions } from 'vuex'
import BaseDateField from '@/components/base/BaseDateField'
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
            },
        }
    },

    methods: {
        save() {
            this.sendData()
            this.uploadFile()
        },

        uploadFile: function () {
            let fileToUpload = this.$refs.fileInput.files[0]
            let formData = new FormData()
            formData.append('fileToUpload', fileToUpload)
            this.$api.$post('url', formData).then(function () {})
        },

        ...mapMutations('document', ['setFilters', 'setShowDialogDocument']),
        ...mapActions('document', ['getTiUploadOptions', 'sendData', 'getActionsUploadOptions']),
    },

    computed: {
        ...mapState('document', ['filterOptions', 'showDialogDocument']),
    },

    mounted() {
        this.getTiUploadOptions()
    },
}
</script>
