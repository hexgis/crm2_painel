<template>
    <div>
        <v-progress-circular
            v-if="loadingComposition === composition.type"
            indeterminate
            size="18"
            :width="2"
            class="ma-2"
            color="grey darken-1"
        />
        <v-menu
            v-else-if="hasImageType(sceneIndex, composition.type)"
            offset-x
            left
        >
            <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon> mdi-dots-vertical </v-icon>
                </v-btn>
            </template>
            <v-list>
                <v-list-item @click.stop="downloadComposition()">
                    <v-icon class="mr-2"> mdi-download </v-icon>
                    {{ $t('download-button') }}
                </v-list-item>
                <v-list-item @click.stop="retrieveCatalog()">
                    <v-icon class="mr-2"> mdi-image-plus </v-icon>
                    {{ $t('catalog-button') }}
                </v-list-item>
            </v-list>
        </v-menu>
        <v-btn v-else icon @click.stop="downloadComposition()">
            <v-icon> mdi-autorenew </v-icon>
        </v-btn>

        <v-dialog v-model="showCompositionOverlay" persistent width="300">
            <v-card>
                <v-card-title class="headline text-break">
                    {{ $t('composition-dialog-title') }}
                </v-card-title>

                <v-card-text class="py-6">
                    {{ $t('composition-dialog-text') }}
                    <v-progress-linear
                        indeterminate
                        color="primary"
                        class="mb-0"
                    />
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="showCatalogOverlay" persistent width="350">
            <v-card v-if="retrievedCatalog">
                <v-card-title class="headline text-break">
                    {{ $t('catalog-retrieved-dialog-title') }}
                </v-card-title>
                <v-card-text class="py-6">
                    {{ $t('catalog-retrieved-dialog-text') }}
                </v-card-text>

                <v-card-actions class="justify-end">
                    <v-btn text @click="showCatalogTransitionDialog = false">
                        {{ $t('close-button') }}
                    </v-btn>
                    <v-btn
                        text
                        color="accent"
                        @click="goToCatalog(retrievedCatalog)"
                    >
                        {{ $t('catalog-retrieved-button') }}
                    </v-btn>
                </v-card-actions>
            </v-card>

            <v-card v-else>
                <v-card-title class="headline text-break">
                    {{ $t('catalog-generate-dialog-title') }}
                </v-card-title>

                <v-card-text v-if="!loadingCatalog" class="py-6">
                    <span class="accent--text">
                        {{ $t('catalog-generate-dialog-accent') }}
                    </span>
                    {{ $t('catalog-generate-dialog-text') }}
                </v-card-text>

                <v-card-text v-else class="py-6">
                    {{ $t('catalog-generate-dialog-loading-text') }}
                    <v-progress-linear
                        indeterminate
                        color="primary"
                        class="mb-0"
                    />
                </v-card-text>

                <v-card-actions v-if="!loadingCatalog">
                    <v-spacer></v-spacer>
                    <v-btn text @click="cleanRequestCatalog">
                        {{ $t('close-button') }}
                    </v-btn>
                    <v-btn
                        color="accent"
                        text
                        @click="generateCompositionCatalog"
                    >
                        {{ $t('catalog-generate-button') }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<i18n>
{
    "en": {
        "download-button": "Download composition",
        "catalog-button": "Add to my image database",
        "composition-dialog-title": "Generating composition",
        "composition-dialog-text": "This may take a few seconds",
        "composition-error": "Error while generating composition. Contact a system administrator in case it persists.",
        "catalog-retrieved-dialog-title": "Open my image database?",
        "catalog-retrieved-dialog-text": "Search results in database will be lost.",
        "catalog-retrieved-button": "Go to Image database",
        "catalog-generate-dialog-title": "Generate new image in my Database",
        "catalog-generate-dialog-accent": "There is no image in My database for the selected composition.",
        "catalog-generate-dialog-text": "Generate image in My database? This may take a few minutes.",
        "catalog-generate-dialog-loading-text": "This may take a few minutes.",
        "catalog-generate-button": "Generate",
        "catalog-error": "Error while retrieving image. Contact a system administrator in case it persists.",
        "catalog-process-message": "Requested processing for this composition. You will be notified when the image has been generated.",
        "close-button": "Close"
    },
    "pt-br": {
        "download-button": "Baixar composição",
        "catalog-button": "Ver no Acervo",
        "composition-dialog-title": "Gerando composição",
        "composition-dialog-text": "Esse processo pode levar alguns segundos",
        "composition-error": "Ocorreu um erro ao gerar a composição. Caso o problema persista, contate o administrador do sistema.",
        "catalog-retrieved-dialog-title": "Deseja abrir o Acervo de imagens?",
        "catalog-retrieved-dialog-text": "Resultados de busca realizada no Acervo serão perdidos.",
        "catalog-retrieved-button": "Ir para o Acervo",
        "catalog-generate-dialog-title": "Gerar nova imagem de Acervo",
        "catalog-generate-dialog-accent": "Não há imagem no Acervo para composição selecionada.",
        "catalog-generate-dialog-text": "Deseja gerar a imagem de Acervo? Esse processo pode levar alguns minutos.",
        "catalog-generate-dialog-loading-text": "Esse processo pode levar alguns minutos",
        "catalog-generate-button": "Gerar",
        "catalog-error": "Ocorreu um erro ao resgatar a imagem. Caso o problema persista, contate o administrador do sistema.",
        "catalog-process-message": "Foi solicitado o processamento do acervo. Você será notificado quando a imagem for gerado.",
        "close-button": "Fechar"
    }
}
</i18n>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
    name: 'ImagerySceneImagesCompositionActions',

    props: {
        composition: {
            type: Object,
            required: true,
        },
        scene: {
            type: Object,
            required: true,
        },
        sceneIndex: {
            type: Number,
            required: true,
        },
    },

    data: () => ({
        loadingComposition: null,
        showCompositionOverlay: false,

        showCatalogOverlay: false,
        loadingCatalog: false,
        retrievedCatalog: null,
    }),

    computed: {
        ...mapState('imagery', ['satellite']),
        ...mapGetters('imagery', ['hasImageType', 'sceneImage']),
    },

    methods: {
        async downloadComposition() {
            if (this.hasImageType(this.sceneIndex, this.composition.type)) {
                const image = this.sceneImage(this.sceneIndex, this.composition)
                window.location.assign(image.download_url)
            } else {
                this.loadingComposition = this.composition.type
                this.showCompositionOverlay = true
                const bands = this.composition.bands.join(',')

                try {
                    const data = await this.$apiSkynet.$get(
                        this.satellite.path +
                            'composition/' +
                            this.scene.properties.product,
                        {
                            params: { bands },
                        }
                    )

                    window.location.assign(data.download_url)
                    this.updateScene({
                        index: this.sceneIndex,
                        product: this.scene.properties.product,
                    })
                } catch {
                    this.$store.commit('alert/addAlert', {
                        message: this.$t('composition-error'),
                    })
                } finally {
                    this.loadingComposition = null
                    this.showCompositionOverlay = false
                }
            }
        },

        async retrieveCatalog() {
            const image = this.sceneImage(this.sceneIndex, this.composition)
            this.retrievedCatalog = null

            try {
                this.retrievedCatalog = await this.$api.$get(
                    'catalog/image/' + image.identifier
                )
                this.showCatalogOverlay = true
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    this.showCatalogOverlay = true
                } else {
                    this.$store.commit('alert/addAlert', {
                        message: this.$t('catalog-error'),
                    })
                }
            }
        },

        async generateCompositionCatalog() {
            this.loadingCatalog = true
            try {
                await this.$api.$post('process/catalog/', {
                    product: this.scene.properties.product,
                    type: this.composition.type,
                    satellite: this.satellite.identifier,
                    sat_id: this.satellite.id,
                })

                const image = this.sceneImage(this.sceneIndex, this.composition)
                this.checkCatalogCreated({
                    image: image.identifier,
                    action: this.goToCatalog,
                })

                this.$store.commit('alert/addAlert', {
                    message: this.$t('catalog-process-message'),
                })
            } catch (error) {
                this.$store.commit('alert/addAlert', {
                    message: this.$t('catalog-error'),
                })
            } finally {
                this.cleanRequestCatalog()
            }
        },

        goToCatalog(catalog) {
            this.$store.commit('catalog/setScenes', {
                scenes: [catalog],
                page: 1,
            })
            this.$store.commit('catalog/setSceneCount', 1)
            this.$router.push(this.localePath('/catalog'))
        },

        cleanRequestCatalog() {
            this.loadingCatalog = false
            this.showCatalogOverlay = false
        },

        ...mapActions('imagery', ['updateScene', 'checkCatalogCreated']),
    },
}
</script>

<style></style>
