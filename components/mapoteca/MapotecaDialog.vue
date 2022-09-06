<template>
    <v-row justify="space-around">
        <v-col cols="auto">
            <v-dialog
                v-model="showDialogMapoteca"
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
                                        :label="$t('title-label')"
                                        hide-details
                                        multiple
                                        required
                                    >
                                    </v-select>
                                </v-col>
                                <v-col>
                                    <v-select
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
                                <v-col v-if="filters.cr && filterOptions.tiFilters">
                                    <v-select
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
                                <v-col class="mt-2">
                                    <v-btn
                                        block
                                        color="accent"
                                        :loading="isLoadingFeatures"
                                    >
                                        {{ $t('search-label') }}
                                    </v-btn>
                                </v-col>
                                <MapotecaDialogUpload class="mt-2"/>
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
            "opacity-label": "Opacity",
            "current-view-label": "Search in current area?",
            "start-date-label": "Start Date",
            "total-area-label": "Total area",
            "heat-map-label": "Heat map",
            "polygon-label": "Total polygon count",
            "end-date-label": "End Date",
            "dialogName": " MAP SEARCH",
            "result-label": "Results",
            "filter-label": "Filter",
            "title-label": "Title"
            
        },
        "pt-br": {
            "search-label": "Buscar",
            "opacity-label": "Opacidade",
            "current-view-label": "Pesquisar nesta área?",
            "total-area-label": "Área total",
            "heat-map-label": "Mapa de calor",
            "polygon-label": "Total de polígonos",
            "start-date-label": "Data Início",
            "end-date-label": "Data Fim",
            "dialogName": "PESQUISA DE MAPAS",
            "result-label": "Resultados",
            "filter-label": "Filtrar",
            "title-label": "Título"
        }
    }
</i18n>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'
import legend from '@/assets/legend.png'
import MapotecaDialogUpload from '@/components/mapoteca/MapotecaDialogUpload'



export default {
    name: 'MapotecaDialog',

        components: { MapotecaDialogUpload },


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
            headers: [
                { text: 'Código Funai', value: 'co_funai' },
                { text: 'Terra Indígena', value: 'no_ti' },
                { text: 'Coordenação Regional', value: 'ds_cr' },
                { text: 'Prioridade', value: 'prioridade' },
                { text: 'Classe', value: 'no_estagio' },
                { text: 'Data da Imagem', value: 'dt_imagem' },
                { text: 'Área do Polígono (ha)', value: 'nu_area_ha' },
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

        ...mapState('mapoteca', [
            'isLoadingFeatures',
            'filterOptions',
            'showFeatures',
            'params',
            'showDialogMapoteca',
            'isLoadingTable',
        ]),
    },

    mounted() {
        this.getFilterOptions()
    },

    methods: {
        populateTiOptions(cr) {
            if (cr) this.$store.dispatch('mapoteca/getTiOptions', cr)
            else this.filters.ti = null
        },

        closeDialog(value) {
            this.setShowDialogMapoteca(value)
        },

        search() {
            this.setLoadingTable(true)
            this.values = this.desserts
            setInterval(() => {
                this.setLoadingTable(false)
            }, 3000)
        },

        ...mapMutations('mapoteca', [
            'setFilters',
            'setShowDialogMapoteca',
            'setLoadingTable',
        ]),
        ...mapActions('mapoteca', ['getFilterOptions']),
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
