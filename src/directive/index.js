import clipboard from './module/clipboard'
import permission from './permission/index.js'

const install = function(Vue) {
  Vue.directive('clipboard', clipboard)
  Vue.directive('permission', permission)
}

if (window.Vue) {
  Vue.use(install); // eslint-disable-line
}

export default install
