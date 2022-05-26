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
                <v-toolbar class="background__toolbar" dark color="primary">
                    <h3>{{ $t('table-name') }}</h3>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="checkUpdate()">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
            </v-card>
            <v-container fluid white>
                <v-skeleton-loader
                    v-if="isLoadingTable"
                    type="table-row-divider@8"
                ></v-skeleton-loader>
                <v-card v-if="!isLoadingTable">
                    <a class="d-flex justify-end" v-if="!isLoadingTable">
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
</template>
<i18n>
{
    "en": {
        "table-name": "Monitoring Table"
    },
    "pt-br": {
        "table-name": "Tabela de Monitoramento"
    }
}
</i18n>
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
            'features',
            'total',
        ]),
    },
    methods: {
        ...mapActions('monitoring', ['downloadTableMonitoring', 'getFeatures']),
        ...mapMutations('monitoring', ['setTableDialog']),

        checkUpdate() {
            if (this.features.features.length === this.total.total) {
                this.setTableDialog(false)
            } else {
                this.setTableDialog(false)
                this.getFeatures()
            }
        },
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
    height: 96vh;
}

@media (max-width: 900px) {
    .v-dialog__content {
        justify-content: center;
    }
}

@media (min-width: 901px) {
    .v-dialog__content {
        width: 55%;
    }
}

@media (min-width: 1000px) {
    .v-dialog__content {
        width: 60%;
    }
}

@media (min-width: 1200px) {
    .v-dialog__content {
        width: 66%;
    }
}

@media (min-width: 1264px) {
    .v-dialog__content {
        width: 70%;
    }
}

@media (min-width: 1600px) {
    .v-dialog__content {
        width: 75%;
    }
}

@media (min-width: 1920px) {
    .v-dialog__content {
        width: 100%;
    }
}

.background__toolbar {
    background: linear-gradient(to bottom, rgb(30, 33, 50), rgb(44, 54, 73));
}
</style>
