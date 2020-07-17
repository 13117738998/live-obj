
import Vue from 'vue'
Vue.component('Null', () => import('./base/Null'))
Vue.component('Dialog', () => import('./base/dialog'))
Vue.component('ShadeDialog', () => import('./base/shade-dialog'))

// vantUI
Vue.component('VanPopup', () => import('./vant-ui/Popup'))
