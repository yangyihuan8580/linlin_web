import request from '@/utils/request'

export function queryList(data) {
  return request({
    url: '/paper/queryList',
    method: 'post',
    data
  })
}

export function queryOne(data) {
  return request({
    url: '/paper/queryOne',
    method: 'post',
    data
  })
}

export function addPaper(data) {
  return request({
    url: '/paper/insert',
    method: 'post',
    data
  })
}

export function updatePaper(data) {
  return request({
    url: '/paper/update',
    method: 'post',
    data
  })
}


export function deletePaper(data) {
  return request({
    url: '/paper/delete',
    method: 'post',
    data
  })
}



export function updateLayout(data) {
  return request({
    url: '/paper/updateLayout',
    method: 'post',
    data
  })
}



export function queryPaper(data) {
  return request({
    url: '/paper/queryPaper',
    method: 'post',
    data
  })
}


export function queryPaperAndAnswer(data) {
  return request({
    url: '/paper/queryPaperAndAnswer',
    method: 'post',
    data
  })
}


export function saveAnswer(data) {
  return request({
    url: '/paper/saveAnswer',
    method: 'post',
    data
  })
}

export function queryAnswer(data) {
  return request({
    url: '/paper/queryAnswer',
    method: 'post',
    data
  })
}