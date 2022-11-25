<template>
  <v-form v-model="valid">
    <v-row
      dense
      class="pt-3"
    >
      <v-col cols="12">
        <v-text-field
          v-model="webhookUrl"
          :label="$t('url-label')"
          outlined
          required
          :rules="[!!webhookUrl || $t('required-label')]"
        />
      </v-col>

      <v-col cols="6">
        <v-text-field
          v-model="latitude"
          type="number"
          :label="$t('latitude-label')"
          outlined
        />
      </v-col>

      <v-col cols="6">
        <v-text-field
          v-model="longitude"
          type="number"
          :label="$t('longitude-label')"
          outlined
        />
      </v-col>

      <v-col cols="12">
        <v-btn
          block
          color="accent"
          :disabled="!valid || (!!results.length && !paused)"
          @click="submit"
        >
          {{ $t('submit-button') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<i18n>
{
    "en": {
        "url-label": "Webhook URL",
        "latitude-label": "Latitude",
        "longitude-label": "Longitude",
        "submit-button": "Connect",
        "required-label": "Field is required"
    },
    "pt-br": {
        "url-label": "URL do Webhook",
        "latitude-label": "Latitude",
        "longitude-label": "Longitude",
        "submit-button": "Conectar",
        "required-label": "Campo obrigatório"
    }
}
</i18n>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'WebhookFilter',

  data() {
    return {
      valid: null,
      webhookUrl: 'ws://ws.xskylab.com/events/',
      latitude: '-15.8162',
      longitude: '-47.8450',
    };
  },

  computed: mapState('webhooks', ['results', 'paused']),

  methods: {
    submit() {
      this.clearResults();
      this.setPoint([this.latitude, this.longitude]);
      this.connectWebhook(this.webhookUrl);
      this.$emit('onSearch');
    },

    ...mapMutations('webhooks', ['setPoint', 'clearResults']),
    ...mapActions('webhooks', ['connectWebhook']),
  },
};
</script>

<style>
.v-input--slider .v-messages {
    display: none;
}
</style>
