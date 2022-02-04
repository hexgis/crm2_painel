<template>
    <l-layer-group name="algorithmLayers">
        <template v-for="layer in layers">
            <l-lwms-tile-layer
                :key="layer.name"
                ref="wmsLayer"
                :base-url="wmsBaseUrl"
                :layers="layer.layer"
                format="image/png"
                :transparent="true"
                :z-index="3"
                :visible="layer.visible"
                :options="{
                    name: layer.name,
                    maxZoom: 21,
                    maxNativeZoom: 19,
                }"
            />
        </template>
    </l-layer-group>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'AlgorithmsLayers',

    data: () => ({
        wmsBaseUrl:
            'http://geoserver.xskylab.com:8080/geoserver/wms?env=opacity:1&',
    }),

    computed: mapState('algorithms', ['layers']),
}
</script>
