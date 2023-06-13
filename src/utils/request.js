import axios from 'axios'
import { MessageBox, Message, Notification } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})
// 是否显示重新登录
const isReLogin = { show: false }

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  (error) => {
    console.log('err', error) // for debug
    let status = 0
    try {
      status = error.response.status
    } catch (e) {
      if (error.toString().indexOf('Error: timeout') !== -1) {
        Notification.error({
          title: '网络请求超时',
          duration: 5000
        })
        return Promise.reject(error)
      }
    }
    if (status) {
      if (status === 401) {
        const url = error.config.url
        if (!isReLogin.show && (!url.endsWith('/logout') && !url.endsWith('/v1/auth/info'))) {
          isReLogin.show = true
          // to re-login
          MessageBox.confirm('当前登录状态已过期，请您重新登录！', '登录过期', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            isReLogin.show = false
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          }).catch(() => {
            isReLogin.show = false
          })
        } else {
          Message({
            message: '当前登录状态已过期，请您重新登录',
            type: 'error',
            duration: 5 * 1000
          })
        }
      } else if (status === 403) {
        Message({
          message: '暂无权限操作，请联系管理员',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        Message({
          message: error.response.data.message || error.response.statusText || '接口请求失败',
          type: 'error',
          duration: 5 * 1000
        })
      }
    } else {
      Notification.error({
        title: '接口请求失败',
        duration: 5000
      })
    }
    return Promise.reject(error)
  }
)

export { isReLogin }
export default service
