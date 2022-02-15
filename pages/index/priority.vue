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
        <!-- <v-tabs-items v-model="tab">
                    <v-tab-item v-for="i in 2" :key="i" :value="'stage' + i">
                        <v-card flat>
                            <v-card-text>{{ text }}</v-card-text>
                        </v-card>
                    </v-tab-item>
                </v-tabs-items> -->

        <v-container>
        <v-divider></v-divider>
        </v-container>
        <v-container>
            <v-footer absolute color="white">
                <v-img contain max-width="60%" src="/img/logocmr_normal.png" />
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

<style scoped lang="sass"></style>
