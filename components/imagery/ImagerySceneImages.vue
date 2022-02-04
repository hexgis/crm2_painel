<template>
    <div v-if="satellite.path == 'landsat/' || satellite.path == 'sentinel2/'">
        <v-tabs v-model="activeTab" fixed-tabs color="accent">
            <v-tab :key="0">{{ $t('band-label') }}</v-tab>
            <v-tab :key="1">{{ $t('composition-label') }}</v-tab>

            <v-tab-item :key="0">
                <v-divider />

                <v-list subheader dense>
                    <v-list-item v-for="(band, i) in bands" :key="i">
                        <v-list-item-content>
                            <div>
                                <span class="text-uppercase">
                                    {{ band.type }} </span
                                >- {{ band.name }}
                            </div>
                        </v-list-item-content>

                        <v-list-item-action>
                            <v-btn icon @click="downloadBand(band)">
                                <v-icon> mdi-download </v-icon>
                            </v-btn>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>
            </v-tab-item>

            <v-tab-item :key="1">
                <v-divider />

                <v-list subheader dense>
                    <v-list-item
                        v-for="(composition, i) in compositions"
                        :key="i"
                    >
                        <v-list-item-avatar color="grey">
                            <v-btn
                                v-if="hasImageType(index, composition.type)"
                                icon
                                dark
                                large
                                :loading="loadingPreview[i]"
                                @click="togglePreview(composition, i)"
                            >
                                <v-icon
                                    :color="
                                        sceneImage(index, composition).visible
                                            ? 'accent'
                                            : ''
                                    "
                                >
                                    mdi-eye
                                </v-icon>
                            </v-btn>
                            <v-icon v-else dark disabled> mdi-eye-off </v-icon>
                        </v-list-item-avatar>

                        <v-list-item-content>
                            <div>
                                <span class="text-uppercase">
                                    {{ composition.type }} </span
                                >- {{ composition.name }}
                            </div>
                        </v-list-item-content>

                        <v-list-item-action>
                            <ImagerySceneImagesCompositionActions
                                :composition="composition"
                                :scene="scene"
                                :scene-index="index"
                            />
                        </v-list-item-action>
                    </v-list-item>
                </v-list>
            </v-tab-item>
        </v-tabs>
    </div>

    <div v-else>
        <v-list subheader dense>
            <v-list-item v-for="(image, i) in scene.properties.images" :key="i">
                <v-list-item-content>
                    <div>
                        <span class="text-uppercase">{{ image.type }}</span>
                    </div>
                </v-list-item-content>

                <v-list-item-action>
                    <v-btn icon @click="downloadImage(image)">
                        <v-icon>mdi-download</v-icon>
                    </v-btn>
                </v-list-item-action>
            </v-list-item>
        </v-list>
    </div>
</template>

<i18n>
{
    "en": {
        "band-label": "Bands",
        "composition-label": "Compositions",
        "preview-error": "Error while retrieving image preview, contact a system administrator in case it persists.",
        "download-error": "Error while retrieving download url, probably caused by missing band. Contact a system administrator in case it persists."
    },
    "pt-br": {
        "band-label": "Bandas",
        "composition-label": "Composições",
        "preview-error": "Não foi possível resgatar a prévia da imagem, entre em contato com um administrador caso persista.",
        "download-error": "Ocorreu um erro ao resgatar a url de aquisição, provalmente causado por banda inexistente. Caso o problema persista, contate o administrador do sistema."
    }
}
</i18n>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

import ImagerySceneImagesCompositionActions from './ImagerySceneImagesCompositionActions'

export default {
    name: 'ImagerySceneImages',

    components: {
        ImagerySceneImagesCompositionActions,
    },

    props: {
        scene: {
            type: Object,
            required: true,
        },
        index: {
            type: Number,
            required: true,
        },
    },

    data() {
        return {
            activeTab: 0,
            loadingPreview: {},
        }
    },

    computed: {
        ...mapState('imagery', ['satellite', 'bands', 'compositions']),
        ...mapGetters('imagery', ['hasImageType', 'sceneImage']),
    },

    created() {
        if (!this.scene.properties.images) {
            this.updateScene({
                index: this.index,
                product: this.scene.properties.product,
            })
        }
    },

    methods: {
        downloadBand(band) {
            this.downloadImage(this.scene.properties.product, band.type)
        },

        async downloadImage(product, type) {
            try {
                const response = await this.$apiSkynet.$get(
                    this.satellite.path +
                        'image/download/' +
                        product +
                        '/' +
                        type
                )

                window.location.assign(response.download_url)
            } catch (exception) {
                this.$store.commit('alert/addAlert', {
                    message: this.$t('download-error'),
                })
            }
        },

        async togglePreview(composition, i) {
            const image = this.sceneImage(this.index, composition)
            if (image) {
                if (!image.preview) {
                    if (i in this.loadingPreview) {
                        this.loadingPreview[i] = true
                    } else {
                        this.$set(this.loadingPreview, i, true)
                    }

                    try {
                        const response = await this.$apiSkynet.$get(
                            this.satellite.path +
                                'image/preview/' +
                                image.identifier
                        )

                        this.updateImage({
                            index: this.index,
                            identifier: image.identifier,
                            image: response,
                        })
                        this.loadingPreview[i] = false
                    } catch (exception) {
                        this.loadingPreview[i] = false
                        this.$store.commit('alert/addAlert', {
                            message: this.$t('preview-error'),
                        })
                        return
                    }
                }
                this.toggleImagePreview({
                    index: this.index,
                    imageType: image.type,
                    visible: !image.visible,
                })
            }
        },

        ...mapMutations('imagery', ['toggleImagePreview', 'updateImage']),
        ...mapActions('imagery', ['updateScene']),
    },
}
</script>
