<template>
    <v-col class="px-4">
        <v-row class="px-3 pb-1 py-3">
            <v-select
                v-model="filters.cr"
                label="Coordenação Regional (Todas)"
                :items="filterOptions.regionalFilters"
                item-value="co_cr"
                item-text="ds_cr"
                hide-details
                clearable
                multiple
                required="true"
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
                    label="Terras Indigenas (Todas)"
                    :items="filterOptions.tiFilters"
                    item-text="no_ti"
                    item-value="co_funai"
                    multiple
                    hide-details
                    required="true"
                >
                </v-select>
            </v-row>
        </v-slide-y-transition>

        <v-row class="pt-5">
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

        <v-row>
            <v-col v-show="showFeaturesUrgentAlert">
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

        <v-divider v-if="showFeaturesUrgentAlert" class="mt-8 mb-5" />

        <v-row v-if="total" class="px-3 py-1">
            <v-row v-if="showFeaturesUrgentAlert && total">
                <v-col cols="7" class="grey--text text--darken-2">
                    {{ $t('polygon-label') }}:
                </v-col>
                <v-col cols="5" class="text-right">
                    {{ total.total }}
                </v-col>
            </v-row>

            <v-row v-if="showFeaturesUrgentAlert && total && total.area_ha">
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

        <v-row v-if="showFeaturesUrgentAlert" align="center">
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

        <v-row
            v-if="showFeaturesUrgentAlert"
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
            "polygon-label": "Total polygon count",
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
                cr: null,
                ti: null,
            },
            isLoadingTotal: false,
            legendData: legend,
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
                return this.$store.state['urgent-alerts'].opacity
            },
            set(value) {
                this.$store.commit('urgent-alerts/setOpacity', value)
            },
        },

        heatMap: {
            get() {
                return this.$store.state['urgent-alerts'].heatMap
            },
            set(value) {
                this.$store.commit('urgent-alerts/setHeatMap', value)
            },
        },

        ...mapState('urgent-alerts', [
            'isLoadingGeoJson',
            'isLoadingFeatures',
            'filterOptions',
            'showFeaturesUrgentAlert',
            'total',
            'params',
        ]),
    },

    mounted() {
        this.getFilterOptions()
    },

    methods: {
        populateTiOptions(cr) {
            if (cr) this.$store.dispatch('urgent-alerts/getTiOptions', cr)
            else this.filters.ti = null
        },

        search() {
            this.setFilters(this.filters)
            this.$emit('onSearch')
        },

        ...mapMutations('urgent-alerts', ['setFilters']),
        ...mapActions('urgent-alerts', ['getFilterOptions', 'downloadGeoJson']),
    },
}
</script>

<style scoped lang="sass"></style>
