<template>
    <l-layer-group>
        <l-feature-group ref="feats">
            <l-popup
                :options="{
                    minWidth: 420,
                    maxHeight: 420,
                    className: 'card-popup',
                }"
            >
                <v-card>
                    <v-card-title class="mb-10 popup-card-title">
                        {{ $t('popup-title') }}
                    </v-card-title>
                    <v-card-text>
                        <v-row v-for="(value, field) in feature" :key="field">
                            <v-col
                                class="font-weight-black py-2 px-2 ml-3"
                                align="left"
                            >
                                {{ field }}
                            </v-col>
                            <v-col
                                class="align-end py-1 px-2 mr-3"
                                align="right"
                            >
                                {{ value || '-' }}
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </l-popup>
        </l-feature-group>
    </l-layer-group>
</template>
<script>
export default {
    props: {
        files: {
            type: Array,
            required: true,
        },
        map: {
            type: Object,
            default: null,
        },
        loading: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            vectorGrid: [],
            feature: null,
        }
    },

    watch: {
        'files.length': {
            deep: true,
            handler(newLength, oldLength) {
                this.addFeatureVector(newLength > oldLength)
            },
        },
    },

    methods: {
        hasGeometryOnFeature(feature, geometries) {
            return (
                feature.features.some((f) =>
                    geometries.includes(f.geometry.type)
                ) || false
            )
        },
        addFeatureVector(shouldFlyTo) {
            this.$refs.feats.mapObject.clearLayers()
            this.vectorGrid = []

            if (this.files.length) {
                this.files.forEach((f) => {
                    let newGrid
                    const color = f.color

                    if (
                        this.hasGeometryOnFeature(f.feature, [
                            'Point',
                            'MultiPoint',
                        ])
                    ) {
                        newGrid = this.$L
                            .geoJSON(f.feature, {
                                pointToLayer: (_, latlng) => {
                                    return this.$L.circleMarker(latlng)
                                },
                                onEachFeature: (feature, layer) => {
                                    layer.on({
                                        click: (_) =>
                                            (this.feature =
                                                feature.properties || null),
                                    })
                                    layer.setStyle({
                                        color,
                                        fillColor: color,
                                        fillOpacity: '0.8',
                                        fill: ![
                                            'LineString',
                                            'MultiLineString',
                                        ].includes(feature.geometry.type),
                                        radius: 6,
                                    })
                                },
                            })
                            .addTo(this.$refs.feats.mapObject)
                    } else {
                        newGrid = this.$L.vectorGrid
                            .slicer(f.feature, {
                                maxZoom: 21,
                                zIndex: 1,
                                vectorTileLayerStyles: {
                                    sliced: () => ({
                                        color,
                                        fillColor: color,
                                        fillOpacity: '0',
                                        fill: true,
                                        radius: 6,
                                    }),
                                },
                                interactive: true,
                                getFeatureId: (_) => {
                                    return 1
                                },
                            })
                            .on('click', (e) => {
                                this.feature = e.layer.properties || null
                            })
                            .addTo(this.$refs.feats.mapObject)
                    }

                    this.vectorGrid.push(newGrid)
                })

                if (shouldFlyTo) {
                    const bounds = this.$L
                        .geoJSON(this.files.at(-1).feature)
                        .getBounds()

                    if (bounds.getNorthEast() && bounds.getSouthWest())
                        this.map.flyToBounds(bounds)
                }

                this.$emit('loads')
            }
        },
    },
}
</script>

<i18n>
{
    "en":{
        "popup-title": "Properties"
    },
    "pt": {
        "popup-title": "Propriedades"
    }
}
</i18n>
<style lang="sass">
.popup-card
    padding: 15px 10px

.popup-card-title
    background: linear-gradient(to bottom,rgb(30, 33, 50),rgb(44, 54, 73))
    color: whitesmoke
</style>
