<template>
    <div class="d-flex">
        <v-tooltip right :disabled="isSearching">
            <template #activator="{ on }">
                <v-btn
                    fab
                    ripple
                    height="36"
                    width="36"
                    class="search-button"
                    :loading="isLoading"
                    v-on="on"
                    @click.stop="isSearching = !isSearching"
                >
                    <v-icon> mdi-image-search-outline </v-icon>
                </v-btn>
            </template>
            <span> {{ $t('search-label') }} </span>
        </v-tooltip>
        <div class="search-input-container">
            <transition name="slide-x">
                <v-autocomplete
                    v-if="isSearching"
                    :label="$t('search-label')"
                    :loading="isLoading"
                    :items="searchResults"
                    :search-input.sync="searchQuery"
                    background-color="white"
                    class="search-input"
                    flat
                    auto-select-first
                    height="40px"
                    hide-no-data
                    hide-details
                    item-text="label"
                    solo
                    @click.stop="searchQuery = ''"
                />
            </transition>
        </div>
    </div>
</template>

<i18n>
{
    "en": {
        "search-label": "Search for Indigenous Lands"
    },
    "pt-br": {
        "search-label": "Pesquisar por Terras Indígenas"
    }
}
</i18n>

<script>
import { mapActions } from 'vuex'

export default {
    name: 'MapSearchTi',

    props: {
        map: {
            type: Object,
            default: null,
        },
    },

    data() {
        return {
            searchQuery: null,
            searchResults: [],
            isLoading: false,
            isSearching: false,           
        }
    },

    watch: {
        searchQuery() {
            if (!this.searchQuery || !(this.searchQuery.length > 4)) {
                this.searchResults = []
                this.isLoading = false
                return
            }
            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout)
            }
            this.searchTimeout = setTimeout(
                () => this.searchOnProvider(this.searchQuery),
                1000
            )
        },
    },

    methods: {
        ...mapActions('map', ['fetchSearchResults']),

        async searchOnProvider(response) {
            try {
                const data = await this.fetchSearchResults(response)
                // Verifique se há dados retornados e se há features na coleção
                if (data && data.features && data.features.length > 0) {
                    // Inicialize os limites vazios
                    let bounds = L.latLngBounds()
                    // Itere sobre todas as features e todas as coordenadas para ajustar os limites
                    data.features.forEach((feature) => {
                        feature.geometry.coordinates.forEach((polygon) => {
                            polygon[0].forEach((coordinate) => {
                                bounds.extend(
                                    L.latLng(coordinate[1], coordinate[0])
                                )
                            })
                        })
                    })

                    // Verifique se this.map está definido
                    if (this.map) {
                        // Ajuste os limites do mapa para as coordenadas
                        this.map.flyToBounds(bounds)
                    } else {
                        console.error('O objeto do mapa não está definido.')
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar os resultados:', error)
            }
        },
    },
}
</script>


<style lang="sass">
.search-button
    z-index: 5

.search-input-container
    overflow: hidden
    margin-left: -20px !important
    height: 36px
    font-size: 20px

    .v-input__control
        min-height: 36px !important
</style>
