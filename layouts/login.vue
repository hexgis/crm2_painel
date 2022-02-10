<template>
    <v-app>
        <v-main class="pa-0">
            <v-container fluid fill-height class="background">
                <nuxt />
            </v-container>
        </v-main>
        <v-footer app absolute>
            <v-row dense class="justifiy-space-between align-center">
                <v-col>
                    <v-img
                        width="100"
                        height="40"
                        contain
                        src="/img/logocmr-img.png"
                    />
                </v-col>
                <v-col class="text-center white--text">
                    Copyright Funai-CMR © 2022
                </v-col>
                <v-spacer></v-spacer>
            </v-row>
        </v-footer>
    </v-app>
</template>

<script>
export default {
    name: 'App',

    head: () => ({
        title: 'Skyviewer',
    }),
}
</script>

<style lang="sass" scoped>
.background
    background-image: url('/img/aldeia.jpg')
    background-size: cover

.inner-title
    font-size: 18px
    margin-bottom: 15px

.v-footer
    background-color: rgba(0,0,0,0.4) !important
</style>
