<template lang="pug">
Dialog.scan-login-dialog(title='微信扫码登录' style='height:400px; width:400px;' :show='!!url' @close='url = ""' :fullscreen='false')
  img.w250.margin-auto(:src='url')
</template>

<script>
export default {
  name: 'ScanLogin',
  data () {
    return {
      url: '',
    }
  },
  methods: {
    open () {
      this.url = this.$api.getQrcodeUrl(this.$api.getWXScanLoginUrl())
      this.loopGetStatus()
    },
    loopGetStatus () {
      this.$api.getWXScanLoginStatus().then(async data => {
        if (data) {
          this.$utils.setToken(data.access_token)
          await this.$_store.dispatch('getUserPanoInfo')
          this.$vgo.tip('登录成功!', 'success')
          this.url = ''
        } else if (!data && this.url) {
          this.loopGetStatus()
        }
      })
    },
  },
}
</script>

<style lang="stylus">
// .scan-login-dialog

</style>
