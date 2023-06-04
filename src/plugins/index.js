import dict from '@/config/dict'
import modal from './modal'
import tab from './tab'
import download from './download'

export default {
  install(Vue) {
    // 字典
    Vue.prototype.$dict = dict
    // 模态框对象
    Vue.prototype.$modal = modal
    // 页签操作
    Vue.prototype.$tab = tab
    // 下载文件
    Vue.prototype.$download = download
  }
}
