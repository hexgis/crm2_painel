<template>
    <div>
        <v-card variant="outlined" class="py-1 mb-4">
            <v-row>
                <v-col class="pb-0 ml-2 font-weight-medium">
                    <span>Frequência de atualização:</span>
                </v-col>
                <v-col cols="12" class="pt-0 pb-2 ml-6">
                    <span>{{ frequenciaAtualizacao }}</span>
                </v-col>
                <v-col class="py-0 ml-2 font-weight-medium">
                    <span>Última atualização:</span>
                </v-col>
                <v-col cols="12" class="pb-2 pt-0 ml-6">
                    <span>Data: {{ layerMetadata.data | formatDate }}</span>
                </v-col>
                <v-col cols="12" class="py-0 ml-2 font-weight-medium">
                    <span>Fonte:</span>
                </v-col>
                <v-col cols="6" class="pt-0 pb-2 ml-6">
                    {{ layerMetadata.fonte }} -
                    <a
                        v-if="layerMetadata.link"
                        :href="layerMetadata.link"
                        target="_blank"
                    >
                        <v-icon class="mb-1">mdi-open-in-new</v-icon>
                    </a>
                </v-col>
            </v-row>
        </v-card>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
    name: 'SuporteMetadadosCamada',

    props: {
        layerId: {
            type: Number,
            required: true,
        },
    },
   
    mounted() {
        this.getLayerMetadata(this.layerId);
    },

    computed: {
        frequenciaAtualizacao() {
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);

            const layerDate = new Date(this.layerMetadata.data);
            layerDate.setDate(layerDate.getDate() + 1);

            return layerDate.getTime() >= yesterday.getTime() ? 'Diário' : '-';
        },

        ...mapState({
            layerMetadata: state => state.supportLayers.layerMetadata,
        }),
    },

    methods: {
        ...mapActions({
            getLayerMetadata: 'supportLayers/getLayerMetadata',
        }),
    },

    filters: {
        formatDate(value) {
            if (!value) return '';
            const [year, month, day] = value.split('-');
            return `${day}/${month}/${year}`;
        },
    },
};
</script>
