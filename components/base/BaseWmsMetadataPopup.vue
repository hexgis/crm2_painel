<template>
  <l-layer-group ref="popup">
    <l-popup
      :options="{
        minWidth: 420,
        maxHeight: 360,
        className: 'card-popup',
        color: 'secondary'
      }"
    >
      <v-card
        class="fill-height"
      >
        <v-tabs
          v-if="data && Object.keys(data).length"
          background-color="primary"
          dark
          class="fill-height"
        >
          <template
            v-for="(layerData, layerName) in data"
          >
            <v-tab
              :key="layerName"
            >
              {{ layerName }}
            </v-tab>

            <v-tab-item
              :key="layerName"
              class="fill-height"
            >
              <v-card-text
                style="max-height: 312px; overflow-y: auto"
              >
                <template
                  v-for="(feature, i) in layerData.layers"
                >
                  <v-row
                    v-show="i != 0"
                    :key="i"
                    class="mx-0 grey lighten-2"
                  >
                    <v-col />
                  </v-row>
                  <template v-for="(value, field) in feature">
                    <v-row
                      v-if="value"
                      :key="field + i"
                      :align="field.align"
                      class="mx-0 list-separator"
                      dense
                    >
                      <v-col
                        cols="5"
                        class="text-right"
                      >
                        {{ formatField(field) }}:
                      </v-col>
                      <v-col
                        cols="7"
                        class="text-subtitle-2"
                        style="overflow-wrap: anywhere"
                      >
                        <a
                          v-if="isValidUrl(value)"
                          :href="value"
                          target="_blank"
                        >
                          {{ value }}
                        </a>
                        <span v-else>
                          {{
                            formatValue(
                              value,
                              field
                            )
                          }}
                        </span>
                      </v-col>
                    </v-row>
                  </template>
                </template>

                <template v-if="layerData.loading">
                  <v-row
                    v-for="i in 3"
                    :key="i"
                    dense
                  >
                    <v-col
                      cols="5"
                      class="text-right"
                    >
                      <v-skeleton-loader
                        class="pt-1"
                        type="text"
                      />
                    </v-col>
                    <v-col cols="7">
                      <v-skeleton-loader
                        class="pt-1"
                        type="text"
                      />
                    </v-col>
                  </v-row>
                </template>

                <div v-else-if="!layerData.layers.length">
                  Não há dados nesse ponto para a camada
                  selecionada.
                </div>
              </v-card-text>
            </v-tab-item>
          </template>
        </v-tabs>
      </v-card>
    </l-popup>
  </l-layer-group>
</template>

<i18n>
{
    "en": {
        "no-data": "There's no data at this point for the selected layer.",
        "layer-api-error": "Unable to acquire support layer information."
    },
    "pt-br": {
        "no-data": "Não há dados nesse ponto para a camada selecionada.",
        "layer-api-error": "Não foi possível resgatar as informações das camadas de apoio."
    }
}
</i18n>

<script>
export default {
  name: 'BaseWmsMetadataPopup',

  props: {
    map: {
      type: Object,
      default: null,
    },
  },

  data: () => ({
    hasPopup: false,
    popup: null,
    data: null,
  }),

  watch: {
    map() {
      if (this.map) {
        this.map.on('click', this.getFeatureInfo, this);
      }
    },
  },

  methods: {
    formatField(field) {
      const regex = /^[A-Za-z]{2}_\w+$/;
      if (field.match(regex)) {
        if (field.startsWith('dt_')) {
          field = field.replace('dt_', 'Data ');
        } else if (field.startsWith('co_')) {
          field = field.replace('co_', 'Codigo ');
        } else if (field.startsWith('cd_')) {
          field = field.replace('cd_', 'Codigo ');
        } else if (field.startsWith('sg_')) {
          field = field.replace('sg_', 'Sigla ');
        } else {
          field = field.substring(3);
        }
      }
      field = field
        .replaceAll('_', ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return field;
    },

    formatValue(value, field) {
      if (
        typeof value === 'string'
                && (field.startsWith('dt_')
                    || field.startsWith('data_')
                    || field.startsWith('date'))
                && this.$moment(value).isValid()
      ) {
        value = this.$moment(value).format('DD/MM/YYYY');
      } else if (typeof value === 'boolean') {
        value = value ? 'Sim' : 'Não';
      }
      return value;
    },

    isValidUrl(value) {
      let url;
      try {
        url = new URL(value);
      } catch (_) {
        return false;
      }
      return url.protocol === 'http:' || url.protocol === 'https:';
    },

    getFeatureInfo(evt) {
      this.hasPopup = false;
      this.data = {};

      this.map.eachLayer((layer) => {
        if (
          Object.prototype.hasOwnProperty.call(layer, 'wmsParams')
                    && layer.wmsParams.queryable
        ) {
          this.hasPopup = true;

          const layerName = layer.wmsParams.name;
          this.data[layerName] = {
            layers: [],
            loading: true,
          };

          const url = this.getFeatureInfoUrl(evt.latlng, layer);

          this.$axios
            .get(url)
            .then(({ data }) => {
              if (data && data.features && data.features.length) {
                for (const feature of data.features) {
                  this.data[layerName].layers.push(
                    feature.properties,
                  );
                }
              }
            })
            .catch(() => {
              this.$store.commit('alert/addAlert', {
                message: this.$t('layer-api-error'),
              });
            })
            .finally(() => {
              this.data[layerName].loading = false;
              this.$forceUpdate();
            });
        }
      });

      if (this.hasPopup) {
        this.$refs.popup.mapObject.openPopup(evt.latlng);
      }
    },

    getFeatureInfoUrl(latlng, layer) {
      const point = this.map.latLngToContainerPoint(
        latlng,
        this.map.getZoom(),
      );
      const size = this.map.getSize();
      const params = {
        request: 'GetFeatureInfo',
        service: 'WMS',
        srs: 'EPSG:4326',
        styles: layer.wmsParams.styles,
        transparent: layer.wmsParams.transparent,
        version: layer.wmsParams.version,
        format: layer.wmsParams.format,
        bbox: layer._map.getBounds().toBBoxString(),
        feature_count: 50,
        height: size.y,
        width: size.x,
        layers: layer.wmsParams.layers,
        query_layers: layer.wmsParams.layers,
        info_format: 'application/json',
      };

      params[params.version === '1.3.0' ? 'i' : 'x'] = point.x;
      params[params.version === '1.3.0' ? 'j' : 'y'] = point.y;

      return (
        layer._url
                + this.$L.Util.getParamString(params, layer._url, true)
      );
    },
  },
};
</script>
