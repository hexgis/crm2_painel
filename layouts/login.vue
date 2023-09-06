<template>
  <v-app>
    <v-main>
      <div style="overflow-y:auto">
        <div
          fluid
          class="background"
          style="height:80vh"
        >
          <nuxt />
        </div>
        <!-- color="accent" -->
        <v-row class="rounded-b-xl red darken-2"> <v-col></v-col></v-row>
        <v-row class="ma-3 py-4 helpBar">
          <v-col flat cols="12" md="4" lg="3">
            <v-card flat class="md-padding background-none" layout="row" layout-wrap layout-align="space-between">
              <v-card-title class="cmr-v2-footer-h4 text-h6 text-md-h5">
                {{ $t('we-are-help-title') }}
              </v-card-title>
              <v-card-subtitle>
                <p class="footer-text-content link-footer text-h6">
                  <a :href="helpLinks.cmrProjectUrl">{{ $t('we-are-help-link') }}</a>
                </p>
              </v-card-subtitle>
            </v-card>
          </v-col>
          <v-col cols="12" md="4" lg="3">
            <v-card flat class="md-padding background-none" layout="row" layout-wrap layout-align="space-between">
              <v-card-title class="cmr-v2-footer-h4 text-h6 text-md-h5">
                {{ $t('access-help-title') }}
              </v-card-title>
              <v-card-subtitle>
                <p class="d-none d-md-flex footer-text-content link-footer">
                  {{ $t('access-help-text') }}
                </p>
                <p class="footer-text-content link-footer">
                  <a :href="helpLinks.solicitacaoAcessoCmr2" class="text-h6">
                    {{ $t('access-help-link') }}
                  </a>
                </p>
              </v-card-subtitle>
            </v-card>
          </v-col>
          <v-col cols="12" md="4" lg="3">
            <v-card flat class="md-padding background-none" layout="row" layout-wrap layout-align="space-between">
              <v-card-title class="cmr-v2-footer-h4 text-h6 text-md-h5">
                {{ $t('project-help-title') }}
              </v-card-title>
              <v-card-subtitle>
                <p class="footer-text-content link-footer text-h6">
                  <a :href="helpLinks.cmrTalkToUs">{{ $t('project-help-link') }}</a></a>
                </p>
              </v-card-subtitle>
            </v-card>
          </v-col>
          <v-col v-if="userLogged" cols="12" md="4" lg="3">
            <v-card flat class="md-padding background-none" layout="row" layout-wrap layout-align="space-between">
              <v-card-title class="cmr-v2-footer-h4 text-h6 text-md-h">
                {{ $t('manual-help-title') }}
              </v-card-title>
              <v-card-subtitle>
                <p class="footer-text-content link-footer footer text-h6">
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
    <v-footer
      app
      absolute
    >
    <v-container
        fluid>
      <v-row
        dense
        class="justifiy-space-between align-center"
      >
        <v-col />
        <v-col class="text-center white--text">
        </v-col>
        <v-spacer />
      </v-row>

      </v-container>
    </v-footer>
  </v-app>
</template>

<i18n>
{
  "en": {
    "manual-help-title": "View User Manual",
    "manual-help-link": "User Manual",
    "project-help-title": "Contact the Project",
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

  head: () => ({
    title: 'Skyviewer',
    }),

  data() {
    return{
      userLogged: true, //"dataUser.token",
      helpLinks: {
        "cmrManualUrl": "https://cmr.funai.gov.br/api/media/Manual/Mapa Interativo/CMR_Manual_2021_V1.7.1.pdf",
        "solicitacaoAcessoCmr2": "Pendente inserir o link_solicitacao-acesso e formulário",
        "cmrProjectUrl": "https://cmr.funai.gov.br/o-projeto/",
        "cmrTalkToUs": "https://cmr.funai.gov.br/contato/",
      }
    }
  }
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

.helpBar
  background-color: white

.footer-text-content
    display: inline-block
    padding: 10px 10px
    color: #707070
    font-size: 12px
    line-height: 16px
    font-weight: 500
    text-decoration: none
    margin-bottom: 0

.link-footer a
    cursor: pointer
    color: #007ecf
    text-decoration: underline

.cmr-v2-footer-h4
    display: inline-block
    margin: 10px
    font-size: 14px
    line-height: 16px
    font-weight: 500
    color: #424242
</style>
