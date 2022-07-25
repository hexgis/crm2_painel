<template>
    <v-dialog
        v-model="dialog"
        :fullscreen="$vuetify.breakpoint.smAndDown"
        max-width="1000"
        scrollable
        @click:outside="closeDialog"
    >
        <v-card>
            <v-card-title class="justify-space-between">
                <span class="headline">{{ title }}</span>

                <v-btn icon @click="closeDialog">
                    <v-icon> mdi-close </v-icon>
                </v-btn>
            </v-card-title>

            <v-divider />

            <v-card-text class="py-6">
                <v-row class="mt-2" align="center" justify="center">
                    <v-col cols="12" sm="8" md="6">
                        <v-img :src="imgSrc" />
                    </v-col>

                    <v-col cols="12" md="6">
                        <template v-for="(value, prop) in feature">
                            <v-row
                                v-if="!excludeProps.includes(prop)"
                                :key="prop"
                                align="center"
                                class="list-separator"
                                dense
                            >
                                <v-col cols="4" class="pr-2 text-right">
                                    <span> {{ formatProp(prop) }}: </span>
                                </v-col>
                                <v-col cols="8">
                                    <span class="text-subtitle-2">
                                        {{ value }}
                                    </span>
                                </v-col>
                            </v-row>
                        </template>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-divider />

            <v-card-actions class="justify-end">
                <v-btn text color="accent" @click="closeDialog"> Fechar </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'BaseMetadataModal',

    props: {
        feature: {
            type: Object,
            default: null,
        },
        imgSrc: {
            type: String,
            default: '',
        },
        title: {
            type: String,
            default: 'Image metadata',
        },
        excludeProps: {
            type: Array,
            default: () => [],
        },
    },

    data: () => ({
        dialog: true,
    }),

    watch: {
        feature(value) {
            if (value) {
                this.dialog = true
            }
        },
    },

    methods: {
        closeDialog() {
            this.dialog = false
            this.$emit('onDialogClose')
        },

        formatProp(prop) {
            return prop
                .replace('_', ' ')
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
        },
    },
}
</script>
