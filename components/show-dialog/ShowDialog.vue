<template>
    <v-row justify="center" class="d-none font-weight-regular pt-2">
        <v-dialog
            v-model="dialog"
            persistent
            transition="dialog-bottom-transition"
            max-width="400"
        >
            <v-card>
                <v-card-title
                    class="font-weight-regular pt-2 text-h5"
                    color="secondary"
                >
                    {{ $t('title-dialog') }}
                </v-card-title>
                <v-card-text class="my-3">
                    <h3>{{ $t('message-dialog') }}</h3>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        small
                        color="accent"
                        class="font-weight-regular"
                        @click="dialog = false"
                    >
                        {{ $t('confirm-dialog') }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<i18n>
{
    "en": {
        "title-dialog": "ATTENTION",
        "message-dialog": "Temporal searches with large clippings can take some time and overload your browser.",
        "confirm-dialog": "AGREE"
    },
    "pt-br": {
        "title-dialog": "ATENÇÃO",
        "message-dialog": "Pesquisas temporais com recortes extensos podem levar algum tempo e sobrecarregar seu navegador.",
        "confirm-dialog": "CIENTE"
    }
}
</i18n>

<script>
export default {
    name: 'ShowDialog',
    data() {
        return {
            dialog: true,
        }
    },
}
</script>

<style></style>
