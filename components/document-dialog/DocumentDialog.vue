<template>
    <v-row>
        <v-dialog
            v-model="showDialogDocument"
            scrollable
            persistent
            max-width="80vw"
        >
            <div class="background__color">
                <v-toolbar class="background__toolbar" dark color="primary">
                    <h3>{{ $t('dialogName') }}</h3>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="closeDialog(false)">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <div class="mt-8 ml-6">
                    <v-card
                        elevation="4"
                        style="width: 77vw"
                        class="d-flex flex-column"
                    >
                        <div class="box__width">
                            <div
                                class="d-flex flex-column"
                                style="margin-left: 1vw; margin-top: 1vh"
                            >
                                <div
                                    class="d-flex"
                                    style="min-width: 74%; max-width: 74%"
                                >
                                    <v-select
                                        v-model="filters.cr"
                                        label="Ações"
                                        item-value="co_cr"
                                        item-text="ds_cr"
                                        hide-details
                                        clearable
                                        multiple
                                        required
                                        class="mr-4"
                                    >
                                    </v-select>
                                    <v-select
                                        v-model="filters.cr"
                                        label="Coordenação Regional (Todas)"
                                        :items="filterOptions.regionalFilters"
                                        item-value="co_cr"
                                        item-text="ds_cr"
                                        hide-details
                                        clearable
                                        multiple
                                        required
                                        style="min-width: 49%; max-width: 49%"
                                    >
                                    </v-select>
                                </div>
                                <div class="d-flex mt-5" style="width: 80%">
                                    <div class="d-flex" style="width: 45%">
                                        <div class="mr-2">
                                            <BaseDateField
                                                v-model="filters.startDate"
                                                :label="$t('start-date-label')"
                                                :required="true"
                                                outlined
                                            />
                                        </div>
                                        <div>
                                            <BaseDateField
                                                v-model="filters.endDate"
                                                :label="$t('end-date-label')"
                                                :required="true"
                                                :min-date="filters.startDate"
                                                flex-row
                                                outlined
                                            />
                                        </div>
                                    </div>
                                    <div class="ml-4" style="width: 45%">
                                        <v-slide-y-transition>
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
                                                class="position__input"
                                            >
                                            </v-select>
                                        </v-slide-y-transition>
                                    </div>
                                </div>
                                <div
                                    class="d-flex align-end mb-4"
                                    style="width: 36%"
                                >
                                    <v-btn
                                        block
                                        color="accent"
                                        :loading="isLoadingFeatures"
                                        @click="search"
                                    >
                                        {{ $t('search-label') }}
                                    </v-btn>
                                </div>
                            </div>
                        </div>
                        <v-divider></v-divider>
                        <div style="width: 77vw">
                            <v-card-title class="card__width">
                                <p>
                                    Terra(s) Indígena(s) sem documentos
                                    disponíveis para os parâmetros buscados
                                </p>
                                <div>
                                    <v-text-field
                                        v-model="filter"
                                        append-icon="mdi-magnify"
                                        label="Filter"
                                        single-line
                                        hide-details
                                    ></v-text-field>
                                </div>
                            </v-card-title>

                            <v-data-table
                                :headers="headers"
                                :items="desserts"
                                :search="filter"
                                fixed-header
                                height="20vh"
                            ></v-data-table>
                        </div>
                    </v-card>
                </div>
                <v-container>
                    <v-col v-show="showFeatures">
                        <v-btn
                            color="accent"
                            :loading="isLoadingGeoJson"
                            fab
                            small
                            @click="downloadGeoJson()"
                        >
                            <v-icon>mdi-download</v-icon>
                        </v-btn>
                    </v-col>
                </v-container>
            </div>
        </v-dialog>
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
            "dialogName": "DOCUMENT SEARCH"
            
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
            "dialogName": "PESQUISA DE DOCUMENTOS"
        }
    }
</i18n>

<script>
import BaseDateField from '@/components/base/BaseDateField'
import { mapMutations, mapState, mapActions } from 'vuex'
import legend from '@/assets/legend.png'

export default {
    name: 'AlertFilter',

    components: { BaseDateField },

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
            },
            isLoadingTotal: false,
            legendData: legend,
            filter: '',
            headers: [
                {
                    text: 'Código',
                    align: 'start',
                    value: 'name',
                },
                { text: 'Nome da TI', value: 'calories' },
            ],
            desserts: [
                {
                    name: 'Frozen Yogurt',
                    calories: 159,
                },
                {
                    name: 'Ice cream sandwich',
                    calories: 237,
                },
                {
                    name: 'Eclair',
                    calories: 262,
                },
                {
                    name: 'Cupcake',
                    calories: 305,
                },
            ],
        }
    },
    watch: {
        'filters.cr'(value) {
            this.populateTiOptions(value)
        },
    },
    computed: {
        opacity: {
            get() {
                return this.$store.state.alert - urg.opacity
            },
            set(value) {
                this.$store.commit('alert-urg/setOpacity', value)
            },
        },

        heatMap: {
            get() {
                return this.$store.state.alert - urg.heatMap
            },
            set(value) {
                this.$store.commit('alert-urg/setHeatMap', value)
            },
        },

        ...mapState('document', [
            'isLoadingGeoJson',
            'isLoadingFeatures',
            'filterOptions',
            'showFeatures',
            'total',
            'params',
            'showDialogDocument',
        ]),
    },

    mounted() {
        this.getFilterOptions()
    },

    methods: {
        populateTiOptions(cr) {
            if (cr) this.$store.dispatch('document/getTiOptions', cr)
            else this.filters.ti = null
        },

        closeDialog(value) {
            this.setShowDialogDocument(value)
        },

        search() {},

        ...mapMutations('document', ['setFilters', 'setShowDialogDocument']),
        ...mapActions('document', ['getFilterOptions', 'downloadGeoJson']),
    },
}
</script>

<style scoped lang="sass">
.background__toolbar
    background: linear-gradient(to bottom, rgb(30, 33, 50), rgb(44, 54, 73))

.background__color
    background-color: white
    width: 100vw
    display: flex
    flex-direction: column

.card__width
    display: flex
    flex-direction: row
    align-items: baseline
    justify-content: space-between

.box__width
    width: 60% !important

@media (max-width: 1700px)
    .box__width
        width: 70% !important

@media (max-width: 1440px)
    .box__width
        width: 80% !important

@media (max-width: 1280px)
    .box__width
        width: 90% !important

@media (max-width: 1128px)
    .box__width
        width: 100% !important

@media (max-width: 1007px)
    .box__width
        width: 100% !important
</style>
