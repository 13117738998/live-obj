import axios from 'axios'
import vgo from '@/plugins/bus'
import utils from '@/plugins/utils'
const {
  PANO_API, LOGIN,
  // UPLOAD_IMAGE_PREFIX,
  PANO_FILE_API,
} = window.$globalconfig
console.log(PANO_API)
const axiosInstance = axios.create({
  baseURL: PANO_API,
  timeout: 0,
})
/**
 * axios 请求封装
 * @param {String} method http请求方法
 * @param {String} url http请求url 默认前缀 window.$globalconfig.PANO_API
 * @param {Object} [config={loading = true, token = true}]  axios 请求配置 loading 是否打开加载提示 token 是否携带token  (https://www.kancloud.cn/yunye/axios/234845)
 * @returns {Promise}
 */
export const http = (method, url, config = {}) => {
  const { loading = true, token = true, mayToken = false } = config

  // 处理有token就请求
  if (mayToken && !utils.getToken(0)) return Promise.reject(mayToken)

  // 是否需要token
  if (token) {
    const accessToken = utils.getToken()
    config.headers = Object.assign(config.headers || {}, { Authorization: accessToken })
    config.params = Object.assign(config.params || {}, { token: accessToken })
  }

  // 是否打开加载提示
  if (loading) vgo.openLoading()

  return axiosInstance(Object.assign(config, { method, url })).then(({ data }) => {
  // 对响应数据做点什么
    if (+data.code === 200 || +data.code === 100) {
      return data.data
    } else if (!('code' in data)) {
      return data
    } else if (data.msg) {
      vgo.tip(data.msg, 'err')
      return Promise.reject(data)
    }
  }).catch(err => {
    // console.dir(err)
    // 对响应错误做点什么
    const { status } = err.response
    if (status === 401 && !mayToken) LOGIN()
    return Promise.reject(err)
  }).finally(() => {
    // 最后处理关闭loading
    if (loading) vgo.closeLoading()
  })
}

const onUploadProgressDefault = (e, num) => { vgo.loading.text = `当前上传${num}项(单次上传限制10项), 已上传: ${Math.min((e.loaded / e.total * 100).toFixed(1), 99)}%` }

/**
 * 文件上传接口
 * @param {Array|File} fileList element-ui fileObject
 * @param {String} action
 * @param {Object} [options={appendObj,isPicture,url,onUploadProgress}]
 *  options.appendObj formData 携带的数据
 *  options.isPicture 上传类型 true图片 false文件
 *  options.url 请求url
 *  options.onUploadProgress 上传进度回调函数, 返回上传 percent, event
 * @returns {Promise}
 */
export const uploadApi = (fileList, action, options = {}) => {
  const { isPicture = true, appendObj = {}, url, onUploadProgress } = options
  const formData = new FormData()
  action && formData.append('action', action)
  for (const key in appendObj) {
    formData.append(key, appendObj[key])
  }
  formData.append('files', Array.isArray(fileList) ? fileList.map(it => it.raw) : [fileList.raw])

  return http('post', url || (isPicture ? PANO_FILE_API : PANO_FILE_API), {
    'Content-Type': 'multipart/form-data',
    timeout: 0,
    onUploadProgress: e => {
      if (onUploadProgress) onUploadProgress((e.loaded / e.total * 100).toFixed(1), e)
      else onUploadProgressDefault(e, fileList.length || 1)
    },
    data: formData,
    loading: !onUploadProgress,
  })
}

// 获取上传action
// https://cloudfs.vgoyun.com/api/file/configs?token=
0 && window.open(`https://cloudfs.vgoyun.com/api/file/configs?token=${utils.getToken()}`)
