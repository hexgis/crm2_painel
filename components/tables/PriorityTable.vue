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
                        :items-per-page="5"
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
                    text: 'Dessert (100g serving)',
                    align: 'start',
                    sortable: false,
                    value: 'name',
                },
                { text: 'Calories', value: 'calories' },
                { text: 'Fat (g)', value: 'fat' },
                { text: 'Carbs (g)', value: 'carbs' },
                { text: 'Protein (g)', value: 'protein' },
                { text: 'Iron (%)', value: 'iron' },
            ],
            desserts: [
                {
                    name: 'Frozen Yogurt',
                    calories: 159,
                    fat: 6.0,
                    carbs: 24,
                    protein: 4.0,
                    iron: '1%',
                },
                {
                    name: 'Ice cream sandwich',
                    calories: 237,
                    fat: 9.0,
                    carbs: 37,
                    protein: 4.3,
                    iron: '1%',
                },
                {
                    name: 'Eclair',
                    calories: 262,
                    fat: 16.0,
                    carbs: 23,
                    protein: 6.0,
                    iron: '7%',
                },
                {
                    name: 'Cupcake',
                    calories: 305,
                    fat: 3.7,
                    carbs: 67,
                    protein: 4.3,
                    iron: '8%',
                },
                {
                    name: 'Gingerbread',
                    calories: 356,
                    fat: 16.0,
                    carbs: 49,
                    protein: 3.9,
                    iron: '16%',
                },
                {
                    name: 'Jelly bean',
                    calories: 375,
                    fat: 0.0,
                    carbs: 94,
                    protein: 0.0,
                    iron: '0%',
                },
                {
                    name: 'Lollipop',
                    calories: 392,
                    fat: 0.2,
                    carbs: 98,
                    protein: 0,
                    iron: '2%',
                },
                {
                    name: 'Honeycomb',
                    calories: 408,
                    fat: 3.2,
                    carbs: 87,
                    protein: 6.5,
                    iron: '45%',
                },
                {
                    name: 'Donut',
                    calories: 452,
                    fat: 25.0,
                    carbs: 51,
                    protein: 4.9,
                    iron: '22%',
                },
                {
                    name: 'KitKat',
                    calories: 518,
                    fat: 26.0,
                    carbs: 65,
                    protein: 7,
                    iron: '6%',
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

.lucas {
    margin-top: 90px;
}
</style>
