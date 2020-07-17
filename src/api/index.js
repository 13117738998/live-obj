import { http } from './http'
// import utils from '@/plugins/utils'
import store from '@/store/'
import router from '@/router'
const { CLOUD_APP_API, CLOUD_API } = window.$globalconfig
const getPanoId = () => router.currentRoute.params.panoId
// const getPanoId = () => utils.getURLQuery().panoid
// const getCompanyId = () => store.getters.panoInfo.company_id
const getLogoImg = () => store.getters.panoInfo.logo_image_url
let guid
/**
 * @param {mayToken}  有token就请求
 * @param {token} 是否携带token
 */
export default {
  // 基础接口 3. 获取开放平台代公众号jssdk配置【微信用户】
  getWxJssdkConfig: () => http('get', 'https://editor.vgoyun.com/api/wxopen/share/get', {
    params: {
      url: window.location.href.split('#')[0],
    },
    token: false,
  }),

  // 跳转公众号登录
  // wxLogin: () => window.location.replace(`${CLOUD_API}/wxmp/company/authorize?company_id=${getCompanyId()}&redirect_uri=${encodeURIComponent(window.location.href)}`),

  /* 2、PC端授权地址生成二维码方式
    https://cloud.vgoyun.com/wxmp/company/authorize?company_id=239290864893952&qrcode_scene_key=
    其中**qrcode_scene_key**为32位随机字符串（推荐GUID），并且此地址请自行调用qrcode生成图片地址。
    PC端页面通过调用轮询接口来获取登录信息，即【公司公众号相关接口.md】**### 6. 获取PC端扫码授权公众号用户登录信息**
  */
  // getWXScanLoginUrl: () => {
  //   guid = ''
  //   for (let i = 1; i <= 32; i++) {
  //     guid += Math.floor(Math.random() * 16.0).toString(16)
  //   }
  //   return `${CLOUD_API}wxmp/company/authorize?company_id=${getCompanyId()}&qrcode_scene_key=${guid}`
  // },

  // 6. 获取PC端扫码授权公众号用户登录信息 （GetWxMpQrcodeAuthorizerAsync）
  // 备注 |  本接口为长轮询链接，服务器会挂起30秒，若30秒内有扫码结果则直接返回，若没有则等本次请求完后才开始下一次查询
  // qrcode_scene_key | String | 是 |  随机字符标识，长度为32个字符串（此为请求PC授权二维码图片时候传输的qrcode_scene_key）
  getWXScanLoginStatus: () => http('get', `${CLOUD_API}api/wxmp/company/qrcode/authorizer?qrcode_scene_key=${guid}`, { token: false, loading: false }),

  // 获取二维码
  getQrcodeUrl: (url, iconUrl = getLogoImg()) => `${CLOUD_API}content/qrcode?data=${encodeURIComponent(url)}&icon_url=${iconUrl}`,

  // 全景预览接口 https://cloudapp.vgoyun.com/

  // 2.  获取指定场景热点列表（GetSceneHotspotListAsync）
  // 备注 |   此接口返回：说一说列表、热点列表
  getPanoSceneHotspot: (id) => http('get', `api/panorama/view/scenes/${id}/hotspots`, { token: false }),

  // 3.  文字转图片接口
  // > 规则：（CLOUD_APP_URL）+ panorama/textimage?text=&color=&fontSize=35
  // > 参数说明
  // 1、text为需要编码的字符串（URL），需要用URL进行编码
  // 2、color若为#开头则需要用URL进行编码
  textToImg: (text, color, size) => `${CLOUD_APP_API}panorama/textimage?text=${text}&color=${color}&fontSize=${size}`,

  // 3. 查询指定项目接口
  getRoamProjectDetail: () => http('get', `api/projects/${getPanoId()}`, { token: false }),

  // 3. 查询指定项目接口
  getProjectZip: (modelZipUrl) => http('get', modelZipUrl, { token: false }),

}
