<template>
    <v-container class="overflow-auto container-height">
        <div class="tab-header flex justify-space-between">
            <h4 class="subtitle-2 text-uppercase font-weight-regular">
                {{ $t('title') }}
            </h4>
            <v-switch
                v-if="features"
                v-model="showFeaturesMonitoring"
                class="mt-n1 ml-5"
                hide-details
            />
        </div>

        <ShowDialog />

        <v-container class="pa-0">
            <v-card >
            <v-list v-if="!$fetchState.pending" expand>
                <template v-for="group in orderedSupportLayersGroups">
                    <SupportLayersGroupAntropismo
                        :key="group.id"
                        :group="group"
                    />
                </template>
            </v-list>
            <div v-if="$fetchState.pending">
                <template v-for="i in 6">
                    <v-skeleton-loader :key="i" type="text" class="mx-4 my-5" />
                </template>
            </div>
            </v-card>
        </v-container>
        <v-divider />
        
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
                        @click="changeVisualizationStage('map')"
                    >
                        <v-icon large>mdi-map</v-icon>
                    </v-btn>
                    <v-btn
                        icon
                        color="accent"
                        @click="changeVisualizationStage('chart')"
                    >
                        <v-icon large>mdi-chart-box</v-icon>
                    </v-btn>
                    <v-btn icon color="accent" @click="showTableDialog(true)">
                        <v-icon large>mdi-table</v-icon>
                    </v-btn>
                    <div class="d-none" v-if="tableDialogMonitoring">
                        <TableDialog
                            :table="tableDialogMonitoring"
                            :headers="headers"
                            :value="tableMonitoring"
                            :loadingTable="isLoadingTableMonitoring"
                            :loadingCSV="isLoadingCSVMonitoring"
                            :fDownloadCSV="downloadTableMonitoring"
                            :tableName="$t('table-name')"
                            :fCloseTable="closeTable"
                        />
                    </div>
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
            "map-label": "Map",
            "table-name": "Monitoring Table"
        },
        "pt-br": {
            "title": "Monitoramento Diário",
            "analytics-label": "Analytics",
            "map-label": "Mapa",
            "table-name": "Tabela de Monitoramento"
        }
    }
</i18n>

<script>
import MonitoringFilter from '@/components/monitoring/MonitoringFilter'
import ShowDialog from '@/components/show-dialog/ShowDialog'
import SupportLayersGroupAntropismo from '@/components/support/SupportLayersGroupAntropismo'
import TableDialog from '@/components/table-dialog/TableDialog.vue'
import { mapActions, mapMutations, mapState } from 'vuex'
import _ from 'lodash'

export default {

    components: { MonitoringFilter, ShowDialog, SupportLayersGroupAntropismo, TableDialog },

    async fetch() {
        if (!Object.keys(this.supportCategoryGroupsAntropismo).length) {
            await this.$store.dispatch(
                'supportLayers/getCategoryGroupsAntropismo'
            )
        }
    },

    data() {
        return {
            tab: null,
            items: ['MapStage', 'AnalytcalStage'],
            text: 'Texto de teste.',
            headers: [
                { text: 'Código Funai', value: 'co_funai' },
                { text: 'Terra Indígena', value: 'no_ti' },
                { text: 'Coordenação Regional', value: 'ds_cr' },
                { text: 'Classe', value: 'no_estagio' },
                { text: 'Data da Imagem', value: 'dt_imagem' },
                { text: 'Área do Polígono (ha)', value: 'nu_area_ha' },
                { text: 'Latitude', value: 'nu_latitude' },
                { text: 'Longitude', value: 'nu_longitude' },
            ],
            checkNewFilters: false,
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

        orderedSupportLayersGroups() {
            return _.sortBy(this.supportCategoryGroupsAntropismo, 'order')
        },

        showFeaturesAntropismo: {
            get() {
                return this.$store.state.supportLayers.showFeatures
            },
            set(value) {
                this.$store.commit('supportLayers/setShowFeatures', value)
            },
        },

        ...mapState('supportLayers', [
            'supportCategoryGroupsAntropismo',
            'loading',
        ]),

        ...mapState('monitoring', [
            'showFeatures',
            'features',
            'total',
            'visualizationStage',
            'isLoadingTableMonitoring',
            'tableDialogMonitoring',
            'tableMonitoring',
            'isLoadingCSVMonitoring',
        ]),
    },

    methods: {
        search() {
            this.getFeatures()
            this.getDataTableMonitoring()

            if (this.tableDialogMonitoring) {
                this.checkNewFilters = true
                this.getDataTableMonitoring()
            }
            if (!this.tableDialogMonitoring) this.getFeatures()

        },

        changeVisualizationStage(tab) {
            this.setVisualizationStage(tab)
        },

        showTableDialog(value) {
            if (this.features) {
                this.settableDialogMonitoring(value)
                this.setshowTableDialog(value)
                this.getDataTableMonitoring()
            }
        },

        closeTable(value) {
            if (!this.checkNewFilters) {
                this.settableDialogMonitoring(value)
                this.setshowTableDialog(value)
            } else {
                this.settableDialogMonitoring(value)
                this.setshowTableDialog(value)
                this.getFeatures()
                this.checkNewFilters = false
            }
        },

        ...mapActions('monitoring', [
            'getFeatures',
            'getDataTableMonitoring',
            'downloadTableMonitoring',
        ]),

        ...mapMutations('priority', ['setVisualizationStage']),

        ...mapMutations('tableDialog', ['setshowTableDialog']),
        
        ...mapMutations('monitoring', [
            'settableDialogMonitoring',
            'setLoadingTable',
        ]),
    },
}
</script>

<style scoped>
.container-height {
    max-height: 90vh;
}
</style>
