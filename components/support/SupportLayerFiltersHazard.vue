<template>
    <v-form v-if="layer.layer_filters.length" v-model="valid">
        <v-row dense class="my-4">
            <template v-for="layer_filter in layer.layer_filters">
                <template>
                    <v-col
                        v-if="layer_filter.filter_type === 'start_date'"
                        :key="layer_filter.filter_type"
                        cols="6"
                    >
                        <BaseDateField
                            v-model="filters.startData"
                            outlined
                            dense
                            :key="layer_filter.filter_alias"
                            :label="$t('end-date-label')"
                            required
                        />
                    </v-col>
                    <v-col
                        v-if="layer_filter.filter_type === 'end_date'"
                        :key="layer_filter.filter_type"
                        cols="6"
                    >
                        <BaseDateField
                            v-model="filters.endData"
                            outlined
                            dense
                            :key="layer_filter.filter_alias"
                            :label="$t('end-date-label')"
                            required
                        />
                    </v-col>
                </template>

                <v-col
                    cols="12"
                    v-if="layer_filter.filter_type === 'Coordenação Regional'"
                    :key="layer_filter.filter_type"
                    class="mb-5"
                >
                    <v-select
                        v-model="filters.co_cr"
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

                <v-col
                    class="mb-5"
                    cols="12"
                    v-if="layer_filter.filter_type === 'Terras Indígenas'"
                    :key="layer_filter.filter_type"
                >
                    <v-slide-y-transition>
                        <v-select
                            v-model="filters.co_funai"
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
                    </v-slide-y-transition>
                </v-col>
            </template>

            <v-col cols="12">
                <v-btn
                    block
                    color="primary"
                    :disabled="!valid"
                    :loading="loading"
                    @click.prevent="filterLayer()"
                >
                    {{ $t('filter-button') }}
                </v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<i18n>
{
    "en": {
        "start-date-label": "Start date",
        "end-date-label": "End date",
        "cpf-label": "CPF/CNPJ",
        "filter-button": "Filter"
    },
    "pt-br": {
        "start-date-label": "Data inicial",
        "end-date-label": "Data final",
        "cpf-label": "CPF/CNPJ",
        "filter-button": "Filtrar"
    }
}
</i18n>

<script>
import { mapMutations, mapActions, mapState } from 'vuex'

import BaseDateField from '@/components/base/BaseDateField'

export default {
    name: 'SupportLayerFiltersHazard',

    components: {
        BaseDateField,
    },

    props: {
        layer: {
            type: Object,
            default: null,
        },
    },

    data: () => ({
        valid: false,
        filters: {
            startData: '',
            endData: '',
        },
        loading: false,
    }),

    created() {
        if (this.layer.layer_filters) {
            this.layer.layer_filters.forEach((layerFilter) => {
                let defaultValue

                if (this.layer.active_on_init) {
                    defaultValue = this.layer.filters[layerFilter.filter_type]
                        ? this.layer.filters[layerFilter.filter_type]
                        : layerFilter.default

                    this.$set(
                        this.filters,
                        layerFilter.filter_type,
                        layerFilter.filter_alias,
                        defaultValue
                    )
                }
            })
        }
    },

    mounted() {
        this.getFilterOptions()
    },

    watch: {
        'filters.co_cr'(value) {
            this.populateTiOptions(value)
        },
    },

    computed: {
        ...mapState('supportLayers', ['filterOptions']),
    },

    methods: {
        populateTiOptions(cr) {
            if (cr) this.$store.dispatch('supportLayers/getTiOptions', cr)
            else this.filters.ti = null
        },

        filterLayer() {
            const filterInfo = {
                id: this.layer.id,
                filters: this.filters,
            }
            if (this.layer.layer_type === 'heatmap') {
                this.loading = true
                this.setLayerFiltersFire(filterInfo)
                this.getHeatMapLayer(filterInfo).finally(() => {
                    this.loading = false
                })
            } else if (this.layer.layer_type === 'wms') {
                this.setLayerFiltersFire(filterInfo)

                this.toggleLayerVisibilityFire({
                    id: this.layer.id,
                    visible: true,
                })
            }
        },

        ...mapMutations('supportLayers', [
            'setLayerFiltersFire',
            'toggleLayerVisibilityFire',
        ]),

        ...mapActions('supportLayers', ['getHeatMapLayer', 'getFilterOptions']),
    },
}
</script>
