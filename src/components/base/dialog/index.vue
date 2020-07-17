<template lang="pug">
van-popup.dialog-wrap--base(v-model="isShowMixin" :transition='isPc ? "dialog-fade-scale" : ""'
  :class='{[fullscreenSelf ? "fullscreen" : "notfull"]: 1 }' v-bind="$attrs" v-on="$listeners")
  .dialog--base.ff-cn
    .top--bar.tac.select-none.h40.flex-auto(@dblclick='fullscreenSelf = !fullscreenSelf')
      .flex-center.h100p.fc-b1.fs-m {{title}}
      .dialog--opts(v-if="isPc")
        i.van-icon.van-icon-expand-o.hover.mgr1(@click='fullscreenSelf = !fullscreenSelf' title='切换全屏/小窗' v-if="isPc")
        i.van-icon.van-icon-cross.hover-danger(@click='isShowMixin = false' title='关闭')

      i.van-icon.van-icon-arrow-left.press(@click='isShowMixin = false' v-else)
    slot

</template>
<script>
import utils from '@/plugins/utils'
import dialogMixin from '../mixins/dialogMixin'
export default {
  name: 'Dialog',
  mixins: [dialogMixin],
  props: {
    title: {
      type: String,
      default: '',
    },
    fullscreen: {
      type: Boolean,
      default: !utils.UAis('pc'),
    },
  },
  data () {
    this.isPc = utils.UAis('pc')
    return {
      fullscreenSelf: this.fullscreen,
    }
  },
}
</script>
<style lang="stylus">

.dialog-fade-scale-leave-active,
.dialog-fade-scale-enter-active
  transition: all .3s

.dialog-fade-scale-enter,.dialog-fade-scale-leave-to
  transform scale(0.7)!important
  opacity 0

.pc-mode
  .dialog-wrap--base
    &.notfull
      border-radius 5px
      height 500px
      width 600px

.dialog-wrap--base
  max-width 100%
  max-height 100%
  overflow hidden
  transition all 0.3s
  &.van-popup--center
    transform none
    margin auto
    left 0
    top 0
    right 0
    bottom 0
  .dialog--base
    width 100%
    height 100%
  &.fullscreen
    border-radius 0
    height 100%!important
    width 100%!important
  .top--bar
    position relative
    background-color #f8f8f8
    .dialog--opts
      position absolute
      right 10px
      top 50%
      transform translateY(-50%)
      i
        font-size 14px
    i.van-icon-cross,i.van-icon-arrow-left
      cursor pointer
      width 24px
      height 24px
      line-height 24px
      text-align center
    i.van-icon-arrow-left
      position absolute
      top 50%
      left 5px
      transform translateY(-50%)
      font-size 18px

</style>
