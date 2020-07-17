<template lang="pug">
Dialog.share-dialog(title='分享' style='height:400px; width:400px;' :show='!!url' @close='url = ""' :fullscreen='false')
  img.w250.pd4.margin-auto(:src='src')
  van-field.border(:value="url" readonly)
    template(#button)
      van-button(round type="info" size='small' @click='$utils.copyText(url)') 复制

</template>

<script>
export default {
  name: 'Share',
  data () {
    return {
      url: '',
      src: '',
    }
  },
  methods: {
    async open (url = location.href) {
      this.url = url
      this.src = await this.$utils.getQrcodeUrl(url)
    },
  },
}
</script>

<style lang="stylus">
// .share-dialog

</style>
