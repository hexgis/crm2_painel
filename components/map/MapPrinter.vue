<template>
    <div class="d-flex mt-3">
        <v-dialog v-model="dialog" persistent max-width="1100">
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    fab
                    ripple
                    height="36"
                    width="36"
                    v-bind="attrs"
                    v-on="on"
                >
                    <v-icon> mdi-printer </v-icon>
                </v-btn>
            </template>
            <v-card height="800">
                <v-card-title class="text-h8" absolute color="secondary">
                    IMPRESSÃO DO MAPA DE POLÍGONS PRIORITÁRIOS
                </v-card-title>
                <v-row>
                    <v-col>
                        <MapForPrint />
                    </v-col>
                    <v-col class="mt-2">
                        <div>
                            <v-col class="pa-2 d-inline-flex justify-center">
                                <a target="_blank" class="mt-5">
                                    <v-img
                                        contain
                                        width="100"
                                        src="/img/logocmr_normal_min.png"
                                    />
                                </a>
                                <a>
                                    <v-img
                                        class="mx-4"
                                        contain
                                        width="60"
                                        src="/img/funai.svg"
                                    />
                                </a>
                            </v-col>
                        </div>
                        <br />
                        <h6
                            class="text-center d-inline-flex justify-center pa-2"
                        >
                            Centro de Monitoramento Remoto - Fundação Nacional
                            do Índio
                        </h6>
                        <br />
                        <h6
                            class="text-center d-inline-flex justify-center pa-2"
                        >
                            SISTEMA DE INTEGRAÇÃO DE DADOS GEOESPACIAIS DAS
                            TERRAS INDÍGENAS
                        </h6>

                        <MiniMapForPrint />
                        

                        <v-divider></v-divider>
                        <h6 class="mt-2">Legenda:</h6>
                        <div class="mt-2">
                            <h6>teste</h6>
                            <h6>teste</h6>
                            <h6>teste</h6>
                            <h6>teste</h6>
                            <h6>teste</h6>
                            <h6>teste</h6>
                            <h6>teste</h6>
                            <h6>teste</h6>
                        </div>
                        <br />
                        <v-divider></v-divider>

                        <h6 class="mt-2">Bases Cartográficas:</h6>
                        <div class="mt-2 mb-6">
                            <h6>teste</h6>
                            <h6>teste</h6>
                            <h6>teste</h6>
                            <h6>teste</h6>
                        </div>
                        <v-divider></v-divider>
                        <h6 class="mt-2">
                            CENTRO DE MONITORAMENTO REMOTO -
                            https://cmr.funai.gov.br
                        </h6>
                        
                    </v-col>
                </v-row>

                <v-divider></v-divider>
                <v-footer>
                    <v-spacer></v-spacer>
                    <v-card-actions>
                        <v-btn  text @click="dialog = false">
                            CANCELAR
                        </v-btn>
                        <v-btn  text @click="dialog = false">
                            SALVAR
                        </v-btn>
                    </v-card-actions>
                </v-footer>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import MapForPrint from '@/components/map/MapForPrint.vue'
import MiniMapForPrint from '@/components/map/MiniMapForPrint.vue'

export default {
    name: 'MapPrinter',

    components: { MapForPrint, MiniMapForPrint },

    data() {
        return {
            dialog: false,
        }
    },
}
</script>
