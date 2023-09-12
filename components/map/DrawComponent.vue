<template>
  <div class="d-flex mt-2">
    <v-tooltip
      right
      :disabled="!startDrawPopup"
    >
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
            <v-icon v-if="!startDrawPopup">
              {{ getIcon() }}
            </v-icon>
            <v-icon
              v-if="startDrawPopup"
              :class="startDrawPopup ? 'back-icon' : ''"
            >
              mdi-arrow-up
            </v-icon>
          </transition>
        </v-btn>
      </template>
      <span> {{ $t('display-draw') }} </span>
    </v-tooltip>
    <div class="transition-block">
      <transition name="slide-x-drawer">
        <div
          v-if="
            initialIcon == 'mdi-window-minimize' ||
              initialIcon == 'mdi-hexagon'
          "
          class="ml-6"
        >
          <template v-for="(btn, index) in drawOptions">
            <v-tooltip
              v-if="btn.type == 'Cancel'"
              :key="index"
              top
            >
              <template
                v-if="btn.type == 'Cancel'"
                #activator="{ on }"
              >
                <v-btn
                  :class="getClass($vuetify.breakpoint.name)"
                  v-on="on"
                  @click="cancel(btn.type, btn.icon)"
                >
                  {{ $t(btn.tooltip) }}
                </v-btn>
              </template>
              <span> {{ $t(btn.tooltip) }} </span>
            </v-tooltip>
          </template>
        </div>
        <div
          v-if="initialIcon == 'mdi-delete-outline'"
          class="ml-6 "
        >
          <template v-for="(btn, index) in drawOptions">
            <v-tooltip
              v-if="btn.type == 'Finish'"
              :key="index"
              top
            >
              <template
                v-if="btn.type == 'Finish'"
                #activator="{ on }"
              >
                <v-btn
                  :class="getClass($vuetify.breakpoint.name)"
                  v-on="on"
                  @click="finish(btn.type, btn.icon)"
                >
                  {{ $t(btn.tooltip) }}
                </v-btn>
              </template>
              <span> {{ $t(btn.tooltip) }} </span>
            </v-tooltip>
          </template>
        </div>
        <div
          v-if="
            initialIcon == 'mdi-pencil-box' ||
              initialIcon == 'mdi-arrow-expand-all'
          "
          class="ml-6"
        >
          <template v-for="(btn, index) in drawOptions">
            <v-tooltip
              v-if="btn.type == 'Save'"
              :key="index"
              top
            >
              <template
                v-if="btn.type == 'Save'"
                #activator="{ on }"
              >
                <v-btn
                  :class="getClass($vuetify.breakpoint.name)"
                  v-on="on"
                  @click="save(btn.type, btn.icon)"
                >
                  {{ $t(btn.tooltip) }}
                </v-btn>
              </template>
              <span> {{ $t(btn.tooltip) }} </span>
            </v-tooltip>
          </template>
        </div>
        <div
          v-if="startDrawPopup"
          class="drawer"
        >
          <template v-for="(btn, index) in drawOptions">
            <v-tooltip
              v-if="
                btn.type != 'Cancel' &&
                  btn.type != 'Finish' &&
                  btn.type != 'Save' &&
                  btn.type != 'Buffer'
              "
              :key="index"
              top
            >
              <template #activator="{ on }">
                <v-icon
                  v-on="on"
                  @click="
                    createDrawControl(btn.type, btn.icon)
                  "
                >
                  {{ btn.icon }}
                </v-icon>
                <v-divider
                  v-if="btn.type == 'Edit'"
                  vertical
                  class="mx-2"
                />
              </template>
              <span> {{ $t(btn.tooltip) }} </span>
            </v-tooltip>
          </template>
          <v-tooltip
            v-if="hasDraw && user"
            top
          >
            <template #activator="{ on }">
              <v-icon
                v-on="on"
                @click="saveDraw=true"
              >
                mdi-database-plus-outline
              </v-icon>
            </template>
            <span> {{ $t('save-label') }} </span>
          </v-tooltip>
          <v-tooltip
            v-if="hasDraw "
            top
          >
            <template #activator="{ on }">
              <v-icon
                v-on="on"
                @click="download=true"
              >
                mdi-download
              </v-icon>
            </template>
            <span> {{ $t('download-label') }} </span>
          </v-tooltip>
          <v-btn
            fab
            ripple
            height="36"
            width="36"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </div>
      </transition>
    </div>
    <div v-if="drawnItems">
      <div
        v-for="layer in drawnItems._layers"
        :key="layer._leaflet_id"
        class="d-none"
      >
        <DrawPopup
          :ref="'componentPopupContent' + layer._leaflet_id"
          :layer="layer"
          :type="currentType"
          :value-content="contentPopupDraw"
          :new-value-content="newValueContent"
          :relationship="searchLayersRelationship"
        />
      </div>
    </div>
    <v-dialog
      v-model="saveDraw"
      max-width="400"
    >
      <v-card>
        <v-card-title>
          {{ $t('save-label') }}
          <v-spacer />
          <v-btn
            icon
            class="mr-n5 mt-n5"
            @click="saveDraw = false"
          >
            <v-icon> mdi-close </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="py-6">
          <p>{{ $t('info-text') }}</p>
          <v-row>
            <v-col>
              <v-text-field
                v-model="name"
                :label="$t('field-label')"
                outlined
                required
                hide-details
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            color="accent"
            :disabled="!name"
            @click="generateJson('saveIntoDb')"
          >
            {{ $t('save-label') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="download"
      max-width="400"
    >
      <v-card>
        <v-card-title>
          {{ $t('save-label') }}
          <v-spacer />
          <v-btn
            icon
            class="mr-n5 mt-n5"
            @click="download = false"
          >
            <v-icon> mdi-close </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="py-6">
          <p>{{ $t('info-text') }}</p>
          <v-row>
            <v-col>
              <v-text-field
                v-model="downloadName"
                :label="$t('field-label')"
                outlined
                required
                hide-details
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            color="accent"
            :disabled="!downloadName"
            @click="generateJson('downloadDraw')"
          >
            {{ $t('download-label') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<i18n>
{
    "en": {
        "polyline-label": "Draw a polyline",
        "polygon-label": "Draw a polygon",
        "rectangle-label": "Draw a rectangle",
        "circle-label": "Draw a circle",
        "marker-label": "Draw a marker",
        "circlemarker-label": "Draw a circle marker",
        "textbox-label": "Text box",
        "edit-label": "Edit layers",
        "remove-label": "Delete layers",
        "cancel-label": "Cancel",
        "save-label": "Save",
        "download-label": "Download",
        "finish-label": "Finish",
        "buffer-label": "Buffer",
        "text-label": "Delete last point",
        "start-label": "Click and drag to draw",
        "draw-label": "Click map to place marker",
        "start-draw": "Click to start drawing",
        "cont-draw": "Click to continue drawing",
        "end-line": "Double click to finish",
        "end-polygon": "Click first point to close this shape",
        "end-draw": "Release mouse to finish drawing.",
        "display-draw": "Draw an area of ​​interest",
        "edit-draw": "Drag vertices or markers to edit and click Save",
        "remove-draw": "Select a feature to remove and click Finish",
        "area-popup-label": "Area",
        "distance-popup-label": "Distance",
        "position-popup-label": "Position",
        "radius-popup-label": "Radius",
        "info-text": "Enter layer name",
        "field-label": "Name",
        "layers-active-label": "No active layer."
    },
    "pt-br": {
        "polyline-label": "Desenhar uma linha",
        "polygon-label": "Desenhar um poligono",
        "rectangle-label": "Desenhar um retangulo",
        "circle-label": "Desenhar um círculo",
        "marker-label": "Desenhar um ponto",
        "circlemarker-label": "Desenhar um ponto circular",
        "textbox-label": "Caixa de texto",
        "edit-label": "Editar desenho",
        "remove-label": "Apagar desenho",
        "cancel-label": "Cancelar",
        "save-label": "Salvar",
        "download-label": "Baixar",
        "finish-label": "Finalizar",
        "buffer-label": "Buffer",
        "text-label": "Excluir último ponto desenhado",
        "start-label": "Clique e arraste para desenhar",
        "draw-label": "Clique no mapa para colocar um ponto",
        "start-draw": "Clique para começar a desenhar",
        "cont-draw": "Clique para continuar a desenhar",
        "end-line": "Duplo clique para finalizar",
        "end-polygon": "Clique no primeiro ponto para finalizar",
        "end-draw": "Solte o mouse para terminar de desenhar",
        "display-draw": "Desenhe uma área de interesse",
        "edit-draw": "Arraste vértices ou marcadores para editar e clique em Salvar.",
        "remove-draw": "Selecione uma feição para remover e clique em Finalizar",
        "area-popup-label": "Área",
        "distance-popup-label": "Distância",
        "position-popup-label": "Posição",
        "radius-popup-label": "Raio",
        "info-text": "Digite o nome da camada",
        "field-label": "Nome",
        "layers-active-label": "Nenhuma camada ativa."
    }
}
</i18n>

<script>
/* eslint-disable no-underscore-dangle --
 * Underscore attributes defined by "Leafleat" plugin
 */

import { mapState, mapMutations, mapActions } from 'vuex';
import DrawPopup from './DrawPopup.vue';
import getGeometryArea from '~/plugins/getGeometryArea';

const { stringify } = require('wkt');
const circleToPolygon = require('circle-to-polygon');

export default {
  name: 'DrawComponent',
  components: {
    DrawPopup,
  },

  props: {
    map: {
      type: Object,
      default: null,
    },
  },

  data: () => ({
    activeType: false,
    drawnItems: null,
    drawControl: null,
    hasDraw: false,
    enableDrawComponent: false,
    initialIcon: 'mdi-pencil',
    createdControl: false,
    enableDrawer: null,
    contentPopupDraw: '',
    newValueContent: [],
    name: null,
    downloadName: null,
    saveDraw: false,
    download: false,
    currentType: '',
    drawOptions: {
      Polyline: {
        icon: 'mdi-window-minimize',
        tooltip: 'polyline-label',
        type: 'Polyline',
      },
      Polygon: {
        icon: 'mdi-hexagon',
        tooltip: 'polygon-label',
        type: 'Polygon',
      },
      Rectangle: {
        icon: 'mdi-checkbox-blank',
        tooltip: 'rectangle-label',
        type: 'Rectangle',
      },
      Circle: {
        icon: 'mdi-checkbox-blank-circle',
        tooltip: 'circle-label',
        type: 'Circle',
      },
      Marker: {
        icon: 'mdi-map-marker',
        tooltip: 'marker-label',
        type: 'Marker',
      },
      CircleMarker: {
        icon: 'mdi-panorama-fisheye',
        tooltip: 'circlemarker-label',
        type: 'CircleMarker',
      },
      TextBox: {
        icon: 'mdi-format-text',
        tooltip: 'textbox-label',
        type: 'TextBox',
      },
      Edit: {
        icon: 'mdi-pencil-box',
        tooltip: 'edit-label',
        type: 'Edit',
      },
      Remove: {
        icon: 'mdi-delete-outline',
        tooltip: 'remove-label',
        type: 'Delete',
      },
      Buffer: {
        icon: 'mdi-arrow-expand-all',
        tooltip: 'buffer-label',
        type: 'Buffer',
      },
      Cancel: {
        icon: 'mdi-pencil',
        tooltip: 'cancel-label',
        type: 'Cancel',
      },
      Save: {
        icon: 'mdi-pencil',
        tooltip: 'save-label',
        type: 'Save',
      },
      Finish: {
        icon: 'mdi-pencil',
        tooltip: 'finish-label',
        type: 'Finish',
      },
    },
  }),

  computed: {
    ...mapState('map', ['openDrawPopup', 'startDrawPopup', 'buttonPopup']),
    ...mapState('supportLayers', ['supportLayers']),
    ...mapState('searchInArea', ['layersGroups']),
    ...mapState('userProfile', ['user']),
  },

  watch: {
    openDrawPopup() {
      if (this.openDrawPopup) {
        this.selectDraw();
        this.setOpenDrawPopup();
      }
    },

    buttonPopup() {
      this.activePopup(this.buttonPopup.type, this.buttonPopup.layer);
    },
  },

  methods: {

    selectDraw() {
      this.setStartDrawPopup(!this.startDrawPopup);
    },

    save(type, icon) {
      if (type === 'Save') {
        this.enableDraw(false);
        this.initialIcon = icon;
        Object.values(this.drawnItems._layers).forEach(
          (layer) => {
            this.contentPopupDraw = getGeometryArea(layer);
            this.newValueContent.push({
              content: this.contentPopupDraw,
              id: layer._leaflet_id,
            });
            this.$nextTick(() => {
              this.newValueContent = [];
            });
          },
        );
        this.enableDrawer.disable();
        this.activeType = false;
      }
    },

    cancel(type, icon) {
      if (type === 'Cancel') {
        this.enableDraw(false);
        this.initialIcon = icon;
        this.enableDrawer.disable();
      }
    },

    finish(type, icon) {
      if (type === 'Finish') {
        this.hasDraw = Object.keys(this.drawnItems._layers).length > 0;
        this.enableDraw(false);
        this.initialIcon = icon;
        this.enableDrawer.disable();
      }
    },

    activePopup(type, layerId) {
      if (type === 'Delete') {
        this.map.removeLayer(this.drawnItems._layers[layerId]);
        delete this.drawnItems._layers[layerId];
        this.hasDraw = Object.keys(this.drawnItems._layers).length > 0;
      }
      if ((type === 'Edit' || type === 'Buffer') && !this.activeType) {
        this.initialIcon = 'mdi-pencil-box';
        const allLayers = Object.values(this.drawnItems._layers);
        const selectedLayer = allLayers.filter(
          (layer) => layer._leaflet_id === layerId,
        );
        const editingLayer = new this.$L.FeatureGroup();
        editingLayer._layers = selectedLayer;
        editingLayer._map = this.drawnItems._map;
        editingLayer._mapToAdd = this.drawnItems._mapToAdd;
        this.enableDrawer = new this.$L.EditToolbar[type](this.map, {
          featureGroup: editingLayer,
        });
        this.enableDrawer.enable();
        this.activeType = true;
      }
    },

    openTextBox() {
      this.$nextTick(() => {
        const customLayer = new this.$L.CustomLayer({
          map: this.map,
        });
        customLayer.addTo(this.map);
      });
    },

    addLabelDraw() {
      this.$L.drawLocal.edit.handlers.edit.tooltip = {
        text: this.$i18n.t('edit-draw'),
      };

      this.$L.drawLocal.edit.handlers.remove.tooltip = {
        text: this.$i18n.t('remove-draw'),
      };

      this.$L.drawLocal.draw.toolbar.undo = {
        text: this.$i18n.t('text-label'),
      };

      this.$L.drawLocal.draw.handlers.circle.tooltip = {
        start: this.$i18n.t('start-label'),
      };

      this.$L.drawLocal.draw.handlers.rectangle.tooltip = {
        start: this.$i18n.t('start-label'),
      };

      this.$L.drawLocal.draw.handlers.circlemarker.tooltip = {
        start: this.$i18n.t('draw-label'),
      };

      this.$L.drawLocal.draw.handlers.marker.tooltip = {
        start: this.$i18n.t('draw-label'),
      };
      this.$L.drawLocal.draw.handlers.polygon.tooltip = {
        start: this.$i18n.t('start-draw'),
        cont: this.$i18n.t('cont-draw'),
        end: this.$i18n.t('end-polygon'),
      };

      this.$L.drawLocal.draw.handlers.polyline.tooltip = {
        start: this.$i18n.t('start-draw'),
        cont: this.$i18n.t('cont-draw'),
        end: this.$i18n.t('end-line'),
      };

      this.$L.drawLocal.draw.handlers.simpleshape.tooltip = {
        end: this.$i18n.t('end-draw'),
      };
    },

    createDrawControl(type, icon) {
      if (type !== 'TextBox') {
        this.currentType = type;
        this.enableDraw(true);
        if (!this.createdControl) {
          this.map.on('draw:created', this.finishDraw);
          this.map.on('draw:bufferstop', this.finishBuffer);
          this.drawnItems = new this.$L.FeatureGroup();
          this.map.addLayer(this.drawnItems);
          this.drawControl = new this.$L.Control.Draw({
            position: 'bottomright',
            edit: {
              featureGroup: this.drawnItems,
              buffer: {
                replacePolylines: true,
                separateBuffer: false,
              },
            },
          });
          this.addLabelDraw();
          this.createdControl = true;
        }

        if (this.enableDrawer) {
          this.enableDrawer.disable();
        }

        if (type === 'Edit' || type === 'Delete' || type === 'Buffer') {
          this.enableDrawer = new this.$L.EditToolbar[type](this.map, {
            featureGroup: this.drawnItems,
          });
        } else {
          this.enableDrawer = new this.$L.Draw[type](this.map);
        }
        this.enableDrawer.enable();

        if (icon) {
          this.initialIcon = icon;
        }
        this.selectDraw();
      } else this.openTextBox();
    },

    generateJson(type) {
      const circles = [];
      Object.values(this.drawnItems._layers).forEach(
        (layer) => {
          if (layer._mRadius) {
            const coordinates = [layer._latlng.lng, layer._latlng.lat];
            const circle = circleToPolygon(coordinates, layer._mRadius, 512);
            circles.push(circle);
          }
        },
      );
      const geometry = this.drawnItems.toGeoJSON();
      circles.forEach(
        (circle) => {
          const circleGeojson = {
            type: 'Feature',
            geometry: { coordinates: circle.coordinates, type: circle.type },
            properties: {},
          };
          geometry.features.push(circleGeojson);
        },
      );
      const actions = {
        downloadDraw: () => this.downloadDraw(geometry),
        saveIntoDb: () => this.saveIntoDb(geometry),
      };
      const action = actions[type];
      if (action) {
        action();
      }
    },

    downloadDraw(geometry) {
      const jsonStr = JSON.stringify(geometry);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = this.downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      this.download = false;
    },

    saveIntoDb(geometry) {
      this.saveDrawToDatabase({ geometry, name: this.name });
      this.saveDraw = false;
    },

    finishDraw(event) {
      if (this.enableDrawComponent) {
        this.hasDraw = true;
        const { layer } = event;
        this.contentPopupDraw = getGeometryArea(layer);
        this.drawnItems.addLayer(layer);
        this.map.addLayer(layer);
        this.selectDraw();
        this.initialIcon = 'mdi-pencil';
        this.$nextTick(() => {
          const content = this.$refs[`componentPopupContent${layer._leaflet_id}`][0].$el;
          layer.bindPopup(content, {
            className: 'draw-popup card-popup',
          });
        });
        setTimeout(() => {
          this.enableDraw(false);
        }, 100);
      }
    },

    finishBuffer() {
      const layerId = [];
      Object.values(this.drawnItems._layers).forEach((layer) => {
        layerId.push(layer._leaflet_id);
        if (layer instanceof this.$L.Polyline) {
          layer.bringToFront();
        }
      });

      this.map.eachLayer((layer) => {
        if (layer.buffered === false) {
          if (!layerId.includes(layer._leaflet_id)) {
            this.contentPopupDraw = getGeometryArea(layer);
            this.drawnItems.addLayer(layer);
            this.$nextTick(() => {
              const content = this.$refs[
                `componentPopupContent${layer._leaflet_id}`
              ][0].$el;
              layer.bindPopup(content, {
                className: 'draw-popup card-popup',
              });
            });
          }
        }
      });
    },

    async searchLayersRelationship(layer, type) {
      this.setRequestTool('Draw');
      const layersActives = Object.values(this.supportLayers).filter((item) => item.visible)
        .map((item) => `${item.name}_${item.id}`);

      if (layersActives.length) {
        this.setStartDraw('relationship');
        if (!this.layersGroups) { await this.getGeoserverLayers(); }
        this.$router.push(this.localePath('/search-draw'));
        let wkt;
        const polygon = layer.toGeoJSON();
        if (type === 'Circle') {
          const coordinates = [polygon.geometry.coordinates[0], polygon.geometry.coordinates[1]];
          const raio = layer._mRadius;
          const circle = circleToPolygon(coordinates, raio, 32);
          wkt = stringify(circle);
        } else {
          wkt = stringify(polygon.geometry);
        }
        const cqlFilter = `INTERSECTS(geom,${wkt})`;
        this.setDraw(true);
        this.setCqlFilter(cqlFilter);
        this.setResultGroups(false);
        this.setSearch(layersActives);
      } else {
        this.$store.commit('alert/addAlert', {
          message: this.$t('layers-active-label'),
        });
      }
    },

    enableDraw(value) {
      this.enableDrawComponent = value;
      this.setIsDrawing(value);
    },

    getIcon() {
      return this.initialIcon;
    },

    getClass(name) {
      switch (name) {
        case 'xs': return 'mt-1 map-buttons';
        case 'sm': return 'mt-1 map-buttons';
        case 'md': return 'mt-1 map-buttons';
        case 'lg': return 'mt-1 map-buttons';
        case 'xl': return 'mt-2 map-buttons ';
        default:
          return 'map-buttons';
      }
    },

    ...mapMutations('map', ['setOpenDrawPopup', 'setStartDrawPopup', 'setIsDrawing',
      'setStartDraw']),
    ...mapMutations('searchInArea', ['setSearch', 'setResultGroups', 'setCqlFilter', 'setDraw', 'setRequestTool']),
    ...mapActions('searchInArea', ['getGeoserverLayers']),
    ...mapActions('map', ['saveDrawToDatabase']),
  },

};
</script>

<style lang="sass">
.icon-class
    cursor: pointer

.map-buttons
    color:#fff !important
    background-color:#C2293D !important
    min-width: 50px !important
    max-height:25px !important
    font-size: 0.65rem !important

.transition-block
    margin-left: -18px
    overflow: hidden
    position: absolute
    left: 35px

    .drawer
        overflow: hidden
        background-color: white
        border-radius: 4px 40px 40px 4px
        display: flex
        padding-left: 20px

        .v-btn
            border-radius: 40px
            min-width: 30px
            background-color: rgb(215, 215, 215)
            box-shadow: none
            border: 1px solid rgba(0, 0, 0, 0.1)

        .v-icon
            color: #111
            padding: 5px

.slide-x-drawer-enter-active, .slide-x-drawer-leave-active
    transition: all 0.4s ease-out !important

.slide-x-drawer-enter, .slide-x-drawer-leave-to
    transform: translateX(-100%)

.slide-x-drawer-leave-active
    transition-delay: 0.3s !important

.draw-popup
    .leaflet-popup-content
        padding: 15px

    .leaflet-popup-close-button
        padding: 2px !important
</style>
