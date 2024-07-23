<template>
  <v-form
    v-model="valid"
    class="fill-height"
    @submit.prevent="changePassword"
  >
    <v-card elevation="0">
      <v-progress-linear
        v-show="isLoading"
        class="my-0 login-progress"
        :indeterminate="true"
        height="3"
        color="accent"
      />

      <v-card-text class="pa-6">
        <v-row>
          <v-col cols="12">
            <span> {{ $t('info-message') }} </span>
          </v-col>
        </v-row>

        <v-row>
          <v-col
            cols="6"
            class="pb-0"
          >
            <v-text-field
              v-model="oldPassword"
              :label="$t('old-pass-label')"
              type="password"
              required
              outlined
              :rules="[
                () => !!oldPassword || $t('required-error'),
              ]"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="6"
            class="py-0"
          >
            <v-text-field
              v-model="newPassword"
              :label="$t('new-pass-label')"
              type="password"
              required
              outlined
              :rules="[
                () => !!newPassword || $t('required-error'),
                () =>
                  newPassword !== oldPassword ||
                  $t('old-new-match-error'),
                () =>
                  (newPassword && newPassword.length >= 8) ||
                  $t('new-length-error'),
              ]"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="6"
            class="py-0"
          >
            <v-text-field
              v-model="confirmPassword"
              :label="$t('new-pass-confirm-label')"
              type="password"
              required
              outlined
              :rules="[
                () => !!confirmPassword || $t('required-error'),
                () =>
                  newPassword === confirmPassword ||
                  $t('new-confirm-match-error'),
              ]"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn
          color="accent"
          type="submit"
          :disabled="!valid"
          :loading="isLoading"
        >
          {{ $t('confirm-button') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<i18n>
{
    "en": {
        "info-message": "To change your password, inform your current password and the new password to replace it. New passwords must contain at least 8 characters and must not be identical to previous password",
        "old-pass-label": "Current password",
        "new-pass-label": "New password",
        "new-pass-confirm-label": "Confirm password",
        "required-error": "Fill all required fields",
        "old-new-match-error": "Password must be different from previous password",
        "new-confirm-match-error": "Passwords do not match",
        "new-length-error": "Password must contain at least 8 characters",
        "confirm-button": "Change password",
        "success-message": "Password changed!",
        "error-message": "Error while changing password"
    },
    "pt-br": {
        "info-message": "Para alterar sua senha, insira a senha atual e a nova para substituí-la. Senhas novas devem ter no mínimo 8 caracteres e não devem ser iguais a senha anterior.",
        "old-pass-label": "Senha atual",
        "new-pass-label": "Nova senha",
        "new-pass-confirm-label": "Confirmar senha",
        "required-error": "Preencha todos os campos",
        "old-new-match-error": "Senha deve ser diferente da senha antiga",
        "new-confirm-match-error": "As senhas não coincidem",
        "new-length-error": "Senha deve ter no mínimo 8 caracteres",
        "confirm-button": "Alterar senha",
        "success-message": "Senha alterada!",
        "error-message": "Não foi possível alterar a senha"
    }
}
</i18n>

<script>
import { mapActions, mapMutations } from 'vuex';

export default {
  name: 'ProfilePanelPassword',

  data: () => ({
    valid: null,
    oldPassword: null,
    newPassword: null,
    confirmPassword: null,
    isLoading: false,
  }),

  methods: {
    async changePassword() {
      this.isLoading = true;
      try {
        await this.changeUserPassword({
          oldPassword: this.oldPassword,
          newPassword1: this.newPassword,
          newPassword2: this.confirmPassword,
        });

        this.addAlert({
          message: this.$t('success-message'),
        });
      } catch (_) {
        this.addAlert({
          message: this.$t('error-message'),
        });
      } finally {
        this.isLoading = false;
      }
    },

    ...mapActions('auth', ['changeUserPassword']),
    ...mapMutations('alert', ['addAlert']),
  },
};
</script>
