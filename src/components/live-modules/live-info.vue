<template lang='pug'>
  .live-info
    van-tabs(v-model="activeName" @tab-click="handleClick" :stretch="true")
      van-tab(title="直播介绍") 直播介绍
        .info-wrap
      van-tab(title="主办方") 主办方
      van-tab(title="图文介绍") 图文介绍
</template>

<script>
import Vue from 'vue'
import { Tab, Tabs } from 'vant'
Vue.use(Tab)
Vue.use(Tabs)
export default {
  data () {
    return {
      activeName: '1',
    }
  },

  methods: {
    handleClick () {},
  },
}
</script>

<style lang='stylus'>
.live-info
  width 320px
  height 0
  flex: 1 1 40%
  overflow hidden
  display flex
  flex-direction column
  .van-tabs
    margin 0
    height 100%
    background-color #f4f4f4
  .van-tabs__content
    height 100%
    padding 22px 0 22px 10px
    flex 1 1 auto
  .van-tab__pane
    height 100%
    overflow-y auto
  .van-tabs__line
    background-color #4887FF
</style>
