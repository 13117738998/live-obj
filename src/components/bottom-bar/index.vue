<template lang='pug'>
.bottom-bar.hand
  .menu-item(v-for="item in getMenuList" :key="item.type" @click='handleMenuClick(item)' :class='{active: item.active}')
    .icon(:class='item.icon')
    .text {{item.active ? item.activeText : item.text}}

</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'bottom-bar',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['appStatus', 'audioStatus', 'audioCanPlay']),
    getIsPlay () {
      return this.audioStatus.pano && this.audioCanPlay
    },
    getMenuList () {
      return [
        { active: this.appStatus.vr, type: 'vr', activeText: '关闭VR', text: 'VR眼镜', icon: 'iconfont iconvr' },
        { active: this.getIsPlay, type: 'music', activeText: '关闭音乐', text: '打开音乐', icon: 'iconfont iconyinyue-copy-copy' },
      ]
    },
  },
  methods: {
    handleMenuClick (item) {
      if (item.type === 'music') {
        this.$store.commit('controlAudio', { pano: !this.getIsPlay })
      }
    },
  },
}
</script>
<style lang='stylus' scoped>
.bottom-bar
  position fixed
  bottom 0
  left 50%
  transform translateX(-50%)
  height 50px
  display flex
  .menu-item
    height 100%
    width 50px
    display flex
    flex-flow column nowrap
    align-items center
    justify-content center
    color #fff
    border-right 1px solid rgba(#fff, 0.5)
    filter(0)
    &.active
      filter(1)
    .icon
      font-size 22px
    .text
      font-size 10px
</style>
