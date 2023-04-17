import Vue from 'vue'
import dictConfig from './dictConfig'

const dict = {
  dict: {},
  label: {}
}

function init() {
  const keys = Object.keys(dictConfig)
  keys.forEach(key => {
    const item = dictConfig[key]
    Vue.set(dict.dict, key, {})
    Vue.set(dict.label, key, {})
    Vue.set(dict, key, item)
    const itemKeys = Object.keys(item)
    itemKeys.forEach((itemKey) => {
      const option = item[itemKey]
      Vue.set(dict.dict[key], option.id, option)
      Vue.set(dict.label[key], option.id, option.name)
    })
  })
  return dict
}

export default init()
