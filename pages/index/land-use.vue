<template>
    <v-container class="overflow-auto container-height">
        <div class="tab-header flex justify-space-between">
            <h4 class="subtitle-2 text-uppercase font-weight-regular">
                {{ $t('title') }}
            </h4>
            <v-switch
                v-model="showFeaturesLandUse"
                class="mt-n1 ml-5"
                hide-details
            />
        </div>

        <LandUseFilter @onSearch="search()" />

        <div v-if="showFeaturesLandUse" class="px-4">
            <v-divider class="mt-1"></v-divider>
            <p class="font-weight-regular pt-2">Legenda:</p>
            <v-col>
                <v-row class="mb-2">
                    <v-icon class="mr-2" color="#ffff00">mdi-square</v-icon>
                    Agropecuária
                </v-row>
                <v-row class="mb-2">
                    <v-icon class="mr-2" color="#66ffff">mdi-square</v-icon>
                    Massa de Água
                </v-row>
                <v-row class="mb-2">
                    <v-icon class="mr-2" color="#cc9966">mdi-square</v-icon>
                    Vilarejo
                </v-row>
                <v-row class="mb-2">
                    <v-icon class="mr-2" color="#00cc00">mdi-square</v-icon>
                    Vegetação Natural
                </v-row>
                <v-spacer></v-spacer>
            </v-col>
        </div>

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
                    <v-btn
                        icon
                        color="accent"
                        @click="
                            changeVisualizationStage('stage3'), getDataTable()
                        "
                    >
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
            "title": "Land Use And Ocupation",
            "analytics-label": "Analytics",
            "map-label": "Map"
        },
        "pt-br": {
            "title": "Uso e Ocupação Do Solo",
            "analytics-label": "Analytics",
            "map-label": "Mapa"
        }
    }
</i18n>

<script>
import LandUseFilter from '@/components/land-use/LandUseFilter'
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
    components: { LandUseFilter },

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
        showFeaturesLandUse: {
            get() {
                return this.$store.state['land-use'].showFeatures
            },

            set(value) {
                this.$store.commit('land-use/setShowFeatures', value)
            },
        },
        ...mapState('land-use', [
            'showFeatures',
            'features',
            'table',
            'visualizationStage',
            'response',
            'params',
        ]),
    },

    methods: {
        search() {
            if (this.visualizationStage == 'stage1') this.getFeatures()
            if (this.visualizationStage == 'stage3') this.getDataTable()
        },
        searchDataTable() {
            this.getDataTable()
        },
        changeVisualizationStage(tab) {
            this.setVisualizationStage(tab)
        },
        ...mapActions('land-use', ['getFeatures', 'getDataTable']),
        ...mapMutations('land-use', ['setVisualizationStage']),
    },
}
</script>

<style scoped>
.container-height {
    max-height: 90vh;
}
</style>
