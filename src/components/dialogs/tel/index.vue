<template lang="pug">
Dialog.tel-dialog(title='电话' :show='!!tel' @close='tel = ""' round :fullscreen='false'
  :style='`height: ${isPc ? "250px" : "30vh"};width: ${isPc ? "350px" : "100%"}`'
  :position='$utils.UAis("pc") ? "center" : "bottom"')
  van-field(:value="tel" label='联系电话' readonly)
  .footer
    van-button.w100(round v-if="isPc" size='small' @click='tel = ""') 取消
    van-button.w100(round v-else type="primary" size='small' :url='`tel://${tel}`') 拨打
    van-button.w100(round type="info" size='small' @click='$utils.copyText(tel)') 复制

</template>

<script>
import utils from '@/plugins/utils'
export default {
  name: 'Tel',
  data () {
    return {
      tel: '',
      isPc: utils.UAis('pc'),
    }
  },
  methods: {
    open (tel) {
      this.tel = tel
    },
  },
}
</script>

<style lang="stylus">
.tel-dialog
  .footer
    text-align center
    margin auto 0 10px 0
    .van-button~.van-button
      margin-left 10px
</style>
