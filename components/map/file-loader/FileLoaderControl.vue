<template>
    <div class="d-flex mt-3">
        <v-tooltip right :disabled="showOptions">
            <template #activator="{ on }">
                <v-btn
                    fab
                    ripple
                    height="36"
                    width="36"
                    class="button-drawer"
                    @click="removeAllFeatures()"
                    v-on="on"
                >
                    <transition name="slide-x-file-drawer-button">
                        <v-icon v-if="!showOptions">mdi-folder-upload</v-icon>
                        <v-icon
                            v-if="showOptions"
                            :class="showOptions ? 'back-icon' : ''"
                            >mdi-arrow-up</v-icon
                        >
                    </transition>
                </v-btn>
            </template>
            <span> {{ $t('file-drawer') }} </span>
        </v-tooltip>

        <div class="drawer-block">
            <transition name="slide-x-file-drawer">
                <div
                    v-if="showOptions"
                    class="upload-options-drawer file-button"
                >
                    <span> {{ $t('upload-hint') }}</span>

                    <v-file-input
                        type="file"
                        hide-details
                        hide-input
                        ripple="false"
                        prepend-icon="mdi-folder-upload"
                        full-width
                        @change="loadFile"
                    >
                    </v-file-input>
                </div>
            </transition>
            <transition name="slide-y-file-drawer">
                <div v-if="showOptions" class="file-list">
                    <div
                        v-for="(file, i) of files"
                        :key="i"
                        class="file-list-box"
                    >
                        <div class="file-button-area">
                            <ConfirmButton
                                icon="mdi-delete-outline"
                                :icon-tooltip="$t('remove-feature-tooltip')"
                                @remove="remove(i)"
                            />
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                        icon
                                        class="go-to-icon"
                                        v-bind="attrs"
                                        v-on="on"
                                        @click="flyToBound(file.feature)"
                                    >
                                        <v-icon size="50">
                                            {{ 'mdi-navigation-outline' }}
                                        </v-icon>
                                    </v-btn>
                                </template>
                                <span>{{ $t('go-to-tooltip') }}</span>
                            </v-tooltip>
                        </div>

                        <span
                            class="file-name-span"
                            :title="file.name.length > 25 ? file.name : ''"
                        >
                            {{ file.name }}
                        </span>

                        <div
                            class="file-legend"
                            :style="{
                                '--background-color': `${file.color}30`,
                                '--color': file.color,
                                '--radius': hasGeometryOnFeature(file.feature, [
                                    'Polygon',
                                    'MultiPolygon',
                                    'LineString',
                                    'MultiLineString',
                                ])
                                    ? '2px'
                                    : '20px',
                            }"
                        ></div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<i18n>
{
    "en": {
        "go-to-tooltip": "Go to features",
        "remove-feature-tooltip": "Remove feature",
        "file-drawer": "Load a file",
        "upload-hint": "SHP, KML, KMZ, Json/GeoJson",
        "file-error-shapefile": "Problem reading Shapefile file.",
        "file-error-kmz": "Problem reading Kmz file.",
        "file-error-parsing-kmlz": "Found problems while parsing KMZ/KML file. Please, validate your file",
        "file-error-general": "File type not acceptable on system.",
        "file-error-internal": "Internal Error: "
    },
    "pt-br": {
        "go-to-tooltip": "Ir para feições",
        "remove-feature-tooltip": "Remover feição",
        "file-drawer": "Carregue um arquivo",
        "upload-hint": "SHP, KML, KMZ, Json/GeoJson",
        "file-error-shapefile": "Problema ao ler o arquivo Shapefile",
        "file-error-kmz": "Problema ao ler o arquivo KMZ.",
        "file-error-parsing-kmlz": "Problemas encontrados durante a análise do arquivo KMZ/KML. Por favor, valide o arquivo",
        "file-error-general": "Arquivo não aceito pelo sistema.",
        "file-error-internal": "Erro interno: "
    }
}
</i18n>

<script>
import shp from 'shpjs'
import omnivore from 'leaflet-omnivore'
import JSZip from 'jszip'
import ConfirmButton from '@/components/confirmButton/ConfirmButton.vue'

