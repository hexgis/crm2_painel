<template>
    <l-layer-group name="monitoring">
        <l-lwms-tile-layer
            ref="monitoringPolygons"
            :base-url="wmsBaseUrl"
            :layers="wmsLayer"
            format="image/png"
            :transparent="true"
            :z-index="4"
            :visible="showFeatures"
        />
    </l-layer-group>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'MonitoringLayers',

    props: {
        map: {
            type: Object,
            default: null,
        },
    },

    data: () => ({
        wmsBaseUrl: process.env.MONITORING_GEOSERVER_URL,
        wmsLayer: process.env.MONITORING_GEOSERVER_LAYER,
        wmsStartDateParam: process.env.MONITORING_GEOSERVER_START_DATE_PARAM,
        wmsEndDateParam: process.env.MONITORING_GEOSERVER_END_DATE_PARAM,
    }),

    computed: {
        ...mapState('monitoring', ['showFeatures', 'opacity', 'filters']),
    },

    watch: {
        filters() {
            this.updateWmsUrl()
        },

        opacity() {
            this.updateWmsUrl()
        },
    },

    methods: {
        updateWmsUrl() {
            this.$refs.monitoringPolygons.mapObject.setUrl(
                this.wmsBaseUrl +
                    '&viewparams=' +
                    this.wmsStartDateParam +
                    ':' +
                    this.filters.startDate +
                    ';' +
                    this.wmsEndDateParam +
                    ':' +
                    this.filters.endDate +
                    '&env=opacity:' +
                    (this.opacity / 100).toFixed(2)
            )
        },
    },
}
</script>
