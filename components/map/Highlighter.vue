<template>
    <div class="d-flex mt-2">
        <v-tooltip right>
            <template #activator="{ on }">
                <v-btn
                    fab
                    ripple
                    height="36"
                    width="36"
                    class="button-drawer"
                    @click="selectDraw()"
                    v-on="on"
                >
                    <transition name="slide-x drawer-button">
                        <v-icon v-if="!show"> mdi-map-marker </v-icon>
                        <v-icon v-else class="back-icon">
                            mdi-arrow-left
                        </v-icon>
                    </transition>
                </v-btn>
            </template>
            <span> {{ $t('upload-hint') }} </span>
        </v-tooltip>

        <div class="drawer-block">
            <transition name="slide-x-drawer">
                <div v-if="show" class="upload-options-drawer file-button">
                    <span> {{ $t('upload-hint') }} </span>
                    <v-file-input
                        type="btn"
                        hide-input
                        prepend-icon="mdi-map-marker"
                        full-width
                    />
                </div>
            </transition>
            <transition name="slide-x-drawer">
                <div v-if="show">
                    <v-card
                        class="ml-6 mt-1"
                        min-width="350"
                        variant="outlined"
                    >
                        <v-card-actions class="pa-0">
                            <v-container class="pt-0">
                                <v-select
                                    v-model="coordType"
                                    :items="options"
                                    class="pt-0"
                                ></v-select>

                                <div v-if="coordType === $t('decimal-label')">
                                    <v-row>
                                        <v-col cols="6" class="py-0">
                                            <v-tooltip top>
                                                <template
                                                    #activator="{ on, attrs }"
                                                >
                                                    <v-text-field
                                                        v-model="lat"
                                                        placeholder="-8.62065"
                                                        class="decimal-field"
                                                        :class="latError"
                                                        suffix="°"
                                                        solo
                                                        flat
                                                        v-bind="attrs"
                                                        v-on="on"
                                                    />
                                                </template>
                                                <span>Latitude</span>
                                            </v-tooltip>
                                        </v-col>
                                        <v-col cols="6" class="py-0">
                                            <v-tooltip top>
                                                <template
                                                    #activator="{ on, attrs }"
                                                >
                                                    <v-text-field
                                                        v-model="lng"
                                                        class="decimal-field"
                                                        :class="lngError"
                                                        placeholder="-53.32244"
                                                        suffix="°"
                                                        solo
                                                        flat
                                                        v-bind="attrs"
                                                        v-on="on"
                                                    />
                                                </template>
                                                <span>Longitude</span>
                                            </v-tooltip>                                            
                                        </v-col>                              
                                    </v-row>                                   
                                </div>
                                <div v-if="coordType === $t('dms-label')">
                                    <v-row>
                                        <v-col cols="3" class="pt-0">
                                            <v-text-field
                                                v-model="degN"
                                                :placeholder="$t('degree-label')"
                                                class="dms-field"
                                                :class="degNError"
                                                suffix="°"
                                                solo
                                                hide-details
                                                flat
                                            />
                                        </v-col>
                                        <v-col cols="3" class="pt-0">
                                            <v-text-field
                                                v-model="minN"
                                                :placeholder="$t('minute-label')"
                                                class="dms-field"
                                                :class="minNError"
                                                suffix="'"
                                                solo
                                                hide-details
                                                flat
                                            />
                                        </v-col>
                                        <v-col cols="3" class="pt-0">
                                            <v-text-field
                                                v-model="secN"
                                                :placeholder="$t('second-label')"
                                                class="dms-field"
                                                :class="secNError"
                                                suffix='"'
                                                solo
                                                hide-details
                                                flat
                                            />
                                        </v-col>
                                        <v-col cols="3" class="pt-0">
                                            <v-btn
                                                v-if="!north"
                                                density="comfortable"
                                                @click="toggleActivate()"
                                            >
                                                <b>S</b>
                                            </v-btn>
                                            <v-btn
                                                v-if="north"
                                                density="comfortable"
                                                @click="toggleActivate()"
                                            >
                                                <b>N</b>
                                            </v-btn>
                                         </v-col>
                                    </v-row>
                                    <v-row >
                                        <v-col cols="3" class="pt-0">
                                            <v-text-field
                                                v-model="degW"
                                                :placeholder="
                                                    $t('degree-label')
                                                "
                                                class="dms-field"
                                                :class="degWError"
                                                suffix="°"
                                                solo
                                                hide-details
                                                flat
                                            />
                                        </v-col>
                                        <v-col cols="3" class="pt-0">
                                            <v-text-field
                                                v-model="minW"
                                                :placeholder="
                                                    $t('minute-label')
                                                "
                                                class="dms-field"
                                                :class="minWError"
                                                suffix="'"
                                                solo
                                                hide-details
                                                flat
                                            />
                                        </v-col>
                                        <v-col cols="3" class="pt-0">
                                            <v-text-field
                                                v-model="secW"
                                                :placeholder="
                                                    $t('second-label')
                                                "
                                                class="dms-field"
                                                :class="secWError"
                                                suffix='"'
                                                solo
                                                hide-details
                                                flat
                                            />
                                        </v-col>
                                        <v-col cols="3">
                                            <v-btn
                                                v-if="!east"
                                                density="comfortable"
                                                @click="toggleActivateEast()"
                                            >
                                                <b>W</b>
                                            </v-btn>

                                            <v-btn
                                                v-if="east"
                                                density="comfortable"
                                                @click="toggleActivateEast()"
                                            >
                                                <b>E</b>
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </div>
                                <v-btn @click="addMarker" class="mt-0">Add Marker</v-btn>
                                
                                <v-card-actions v-if="this.showEdit">
                                    <v-btn
                                        v-for="btn in buttonsEdit"
                                        :key="btn.icon"
                                        icon
                                        class="btn-tools"
                                        x-small
                                        @click="handleButtonEditClick(btn.type)"
                                    >
                                        <v-tooltip top>
                                            <template #activator="{ on }">
                                                <v-icon v-on="on">{{
                                                    btn.icon
                                                }}</v-icon>
                                            </template>
                                            {{ getTooltipText(btn.icon) }}
                                        </v-tooltip>
                                    </v-btn>
                                </v-card-actions>
                            </v-container>
                        </v-card-actions>
                        <v-card-actions v-if="isButtonEditClicked">
                            <div
                                class="row no-gutters align-center justify-space-between ml-1"
                            >
                               
                                <div class="col-4">
                                    <v-btn
                                        color="success"
                                        class="btn-action"
                                        @click.stop="save()"
                                    >
                                        <span>Save</span>
                                    </v-btn>
                                </div>
                                <div class="col-4">
                                    <v-btn
                                        v-if="isDeleteButtonActive"
                                        class="btn-action"
                                        color="accent"
                                        @click.stop="clearAllDrawings"
                                    >
                                        <span>Clear All</span>
                                    </v-btn>
                                </div>
                            </div>
                        </v-card-actions>
                    </v-card>
                </div>
            </transition>
        </div>
        <div id="map" style="height: 500px; width: 100%"></div>
        <BaseDialog
            v-if="downloadDialog"
            :label="$t('download-label')"
            :type="'Download'"
            @close="downloadDialog = false"
            @action="generateJson"
        />
        <BaseDialog
            v-if="saveDialog"
            :label="$t('save-label')"
            :type="'Save'"
            @close="saveDialog = false"
            @action="generateJson"
        />
    </div>
