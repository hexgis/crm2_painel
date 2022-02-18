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

        <v-container>
            <v-row class="center2">
                <v-col cols="6">
                    <h4>Cor</h4>
                </v-col>
                <v-col cols="6">
                    <h4>Classe</h4>
                </v-col>
                <v-col cols="6">
                    <v-card color="#ff4000" align="center">
                        <v-icon color="#FFFFFF"> mdi-terrain </v-icon>
                    </v-card>
                </v-col>
                <v-col cols="6">
                    <v-card align="center">
                        <h4>Alta</h4>
                    </v-card>
                </v-col>
                <v-col cols="6">
                    <v-card color="#ff751a" align="center">
                        <v-icon color="#FFFFFF"> mdi-terrain </v-icon>
                    </v-card>
                </v-col>
                <v-col cols="6">
                    <v-card align="center">
                        <h4>Média</h4>
                    </v-card>
                </v-col>
                <v-col cols="6">
                    <v-card color="#ffff00" align="center">
                        <v-icon color="#FFFFFF"> mdi-terrain </v-icon>
                    </v-card>
                </v-col>
                <v-col cols="6">
                    <v-card align="center">
                        <h4>Baixa</h4>
                    </v-card>
                </v-col>
                <v-col cols="6">
                    <v-card color="#00e600" align="center">
                        <v-icon color="#FFFFFF"> mdi-terrain </v-icon>
                    </v-card>
                </v-col>
                <v-col cols="6">
                    <v-card align="center">
                        <h4>Muito Baixa</h4>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <v-container>
            <v-divider></v-divider>
        </v-container>

        <v-container>
            <v-row align="center" justify="space-around">
                <v-btn
                    depressed
                    icon
                    color="accent"
                    @click="changeVisualizationStage('stage1')"
                >
                    <!-- Mapa -->
                    <v-icon large>mdi-map</v-icon>
                </v-btn>
                <v-btn
                    icon
                    color="accent"
                    @click="changeVisualizationStage('stage2')"
                >
                    <!-- Estatísticas -->
                    <v-icon large>mdi-chart-box</v-icon>
                </v-btn>
            </v-row>
        </v-container>
        <br /><br />
        <v-container>
            <v-footer absolute color="#FFFFFF" elevation="6">
                <v-img contain class="center" src="/img/logocmr_normal.png" />
            </v-footer>
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
        showFeaturesPriority: {
            get() {
                return this.$store.state.funai.showFeatures
            },

            set(value) {
                this.$store.commit('funai/setShowFeatures', value)
            },
        },
        ...mapState('funai', ['showFeatures', 'features']),
    },

    methods: {
        search() {
            this.getFeatures()
        },
        changeVisualizationStage(tab) {
            this.setVisualizationStage(tab)
        },
        ...mapActions('funai', ['getFeatures']),
        ...mapMutations('funai', ['setVisualizationStage']),
    },
}
</script>

<style scoped >
.center {
    display: block;
    margin-left: auto;
    margin-right: auto;
    max-width: 70%;
}
.center2 {
    margin-left: auto;
    margin-right: auto;
    max-width: 70%;
}
</style>

