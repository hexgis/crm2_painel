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
                <v-card elevation="12" outlined>
                    <v-card-title>
                        Tabela Polígonos Prioritários
                        <v-spacer></v-spacer>
                        <v-btn class="mx-2" small fab>
                            <v-icon>mdi-download</v-icon>
                        </v-btn>

                        <v-switch
                            v-model="switch1"
                            class="mx-2"
                            :label="`Agrupar por Data`"
                        >
                        </v-switch>

                        <v-switch
                            v-model="switch1"
                            class="mx-2"
                            :label="`Agrupar por TI`"
                        >
                        </v-switch>
                    </v-card-title>
                    <v-data-table
                        :headers="headers"
                        :items="desserts"
                        :items-per-page="10"
                        class="elevation-1"
                        :search="search"
                    ></v-data-table>
                </v-card>
            </v-tab-item>
            <v-tab-item class="tab-content">
                <v-card elevation="12" outlined>
                    <v-card-title>
                        Tabela Polígonos Prioritários 2
                        <v-spacer></v-spacer>
                        <v-btn class="mx-2" small fab>
                            <v-icon>mdi-download</v-icon>
                        </v-btn>

                        <v-switch
                            v-model="switch1"
                            class="mx-2"
                            :label="`Agrupar por Data`"
                        >
                        </v-switch>

                        <v-switch
                            v-model="switch1"
                            class="mx-2"
                            :label="`Agrupar por TI`"
                        >
                        </v-switch>
                    </v-card-title>
                    <v-data-table
                        :headers="headers"
                        :items="desserts"
                        :items-per-page="5"
                        class="elevation-1"
                        :search="search"
                    ></v-data-table>
                </v-card>
            </v-tab-item>
        </v-tabs>
    </v-container>
</template>

<script>
export default {
    name: 'PriorityTable',

    layout: 'PriorityTable',

    components: {},

    data() {
        return {
            headers: [
                {
                    text: 'ID',
                    align: 'start',
                    sortable: false,
                    value: 'ID',
                },
                { text: 'CR', value: 'CR' },
                { text: 'Área (g)', value: 'Área' },
                { text: 'TI (g)', value: 'TI' },
                { text: 'Data', value: 'Data' },
                { text: 'Prioridade', value: 'Prioridade' },
            ],
            desserts: [
                {
                    ID: '1234',
                    CR: 'x',
                    Área: 6000,
                    TI: 'y',
                    Data: '22/10/2019',
                    Prioridade: 'Alta',
                },
                {
                    ID: '134',
                    CR: 'x',
                    Área: 8000,
                    TI: 'y',
                    Data: '02/10/2021',
                    Prioridade: 'Alta',
                },
                {
                    ID: '124',
                    CR: 'x',
                    Área: 5000,
                    TI: 'y',
                    Data: '22/10/2021',
                    Prioridade: 'Alta',
                },
                {
                    ID: '234',
                    CR: 'x',
                    Área: 2000,
                    TI: 'y',
                    Data: '22/10/2021',
                    Prioridade: 'Média',
                },
                {
                    ID: '1200',
                    CR: 'x',
                    Área: 3000,
                    TI: 'y',
                    Data: '02/10/2021',
                    Prioridade: 'Muito Baixa',
                },
                {
                    ID: '1034',
                    CR: 'x',
                    Área: 4000,
                    TI: 'y',
                    Data: '22/10/2022',
                    Prioridade: 'Baixa',
                },
                {
                    ID: '6734',
                    CR: 'x',
                    Área: 1000,
                    TI: 'y',
                    Data: '22/11/2021',
                    Prioridade: 'Alta',
                },
                {
                    ID: '1278',
                    CR: 'x',
                    Área: 7000,
                    TI: 'y',
                    Data: '20/10/2021',
                    Prioridade: 'Média',
                },
                {
                    ID: '1454',
                    CR: 'x',
                    Área: 6000,
                    TI: 'y',
                    Data: '22/10/2020',
                    Prioridade: 'Baixa',
                },
                {
                    ID: '1289',
                    CR: 'x',
                    Área: 9000,
                    TI: 'y',
                    Data: '23/11/2021',
                    Prioridade: 'Alta',
                },
            ],
        }
    },
}
</script>

<style scoped>
.container-height {
    max-height: 100vh;
}
</style>