</template>

<i18n>
{
  "en": {
    "upload-hint": "Highlighter",
    "tooltips.mdi-pencil-box": "Edit",
    "tooltips.mdi-delete-outline": "Delete layers",
    "tooltips.mdi-database-plus-outline": "Save",
    "download-label": "Download",
    "save-label": "Save",
    "dms-label": "D.M.S.",
    "decimal-label": "Decimal",
    "degree-label": "Deg",
    "minute-label": "Min",
    "second-label": "Sec",
    "dms-north": "N",
    "dms-west": "W",
    "dms-south": "S",
    "dms-est": "E"
  },
  "pt-br": {
    "upload-hint": "Marcador",
    "tooltips.mdi-pencil-box": "Editar",
    "tooltips.mdi-delete-outline": "Delete layers",
    "tooltips.mdi-database-plus-outline": "Salvar",
    "download-label": "Baixar",
    "save-label": "Salvar",
    "dms-label": "G.M.S.",
    "decimal-label": "Decimal",
    "degree-label": "Grau",
    "minute-label": "Min",
    "second-label": "Seg",
    "dms-north": "N",
    "dms-west": "O",
    "dms-south": "S",
    "dms-est": "E"
  }
}
</i18n>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import BaseDialog from '@/components/map/drawing-tool/BaseDialog'
import getGeometryArea from '~/plugins/getGeometryArea'

const { stringify } = require('wkt')
const circleToPolygon = require('circle-to-polygon')

