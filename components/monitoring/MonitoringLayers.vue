<template>
    <l-layer-group name="monitoring" :visible="showFeatures">
        <l-layer-group ref="monitoringHeat" :visible="heatMap" />

        <l-feature-group ref="monitoringPolygons">
            <l-popup
                ref="popup"
                :options="{
                    minWidth: 500,
                    className: 'card-popup',
                }"
            >
                <BaseMetadataPopup
                    ref="popupComponent"
                    :feature="selectedMonitoringFeature"
                />
            </l-popup>

            <l-geo-json
                v-if="!isVectorGrid && featuresLoaded"
                :geojson="features"
                :options="{ onEachFeature }"
                @ready="onMonitoringReady"
            />

            <!-- <BaseMetadataPopup
                v-show="false"
                ref="popupComponent"
                :feature="selectedMonitoringFeature"
            /> -->
        </l-feature-group>
    </l-layer-group>
</template>

<i18n>
{
    "en": {
        "detail-api-error": "Error while retrieving polygon data, contact a system administrator in case it persists."
    },
    "pt-br": {
        "detail-api-error": "Não foi possível resgatar os dados do polígono, entre em contato com um administrador caso persista."
    }
}
</i18n>

<script>
import { mapState, mapGetters } from 'vuex'

import BaseMetadataPopup from '@/components/base/BaseMetadataPopup'

if (typeof window !== 'undefined') {
    require('leaflet.vectorgrid')
    require('leaflet.heat')
}

export default {
    name: 'MonitoringLayers',

    components: {
        BaseMetadataPopup,
    },

    props: {
        map: {
            type: Object,
            default: null,
        },
    },

    data: () => ({
        selectedMonitoringFeature: null,
        heatmapLayer: null,

        isVectorGrid: process.env.MONITORING_VECTOR2TILES === 'true',
        vectorGrid: null,

        style: {
            weight: 2.5,
            color: '#8e391b',
            fill: true,
            fillOpacity: 1,
        },
    }),

    computed: {
        ...mapState('monitoring', [
            'features',
            'opacity',
            'heatMap',
            'showFeatures',
        ]),
        ...mapGetters('monitoring', ['featuresLoaded']),
    },

    watch: {
        features() {
            this.addFeatures()
        },

        map() {
            this.addFeatures()
        },

        opacity() {
            if (this.isVectorGrid) {
                this.vectorGrid.setFeatureStyle(1, {
                    ...this.style,
                    fillOpacity: this.opacity / 100,
                })
            } else {
                this.$refs.monitoringPolygons.mapObject.invoke(
                    'setStyle',
                    this.setMonitoringStyle
                )
            }
        },
    },

    methods: {
        addFeatures() {
            this.$refs.monitoringPolygons.mapObject.clearLayers()
            if (
                this.isVectorGrid &&
                this.features &&
                this.features.features &&
                this.features.features.length
            ) {
                this.createMonitoramentoHeatLayer()

                this.vectorGrid = this.$L.vectorGrid
                    .slicer(this.features, {
                        maxZoom: 21,
                        vectorTileLayerStyles: {
                            sliced: () => this.style,
                        },
                        interactive: true,
                        getFeatureId: (_) => {
                            return 1
                        },
                    })
                    .on('click', (e) => {
                        this.getFeatureDetails(e.layer.properties.id)
                        // this.$nextTick(() => {
                        //     e.layer.bindPopup(
                        //         () => this.$refs.popupComponent.$el
                        //     )
                        // })
                    })
                    .addTo(this.$refs.monitoringPolygons.mapObject)
            }
        },

        onEachFeature(feature, layer) {
            layer.setStyle(this.setMonitoringStyle(feature))

            layer.on('click', () => {
                this.getFeatureDetails(feature.properties.id)
            })
        },

        setMonitoringStyle(feature) {
            const style = this.style
            style.fillOpacity = this.opacity / 100

            switch (feature.properties.stage) {
                case 'CR':
                    style.color = '#965213'
                    break
                case 'DR':
                    style.color = '#337f1e'
                    break
                case 'FF':
                    style.color = '#ba1a1a'
                    break
                case 'DG':
                    style.color = '#e0790b'
                    break
            }
            return style
        },

        onMonitoringReady() {
            if (this.features.features && this.features.features.length) {
                this.map.fitBounds(
                    this.$refs.monitoringPolygons.mapObject.getBounds()
                )
                this.createMonitoramentoHeatLayer()
            }
        },

        async getFeatureDetails(featureId) {
            this.selectedMonitoringFeature = null
            // this.$nextTick(() => {
            //     this.$refs.popup.mapObject
            //         // .bindPopup(
            //         //     () => this.$refs.popupComponent.$el
            //         // )
            //         .setContent(this.$refs.popupComponent.$el.innerHTML)
            // })

            try {
                this.selectedMonitoringFeature = await this.$api.$get(
                    'monitoring/detail/' + featureId + '/'
                )

                // this.$nextTick(() => {
                //     // return this.$refs.popupComponent.$el
                //     // this.$refs.popup.mapObject.unbindPopup()

                //     this.$refs.popup.mapObject
                //         // .bindPopup(
                //         //     this.$refs.popupComponent.$el
                //         // )
                //         .setContent(this.$refs.popupComponent.$el.innerHTML)
                // })
            } catch (exception) {
                this.$store.commit('alert/addAlert', {
                    message: this.$t('detail-api-error'),
                })
                // return null
            }
        },

        createMonitoramentoHeatLayer() {
            const areas = this.features.features.map(
                (feature) => feature.properties.area_ha
            )
            const maxArea = Math.max.apply(null, areas)

            const heatData = []
            this.features.features.forEach((feature) => {
                heatData.push([
                    feature.properties.latitude,
                    feature.properties.longitude,
                    feature.properties.area_ha / maxArea, // normalize by maximum area
                ])
            })

            if (this.heatmapLayer)
                this.heatmapLayer.removeFrom(
                    this.$refs.monitoringHeat.mapObject
                )

            this.heatmapLayer = this.$L.heatLayer(heatData, {
                minOpacity: 0.5,
                maxZoom: 18,
                radius: 20,
                blur: 15,
                zIndex: 4,
            })

            this.heatmapLayer.addTo(this.$refs.monitoringHeat.mapObject)
        },
    },
}
</script>
