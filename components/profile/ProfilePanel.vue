<template>
    <div class="bottom-buttons">
        <v-menu left offset-x>
            <template #activator="{ on: onMenu }">
                <v-btn icon large class="mx-auto" v-on="onMenu">
                    <v-tooltip left>
                        <template #activator="{ on: onTooltip }">
                            <v-icon v-on="onTooltip">
                                mdi-account-circle
                            </v-icon>
                        </template>
                        <span>{{ $t('profile-tooltip') }}</span>
                    </v-tooltip>
                </v-btn>
            </template>
            <v-list>
                <v-list-item @click="openSettings()">
                    <v-icon> mdi-cog </v-icon>
                    <span class="pl-2"> {{ $t('preferences-button') }} </span>
                </v-list-item>
                <v-list-item @click="logout()">
                    <v-icon> mdi-logout </v-icon>
                    <span class="pl-2"> {{ $t('logout-button') }} </span>
                </v-list-item>
            </v-list>
        </v-menu>

        <ProfilePanelSettings
            v-if="settingsOpened"
            @onDialogClose="settingsOpened = false"
        />
    </div>
</template>

<i18n>
{
    "en": {
        "profile-tooltip": "Profile",
        "preferences-button": "Preferences",
        "logout-button": "Log out"
    },
    "pt-br": {
        "profile-tooltip": "Perfil",
        "preferences-button": "Preferências",
        "logout-button": "Sair"
    }
}
</i18n>

<script>
import { mapActions } from 'vuex'

import ProfilePanelSettings from '@/components/profile/ProfilePanelSettings'

export default {
    name: 'ProfileButtons',

    components: {
        ProfilePanelSettings,
    },

    model: {
        prop: 'settings',
        event: 'update',
    },

    props: {
        settings: {
            type: Boolean,
            default: false,
        },
    },

    data: () => ({
        settingsOpened: false,
        hasAnalytics: process.env.ANALYTICS === 'true',
    }),

    watch: {
        settings(value) {
            this.settingsOpened = value
        },

        settingsOpened(value) {
            this.$emit('update', value)
        },
    },

    methods: {
        openSettings() {
            this.settingsOpened = true
        },

        ...mapActions('auth', ['logout']),
    },
}
</script>

<style lang="sass">
.bottom-buttons
    position: absolute
    display: flex
    width: 100%
    bottom: 0
    padding-bottom: 8px
</style>
