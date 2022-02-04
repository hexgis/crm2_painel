<template>
    <div
        class="box-class"
        :style="{
            '--top-padding': `${topPadding}px`,
        }"
    >
        <span class="box topleft filling"></span>
        <span class="box top border-style"></span>
        <span class="box topright filling"></span>
        <span class="box left border-style"></span>
        <span class="box right border-style"></span>
        <span class="box bottomleft filling"></span>
        <span class="box bottom border-style"></span>
        <span class="box bottomright filling"></span>
    </div>
</template>
<script>
export default {
    props: {
        topPadding: {
            type: Number,
            default: 0,
        },
    },
}
</script>
<style scoped lang="sass">
.box-class
    position: absolute
    top: 68px
    width: 100%
    height: calc(100% - 68px)

.box
    background-color: rgba(0,0,0,0.3)
    z-index: 3
    position: absolute

.filling
    height: 12%
    width: 12%

.border-style
    border-style: dashed
    border-color: lightgray
    border-width: 0px


.topleft
    top: 0
    left: 0

.topright
    top: 0
    right: 0

.bottomleft
    bottom:0
    left: 0

.bottomright
    bottom: 0
    right: 0

.top
    top: 0
    left: 12%
    width: 76%
    height: 12%
    border-bottom-width: 2px

.bottom
    bottom: 0
    left: 12%
    width: 76%
    height: 12%
    border-top-width: 2px

.left
    top: 12%
    left: 0
    height: 76%
    width: 12%
    border-right-width: 2px

.right
    top: 12%
    right: 0
    height: 76%
    width: 12%
    border-left-width: 2px
</style>
