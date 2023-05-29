import request from '@/utils/ox-request'
import qs from 'qs'

export function add(data) {
  return request({
    url: '/v1/user',
    method: 'post',
    data
  })
}

export function batchDelete(params) {
  return request({
    url: '/v1/user',
    method: 'delete',
    params
  })
}

export function update(data) {
  return request({
    url: '/v1/user',
    method: 'patch',
    data
  })
}

export function page(params) {
  return request({
    url: '/v1/user/page',
    method: 'get',
    params,
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'indices', allowDots: true })
  })
}

export function get(userId) {
  return request({
    url: '/v1/user/' + userId,
    method: 'get'
  })
}

export function changeStatus(userId, status) {
  return request({
    url: `/v1/user/${userId}/changeStatus`,
    method: 'patch',
    params: { status }
  })
}

