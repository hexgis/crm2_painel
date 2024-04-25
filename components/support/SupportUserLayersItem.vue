<template>
  <l-layer-group v-if="feature">
    <l-feature-group ref="features">
      <l-geo-json
        :geojson="feature"
        :visible="visible"
        :options-style="opacity"
        :options="{ onEachFeature, pointToLayer }"
      />
      <l-popup
        :options="{
          minWidth: 420,
          maxHeight: 420,
          className: 'card-popup',
        }"
      >
        <v-card>
          <v-tabs
            v-if="true"
            background-color="primary"
            dark
            class="fill-height"
          >
            <v-tab>
              {{ layer.name }}
            </v-tab>
            <v-tab-item>
              <v-card-text>
                <v-row
                  v-for="(value, field) in info"
                  :key="field"
                  :align="field.align"
                  class="mx-0 list-separator"
                  dense
                >
                  <v-col
                    cols="5"
                    class="text-right"
                  >
                    {{ field }}:
                  </v-col>
                  <v-col
                    cols="7"
                    class="text-subtitle-2"
                    tyle="overflow-wrap: anywhere"
                  >
                    {{ value || '-' }}
                  </v-col>
                </v-row>
              </v-card-text>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </l-popup>
    </l-feature-group>
  </l-layer-group>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'SupportUserLayersItem',

  props: {
    layer: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      feature: null,
      info: null,
      color: this.getRandomColor(),
    };
  },

  watch: {
    'layer.geometry': {
      deep: true,
      handler(newgeometry, oldgeometry) {
        if (newgeometry) {
          this.feature = this.layer.geometry;
        }
      },
    },
  },

  computed: {
    visible() {
      return this.layer.visible;
    },
    opacity() {
      return { fillOpacity: this.layer.opacity / 100 };
    },
    ...mapState('supportLayersUser', ['popupInfo']),
  },

  methods: {
    onEachFeature(feature, layer, latlng) {
      layer.setStyle(this.setStyle(feature));

      layer.on('click', () => {
        if (!this.popupInfo[feature.properties.id]) {
          this.getInfo(feature.properties.id);
        } else {
          this.info = this.popupInfo[feature.properties.id];
        }
      });
    },

    pointToLayer(feature, latlng) {
      return this.$L.circleMarker(latlng);
    },

    setStyle() {
      return {
        fillColor: this.color,
        weight: 2,
        color: this.color,
        radius: 6,
      };
    },

    rgbToHex(color) {
      const hexColor = color.toString(16);
      return hexColor.length < 2 ? `0${hexColor}` : hexColor;
    },

    getRandomColor() {
      const COLORDIFF = 40;
      const value = [
        Math.random() * 255,
        Math.random() * 255,
        Math.random() * 255,
      ];

      const red = value[0] > COLORDIFF ? value[0] - COLORDIFF : 0;
      const green = value[1] > COLORDIFF ? value[1] - COLORDIFF : 0;
      const blue = value[2] > COLORDIFF ? value[2] - COLORDIFF : 0;

      return (
        `#${
          this.rgbToHex(parseInt(red))
        }${this.rgbToHex(parseInt(green))
        }${this.rgbToHex(parseInt(blue))}`
      );
    },
    async getInfo(id) {
      await this.getLayersDetail({ id });
      this.info = this.popupInfo[id];
    },
    ...mapActions('supportLayersUser', ['getLayersDetail']),
  },
};
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
