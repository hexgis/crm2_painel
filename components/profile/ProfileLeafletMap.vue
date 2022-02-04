<template>
    <div>
        <client-only>
            <v-card
                class="profile-map-container"
                :style="{
                    '--height': getMapHeight(),
                    '--width': getMapWidth(),
                }"
            >
                <v-card-title class="card-title">
                    <v-btn @click="exit()">
                        {{ $t('back-button') }}
                    </v-btn>
                    <v-spacer></v-spacer>
                    <span>{{ $t('bounding-box-title') }}</span>
                    <v-spacer></v-spacer>
                    <v-btn color="accent" @click="saveInitialExtent()">
                        {{ $t('ok-button') }}
                    </v-btn>
                </v-card-title>

                <map-view-box />

                <l-map ref="map" class="profile-map" :options="mapOptions">
                    <l-tile-layer
                        v-for="baseLayer in baseLayers"
                        :key="baseLayer.options.label"
                        :name="baseLayer.options.label"
                        :url="baseLayer.url"
                        :attribution="baseLayer.options.attribution"
                        layer-type="base"
                    >
                    </l-tile-layer>
                </l-map>
            </v-card>
        </client-only>
    </div>
</template>

<i18n>
{
    "en": {
        "back-button": "Cancel",
        "ok-button": "Save area",
        "bounding-box-title": "Define area to zoom in"
    },
    "pt" :{
        "back-button": "Cancelar",
        "ok-button": "Salvar área",
        "bounding-box-title": "Defina a área para aproximar"
    }
}
</i18n>

<script>
import MapViewBox from './MapViewBox.vue'

export default {
    components: {
        MapViewBox,
    },
    props: {
        initialBounds: {
            type: Object,
            default: () => null,
        },
        width: {
            type: String,
            default: () => '1000px',
        },
    },
    data: () => ({
        map: null,
        polygon: [],
        areaBounds: null,
        mapOptions: {
            zoomControl: true,
        },
    }),

    computed: {
        boundingBoxCoords() {
            return this.initialBounds && this.initialBounds.coordinates
                ? this.$L.GeoJSON.coordsToLatLngs(
                      this.initialBounds.coordinates[0]
                  )
                : []
        },
        baseLayers() {
            return [
                {
                    url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                    options: {
                        label: 'Open Street Map',
                        attribution:
                            '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
                        maxZoom: 21,
                        maxNativeZoom: 18,
                        zIndex: 1,
                    },
                },
            ]
        },
        bounds() {
            return this.areaBounds
        },
    },

    mounted() {
        this.$nextTick(() => {
            this.createMap()
        })
    },

    methods: {
        getMapHeight() {
            return this.$vuetify.breakpoint.mobile ? '92vh' : '632px'
        },
        getMapWidth() {
            return this.$vuetify.breakpoint.mobile ? '100vw' : '55vw'
        },
        exit() {
            this.$emit('toggle-map')
        },
        saveInitialExtent() {
            this.$emit('save-bounding-box', this.map.getBounds())
            this.exit()
        },
        createMap() {
            this.map = this.$refs.map.mapObject

            let areaBounds

            if (this.initialBounds && this.initialBounds.coordinates)
                areaBounds = this.$L.polygon(this.boundingBoxCoords)
            else {
                areaBounds = this.$L.polygon([
                    [-33.8689056, -73.9830625],
                    [5.2842873, -28.6341164],
                ])
            }

            this.areaBounds = areaBounds.getBounds()

            setTimeout(() => {
                this.$refs.map.mapObject.invalidateSize()
                this.$refs.map.mapObject.fitBounds(this.areaBounds)
            }, 100)
        },
    },
}
</script>
<style scoped lang="sass">
.profile-map-container
    width: var(--width)
    height: var(--height)
    padding: 0 3px 3px 3px
    background: linear-gradient(to bottom,rgb(30, 33, 50),rgb(44, 54, 73) 5%)
    overflow: hidden !important

.profile-map
    height: calc(100% - 68px)
    width: 100%

.card-title
    color: whitesmoke
</style>
