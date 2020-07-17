import VueComp from './index.vue'
import Vue from 'vue'
const el = document.createElement('div')
document.body.appendChild(el)
const ComponentConstructor = Vue.extend(VueComp)
const instance = new ComponentConstructor().$mount(el)
export default instance
