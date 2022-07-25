<template>
    <v-card>
        <v-card-text>
            <v-form v-model="valid">
                <v-row wrap justify="center" class="mt-6">
                    <v-col cols="2">
                        <v-select
                            v-model="filters.yearFrom"
                            :label="$t('date-label-before')"
                            :items="yearList"
                            item-text="identifier"
                            item-value="identifier"
                            outlined
                            hide-details
                        >
                        </v-select>
                    </v-col>
                    <v-col cols="2">
                        <v-select
                            v-model="filters.yearTo"
                            :label="$t('date-label-after')"
                            :items="yearList"
                            item-text="identifier"
                            item-value="identifier"
                            outlined
                            hide-details
                        >
                        </v-select>
                    </v-col>
                    <v-col cols="3">
                        <v-select
                            v-model="filters.state"
                            :label="$t('state-label')"
                            :items="stateList"
                            item-text="name"
                            item-value="uf"
                            outlined
                            multiple
                            hide-details
                        >
                        </v-select>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
        <v-card-actions class="px-5 py-4 justify-end">
            <v-btn
                color="accent"
                :loading="isLoadingAgroData"
                :disabled="!valid"
                @click="submit"
            >
                {{ $t('filter-button') }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<i18n>
{
    "en": {
        "date-label-before": "From Year",
        "date-label-after": "To Year",
        "state-label": "States",
        "filter-button": "Filter"
    },
    "pt-br": {
        "date-label-before": "Ano Inicial",
        "date-label-after": "Ano Final",
        "state-label": "Estados",
        "filter-button": "Filtrar"
    }
}
</i18n>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
    name: 'AnalyticsFilter',

    data() {
        return {
            yearList: [...Array(34).keys()].reverse().map((x) => ({
                identifier: x + 1988,
            })),
            stateList: [
                { name: 'Acre', uf: 'AC' },
                { name: 'Alagoas', uf: 'AL' },
                { name: 'Amapá', uf: 'AP' },
                { name: 'Amazonas', uf: 'AM' },
                { name: 'Bahia', uf: 'BA' },
                { name: 'Ceará', uf: 'CE' },
                { name: 'Distrito Federal', uf: 'DF' },
                { name: 'Espírito Santo', uf: 'ES' },
                { name: 'Goiás', uf: 'GO' },
                { name: 'Maranhão', uf: 'MA' },
                { name: 'Mato Grosso', uf: 'MT' },
                { name: 'Mato Grosso do Sul', uf: 'MS' },
                { name: 'Minas Gerais', uf: 'MG' },
                { name: 'Pará ', uf: 'PA' },
                { name: 'Paraíba', uf: 'PB' },
                { name: 'Paraná', uf: 'PR' },
                { name: 'Pernambuco', uf: 'PE' },
                { name: 'Piauí', uf: 'PI' },
                { name: 'Rio de Janeiro', uf: 'RJ' },
                { name: 'Rio Grande do Norte', uf: 'RN' },
                { name: 'Rio Grande do Sul', uf: 'RS' },
                { name: 'Rondônia', uf: 'RO' },
                { name: 'Roraima', uf: 'RR' },
                { name: 'Santa Catarina', uf: 'SC' },
                { name: 'São Paulo', uf: 'SP' },
                { name: 'Sergipe', uf: 'SE' },
                { name: 'Tocantins', uf: 'TO' },
            ],
            filters: {
                state: ['PI'],
                yearFrom: 2000,
                yearTo: 2021,
            },
            valid: null,
            panel: 0,
        }
    },

    computed: {
        ...mapState('analytics', ['isLoadingAgroData', 'stageList']),
        ...mapState('monitoring', { monitoringFilters: 'filters' }),
    },

    created() {
        this.setInitialFilters()
        this.getAgroData(this.filters)
    },

    methods: {
        setInitialFilters() {
            if (this.$store.state.analytics.agroFilters) {
                this.filters = this.$store.state.analytics.agroFilters
            }
        },

        async getTypes() {
            this.monitoringTypes = await this.$api.$get(
                'monitoring/stats/types/'
            )
        },

        getStateIconSrc(uf) {
            return !uf
                ? '/img/estados/brasil-s.png'
                : '/img/estados/' + uf.toLowerCase() + '-s.png'
        },

        submit() {
            this.setAgroFilters(this.filters)
            this.getAgroData(this.filters)
        },

        ...mapMutations('analytics', ['setAgroFilters']),
        ...mapActions('analytics', ['getAgroData', 'getStages']),
    },
}
</script>

<style lang="sass">
.full-width
    width: 100%

.state-filter-card

    &:hover
        background-color: #F6F6F6
        cursor: pointer

.state-label
    position: absolute
    bottom: 0
    margin-left: 40px
    font-weight: 500
    font-size: 13px

.v-select__selections
    overflow: hidden
    height: 40px
</style>
