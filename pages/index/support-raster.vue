<template>
    <v-container class="pa-0">
        <div class="tab-header justify-space-between">
            <v-row>
                <h6
                    class="subtitle-2 text-uppercase font-weight-regular tab-title"
                >
                    {{ $t('title') }}
                </h6>
                <v-tooltip>
                    <template #activator="{ on }">
                        <v-icon class="infoIconMargin" v-on="on">
                            mdi-information
                        </v-icon>
                    </template>
                    <span>Fonte de dados: Geoserver - FUNAI</span>
                </v-tooltip>
                <v-switch
                    v-show="!loading"
                    v-model="showFeatures"
                    class="mt-n1 switch-margin"
                    hide-details
                />
            </v-row>
        </div>
        <v-tabs
            v-model="tab"
            background-color="#D42A3E"
            centered
            dark
            icons-and-text
        >
            <v-tabs-slider></v-tabs-slider>
            <v-tab href="#tab-1">
                Landsat/Sentinel
                <v-icon>mdi-satellite-variant</v-icon>
            </v-tab>

            <v-tab href="#tab-2">
                Planet
                <v-icon>mdi-earth</v-icon>
            </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
            <v-tab-item value="tab-1">
                <v-card flat>
                    <v-col cols="12" class="pb-0 mb-n8">
                        <v-autocomplete
                            v-model="selectedLayers"
                            :label="$t('search-label')"
                            multiple
                            clearable
                            :items="orderedSupportLayersGroupsItens"
                            :item-text="(layer) => layer.name"
                            outlined
                            :search-input.sync="searchInput"
                            @input="searchInput = null"
                            @click:clear="clearInput"
                        />
                    </v-col>
                    <v-col cols="12" class="pb-0 mb-n6">
                        <v-autocomplete
                            v-model="selectedYears"
                            :label="$t('search-label-years')"
                            multiple
                            clearable
                            :items="years"
                            outlined
                            :search-input.sync="searchInputYears"
                            @input="searchInputYears = null"
                            @click:clear="clearInput"
                        />
                    </v-col>
                    <v-list v-if="!$fetchState.pending" expand class="pt-0">
                        <template v-for="group in filteredGroups">
                            <SupportLayersGroupRaster
                                :key="group.id"
                                :group="group"
                                :open-group="searchLayer"
                                :isPlanet="false"
                            />
                        </template>
                    </v-list>
                </v-card>
            </v-tab-item>
            <v-tab-item value="tab-2">
                <v-card flat>
                    <v-col cols="12" class="pb-0 mb-n8">
                        <v-autocomplete
                            v-model="selectedLayers"
                            :label="$t('search-label-month')"
                            multiple
                            clearable
                            :items="orderedSupportLayersGroupsItensPlanet"
                            :item-text="(layer) => layer.name"
                            outlined
                            :search-input.sync="searchInput"
                            @input="searchInput = null"
                            @click:clear="clearInput"
                        />
                    </v-col>
                    <v-col cols="12" class="pb-0 mb-n6">
                        <v-autocomplete
                            v-model="selectedYears"
                            :label="$t('search-label-years')"
                            multiple
                            clearable
                            :items="years"
                            outlined
                            :search-input.sync="searchInputYears"
                            @input="searchInputYears = null"
                            @click:clear="clearInput"
                        />
                    </v-col>
                    <v-list v-if="!$fetchState.pending" expand class="pt-0">
                        <template v-for="group in filteredGroups">
                            <SupportLayersGroupRaster
                                :key="group.id"
                                :group="group"
                                :open-group="searchLayer"
                                :isPlanet="true"
                            />
                        </template>
                    </v-list>
                </v-card>
            </v-tab-item>
        </v-tabs-items>
        <div v-if="$fetchState.pending">
            <v-skeleton-loader
                v-for="i in 6"
                :key="i"
                type="text"
                class="mx-4 my-5"
            />
        </div>
    </v-container>
</template>

