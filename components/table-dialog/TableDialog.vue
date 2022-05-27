<template>
    <v-row>
        <v-dialog
            v-model="table"
            transition="dialog-bottom-transition"
            persistent
            no-click-animation
            hide-overlay
            width="75vw"
        >
            <v-card>
                <v-toolbar class="background__toolbar" dark color="primary">
                    <h3>{{ tableName }}</h3>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="fCloseTable(false)">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
            </v-card>
            <v-container fluid white>
                <v-skeleton-loader
                    v-if="loadingTable"
                    type="table-row-divider@8"
                ></v-skeleton-loader>
                <v-card v-if="!loadingTable">
                    <a class="d-flex justify-end" v-if="!loadingTable">
                        <v-btn
                            small
                            fab
                            class="mx-2 my-2"
                            color="secondary"
                            @click="fDownloadCSV()"
                            :loading="isLoadingCSV"
                        >
                            <v-icon>mdi-download</v-icon>
                        </v-btn>
                    </a>
                    <v-data-table
                        :headers="headers"
                        :items-per-page="15"
                        :items="value"
                        class="font-weight-regular"
                        multi-sort
                        fixed-header
                        height="65vh"
                    >
                        <template
                            v-if="[item.prioridade]"
                            v-slot:[`item.prioridade`]="{ item }"
                        >
                            <v-chip
                                :color="getColor(item.prioridade)"
                                :dark="getColor(item.prioridade) !== 'yellow'"
                            >
                                {{ item.prioridade }}
                            </v-chip>
                        </template>
                    </v-data-table>
                </v-card>
            </v-container>
        </v-dialog>
    </v-row>
</template>

<script>
export default {
    name: 'TableDialog',
    props: {
        table: {
            type: Boolean,
            require: true,
        },
        headers: {
            type: Array,
            require: true,
        },
        value: {
            type: Array,
            require: true,
        },
        loadingTable: {
            type: Boolean,
            require: true,
        },
        loadingCSV: {
            type: Boolean,
            require: true,
        },
        fDownloadCSV: {
            type: Function,
            require: true,
        },
        fCloseTable: {
            type: Function,
            require: true,
        },
        tableName: {
            type: String,
            require: true,
        },
    },
    data: () => ({
        isLoadingCSV: false,
    }),
    methods: {
        getColor(prioridade) {
            if (prioridade === 'Alta') return 'red'
            else if (prioridade === 'Muito Alta') return '#9400D3'
            else if (prioridade === 'Media') return 'orange'
            else if (prioridade === 'Baixa') return 'yellow'
            else if (prioridade === 'Muito Baixa') return 'green'
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
    height: 100vh;
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
