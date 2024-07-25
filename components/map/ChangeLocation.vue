<template>
    <div id="flags" class="locale-changer">
        <span class="pa-1">{{ $t('selectLocale') }}</span>
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
                { code: 'br', name: 'Português (Brasil)', flag: "/img/brasil-flag.svg", url: "/" },
                { code: 'en', name: 'English (USA)', flag: "/img/usa-flag.svg", url: "/en/" }
            ]
        };
    },
    watch: {
        '$root.$i18n.locale'(newLocale) {
            if (newLocale === 'en') {
                this.$router.push('/en/');
                this.$i18n.locale(newLocale);
            }
            this.$router.push('/');
            this.$i18n.locale('pt-br');
        }
    }
}

</script>

<i18n>
  {
      "en": {
          "selectLocale": "Select locale"
      },
      "pt-br": {
         "selectLocale": "Selecione a localidade"
      }
  }
</i18n>

<style lang="sass" scoped>
  .flag
    &-container
      display: flex
  
    &-icon 
      width: 50px
      height: 35px
      display: inline-block
      opacity: 0.4
      transition: all ease-in-out 0.3s
  
      &:hover
        opacity: 1
        transform: scale(1.5)
  
    &-shape
      width: 60px
      height: 40px
      display: flex
      justify-content: center
      align-items: center
  </style>