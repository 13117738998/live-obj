<template lang="pug">
ShadeDialog.video--dialog(:show='!!url' @close='handleClose')
  .flex-center.h100p
    video(:src='url' controls autoplay)
</template>

<script>
export default {
  name: 'Video',
  data () {
    return {
      url: '',
    }
  },
  methods: {
    open (url, opts = {}) {
      this.$_store.dispatch('beforePlayVideo', false)
      const { close = () => {} } = opts
      this.url = url
      this.$_handleClose = close
    },
    handleClose () {
      this.$_store.dispatch('afterPlayVideo', false)
      this.url = ''
      this.$_handleClose()
    },
  },
}
</script>
<style lang="stylus">
.pc-mode
  .video--dialog
    video
      max-width 80%
      max-height 80%
      min-width 50%

.mobile-mode
  .video--dialog
    video
      width 100%
      max-height 80%
</style>
