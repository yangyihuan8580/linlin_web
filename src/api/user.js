import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function menu(data) {
  return request({
    url: '/menu/list',
    method: 'post',
    data
  })
}

export function queryList(data) {
  return request({
    url: '/user/queryList',
    method: 'post',
    data
  })
}


export function queryOne(data) {
  return request({
    url: '/user/queryOne',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/user/insert',
    method: 'post',
    data
  })
}


export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}


export function deleteUser(data) {
  return request({
    url: '/user/delete',
    method: 'post',
    data
  })
}

export function updatePassword(data) {
  return request({
    url: '/user/updatePassword',
    method: 'post',
    data
  })
}




export function queryUserRole(data) {
  return request({
    url: '/user/queryUserRole',
    method: 'post',
    data
  })
}


export function insertUserRole(data) {
  return request({
    url: '/user/insertUserRole',
    method: 'post',
    data
  })
}


export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
