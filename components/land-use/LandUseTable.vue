<template>
    <v-row>
        <v-dialog
            v-model="tableLandUse"
            transition="dialog-bottom-transition"
            persistent
            no-click-animation
            hide-overlay
            width="75vw"
        >
            <v-card>
                <v-toolbar class="background__toolbar" dark color="primary">
                    <h3>{{ $t('name-table') }}</h3>
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

                <v-card v-if="isLoadingTable === false">
                    <a
                        class="d-flex justify-end"
                        v-if="isLoadingTable === false"
                    >
                        <v-btn
                            small
                            fab
                            class="mx-2 my-2"
                            color="secondary"
                            @click="downloadTableLandUse()"
                            :loading="isLoadingCSV"
                        >
                            <v-icon>mdi-download</v-icon>
                        </v-btn>
                    </a>
                    <v-data-table
                        :headers="headers"
                        :items-per-page="15"
                        :items="tableLandUse"
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
                            @click="downloadTableLandUse()"
                            :loading="isLoadingCSV"
                        >
                            <v-icon>mdi-download</v-icon>
                        </v-btn>
                    </a>
                </v-row>
            </v-card-title>

            <v-data-table
                :headers="headers"
                :items-per-page="10"
                :items="tableLandUse"
                class="font-weight-regular"
                multi-sort
            >
            </v-data-table>
        </v-card>
    </v-container> -->
</template>

<i18n>
{
    "en": {
        "name-table": "Land Use Table"

    },
    "pt-br": {
        "name-table": "Uso e Ocupação do Solo"

    }
}
</i18n>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
    name: 'LandUseTable',
    data() {
        return {
            headers: [
                { text: 'Código Funai', value: 'co_funai' },
                { text: 'Terra Indígena', value: 'no_ti' },
                // { text: 'Co CR', value: 'co_cr' },
                { text: 'Coordenação Regional', value: 'ds_cr' },
                // { text: 'Prioridade', value: 'prioridade' },
                // { text: 'Classe', value: 'no_estagio' },
                // { text: 'No Imagem', value: 'no_imagem' },
                // { text: 'Data da Imagem', value: 'dt_imagem' },
                // { text: 'Tempo', value: 'tempo' },
                // {
                //     text: 'Id Ciclo de monitoramento',
                //     value: 'tb_ciclo_monitoramento_id',
                // },
                // { text: 'Nu Órbita', value: 'nu_orbita' },
                // { text: 'Nu Ponto', value: 'nu_ponto' },
                // { text: 'Data Inicial', value: 'dt_t_zero' },
                // { text: 'Data Final', value: 'dt_t_um' },
                { text: 'Data Cadastro', value: 'dt_cadastro' },
                { text: 'Nu Área Km2', value: 'nu_area_km2' },
                { text: 'Área do Polígono (ha)', value: 'nu_area_ha' },
                // { text: 'Contribuição', value: 'contribuicao' },
                // { text: 'Velocidade', value: 'velocidade' },
                // { text: 'Contiguidade', value: 'contiguidade' },
                // { text: 'Ranking', value: 'ranking' },
                // { text: 'Latitude', value: 'nu_latitude' },
                // { text: 'Longitude', value: 'nu_longitude' },
            ],
        }
    },
    computed: {
        ...mapState('land-use', [
            'tableLandUse',
            'tableCSVLandUse',
            'isLoadingCSV',
            'isLoadingTable',
            'features',
            'total',
        ]),
    },

    methods: {
        ...mapActions('land-use', ['downloadTableLandUse', 'getFeatures']),
        ...mapMutations('land-use', ['setTableLand']),

        checkUpdate() {
            if (this.features.features.length === this.total.total) {
                this.setTableLand(false)
            } else {
                this.setTableLand(false)
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
