import request from '@/utils/request'
import qs from 'qs'

export function add(data) {
  return request({
    url: '/v1/role',
    method: 'post',
    data
  })
}

export function batchDelete(params) {
  return request({
    url: '/v1/role',
    method: 'delete',
    params
  })
}

export function update(data) {
  return request({
    url: '/v1/role',
    method: 'put',
    data
  })
}

export function getRole(id) {
  return request({
    url: '/v1/role/' + id,
    method: 'get'
  })
}

export function page(params) {
  return request({
    url: '/v1/role/page',
    method: 'get',
    params,
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'indices', allowDots: true })
  })
}

export function list() {
  return request({
    url: '/v1/role/list',
    method: 'get'
  })
}

export function saveMenu(roleId, data) {
  return request({
    url: '/v1/role/' + roleId + '/saveMenu',
    method: 'post',
    data
  })
}

