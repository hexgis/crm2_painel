<template>
    <l-layer-group :visible="showFeatures == true">
        <l-feature-group name="sceneGrid">
            <l-geo-json
                v-for="(scene, i) in allScenes"
                :key="i"
                ref="grid"
                :geojson="scene"
                :options-style="styles.default"
                @mouseenter="setGrid(i)"
                @mouseleave="setGrid(null)"
            >
            </l-geo-json>
        </l-feature-group>

        <l-layer-group>
            <template v-for="(scene, index) in allScenes">
                <l-image-overlay
                    :key="`${index}_preview`"
                    :url="scene.properties.preview"
                    :bounds="getPreviewBbox(scene)"
                    :visible="scene.visible"
                />
                <l-tile-layer
                    v-if="scene.properties.wmts"
                    :key="`${index}_wmts`"
                    :url="getWmtsUrl(scene)"
                    :visible="scene.wmtsVisible"
                    :options="{
                        maxZoom: 21,
                        maxNativeZoom: scene.properties.maxNativeZoom,
                    }"
                />
                <l-layer-group :key="`${index}_images`">
                    <l-image-overlay
                        v-for="(image, j) in scene.properties.images"
                        :key="j"
                        :url="image.preview || ''"
                        :bounds="getBounds(scene)"
                        :visible="image.visible || false"
                    />
                </l-layer-group>
            </template>
        </l-layer-group>

        <l-feature-group ref="diffGeom">
            <l-popup
                ref="popup"
                :options="{
                    minWidth: 350,
                    className: 'card-popup',
                }"
            ></l-popup>
        </l-feature-group>

        <BaseMetadataPopup
            v-show="false"
            ref="popupComponent"
            :feature="selectedDiffFeature"
        />
    </l-layer-group>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

import BaseMetadataPopup from '@/components/base/BaseMetadataPopup'

if (typeof window !== 'undefined') {
    require('leaflet.vectorgrid')
}

export default {
    name: 'ImageryLayers',

    components: { BaseMetadataPopup },

    props: {
        map: {
            type: Object,
            default: null,
        },
    },

    data: () => ({
        selectedGridLayer: null,
        selectedDiffFeature: null,
        vectorGrid: null,

        styles: {
            default: {
                weight: 1,
                color: '#4C527C',
                fill: null,
            },
            hover: {
                weight: 2.5,
                color: '#C2293D',
            },
            diff: {
                weight: 1,
                color: '#4C527C',
                fill: true,
                fillOpacity: 0.3,
            },
        },

        sideBySideControl: null,
    }),

    computed: {
        allScenes() {
            return this.scenes.concat(this.otherPageScenes)
        },

        ...mapState('imagery', [
            'scenes',
            'hoveredScene',
            'otherPageScenes',
            'zoomedScene',
            'diffGeom',
            'showFeatures',
        ]),

        ...mapGetters('imagery', ['visibleSceneImages']),
    },

    watch: {
        hoveredScene(scene) {
            this.controlLayerHighlight(scene)
        },

        zoomedScene(scene) {
            if (scene !== null) {
                this.map.flyToBounds(
                    this.$refs.grid[scene].mapObject.getBounds()
                )
                this.$store.commit('imagery/setZoomedScene', null)
            }
        },

        diffGeom() {
            this.$refs.diffGeom.mapObject.clearLayers()
            if (this.diffGeom && this.diffGeom.features) {
                this.map.flyToBounds(this.$L.geoJson(this.diffGeom).getBounds())

                this.vectorGrid = this.$L.vectorGrid
                    .slicer(this.diffGeom, {
                        maxZoom: 21,
                        zIndex: 2,
                        vectorTileLayerStyles: {
                            sliced: () => this.styles.diff,
                        },
                        interactive: true,
                        getFeatureId: (_) => {
                            return 1
                        },
                    })
                    .on('click', (e) => {
                        this.getFeatureDetails(e.layer.properties.id)
                    })
                    .addTo(this.$refs.diffGeom.mapObject)
            }
        },
    },

    methods: {
        setGrid(sceneIndex) {
            this.controlLayerHighlight(sceneIndex)
            this.setHoveredGridScene(sceneIndex)
        },

        controlLayerHighlight(scene) {
            if (scene !== null) {
                this.highlightLayer(this.$refs.grid[scene].mapObject)
            } else if (this.selectedGridLayer) {
                this.clearHighlight()
            }
        },

        highlightLayer(layer) {
            if (this.selectedGridLayer) {
                this.selectedGridLayer.setStyle(this.styles.default)
            }
            this.selectedGridLayer = layer
            this.selectedGridLayer.setStyle(this.styles.hover)
        },

        clearHighlight() {
            this.selectedGridLayer.setStyle(this.styles.default)
            this.selectedGridLayer = null
        },

        getPreviewBbox(scene) {
            if (scene.previewBbox) {
                return this.$L.latLngBounds(scene.previewBbox)
            } else {
                return this.getBounds(scene)
            }
        },

        getBounds(scene) {
            return this.$L.geoJSON(scene).getBounds()
        },

        getWmtsUrl(scene) {
            return (
                scene.properties.wmts +
                '?key=' +
                process.env.SKYNET_WMTS_API_KEY
            )
        },

        async getFeatureDetails(featureId) {
            this.selectedDiffFeature = null
            this.$nextTick(() => {
                this.$refs.popup.mapObject.setContent(
                    this.$refs.popupComponent.$el.innerHTML
                )
            })

            try {
                this.selectedDiffFeature = await this.$apiSkynet.$get(
                    'landsat/changes/detail/' + featureId + '/'
                )

                this.$nextTick(() => {
                    this.$refs.popup.mapObject.setContent(
                        this.$refs.popupComponent.$el.innerHTML
                    )
                })
            } catch (exception) {
                this.$store.commit('alert/addAlert', {
                    message:
                        'Não foi possível resgatar os dados do polígono,' +
                        ' entre em contato com um administrador caso persista.',
                })
            }
        },
        ...mapMutations('imagery', ['setHoveredGridScene']),
    },
}
</script>
