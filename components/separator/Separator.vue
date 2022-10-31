<template>
  <v-row justify="center">
    <div
      :class="vertical ? 'separator-vertical' : 'separator-horizontal'"
    />
  </v-row>
</template>

<script>
export default {
  props: {
    vertical: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped lang="sass">
.separator-horizontal
    width: 90%
    height: 2px
    margin: 10px
    background: linear-gradient(to right,rgba(255, 255, 255, 0),rgba(50, 50, 50, 0.1),rgba(255, 255, 255, 0))

.separator-vertical
    height: 100%
    width: 2px
    margin: 10px
    background: linear-gradient(to bottom,rgba(255, 255, 255, 0),rgba(50, 50, 50, 0.1),rgba(255, 255, 255, 0))
</style>
