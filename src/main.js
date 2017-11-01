// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

// 引入全局组件
import './global'

import App from './App'
import router from './router'
import store from './store'

import { Input, Autocomplete, Tooltip, Select, Button, Option, Radio, RadioGroup, Switch } from 'element-ui'

Vue.component(Tooltip.name, Tooltip)
Vue.component(Input.name, Input)
Vue.component(Autocomplete.name, Autocomplete)
Vue.component(Select.name, Select)
Vue.component(Button.name, Button)
Vue.component(Option.name, Option)
Vue.component(Radio.name, Radio)
Vue.component(RadioGroup.name, RadioGroup)
Vue.component(Switch.name, Switch)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