export default {
    name: 'Highlighter',

    components: {
        BaseDialog,
    },

    props: {
        map: {
            type: Object,
            default: null,
        },
        show: {
            type: Boolean,
            default: false,
        },
    },

    data: () => ({
        coordType: 'Decimal',
        options: ['Decimal', 'D.M.S.'],
        buttonsEdit: [
            { icon: 'mdi-pencil-box', type: 'Edit' },
            { icon: 'mdi-delete-outline', type: 'Delete' },
            { icon: 'mdi-database-plus-outline', type: 'Save' },
        ],
        createdControl: false,
        activeButton: null,
        drawingFinished: false,
        isButtonEditClicked: false,
        newValueContent: [],
        isDeleteButtonActive: false,
        loadingRelationship: false,
        downloadDialog: false,
        saveDialog: false,
        drawnItems: null,
        textBoxId: [],
        lat: '',
        lng: '',
        latError: '',
        lngError: '',
        degN: '',
        minN: '',
        secN: '',
        degW: '',
        minW: '',
        secW: '',
        north: true,
        east: true,
        degNError: '',
        minNError: '',
        secNError: '',
        degWError: '',
        minWError: '',
        secWError: '',
        drawnItems: L.featureGroup(),
        center: null,
        showEdit: false,
    }),

    watch: {
        show() {
            if (!this.show) {
                this.clearActiveButton()
                this.isButtonEditClicked = false
            }
        },
    },

    methods: {
        selectDraw() {
            this.show = !this.show
        },

        calculteDecimal(deg, min, sec) {
            return (
                parseFloat(deg) + parseFloat(min / 60) + parseFloat(sec / 3600)
            )
        },

        calculteNegativeDecimal(deg, min, sec) {
            return -(
                parseFloat(deg) +
                parseFloat(min / 60) +
                parseFloat(sec / 3600)
            )
        },

        addMarker() {
            let latitude
            let longitude
            let hasError = false

            if (this.coordType === this.$i18n.t('dms-label')) {
                // Check for errors in DMS fields
                if (
                    !this.degN ||
                    !this.minN ||
                    !this.secN ||
                    !this.degW ||
                    !this.minW ||
                    !this.secW ||
                    isNaN(this.degN) ||
                    isNaN(this.minN) ||
                    isNaN(this.secN) ||
                    isNaN(this.degW) ||
                    isNaN(this.minW) ||
                    isNaN(this.secW)
                ) {
                    if (!this.degN || isNaN(this.degN)) this.degNError = true
                    if (!this.minN || isNaN(this.minN)) this.minNError = true
                    if (!this.secN || isNaN(this.secN)) this.secNError = true
                    if (!this.degW || isNaN(this.degW)) this.degWError = true
                    if (!this.minW || isNaN(this.minW)) this.minWError = true
                    if (!this.secW || isNaN(this.secW)) this.secWError = true
                    hasError = true
                } else {
                    if (this.north) {
                        latitude = this.calculteDecimal(
                            this.degN,
                            this.minN,
                            this.secN
                        )
                    } else {
                        latitude = this.calculteNegativeDecimal(
                            this.degN,
                            this.minN,
                            this.secN
                        )
                    }

                    if (this.east) {
                        longitude = this.calculteDecimal(
                            this.degW,
                            this.minW,
                            this.secW
                        )
                    } else {
                        longitude = this.calculteNegativeDecimal(
                            this.degW,
                            this.minW,
                            this.secW
                        )
                    }
                }
            } else if (this.coordType === this.$i18n.t('decimal-label')) {
                // Check for errors in Decimal fields
                if (
                    !this.lat ||
                    !this.lng ||
                    isNaN(this.lat) ||
                    isNaN(this.lng)
                ) {
                    if (!this.lat || isNaN(this.lat)) this.latError = true
                    if (!this.lng || isNaN(this.lng)) this.lngError = true
                    hasError = true
                } else {
                    latitude = parseFloat(this.lat)
                    longitude = parseFloat(this.lng)
                }
            } else {
                hasError = true
            }

            if (hasError) {
                return
            }
            this.showEdit = true
            this.map.flyTo([latitude, longitude], 12)

            // Criar um novo marcador
            const novoMarcador = L.marker([latitude, longitude])

            // Adicionar o novo marcador ao mapa e ao grupo de itens desenhados
            novoMarcador.addTo(this.map)
            this.drawnItems.addLayer(novoMarcador)

            // Adicionar manipulador de evento de clique para exclusão
            novoMarcador.on('click', (e) => {
                if (this.isDeleteButtonActive) {
                    this.drawnItems.removeLayer(novoMarcador)
                }
            })

            // Atualizar o marcador central
            this.center = novoMarcador

            this.handleButtonEditClick()
            this.show = true
        },

        handleButtonEditClick(type) {
            this.isButtonEditClicked = true
            this.activeButton = null
            if (this.drawInstance) {
                this.drawInstance.disable()
            }
            if (type === 'Delete') {
                this.isDeleteButtonActive = true
            } else {
                this.isDeleteButtonActive = false
            }
            if (type === 'Edit' || type === 'Delete') {
                this.drawInstance = new this.$L.EditToolbar[type](this.map, {
                    featureGroup: this.drawnItems,
                })
                this.originalDrawnItems = this.drawnItems.toGeoJSON()
                this.drawInstance.enable()
            }
            if (type === 'Download') {
                this.isButtonEditClicked = false
                this.downloadDialog = true
            }
            if (type === 'Save') {
                this.isButtonEditClicked = false
                this.saveDialog = true
            }
        },

        clearAllDrawings() {
            if (this.drawnItems) {
                this.drawnItems.clearLayers()
                this.isButtonEditClicked = false
                this.drawInstance.disable()
                // Remove layers associated with IDs stored in textBoxId
                this.textBoxId.forEach((id) => {
                    const layerToRemove = this.map._layers[id]
                    if (layerToRemove) {
                        this.map.removeLayer(this.center)
                    }
                })
                // Clear the textBoxId array
                this.textBoxId = []
            }
        },

        removeMarker() {
            if (this.center) {
                this.map.removeLayer(this.center)
                this.center = null
            }
        },

        /**
         * Generates a JSON representation of the current drawing.
         *
         * @param {object} obj - An object representing the drawing.
         */
        generateJson(obj) {
            // Create an array to store circle geometries.
            const circles = []
            // Iterate through the layers in drawnItems.
            Object.values(this.drawnItems._layers).forEach((layer) => {
                // Check if the layer has a radius (is a circle).
                if (layer._mRadius) {
                    // Extract coordinates and create a polygon representing the circle.
                    const coordinates = [layer._latlng.lng, layer._latlng.lat]
                    const circle = markerToPolygon(
                        coordinates,
                        layer._mRadius,
                        512
                    )
                    circles.push(circle)
                }
            })
            // Convert drawnItems to GeoJSON format.
            const geometry = this.drawnItems.toGeoJSON()
            // Iterate through the circle geometries and add them to the GeoJSON.
            circles.forEach((circle) => {
                const circleGeojson = {
                    type: 'Feature',
                    geometry: {
                        coordinates: circle.coordinates,
                        type: circle.type,
                    },
                    properties: {},
                }
                geometry.features.push(circleGeojson)
            })
            // Define available actions for the drawing.
            const actions = {
                Download: () => this.downloadDraw(geometry, obj.name),
                Save: () => this.saveIntoDb(geometry, obj.name),
            }
            // Get the specified action based on obj.type and execute it.
            const action = actions[obj.type]
            if (action) {
                action()
            }
        },

        save() {
            // Disable the drawing functionality.
            this.setIsDrawing(false)
            // Iterate through all the drawn layers.
            Object.values(this.drawnItems._layers).forEach((layer) => {
                // Get the geometry area of the layer.
                this.contentPopupDraw = getGeometryArea(layer)
                // Add the area of the current drawing to the list of new content values.
                this.newValueContent.push({
                    content: this.contentPopupDraw,
                    id: layer._leaflet_id,
                })
                // Clear the list of new content values after the loop completes.
                this.$nextTick(() => {
                    this.newValueContent = []
                })
            })
            // Set the variable controlling the edit button to false.
            this.isButtonEditClicked = false
            // Disable the drawing functionality.
            this.drawInstance.disable()
        },

        saveIntoDb(geometry, name) {
            console.log(geometry)
            this.saveDrawToDatabase({ geometry, name })
            this.saveDialog = false
        },

        toggleActivate() {
            this.north = !this.north
        },
        toggleActivateEast() {
            this.east = !this.east
        },

        selectDraw() {
            this.$emit('toggleTool', 'Highlighter')
        },

        getTooltipText(icon) {
            const language = this.$i18n.locale
            return this.$t(`tooltips.${icon}`, null, language)
        },

        clearActiveButton() {
            this.activeButton = null
            if (this.drawInstance) {
                this.drawInstance.disable()
            }
        },

        ...mapActions('map', ['saveDrawToDatabase']),
        ...mapMutations('map', ['setIsDrawing']),
    },
}
</script>


<style lang="sass" scoped>
.back-icon
    transform: rotate(0deg)

.drawer-block
    margin-left: -18px
    overflow: hidden
    position: absolute
    left: 35px
    min-width: 300px
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

.btn-tools
    padding: 0px !important
    margin: 0px !important
    color: inherit !important

.slide-x-drawer-enter-active, .slide-x-drawer-leave-active
    transition: all 0.4s ease-out !important

.slide-x-drawer-enter, .slide-x-drawer-leave-to
    transform: translateX(-100%)

.slide-x-drawer-leave-active
    transition-delay: 0.3s !important

.decimal-field
        width: 105px

.error
    border: 2px solid red
    background-color: #ffe6e6
</style>

