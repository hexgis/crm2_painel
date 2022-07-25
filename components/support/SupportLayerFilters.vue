<template>
    <v-form v-if="layer.layer_filters.length" v-model="valid">
        <v-row dense class="my-4">
            <template v-if="hasDoubleDate">
                <v-col cols="6">
                    <BaseDateField
                        v-model="filters.start_date"
                        :label="$t('start-date-label')"
                        required
                        outlined
                        dense
                    />
                </v-col>
                <v-col cols="6">
                    <BaseDateField
                        v-model="filters.end_date"
                        :label="$t('end-date-label')"
                        required
                        :min-date="filters.start_date"
                        outlined
                        dense
                    />
                </v-col>
            </template>

            <template v-for="layer_filter in layer.layer_filters">
                <template
                    v-if="
                        !hasDoubleDate &&
                        (layer_filter.filter_type === 'start_date' ||
                            layer_filter.filter_type === 'end_date')
                    "
                >
                    <v-col :key="layer_filter.filter_type">
                        <BaseDateField
                            v-model="filters[layer_filter.filter_type]"
                            :label="$t('start-date-label')"
                            required
                            outlined
                            dense
                        />
                    </v-col>
                </template>
            </template>
            <template>
                <v-col
                    cols="12"
                    v-if="verifyFilterType('co_cr')"
                    :key="layer.layer_filters.filter_type"
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
                    v-if="verifyFilterType('co_funai')"
                    :key="layer.layer_filters.filter_type"
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
    name: 'SupportLayerFilters',

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
            co_cr: [],
            co_funai: [],
        },
        loading: false,
        hasDoubleDate: false,
    }),

    created() {
        let hasStartDate = false
        let hasEndDate = false

        if (this.layer.layer_filters) {
            this.layer.layer_filters.forEach((layerFilter) => {
                let defaultValue = null
                if (this.layer.active_on_init) {
                    defaultValue = this.layer.filters[layerFilter.filter_type]
                        ? this.layer.filters[layerFilter.filter_type]
                        : layerFilter.default

                    this.$set(
                        this.filters,
                        layerFilter.filter_type,
                        defaultValue
                    )
                }
                if (layerFilter.filter_type === 'start_date') {
                    hasStartDate = true
                } else if (layerFilter.filter_type === 'end_date') {
                    hasEndDate = true
                }
            })

            this.hasDoubleDate = hasStartDate && hasEndDate
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
        verifyFilterType(type) {
            const keys = Object.keys(this.layer.layer_filters)
            for (const key in keys) {
                if (this.layer.layer_filters[key].filter_type.includes(type)) {
                    return true
                }
            }
        },

        filterLayer() {
            const filterInfo = {
                id: this.layer.id,
                filters: this.filters,
            }
            if (this.layer.layer_type === 'heatmap') {
                this.loading = true
                this.setLayerFilters(filterInfo)
                this.getHeatMapLayer(filterInfo).finally(() => {
                    this.loading = false
                })
            } else if (this.layer.layer_type === 'wms') {
                this.setLayerFilters(filterInfo)

                this.toggleLayerVisibility({
                    id: this.layer.id,
                    visible: true,
                })
            }
        },

        ...mapMutations('supportLayers', [
            'setLayerFilters',
            'toggleLayerVisibility',
        ]),

        ...mapActions('supportLayers', ['getHeatMapLayer', 'getFilterOptions']),
    },
}
</script>
