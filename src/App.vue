<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'App',
  watch: {
    async '$route.params.panoId' () {
      await this.$store.dispatch('getRoamProjectDetail')
      // this.$store.dispatch('getUserPanoInfo') // 获取用户关联全景的信息(收藏/点赞...)
    },
  },
  created () {
    if (process.env.NODE_ENV === 'production' && !(/panoview\/\d{15}/.test(location.href))) {
      const idArr = /\d{15}/.exec(location.href)
      if (!idArr) return
      location.href = location.origin + location.pathname + idArr[0]
    }
  },
}
</script>

<style lang="stylus">
#app
 height 100%
 width 100%
</style>
