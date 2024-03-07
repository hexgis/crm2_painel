<template>
    <div>
        <v-card variant="outlined" class="py-1 mb-4">
            <div class="px-2">
                <span class="d-block">Data: {{ layerMetadata.data }}</span>
                <span class="d-block">Fonte: {{ layerMetadata.fonte }}</span>
            </div>
        </v-card>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'SupportLayerMetadata',

    props: {
        layerId: {
            type: Number,
            required: true,
        },
    },

    data() {
        return {
            layerMetadata: {
                data: '',
                fonte: '',
            },
        }
    },

    watch: {
        layerId: {
            immediate: true,
            handler(data) {
                this.getLayerMetadata(data)
            },
        },
    },

    methods: {
        async getLayerMetadata(layerId) {
            try {
                const response = await axios.get(
                    `/api/layer/${layerId}/metadata`
                )
                this.layerMetadata = response.data
            } catch (error) {
                console.error('Erro ao obter os metadados do layer:', error)

                this.simulateLayerMetadata(layerId)
            }
        },

        simulateLayerMetadata(layerId) {
            console.log(this.layerId)
            switch (this.layerId) {
                case 1: // Layer com ID 1
                    this.layerMetadata.data = '01/01/2024'
                    this.layerMetadata.fonte = 'Fonte de dados fictícia 1'
                    break
                case 2: // Layer com ID 2
                    this.layerMetadata.data = '15/02/2024'
                    this.layerMetadata.fonte = 'Fonte de dados fictícia 2'
                    break
                case 3: // Layer com ID 3
                    this.layerMetadata.data = '25/10/2024'
                    this.layerMetadata.fonte = 'Fonte de dados fictícia 3'
                    break
                case 4: // Layer com ID 4
                    this.layerMetadata.data = '18/05/2024'
                    this.layerMetadata.fonte = 'Fonte de dados fictícia 4'
                    break
                case 5: // Layer com ID 5
                    this.layerMetadata.data = '17/12/2024'
                    this.layerMetadata.fonte = 'Fonte de dados fictícia 5'
                    break
                case 6: // Layer com ID 6
                    this.layerMetadata.data = '07/12/2024'
                    this.layerMetadata.fonte = 'Fonte de dados fictícia 6'
                    break
                case 7: // Layer com ID 7
                    this.layerMetadata.data = '17/01/2024'
                    this.layerMetadata.fonte = 'Fonte de dados fictícia 7'
                    break
                default:
                    this.layerMetadata.data = ''
                    this.layerMetadata.fonte = ''
            }
        },
    },
}
</script>