export default {
    components: {
        ConfirmButton,
    },

    props: {
        map: {
            type: Object,
            default: null,
        },

        files: {
            type: Array,
            required: true,
        },
    },

    data() {
        return {
            showOptions: false,
        }
    },
    computed: {
        fileLayer() {
            return this.$L.geoJSON(this.file)
        },
    },

    methods: {
        flyToBound(feature) {
            const bounds = this.$L.geoJSON(feature).getBounds()

            if (bounds.getNorthEast() && bounds.getSouthWest())
                this.map.flyToBounds(bounds)
        },
        hasGeometryOnFeature(feature, geometries) {
            return (
                feature.features.some((f) =>
                    geometries.includes(f.geometry.type)
                ) || false
            )
        },
        remove(index) {
            this.files.splice(index, 1)
        },

        removeAllFeatures() {
            this.showOptions = !this.showOptions
        },

        addToMap(data, name) {
            this.files.push({
                name,
                feature: data,
                color: this.getRandomColor(),
            })
        },

        rgbToHex(color) {
            const hexColor = color.toString(16)
            return hexColor.length < 2 ? `0${hexColor}` : hexColor
        },

        getRandomColor() {
            const COLORDIFF = 40
            const value = [
                Math.random() * 255,
                Math.random() * 255,
                Math.random() * 255,
            ]

            const red = value[0] > COLORDIFF ? value[0] - COLORDIFF : 0
            const green = value[1] > COLORDIFF ? value[1] - COLORDIFF : 0
            const blue = value[2] > COLORDIFF ? value[2] - COLORDIFF : 0

            return (
                '#' +
                this.rgbToHex(parseInt(red)) +
                this.rgbToHex(parseInt(green)) +
                this.rgbToHex(parseInt(blue))
            )
        },

        fileError(error, message) {
            this.$emit('loads')
            this.$store.commit('alert/addAlert', {
                message: `${message}. ${
                    error
                        ? `${this.$i18n.t('file-error-internal')} ${
                              error.message
                          }`
                        : ''
                }`,
            })
        },

        loadGeojsonFile(evt, name) {
            const json = JSON.parse(evt.target.result)

            this.addToMap(json, name)
        },

        loadShpFile(evt, name) {
            shp(evt.target.result)
                .then((data) => {
                    this.addToMap(this.$L.geoJSON(data).toGeoJSON(), name)
                })
                .catch((error) =>
                    this.fileError(error, this.$i18n.t('file-error-shapefile'))
                )
        },

        loadKmlFile(evt, name) {
            const geoJson = omnivore.kml.parse(evt.target.result).toGeoJSON()

            if (geoJson.features && geoJson.features.length)
                this.addToMap(geoJson, name)
            else this.fileError(null, this.$i18n.t('file-error-parsing-kmlz'))
        },

        loadKmzFile(evt, name) {
            const zip = new JSZip()

            zip.loadAsync(evt.target.result)
                .then((e) => {
                    const firstFile = Object.keys(e.files)[0]
                    return e.file(firstFile).async('string')
                })
                .then((data) => {
                    const geoJson = omnivore.kml.parse(data).toGeoJSON()
                    if (geoJson.features && geoJson.features.length)
                        this.addToMap(geoJson, name)
                    else
                        this.fileError(
                            null,
                            this.$i18n.t('file-error-parsing-kmlz')
                        )
                })
                .catch((error) =>
                    this.fileError(error, this.$i18n.t('file-error-kmz'))
                )
        },

        loadFileMethod(type) {
            switch (type) {
                case 'application/zip':
                    return this.loadShpFile
                case 'application/vnd.google-earth.kmz':
                    return this.loadKmzFile
                case 'application/vnd.google-earth.kml+xml':
                    return this.loadKmlFile
                case 'application/geo+json':
                case 'application/json':
                    return this.loadGeojsonFile
                default:
                    return null
            }
        },

        readFile(file, fileReader) {
            switch (file.type) {
                case 'application/zip':
                case 'application/vnd.google-earth.kmz':
                    return fileReader.readAsArrayBuffer(file)
                case 'application/vnd.google-earth.kml+xml':
                case 'application/geo+json':
                case 'application/json':
                    return fileReader.readAsText(file)
                default:
                    return this.fileError(
                        null,
                        this.$i18n.t('file-error-general')
                    )
            }
        },

        loadFile(f) {
            this.$emit('loading')

            const reader = new FileReader()
            reader.onload = (e) => this.$emit('load', e.target.result)

            const loadMethod = this.loadFileMethod(f.type)

            reader.addEventListener('load', (evt) => loadMethod(evt, f.name))

            this.readFile(f, reader)
        },
    },
}
</script>

<style lang="sass">
.file-name-span
    width: 169px
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis

.file-button-area
    display: flex
    flex-direction: row
    padding-right: 10px

.go-to-icon
    transform: rotate(45deg)
    opacity: 0.4

.go-to-icon:hover
    opacity: 1

.file-legend
    width: 16px
    height: 16px
    margin-left: 20px
    border-radius: var(--radius)
    background-color: var(--background-color)
    border: 2px solid var(--color)

.back-icon
    transform: rotate(-90deg)

.drawer-block
    margin-left: -18px
    overflow: hidden

    .upload-options-drawer
        position: relative
        z-index: 2
        display: flex
        align-items: center
        justify-content: space-between
        background-color: white
        border-radius: 4px 40px 40px 4px
        background-color: white
        transition: ease all 0.6s
        padding-left: 35px

        span
            font-size: 15px
            margin-right: 10px
            opacity: 0.27
            user-select: none

        div
            margin: 0px !important
            padding: 0px !important

        .v-input
            display: flex
            align-items: center
            justify-content: center
            border: 1px solid rgba(0, 0, 0, 0.2)
            background-color: rgb(215, 215, 215)
            border-radius: 40px
            height: 36px
            width: 36px
            max-width: 36px

        .v-icon
            color: #111
            padding: 5px

    .file-list
        position: relative
        z-index: 1
        margin: 5px 10px 0 50px
        padding-bottom: 5px
        transition: ease all 0.6s

        .file-list-box
            display: flex
            justify-content: space-between
            position: relative
            z-index: 1
            align-items: center
            background-color: white
            border-radius: 40px
            border: 1px solid rgba(0, 0, 0, 0.1)
            padding: 1px 20px 1px 0
            margin: 2px 0
            transition: 0.2s all ease

            span
                font-weight: bold
                font-size: 14px
                user-select: none

.slide-x-file-drawer-enter-active, .slide-x-file-drawer-leave-active
    transition: all 0.4s ease-out !important

.slide-x-file-drawer-enter, .slide-x-file-drawer-leave-to
    transform: translateX(-100%)

.slide-y-file-drawer-enter-active, .slide-y-file-drawer-leave-active
    transition: all 0.4s ease-out !important

.slide-y-file-drawer-enter, .slide-y-file-drawer-leave-to
    transform: translateY(-200%)

.slide-x-file-drawer-leave-active
    transition-delay: 0.3s !important

.slide-y-file-drawer-enter-active
    transition-delay: 0.2s !important
</style>
