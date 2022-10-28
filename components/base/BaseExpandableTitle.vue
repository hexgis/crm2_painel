<template>
  <v-expansion-panels
    v-model="showFilters"
    class="filter-container"
    flat
    focusable
  >
    <v-expansion-panel
      :class="{
        'elevation-2': hasResults && showFilters === undefined,
        'elevation-6': hasResults && showFilters === 0,
      }"
    >
      <v-expansion-panel-header
        ripple
        class="fixed-expansion-header justify-space-between"
        :color="hasResults ? 'grey lighten-3' : ''"
      >
        <h4 class="subtitle-2 text-uppercase font-weight-regular">
          <slot name="title" />
        </h4>

        <v-switch
          v-show="hasResults"
          :input-value="features"
          class="mt-n1 ml-5 hide-buttom"
          hide-details
          @click.native.stop
          @mousedown.stop
          @change="$emit('toggleFeatures')"
        />
      </v-expansion-panel-header>

      <v-divider />

      <v-expansion-panel-content>
        <slot name="filter" />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  name: 'ExpandableTitle',

  props: {
    value: {
      type: Boolean,
      default: true,
    },
    hasResults: {
      type: Boolean,
      default: false,
    },
    features: {
      type: Boolean,
    },
  },

  data: () => ({
    showFilters: 0,
  }),

  watch: {
    value() {
      if (this.value) {
        this.showFilters = 0;
      } else {
        this.showFilters = undefined;
      }
    },
  },

  mounted() {
    if (this.hasResults) {
      this.showFilters = undefined;
    }
  },
};
</script>

<style scoped lang="sass">
.filter-container
    position: absolute
    width: 100%

    .v-expansion-panel-header--active:before
        opacity: 0 !important

.hide-buttom
 position: absolute
 right: 70px

.fixed-expansion-header
    min-height: 64px
    box-shadow: 0px 4px 3px -3px rgba(0, 0, 0, 0.2) !important
</style>
