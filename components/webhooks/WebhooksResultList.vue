<template>
  <div>
    <p class="text-caption text-right text--secondary mr-2 mt-2 mb-1">
      <template v-if="!paused">
        <v-progress-circular
          indeterminate
          size="14"
          width="1"
          class="mr-1"
        />

        <v-btn
          icon
          small
          @click="pauseConnection"
        >
          <v-icon> mdi-pause </v-icon>
        </v-btn>
      </template>
      <v-btn
        v-else
        icon
        small
        @click="resumeConnection"
      >
        <v-icon> mdi-play </v-icon>
      </v-btn>
      {{ results.length }} {{ $t('results') }}
    </p>

    <v-card
      v-for="(result, i) in results"
      :key="i"
      tile
      outlined
    >
      <v-card-text>
        <v-row align="center">
          <v-col cols="6">
            <v-img
              v-if="result.face"
              :src="result.face"
              :lazy-src="'/img/placeholder.png'"
            />
            <v-img
              v-if="result.thumbnail"
              :src="result.thumbnail"
              :lazy-src="'/img/placeholder.png'"
            />
          </v-col>

          <v-col
            cols="6"
            class="pl-2"
          >
            <div class="mb-1">
              Date: {{ $datetime(result.created_date) }}
            </div>
            <div class="mb-1">
              Camera: {{ result.camera.name }}
            </div>
            <div class="mb-1">
              Frame:
              <a
                v-if="result.fullframe"
                :href="result.fullframe"
                target="_blank"
              >Link</a>
              <a
                v-if="result.frame"
                :href="result.frame"
                target="_blank"
              >Link</a>
            </div>
            <div
              v-for="(value, name) in result.features"
              :key="name"
              class="mb-1"
            >
              <span
                v-if="value"
                class="text-capitalize"
              >
                {{ name }}:
                {{
                  typeof value === 'object'
                    ? value.name
                    : value
                }}
              </span>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<i18n>
{
    "en": {
        "results": "results",
        "sort-label": "Sort by",
        "date-label": "Date",
        "cloud-label": "Cloud cover"
    },
    "pt-br": {
        "results": "resultados",
        "sort-label": "Ordenar por",
        "date-label": "Data",
        "cloud-label": "Taxa de nuvens"
    }
}
</i18n>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'WebhooksResultList',

  computed: mapState('webhooks', ['results', 'paused']),

  methods: mapMutations('webhooks', ['pauseConnection', 'resumeConnection']),
};
</script>

<style lang="sass">
.no-padding
    > .v-list-item
        padding: 0 !important
</style>
