export default class Scroll {
  constructor ({ el, direction, bar = {} }) {
    this.el = el
    this.parent = el.parentElement || el.parentNode
    this.direction = direction || 'x'
    // transform init data
    this.translateX = 0
    this.translateY = 0
    this.isTouch = 'ontouchstart' in window
    this.downHandle = this.downHandle.bind(this)
    this.upHandle = this.upHandle.bind(this)
    this.moveHandle = this.moveHandle.bind(this)
    this.animateEnd = this.animateEnd.bind(this)
  }

  init () {
    this.el.addEventListener(this.isTouch ? 'touchstart' : 'mousedown', this.downHandle)
    if (!this.isTouch) this.el.style.userSelect = 'none'
    this.parent.style.cssText = 'position: relative;overflow: hidden;'
    this.el.childNodes.forEach(item => {
      item.addEventListener('click', (e) => {
        if (this.parent.clientWidth > this.el.clientWidth) return
        this.translateX = -(item.offsetLeft - this.parent.clientWidth / 2 + item.clientWidth / 2)
        this.translateY = -(item.offsetTop - this.parent.clientHeight / 2 + item.clientHeight / 2)
        this.limitVal(-this.getTrackLength('x'), 0, 'translateX')
        this.limitVal(-this.getTrackLength('y'), 0, 'translateY')
        this.scroll()
      })
    })

    return this
  }

  downHandle (evt) {
    if (this.parent.clientWidth > this.el.clientWidth) return
    // 记录状态
    this._startTime = Date.now()
    this._oldMouseX = this._startX = this.getEvt(evt).clientX
    this._oldMouseY = this._startY = this.getEvt(evt).clientY
    !this.isTouch && evt.preventDefault() // 阻止拖拽|选择文本
    window.addEventListener(this.isTouch ? 'touchmove' : 'mousemove', this.moveHandle)
    window.addEventListener('mouseup', this.upHandle)
    window.addEventListener('touchend', this.upHandle)
    window.addEventListener('touchcancel', this.upHandle)
  }

  moveHandle (evt) {
    // chrome bug
    if (this._startX === this.getEvt(evt).clientX && this._startY === this.getEvt(evt).clientY) return
    this._backX = this._backY = false
    this._lastMoveTime = Date.now() // 处理停留
    if (!this.isTouch) {
      this.el.style.pointerEvents = 'none' // 阻止点击
      evt.preventDefault() // 阻止选择文本
      document.body.style.userSelect = 'none'
    }
    const newMouseX = this.getEvt(evt).clientX
    const newMouseY = this.getEvt(evt).clientY
    let distanceX = newMouseX - this._oldMouseX
    let distanceY = newMouseY - this._oldMouseY
    this.direction.indexOf('x') > -1 && this.ifDoElseDo((distanceX <= 0 && -this.getTrackLength('x') >= this.translateX) || (distanceX >= 0 && this.translateX > 0), () => {
      this._backX = true
      distanceX *= 0.3
    })
    this.direction.indexOf('y') > -1 && this.ifDoElseDo((distanceY <= 0 && -this.getTrackLength('y') >= this.translateY) || (distanceY >= 0 && this.translateY > 0), () => {
      this._backY = true
      distanceY *= 0.3
    })
    this.translateX += distanceX
    this.translateY += distanceY
    this.scroll(0)
    this._oldMouseX = newMouseX
    this._oldMouseY = newMouseY
  }

  upHandle (evt) {
    const stopTime = Date.now() - this._lastMoveTime
    let speedX, speedY
    if (stopTime > 30) { // 没有惯性
      speedX = speedY = 0
    } else {
      const distanceX = this.getEvt(evt).clientX - this._startX
      const distanceY = this.getEvt(evt).clientY - this._startY
      const timeCost = Date.now() - this._startTime // 耗时
      speedX = (distanceX / timeCost) * 600 // 速度
      speedY = (distanceY / timeCost) * 600 // 速度
    }
    this.inertiaAnimate(speedX, speedY)
    window.removeEventListener(this.isTouch ? 'touchmove' : 'mousemove', this.moveHandle)
    this.el.style.pointerEvents = 'auto'
    document.body.style.userSelect = 'auto'
    window.removeEventListener('mouseup', this.upHandle)
    window.removeEventListener('touchend', this.upHandle)
    window.removeEventListener('touchcancel', this.upHandle)
  }

  inertiaAnimate (speedX, speedY) {
    let duration = 500
    // 是否x轴
    this.direction.indexOf('x') > -1 && this.ifDoElseDo(this._backX, () => { // 已出界直接回弹
      duration = 800
      this.limitVal(-this.getTrackLength('x'), 0, 'translateX')
    }, () => {
      this.translateX = this.translateX + speedX
      this._backX = this.limitVal(-this.getTrackLength('x') - this.parent.clientWidth * 0.2, this.parent.clientWidth * 0.2, 'translateX')
    })
    // 是否y轴
    if (this.direction.indexOf('y') > -1) {
      this.ifDoElseDo(this._backY, () => { // 已出界直接回弹
        duration = 800
        this.limitVal(-this.getTrackLength('y'), 0, 'translateY')
      }, () => {
        this.translateY = this.translateY + speedY
        this._backY = this.limitVal(-this.getTrackLength('y') - this.parent.clientHeight * 0.2, this.parent.clientHeight * 0.2, 'translateY')
      })
    }
    // 均未出界2500ms 否则500ms
    const notRollBack = !this._backX && !this._backY
    this.scroll(notRollBack ? 2500 : duration, notRollBack ? '0.23, 1, 0.32, 1' : '0.25, 0.46, 0.45, 0.94')
    if (!notRollBack) this.el.addEventListener('transitionend', this.animateEnd)
  }

  animateEnd () {
    this.limitVal(-this.getTrackLength('x'), 0, 'translateX')
    this.limitVal(-this.getTrackLength('y'), 0, 'translateY')
    this.scroll()
    this.el.removeEventListener('transitionend', this.animateEnd)
  }

  scroll (duration = 800, bezier = '0.165, 0.84, 0.44, 1') {
    this.el.style['transition-timing-function'] = `cubic-bezier(${bezier})`
    this.el.style['transition-duration'] = duration + 'ms'
    let str
    if (this.direction === 'x') str = `${this.translateX}px,0`
    if (this.direction === 'y') str = `0,${this.translateY}px`
    if (this.direction === 'xy') str = `${this.translateX}px,${this.translateY}px`
    this.el.style.transform = `translate3d(${str},0) scale(1)`
  }

  getEvt (evt) {
    return evt.changedTouches ? evt.changedTouches[0] : evt
  }

  getTrackLength (axis) {
    return axis === 'x' ? this.el.scrollWidth - this.parent.clientWidth
      : this.el.scrollHeight - this.parent.clientHeight
  }

  limitVal (min, max, translate) {
    if (this[translate] >= max) this[translate] = max
    if (this[translate] <= min) this[translate] = min
    return (-this.getTrackLength(translate === 'translateX' ? 'x' : 'y') > this[translate] || this[translate] > 0)
  }

  ifDoElseDo (condition, trueCb, falseCb = () => { }) {
    condition ? trueCb() : falseCb()
  }
}
