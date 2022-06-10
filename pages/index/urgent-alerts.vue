<template>
    <v-container class="overflow-auto container-height">
        <div class="tab-header flex justify-space-between">
            <h4 class="subtitle-2 text-uppercase font-weight-regular">
                {{ $t('title') }}
            </h4>
            <v-switch
                v-if="features"
                v-model="showFeaturesAlert"
                class="mt-n1 ml-5"
                hide-details
            />
        </div>

        <AlertFilter @onSearch="search()" />

        <ShowDialog />

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
                    <v-btn icon color="accent" @click="showTableAlert(true)">
                        <v-icon large>mdi-table</v-icon>
                    </v-btn>
                    <div class="d-none" v-if="tableDialogAlert">
                        <TableDialog
                            :table="tableDialogAlert"
                            :value="table"
                            :headers="headers"
                            :loadingTable="isLoadingTable"
                            :loadingCSV="isLoadingCSV"
                            :fDownloadCSV="downloadTable"
                            :fCloseTable="closeTable"
                            :tableName="$t('table-name')"
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
            "title": "Alert Urgent",
            "analytics-label": "Analytics",
            "map-label": "Map",
            "table-name": "Table Alert Urgent"
        },
        "pt-br": {
            "title": "Alerta Urgente",
            "analytics-label": "Analytics",
            "map-label": "Mapa",
            "table-name": "Tabela de Alerta Urgente"
        }
    }
</i18n>

<script>
import AlertFilter from '@/components/urgent-alerts/AlertFilter.vue'
import ShowDialog from '@/components/show-dialog/ShowDialog'
import TableDialog from '@/components/table-dialog/TableDialog.vue'
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
    components: { AlertFilter, ShowDialog, TableDialog },

    data() {
        return {
            tab: null,
            items: ['MapStage', 'AnalytcalStage'],
            text: 'Texto de teste.',
            timer: '',
            headers: [
                { text: 'Código Funai', value: 'co_funai' },
                { text: 'Terra Indígena', value: 'no_ti' },
                { text: 'Coordenação Regional', value: 'ds_cr' },
                { text: 'Classe', value: 'no_estagio' },
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
        showFeaturesAlert: {
            get() {
                return this.$store.state['urgent-alerts'].showFeatures
            },

            set(value) {
                this.$store.commit('urgent-alerts/setShowFeatures', value)
            },
        },
        ...mapState('urgent-alerts', [
            'showFeatures',
            'features',
            'table',
            'visualizationStage',
            'tableDialogAlert',
            'isLoadingTable',
            'isLoadingCSV',
            'total',
        ]),
    },

    methods: {
        search() {
            if (this.tableDialogAlert) {
                this.checkNewFilters = true
                this.getDataTable()
            }
            if (!this.tableDialogAlert) this.getFeatures()
        },

        searchDataTable() {
            this.getDataTable()
        },

        changeVisualizationStage(tab) {
            this.setVisualizationStage(tab)
        },

        showTableAlert(value) {
            if (this.features) {
                this.settableDialogAlert(value)
                this.setshowTableDialog(value)
                this.getDataTable()
            }
        },

        closeTable(value) {
            if (!this.checkNewFilters) {
                this.settableDialogAlert(value)
                this.setshowTableDialog(value)
            } else {
                this.settableDialogAlert(value)
                this.setshowTableDialog(value)
                this.getFeatures()
                this.checkNewFilters = false
            }
        },

        ...mapActions('urgent-alerts', [
            'getFeatures',
            'getDataTable',
            'downloadTable',
        ]),

        ...mapMutations('tableDialog', ['setshowTableDialog']),
        ...mapMutations('urgent-alerts', [
            'setVisualizationStage',
            'settableDialogAlert',
        ]),
    },
}
</script>

<style scoped>
.container-height {
    max-height: 90vh;
}
</style>
