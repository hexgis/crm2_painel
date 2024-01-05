<template>
  <v-app>
    <v-main>
      <div>
        <div
          fluid
          class="background"
          style="height:87vh"
        >
          <nuxt />
        </div>
        <v-row class="secondary">
          <v-col />
        </v-row>
        <v-row class="info">
          <v-card
            class="ml-15 info"
            flat
            width="300"
            layout="row"
            layout-wrap
            layout-align="space-between"
          >
            <v-col>
              <v-img
                width="70"
                src="/img/funai.svg"
              />
            </v-col>
          </v-card>
          <v-col>
            <v-card
              width="300"
              class="info"
              flat
              layout="row"
              layout-wrap
              layout-align="space-between"
            >
              <v-card-title class="text-subtitle-1">
                {{ $t('we-are-help-title') }}
              </v-card-title>
              <v-card-subtitle>
                <p class="link-footer text-h7">
                  <a :href="helpLinks.cmrProjectUrl">{{ $t('we-are-help-link') }}</a>
                </p>
              </v-card-subtitle>
            </v-card>
          </v-col>
          <v-col>
            <v-card
              width="300"
              flat
              class="info"
              layout="row"
              layout-wrap
              layout-align="space-between"
            >
              <v-card-title class="text-subtitle-1">
                {{ $t('access-help-title') }}
              </v-card-title>
              <v-card-subtitle>
                <p class="link-footer text-h7">
                  <a
                    :href="helpLinks.solicitacaoAcessoCmr2"
                  >
                    {{ $t('access-help-link') }}
                  </a>
                </p>
              </v-card-subtitle>
            </v-card>
          </v-col>
          <v-col>
            <v-card
              width="300"
              flat
              class="info"
              layout="row"
              layout-wrap
              layout-align="space-between"
            >
              <v-card-title class="text-subtitle-1">
                {{ $t('project-help-title') }}
              </v-card-title>
              <v-card-subtitle>
                <p class="link-footer text-h7">
                  <a :href="helpLinks.cmrTalkToUs">{{ $t('project-help-link') }}</a>
                </p>
              </v-card-subtitle>
            </v-card>
          </v-col>
          <v-col
            v-if="userLogged"
          >
            <v-card
              flat
              width="300"
              class="info"
              layout="row"
              layout-wrap
              layout-align="space-between"
            >
              <v-card-title class="text-subtitle-1">
                {{ $t('manual-help-title') }}
              </v-card-title>
              <v-card-subtitle>
                <p class="link-footer text-h7">
                  <a :href="helpLinks.cmrManualUrl">
                    {{ $t('manual-help-link') }}
                  </a>
                </p>
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-main>
  </v-app>
</template>

<i18n>
{
  "en": {
    "manual-help-title": "View user manual",
    "manual-help-link": "User manual",
    "project-help-title": "Contact the project",
    "project-help-link": "Contact us",
    "access-help-title": "Request access",
    "access-help-link": "Access here",
    "access-help-text": "Submit the form to the CMR team for analysis",
    "we-are-help-title": "Who we are?",
    "we-are-help-link": "Discover our project"
  },
  "pt-br": {
    "manual-help-title": "Visualizar Manual do Usuário",
    "manual-help-link": "Manual do Usuário",
    "project-help-title": "Contate o Projeto",
    "project-help-link": "Fale conosco",
    "access-help-title": "Solicite acesso",
    "access-help-link": "Acesse aqui",
    "access-help-text": "Envie para a equipe do CMR o formulário para análise e liberação. ",
    "we-are-help-title": "Quem somos?",
    "we-are-help-link": "Conheça nosso projeto"
  }
}
</i18n>

<script>
export default {
  name: 'App',

  data() {
    return {
      userLogged: true, // "dataUser.token",
      helpLinks: {
        cmrManualUrl: 'https://cmr.funai.gov.br/api/media/Manual/Mapa Interativo/CMR_Manual_2021_V1.7.1.pdf',
        solicitacaoAcessoCmr2: 'https://cmr.funai.gov.br/app/#/solicitacao-acesso',
        cmrProjectUrl: 'https://cmr.funai.gov.br/o-projeto/',
        cmrTalkToUs: 'https://cmr.funai.gov.br/contato/',
      },
    };
  },

  head: () => ({
    title: 'Skyviewer',
  }),
};
</script>

<style lang="sass" scoped>
.background
    background-image: url('/img/login.jpg')
    background-size: cover

.inner-title
    font-size: 18px
    margin-bottom: 15px

.v-footer
    background-color: rgba(0,0,0,0.4) !important

.link-footer a
    cursor: pointer
    color: white
    text-decoration: underline

</style>
