import request from '@/utils/request'

// 查询系统菜单列表
export function listMenu(query) {
  return request({
    url: '/test3/menu/list',
    method: 'get',
    params: query
  })
}

// 查询系统菜单详细
export function getMenu(id) {
  return request({
    url: '/test3/menu/' + id,
    method: 'get'
  })
}

// 新增系统菜单
export function addMenu(data) {
  return request({
    url: '/test3/menu',
    method: 'post',
    data: data
  })
}

// 修改系统菜单
export function updateMenu(data) {
  return request({
    url: '/test3/menu',
    method: 'put',
    data: data
  })
}

// 删除系统菜单
export function delMenu(id) {
  return request({
    url: '/test3/menu/' + id,
    method: 'delete'
  })
}
