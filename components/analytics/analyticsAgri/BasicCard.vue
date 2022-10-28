<template>
  <v-col
    :cols="columns"
    :class="`chart-col-${columns}`"
  >
    <v-card
      class="custom-card"
      :class="height"
    >
      <div
        v-if="height != 'full' && value"
        class="chart-data"
      >
        <div
          class="val"
          :class="isAlert"
        >
          {{ value }}
          <span v-if="detail">( {{ detail }} )</span>
        </div>
        <div class="lab">
          {{ label }}
        </div>
      </div>

      <div
        v-if="height === 'full' && valueMulti"
        class="chart-data"
      >
        <div class="lab-multi">
          {{ label }}
        </div>

        <div
          v-for="(val, key, index) in valueMulti"
          :key="`${val}-${key}`"
          class="vertical-data"
        >
          <div class="val-multi">
            <div>{{ key }}</div>
            <span> {{ val }} </span>
          </div>
          <div
            v-if="Object.keys(valueMulti).length - 1 != index"
            class="custom-spacer custom-spacer-hor"
          />
        </div>
      </div>

      <div
        v-if="height != 'full' && valueMulti"
        class="chart-data chart-row"
      >
        <div class="lab-multi-row">
          {{ label }}
        </div>

        <div class="horizontal-data">
          <template v-for="(val, key, index) in valueMulti">
            <div :key="`${val}-${key}`">
              <div class="val-multi-row">
                <span>{{ val }}</span>
                <div>{{ key }}</div>
              </div>
            </div>

            <div
              v-if="Object.keys(valueMulti).length - 1 != index"
              :key="index"
              class="custom-spacer custom-spacer-ver"
            />
          </template>
        </div>
      </div>
    </v-card>
  </v-col>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: 'shortest',
    },
    height: {
      type: String,
      default: 'short',
    },
    value: {
      type: String,
      default: '',
    },
    detail: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    valueMulti: {
      type: Object,
      default: () => {},
    },
    alert: {
      type: Boolean,
    },
    cols: {
      type: String,
      default: null,
    },
  },

  computed: {
    isAlert() {
      return this.alert ? 'alert' : '';
    },

    columns() {
      if (this.cols) return this.cols;
      switch (this.width) {
        default:
        case 'shortest':
          return 3;
        case 'short':
          return 4;
        case 'medium':
          return 5;
        case 'long':
          return 7;
        case 'longer':
          return 9;
        case 'full':
          return 12;
      }
    },
  },
};
</script>

<style scoped lang="sass">
.chart-data
    padding: 20px 0
    margin: 0 40px
    color: #111
    min-width: 221px
    user-select: none

.chart-row
    padding: 10px 0

.vertical-data
    display: flex
    flex-direction: column

.horizontal-data
    display: flex
    flex-direction: row
    justify-content: space-evenly

.val
    font-size: 32px
    font-weight: bold
    margin-bottom: 5px
    display: flex
    min-height: 48px

.val > span
    font-size: 13px
    // font-weight: normal
    align-self: flex-end
    margin: 0 0 10px 10px

.lab-multi
    font-size: 20px
    font-weight: bold
    margin-bottom: 20px

.val-multi
    display: flex
    justify-content: space-between
    font-size: 14px
    margin: 2px 0
    min-height: 10px

.lab-multi-row
    font-size: 20px
    font-weight: bold
    margin-bottom: 5px

.val-multi-row > div
    justify-content: center
    display: flex
    opacity: 0.8
    font-size: 14px

.val-multi-row > span
    font-size: 30px
    font-weight: bold
    justify-content: center
    display: flex

.val-multi > div
    opacity: 0.8

.val-multi > span
    font-weight: bold
    white-space: pre
    align-self: center

.custom-spacer
    background: linear-gradient(to right,rgba(255, 255, 255, 0),rgba(50, 50, 50, 0.4),rgba(255, 255, 255, 0))

.custom-spacer-hor
    width: 90%
    height: 1px
    align-self: center
    margin: 2px

.custom-spacer-ver
    width: 2px
    height: 8vh
    background: linear-gradient(to bottom,rgba(255, 255, 255, 0),rgba(50, 50, 50, 0.4),rgba(255, 255, 255, 0))
    align-self: flex-end
    margin-left: 20px

.lab
    font-size: 14px
    opacity: 0.8

.short
    // height: 13vh
    height: 120px

.medium
    // height: 15vh
    height: 139px

.long
    // height: 18vh
    height: 160px

.full
    // min-height: 26vh
    min-height: 241px

.alert
    color: #FF4136
</style>
