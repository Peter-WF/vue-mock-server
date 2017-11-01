/**
 * @authors       Peter 王斐
 * @email         wangfeia@zbj.com
 * @date          2017-03-28 11:24
 * @description   简单的 jsonp 封装
 */
import qs from 'querystring'
import utils from './utils'

window.jsonPStack = []

export default function(opt) {
  const config = {
    // 在一个jsonp请求中重写回调函数的名字。这个值用来替代在"callback=?"这种GET或POST请求中URL参数里的"callback"部分，比如{jsonp:'onJsonPLoad'}会导致将"onJsonPLoad=?"传给服务器
    jsonp: 'jsonpcallback'
  }
  Object.assign(config, opt)

  // 生成唯一 id
  const jsonPId = utils.uuid()
  // 生成唯一 jsonPName
  const jsonPName = `jsonPStack_${jsonPId}`

  const script = document.createElement('script')

  script.src = config.url.indexOf('?') === -1
    ? `${config.url}?${config.jsonp}=${jsonPName}`
    : `${config.url}&${config.jsonp}=${jsonPName}`

  if (config.data) {
    script.src = `${script.src}&${qs.stringify(config.data)}`
  }

  return new Promise((resolve, reject) => {
    window[`jsonPStack_${jsonPId}`] = function(response) {
      try {
        resolve(response)
      } finally {
        script.success = true
      }
    }

    // JSONP的回调函数总是在script的onload事件（IE的onreadystatechange）之前就被调用，因此在回调执行之时，为script标签增加一个属性，然后等到onload发生的时候，检查有没有这个属性，来以此判定是否请求成功
    script.onload = function() {
      if (!script.success) {
        reject({
          success: false
        })
      }
      delete window[`jsonPStack_${jsonPId}`]
      script.onerror = null
      script.onload = null
      script.parentNode.removeChild(script)
    }

    script.onerror = function(error) {
      reject(Object.assign(error, {
        success: false,
        msg: '请检查您的网路连接'
      }))
      delete window[`jsonPStack_${jsonPId}`]
      script.onerror = null
      script.onload = null
      script.parentNode.removeChild(script)
    }

    // 发送请求
    document.body.appendChild(script)
  })
}
