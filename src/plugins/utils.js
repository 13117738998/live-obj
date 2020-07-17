import vgo from '@/plugins/bus'
import './lib/qrcode.min'
const { COOKIE_DOMAIN } = window.$globalconfig
const USER_COOKIE_NAME = () => window.$globalconfig.USER_COOKIE_NAME()
const LOGIN = () => window.$globalconfig.LOGIN()
export default {
  /**
   * 设置cookie
   *
   * @param {String} cname cookie key
   * @param {*} [cvalue=null] cookie val Object 自动JSON.stringify
   * @param {*} [opts={}] cookie 选项 exHours 有效小时 domain 域名 path 路径
   */
  setCookie (cname, cvalue = null, opts = {}) { // 1天
    const { exHours = 24, domain = '', path = '/' } = opts
    let expires = ''
    if (exHours) {
      const date = new Date()
      date.setTime(date.getTime() + (exHours * 60 * 60 * 1000))
      expires = ';expires=' + date.toGMTString()
    }
    const pathHandle = ';path=' + path
    const domainHandle = domain ? ';domain=' + domain : ''
    cvalue = typeof cvalue === 'object' ? JSON.stringify(cvalue) : cvalue
    document.cookie = cname + '=' + encodeURIComponent(cvalue) + expires + pathHandle + domainHandle
  },

  /**
   * 获取cookie
   *
   * @param {String} cname cookie key
   * @returns {String} value Object 需要JSON.parse
   */
  getCookie (cname) {
    const name = cname + '='
    const cArr = document.cookie.split(';')
    let cookie = ''
    cArr && cArr.map(item => item.trim().indexOf(name) === 0 && (cookie = item))
    return cookie && decodeURIComponent(cookie.split(name)[1])
  },

  /**
   * 获取token
   * @param {isRedirectLogin} 是否需要跳转登录
   * @returns {String} token or false
   */
  getToken (isRedirectLogin = true) {
    const token = this.getCookie(USER_COOKIE_NAME())
    if (!token && isRedirectLogin) LOGIN()
    else return token
  },
  getQrcodeUrl (url = location.href) {
    return new Promise((resolve, reject) => {
      if (!this.QRCode) {
        this.QRCode = new window.QRCode(document.createElement('div'), {
          text: url,
          width: 145,
          height: 145,
          colorDark: '#ffffff',
          colorLight: '#000000',
          correctLevel: window.QRCode.CorrectLevel.H,
        })
      } else {
        this.QRCode.makeCode(url)
      }
      this.QRCode._el.querySelector('img').onload = function () {
        resolve(this.src)
      }
    })
  },
  /**
   * 设置token
   *
   * @param {String} token
   */
  setToken (token) {
    this.setCookie(USER_COOKIE_NAME(), token, { exHours: 1.9, domain: process.env.NODE_ENV === 'production' ? COOKIE_DOMAIN : '' })
  },

  /**
   * 设置token
   *
   * @param {String} url
   */
  getURLQuery (url = location.href) {
    const obj = {}
    const reg = /([^?&=]+)=([^?&=]+)/g
    let res = reg.exec(url)
    while (res) {
      obj[res[1]] = res[2]
      res = reg.exec(url)
    }
    return obj
  },

  /**
   *获取promise状态(用于加载状态)
  *
  * @returns {promise, resolve}
  */
  getPromise () {
    let rsv
    const promise = new Promise(resolve => { rsv = resolve })
    return { promise, resolve: rsv }
  },

  /**
   * 复制传入的文本到剪贴板
   *
   * @param {String} text 文本
   */
  copyText (text) {
    const tempInput = document.createElement('input')
    tempInput.value = text
    document.body.appendChild(tempInput)
    tempInput.select() // 选择对象
    document.execCommand('Copy') // 执行浏览器复制命令
    document.body.removeChild(tempInput)
    vgo.tip('复制成功!', 'success')
  },

  /**
   * 验证手机号
   *
   * @param {String} text 文本
   */
  verifyPhone (phone) {
    const reg = /^1[1-9]{1}\d{9}$/
    return reg.test(phone)
  },

  /**
   * 获取设备/平台类型
   *
   * @param {String} device device/platform name lowercase
   * ie, mobile, ios, android, iphone, ipad, wx, pc
   * @returns {Boolean} boolean
   */
  _uaList: (() => {
    const ua = navigator.userAgent.toLowerCase()
    return {
      ie: ua.includes('trident'), // IE内核
      mobile: !!ua.match(/applewebkit.*mobile.*/), // 是否为移动终端
      ios: !!ua.match(/\(i[^;]+;( u;)? cpu.+mac os x/), // ios终端
      android: ua.includes('android') || ua.includes('linux'), // android终端
      iphone: ua.includes('iphone'), // 是否为iPhone
      ipad: ua.includes('ipad'), // 是否iPad
      wx: ua.includes('micromessenger'), // 是否微信
      pc: !ua.match(/applewebkit.*mobile.*/) && !ua.includes('ipad'), // 是否iPad
    }
  })(),
  UAis (device) {
    return this._uaList[device]
  },
  /**
   *  地址导航
   *
   * @param {String} address
   * @param {latitude} lat
   * @param {longitude} lng
   */
  navigate (address, lat, lng) {
    if (this.UAis('wx')) {
      window.wx.openLocation({
        latitude: +lat,
        longitude: +lng,
        name: address,
        address,
        scale: 15,
        fail: res => {
          console.log('openLocation_fail:', res)
          vgo.tip(res.errMsg)
        },
      })
    } else {
      window.open(`//uri.amap.com/marker?position=${lng},${lat}&name=${address}&src=${window.location.href}&coordinate=gaode&callnative=1`)
    }
  },
  toThumb (img) {
    return new Promise(resolve => {
      // canvas对图片进行缩放
      const resizeWidth = 300
      const resizeHeight = 150
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.width = resizeWidth
      canvas.height = resizeHeight
      context.drawImage(img, 0, 0, img.width, img.height, 0, 0, resizeWidth, resizeHeight)
      // canvas转url
      resolve(canvas.toDataURL())
    })
  },
  loadImg (file) {
    return new Promise(resolve => {
      const url = URL.createObjectURL(file)
      const img = new Image()
      img.onload = () => resolve(img)
      img.src = url
    })
  },
  // 读取jpg 文件信息
  async getJpgAttribute (JpgFile) {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.onload = async e => {
        // jpg 结构 0xd8   .. (缩略图: 0xd8 .. 0xd9).. (缩略图: 0xd8 .. 0xd9)..( 0xc0 分辨率/ 0xc2 分辨率 )  0xd9
        const arrBuf = new Uint8Array(e.target.result)
        const thumb = { start: [], end: [] }
        const dpi = []
        const finalData = { thumbUrl: '', dpi: { width: 0, height: 0 } }

        for (let i = 0; i < arrBuf.length; i++) {
          if (arrBuf[i] === 0xff) {
            // 查找缩略图
            if (arrBuf[i + 1] === 0xd8) {
              thumb.start.push(i)
            } else if (arrBuf[i + 1] === 0xd9) {
              thumb.end.push(i)
            }
            // 查找分辨率
            if (arrBuf[i + 1] === 0xc0 || arrBuf[i + 1] === 0xc2) {
              dpi.push(i)
            }
          }
        }
        const img = await this.loadImg(JpgFile)
        finalData.dpi.width = img.width
        finalData.dpi.height = img.height
        if (thumb.start.length > 10) {
          const blob = new Blob([arrBuf.subarray(thumb.start[1], thumb.end[0] + 2)], {
            type: 'image/jpg',
          })
          finalData.thumbUrl = URL.createObjectURL(blob)
        } else if (JpgFile.size < 1024 * 1024 * 100) { // <200M 转压缩
          console.info('未找到缩略图')
          finalData.thumbUrl = await this.toThumb(img)
        }
        resolve(finalData)
      }
      reader.readAsArrayBuffer(JpgFile)
    })
  },

}
