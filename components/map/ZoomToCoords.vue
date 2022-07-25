<template>
    <div class="d-flex mt-3">
        <v-tooltip right :disabled="zooming">
            <template #activator="{ on }">
                <v-btn
                    fab
                    ripple
                    height="36"
                    width="36"
                    class="button-drawer"
                    @click="toggleDrawer()"
                    v-on="on"
                >
                    <transition name="slide-x">
                        <v-icon v-if="!zooming" class="zoomin-icon"
                            >mdi-navigation-outline</v-icon
                        >
                        <v-icon v-if="zooming" class="back-icon"
                            >mdi-arrow-left</v-icon
                        >
                    </transition>
                </v-btn>
            </template>
            <span> {{ $t('zoom-to') }} </span>
        </v-tooltip>
        <div class="coords-block">
            <transition name="slide-x">
                <div v-if="zooming" class="drawer">
                    <template v-if="coordType == $t('decimal-label')">
                        <v-text-field
                            v-model="lat"
                            placeholder="Latitude"
                            class="decimal-field"
                            :class="latError"
                            suffix="°"
                            solo
                            flat
                        />
                        <span class="separator"></span>
                        <v-text-field
                            v-if="coordType == $t('decimal-label')"
                            v-model="lng"
                            class="decimal-field"
                            :class="lngError"
                            placeholder="Longitude"
                            suffix="°"
                            solo
                            flat
                        />
                        <span class="separator"></span>
                    </template>
                    <template v-if="coordType == $t('dms-label')">
                        <v-text-field
                            v-model="degN"
                            :placeholder="$t('degree-label')"
                            class="dms-field"
                            :class="degNError"
                            suffix="°"
                            solo
                            hide-details
                            flat
                        />
                        <v-text-field
                            v-model="minN"
                            :placeholder="$t('minute-label')"
                            class="dms-field"
                            :class="minNError"
                            suffix="'"
                            solo
                            hide-details
                            flat
                        />
                        <v-text-field
                            v-model="secN"
                            :placeholder="$t('second-label')"
                            class="dms-field"
                            :class="secNError"
                            suffix='"'
                            solo
                            hide-details
                            flat
                        />
                        <span class="separator"></span>
                        <v-text-field
                            v-model="degW"
                            :placeholder="$t('degree-label')"
                            class="dms-field"
                            :class="degWError"
                            suffix="°"
                            solo
                            hide-details
                            flat
                        />
                        <v-text-field
                            v-model="minW"
                            :placeholder="$t('minute-label')"
                            class="dms-field"
                            :class="minWError"
                            suffix="'"
                            solo
                            hide-details
                            flat
                        />
                        <v-text-field
                            v-model="secW"
                            :placeholder="$t('second-label')"
                            class="dms-field"
                            :class="secWError"
                            suffix='"'
                            solo
                            hide-details
                            flat
                        />
                        <span class="separator"></span>
                    </template>
                    <v-select
                        v-model="coordType"
                        solo
                        hide-details
                        flat
                        :items="[$t('dms-label'), $t('decimal-label')]"
                    ></v-select>
                    <v-btn height="36" width="36" @click="zooms()">
                        <v-icon class="zoomin-icon"
                            >mdi-navigation-outline</v-icon
                        >
                    </v-btn>
                </div>
            </transition>
        </div>
    </div>
</template>

<i18n>
{
    "en": {
        "zoom-to": "Zoom to a point",
        "dms-label": "D.M.S.",
        "decimal-label": "Decimal",
        "degree-label": "Deg",
        "minute-label": "Min",
        "second-label": "Sec",
        "dms-north": "N",
        "dms-west": "W",
        "dms-south": "S",
        "dms-est": "E"
    },
    "pt-br": {
        "zoom-to": "Aproximar para um ponto",
        "dms-label": "G.M.S.",
        "decimal-label": "Decimal",
        "degree-label": "Grau",
        "minute-label": "Min",
        "second-label": "Seg",
        "dms-north": "N",
        "dms-west": "O",
        "dms-south": "S",
        "dms-est": "E"
    }
}
</i18n>

<script>
export default {
    props: {
        map: {
            type: Object,
            default: null,
        },
    },

    data() {
        return {
            zooming: false,
            coordType: this.$i18n.t('decimal-label'),
            center: null,
            lat: '',
            lng: '',
            degN: '',
            minN: '',
            secN: '',
            degW: '',
            minW: '',
            secW: '',
            hasError: true,
        }
    },

    computed: {
        latError() {
            return this.addErrorOnField(this.lat, 180, -180)
        },
        lngError() {
            return this.addErrorOnField(this.lng, 90, -90)
        },
        degNError() {
            return this.addErrorOnField(this.degN, 180, -180)
        },
        minNError() {
            return this.addErrorOnField(this.minN, 59, 0)
        },
        secNError() {
            return this.addErrorOnField(this.secN, 59, 0)
        },
        degWError() {
            return this.addErrorOnField(this.degW, 90, -90)
        },
        minWError() {
            return this.addErrorOnField(this.minW, 59, 0)
        },
        secWError() {
            return this.addErrorOnField(this.secW, 59, 0)
        },
    },

    methods: {
        toggleDrawer() {
            this.zooming = !this.zooming
        },

        addErrorOnField(fieldValue, maxValue, minValue) {
            const formattedValue = parseFloat(fieldValue)

            if (!fieldValue || formattedValue.toString() !== fieldValue)
                return 'error-field'
            else if (!!maxValue && formattedValue > maxValue)
                return 'error-field'
            else if (!!minValue && formattedValue < minValue)
                return 'error-field'

            return ''
        },

        calculteDecimal(deg, min, sec) {
            return (
                parseFloat(deg) + parseFloat(min / 60) + parseFloat(sec / 3600)
            )
        },

        zooms() {
            let latitude
            let longitude

            if (this.coordType === this.$i18n.t('dms-label')) {
                if (
                    this.degNError ||
                    this.degWError ||
                    this.minNError ||
                    this.minWError ||
                    this.secNError ||
                    this.secWError
                )
                    return

                latitude = this.calculteDecimal(this.degN, this.minN, this.secN)
                longitude = this.calculteDecimal(
                    this.degW,
                    this.minW,
                    this.secW
                )
            } else if (this.coordType === this.$i18n.t('decimal-label')) {
                if (this.latError || this.lngError) return

                latitude = parseFloat(this.lat)
                longitude = parseFloat(this.lng)
            } else return

            this.map.flyTo([latitude, longitude], 12)

            if (this.center) this.center.remove()

            this.center = this.$L.circleMarker([latitude, longitude], {
                color: '#2c3649',
                fillOpacity: '0.8',
            })

            this.center.addTo(this.map)

            this.toggleDrawer()
        },
    },
}
</script>

<style lang="sass">
.zoomin-icon
    transform: rotate(45deg)

.error-field
    color: #d8573c !important

    input
        color: #d8573c !important

.separator
    padding-right: 20px

.button-drawer
    z-index: 5

.coords-block
    margin-left: -18px
    overflow: hidden

    .drawer
        overflow: hidden
        background-color: white
        border-radius: 4px 40px 40px 4px
        padding-left: 20px
        display: flex

        .v-btn
            border-radius: 40px
            min-width: 36px
            background-color: rgb(215, 215, 215)
            box-shadow: none
            border: 1px solid rgba(0, 0, 0, 0.1)

        .v-input
            padding-top: 0 !important
            height: 36px

            .v-input__control
                min-height: 36px !important
                height: 36px
                width: 120px

    .decimal-field
        width: 105px

    .dms-field
        width: 60px
</style>
