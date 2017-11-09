import Vue from 'vue'
import Router from 'vue-router'
import Index from '../views/index.vue'
import Edit from '../views/edit.vue'
// import Preview from './views/preview.vue'

Vue.use(Router)

const routerObj = new Router()

routerObj.addRoutes([
  {
    // 入口页
    path: '/',
    component: Index,
    children: [
      {
        // 项目编辑页
        name: 'edit',
        path: '/edit/:method/:apiPath*',
        component: Edit
      }
      // {
      //   // 预览 mock 数据页
      //   name: 'preview',
      //   path: '/preview/*',
      //   component: Preview
      // }
    ]
  }
])

export default routerObj
