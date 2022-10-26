<template>
    <l-layer-group name="alert" :visible="showFeaturesUrgentAlert">
        <l-layer-group ref="alertHeat" :visible="heatMap" />

        <l-feature-group ref="alertPolygons">
            <l-popup
                ref="popup"
                :options="{
                    minWidth: 500,
                    className: 'card-popup',
                }"
            >
                <BaseMetadataPopup
                    ref="popupComponent"
                    :feature="selectedAlertFeature"
                />
            </l-popup>

            <l-geo-json
                v-if="!isVectorGrid && featuresLoaded"
                :geojson="features"
                :options="{ onEachFeature }"
                @ready="onAlertReady"
            />
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
    name: 'AlertLayers',

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
        selectedAlertFeature: null,
        heatmapLayer: null,

        isVectorGrid: process.env.MONITORING_VECTOR2TILES === 'true',
        vectorGrid: null,

        style: {
            CR: {
                weight: 2.5,
                color: '#965213',
                fill: true,
                fillOpacity: null,
            },
            DR: {
                weight: 2.5,
                color: '#337f1e',
                fill: true,
                fillOpacity: null,
            },
            FF: {
                weight: 2.5,
                color: '#ba1a1a',
                fill: true,
                fillOpacity: null,
            },
            DG: {
                weight: 2.5,
                color: '#e0790b',
                fill: true,
                fillOpacity: null,
            },
        },
    }),

    computed: {
        ...mapState('urgent-alerts', [
            'features',
            'opacity',
            'heatMap',
            'showFeaturesUrgentAlert',
        ]),
        ...mapGetters('urgent-alerts', ['featuresLoaded']),
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
                this.vectorGrid.setFeatureStyle(2, {
                    ...this.style.DG,
                    fillOpacity: this.opacity / 100,
                })
                this.vectorGrid.setFeatureStyle(3, {
                    ...this.style.FF,
                    fillOpacity: this.opacity / 100,
                })
                this.vectorGrid.setFeatureStyle(4, {
                    ...this.style.DR,
                    fillOpacity: this.opacity / 100,
                })
                this.vectorGrid.setFeatureStyle(5, {
                    ...this.style.CR,
                    fillOpacity: this.opacity / 100,
                })
            } else {
                this.$refs.alertPolygons.mapObject.invoke(
                    'setStyle',
                    this.setMonitoringStyle
                )
            }
        },
    },

    methods: {
        vectorGridStyleFunction(no_estagio) {
            Object.keys(this.style).forEach((item) => {
                Object.keys(this.style[item]).forEach((i) => {
                    if (i == 'fillOpacity') {
                        this.style[item][i] = this.opacity / 100
                    }
                })
            })
            switch (no_estagio) {
                case 'CR':
                    return this.style.CR
                case 'DR':
                    return this.style.DR
                case 'FF':
                    return this.style.FF
                case 'DG':
                    return this.style.DG
            }
        },

        addFeatures() {
            this.$refs.alertPolygons.mapObject.clearLayers()
            if (
                this.isVectorGrid &&
                this.features &&
                this.features.features &&
                this.features.features.length
            ) {
                this.createMonitoramentoHeatLayer()
                this.flyTo()

                this.vectorGrid = this.$L.vectorGrid
                    .slicer(this.features, {
                        maxZoom: 21,
                        zIndex: 4,
                        vectorTileLayerStyles: {
                            sliced: (e) =>
                                this.vectorGridStyleFunction(e.no_estagio),
                        },
                        interactive: true,
                        getFeatureId: (e) => {
                            switch (e.properties.no_estagio) {
                                case 'CR':
                                    return 5
                                case 'DR':
                                    return 4
                                case 'FF':
                                    return 3
                                case 'DG':
                                    return 2
                                default:
                                    return 1
                            }
                        },
                    })
                    .on('click', (e) => {
                        this.getFeatureDetails(e.layer.properties.id)
                    })
                    .addTo(this.$refs.alertPolygons.mapObject)
            }
        },

        onEachFeature(feature, layer) {
            layer.setStyle(this.setMonitoringStyle(feature))

            layer.on('click', () => {
                this.getFeatureDetails(feature.properties.id)
            })
        },

        onAlertReady() {
            if (this.features.features && this.features.features.length) {
                this.map.fitBounds(
                    this.$refs.alertPolygons.mapObject.getBounds()
                )
                this.createMonitoramentoHeatLayer()
            }
        },

        async getFeatureDetails(featureId) {
            this.selectedAlertFeature = null

            try {
                this.selectedAlertFeature = await this.$api.$get(
                    'alerts/detail/' + featureId + '/'
                )
            } catch (exception) {
                this.$store.commit('alert/addAlert', {
                    message: this.$t('detail-api-error'),
                })
            }
        },

        flyTo() {
            this.features.features.forEach((feature) => {
                this.map.flyTo([
                    feature.properties.nu_latitude,
                    feature.properties.nu_longitude,
                ],10)
            })
        },

        createMonitoramentoHeatLayer() {
            const areas = this.features.features.map(
                (feature) => feature.properties.area_ha
            )
            const maxArea = Math.max.apply(null, areas)

            const heatData = []
            this.features.features.forEach((feature) => {
                heatData.push([
                    feature.properties.nu_latitude,
                    feature.properties.nu_longitude,
                    feature.properties.nu_area_km2 / maxArea,
                ])
            })

            if (this.heatmapLayer)
                this.heatmapLayer.removeFrom(this.$refs.alertHeat.mapObject)

            this.heatmapLayer = this.$L.heatLayer(heatData, {
                minOpacity: 0.5,
                maxZoom: 18,
                radius: 20,
                blur: 15,
                zIndex: 4,
            })
            this.heatmapLayer.addTo(this.$refs.alertHeat.mapObject)
        },
    },
}
</script>
