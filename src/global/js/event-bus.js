/**
 * @authors       Peter 王斐
 * @email         wangfeia@zbj.com
 * @date          2017-03-24 10:28
 * @description   event bus
 */
import Vue from 'vue'

const eventBus = new Vue()

Vue.prototype.$bus = eventBus

export default eventBus

