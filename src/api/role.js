import request from '@/utils/request'

export function queryList(data) {
  return request({
    url: '/role/queryList',
    method: 'post',
    data
  })
}

export function queryOne(data) {
  return request({
    url: '/role/queryOne',
    method: 'post',
    data
  })
}

export function addRole(data) {
  return request({
    url: '/role/insert',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/role/update',
    method: 'post',
    data
  })
}


export function deleteRole(data) {
  return request({
    url: '/role/delete',
    method: 'post',
    data
  })
}


