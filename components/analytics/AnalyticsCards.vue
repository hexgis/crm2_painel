<template>
  <v-container
    v-if="!isLoadingAgroData"
    fluid
  >
    <v-row>
      <v-col cols="6">
        <AnalyticsESLineChart
          :name="$t('planted-area')"
          :data="getDataset('area_plantada')"
          x-axis="type"
          y-axis="date"
          value-identifier="area_plantada"
          :cols="12"
        />
      </v-col>

      <v-col cols="6">
        <RatingComponent />
      </v-col>

      <v-col cols="6">
        <AnalyticsESLineChart
          :name="$t('productivity-area')"
          :data="getDataset('area_produtividade')"
          x-axis="type"
          y-axis="date"
          value-identifier="area_produtividade"
          :cols="12"
        />
      </v-col>

      <v-col cols="6">
        <BasicCard
          key="areas"
          :value-multi="multi.areas.value"
          :label="multi.areas.label"
          :width="multi.areas.width"
          :height="multi.areas.height"
          cols="12"
        />
        <v-row>
          <BasicCard
            :key="`${basics.risk.value}`"
            :value="basics.risk.value"
            :label="basics.risk.label"
            :detail="basics.risk.detail"
            :width="basics.risk.width"
            :height="basics.risk.height"
            :alert="basics.risk.alert"
            cols="6"
          />
          <BasicCard
            :key="`${basics.date.value}`"
            :value="basics.date.value"
            :label="basics.date.label"
            :detail="basics.date.detail"
            :width="basics.date.width"
            :height="basics.date.height"
            :alert="basics.date.alert"
            cols="6"
          />
        </v-row>
      </v-col>

      <!-- <v-row> -->
      <BasicCard
        key="plantation"
        :value-multi="multi.plantation.value"
        :label="multi.plantation.label"
        :width="multi.plantation.width"
        :height="multi.plantation.height"
      />

      <v-row v-if="!$vuetify.breakpoint.mobile">
        <template v-for="(basic, key) in basics">
          <BasicCard
            v-if="!['risk', 'date'].includes(key)"
            :key="`${basic.value}`"
            :value="basic.value"
            :label="basic.label"
            :detail="basic.detail"
            :width="basic.width"
            :height="basic.height"
            :alert="basic.alert"
            cols="6"
          />
        </template>
      </v-row>

      <template v-for="(basic, key) in basics">
        <BasicCard
          v-if="
            !['risk', 'date'].includes(key) &&
              $vuetify.breakpoint.mobile
          "
          :key="`${basic.value}`"
          :value="basic.value"
          :label="basic.label"
          :detail="basic.detail"
          :width="basic.width"
          :height="basic.height"
          :alert="basic.alert"
          cols="6"
        />
      </template>

      <!-- </v-row> -->

      <template v-for="(multiple, key) in multi">
        <BasicCard
          v-if="!['areas', 'plantation'].includes(key)"
          :key="key"
          :value-multi="multiple.value"
          :label="multiple.label"
          :width="multiple.width"
          :height="multiple.height"
          :cols="
            $vuetify.breakpoint.mobile
              ? '12'
              : multiple.cols || null
          "
        />
      </template>
    </v-row>
  </v-container>
</template>

<i18n>
{
    "en": {
        "planted-area": "Historic evolution of planted area",
        "productivity-area": "Historic evolution of productivity"
    },
    "pt-br": {
        "planted-area": "Evolução histórica da área plantada",
        "productivity-area": "Evolução histórica da produtividade"
    }
}
</i18n>

<script>
import { mapState } from 'vuex';
import RatingComponent from '@/components/rating-component/RatingComponent';
import BasicCard from './analyticsAgri/BasicCard.vue';
import AnalyticsESLineChart from './es-charts/AnalyticsESLineChart';

