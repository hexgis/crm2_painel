<template>
    <v-container class="overflow-auto container-height">
        <div class="tab-header flex justify-space-between">
            <h4 class="subtitle-2 text-uppercase font-weight-regular">
                {{ $t('title') }}
            </h4>
            <v-switch
                v-model="showFeaturesMonitoring"
                class="mt-n1 ml-5"
                hide-details
            />
        </div>

        <ShowDialog />

        <MonitoringFilter @onSearch="search()" />

        <v-footer
            absolute
            class="priority-footer"
            color="#FFFFFF"
            elevation="4"
        >
            <v-col>
                <v-row align="center" justify="space-around">
                    <v-btn
                        depressed
                        icon
                        color="accent"
                        @click="
                            changeVisualizationStage('stage1'), verifyData()
                        "
                    >
                        <v-icon large>mdi-map</v-icon>
                    </v-btn>
                    <v-btn
                        icon
                        color="accent"
                        @click="changeVisualizationStage('stage2')"
                    >
                        <v-icon large>mdi-chart-box</v-icon>
                    </v-btn>
                    <v-btn
                        icon
                        color="accent"
                        @click="
                            changeVisualizationStage('stage4'), verifyData()
                        "
                    >
                        <v-icon large>mdi-table</v-icon>
                    </v-btn>
                </v-row>

                <v-row class="py-2">
                    <v-divider></v-divider>
                </v-row>

                <v-row class="d-flex justify-center">
                    <v-img max-width="200" src="/img/logocmr_normal.png" />
                </v-row>
            </v-col>
        </v-footer>
    </v-container>
</template>

<i18n>
    {
        "en": {
            "title": "Monitoring",
            "analytics-label": "Analytics",
            "map-label": "Map"
        },
        "pt-br": {
            "title": "Monitoramento Diário",
            "analytics-label": "Analytics",
            "map-label": "Mapa"
        }
    }
</i18n>

<script>
import MonitoringFilter from '@/components/monitoring/MonitoringFilter'
import ShowDialog from '@/components/show-dialog/ShowDialog'
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
    components: { MonitoringFilter, ShowDialog },

    data() {
        return {
            tab: null,
            items: ['MapStage', 'AnalytcalStage'],
            text: 'Texto de teste.',
        }
    },
    computed: {
        hasFeatures() {
            return (
                !!this.features &&
                !!this.features.features &&
                this.features.features.length > 0
            )
        },
        showFeaturesMonitoring: {
            get() {
                return this.$store.state.monitoring.showFeatures
            },

            set(value) {
                this.$store.commit('monitoring/setShowFeatures', value)
            },
        },
        ...mapState('monitoring', [
            'showFeatures',
            'features',
            'tableMonitoring',
            'features',
        ]),
        ...mapState('priority', ['visualizationStage']),
    },
    watch: {
        tableMonitoring(newValue, oldValue) {
            if (newValue === oldValue) {
                console.log('tabela não mudou')
            } else {
                console.log('atualizou table')
            }
        },
        features(newValue, oldValue) {
            if (newValue === oldValue) {
                console.log('features não mudou')
            } else {
                console.log('atualizou feature')
            }
        },
    },

    methods: {
        search() {
            console.log(this.visualizationStage)

            if (this.visualizationStage == 'stage1') this.getFeatures()
            if (this.visualizationStage == 'stage4')
                this.getDataTableMonitoring()
        },
        verifyData() {
            if (this.tableMonitoring.length) this.getFeatures()

            console.log(this.features)

            if (this.features != null) this.getDataTableMonitoring()
        },
        changeVisualizationStage(tab) {
            this.setVisualizationStage(tab)
        },
        ...mapActions('monitoring', ['getFeatures', 'getDataTableMonitoring']),
        ...mapMutations('priority', ['setVisualizationStage']),
    },
}
</script>

<style scoped>
.container-height {
    max-height: 90vh;
}
</style>
