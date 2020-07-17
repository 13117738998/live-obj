// import vgo from '@/plugins/bus'
// import api from '@/api/'
import store from '../'
const audioDom = { scene: new Audio(), pano: new Audio(), hotspot: new Audio() }
// 添加停止监听 更新状态
for (const key in audioDom) {
  audioDom[key].addEventListener('ended', () => {
    store.commit('controlAudio', { [key]: false })
  })
}

// 监听 交互 后 自动播放音乐
const handlePlay = async () => {
  window.removeEventListener('touchend', handlePlay)
  window.removeEventListener('mousedown', handlePlay)
  // 自动播放 前置等待 App流程 开场提示完成
  await store.getters.appProcess.startFile.promise
  store.commit('recoverAllAudio')
}
window.addEventListener('touchend', handlePlay)
window.addEventListener('mousedown', handlePlay)

/* 注意keyVal对象中key
  key: scene: 场景音乐, pano: 背景音乐, hotspot: 热点音乐,
 */
export default {
  state: {
    audioCanPlay: false,
    // 音乐状态
    audioStatus: { scene: false, pano: false, hotspot: false },
  },
  getters: {
    audioCanPlay: state => state.audioCanPlay,
    audioStatus: state => state.audioStatus,
  },
  mutations: {
    // 暂停所有音乐
    pauseAllAudio (state) {
      state.audioCanPlay = false
      for (const key in audioDom) {
        audioDom[key].pause()
      }
    },

    // 恢复所有音乐
    recoverAllAudio (state) {
      state.audioCanPlay = true
      this.commit('controlAudio')
    },
    // 播放音频(设置状态), 关闭内嵌视频, 恢复播放
    handleAudioPlay (state, keyVal) {
      this.commit('controlAudio', keyVal) // 设置播放状态
      this._vm.$krp.playBuiltInVideoById() // 暂停所有内嵌视频(不传热点id全部关闭)
      this.commit('recoverAllAudio')// 恢复音乐播放
    },

    // 设置播放/暂停音乐状态
    controlAudio (state, keyVal = state.audioStatus) { // keyVal: { scene: true } key
      state.audioStatus = Object.assign({}, state.audioStatus, keyVal)

      // 是否可以播放音乐(有交互, 或者wx jssdk播, 播放视频情况禁止)
      if (!state.audioCanPlay) return

      for (const key in keyVal) {
        if (audioDom[key].src) state.audioStatus[key] ? audioDom[key].play() : audioDom[key].pause()
      }
    },

    // 设置音乐属性 loop src...
    setAudioAttr (state, { keyVal, attr }) { // {keyVal:{ scene: true }, attr: 'loop' }
      for (const key in keyVal) {
        if (keyVal[key]) audioDom[key][attr] = keyVal[key]
      }
    },
  },
}
