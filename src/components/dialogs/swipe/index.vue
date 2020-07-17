<template lang="pug">
ShadeDialog.swipe--dialog(:show='!!imgList.length' @close='imgList.splice(0, imgList.length)')
  van-swipe.pac(ref='VanSwpie' :autoplay='autoplay' indicator-color="white")
    van-swipe-item(v-for="item in imgList" :key="item")
      img.pac(:src='item' draggable="false")
  .swipe--switch(v-if="imgList.length > 1")
    i.van-icon.van-icon-arrow-left.ctrl-icon(@click='swipe("prev")')
    i.van-icon.van-icon-arrow.ctrl-icon(@click='swipe("next")')
</template>

<script>
export default {
  name: 'Swipe',
  data () {
    return {
      imgList: [],
      autoplay: 3000,
    }
  },
  methods: {
    open (imgSrc) {
      Array.isArray(imgSrc) ? this.imgList.push(...imgSrc) : this.imgList.push(imgSrc)
    },
    swipe (methodName) {
      this.autoplay = 0
      this.$refs.VanSwpie[methodName]()
      setTimeout(() => {
        this.autoplay = 3000
      }, 3000)
    },
  },
}
</script>
<style lang="stylus">
.swipe--dialog
  .van-swipe
    height 80%
    width 100%
    .van-swipe-item
      position relative
      overflow hidden
    img
      max-width 100%
      max-height 100%
  .swipe--switch
    display none
  i.van-icon.van-icon-arrow-left,i.van-icon.van-icon-arrow
    position absolute
    left 30px
    top 50%
    height: 36px;
    width: 36px;
    font-size 20px
    transform: translateY(-50%);
  i.van-icon.van-icon-arrow
    left auto
    right 30px
    top 50%

@media only screen and (min-width 1200px)
  .swipe--dialog
    .swipe--switch
      display block
</style>
