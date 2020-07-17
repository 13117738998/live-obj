<template lang="pug">
Dialog.article-module(:title='title' :show='!!title' @close='title = ""'
  :position='$utils.UAis("pc") ? "center" : "bottom"')
  .html-contents.pd1.scroll-y(v-html="conent")
</template>

<script>
export default {
  name: 'Article',
  data () {
    return {
      title: '',
      conent: '',
    }
  },
  methods: {
    open (title, conent) {
      this.title = title
      this.conent = conent
    },
  },
}
</script>
<style lang="stylus">
.article-module
  .html-contents
    img
      max-width 100%

</style>
