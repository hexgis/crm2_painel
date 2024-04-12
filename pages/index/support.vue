<template>
    <v-container class="pa-0">
        <div class="tab-header justify-space-between">
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
                    <span> Fonte de dados: Geoserver - FUNAI </span>
                </v-tooltip>
            </v-row>
            <v-switch
                v-show="!loading"
                v-model="showFeatures"
                class="mt-n1 ml-5"
                hide-details
            />
        </div>
        <v-list v-if="!$fetchState.pending" expand>
            <template v-for="group in orderedSupportLayersGroups">
                <SupportLayersGroupBase
                    :key="'group_' + group.id"
                    :group="group"
                />
            </template>
            <template v-for="group in orderedSupportLayersGroupsAntropismo">
                <SupportLayersGroupAntropismo
                    :key="'group_antropismo_' + group.id"
                    :group="group"
                />
            </template>
        </v-list>
        <div v-if="$fetchState.pending">
            <template v-for="i in 6">
                <v-skeleton-loader :key="i" type="text" class="mx-4 my-5" />
            </template>
        </div>
    </v-container>
</template>

<i18n>
{
    "en": {
        "title": "Layers"
    },
    "pt-br": {
        "title": "Camadas"
    }
}
</i18n>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'

import SupportLayersGroupBase from '@/components/support/SupportLayersGroupBase'
import SupportLayersGroupAntropismo from '@/components/support/SupportLayersGroupAntropismo'

export default {
    name: 'Support',

    components: { SupportLayersGroupBase, SupportLayersGroupAntropismo },

    transition: 'scroll-y-transition',

    async fetch() {
        if (!Object.keys(this.supportCategoryGroupsBase).length) {
            await this.$store.dispatch('supportLayers/getCategoryGroupsBase')
        }
        if (!Object.keys(this.supportCategoryGroupsAntropismo).length) {
            await this.$store.dispatch(
                'supportLayers/getCategoryGroupsAntropismo'
            )
        }
    },

    computed: {
        orderedSupportLayersGroups() {
            return _.sortBy(this.supportCategoryGroupsBase, 'order')
        },

        orderedSupportLayersGroupsAntropismo() {
            return _.sortBy(this.supportCategoryGroupsAntropismo, 'order')
        },

        showFeaturesAntropismo: {
            get() {
                return this.$store.state.supportLayers
                    .showFeaturesSupportLayersAntropismo
            },
            set(value) {
                this.$store.commit(
                    'supportLayers/setshowFeaturesSupportLayersAntropismo',
                    value
                )
            },
        },

        showFeatures: {
            get() {
                return this.$store.state.supportLayers.showFeaturesSupportLayers
            },
            set(value) {
                this.$store.commit(
                    'supportLayers/setshowFeaturesSupportLayers',
                    value
                )
            },
        },

        ...mapState('supportLayers', [
            'supportCategoryGroupsBase',
            'showFeaturesSupportLayersAntropismo',
            'supportCategoryGroupsAntropismo',
            'loading',
            'showFeaturesSupportLayers',
        ]),
    },
}
</script>

<style scoped></style>
