<template>
    <v-container class="d-flex flex-column">
        <div class="tab-header flex justify-space-between">
            <h4 class="subtitle-2 text-uppercase font-weight-regular">
                {{ $t('title') }}
            </h4>
            <v-switch
                v-if="features"
                v-model="showFeaturesMonitoring"
                class="mt-n1 ml-5"
                hide-details
            />
        </div>
        <v-card-text>
            What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever since the 1500s, when an unknown
            printer took a galley of type and scrambled it to make a type
            specimen book. It has survived not only five centuries, but also the
            leap into electronic typesetting, remaining essentially unchanged.
            It was popularised in the 1960s with the release of Letraset sheets
            containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions of Lorem
            Ipsum.
        </v-card-text>
        <v-btn color="accent" class="" @click="showDialog(true)">
            {{ $t('input-label') }}
        </v-btn>
        <div v-if="showDialogDocument">
            <DocumentDialog />
        </div>
        <v-footer
            absolute
            class="priority-footer"
            color="#FFFFFF"
            elevation="4"
        >
            <v-col>
                <v-row class="d-flex justify-center">
                    <v-img max-width="200" src="/img/logocmr_normal.png" />
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
import DocumentDialog from '@/components/document-dialog/DocumentDialog'
import { mapActions, mapMutations, mapState } from 'vuex'
export default {
    components: { DocumentDialog },
    data() {
        return {}
    },
    computed: {
        ...mapState('document', ['showDialogDocument']),
    },
    methods: {
        showDialog(value) {
            this.setShowDialogDocument(value)
        },

        ...mapMutations('document', ['setShowDialogDocument']),
    },
}
</script>

<style></style>
