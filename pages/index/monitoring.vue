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
                        @click="changeVisualizationStage('stage1')"
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
import TableDialog from '@/components/table-dialog/TableDialog.vue'
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
    components: { MonitoringFilter, ShowDialog, TableDialog },

    data() {
        return {
            tab: null,
            items: ['MapStage', 'AnalytcalStage'],
            text: 'Texto de teste.',
            headers: [
                { text: 'Código Funai', value: 'co_funai' },
                { text: 'Terra Indígena', value: 'no_ti' },
                // { text: 'Co CR', value: 'co_cr' },
                { text: 'Coordenação Regional', value: 'ds_cr' },
                // { text: 'Prioridade', value: 'prioridade' },
                { text: 'Classe', value: 'no_estagio' },
                // { text: 'No Imagem', value: 'no_imagem' },
                { text: 'Data da Imagem', value: 'dt_imagem' },
                // { text: 'Tempo', value: 'tempo' },
                // {
                //     text: 'Id Ciclo de monitoramento',
                //     value: 'tb_ciclo_monitoramento_id',
                // },
                // { text: 'Nu Órbita', value: 'nu_orbita' },
                // { text: 'Nu Ponto', value: 'nu_ponto' },
                // { text: 'Data Inicial', value: 'dt_t_zero' },
                // { text: 'Data Final', value: 'dt_t_um' },
                // { text: 'Data Cadastro', value: 'dt_cadastro' },
                // { text: 'Nu Área Km2', value: 'nu_area_km2' },
                { text: 'Área do Polígono (ha)', value: 'nu_area_ha' },
                // { text: 'Contribuição', value: 'contribuicao' },
                // { text: 'Velocidade', value: 'velocidade' },
                // { text: 'Contiguidade', value: 'contiguidade' },
                // { text: 'Ranking', value: 'ranking' },
                { text: 'Latitude', value: 'nu_latitude' },
                { text: 'Longitude', value: 'nu_longitude' },
            ],
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
            if (this.tableDialogMonitoring) this.getDataTableMonitoring()
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
            if (this.features.features.length === this.total.total) {
                this.settableDialogMonitoring(value)
                this.setshowTableDialog(value)
            } else {
                this.settableDialogMonitoring(value)
                this.setshowTableDialog(value)
                this.getFeatures()
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
