import request from '@/utils/request'

// 查询amzlog列表
export function listAnalysis(query) {
  return request({
    url: '/amzlog/analysis/list',
    method: 'get',
    params: query
  })
}

// 查询amzlog详细
export function getAnalysis(id) {
  return request({
    url: '/amzlog/analysis/' + id,
    method: 'get'
  })
}

// 新增amzlog
export function addAnalysis(data) {
  return request({
    url: '/amzlog/analysis',
    method: 'post',
    data: data
  })
}

// 修改amzlog
export function updateAnalysis(data) {
  return request({
    url: '/amzlog/analysis',
    method: 'put',
    data: data
  })
}

// 删除amzlog
export function delAnalysis(id) {
  return request({
    url: '/amzlog/analysis/' + id,
    method: 'delete'
  })
}
