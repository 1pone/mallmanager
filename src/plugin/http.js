// 插件模块
import axios from 'axios'

const MyHttpServer = {}

MyHttpServer.install = function (Vue) {
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

  // 设置拦截器
  // 需要授权的 API ，必须在请求头中使用 Authorization 字段提供 token 令牌
  axios.interceptors.request.use(function (config) {
    // 请求成功时触发
    if (config.url !== 'login') {
      // 设置除了login其他所有请求的请求头
      const AUTH_TOKEN = localStorage.getItem('token') // 从localStorage获取token
      config.headers.Authorization = AUTH_TOKEN // 设置请求头
    }
    return config
  })

  // 添加实例方法
  Vue.prototype.$http = axios
}

export default MyHttpServer
