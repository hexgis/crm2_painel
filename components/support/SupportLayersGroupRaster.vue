<template>
    <v-list-group v-if="group">
        <template #activator>
            <v-list-item-content>
                <v-list-item-title class="text-wrap">
                    <span class="text-cursor">
                        {{ group.name }}
                    </span>
                </v-list-item-title>
            </v-list-item-content>
        </template>

        <v-container class="py-0">
            <v-list expand>
                <template v-for="layer in orderedSupportLayers">
                    <SupportLayersGroupItemRaster
                        :key="layer"
                        :layer-id="layer"
                    />
                </template>
            </v-list>
        </v-container>

        <v-divider />
    </v-list-group>
</template>

<script>
import { mapState } from 'vuex'
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

    computed: {
        supportLayers() {
            return this.supportCategoryGroupsRaster[this.group.id].layers
        },

        orderedSupportLayers() {
            return _.sortBy(this.supportLayers, 'order')
        },

        ...mapState('supportLayers', ['supportCategoryGroupsRaster']),
    },
}
</script>
