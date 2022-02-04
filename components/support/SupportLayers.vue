<template>
    <l-layer-group name="supportLayers" :visible="showFeatures">
        <template v-for="layer in supportLayers">
            <SupportLayerItem :key="layer.id" :layer="layer" />
        </template>
    </l-layer-group>
</template>

<script>
import { mapState } from 'vuex'

import SupportLayerItem from './SupportLayerItem'

export default {
    name: 'SupportLayers',

    components: {
        SupportLayerItem,
    },

    computed: mapState('supportLayers', ['supportLayers', 'showFeatures']),
}
</script>
