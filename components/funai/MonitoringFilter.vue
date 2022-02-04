<template>
    <v-col class="px-4">
        <v-row class="px-3">
            <v-checkbox
                v-model="filters.currentView"
                :label="$t('current-view-label')"
            />
        </v-row>

        <v-row class="px-3 pb-2">
            <v-select
                v-model="filters.cr"
                label="Coordenação Regional"
                :items="filterOptions.regionalFilters"
                item-value="co_cr"
                item-text="no_cr"
                hide-details
                clearable
            >
            </v-select>
        </v-row>

        <v-slide-y-transition>
            <v-row
                class="px-3 pb-2"
                v-if="filters.cr && filterOptions.tiFilters"
            >
                <v-select
                    v-model="filters.ti"
                    label="Terras Indigenas"
                    :items="filterOptions.tiFilters"
                    item-text="no_ti"
                    item-value="co_funai"
                    multiple
                    hide-details
                >
                </v-select>
            </v-row>
        </v-slide-y-transition>

        <v-row class="px-3 pb-2">
            <v-select
                v-model="filters.priority"
                label="Prioridade"
                :items="filterOptions.priority"
                item-text="no_pr"
                item-value="co_pr"
                clearable
                multiple
            ></v-select>
        </v-row>

        <v-row class="pt-8">
            <v-col cols="6" class="py-0">
                <BaseDateField
                    v-model="filters.startDate"
                    :label="$t('start-date-label')"
                    :required="true"
                    outlined
                />
            </v-col>

            <v-col cols="6" class="py-0">
                <BaseDateField
                    v-model="filters.endDate"
                    :label="$t('end-date-label')"
                    :required="true"
                    :min-date="filters.startDate"
                    outlined
                />
            </v-col>
        </v-row>

        <v-row class="px-3 pt-4">
            <v-btn
                block
                color="accent"
                :loading="isLoadingFeatures"
                @click="search"
            >
                {{ $t('search-label') }}
            </v-btn>
        </v-row>

        <v-divider v-if="showFeatures" class="mt-10 mb-5" />

        <v-row v-if="total" class="px-3 py-4">
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

export default {
    name: 'FunaiFilter',

    components: { BaseDateField },

    data() {
        return {
            filters: {
                startDate: this.$moment()
                    .subtract(30, 'days')
                    .format('YYYY-MM-DD'),
                endDate: this.$moment().format('YYYY-MM-DD'),
                currentView: false,
                priority: null,
                cr: null,
                ti: null,
            },
        }
    },
    watch: {
        'filters.cr': function (value) {
            this.populateTiOptions(value)
        },
    },
    computed: {
        opacity: {
            get() {
                return this.$store.state.funai.opacity
            },
            set(value) {
                this.$store.commit('funai/setOpacity', value)
            },
        },

        heatMap: {
            get() {
                return this.$store.state.funai.heatMap
            },
            set(value) {
                this.$store.commit('funai/setHeatMap', value)
            },
        },

        ...mapState('funai', [
            'isLoadingFeatures',
            'filterOptions',
            'showFeatures',
            'total',
        ]),
    },

    mounted() {
        this.getFilterOptions()
    },

    methods: {
        populateTiOptions(cr) {
            if (cr) this.$store.dispatch('funai/getTiOptions', cr)
            else this.filters.ti = null
        },

        search() {
            this.setFilters(this.filters)
            this.$emit('onSearch')
        },
        ...mapMutations('funai', ['setFilters']),
        ...mapActions('funai', ['getFilterOptions']),
    },
}
</script>

<style scoped lang="sass"></style>
