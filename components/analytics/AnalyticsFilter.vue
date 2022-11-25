<template>
  <v-card>
    <v-card-text>
      <v-form v-model="valid">
        <v-row
          wrap
          justify="center"
        >
          <v-col cols="3">
            <BaseDateField
              v-model="filters.month"
              :label="$t('date-label')"
              month
              outlined
              required
            />
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="filters.type"
              :label="$t('cr-label')"
              :items="monitoringTypes"
              item-text="name"
              item-value="identifier"
              outlined
            />
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="filters.stage"
              :label="$t('ti-label')"
              :items="stageList"
              item-text="name"
              item-value="identifier"
              outlined
              height="50"
              multiple
            />
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="filters.stage"
              :label="$t('class-label')"
              :items="stageList"
              item-text="name"
              item-value="identifier"
              outlined
              height="50"
              multiple
            />
          </v-col>
        </v-row>
        <v-item-group
          v-model="filters.state"
          mandatory
        >
          <v-row
            dense
            justify="center"
          >
            <v-col
              v-for="state in stateList"
              :key="state.uf"
            >
              <v-item
                v-slot="{ active, toggle }"
                :value="state.uf"
              >
                <v-card
                  :color="active ? 'blue lighten-5' : ''"
                  :class="
                    active ? 'elevation-5' : 'elevation-2'
                  "
                  class="state-filter-card"
                  @click="toggle"
                >
                  <v-img
                    width="102"
                    height="100"
                    class="mx-auto"
                    contain
                    :src="getStateIconSrc(state.uf)"
                  >
                    <span class="state-label">
                      {{ state.uf ? state.uf : 'Brasil' }}
                    </span>
                  </v-img>
                </v-card>
              </v-item>
            </v-col>
          </v-row>
        </v-item-group>
      </v-form>
    </v-card-text>
    <v-card-actions class="px-5 py-4 justify-end">
      <v-btn
        color="accent"
        :loading="isLoadingData"
        :disabled="!valid"
        @click="submit"
      >
        {{ $t('filter-button') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<i18n>
{
    "en": {
        "date-label": "Year/Month",
        "cr-label": "CR",
        "ti-label": "TI",
        "filter-button": "Filter",
        "class-label": "Priority"
    },
    "pt-br": {
        "date-label": "Mês/Ano",
        "cr-label": "CR",
        "ti-label": "TI",
        "filter-button": "Filtrar",
        "class-label": "Prioridade"
    }
}
</i18n>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

import BaseDateField from '@/components/base/BaseDateField';

export default {
  name: 'AnalyticsFilter',

  components: { BaseDateField },

  data() {
    return {
      monitoringTypes: [],
      stateList: [
        { name: 'Brasil', uf: '' },
        { name: 'Acre', uf: 'AC' },
        // { name: 'Alagoas', uf: 'AL' },
        { name: 'Amapá', uf: 'AP' },
        { name: 'Amazonas', uf: 'AM' },
        // { name: 'Bahia', uf: 'BA' },
        // { name: 'Ceará', uf: 'CE' },
        // { name: 'Distrito Federal', uf: 'DF' },
        // { name: 'Espírito Santo', uf: 'ES' },
        // { name: 'Goiás', uf: 'GO' },
        { name: 'Maranhão', uf: 'MA' },
        { name: 'Mato Grosso', uf: 'MT' },
        // { name: 'Mato Grosso do Sul', uf: 'MS' },
        // { name: 'Minas Gerais', uf: 'MG' },
        { name: 'Pará ', uf: 'PA' },
        // { name: 'Paraíba', uf: 'PB' },
        // { name: 'Paraná', uf: 'PR' },
        // { name: 'Pernambuco', uf: 'PE' },
        // { name: 'Piauí', uf: 'PI' },
        // { name: 'Rio de Janeiro', uf: 'RJ' },
        // { name: 'Rio Grande do Norte', uf: 'RN' },
        // { name: 'Rio Grande do Sul', uf: 'RS' },
        { name: 'Rondônia', uf: 'RO' },
        { name: 'Roraima', uf: 'RR' },
        // { name: 'Santa Catarina', uf: 'SC' },
        // { name: 'São Paulo', uf: 'SP' },
        // { name: 'Sergipe', uf: 'SE' },
        { name: 'Tocantins', uf: 'TO' },
      ],
      stages: [],
      filters: {
        type: null,
        state: null,
        stage: null,
        month: null,
      },
      valid: null,
      panel: 0,
    };
  },

  computed: {
    ...mapState('analytics', ['isLoadingData', 'stageList']),
    ...mapState('monitoring', { monitoringFilters: 'filters' }),
  },

  created() {
    this.setInitialFilters();
    this.getTypes();
    this.getStages();
    this.getData(this.filters);
  },

  methods: {
    setInitialFilters() {
      if (this.$store.state.analytics.filters) {
        this.filters = this.$store.state.analytics.filters;
      } else {
        this.filters.month = this.$moment().format('YYYY-MM');
      }
      if (
        this.monitoringFilters[
          process.env.ANALYTICS_DEFAULT_DATE_MONITORING
        ]
      ) {
        this.filters.month = this.monitoringFilters[
          process.env.ANALYTICS_DEFAULT_DATE_MONITORING
        ].substr(0, 7);
      }
    },

    async getTypes() {
      this.monitoringTypes = await this.$api.$get(
        'monitoring/stats/types/',
      );
    },

    getStateIconSrc(uf) {
      return !uf
        ? '/img/estados/brasil-s.png'
        : `/img/estados/${uf.toLowerCase()}-s.png`;
    },

    submit() {
      this.setFilters(this.filters);
      this.getData(this.filters);
    },

    ...mapMutations('analytics', ['setFilters']),
    ...mapActions('analytics', ['getData', 'getStages']),
  },
};
</script>

<style lang="sass">
.full-width
    width: 100%

.state-filter-card

    &:hover
        background-color: #F6F6F6
        cursor: pointer

.state-label
    position: absolute
    bottom: 0
    margin-left: 40px
    font-weight: 500
    font-size: 13px

.v-select__selections
    overflow: hidden
    height: 40px
</style>
