<template>
    <v-col class="usage-bar" :style="{ '--color': fontColor }">
        <template v-if="value && total">
            <v-progress-circular
                :value="used"
                :size="75"
                :color="color"
                width="8"
            >
                {{ usedString }}%
            </v-progress-circular>

            <v-progress-linear
                :value="used"
                :color="color"
                striped
                height="25"
                background-opacity="0.1"
            >
                {{ `${left} MB ${$t('usage-phrase')}` }}
            </v-progress-linear>
        </template>

        <template v-if="!data">
            <v-progress-circular
                :size="75"
                color="secondary"
                width="4"
                indeterminate
            >
            </v-progress-circular>

            <v-progress-linear
                color="secondary"
                height="6"
                background-opacity="0.1"
                indeterminate
            >
            </v-progress-linear>
        </template>

        <template v-if="value === 0 && total === 0">
            <v-progress-circular
                :value="used"
                :size="75"
                :color="color"
                width="8"
            >
                --
            </v-progress-circular>

            <v-progress-linear
                :value="used"
                :color="color"
                striped
                height="25"
                background-opacity="0.1"
            >
                {{ this.$i18n.t('no-data') }}
            </v-progress-linear>
        </template>
    </v-col>
</template>

<i18n>
    {
        "en": {
            "usage-phrase": "left",
            "lang": "en-US"
        },
        "pt-br": {
            "usage-phrase": "disponivel",
            "lang": "pt-BR"
        }
    }
</i18n>

<script>
export default {
    props: {
        data: {
            type: Object,
            default: null,
        },
    },
    computed: {
        value() {
            if (this.data) return this.data.consumed
            else return null
        },
        total() {
            if (this.data) return this.data.max
            else return null
        },
        used() {
            if (this.value && this.total) return (this.value / this.total) * 100
            else return 0
        },
        left() {
            if (this.value && this.total)
                return (this.total - this.value).toLocaleString(
                    this.$i18n.t('lang')
                )
            else return 0
        },
        usedString() {
            let number = parseFloat(this.used.toFixed(2))
            return number.toLocaleString(this.$i18n.t('lang'))
        },
        color() {
            if (this.used > 80) return 'red'
            else if (this.used > 50) return 'amber'
            return 'blue'
        },
        fontColor() {
            if (this.used > 80) return 'whitesmoke'
            return '#555'
        },
    },
}
</script>

<style lang='sass' scoped >
.usage-bar
    display: flex
    flex-direction: row
    align-items: center
    justify-content: space-between
    padding: 0 10px
    font-size: 12px
    font-weight: bold

    > .v-progress-linear
        margin-left: 10px
        border: 1px solid gray
        border-radius: 4px
        color: var(--color)
        font-size: 13px
</style>