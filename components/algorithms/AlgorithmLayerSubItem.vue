<template>
  <div>
    <v-list-item>
      <v-list-item-icon v-if="type == 'button'" />

      <v-list-item-title> {{ title || layer.name }} </v-list-item-title>

      <v-list-item-action>
        <v-switch
          v-if="type == 'slider'"
          :input-value="layer.visible"
          @change="click(layer, index)"
        />

        <v-btn
          v-if="type == 'button'"
          icon
          color="primary"
          @click="toggleActivate()"
        >
          <v-icon
            v-if="!active"
            secondary
          >
            mdi-cog-counterclockwise
          </v-icon>
          <v-progress-circular
            v-if="active"
            indeterminate
            color="primary"
            width="2"
            size="20"
          />
        </v-btn>
      </v-list-item-action>
    </v-list-item>

    <v-dialog
      v-model="showDialogError"
      width="500"
    >
      <v-card>
        <v-card-title class="headline text-break">
          {{ $t('error-title') }}
        </v-card-title>

        <v-card-text class="py-6">
          {{ $t('error-text') }}
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<i18n>
    {
        "en": {
            "error-title": "Error trying to process Algorithm",
            "error-text": "User don't have permission to execute specific action."
        },
        "pt-br": {
            "error-title": "Erro ao tentar processar Algorítmo",
            "error-text": "Usuário não possui permissão para executar essa ação"
        }
    }
</i18n>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    layer: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      default: 'slider',
    },
  },

  data() {
    return {
      active: false,
      showDialogError: false,
    };
  },

  methods: {
    click(layer, index) {
      this.$emit('action', [layer, index]);
    },

    toggleActivate() {
      this.active = !this.active;
      this.mockedAction();
    },

    mockedAction() {
      setTimeout(() => {
        this.active = !this.active;
        this.showDialogError = !this.showDialogError;
        setTimeout(
          () => (this.showDialogError = !this.showDialogError),
          2000,
        );
      }, 800);
    },
  },
};
</script>
