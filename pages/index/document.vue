<template>
    <v-container class="d-flex flex-column">
        <div class="tab-header flex justify-space-between">
            <h4 class="subtitle-2 text-uppercase font-weight-regular">
                {{ $t('title') }}
            </h4>
            <v-switch
                v-if="features"
                v-model="showFeaturesMonitoring"
                class="mt-n1 ml-5"
                hide-details
            />
        </div>
        <v-card-text>
            <p>Ambiente de pesquisa de documentos de acordo com as ações.</p>

            <v-list-item-content style="list-style: circle">
                <v-list-item-title class="list__text mb-4 font-weight-black"
                    >Ações Disponíveis:</v-list-item-title
                >
                <ul v-for="(item, index) in items" :key="index">
                    <li>{{ item.value }}</li>
                </ul>
            </v-list-item-content>
        </v-card-text>

        <v-btn color="accent" class="" @click="showDialog(true)">
            {{ $t('input-label') }}
        </v-btn>
        <div v-if="showDialogDocument">
            <DocumentDialog />
        </div>
        <v-divider v-if="showFeatures" class="mt-8 mb-5" />
        <div>
            <v-row v-if="total" class="px-3 py-1">
                <v-row v-if="showFeatures && total">
                    <v-col cols="7" class="grey--text text--darken-2">
                        {{ $t('polygon-label') }}:
                    </v-col>
                    <v-col cols="5" class="text-right">
                        {{ total.total }}
                    </v-col>
                </v-row>
                <v-row v-if="showFeatures && total && total.area_ha">
                    <v-col cols="7" class="grey--text text--darken-2">
                        {{ $t('total-area-label') }}:
                    </v-col>
                    <v-col cols="5" class="text-right">
                        {{
                            total.area_ha.toLocaleString($i18n.locale, {
                                maximumFractionDigits: 2,
                            })
                        }}
                        ha
                    </v-col>
                </v-row>
            </v-row>
            <v-row v-if="showFeatures" align="center">
                <v-col cols="4" class="grey--text text--darken-2">
                    {{ $t('opacity-label') }}
                </v-col>
                <v-col cols="8">
                    <v-slider
                        v-model="opacity"
                        class="my-n2"
                        hide-details
                        thumb-label
                    />
                </v-col>
            </v-row>
            <v-row v-if="showFeatures" align="center" justify="space-between">
                <v-col>
                    <span class="grey--text text--darken-2">
                        {{ $t('heat-map-label') }}
                    </span>
                </v-col>
                <v-col cols="3" class="d-flex justify-end">
                    <v-switch
                        v-model="heatMap"
                        class="mt-0 pt-0"
                        hide-details
                    />
                </v-col>
            </v-row>
        </div>
        <v-footer
            absolute
            class="priority-footer"
            color="#FFFFFF"
            elevation="4"
        >
            <v-col>
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
            "title": "Document",
            "analytics-label": "Analytics",
            "map-label": "Map",
            "input-label": "Search",
            "table-name": "Monitoring Table"
        },
        "pt-br": {
            "title": "Documental",
            "analytics-label": "Analytics",
            "map-label": "Mapa",
            "input-label": "Pesquisar",
            "table-name": "Tabela de Monitoramento"
        }
    }
</i18n>

<script>
import DocumentDialog from '@/components/document-dialog/DocumentDialog'
import { mapActions, mapMutations, mapState } from 'vuex'
export default {
    components: { DocumentDialog },
    data() {
        return {
            items: [
                { value: 'Alerta Urgentes' },
                { value: 'FIP DGM' },
                { value: 'Fiscalização(2016)' },
                { value: 'Fiscalização(2017)' },
                { value: 'Fundo Amazônia' },
                { value: 'Gestão Territorial e Ambiental' },
                { value: 'Prevenção (2016)' },
                { value: 'Prevenção (2017)' },
                { value: 'Projeto PNUD (TIs Vulveráveis)' },
                { value: 'Vigilância' },
            ],
        }
    },
    computed: {
        ...mapState('document', [
            'showDialogDocument',
            'showFeatures',
            'features',
            'total',
        ]),
    },
    methods: {
        showDialog(value) {
            this.setShowDialogDocument(value)
        },

        ...mapMutations('document', ['setShowDialogDocument']),
    },
}
</script>

<style scoped>
.list__text {
    font-size: 0.875rem;
    margin-bottom: 3px;
    list-style: circle !important;
}
</style>
