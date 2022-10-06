<template>
    <v-row justify="space-around">
        <v-col cols="auto">
            <v-dialog
                v-model="showDialogDocument"
                persistent
                transition="dialog-bottom-transition"
                max-width="95vw"
            >
                <v-card style="width: 100vw">
                    <v-toolbar class="background__toolbar" dark color="primary">
                        <h3>{{ $t('dialogName') }}</h3>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="closeDialog(false)">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <v-card-actions>
                        <v-container fluid>
                            <v-row
                                align="center"
                                class="column"
                                justify="space-around"
                            >
                                <v-col class="cols">
                                    <v-select
                                        v-model="filters.ac"
                                        :label="$t('action-label')"
                                        item-value="id_action"
                                        :items="filterOptions.actions"
                                        item-text="no_action"
                                        hide-details
                                        multiple
                                        required
                                        :loading="isLoadingDocumentActions"
                                        :disabled="isLoadingDocumentActions"
                                    >
                                    </v-select>
                                </v-col>
                                <v-col>
                                    <v-select
                                        v-if="filters.ac.length"
                                        v-model="filters.cr"
                                        label="Coordenação Regional (Todas)"
                                        :items="filterOptions.regionalFilters"
                                        item-value="co_cr"
                                        item-text="ds_cr"
                                        hide-details
                                        clearable
                                        multiple
                                        required
                                    >
                                    </v-select>
                                </v-col>
                                <v-col>
                                    <v-select
                                        v-if="
                                            filters.cr &&
                                            filterOptions.tiFilters
                                        "
                                        v-model="filters.ti"
                                        label="Terras Indigenas (Todas)"
                                        :items="filterOptions.tiFilters"
                                        item-text="no_ti"
                                        item-value="co_funai"
                                        multiple
                                        clearable
                                        hide-details
                                        required
                                    >
                                    </v-select>
                                </v-col>
                                <v-col class="mt-9">
                                    <v-row>
                                        <v-col>
                                            <BaseDateField
                                                v-if="filters.ac.length"
                                                v-model="filters.startDate"
                                                :label="$t('start-date-label')"
                                                :required="true"
                                                outlined
                                            />
                                        </v-col>
                                        <v-col>
                                            <BaseDateField
                                                v-if="filters.ac.length"
                                                v-model="filters.endDate"
                                                :label="$t('end-date-label')"
                                                :required="true"
                                                :min-date="filters.startDate"
                                                flex-row
                                                outlined
                                            />
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-col class="mt-2">
                                    <v-btn
                                        v-if="filters.ac.length"
                                        block
                                        color="accent"
                                        :loading="isLoadingFeatures"
                                        @click="search"
                                    >
                                        {{ $t('search-label') }}
                                    </v-btn>
                                </v-col>
                                <DocumentUploadDialog />
                            </v-row>
                        </v-container>
                    </v-card-actions>
                    <v-divider></v-divider>
                    <v-card-actions class="d-flex flex-column">
                        <v-container fluid class="pa-0">
                            <v-row no-gutters class="mb-1">
                                <v-col>
                                    <v-subheader>
                                        {{ $t('result-label') }}
                                    </v-subheader>
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col cols="2">
                                    <v-text-field
                                        v-model="filter"
                                        append-icon="mdi-magnify"
                                        :label="$t('filter-label')"
                                        single-line
                                        hide-details
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                        <v-container class="pa-0" fluid>
                            <v-skeleton-loader
                                v-if="isLoadingTable"
                                type="table-row-divider@12"
                            ></v-skeleton-loader>
                            <v-data-table
                                v-if="!isLoadingTable"
                                :headers="headers"
                                :items="values"
                                :search="filter"
                                fixed-header
                                height="52vh"
                                style="width: 100vw"
                            ></v-data-table>
                        </v-container>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-col>
    </v-row>
</template>

<i18n>
    {
        "en": {
            "search-label": "Search",
            "start-date-label": "Start Date",
            "end-date-label": "End Date",
            "dialogName": "DOCUMENT SEARCH",
            "result-label": "Results",
            "filter-label": "Filter",
            "action-label": "Actions"

        },
        "pt-br": {
            "search-label": "Buscar",
            "start-date-label": "Data Início",
            "end-date-label": "Data Fim",
            "dialogName": "PESQUISA DE DOCUMENTOS",
            "result-label": "Resultados",
            "filter-label": "Filtrar",
            "action-label": "Ações"
        }
    }
</i18n>

<script>
import BaseDateField from '@/components/base/BaseDateField'
import { mapMutations, mapState, mapActions } from 'vuex'
import legend from '@/assets/legend.png'
import DocumentUploadDialog from '@/components/document-dialog/DocumentUploadDialog'

export default {
    name: 'DocumentDialog',

    components: { BaseDateField, DocumentUploadDialog },

    data() {
        return {
            isGeoserver: process.env.MONITORING_GEOSERVER === 'true',
            filters: {
                startDate: this.$moment()
                    .subtract(30, 'days')
                    .format('YYYY-MM-DD'),
                endDate: this.$moment().format('YYYY-MM-DD'),
                cr: [],
                ti: null,
                ac: [],
            },
            isLoadingTotal: false,
            legendData: legend,
            filter: '',
            headers: [
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
            values: [],


        }
    },
    watch: {
        'filters.cr'(value) {
            this.populateTiOptions(value)
        },
    },
    computed: {

        ...mapState('document', [
            'isLoadingFeatures',
            'filterOptions',
            'showFeatures',
            'params',
            'showDialogDocument',
            'isLoadingTable',
            'isLoadingDocumentActions',
            'actions'
        ]),
    },

    mounted() {
        this.getFilterOptions()
        this.getDocumentActions()
    },

    methods: {
        populateTiOptions(cr) {
            if (cr) this.$store.dispatch('document/getTiOptions', cr)
            else this.filters.ti = null
        },

        closeDialog(value) {
            this.setShowDialogDocument(value)
        },

        search() {
            this.setLoadingTable(true)
            this.values = this.desserts
            setInterval(() => {
                this.setLoadingTable(false)
            }, 3000)
        },

        ...mapMutations('document', [
            'setFilters',
            'setShowDialogDocument',
            'setLoadingTable',
        ]),
        ...mapActions('document', ['getFilterOptions', 'getDocumentActions']),
    },
}
</script>

<style scoped lang="sass">
.background__toolbar
    background: linear-gradient(to bottom, rgb(30, 33, 50), rgb(44, 54, 73))

@media (max-width: 1000px)
    .column
        flex-direction: column
</style>
