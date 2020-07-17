import Vue from 'vue'
import Scroll from './lib/scroll'

// 鼠标模拟移动端滑动 v-scroll.x='bgc'
Vue.directive('scroll', {
  inserted (el, binding, vnode) {
    const { modifiers, value } = binding
    new Scroll({
      el,
      bar: { x: modifiers.xbar, y: modifiers.ybar, bgc: value },
      direction: modifiers.x ? 'x' : modifiers.y ? 'y' : 'xy',
    }).init()
  },
})
// el-input价格字符输入控制 0.0 0 不受控制 v-price
// Vue.directive('price', {
//   inserted (el, binding, vnode) {
//     const distEL = el.querySelector('input')

//     let limit = () => {
//       // eslint-disable-next-line no-useless-escape
//       const reg1 = /[^\d.\.]/g
//       const reg2 = /^0(?=\d)|(?<=^0\.0)0|^\./
//       const reg3 = /(?<=(\.\d{2})).*/g
//       let iptVal = distEL.value
//       iptVal = iptVal.replace(reg1, '').replace(reg2, '').replace(reg3, '')
//       vnode.componentInstance.$emit('input', iptVal)
//     }
//     distEL.addEventListener('keyup', limit)
//     distEL.addEventListener('afterpaste', limit)
//     distEL.addEventListener('blur', () => {
//       let iptVal = distEL.value
//       if (/(\.\d?)$/.test(iptVal) && +iptVal > 0) {
//         iptVal = (+iptVal).toFixed(2)
//       }
//       vnode.componentInstance.$emit('input', iptVal)
//     })
//   }
// })

// el-input 数字输入控制 v-number.zero zero 是否可以0开头
Vue.directive('number', {
  inserted (el, binding, vnode) {
    const { modifiers } = binding
    const distEL = el.querySelector('input')
    const limit = () => {
      // eslint-disable-next-line no-useless-escape
      const reg1 = modifiers.zero ? /[^\d]/g : /^0[^\d]/g
      let iptVal = distEL.value
      iptVal = iptVal.replace(reg1, '')
      vnode.componentInstance.$emit('input', iptVal)
    }
    distEL.addEventListener('keyup', limit)
    distEL.addEventListener('afterpaste', limit)
  },
})
