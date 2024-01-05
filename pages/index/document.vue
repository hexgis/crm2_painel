<template>
  <v-container class="d-flex flex-column">
    <div class="tab-header flex justify-space-between">
      <h4 class="subtitle-2 text-uppercase font-weight-regular">
        {{ $t('title') }}
      </h4>
    </div>
    <v-card-text>
      <p>Ambiente de pesquisa de documentos de acordo com as ações.</p>

      <v-list-item-content style="list-style: circle">
        <v-list-item-title class="list__text mb-4 font-weight-black">
          Ações Disponíveis:
        </v-list-item-title>
        <ul
          v-for="(item, index) in items"
          :key="index"
        >
          <li>{{ item.value }}</li>
        </ul>
      </v-list-item-content>
    </v-card-text>

    <v-btn
      color="accent"
      class=""
      @click="showDialog(true)"
    >
      {{ $t('input-label') }}
    </v-btn>
    <div v-if="showDialogDocument">
      <DocumentDialog />
    </div>
    <v-footer
      absolute
      color="white"
      elevation="4"
    >
      <v-col>
        <v-row class="d-flex justify-center">
          <v-img
            max-width="200"
            src="/img/logo-inteira-antiga.svg"
          />
        </v-row>
      </v-col>
    </v-footer>
  </v-container>
</template>

<i18n>
    {
        "en": {
            "title": "Document",
            "analytics-label": "Analytics",
            "map-label": "Map",
            "input-label": "Search",
            "table-name": "Monitoring Table"
        },
        "pt-br": {
            "title": "Documental",
            "analytics-label": "Analytics",
            "map-label": "Mapa",
            "input-label": "Pesquisar",
            "table-name": "Tabela de Monitoramento"
        }
    }
</i18n>

<script>
import { mapMutations, mapState } from 'vuex';
import DocumentDialog from '@/components/document-dialog/DocumentDialog';

export default {
  components: { DocumentDialog },
  data() {
    return {
      items: [
        { value: 'Alertas Urgentes' },
        { value: 'FIP DGM' },
        { value: 'Fiscalização(2016)' },
        { value: 'Fiscalização(2017)' },
        { value: 'Fundo Amazônia' },
        { value: 'Gestão Territorial e Ambiental' },
        { value: 'Prevenção (2016)' },
        { value: 'Prevenção (2017)' },
        { value: 'Projeto PNUD (TIs Vulveráveis)' },
        { value: 'Vigilância' },
      ],
    };
  },
  computed: {
    ...mapState('document', [
      'showDialogDocument',
      'showFeatures',
      'features',
    ]),
  },
  methods: {
    showDialog(value) {
      this.setShowDialogDocument(value);
    },

    ...mapMutations('document', ['setShowDialogDocument']),
  },
};
</script>

<style scoped>
.list__text {
    font-size: 0.875rem;
    margin-bottom: 3px;
    list-style: circle !important;
}
</style>
