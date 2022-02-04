<template>
    <v-container>
        <div class="tab-header flex justify-space-between">
            <h4 class="subtitle-2 text-uppercase font-weight-regular">
                {{ $t('title') }}
            </h4>
            <v-switch
                v-if="hasFeatures"
                v-model="showFeatures"
                class="mt-n1 ml-5"
                hide-details
            />
        </div>

        <FunaiFilter @onSearch="search()" />
        <v-container>
            <v-divider></v-divider>
        </v-container>
            <v-card class="px-3 pt-4">
                <v-card-title class="text-center justify-center py-1">
                    <!-- <h4>Visualization Stages</h4> -->
                </v-card-title>
                <v-tabs
                    v-model="tab"
                    background-color="blue accent-2"
                    centered
                    dark
                    icons-and-text
                >
                    <v-tabs-slider></v-tabs-slider>

                    <v-tab href="#stage1" @click="changeVisualizationStage">
                        Map-Stage
                        <v-icon large>mdi-web</v-icon>
                    </v-tab>
                    <v-tab href="#stage2" @click="changeVisualizationStage">
                        Analytcal-Stage
                        <v-icon large>mdi-file-chart-outline</v-icon>
                    </v-tab>
                </v-tabs>
                <v-tabs-items v-model="tab">
                    <v-tab-item v-for="i in 2" :key="i" :value="'stage' + i">
                        <v-card flat>
                            <v-card-text>{{ text }}</v-card-text>
                        </v-card>
                    </v-tab-item>
                </v-tabs-items>
            </v-card>

            <v-container>
                <v-divider></v-divider>
            </v-container>
        </v-card>

        </v-card>
        <v-container>
            <v-tabs>
                <v-tabs>
                     <v-btn fab dark small @click="changeVisualizationStage">
                        <v-icon dense> mdi-web </v-icon>
                     </v-btn>
                </v-tabs>
                <v-tabs>
                    <v-btn fab dark small @click="changeVisualizationStage">
                        <v-icon dense> mdi-chart-bar </v-icon>
                    </v-btn>
                </v-tabs>
            </v-tabs>
        </v-container>
        <v-container>
            <div aling-center>
            <v-divider></v-divider>
            <h1>Legenda:</h1>
            <h5>*em implementação*</h5>
            </div>
        </v-container>
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
import FunaiFilter from '@/components/funai/MonitoringFilter'
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
    components: { FunaiFilter },

    data() {
        return {
            tab: null,
            items: ['MapStage', 'AnalytcalStage'],
            text: 'Texto de teste.',
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
        ...mapState('funai', ['showFeatures', 'features']),
    },

    methods: {
        search() {
            this.getFeatures()
        },
        changeVisualizationStage() {
            // console.log("Resualtado da Tab:", this.tab),
            this.setVisualizationStage(this.tab)
        },
        ...mapActions('funai', ['getFeatures']),
        ...mapMutations('funai', ['setVisualizationStage']),
        // ...mapGetters('funai', ['featuresLoaded']),
    },
}
</script>

<style scoped lang="sass"></style>
