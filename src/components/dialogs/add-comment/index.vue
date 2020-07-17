<template lang="pug">
ShadeDialog.add-comment-dialog(:show.sync='show')
  transition(enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown" appear)
    .comment-wrap.faster(v-show="show")
      .title
        i.van-icon.van-icon-smile-comment-o
        span 发表说一说
      van-field.mgy2(
        type="textarea"
        maxlength="50"
        rows="3"
        v-model="model.content"
        show-word-limit
        placeholder="请输入说一说内容")
      .footer
        van-button.w70(round size='small' @click="show=false") 取 消
        van-button.w70(round type="info" size='small' :disabled='!model.content' @click="submit") 确 定

</template>

<script>
export default {
  name: 'AddCommentDialog',
  data () {
    return {
      show: false,
      model: {
        type: 0, // 0, //0=说一说， 1=弹幕
        content: '', // "" //评论内容，不超过100个字符
      },
    }
  },
  methods: {
    open () {
      this.model.content = ''
      this.show = true
    },
    submit () {
      this.$api.addComment(this.model).then(() => {
        this.$_store.dispatch('getPanoSceneHotspot')
        this.show = false
        this.$vgo.tip('提交成功，审核中!', 'success')
      })
    },
  },
}
</script>

<style lang="stylus">
.add-comment-dialog
  background transparent
  .comment-wrap
    padding 10px
    width 300px
    border-radius 6px
    margin auto
    position fixed
    bottom 100px
    left calc(50% - 150px)
    overflow hidden
    background-color rgba(#000, .5)
    box-shadow 1px 1px 10px rgba(#fff, .1)
    .title
      font-size 13px
      display flex
      align-items center
      color #fff
      i
        margin-right 10px
        font-size 20px
    .footer
      text-align right
      .van-button
        margin-left 10px
    .van-field
      textarea, textarea::-webkit-input-placeholder
        font-size 13px
.mobile-mode
  .add-comment-dialog
    .comment-wrap
      bottom 0
      left 0
      transform none
      width 100%
      background rgba(#f8f8f8, 1)
      border-radius 10px 10px 0 0
      .title
        color #333

</style>
