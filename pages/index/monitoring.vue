<template>
    <div>
        <div class="tab-header flex justify-space-between">
            <h4 class="subtitle-2 text-uppercase font-weight-regular">
                {{ $t('title') }}
            </h4>
            <v-switch
                v-show="
                    (isGeoserver && totalFeatures) ||
                    (!isGeoserver && featuresLoaded)
                "
                v-model="showFeatures"
                class="mt-n1 ml-5"
                hide-details
            />
        </div>
        <v-container class="pa-4">
            <v-form v-model="valid">
                <v-row dense>
                    <v-col cols="12">
                        <v-checkbox
                            v-model="filters.currentView"
                            :label="$t('current-view-label')"
                        />
                    </v-col>

                    <v-col cols="6">
                        <BaseDateField
                            v-model="filters.startDate"
                            :label="$t('start-date-label')"
                            :required="true"
                            outlined
                        />
                    </v-col>

                    <v-col cols="6">
                        <BaseDateField
                            v-model="filters.endDate"
                            :label="$t('end-date-label')"
                            :required="true"
                            :min-date="filters.startDate"
                            outlined
                        />
                    </v-col>

                    <v-col>
                        <v-btn
                            block
                            color="accent"
                            :disabled="!valid"
                            :loading="isLoadingFeatures || isLoadingTotal"
                            @click="submit"
                        >
                            {{ $t('search-button') }}
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>

            <v-divider v-if="showFeatures" class="mt-5 mb-3" />

            <v-row v-if="showFeatures && totalFeatures">
                <v-col cols="7" class="grey--text text--darken-2">
                    {{ $t('polygon-label') }}:
                </v-col>
                <v-col cols="5" class="text-right">
                    {{ totalFeatures.total }}
                </v-col>
            </v-row>

            <v-row
                v-if="showFeatures && totalFeatures && totalFeatures.area_ha"
            >
                <v-col cols="7" class="grey--text text--darken-2">
                    {{ $t('total-area-label') }}:
                </v-col>
                <v-col cols="5" class="text-right">
                    {{
                        totalFeatures.area_ha.toLocaleString($i18n.locale, {
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

            <v-row
                v-if="showFeatures && !isGeoserver"
                align="center"
                justify="space-between"
            >
                <v-col>
                    <span class="grey--text text--darken-2">
                        {{ $t('heat-map-label') }}
                    </span>
                </v-col>
                <v-col cols="3" class="d-flex justify-end">
                    <v-switch
                        v-model="heatMap"
                        class="mt-0 pt-0"
                        hide-details
                    />
                </v-col>
            </v-row>

            <v-row v-if="totalFeatures && totalFeatures.total && isGeoserver">
                <v-col>
                    <p class="grey--text text--darken-2">
                        {{ $t('legend-label') }}:
                    </p>
                    <v-img
                        contain
                        :src="legendUrl"
                        :lazy-src="legendUrl"
                        :max-width="96"
                    />
                </v-col>
            </v-row>

            <v-row v-if="showFeatures" class="mt-4">
                <v-img :src="legendData" max-width="290px" />
            </v-row>

            <v-row v-if="showFeatures" class="mt-7">
                <v-col class="text-right">
                    <v-tooltip left>
                        <template #activator="{ on }">
                            <v-btn fab color="primary" to="analytics" v-on="on">
                                <v-icon class="smaller-icon"> mdi-poll </v-icon>
                            </v-btn>
                        </template>
                        <span> {{ $t('analytics-label') }} </span>
                    </v-tooltip>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<i18n>
{
    "en": {
        "title": "Search",
        "current-view-label": "Search in current area?",
        "start-date-label": "Start date",
        "end-date-label": "End date",
        "search-button": "Search",
        "total-area-label": "Total area",
        "polygon-label": "Total polygon count",
        "opacity-label": "Opacity",
        "heat-map-label": "Heat map",
        "legend-label": "Legend",
        "analytics-label": "Analytics"
    },
    "pt-br": {
        "title": "Pesquisar",
        "current-view-label": "Pesquisar nesta área?",
        "start-date-label": "Data inicial",
        "end-date-label": "Data final",
        "search-button": "Pesquisar",
        "total-area-label": "Área total",
        "polygon-label": "Total de polígonos",
        "opacity-label": "Opacidade",
        "heat-map-label": "Mapa de calor",
        "legend-label": "Legenda",
        "analytics-label": "Analytics"
    }
}
</i18n>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import BaseDateField from '@/components/base/BaseDateField'
import legend from '@/assets/legend.png'

export default {
    name: 'Monitoring',

    components: { BaseDateField },

    transition: 'scroll-y-transition',

    data() {
        return {
            valid: null,
            isGeoserver: process.env.MONITORING_GEOSERVER === 'true',

            filters: {
                startDate: this.$moment()
                    .subtract(30, 'days')
                    .format('YYYY-MM-DD'),
                endDate: this.$moment().format('YYYY-MM-DD'),
                heatMap: true,
                currentView: true,
            },
            totalFeatures: 0,
            isLoadingTotal: false,
            legendData: legend,
        }
    },

    computed: {
        maxEndDate() {
            return this.$moment(this.filters.startDate)
                .add(30, 'days')
                .format('YYYY-MM-DD')
        },

        legendUrl: () =>
            process.env.MONITORING_GEOSERVER_URL +
            '&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png' +
            '&WIDTH=40&HEIGHT=40&LAYER=' +
            process.env.MONITORING_GEOSERVER_LAYER,

        showFeatures: {
            get() {
                return this.$store.state.monitoring.showFeatures
            },
            set(value) {
                this.$store.commit('monitoring/setShowFeatures', value)
            },
        },

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

        ...mapState('monitoring', ['isLoadingFeatures']),
        ...mapGetters('monitoring', ['featuresLoaded']),
        ...mapGetters('map', ['bbox']),
    },

    created() {
        if (this.$store.state.monitoring.filters.startDate) {
            this.filters.startDate =
                this.$store.state.monitoring.filters.startDate
        }
        if (this.$store.state.monitoring.filters.endDate) {
            this.filters.endDate = this.$store.state.monitoring.filters.endDate
        }
    },

    mounted() {
        if (this.featuresLoaded) {
            this.getTotalFeatures()
        }
    },

    methods: {
        submit() {
            this.opacity = 100
            this.setFilters(this.filters)
            this.getTotalFeatures()

            if (this.isGeoserver) {
                this.showFeatures = true
            } else {
                this.getFeatures()
            }
        },

        toggleHeatMap() {
            this.heatMap = !this.heatMap
        },

        async getTotalFeatures() {
            this.isLoadingTotal = true
            try {
                const params = {
                    start_date: this.filters.startDate,
                    end_date: this.filters.endDate,
                }
                if (this.filters.currentView) params.in_bbox = this.bbox

                this.totalFeatures = await this.$api.$get('monitoring/total', {
                    params,
                })
            } catch (exception) {
                this.$store.commit('alert/addAlert', {
                    message:
                        'Não foi possível resgatar o total de dados de monitoramento,' +
                        ' entre em contato com um administrador caso persista.',
                })
            } finally {
                this.isLoadingTotal = false
            }
        },

        ...mapMutations('monitoring', ['setFilters']),
        ...mapActions('monitoring', ['getFeatures']),
    },
}
</script>

<style scoped lang="sass">
.smaller-icon
    font-size: 18px !important
</style>
