import Vue from 'vue'
import dictConfig from './dictConfig'

const dict = {
  dict: {},
  label: {},
  list: []
}

function init() {
  const keys = Object.keys(dictConfig)
  dict.list = dictConfig
  keys.forEach(key => {
    const item = dictConfig[key]
    console.log(item.dictType)
    const dictType = item.dictType
    Vue.set(dict.dict, dictType, {})
    Vue.set(dict.label, dictType, {})
    Vue.set(dict, dictType, item)
    const itemKeys = item.values
    itemKeys.forEach((option) => {
      Vue.set(dict.dict[dictType], option.id, option)
      Vue.set(dict.label[dictType], option.id, option.name)
    })
  })
  return dict
}

export default init()
