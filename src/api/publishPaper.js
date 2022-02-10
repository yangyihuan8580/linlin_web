import request from '@/utils/request'

export function queryPublishPaper(data) {
  return request({
    url: '/publishPaper/queryList',
    method: 'post',
    data
  })
}

export function queryOne(data) {
  return request({
    url: '/publishPaper/queryOne',
    method: 'post',
    data
  })
}

export function insert(data) {
  return request({
    url: '/publishPaper/insert',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/publishPaper/update',
    method: 'post',
    data
  })
}


export function deletePublishPaper(data) {
  return request({
    url: '/publishPaper/delete',
    method: 'post',
    data
  })
}

export function updateStatus(data) {
  return request({
    url: '/publishPaper/updateStatus',
    method: 'post',
    data
  })
}

