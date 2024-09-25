<template>
    <div id="flags" class="locale-changer">
        <span class="pa-1 ma-1">{{ $t('selectLocale') }}</span>
        <div class="flag-container">
            <a v-for="locale in locales" :key="locale.code" :href="locale.url">
                <div class="flag-shape" :title="locale.name">
                    <v-img :src="locale.flag" class="flag-icon" />
                </div>
            </a>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            locales: [
                { code: 'br', name: 'Português (Brasil)', flag: "/img/brasil-flag.svg", url: "/portal" },
                { code: 'en', name: 'English (USA)', flag: "/img/usa-flag.svg", url: "/en/portal" }
            ]
        };
    },
    watch: {
        '$root.$i18n.locale'(newLocale) {
            if (newLocale === 'en') {
                this.$router.push('/en/portal');
                this.$i18n.locale(newLocale);
            }
            this.$router.push('/portal');
            this.$i18n.locale('pt-br');
        }
    }
}

</script>

<i18n>
  {
      "en": {
          "selectLocale": "Select language"
      },
      "pt-br": {
         "selectLocale": "Selecione o idioma"
      }
  }
</i18n>

<style lang="sass" scoped>
  .locale-changer
    display: flex
    color: white
    align-content: center
    justify-content: center
    opacity: 0.4
    transition: all ease-in-out 0.3s

    &:hover
        opacity: 1

  .flag
    &-container
      display: flex

    &-icon
      width: 40px
      height: 35px
      display: inline-block
      transition: all ease-in-out 0.3s

      &:hover
        opacity: 1
        transform: scale(1.2)

    &-shape
      width: 60px
      height: 40px
      display: flex
      justify-content: center
      align-items: center
  </style>
