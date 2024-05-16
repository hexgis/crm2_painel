<template>
    <l-layer-group name="supportLayers" :visible="showFeaturesSupportLayers">
        <template>
            <l-layer-group
                name="supportLayers"
                :visible="showFeaturesSupportLayers"
            >
                <template v-for="(layer, index) in supportLayers">
                    <SupportLayerItem :key="'layer_' + index" :layer="layer" />
                </template>
                <template
                    v-for="(layer, index) in supportLayersCategoryAntropismo"
                >
                    <SupportLayerItem
                        :key="'layer_antropismo_' + index"
                        :layer="layer"
                    />
                </template>
            </l-layer-group>
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

    computed: mapState('supportLayers', [
        'supportLayers',
        'showFeaturesSupportLayers',
        'supportLayersCategoryAntropismo',
    ]),
}
</script>
