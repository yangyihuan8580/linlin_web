import request from '@/utils/request'

export function queryExamByUserId(data) {
  return request({
    url: '/paper/queryExamByUserId',
    method: 'post',
    data
  })
}


export function queryExamByPublishPaperId(data) {
  return request({
    url: '/paper/queryExamByPublishPaperId',
    method: 'post',
    data
  })
}


export function commitExam(data) {
  return request({
    url: '/exam/commit',
    method: 'post',
    data
  })
}



