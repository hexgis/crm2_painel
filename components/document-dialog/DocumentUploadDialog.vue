<template>
    <div class="text-center">
        <v-dialog v-model="dialog" max-width="40vw">
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    fab
                    ripple
                    small
                    color="secondary"
                    v-bind="attrs"
                    v-on="on"
                >
                    <v-icon rounded> mdi-upload </v-icon>
                </v-btn>
            </template>

            <v-card style="width: 100vw">
                <v-card-title class="text-h5 grey lighten-2">
                    CADASTRO DE DOCUMENTOS DE TERRAS INDÍGENAS
                </v-card-title>
                <v-card-actions>
                    <v-col class="cols">
                        <v-select
                            :label="$t('action-label')"
                            hide-details
                            multiple
                            required
                        >
                        </v-select>
                        <v-select
                            label="Terras Indigenas (Todas)"
                            multiple
                            clearable
                            hide-details
                            required
                        >
                        </v-select>
                    </v-col>
                    <v-col >
                        <BaseDateField
                            :label="$t('start-date-label')"
                            required
                            outlined
                        />
                        
                        <v-btn color="secondary">
                            <v-icon>
                                mdi-file-plus
                            </v-icon>
                        </v-btn>
                        
                    </v-col>
                </v-card-actions>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="secondary" text @click="dialog = false">
                        Cancelar
                    </v-btn>
                    <v-btn color="secondary" text @click="dialog = false">
                        Salvar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<i18n>
    {
        "en": {
            "search-label": "Search",
            "opacity-label": "Opacity",
            "current-view-label": "Search in current area?",
            "start-date-label": "Start Date",
            "total-area-label": "Total area",
            "heat-map-label": "Heat map",
            "polygon-label": "Total polygon count",
            "end-date-label": "End Date",
            "dialogName": "DOCUMENT SEARCH",
            "result-label": "Results",
            "filter-label": "Filter",
            "action-label": "Actions"
            
        },
        "pt-br": {
            "search-label": "Buscar",
            "opacity-label": "Opacidade",
            "current-view-label": "Pesquisar nesta área?",
            "total-area-label": "Área total",
            "heat-map-label": "Mapa de calor",
            "polygon-label": "Total de polígonos",
            "start-date-label": "Data Início",
            "end-date-label": "Data Fim",
            "dialogName": "PESQUISA DE DOCUMENTOS",
            "result-label": "Resultados",
            "filter-label": "Filtrar",
            "action-label": "Ações"
        }
    }
</i18n>
<script>
import BaseDateField from '@/components/base/BaseDateField'
export default {
    components: { BaseDateField },

    data() {
        return {
            dialog: false,
        }
    },
}
</script>
