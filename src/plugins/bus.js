/* eslint-disable no-undef */
import Vue from 'vue'
import { Toast, Dialog } from 'vant'
Toast.allowMultiple()
Vue.use(Toast)
  .use(Dialog)
export default new Vue({
  data () {
    this.instanceObj = {}
    this.loadCount = 0
    return {
    }
  },
  methods: {
    getInstance (path) {
      if (this.instanceObj[path]) return this.instanceObj[path]
      const el = document.createElement('div')
      document.body.appendChild(el)
      const ComponentConstructor = Vue.extend(require(`@/components/${path}`).default)
      this.instanceObj[path] = new ComponentConstructor().$mount(el)
      return this.instanceObj[path]
    },
    imgPreview (arr) {
      return this.getInstance('dialogs/img-preview').open(arr)
    },
    tip (message = '操作成功！', type = 'success', opts = {}) {
      type = type === 'warning' ? 'fail' : type
      this.toast1 = Toast.loading({
        type, // fail success text
        icon: type.includes('err') ? 'cross' : '',
        message,
        duration: opts.duration || 2000, // 持续展示 toast
        forbidClick: opts.forbidClick || false, // 禁用背景点击
        position: opts.position || 'middle',
      })
    },
    open (cb, message = '是否确认当前操作?', opts = {}) {
      const { cancelCb = () => {} } = opts
      Dialog.confirm({
        title: '提示',
        message,
        closeOnClickOverlay: true,
      }).then(cb).catch(cancelCb)
    },
    openLoading (message = 'Loading...') {
      this.loadCount++
      if (this.toast2) return
      this.toast2 = Toast.loading({
        duration: 0,
        forbidClick: true,
        message,
      })
    },
    closeLoading () {
      this.loadCount--
      if (this.loadCount <= 0) {
        this.toast2.clear()
        this.toast2 = null
      }
    },
  },
})
