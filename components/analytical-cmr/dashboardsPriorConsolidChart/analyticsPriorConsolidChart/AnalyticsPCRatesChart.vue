<template>
  <v-row>
    <v-col
      :cols="dynamicCol"
      class="d-flex flex-column"
    >
      <v-card class="py-3 elevation-5 d-flex flex-column">
        <v-row class="mx-0">
          <v-col
            cols="12"
            class="d-flex flex-column align-center justify-center"
          >
            <span class="grey--text text--darken-2">
              {{ $t('area-total') }}
            </span>
            <h1 class="grey--text text--darken-3">
              {{ areaTotal }} {{ unitMeansurement }}
            </h1>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <v-col
      :cols="dynamicCol"
      class="d-flex flex-column"
    >
      <v-card class="py-3 elevation-5 d-flex flex-column">
        <v-row class="mx-0">
          <v-col
            cols="12"
            class="d-flex flex-column align-center justify-center"
          >
            <span class="grey--text text--darken-2">
              {{ $t('poligon-total') }}
            </span>
            <h1 class="grey--text text--darken-3">
              {{ poligonTotal }} {{ $t('elements') }}
            </h1>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <v-col
      :cols="dynamicCol"
      class="d-flex flex-column"
    >
      <v-card class="py-3 elevation-5 d-flex flex-column">
        <v-row class="mx-0">
          <v-col
            cols="6"
            class="mini-chart"
          >
            <!-- significa que vai renderizar no cliente -->
            <client-only>
              <DoughnytChart
                :data="DougnoutDataset(vaaRate)"
                :options="chartOptions"
              />
            </client-only>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<i18n>
{
    "en": {
        // "vaa-rate": "VAA Rate",
        // "vma-rate": "VMA Rate",
        "area-total": "Total Area",
        "poligon-total": "Total Poligon",
        "elements": "elements"
    },
    "pt-br": {
        // "vaa-rate": "Taxa VAA",
        // "vma-rate": "Taxa VMA",
        "area-total": "Área Total",
        "poligon-total": "Total Area",
        "elements": "elementos"
    }
}
</i18n>

<script>
// Descrição:
// Primeira barra de contendo 3 blocos de informaçẽos:
// 1º Informativo de Área suprimida
// 2º Informativo de Total de poligonos
// 3º Informativo de disperção dos níveis de prioridade
import nuxtConfig from '~/nuxt.config';

export default {
  name: 'AnalyticsPCChartRates',

  props: {
    // ??? o que receberemos ou passaremos nessas variavies dentro da props
    year: {
      type: Number,
      default: 0,
    },
    month: {
      type: Number,
      default: 0,
    },
    previusYear: {
      type: Number,
      default: 0,
    },
    previusMonth: {
      type: Number,
      default: 0,
    },
  },
  // qual a diferença entre
  // data:() => {
  // data:() { reuturn{} }
  data() {
    return {
      unitMeansurement: null,
      displayAnalitcs: null,
      filters: {
        areaTotal: null,
        poligonTotal: null,
        priority: {
          highest: null,
          high: null,
          medium: null,
          low: null,
          lowest: null,
        },
      },
    };
    // dynamicCol: 4,
  },

  computed: {
    vaaRate() {
      // ??? o que é parseFloat
      // ??? qual o proposito do -1 e 1 dor return
      if (parseFloat(this.year) === 0) return -1;
      if (parseFloat(this.previusYear) === 0) return 1;
      return parseFloat(this.year) / parseFloat(this.previusYear);
    },

    vmaRate() {
      if (parseFloat(this.month) === 0) return -1;
      if (parseFloat(this.previusMonth) === 0) return 1;
      return parseFloat(this.month) / parseFloat(this.previusMonth);
    },
  },

  methods: {
    DoughnutDataSet(rate) {},
  },
};
</script>

<style scoped lang="sass">
.mini-chart
    border-right: 1px solid rgb(0,0,0,0.1 )
</style>
