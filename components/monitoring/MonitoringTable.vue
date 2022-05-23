<template>
    <v-row>
        <v-dialog
            v-model="tableDialog"
            transition="dialog-bottom-transition"
            persistent
            no-click-animation
            hide-overlay
            width="75vw"
        >
            <v-card>
                <v-toolbar dark color="primary">
                    <h3>Table</h3>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="setTableDialog(false)">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <a v-if="isLoadingTable === false">
                    <v-btn
                        small
                        fab
                        class="mx-2 my-2"
                        color="secondary"
                        @click="downloadTableMonitoring()"
                        :loading="isLoadingCSVMonitoring"
                    >
                        <v-icon>mdi-download</v-icon>
                    </v-btn>
                </a>
                <!-- <v-card-title v-if="isLoadingTable === false">
                    <v-row>
                        <v-spacer></v-spacer>
                        
                    </v-row>
                </v-card-title> -->
            </v-card>

            <v-container fluid white>
                <v-skeleton-loader
                    v-if="isLoadingTable"
                    type="table-row-divider@8"
                ></v-skeleton-loader>

                <v-card v-if="isLoadingTable === false">
                    <v-data-table
                        :headers="headers"
                        :items-per-page="15"
                        :items="tableMonitoring"
                        class="font-weight-regular"
                        multi-sort
                        fixed-header
                        height="65vh"
                    >
                    </v-data-table>
                </v-card>
            </v-container>
        </v-dialog>
    </v-row>

    <!-- <v-container fluid class="overflow-auto container-height">
        <v-toolbar absolute min-width="100vw" color="secondary">
            <v-btn icon>
                <v-icon color="#FFFFFF">mdi-table</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card class="py-8 mt-8">
            <v-card-title>
                <v-row>
                    <v-spacer></v-spacer>
                    <a>
                        <v-btn
                            small
                            fab
                            class="mx-2 my-2"
                            color="secondary"
                            @click="downloadTableMonitoring()"
                            :loading="isLoadingCSVMonitoring"
                        >
                            <v-icon>mdi-download</v-icon>
                        </v-btn>
                    </a>
                </v-row>
            </v-card-title>

            <v-data-table
                :headers="headers"
                :items-per-page="10"
                :items="tableMonitoring"
                class="font-weight-regular"
                multi-sort
            >
            </v-data-table>
        </v-card>
    </v-container> -->
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
    name: 'MonitoringTable',
    data() {
        return {
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
        ...mapState('monitoring', [
            'tableMonitoring',
            'tableCSVMonitoring',
            'isLoadingCSVMonitoring',
            'tableDialog',
            'isLoadingTable',
        ]),
    },

    methods: {
        getColor(prioridade) {
            if (prioridade === 'Alta') return 'red'
            else if (prioridade === 'Muito Alta') return '#9400D3'
            else if (prioridade === 'Media') return 'orange'
            else if (prioridade === 'Baixa') return 'yellow'
            else if (prioridade === 'Muito Baixa') return 'green'
        },
        ...mapActions('monitoring', ['downloadTableMonitoring']),
        ...mapMutations('monitoring', ['setTableDialog']),
    },
}
</script>
<style scoped>
.container-height {
    max-height: 100vh;
}
.align-right {
    text-align: right;
}

.v-dialog__content {
    justify-content: flex-start;
    margin: 0 0.5%;
    height: 100vh;
}
</style>
