<template lang="pug">
Popup(v-on="$listeners" v-bind='$attrs')
  slot
</template>
<script>
import { Popup } from 'vant'
let count = 0 // 有dialog就是用户控制
export default {
  name: 'VanPopup',
  components: {
    Popup,
  },
  watch: {
    '$attrs.value' (val) {
      count += val ? 1 : -1
      this.$_store.getters.appStatus.isUserCtrl = !!count
    },
  },
}
</script>
