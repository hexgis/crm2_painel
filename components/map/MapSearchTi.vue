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
        <BaseTiMetadataPopup
            :tiName="tiName"
            :data="popupData"
            v-if="showPopup"
        />
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
import { mapActions } from 'vuex';
import BaseTiMetadataPopup from '@/components/base/BaseTiMetadataPopup.vue';

export default {
    name: 'MapSearchTi',

    components: {
        BaseTiMetadataPopup,
    },

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
            showPopup: false,
            tiName: '',
            popupData: null,
        };
    },

    watch: {
        searchQuery() {
            if (!this.searchQuery || !(this.searchQuery.length > 4)) {
                this.searchResults = [];
                this.isLoading = false;
                return;
            }
            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }
            this.searchTimeout = setTimeout(
                () => this.searchOnProvider(this.searchQuery),
                1000
            );
        },
    },

    methods: {
        ...mapActions('map', ['fetchSearchResults']), // Substitua 'seuMóduloVuex' pelo nome do seu módulo Vuex
        
        async searchOnProvider(response) {
            try {
                const data = await this.fetchSearchResults(response);

                // Verifique se há dados retornados e se há features na coleção
                if (data && data.features && data.features.length > 0) {
                    // Inicialize os limites vazios
                    let bounds = L.latLngBounds();

                    // Itere sobre todas as features e todas as coordenadas para ajustar os limites
                    data.features.forEach((feature) => {
                        feature.geometry.coordinates.forEach((polygon) => {
                            polygon[0].forEach((coordinate) => {
                                bounds.extend(
                                    L.latLng(coordinate[1], coordinate[0])
                                );
                            });
                        });
                    });

                    // Verifique se this.map está definido
                    if (this.map) {
                        // Ajuste os limites do mapa para as coordenadas
                        this.map.flyToBounds(bounds);

                        // Adicione um evento de clique para mostrar o popup
                        this.map.on('click', (e) => {
                            if (bounds.contains(e.latlng)) {
                                this.showPopup = true;
                                this.tiName = 'Nome da TI'; // Defina o nome da TI conforme necessário
                                this.popupData = data;
                            }
                        });
                    } else {
                        console.error('O objeto do mapa não está definido.');
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar os resultados:', error);
            }
        },
    },
};
</script>

<style lang="sass">
.popup-header
    height: 50px
    padding-top: 25px
    font-size: 20px

.leaflet-popup-close-button
    margin: 30px 20px 0

.leaflet-popup-content-wrapper
    width: 420px

.popup-table-wrapper
    max-height: 300px
    width: 400px
    overflow-y: auto
    padding-top: 25px

.popup-table
    border-collapse: collapse
    padding-top: 25px

.popup-table td, .popup-table th
    border-bottom: 1px solid #dddddd
    padding: 8px

.popup-table tr:hover
    background-color: #dddddd

.search-button
    z-index: 5

.search-input-container
    overflow: hidden
    margin-left: -20px !important
    height: 36px
    font-size: 20px

    .v-input__control
        min-height: 36px !important

.search-input

    .v-input__slot
        padding-left: 30px !important
        border-radius: 0 40px 40px 0
        height: 36px !important

.search-list
    margin-left: 30px

.slide-x-enter-active, .slide-x-leave-active
    transition: all 0.6s ease

.slide-x-enter, .slide-x-leave-to
    transform: translateX(-100%)
</style>
