import Vue from 'vue'
/**
* dateFormat 时间过滤
* @param {String} type date,minute
*
*/
Vue.filter('dateFormat', (val, type) => {
  if (!val) return ''
  if (type === 'date') {
    return val.substr(0, 10)
  } else if (type === 'minute') {
    return val.replace(/t/ig, ' ').substr(0, 16)
  } else {
    return val.replace(/t/ig, ' ').split('.')[0]
  }
})

Vue.filter('amountFormat', val => {
  if (val >= 10000) {
    return (val / 10000).toFixed(2) + 'w'
  }
  return val
})

Vue.filter('filePrefix', val => {
  if (val.slice(0, 4) !== 'http') val = window.$globalconfig.CLOUD_FILE_API + 'files/' + val
  return val
})

// 保留几位小数 默认二位 {{val | toFixed(2) }}
Vue.filter('toFixed', (val, num = 2) => {
  if (!isNaN(val)) val = (+val).toFixed(num)
  return val
})

const weekFormatData = {
  1: { id: '1', label: '周一' },
  2: { id: '2', label: '周二' },
  3: { id: '3', label: '周三' },
  4: { id: '4', label: '周四' },
  5: { id: '5', label: '周五' },
  6: { id: '6', label: '周六' },
  0: { id: '0', label: '周日' },
  7: { id: '7', label: '周日' },
}
// 星期 格式化 '0,1,2,3,4,5,6'
Vue.filter('weekFormat', val => {
  weekFormatData['7'] = { id: '7', label: '周日' }
  if (!val) return ''
  val = val.replace('0', '7')
  const arrNum = val.split(',')
  const arr = arrNum.sort().map(day => weekFormatData[day].label)
  if (arr[0] === '周日') arr.push(arr.splice(0, 1))
  if (arrNum.length >= 3) {
    let flag = true
    arrNum.reduce((pre, item) => {
      if (Math.abs(pre - item) !== 1) flag = false
      return item
    })
    if (flag) {
      return weekFormatData[arrNum[0]].label + '至' + weekFormatData[arrNum[arrNum.length - 1]].label
    }
  }
  return arr.join(', ')
})
