import utils from '@/plugins/utils'
import api from '@/api/'
// import router from '@/router'
export default {
  state: {
    projectInfo: {},
    userInfo: {}, // 用户信息 和 关联全景的信息(收藏/点赞...)
    // App运行流程完成状态
    appProcess: { // {promise, resolve}
      load: utils.getPromise(), // 加载动画
      startFile: utils.getPromise(), // 开场提示视频/图片
    },
    // App全局状态
    appStatus: {
      isModel: true, // 是模型还是全景
      vr: false, // VR模式
      sceneShow: true, // 是否显示场景列表
      minimap: true, // 是否显示小地图
      isUserCtrl: true, // 用户是否在操作 (不切换场景)
      gyro: false, // 是否开启陀螺仪
      guide: false, // 一键导览
      screenSync: false, // 同屏互动
      pureMode: false, // logo 区域 作者/浏览量/logo/ 天气 等是否显示
    },
  },
  getters: {
    projectInfo: state => state.projectInfo,
    userInfo: state => state.userInfo,
    appProcess: state => state.appProcess,
    appStatus: state => state.appStatus,
    curSceneGroup: state =>
      state.projectInfo.scenes.find(item => item.active),
    curScene: state =>
      state.projectInfo.scenes.find(item => item.active)
        .images.find(item => item.active),
  },
  actions: {
    getRoamProjectDetail ({ commit }) {
      return api.getRoamProjectDetail().then(data => {
        if (!data.error_code) {
          // 设置当前场景组/场景
          data.scenes.map((area, aIdx) => {
            area.active = !aIdx
            area.images.map((scene, sIdx) => {
              scene.active = !aIdx && !sIdx
            })
          })
          // let { scene_id } = router.currentRoute.query
          // scene_id = scene_id || data.group_scene_list[0].scene_list[0].id
          // let isTrueId = false
          // data.group_scene_list.map((gItem) => {
          //   let flag = false
          //   gItem.scene_list.map((item) => {
          //     item.active = +item.id === +scene_id
          //     if (!flag) flag = item.active
          //   })
          //   if (!isTrueId) isTrueId = flag
          //   gItem.active = flag
          // })
          // query scene_id 不存在
          // if (!isTrueId) {
          //   data.group_scene_list[0].active = true
          //   data.group_scene_list[0].scene_list[0].active = true
          // }
        }
        document.title = data.name
        // body 加class
        const bodyClassList = document.body.classList
        bodyClassList.add(`template-${data.template_id}`)
        bodyClassList.add(utils.UAis('pc') ? 'pc-mode' : 'mobile-mode')
        data.description && bodyClassList.add('has-notice')
        commit('projectInfo', data)
      })
    },

    // 获取用户关联全景的信息(收藏/点赞...)
    // getUserProjectInfo ({ commit }) {
    //   return api.getUserProjectInfo().then(data => {
    //     commit('saveUserInfo', data)
    //   })
    // },

    // 切场景分组
    switchSceneGroup ({ state }, id) {
      state.projectInfo.group_scene_list.map((area) => {
        area.active = id === area.id
        area.scene_list.map((item, idx) => {
          item.active = id === area.id && !idx
        })
      })
    },

    // 切场景
    switchScene ({ state }, id) {
      state.projectInfo.scenes.map((area) => {
        let gActive = false
        area.images.map((item) => {
          if (item.id === id) gActive = true
          item.active = item.id === id
        })
        area.active = gActive
      })
    },

    // 微信jssdk
    async wxJSSDKInit ({ state }, readyCallback) {
      const data = await api.getWxJssdkConfig()
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appid, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名
        jsApiList: [ // 必填，需要使用的JS接口列表
          'updateTimelineShareData',
          'openLocation',
          'getLocation',
          'onMenuShareWeibo',
          'updateAppMessageShareData',
          'showOptionMenu',
        ],
      })
      const { projectInfo } = state
      const obj = {
        title: projectInfo.name || document.title,
        desc: projectInfo.description || '',
        link: location.href,
        imgUrl: projectInfo.coverUrl || projectInfo.logo_image_url,
      }
      wx.ready(() => { // 需在用户可能点击分享按钮前就先调用
        readyCallback()
        wx.showOptionMenu()
        wx.updateAppMessageShareData(obj)
        wx.updateTimelineShareData(obj)
        wx.onMenuShareWeibo(obj)
      })
      wx.error((res) => {
        console.info('wwxjssdk:err:', res)
      })
    },
  },
  mutations: {
    projectInfo (state, data) {
      state.projectInfo = data
    },
    saveUserInfo (state, data) {
      state.userInfo = Object.assign({}, state.userInfo, data)
    },
  },
}
