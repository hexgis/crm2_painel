<template>
    <v-dialog v-model="dialog" max-width="800">
        <template #activator="{ on: dialog }">
            <v-tooltip left>
                <template #activator="{ on: tooltip }">
                    <v-btn
                        absolute
                        bottom
                        right
                        fab
                        ripple
                        color="primary"
                        class="mb-7 mr-4 btn--save-bookmark"
                        :loading="saving"
                        v-on="{ ...tooltip, ...dialog }"
                    >
                        <v-icon> mdi-plus </v-icon>
                    </v-btn>
                </template>
                <span> {{ $t('tooltip') }} </span>
            </v-tooltip>
        </template>
        <v-card>
            <v-card-title>
                {{ $t('title') }}
                <v-spacer></v-spacer>
                <v-btn icon class="mr-n5 mt-n5" @click="dialog = false">
                    <v-icon> mdi-close </v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text class="py-6">
                <p>{{ $t('info-text') }}</p>
                <v-row>
                    <v-col>
                        <v-text-field
                            v-model="name"
                            :label="$t('field-label')"
                            outlined
                            required
                            hide-details
                        />
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions class="justify-end">
                <v-btn
                    color="accent"
                    :disabled="!name"
                    :loading="saving"
                    @click="submit"
                >
                    {{ $t('button-label') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<i18n>
{
    "en": {
        "title": "Save Bookmark",
        "tooltip": "Save spatial bookmark",
        "info-text": "The bookmark will contain the current active layers, catalogs and bounding box.",
        "field-label": "Name",
        "button-label": "Save"
    },
    "pt-br": {
        "title": "Salvar Bookmark",
        "tooltip": "Salvar bookmark espacial",
        "info-text": "O bookmark terá as atuais camadas ativas, catálogos ativos e área delimitada.",
        "field-label": "Nome",
        "button-label": "Salvar"
    }
}
</i18n>

<script>
import { mapActions } from 'vuex'

export default {
    name: 'BookmarkSaveAction',

    data: () => ({
        dialog: false,
        name: '',
        saving: false,
    }),

    methods: {
        submit() {
            this.saving = true
            this.saveBookmark(this.name).finally(() => {
                this.saving = false
                this.getBookmarks()
                this.dialog = false
            })
        },

        ...mapActions('bookmarks', ['saveBookmark', 'getBookmarks']),
    },
}
</script>

<style lang="sass" scoped>
.btn--save-bookmark
    bottom: 0 !important
</style>