export default {
  name: 'AnalyticsCards',
  components: {
    BasicCard,
    AnalyticsESLineChart,
    RatingComponent,
  },

  data: () => ({
    basics: {
      risk: {
        label: 'Risco de Fogo',
        value: 'ALTO',
        alert: true,
      },
      date: {
        label: 'Data última imagem',
        value: 'Ontem',
        width: 'short',
      },
      heat: {
        label: 'Focos de Calor',
        value: '59',
      },
      cattle: {
        label: 'Gado Confinado',
        value: '12.700',
        detail: 'cabeças',
        width: 'short',
        cols: 3,
      },
      precip: {
        label: 'Média precipitação',
        value: 'Precipitação',
        width: 'short',
        cols: 3,
      },
    },
    multi: {
      areas: {
        label: 'Resumo de Áreas',
        value: {
          'Área Propriedades': '7.863.609,75 ha',
          'Maior propriedade': '119.606.97 ha',
          'Área embargada': '4.408,81 ha',
          'Áreas de Proteção': '271.867,29 ha',
          'Uso Agropecuário': '1.146.390,21 ha',
          'Número de municípios na AOI': '9',
          'Unidade Armazenadora mais presente': 'Bateria de Silos',
        },
        width: 'long',
        height: 'full',
      },
      plantation: {
        label: 'Áreas de Plantação',
        value: {
          'Lavoura Perene. - LP': '18.150,00 ha',
          'Corte Raso. - CR': '11.301,00 ha',
          'Fogo em Floresta - FF.': '180.012,25 ha',
          'Degradação - DG.': '250.150,87 ha',
          'Degradação em Regeneração - DR.': '150.287,91 ha',
        },
        width: 'medium',
        height: 'full',
      },
      seizure: {
        label: 'Embargos',
        value: {
          'CPF Embargados': '12',
          'CNPJ Embargados': '3',
        },
        width: 'full',
      },
      embargos_info: {
        label: 'Detalhes de Embargos',
        value: {
          'Município de Santa Ines': '06.198.949/0001-24',
          'H.N. Figueiredo da Fonseca': '07.714.520/0001-05',
          'Empresa Brasileira de Terras 2 Ltda': '10.306.395/0001-09',
          '': '',
          'Euclides de Carli': '006.913.059-00',
          'Jose Anchieta Martins Rosal': '097.728.201-53',
          'Adalto Gomes da Silva': '156.614.311-04',
          'Algemiro Tavares de Lira': '184.924.603-34',
          'Aliomar Sousa dos Santos': '186.217.401-68',
          'Maria Nogueira Diógenes': '297.682.683-87 (2)',
          'Valdize Lustosa de Alencar': '319.899.423-34',
          'Vanderlei Pompeo de Matos': '366.128.120-87 (2)',
          'Carlos Rone Saggin': '381.153.520-04',
          'Luiz Topan': '514.247.209-82',
          'Luiz Quirino Peteck': '562.753.669-15',
          'Hernandes Carvalho França': '930.200.903-34',
        },
        height: 'full',
        width: 'full',
        cols: '6',
      },
      info: {
        label: 'Informações de Proprietários',
        value: {
          'CPF - Maior proprietário': '247.795.041-04',
          'CPF - Nome do proprietário': 'MARIA DO CARMO NERES SOUZA',
          'CPF - Nome do Imóvel': 'BARRA DAS COLHERES',
          'CPF - Maior Área': '119.606,97 ha',
          'CPF - Nº Certificado':
                        'PI-2201150-CF08D5DE79E3DADEA3EC84C4BFB97702',
          'CNPJ - Maior proprietário': '11.540.898/0001-07',
          'CNPJ - Nome do Imóvel': 'FAZENDA SERRA BRANCA I',
          'CNPJ - Proprietários identificados':
                        'ARMANDO TOMAZINI, FRANCISCO ROBERTO TOMAZINI, JOSE MARIO \nTOMAZINI, SERRA BRANCA S/A e SERRA BRANCA AGRÍCOLA SA',
          'CNPJ - Maior Área': '58.194,08 ha',
          'CNPJ - Nº Certificado':
                        'PI-2211209-FD1F075F6E962B777E75CFD69AD18C6C',
          'Cultura mais presente': 'Soja',
          'Área cultura mais presente': 'Sem informação',
          'Área para colheita próximos 30 dias': 'Sem informação',
        },
        height: 'full',
        width: 'full',
        cols: '6',
      },
    },
  }),

  computed: {
    ...mapState('analytics', ['colors', 'esBuckets', 'isLoadingAgroData']),
  },

  methods: {
    getDataset(field) {
      const datasets = [];
      let labels = [];

      const graphData = field === 'area_plantada'
        ? this.esBuckets.agroPlantada
        : this.esBuckets.agroProdutividade;
      const brasilData = this.esBuckets.agroSum;

      //  get returned states with value
      Object.keys(brasilData).forEach(
        (year) => (labels = [...labels, year]),
      );
      labels = [...new Set(labels)].sort();

      Object.keys(graphData).forEach((state) => {
        datasets.push({
          label: state,
          data: labels.map((l) => graphData[state][l] || 0),
          fill: false,
          lineTension: 0,
          backgroundColor: `${this.colors.state[state]}43`,
          borderColor: this.colors.state[state],
          borderWidth: 2,
          pointHitRadius: 6,
        });
      });

      datasets.push({
        label: 'Brasil',
        data: labels.map((l) => brasilData[l][field] || 0),
        fill: true,
        lineTension: 0,
        borderColor: '#3D9970',
        backgroundColor: '#3D997013',
        borderWidth: 2,
        pointHitRadius: 6,
      });

      return {
        labels,
        datasets,
      };
    },
  },
};
</script>

<style scoped lang="sass">
.container--fluid
    width: 100% !important

    .row
        // padding: 40px 0 20px
</style>
