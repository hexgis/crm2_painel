<template>
    <v-container class="overflow-auto container-height">
        <div class="tab-header">
            <v-row>
                <h4 class="subtitle-2 text-uppercase font-weight-regular">
                    {{ $t('title') }}
                </h4>
                <v-tooltip>
                    <template #activator="{ on }">
                        <v-icon class="mr-2 ml-2" v-on="on">
                            mdi-information
                        </v-icon>
                    </template>
                    <span>
                        O Monitoramento é baseado na interpretação
                        <br />
                        visual do Landsat-8 com intervalo de 32 dias.
                        <br />
                        As detecções do monitoramento são contempladas
                        <br />
                        a partir de 30 de agosto de 2015 (variável por
                        órbita-ponto).
                    </span>
                </v-tooltip>
            </v-row>
            <v-switch
                v-if="features"
                v-model="featuresMonitoring"
                class="mt-n1"
                hide-details
            />
        </div>

        <div>
            <MonitoringFilter @onSearch="search()" />
        </div>
        <div
            v-if="showFeaturesMonitoring && !isLoadingFeatures"
            class="mt-3 mx-4"
        >
            <v-divider />
            <p class="font-weight-regular pt-2 grey--text text--darken-2">
                Legenda:
            </p>
            <v-col class="grey--text text--darken-2">
                <v-row>
                    <v-col>
                        <v-icon class="mr-2" color="#990099">mdi-square</v-icon>
                        <span class="grey--text text--darken-2">
                            Desmatamento em Regeneração
                        </span>
                    </v-col>
                    <v-col cols="3" class="px-0 d-flex justify-end">
                        <v-switch
                            class="mt-0 pt-0"
                            v-model="dr"
                        ></v-switch> </v-col
                ></v-row>
                <v-row>
                    <v-col>
                        <v-icon class="mr-2" color="#ff3333">mdi-square</v-icon>
                        <span class="grey--text text--darken-2">
                            Fogo em Floresta
                        </span>
                    </v-col>
                    <v-col cols="3" class="px-0 d-flex justify-end">
                        <v-switch class="mt-0 pt-0" v-model="ff"></v-switch>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col>
                        <v-icon class="mr-2" color="#ff8000">mdi-square</v-icon>

                        <span class="grey--text text--darken-2">
                            Degradação
                        </span>
                    </v-col>
                    <v-col cols="3" class="px-0 d-flex justify-end">
                        <v-switch class="mt-0 pt-0" v-model="dg"></v-switch>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col>
                        <v-icon class="mr-2" color="#b35900">mdi-square</v-icon>
                        <span class="grey--text text--darken-2">
                            Corte Raso
                        </span>
                    </v-col>
                    <v-col cols="3" class="px-0 d-flex justify-end">
                        <v-switch class="mt-0 pt-0" v-model="cr"></v-switch>
                    </v-col>
                </v-row>

                <v-spacer />
            </v-col>
        </div>
        <ShowDialog />
        <v-footer absolute color="white" elevation="4">
            <v-col>
                <v-row class="d-flex justify-center">
                    <v-img max-width="200" src="/img/logo-inteira-antiga.svg" />
                </v-row>
            </v-col>
        </v-footer>
    </v-container>
</template>

<i18n>
    {
        "en": {
            "title": "Daily Monitoring"

        },
        "pt-br": {
            "title": "Monitoramento Diário"

        }
    }
</i18n>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import _ from 'lodash'
import MonitoringFilter from '@/components/monitoring/MonitoringFilter'
import ShowDialog from '@/components/show-dialog/ShowDialog'

export default {
    components: {
        MonitoringFilter,
        ShowDialog,
    },

    data() {
        return {
            tab: null,
            items: ['MapStage', 'AnalytcalStage'],
            text: 'Texto de teste.',
            timer: '',
            dialog: false,
            checkNewFilters: false,
            dr: true,
            ff: true,
            dg: true,
            cr: true,
        }
    },

    watch: {
        dr(newValue) {
            this.handleCheckboxChange(newValue, 'DR')
        },
        ff(newValue) {
            this.handleCheckboxChange(newValue, 'FF')
        },
        dg(newValue) {
            this.handleCheckboxChange(newValue, 'DG')
        },
        cr(newValue) {
            this.handleCheckboxChange(newValue, 'CR')
        },
    },

    computed: {
        hasFeatures() {
            return (
                !!this.features &&
                !!this.features.features &&
                this.features.features.length > 0
            )
        },

        featuresMonitoring: {
            get() {
                return this.$store.state.monitoring.showFeaturesMonitoring
            },

            set(value) {
                this.$store.commit(
                    'monitoring/setshowFeaturesMonitoring',
                    value
                )
            },
        },

        ...mapState('monitoring', [
            'showFeaturesMonitoring',
            'analyticsMonitoring',
            'features',
            'tableDialogMonitoring',
            'isLoadingFeatures',
            'isLoadingStatistic',
            'analyticsMonitoringDialog',
            'stageItemActive',
            'selectedStages',
            'setStageItemActive'
        ]),
    },

    methods: {
        async handleCheckboxChange(newValue, description) {
            if (newValue) {
                await this.updateDescription(description)
            } else {
                await this.removeDescription(description)
            }
        },

        updateStageItemList(){
            let stageItemActive = []
            this.features.features.map((item)=>{
            this.selectedStages.map((stageActive) => {
                stageActive === item.properties.no_estagio
                    ? stageItemActive.push(item) 
                    : ""
                    })
                })
             this.$store.commit('monitoring/setStageItemActive', stageItemActive)
        },
        
        async updateDescription(value) {
            this.updateStageItemList();
            this.$store.commit('monitoring/setSelectedStages', value)
            await this.updateFeatures()
        },

        async removeDescription(value) {
            this.$store.commit('monitoring/removeSelectedStages', value)
            this.updateStageItemList();
            await this.updateFeatures()
        },

        search() {
            if (this.tableDialogMonitoring) {
                this.checkNewFilters = true
                this.getDataTableMonitoring()
            }
            if (this.analyticsMonitoringDialog) {
                this.checkNewFilters = true
                this.isLoadingStatistic = true
                this.getDataAnalyticsMonitoringByFunaiYear()
            }
            if (!this.tableDialogMonitoring) this.getFeatures()
        },

        ...mapActions('monitoring', [
            'getFeatures',
            'updateFeatures',
            'getDataTableMonitoring',
            'getDataAnalyticsMonitoringByFunaiYear',
        ]),
    },
}
</script>

<style scoped>
.container-height {
    max-height: 90vh;
}
</style>
