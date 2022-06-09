<template>
    <l-layer-group name="alert" :visible="showFeatures">
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
                fillOpacity: 1,
            },
            DR: {
                weight: 2.5,
                color: '#337f1e',
                fill: true,
                fillOpacity: 1,
            },
            FF: {
                weight: 2.5,
                color: '#ba1a1a',
                fill: true,
                fillOpacity: 1,
            },
            DG: {
                weight: 2.5,
                color: '#e0790b', 
                fill: true,
                fillOpacity: 1,
            },
        },
    }),

    computed: {
        ...mapState('alert-urg', [
            'features',
            'opacity',
            'heatMap',
            'showFeatures',
        ]),
        ...mapGetters('alert-urg', ['featuresLoaded']),
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
                this.$refs.alertPolygons.mapObject.invoke(
                    'setStyle',
                    this.setMonitoringStyle
                )
            }
        },
    },

    methods: {
        vectorGridStyleFunction(no_estagio) {
            switch (no_estagio) {
                case 'CR':
                    return this.style.CR
                case 'DR':
                    return this.style.DR
                case 'FF':
                    return this.style.FF
                case 'DG':
                    return this.style.DG
                default:
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
                        // this.$nextTick(() => {
                        //     e.layer.bindPopup(
                        //         () => this.$refs.popupComponent.$el
                        //     )
                        // })
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

        setMonitoringStyle(feature) {
            const style = this.style
            style.fillOpacity = this.opacity / 100

            switch (feature.properties.no_estagio) {
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
            // this.$nextTick(() => {
            //     this.$refs.popup.mapObject
            //         // .bindPopup(
            //         //     () => this.$refs.popupComponent.$el
            //         // )
            //         .setContent(this.$refs.popupComponent.$el.innerHTML)
            // })

            try {
                this.selectedAlertFeature = await this.$api.$get(
                    'alerts/detail/' + featureId + '/'
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
                    feature.properties.nu_latitude,
                    feature.properties.nu_longitude,
                    feature.properties.nu_area_km2 / maxArea, // normalize by maximum area
                ])
            })

            if (this.heatmapLayer)
                this.heatmapLayer.removeFrom(
                    this.$refs.alertHeat.mapObject
                )

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