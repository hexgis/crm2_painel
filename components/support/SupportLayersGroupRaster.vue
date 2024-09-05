<template>
    <v-list-group v-if="group" v-show="checkSearchLayer()" v-model="value">
        <template #activator>
            <template v-if="activeLayerCount > 0">
                <v-badge color="#b2b1b1" offset-x="-270" offset-y="10">
                    <template v-slot:badge>
                        {{ activeLayerCount }}
                    </template>
                </v-badge>
            </template>
            <v-list-item-content>
                <v-list-item-title class="text-wrap">
                    <span class="text-cursor">
                        {{ group.name }}
                    </span>
                </v-list-item-title>
            </v-list-item-content>

            <v-col v-if="group.name === 'Alta Resolução'">
                <div>
                    <v-tooltip>
                        <template #activator="{ on }">
                            <v-icon v-on="on" class="pb-4">
                                mdi-information
                            </v-icon>
                        </template>
                        <span>
                            O mosaico de imagens de alta resolução
                            <br />
                            é formado por imagens dos satélites Spot 6 e 7,
                            <br />
                            com uma resolução espacial de 1,5 metros,
                            <br />
                            abrangendo datas entre os anos de 2018 e 2019.
                            <br />
                        </span>
                    </v-tooltip>
                </div>
            </v-col>
        </template>

        <template v-if="!searchLayer">
            <v-container class="py-0">
                <v-list expand>
                    <SupportLayersGroupItemRaster
                        v-for="layer in orderedSupportLayers"
                        :key="layer"
                        :layer-id="layer"
                    />
                </v-list>
            </v-container>
        </template>

        <template v-else>
            <v-container class="py-0">
                <v-list expand>
                    <template v-for="layer in orderedSupportLayers">
                        <SupportLayersGroupItemRaster
                            v-if="includesLayers(layer)"
                            :key="layer"
                            :layer-id="layer"
                        />
                    </template>
                </v-list>
            </v-container>
        </template>
        <v-divider />
    </v-list-group>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import _ from 'lodash'
import SupportLayersGroupItemRaster from '@/components/support/SupportLayersGroupItemRaster'

export default {
    name: 'SupportLayersGroupRaster',

    components: { SupportLayersGroupItemRaster },

    props: {
        group: {
            type: Object,
            default: null,
        },
    },

    data: () => ({
        value: null,
    }),

    computed: {
        supportLayers() {
            return this.supportCategoryGroupsRaster[this.group.id].layers
        },

        orderedSupportLayers() {
            return _.sortBy(this.supportLayers, 'order')
        },

        activeLayers() {
            return this.orderedSupportLayers.filter(
                (layer) => this.supportLayersCategoryRaster[layer].visible
            )
        },

        activeLayerCount() {
            return this.activeLayers.length
        },

        ...mapState('supportLayers', [
            'supportCategoryGroupsRaster',
            'searchLayer',
            'filteredLayersId',
            'supportLayersCategoryRaster',
        ]),
    },

    methods: {
        checkSearchLayer() {
            if (this.searchLayer) {
                this.value = true
            }
            return true
        },

        includesLayers(id) {
            return this.filteredLayersId.includes(id)
        },

        ...mapMutations('supportLayers', [
            'setexpandAllLayers',
            'setretractAllLayers',
        ]),
    },
}
</script>
