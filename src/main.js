import Vue from 'vue'
// 全局组件
import '@/components/'

import App from './App.vue'
import router from '@/router'
import store from '@/store/'

// 设备尺寸自适应
import './plugins/lib/flexable'

// animate.css
import 'animate.css'

// 移动端log插件
import './plugins/lib/log'

// 全局样式
import '@/assets/style/global.styl'

// 有赞ui
import '@/components/VantUI'
import '@vant/touch-emulator'

import api from '@/api'
import bus from '@/plugins/bus'
import utils from '@/plugins/utils'
import './plugins/directives'
import './plugins/filters'

Vue.prototype.$api = api
Vue.prototype.$utils = utils
Vue.prototype.$vgo = bus
Vue.config.productionTip = false

// 动态设置token key
window.$globalconfig.USER_COOKIE_NAME = () => `${store.getters.panoInfo.company_id}_user_ticket`
// 配置登录调整
window.$globalconfig.LOGIN = () => {
  if (!store.getters.panoInfo.is_bind_mp) {
    bus.tip('公众号未绑定!', 'fail')
    return
  }
  if (utils.UAis('pc')) {
    const ScanLogin = require('@/components/dialogs/scan-login').default
    ScanLogin.open()
    return
  }
  window.location.replace(`${window.$globalconfig.CLOUD_API}/wxmp/company/authorize?company_id=${store.getters.panoInfo.company_id}&redirect_uri=${encodeURIComponent(window.location.href)}`)
}
Vue.prototype.$WD = window
Vue.prototype.$_router = router
Vue.prototype.$_store = store
window.$vm = new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
