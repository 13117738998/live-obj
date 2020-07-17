<template lang="pug">
van-image-preview(v-model="show" ref='preview' :startPosition='startPosition' :images="images" asyncClose)
  div(slot='cover' v-if="$refs.preview")
    i.van-icon.van-icon-cross.ctrl-icon.hover-danger(@click='show = false')
    .controls
      i.van-icon.van-icon-add-o(@click='zoom(1)')
      i.iconfont.icon-jian(@click='zoom(0)' :class='{disabled: $refs.preview.scale == minScale}')
      i.van-icon.van-icon-replay(style='transform: rotateY(180deg);' @click='rotate(0)')
      i.van-icon.van-icon-replay(@click='rotate(1)')
</template>

<script>
import Vue from 'vue'
// import utils from '@/plugins/utils'
import { ImagePreview } from 'vant'
Vue.use(ImagePreview)
export default {
  name: 'ImgPreview',
  data () {
    this.minScale = 1
    this.rotateZ = 0
    return {
      show: false,
      startPosition: 0,
      images: [],
    }
  },
  methods: {
    open (url, idx) {
      this.startPosition = idx || 0
      this.show = true
      this.images = Array.isArray(url) ? url : [url]
    },
    zoom (type) {
      this.$refs.preview.scale += type ? 0.3 : -0.3
      this.$refs.preview.scale = Math.max(this.minScale, this.$refs.preview.scale)
    },
    rotate (type) {
      const img = this.$el.querySelectorAll('.van-swipe-item')[this.$refs.preview.active].querySelector('img')
      this.rotateZ += type ? 90 : -90
      img.style.transform = `rotateZ(${this.rotateZ}deg)`
    },
  },
}
</script>

<style lang="stylus">
.van-image-preview
  img
    transition transform 0.3s
  .controls
    position: fixed;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-around;
    opacity: .8;
    user-select: none;
    left: 50%;
    bottom: 20px;
    transform: translateX(-50%);
    width: 250px;
    height: 36px;
    padding: 0 16px;
    background-color: #606266;
    border-color: #fff;
    border-radius: 16px;
    cursor: pointer;
    color: #fff;
    i
      font-size 22px
      &.disabled
        color #9b9b9b
        cursor not-allowed
  .van-icon-cross
    height 26px
    width 26px
    position fixed
    right 10px
    top 10px
    border-radius 50%
</style>
