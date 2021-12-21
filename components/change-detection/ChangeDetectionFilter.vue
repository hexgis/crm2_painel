<template>
    <v-form v-model="valid">
        <v-row dense class="pt-3">
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
                    :min-date="filters.startDateT0"
                    outlined
                />
            </v-col>

            <v-col class="pt-0">
                <v-btn
                    block
                    color="accent"
                    :loading="isLoadingDetections"
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
        "start-date-label": "Start date",
        "end-date-label": "End date",
        "search-button": "Search"
    },
    "pt-br": {
        "start-date-label": "Data inicial",
        "end-date-label": "Data final",
        "search-button": "Pesquisar"
    }
}
</i18n>

<script>
import { mapActions, mapState } from 'vuex'

import BaseDateField from '@/components/base/BaseDateField'

export default {
    name: 'Filters',

    components: { BaseDateField },

    data() {
        return {
            valid: null,
            filters: {
                startDate: this.$moment(
                    process.env.CHANGE_DETECTION_DEFAULT_START_DATE
                ).format('YYYY-MM-DD'),
                endDate: this.$moment().format('YYYY-MM-DD'),
            },
        }
    },

    computed: {
        ...mapState('change-detection', ['satellites', 'isLoadingDetections']),
    },

    methods: {
        submit() {
            this.getChangeDetections(this.filters)
            this.$emit('onSearch')
        },

        ...mapActions('change-detection', ['getChangeDetections']),
    },
}
</script>

