<template>
    <v-container class="overflow-auto container-height">
        <div class="tab-header flex justify-space-between">
            <h4 class="subtitle-2 text-uppercase font-weight-regular">
                {{ $t('title') }}
            </h4>
            <v-switch
                v-if="features"
                v-model="showFeaturesPriority"
                class="mt-n1 ml-5"
                hide-details
            />
        </div>

        <FunaiFilter @onSearch="search()" />

        <div v-if="showFeatures" class="px-4">
            <v-divider class="mt-1"></v-divider>
            <p class="font-weight-regular pt-2">Legenda:</p>
            <v-col>
                <v-row class="mb-2">
                    <v-icon class="mr-2" color="#9400D3">mdi-square</v-icon>
                    Muito Alta
                </v-row>
                <v-row class="mb-2">
                    <v-icon class="mr-2" color="#FF0000">mdi-square</v-icon>
                    Alta
                </v-row>
                <v-row class="mb-2">
                    <v-icon class="mr-2" color="#FF8C00">mdi-square</v-icon>
                    Média
                </v-row>
                <v-row class="mb-2">
                    <v-icon class="mr-2" color="#FFD700">mdi-square</v-icon>
                    Baixa
                </v-row>
                <v-row class="mb-2">
                    <v-icon class="mr-2" color="#008000">mdi-square</v-icon>
                    Muito Baixa
                </v-row>
                <v-spacer></v-spacer>
            </v-col>
        </div>

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
                        @click="
                            changeVisualizationStage('stage1'), getFeatures()
                        "
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
                    <v-btn icon color="accent" @click="showTablePriority(true)">
                        <v-icon large>mdi-table</v-icon>
                    </v-btn>
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
            "title": "Priority Polygons",
            "analytics-label": "Analytics",
            "map-label": "Map"
        },
        "pt-br": {
            "title": "Polígonos Prioritários",
            "analytics-label": "Analytics",
            "map-label": "Mapa"
        }
    }
</i18n>

<script>
import FunaiFilter from '@/components/priority/PriorityFilter'
import ShowDialog from '@/components/show-dialog/ShowDialog'
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
    components: { FunaiFilter, ShowDialog },

    data() {
        return {
            tab: null,
            items: ['MapStage', 'AnalytcalStage'],
            text: 'Texto de teste.',
            timer: '',
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
        showFeaturesPriority: {
            get() {
                return this.$store.state.priority.showFeatures
            },

            set(value) {
                this.$store.commit('priority/setShowFeatures', value)
            },
        },
        ...mapState('priority', [
            'showFeatures',
            'features',
            'table',
            'visualizationStage',
            'response',
            'params',
            'tablePriority',
        ]),
    },

    methods: {
        search() {
            if (this.tablePriority) this.getDataTable()
            if (!this.tablePriority) this.getFeatures()
        },
        searchDataTable() {
            this.getDataTable()
        },
        changeVisualizationStage(tab) {
            this.setVisualizationStage(tab)
        },
        showTablePriority(value) {
            if (this.features) {
                this.setTablePriority(value)
                this.getDataTable()
            }
        },
        ...mapActions('priority', ['getFeatures', 'getDataTable']),
        ...mapMutations('priority', [
            'setVisualizationStage',
            'setTablePriority',
        ]),
    },
}
</script>

<style scoped>
.container-height {
    max-height: 90vh;
}
</style>
