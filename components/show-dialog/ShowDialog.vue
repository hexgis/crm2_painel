<template>
  <v-row class="d-none">
    <v-dialog
      v-model="dialog"
      persistent
      transition="dialog-bottom-transition"
      max-width="350"
    >
      <v-card>
        <v-card-title class="showDialog justify-center">
          <div>
            <h3>{{ $t('title-dialog') }}</h3>
          </div>
        </v-card-title>
        <v-card-text class="my-3 justify">
          <p>
            {{ $t('message-dialog') }}
          </p>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            small
            text
            color="red"
            dark
            @click="dialog = false"
          >
            {{ $t('confirm-dialog') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<i18n> { "en": { "title-dialog": "ATTENTION", "message-dialog": "Temporal searches with large clippings can take some time and overload your browser.", "confirm-dialog": "AGREE" }, "pt-br": { "title-dialog": "ATENÇÃO", "message-dialog": "Pesquisas temporais com recortes extensos podem levar algum tempo e sobrecarregar seu navegador.", "confirm-dialog": "CIENTE" } } </i18n>
<script>
export default {
  name: 'ShowDialog',
  data() {
    return { dialog: true };
  },
};
</script>
<style lang="sass" scoped>

.justify
    text-align: justify
</style>