<i18n>
{
  "en": {
    "search-label": "Search layer",
    "search-label-years": "Search layer years",
    "search-label-month": "Search layer month",
    "title": "High Resolution and Mosaics"
  },
  "pt-br": {
    "search-label": "Buscar camada",
    "search-label-years": "Buscar camada por ano",
    "search-label-month": "Buscar camada por mês",
    "title": "Alta Resolução e Mosaicos"
  }
}
</i18n>

<script>
import { mapState, mapMutations } from 'vuex'
import _ from 'lodash'
import SupportLayersGroupRaster from '@/components/support/SupportLayersGroupRaster'

export default {
    name: 'SupportRaster',
    components: { SupportLayersGroupRaster },

    data: () => ({
        showFooter: process.env.SHOW_FOOTER === 'true',
        selectedLayers: [],
        searchInput: '',
        searchLayer: false,
        selectedYears: [],
        searchInputYears: '',
        searchInputMonths: '',
        tab: null,
    }),

    async fetch() {
        if (!Object.keys(this.supportCategoryGroupsRaster).length) {
            await this.$store.dispatch('supportLayers/getCategoryGroupsRasters')
        }
    },

    computed: {
        years() {
            const currentYear = new Date().getFullYear()
            return Array.from(
                { length: currentYear - 2014 },
                (v, i) => 2015 + i
            )
        },

        orderedSupportLayersGroups() {
            return _.sortBy(this.supportCategoryGroupsRaster, 'order')
        },

        orderedSupportLayersGroupsItens() {
            return _.sortBy(this.supportLayersCategoryRaster, 'order')
        },

        orderedSupportLayersGroupsItensPlanet() {
            return _.chain(this.supportLayersCategoryRaster)
                .filter((item) => {
                    return /^\d{2} - /.test(item.name)
                })
                .sortBy('order')
                .value()
        },

        showFeatures: {
            get() {
                return this.$store.state.supportLayers
                    .showFeaturesSupportLayersRaster
            },
            set(value) {
                this.$store.commit(
                    'supportLayers/setshowFeaturesSupportLayersRaster',
                    value
                )
            },
        },

        groupsFilteredByYear() {
            if (!this.selectedYears.length) {
                return this.orderedSupportLayersGroups
            }

            return this.orderedSupportLayersGroups.filter((group) => {
                const groupYearMatch = group.name.match(/\d{4}$/)
                const groupYear = groupYearMatch
                    ? parseInt(groupYearMatch[0])
                    : null
                return groupYear && this.selectedYears.includes(groupYear)
            })
        },

        groupsFilteredByLayer() {
            if (this.selectedLayers.length) {
                this.setSearchLayer(true)
                let filteredLayersId = []
                const filteredItens = []
                const filteredGroup = []
                for (const filter of this.selectedLayers) {
                    filteredItens.push(
                        ...this.orderedSupportLayersGroupsItens.filter(
                            (layer) => layer.name === filter
                        )
                    )
                }
                for (const group of this.orderedSupportLayersGroups) {
                    const { layers } = group
                    for (const layer of layers) {
                        for (const item of filteredItens) {
                            if (item.id === layer) {
                                filteredLayersId = filteredLayersId.concat(
                                    item.id
                                )
                                if (!filteredGroup.includes(group)) {
                                    filteredGroup.push(group)
                                }
                            }
                        }
                    }
                }
                this.setFilteredLayers(filteredLayersId)
                return filteredGroup
            }
            this.setSearchLayer(false)
            this.setFilteredLayers(null)
            return _.sortBy(this.orderedSupportLayersGroups, 'order')
        },

        filteredGroups() {
            const yearFilteredGroups = this.groupsFilteredByYear
            const layerFilteredGroups = this.groupsFilteredByLayer

            return yearFilteredGroups.filter((group) =>
                layerFilteredGroups.includes(group)
            )
        },
        ...mapState('supportLayers', [
            'supportCategoryGroupsRaster',
            'supportLayersCategoryRaster',
            'loading',
            'showFeaturesSupportLayersRaster',
        ]),
    },

    methods: {
        ...mapMutations('supportLayers', {
            setFilteredLayers: 'setFilteredLayers',
            setSearchLayer: 'setSearchLayer',
        }),
        clearInput() {
            this.selectedLayers = []
            this.searchInput = ''
        },
    },
}
</script>
