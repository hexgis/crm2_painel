<template>
    <v-col class="px-4">
        <v-row class="px-3 py-1">
            <v-select
                v-model="filters.cr"
                label="Coordenação Regional"
                :items="filterOptions.regionalFilters"
                item-value="co_cr"
                item-text="ds_cr"
                multiple
                hide-details
                clearable
                required
                :error="errorRegional"
            >
            </v-select>
        </v-row>

        <v-slide-y-transition>
            <v-row
                v-if="filters.cr && filterOptions.tiFilters"
                class="px-3 pb-1"
            >
                <v-select
                    v-model="filters.ti"
                    label="Terras Indigenas"
                    :items="filterOptions.tiFilters"
                    item-text="no_ti"
                    item-value="co_funai"
                    hide-details
                    required
                    multiple
                >
                </v-select>
            </v-row>
        </v-slide-y-transition>

        <v-row class="pt-1 px-3">
            <v-select
                label="Ano"
                v-model="filters.year"
                :items="filterOptions.year"
                item-text="nu_ano"
                item-value="map_year"
                clearable
                :loading="loading"
                multiple
                :error="errorAno"
            >
            </v-select>
        </v-row>
        <v-progress-linear
            :active="loading"
            :indeterminate="loading"
            absolute
            bottom
            color="deep-purple accent-4"
        ></v-progress-linear>

        <v-row no-gutters align="center">
            <v-col v-show="showFeatures">
                <v-btn
                    color="accent"
                    :loading="isLoadingGeoJson"
                    fab
                    small
                    @click="downloadGeoJsonLandUse()"
                >
                    <v-icon>mdi-download</v-icon>
                </v-btn>
            </v-col>
            <v-col>
                <v-btn
                    block
                    color="accent"
                    :loading="isLoadingFeatures"
                    @click="search()"
                >
                    {{ $t('search-label') }}
                </v-btn>
            </v-col>
        </v-row>
        <div v-if="isLoadingFeatures" class="mt-4">
            <v-row justify="center">
                <v-col cols="6">
                    <v-skeleton-loader type="table-cell@4" />
                </v-col>
                <v-col cols="6">
                    <div class="d-flex justify-end">
                        <v-skeleton-loader type="table-cell@4" />
                    </div>
                </v-col>
            </v-row>
            <v-divider class="mt-1"></v-divider>
            <div>
                <v-skeleton-loader type="table-cell" />
                <v-row
                    no-gutters
                    align="center"
                    class="mb-4"
                    v-for="n in 5"
                    :key="n"
                >
                    <v-col cols="1">
                        <v-skeleton-loader
                            width="20"
                            height="20"
                            tile
                            type="avatar"
                        />
                    </v-col>

                    <v-col cols="4" class="mt-1">
                        <v-skeleton-loader type="text" />
                    </v-col>
                </v-row>
            </div>
        </div>

        <v-row v-if="total && !isLoadingFeatures" class="px-3 py-1 mt-7">
            <v-row v-if="showFeatures && total && total.area_ha">
                <v-col cols="7" class="grey--text text--darken-2">
                    {{ $t('polygon-label') }}:
                </v-col>
                <v-col cols="5" class="text-right">
                    {{ total.total }}
                </v-col>
                <v-col cols="7" class="grey--text text--darken-2">
                    {{ $t('total-area-label') }}:
                </v-col>
                <v-col cols="5" class="text-right">
                    {{
                        total.area_ha.toLocaleString($i18n.locale, {
                            maximumFractionDigits: 2,
                        })
                    }}
                    ha
                </v-col>
            </v-row>
        </v-row>

        <v-row v-if="showFeatures && !isLoadingFeatures" align="center">
            <v-col cols="4" class="grey--text text--darken-2 mt-1">
                {{ $t('opacity-label') }}
            </v-col>
            <v-col cols="8">
                <v-slider
                    v-model="opacity"
                    class="my-n2"
                    hide-details
                    thumb-label
                />
            </v-col>
        </v-row>
        <v-row
            v-if="showFeatures && !isLoadingFeatures"
            align="center"
            justify="space-between"
        >
            <v-col>
                <span class="grey--text text--darken-2">
                    {{ $t('heat-map-label') }}
                </span>
            </v-col>
            <v-col cols="3" class="d-flex justify-end">
                <v-switch v-model="heatMap" class="mt-0 pt-0" hide-details />
            </v-col>
        </v-row>
    </v-col>
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
            "polygon-label": "Total polygons count",
            "end-date-label": "End Date"
        },
        "pt-br": {
            "search-label": "Buscar",
            "opacity-label": "Opacidade",
            "current-view-label": "Pesquisar nesta área?",
            "total-area-label": "Área total",
            "heat-map-label": "Mapa de calor",
            "polygon-label": "Total de polígonos",
            "start-date-label": "Data Início",
            "end-date-label": "Data Fim"
        }
    }
</i18n>

<script>
import BaseDateField from '@/components/base/BaseDateField'
import { mapMutations, mapState, mapActions } from 'vuex'
import legend from '@/assets/legend.png'

export default {
    name: 'LandUseFilter',

    components: { BaseDateField },

    data() {
        return {
            isGeoserver: process.env.MONITORING_GEOSERVER === 'true',
            filters: {
                currentView: false,
                year: [],
                cr: [],
                ti: null,
            },
            isLoadingTotal: false,
            loading: false,
            legendData: legend,
            errorRegional: false,
            errorAno: false,
        }
    },

    watch: {
        'filters.cr'(value) {
            this.populateTiOptions(value)
        },

        'filters.ti'(value) {
            this.loading = true
            this.populateYearsOptions(value)
        },

        'filters.year'() {
            this.loading = false
        },
    },

    computed: {
        opacity: {
            get() {
                return this.$store.state['land-use'].opacity
            },
            set(value) {
                this.$store.commit('land-use/setOpacity', value)
            },
        },

        heatMap: {
            get() {
                return this.$store.state['land-use'].heatMap
            },
            set(value) {
                this.$store.commit('land-use/setHeatMap', value)
            },
        },

        ...mapState('land-use', [
            'isLoadingGeoJson',
            'isLoadingFeatures',
            'filterOptions',
            'showFeatures',
            'total',
            'params',
        ]),
    },

    mounted() {
        this.getFilterOptions()
    },

    methods: {
        populateTiOptions(cr) {
            if (cr) this.$store.dispatch('land-use/getTiOptions', cr)
            else this.filters.ti = null
        },

        populateYearsOptions(ti) {
            if (ti) this.$store.dispatch('land-use/getYearsOptions', ti)
            else this.filters.year = null
        },

        search() {
            if (!this.filters.cr.length && !this.filters.year.length) {
                this.errorRegional = true
                this.errorAno = true
                return
            }
            if (!this.filters.cr.length && this.filters.year.length) {
                this.errorRegional = true
                this.errorAno = false
                return
            }
            if (this.filters.cr.length && !this.filters.year.length) {
                this.errorRegional = false
                this.errorAno = true
                return
            }
            this.errorRegional = false
            this.errorAno = false
            this.setFilters(this.filters)
            this.$emit('onSearch')
        },

        ...mapMutations('land-use', ['setFilters']),
        ...mapActions('land-use', [
            'getFilterOptions',
            'downloadGeoJsonLandUse',
        ]),
    },
}
</script>

<style scoped lang="sass"></style>
