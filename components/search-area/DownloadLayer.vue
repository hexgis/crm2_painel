<template>
  <div class="d-flex mt-4 justify-end">
    <v-tooltip left>
      <template #activator="{ on }">
        <v-speed-dial
          v-model="fab"
          :direction="direction"
          :transition="transition"
        >
          <template #activator>
            <v-btn
              v-model="fab"
              fab
              ripple
              height="36"
              width="36"
              v-on="on"
            >
              <v-icon v-if="fab">
                mdi-arrow-right
              </v-icon>
              <v-icon v-else>
                mdi-download
              </v-icon>
            </v-btn>
          </template>
          <div class="d-flex">
            <v-btn
              text
              color="grey darken-3"
              @click="downloadLayer(layer, 'SHAPE-ZIP')"
            >
              <span> SHP </span>
            </v-btn>
            <v-btn
              text
              color="grey darken-3"
              @click="
                downloadLayer(
                  layer,
                  'application/vnd.google-earth.kml+xml'
                )
              "
            >
              <span> KML </span>
            </v-btn>
            <v-btn
              text
              color="grey darken-3"
              @click="downloadLayer(layer, 'application/json')"
            >
              <span> JSON </span>
            </v-btn>
          </div>
        </v-speed-dial>
      </template>
      <span> {{ $t('download') }} </span>
    </v-tooltip>
  </div>
</template>

<i18n>
{
    "en": {
        "download": "Download"

    },
    "pt-br": {
       "download":"Download"
    }
}
</i18n>

<script>
import { mapState } from 'vuex';

export default {

  props: {
    layer: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      direction: 'left',
      transition: 'slide-x-reverse-transition',
      fab: false,
    };
  },

  computed: {
    ...mapState('searchInArea', ['cqlFilter', 'requestTool']),
    ...mapState('supportLayers', ['supportLayers']),
  },

  methods: {
    downloadLayer(layer, outputFormat) {
      let cql = this.cqlFilter;
      const support = Object.values(this.supportLayers)
        .filter((item) => item.id === layer.id);
      if (this.requestTool !== 'SearchInArea' && support[0].cql) {
        cql += ` AND (${support[0].cql})`;
      }
      let url = `${layer.wms.geoserver.wms_url
      }&service=WFS`
                + '&version=1.0.0'
                + '&request=GetFeature'
                + `&typeName=${layer.wms.geoserver_layer_namespace}:${layer.wms.geoserver_layer_name
                }&cql_filter=${cql}&maxFeatures=5000000&outputFormat=${outputFormat}`;
      url = url.replace('wms', 'ows');
      window.open(url);
    },
  },
};
</script>
