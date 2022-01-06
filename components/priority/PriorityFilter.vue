<template>
    <v-form v-model="valid">
        <v-row dense>
            <v-col cols="12">
                <v-checkbox
                    v-model="filters.currentView"
                    :label="$t('current-view-label')"
                />
            </v-col>
            
            <v-col cols="6">
                <BaseDateField
                    v-model="filters.startDate"
                    :label="$t('start-date-label')"
                    :required="true"
                    outlined
                />
            </v-col>

            <v-col cols="6">
                <BaseDateField
                    v-model="filters.endDate"
                    :label="$t('end-date-label')"
                    :required="true"
                    :min-date="filters.startDate"
                    outlined
                />
            </v-col>
            <v-col cols="12">
                <v-btn
                    block
                    color="accent"
                    :loading="isLoadingScenes"
                    :disabled="!valid"
                    @click="submit"
                >
                    {{ $t('search-button') }}
                </v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<i18n>
{
    "en": {
        "current-view-label": "Search in current area?",
        "start-date-label": "Start date",
        "end-date-label": "End date",
        "search-button": "Search"
    },
    "pt-br": {
        "current-view-label": "Pesquisar nesta área?",
        "start-date-label": "Data inicial",
        "end-date-label": "Data final",
        "search-button": "Pesquisar"
    }
}
</i18n>

<script>
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex'

import BaseDateField from '@/components/base/BaseDateField'

export default {
    name: 'Filters',

    components: { BaseDateField },

    data() {
        return {
            searchInput: null,
            valid: null,
            filters: {
                currentView: true,
                startDate: this.$moment(
                    process.env.CATALOG_DEFAULT_START_DATE
                ).format('YYYY-MM-DD'),
                endDate: this.$moment().format('YYYY-MM-DD'),
                imageName: '',
            },
        }
    },

    created() {

        if (this.showScenes) {
            const storeFilters = this.$store.state.catalog.filters
            this.filters.currentView = storeFilters.currentView
            this.filters.startDate = storeFilters.startDate
            this.filters.endDate = storeFilters.endDate
            this.filters.imageName = storeFilters.imageName
        }
    },

    methods: {
        submit() {
            this.getScenes(this.filters)
            this.clearScenesToCompare()
            this.setIsComparing(false)
        },

        ...mapMutations('catalog', ['clearScenesToCompare', 'setIsComparing']),

        ...mapActions('catalog', ['getScenes', 'getSatellites']),
    },
}
</script>
