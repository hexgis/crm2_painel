<template>
    <v-container fluid class="overflow-auto container-height">
        <v-tabs absolute width="100vw" dark background-color="secondary">
            <v-tab icon>
                <v-icon color="#FFFFFF">mdi-table</v-icon>
            </v-tab>
            <v-tab>
                <v-icon color="#FFFFFF">mdi-file-chart-outline </v-icon>
            </v-tab>
            <v-tab-item class="tab-content">
                <v-card elevation="5" outlined>
                    <v-card-title>
                        Tabela Polígonos Prioritários
                        <v-spacer></v-spacer>
                        <v-btn class="mx-2" small fab>
                            <v-icon>mdi-download</v-icon>
                        </v-btn>

                        <v-switch class="mx-2" :label="`Agrupar por Data`">
                        </v-switch>

                        <v-switch class="mx-2" :label="`Agrupar por TI`">
                        </v-switch>
                    </v-card-title>

                    <v-data-table
                        :headers="headers"
                        :items-per-page="10"
                        :items="table"
                        class="elevation-1 font-weight-regular"
                    >
                        <template v-slot:item.prioridade="{ item }">
                            <v-chip :color="getColor(item.prioridade)">
                                {{ item.prioridade }}
                            </v-chip>
                        </template>
                    </v-data-table>
                </v-card>
            </v-tab-item>
        </v-tabs>
    </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'PriorityTable',
    data() {
        return {
            headers: [
                { text: 'Co Funai', value: 'co_funai' },
                { text: 'No TI', value: 'no_ti' },
                { text: 'Co CR', value: 'co_cr' },
                { text: 'Ds CR', value: 'ds_cr' },
                { text: 'Prioridade', value: 'prioridade' },
                { text: 'No Estágio', value: 'no_estagio' },
                { text: 'No Imagem', value: 'no_imagem' },
                { text: 'Dt Imagem', value: 'dt_imagem' },
                { text: 'Tempo', value: 'tempo' },
                {
                    text: 'Id Ciclo de monitoramento',
                    value: 'tb_ciclo_monitoramento_id',
                },
                { text: 'Nu Órbita', value: 'nu_orbita' },
                { text: 'Nu Ponto', value: 'nu_ponto' },
                { text: 'Data Inicial', value: 'dt_t_zero' },
                { text: 'Data Final', value: 'dt_t_um' },
                { text: 'Data Cadastro', value: 'dt_cadastro' },
                { text: 'Nu Área Km2', value: 'nu_area_km2' },
                { text: 'Nu Área Ha', value: 'nu_area_ha' },
                { text: 'Contribuição', value: 'contribuicao' },
                { text: 'Velocidade', value: 'velocidade' },
                { text: 'Contiguidade', value: 'contiguidade' },
                { text: 'Ranking', value: 'ranking' },
                { text: 'Nu Latitude', value: 'nu_latitude' },
                { text: 'Nu Longitude', value: 'nu_longitude' },
            ],
        }
    },
    computed: {
        ...mapState('funai', ['table']),
    },
    methods: {
        getColor(prioridade) {
            if (prioridade === 'Alta') return 'red'
            else if (prioridade === 'Média') return 'orange'
            else if (prioridade === 'Baixa') return 'yellow'
            else return 'green'
        },
    },
}
</script>
<style scoped>
.container-height {
    max-height: 100vh;
}
</style>
