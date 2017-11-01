/**
 * @authors       Peter 王斐
 * @email         wangfeia@zbj.com
 * @date          2017-03-28 10:03
 * @description
 */
import Vue from 'vue'
import Axios from 'axios'
import jsonP from './jsonp'
import errCodeMap from '../error-code-map'
import isEqual from 'lodash/isEqual'

const requestCache = new Set()   // 缓存接口请求的config

// Add a response interceptor
Axios.interceptors.response.use(function(response) {
  // 非get请求返回后，清除该请求在requestCache中的缓存
  if (response.config.method !== 'get') {
    const resConfig = response.config
    // axios 返回的 response.config.data 为 JSON String 或 null（当请求没有data时），所以需要转换下
    if (resConfig.data && typeof resConfig.data === 'string') {
      resConfig.data = JSON.parse(resConfig.data)
    }
    requestCache.forEach(value => {
      const parseValue = JSON.parse(value)
      const mergeConfig = Object.assign({}, resConfig, parseValue)
      if (isEqual(mergeConfig, resConfig)) {
        requestCache.delete(value)
      }
    })
  }
  const resData = response.data
  if (resData.data && resData.data.code) {
    resData.data['description'] = errCodeMap[resData.data.code] || resData.data.description
  }
  // 数据处理
  return resData
})

Vue.prototype.$ajax = function(config) {
  if (config.method && config.method !== 'get') {
    // 如果请求是非get请求，则判断requestCache里是否缓存了该接口
    const strConfig = JSON.stringify(config)
    if (requestCache.has(strConfig)) {
      // 如果requestCache缓存了该接口，则return 一个空Promise
      return new Promise(() => {})
    } else {
      // 如果requestCache没有缓存该接口，则缓存该接口
      requestCache.add(strConfig)
      return Axios(config).catch(err => {
        requestCache.delete(strConfig)
        return Promise.reject(err)
      })
    }
  }
  return Axios(config)
}

Vue.prototype.$jsonP = jsonP

export {
  Axios as ajax,
  jsonP
}
