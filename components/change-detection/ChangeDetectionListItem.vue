<template>
    <v-card
        tile
        outlined
        :color="hover ? 'grey lighten-4' : 'transparent'"
        @mouseenter="setHoveredDetection(index)"
        @mouseleave="setHoveredDetection(null)"
    >
        <v-card-text class="pa-3">
            <v-row>
                <v-col cols="5" class="py-4">
                    <v-hover v-slot="{ hover: hoverT0 }">
                        <div>
                            <v-img
                                :src="detection.scene_t0.preview"
                                lazy-src="/img/placeholder.png"
                                width="100"
                                height="100"
                                class="mx-auto"
                                :class="
                                    selectImage(hoverT0, detection.visibleT0)
                                "
                                contain
                            >
                                <v-fade-transition>
                                    <div
                                        v-if="hoverT0"
                                        class="
                                            hover-image
                                            fill-height
                                            d-flex
                                            align-center
                                            justify-center
                                            text-h6
                                            white--text
                                        "
                                        @click.stop="toggleDetectionSceneTms(0)"
                                    >
                                        <v-icon
                                            large
                                            :color="
                                                detection.visibleT0
                                                    ? 'accent'
                                                    : 'white'
                                            "
                                        >
                                            mdi-eye
                                        </v-icon>
                                    </div>
                                </v-fade-transition>
                            </v-img>
                        </div>
                    </v-hover>

                    <v-card-text class="px-1 pb-0">
                        <div class="d-flex mb-1">
                            <v-icon> mdi-calendar </v-icon>
                            <span class="ml-2">
                                {{ $date(detection.scene_t0.date) }}
                            </span>
                        </div>
                        <div class="d-flex mb-1">
                            <v-icon> mdi-web </v-icon>
                            <span class="ml-2">
                                {{ detection.scene_t0.locator }}
                            </span>
                        </div>
                        <div class="d-flex mb-1">
                            <v-icon> mdi-satellite-variant </v-icon>
                            <span class="ml-2">
                                {{ detection.scene_t0.sat }}
                            </span>
                        </div>
                        <div class="d-flex">
                            <v-icon> mdi-weather-partly-cloudy </v-icon>
                            <span class="ml-2">
                                {{ detection.scene_t0.cloud_cover.toFixed(1) }}
                                %
                            </span>
                        </div>
                    </v-card-text>
                </v-col>

                <v-col cols="5" class="py-4">
                    <v-hover v-slot="{ hover: hoverT1 }">
                        <div>
                            <v-img
                                :src="detection.scene_t1.preview"
                                lazy-src="/img/placeholder.png"
                                width="100"
                                height="100"
                                class="mx-auto"
                                :class="
                                    selectImage(hoverT1, detection.visibleT1)
                                "
                                contain
                            >
                                <v-fade-transition>
                                    <div
                                        v-if="hoverT1"
                                        class="
                                            hover-image
                                            fill-height
                                            d-flex
                                            align-center
                                            justify-center
                                            text-h6
                                            white--text
                                        "
                                        @click.stop="toggleDetectionSceneTms(1)"
                                    >
                                        <v-icon
                                            large
                                            :color="
                                                detection.visibleT1
                                                    ? 'accent'
                                                    : 'white'
                                            "
                                        >
                                            mdi-eye
                                        </v-icon>
                                    </div>
                                </v-fade-transition>
                            </v-img>
                        </div>
                    </v-hover>

                    <v-card-text class="px-1 pb-0">
                        <div class="d-flex mb-1">
                            <v-icon> mdi-calendar </v-icon>
                            <span class="ml-2">
                                {{ $date(detection.scene_t1.date) }}
                            </span>
                        </div>
                        <div class="d-flex mb-1">
                            <v-icon> mdi-web </v-icon>
                            <span class="ml-2">
                                {{ detection.scene_t1.locator }}
                            </span>
                        </div>
                        <div class="d-flex mb-1">
                            <v-icon> mdi-satellite-variant </v-icon>
                            <span class="ml-2">
                                {{ detection.scene_t1.sat }}
                            </span>
                        </div>
                        <div class="d-flex">
                            <v-icon> mdi-weather-partly-cloudy </v-icon>
                            <span class="ml-2">
                                {{ detection.scene_t1.cloud_cover.toFixed(1) }}
                                %
                            </span>
                        </div>
                    </v-card-text>
                </v-col>

                <v-col cols="2" class="pa-0">
                    <div class="d-flex align-center icon-container">
                        <v-tooltip bottom>
                            <template #activator="{ on }">
                                <div v-on="on">
                                    <v-switch
                                        :input-value="detection.visible"
                                        :loading="detection.loadingGeometry"
                                        color="accent"
                                        class="mt-0 ml-3"
                                        dense
                                        hide-details
                                        @change="
                                            toggleDetection(detection, index)
                                        "
                                    />
                                </div>
                            </template>
                            <span> {{ $t('view-label') }} </span>
                        </v-tooltip>
                    </div>

                    <v-divider />

                    <div class="icon-container">
                        <v-tooltip bottom>
                            <template #activator="{ on }">
                                <v-btn
                                    text
                                    block
                                    class="icon-button"
                                    v-on="on"
                                    @click="setZoomedDetection(index)"
                                >
                                    <v-icon> mdi-crosshairs-gps </v-icon>
                                </v-btn>
                            </template>
                            <span>{{ $t('zoom-label') }} </span>
                        </v-tooltip>
                    </div>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<i18n>
{
    "en": {
        "view-label": "View data",
        "zoom-label": "Zoom to area"
    },
    "pt-br": {
        "view-label": "Visualizar dados",
        "zoom-label": "Aproximar para área"
    }
}
</i18n>

<script>
import { mapMutations, mapActions } from 'vuex'

export default {
    name: 'ChangeDetectionListItem',

    props: {
        detection: {
            type: Object,
            required: true,
        },
        index: {
            type: Number,
            required: true,
        },
        hover: {
            type: Boolean,
            required: true,
        },
    },

    methods: {
        async toggleDetection() {
            if (!this.detection.result) {
                await this.getChangeDetectionGeometry(this.index)
            } else {
                this.toggleDetectionVisibility({
                    index: this.index,
                    visible: !this.detection.visible,
                })
            }
        },

        selectImage(hover, visible) {
            return !hover && !visible ? 'unselected' : ''
        },

        toggleDetectionSceneTms(sceneIndex) {
            const visible =
                sceneIndex === 0
                    ? this.detection.visibleT0
                    : this.detection.visibleT1

            this.toggleDetectionSceneVisibility({
                index: this.index,
                sceneIndex,
                visible: !visible,
            })

            this.$forceUpdate()
        },

        ...mapMutations('change-detection', [
            'setHoveredDetection',
            'toggleDetectionVisibility',
            'toggleDetectionSceneVisibility',
            'setZoomedDetection',
        ]),

        ...mapActions('change-detection', ['getChangeDetectionGeometry']),
    },
}
</script>

<style scoped lang="sass">
.icon-container
    height: 50%
    border-left: 1px solid rgba(0,0,0,0.2)

.icon-button
    height: 100% !important

.hover-image
    // background-color: rgba(180,180,180,0.5)
    background-color: rgba(180,180,180, 0)

.unselected
    opacity: 0.4
    transition: all ease 0.4s
</style>
