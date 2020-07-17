<template lang="pug">
.live-page
  .live-activity-box
    chatModule
    liveInfo
</template>

<script>
import chatModule from '@/components/live-modules/chat-module.vue'
import liveInfo from '@/components/live-modules/live-info.vue'
import utils from '@/plugins/utils'
import { mapGetters } from 'vuex'
export default {
  name: 'ViewBase',
  components: {
    chatModule,
    liveInfo,
  },

  computed: {
    ...mapGetters(['projectInfo', 'appProcess', 'appStatus']),
  },
  watch: {
    async projectInfo (val) {
      await this.appProcess.load.promise
      // 尝试自动播放
      if (val.bgmUrl) {
        this.$store.commit('setAudioAttr', { keyVal: { pano: val.bgmUrl }, attr: 'src' })
        this.$store.commit('controlAudio', { pano: true })
      }
      this.$store.commit('recoverAllAudio')
      // 微信浏览器 && 初始化jssdk
      if (this.$utils.UAis('wx')) {
        this.$store.dispatch('wxJSSDKInit', () => {
          this.$store.commit('controlAudio') // 自动播放
        })
      }
    },
  },
  created () {
    // 开发环境获取token
    // if (location.href.includes('access_token=')) {
    //   const url = location.href
    //   if (url.includes('access_token')) {
    //     const arrTemp = url.split('?')
    //     const arr = arrTemp[arrTemp.length - 1].split('&')
    //     const obj = {}
    //     arr.map(item => {
    //       const keyVal = item.split('=')
    //       obj[keyVal[0]] = keyVal[1]
    //     })
    //     this.$utils.setCookie(`${this.projectInfo.company_id}_user_ticket`, obj.access_token, { exHours: 2 })
    //     location.replace(url.replace(/(\?|&)access_token=.*/, ''))
    //   }
    // }
    // console.log(utils.getToken())
  },
}
</script>
<style lang="stylus">
.live-page
  position relative
  width 100%
  height 100%
  .live-activity-box
    width 320px
    height 100%
    position absolute
    right 0
    top 0
    display flex
    flex-direction column
</style>
