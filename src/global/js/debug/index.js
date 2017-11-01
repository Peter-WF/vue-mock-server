/**
 * @authors       Peter 王斐
 * @email         wangfeia@zbj.com
 * @date          2017-09-05 14:49
 * @description   用于调试的工具方法
 */
import Vue from 'vue'
import store from '@/store'

// 方便在模板中使用 console.log 输出日志
Vue.prototype.$console = {
  log(str) {
    console.log('$console.log：')
    console.log(str)
  }
}

// 支持在控制台手动 commit 用于调试消息推送
Object.defineProperty(window, 'storeObj', {
  get() {
    return store
  }
})
