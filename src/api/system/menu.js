import request from '@/utils/ox-request'

export function addMenu(data) {
  return request({
    url: '/v1/menu',
    method: 'post',
    data
  })
}

export function deleteMenu(params) {
  return request({
    url: '/v1/menu',
    method: 'delete',
    params
  })
}

export function updateMenu(data) {
  return request({
    url: '/v1/menu',
    method: 'patch',
    data
  })
}

export function getMenu(id) {
  return request({
    url: `/v1/menu/${id}`,
    method: 'get'
  })
}

export function treeList() {
  return request({
    url: '/v1/menu/treeList',
    method: 'get'
  })
}

export function lazy(pid) {
  return request({
    url: '/v1/menu/lazy/' + pid,
    method: 'get'
  })
}

export function getMenuSuperior(ids) {
  const params = Array.isArray(ids) || ids.length === 0 ? ids.toString() : Array.of(ids).toString()
  return request({
    url: '/v1/menu/superior',
    method: 'get',
    params: { ids: params }
  })
}

