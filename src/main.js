import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
// directive
import directive from './directive' // directive

import '@/icons' // icon
import '@/permission' // permission control
import plugins from '@/plugins/index'

import * as filters from './filters' // global filters
// 公共方法
import * as common from '@/utils/common'
// 分页组件
import Pagination from '@/components/Pagination'
// 字典标签组件
import DictTag from '@/components/DictTag'
// 自定义表格工具组件
import RightToolbar from '@/components/RightToolbar'

// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI, {
  size: Cookies.get('size') || 'small' // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

// 全局方法挂载
Object.keys(common).forEach(key => {
  Vue.prototype[key] = common[key]
})

// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('DictTag', DictTag)
Vue.component('RightToolbar', RightToolbar)

Vue.use(plugins)
Vue.use(directive)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

