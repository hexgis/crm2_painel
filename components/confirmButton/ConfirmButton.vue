<template>
    <div>
        <div v-if="confirmAction === true">
            <v-btn icon class="cancel" @click="confirmAction = false">
                <v-icon size="50">mdi-close-circle-outline</v-icon>
            </v-btn>
            <v-btn icon class="confirm" @click="remove()">
                <v-icon size="50">mdi-check-circle-outline</v-icon></v-btn
            >
        </div>
        <div v-else>
            <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        icon
                        class="button-icon"
                        v-bind="attrs"
                        @click="confirmAction = true"
                        v-on="on"
                    >
                        <v-icon size="50">{{ icon }}</v-icon>
                    </v-btn>
                </template>
                <span> {{ iconTooltip }}</span>
            </v-tooltip>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        icon: {
            type: String,
            required: true,
        },
        iconTooltip: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            confirmAction: {
                type: Boolean,
                default: false,
            },
        }
    },
    methods: {
        remove() {
            this.confirmAction = false
            this.$emit('remove')
        },
    },
}
</script>
<style scoped lang="sass">
.button-icon
    opacity: 0.4
.button-icon:hover
    opacity: 1

.cancel
    color: rgba(255, 65, 54, 0.4) !important

.cancel:hover
    color: rgba(255, 65, 54) !important

.confirm
    color: rgb(46, 204, 64, 0.4) !important

.confirm:hover
    color: rgb(46, 204, 64) !important
</style>
