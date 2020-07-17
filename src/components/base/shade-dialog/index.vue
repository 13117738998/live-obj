<template lang="pug">
van-popup.shade-dialog--base(v-model="isShowMixin" v-bind="$attrs" v-on="$listeners")
  i.van-icon.van-icon-cross.ctrl-icon.hover-danger(@click='isShowMixin = false')
  slot
</template>
<script>
import dialogMixin from '../mixins/dialogMixin'
export default {
  name: 'ShadeDialog',
  mixins: [dialogMixin],
}
</script>
<style lang="stylus">
.shade-dialog--base
  background-color transparent
  &.van-popup--center
    transform none
    margin auto
    left 0
    top 0
    right 0
    bottom 0
  .van-icon.van-icon-cross
    position absolute
    right 10px
    top 26px
    height 26px
    width 26px
</style>
