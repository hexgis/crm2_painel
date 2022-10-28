<template>
  <v-col cols="12">
    <v-card class="mr-3">
      <v-card-text>
        <v-col
          justify="space-around"
          class="rating-block"
        >
          <v-col
            class="rating-iframe"
            cols="12"
            align-self="end"
          >
            <iframe
              src="https://www.agron.com.br/widgets/cotacao_interna_horizontal.php"
              width="100%"
              height="130px;"
              scrolling="yes"
              frameborder="0"
              style="border-color: #f7f7f7; border-color: #ccc"
              class="rating-iframe iframe-small"
            />
          </v-col>

          <v-col
            class="rating-iframe"
            cols="12"
            align-self="end"
          >
            <iframe
              src="https://br.widgets.investing.com/live-currency-cross-rates?theme=darkTheme"
              width="100%"
              height="415px;"
              frameborder="0"
              allowtransparency="true"
              marginwidth="0"
              marginheight="0"
              class="rating-iframe iframe-large"
            />
          </v-col>
        </v-col>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
export default {};
</script>

<style scoped lang="sass">
.rating-block
    overflow: hidden
    width: 100%

.rating-iframe
    overflow: hidden
    padding: 0px

.iframe-small
    margin-top: -53px
    margin-bottom: 10px

.iframe-large
    margin-top: -94px
</style>
