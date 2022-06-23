<template>
    <v-col class="px-4">
        <v-row class="px-3">
            <v-checkbox
                v-model="filters.currentView"
                :label="$t('current-view-label')"
                :error="error"
            />
        </v-row>

        <v-row class="px-3 pb-5">
            <v-select
                v-model="filters.cr"
                label="Coordenação Regional (Todas)"
                :items="filterOptions.regionalFilters"
                item-value="co_cr"
                item-text="ds_cr"
                hide-details
                clearable
                multiple
                :error="error"
            >
            </v-select>
        </v-row>
        <v-slide-y-transition>
            <v-row
                v-if="filters.cr && filterOptions.tiFilters"
                class="px-3 pb-5"
            >
                <v-select
                    v-model="filters.ti"
                    label="Terras Indigenas"
                    :items="filterOptions.tiFilters"
                    item-text="no_ti"
                    item-value="co_funai"
                    hide-details
                    required="true"
                    multiple
                    clearable
                >
                </v-select>
            </v-row>
        </v-slide-y-transition>

        <v-row class="pt-1">
            <v-col class="py-0">
                <BaseDateField
                    v-model="filters.startDate"
                    :label="$t('start-date-label')"
                    :required="true"
                    outlined
                />
            </v-col>

            <v-col class="py-0">
                <BaseDateField
                    v-model="filters.endDate"
                    :label="$t('end-date-label')"
                    :required="true"
                    :min-date="filters.startDate"
                    outlined
                />
            </v-col>
        </v-row>

        <v-row class="px-3">
            <v-col v-show="showFeatures">
                <v-btn
                    color="accent"
                    :loading="isLoadingGeoJson"
                    fab
                    small
                    @click="downloadGeoJsonMonitoring()"
                >
                    <v-icon>mdi-download</v-icon>
                </v-btn>
            </v-col>
            <v-col>
                <v-btn
                    block
                    color="accent"
                    :loading="isLoadingFeatures"
                    @click="search"
                >
                    {{ $t('search-label') }}
                </v-btn>
            </v-col>
        </v-row>

        <v-divider v-if="showFeatures" class="mt-8 mb-5" />

        <v-row v-if="showFeatures && total">
            <v-col cols="7" class="grey--text text--darken-2">
                {{ $t('polygon-label') }}:
            </v-col>
            <v-col cols="5" class="text-right">
                {{ total.total }}
            </v-col>
        </v-row>

        <v-row v-if="showFeatures && total && total.area_ha">
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

        <v-row v-if="showFeatures" align="center">
            <v-col cols="4" class="grey--text text--darken-2">
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

        <v-row v-if="showFeatures" align="center" justify="space-between">
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
            "total-area-label": "Total Area",
            "heat-map-label": "Heat map",
            "polygon-label": "Total polygon",
            "end-date-label": "End Date",
            "select-all": "Select All"
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
            "select-all": "Selecionar Todas"
        }
    }
</i18n>

<script>
import BaseDateField from '@/components/base/BaseDateField'
import { mapMutations, mapState, mapActions } from 'vuex'
import legend from '@/assets/legend.png'

export default {
    name: 'MonitoringFilter',

    components: { BaseDateField },

    data() {
        return {
            isGeoserver: process.env.MONITORING_GEOSERVER === 'true',
            filters: {
                startDate: this.$moment().format('YYYY-MM-DD'),
                endDate: this.$moment().format('YYYY-MM-DD'),
                currentView: false,
                priority: null,
                cr: [],
                ti: null,
            },
            isLoadingTotal: false,
            legendData: legend,
            error: false,
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
                return this.$store.state.monitoring.opacity
            },
            set(value) {
                this.$store.commit('monitoring/setOpacity', value)
            },
        },

        heatMap: {
            get() {
                return this.$store.state.monitoring.heatMap
            },
            set(value) {
                this.$store.commit('monitoring/setHeatMap', value)
            },
        },

        ...mapState('monitoring', [
            'isLoadingFeatures',
            'filterOptions',
            'showFeatures',
            'total',
            'isLoadingGeoJson',
        ]),
    },

    mounted() {
        this.getFilterOptions()
    },

    methods: {
        populateTiOptions(cr) {
            if (cr) this.$store.dispatch('monitoring/getTiOptions', cr)
            else this.filters.ti = null
        },

        search() {
            if (
                (this.filters.currentView &&
                    this.filters.startDate &&
                    this.filters.endDate) ||
                (this.filters.cr.length &&
                    this.filters.startDate &&
                    this.filters.endDate)
            ) {
                this.error = false
                this.setFilters(this.filters)
                this.$emit('onSearch')
                return
            }
            this.error = true
        },

        ...mapMutations('monitoring', ['setFilters']),
        ...mapActions('monitoring', [
            'getFilterOptions',
            'downloadGeoJsonMonitoring',
        ]),
    },
}
</script>

<style scoped lang="sass"></style>
