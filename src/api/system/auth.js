import request from '@/utils/ox-request'
import qs from 'qs'

export function login(data) {
  return request({
    url: '/login',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    method: 'post',
    data: qs.stringify(data)
  })
}

export function getInfo(token) {
  return request({
    url: '/v1/auth/info',
    method: 'get',
    params: { token }
  })
}

export function routerList() {
  return request({
    url: '/v1/auth/routerList',
    method: 'get'
  })
}

export function register() {
  return request({
    url: '/register',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
