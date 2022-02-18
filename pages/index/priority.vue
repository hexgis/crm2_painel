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
            <h3>Legenda</h3>
            <br />
            <v-row>
                <v-col cols="5">
                    <v-icon color="#e3d212"> mdi-bookmark</v-icon>
                </v-col>
                <v-col cols="5">
                    <h4>Baixa</h4>
                </v-col>
                <v-col cols="5">
                    <v-icon color="#29871b"> mdi-bookmark</v-icon>
                </v-col>
                <v-col cols="5">
                    <h4>Muito Baixa</h4>
                </v-col>
                <v-col cols="5">
                    <v-icon color="#c26219"> mdi-bookmark</v-icon>
                </v-col>
                <v-col cols="5">
                    <h4>Média</h4>
                </v-col>
                <v-col cols="5">
                    <v-icon color="#a83232"> mdi-bookmark</v-icon>
                </v-col>
                <v-col cols="5">
                    <h4>Alta</h4>
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
            <v-footer
                absolute
                color="#FFFFFF"
                elevation="6"
                class="d-flex justify-center"
            >
                <v-img max-width="200" src="/img/logocmr_normal.png" />
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
</style>

