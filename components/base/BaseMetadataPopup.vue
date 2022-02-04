<template>
    <v-card>
        <v-card-text v-if="feature" class="px-10 pt-8 pb-10">
            <template v-for="(value, field) in feature">
                <v-row
                    v-if="value"
                    :key="field"
                    :align="field.align"
                    class="list-separator striped"
                    dense
                >
                    <v-col cols="5" class="text-subtitle-2">
                        {{ formatProp(field) }}
                        <span v-if="field === 'date_t0'">*</span>
                        <span v-if="field === 'date_t1'">**</span>
                        :
                    </v-col>
                    <v-col :title="value.length > 29 ? value : ''">
                        {{ value }}
                    </v-col>
                </v-row>
            </template>

            <div v-if="hasT0Field" class="image-hint-box">
                <span>{{ $t('t0-explanation') }}</span>
                <span>{{ $t('t1-explanation') }}</span>
            </div>

            <v-row v-if="hasT0Field" justify="center" dense>
                <v-btn color="accent" block @click="searchList(feature)">
                    {{ $t('search-images') }}
                </v-btn>
            </v-row>
        </v-card-text>
        <v-card-text v-else>
            <template v-for="i in 4">
                <v-row :key="i" dense>
                    <v-col cols="5" class="text-left">
                        <v-skeleton-loader class="pt-1" type="text" />
                    </v-col>
                    <v-col cols="7">
                        <v-skeleton-loader class="pt-1" type="text" />
                    </v-col>
                </v-row>
            </template>
        </v-card-text>
    </v-card>
</template>

<i18n>
{
    "en": {
        "search-images": "Search Images",
        "t0-explanation": "Date T0*: last Landsat-8 image in which the vegetation coverage alteration still hadn't began",
        "t1-explanation": "Date T1**: satellite image date in which is possible to see the first visual alteration in vegetation cover"
    },
    "pt-br": {
        "search-images": "Visualizar Imagens",
        "t0-explanation": "Data T0*: última imagem Landsat-8 em que a alteração da cobertura vegetal ainda não havia sido iniciada",
        "t1-explanation": "Data T1**: data da imagem do satélite em que o é possivel ver a primeira aparição da alteração da cobertura vegetal"
    }
}
</i18n>

<script>
import { mapMutations, mapActions, mapState } from 'vuex'

export default {
    name: 'BaseMetadataPopup',

    props: {
        feature: {
            type: Object,
            default: null,
        },
    },

    computed: {
        ...mapState('monitoring', ['filters']),
        hasT0Field() {
            const keys = Object.keys(this.feature)
            return keys.includes('date_t0')
        },
    },

    methods: {
        formatProp(prop) {
            return prop
                .replace('_', ' ')
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
        },

        searchList(feature) {
            const t0 = feature.date_t0
            const t1 = feature.date_t1
            const locator = feature.locator
            const satIds = []

            this.getImagesOnDates({
                t0,
                t1,
                satIds,
                locator,
                currentView: this.filters.currentView,
            })

            this.$router.push(this.localePath('/catalog'))
            this.clearScenesToCompare()
            this.setIsComparing(false)
        },
        ...mapActions('catalog', ['getImagesOnDates']),
        ...mapMutations('catalog', ['clearScenesToCompare', 'setIsComparing']),
    },
}
</script>

<style scoped lang="sass">
.striped
    flex-wrap: nowrap
    overflow-x: auto
    > .col
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis

.striped:nth-child(odd)
    background-color: rgba(0, 0, 0, 0.03)

.image-hint-box
    display: flex
    flex-direction: column
    background-color: #FFDC0030
    color: #736825
    font-size: 13px
    margin: 20px 0
    padding: 10px
    border-radius: 8px

    > span:not(:last-child)
        margin-bottom: 7px
</style>
