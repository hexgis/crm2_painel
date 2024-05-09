<template>
  <iframe
    :src="getUrl"
    class="container-iframe"
  />
</template>

<script>
export default {
  name: 'PageAnalytics',

  layout: 'analytics',

  computed: {
    getUrl() {
      return process.env.URL_POWER_BI;
    },
  },

 
};
</script>

<style scoped>

.container-iframe {
  display: inline-block;
  width: 100%;
  height: 100vh;
  border: 0;
}
</style>
