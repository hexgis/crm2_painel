<template>
    <v-container fluid class="overflow-auto container-height">
        <v-toolbar absolute min-width="100vw" color="secondary">
            <v-btn icon>
                <v-icon color="#FFFFFF">mdi-table</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card class="py-8 mt-8">
            <v-card-title>
                <v-row>
                    <v-switch class="mx-2" :label="`Agrupar por Data`">
                    </v-switch>

                    <v-switch class="mx-2" :label="`Agrupar por TI`">
                    </v-switch>
                    <v-spacer></v-spacer>
                    <v-btn small fab class="mx-2 my-2" color="secondary">
                        <v-icon>mdi-download</v-icon>
                    </v-btn>
                </v-row>
            </v-card-title>

            <v-data-table
                :headers="headers"
                :items-per-page="10"
                :items="table"
                class="font-weight-regular"
                :expanded.sync="expanded"
                show-expand
                :single-expand="singleExpand"
            >
                <template v-slot:item.prioridade="{ item }">
                    <v-chip
                        :color="getColor(item.prioridade)"
                        :dark="getColor(item.prioridade) !== 'yellow'"
                    >
                        {{ item.prioridade }}
                    </v-chip>
                </template>
                <!-- <template v-slot:expanded-item="{ headers, item }">
                    <td :colspan="headers.length">
                        {{ item.co_cr }}
                        {{ item.ds_cr }}
                        {{ item.no_imagem }}
                        {{ item.dt_imagem }}
                        {{ item.tempo }}
                        {{ item.nu_orbita }}
                        {{ item.tb_ciclo_monitoramento_id }}
                        {{ item.nu_ponto }}
                        {{ item.dt_t_zero }}
                        {{ item.dt_cadastro }}
                        {{ item.nu_area_km2 }}
                        {{ item.contribuicao }}
                        {{ item.velocidade }}
                        {{ item.contiguidade }}
                        {{ item.ranking }}
                        {{ item.nu_latitude }}
                        {{ item.nu_longitude }}
                        {{ item.dt_t_um }}
                    </td>
                </template> -->
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'PriorityTable',
    data() {
        return {
            expanded: [],
            singleExpand: true,

            headers: [
                { text: 'Código Funai', value: 'co_funai' },
                { text: 'Terra Indígena', value: 'no_ti' },
                // { text: 'Co CR', value: 'co_cr' },
                // { text: 'Ds CR', value: 'ds_cr' },
                { text: 'Prioridade', value: 'prioridade' },
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
.align-right {
    text-align: right;
}
</style>
