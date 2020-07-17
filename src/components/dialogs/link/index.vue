<template lang="pug">
Dialog(title='链接' :show='!!url' @close='url = ""' fullscreen)
  iframe.flex-1(:src='url')
</template>

<script>
export default {
  name: 'Link',
  data () {
    return {
      url: '',
    }
  },
  methods: {
    open (url) {
      if (url.indexOf('https') !== 0) return window.open(url)
      this.url = url
    },
  },
}
</script>
