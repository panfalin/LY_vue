import request from '@/utils/request'

// 查询操作记录列表
export function listRecords(query) {
  return request({
    url: '/operationRecords/records/list',
    method: 'get',
    params: query
  })
}

// 查询操作记录详细
export function getRecords(id) {
  return request({
    url: '/operationRecords/records/' + id,
    method: 'get'
  })
}

// 新增操作记录
export function addRecords(data) {
  return request({
    url: '/operationRecords/records',
    method: 'post',
    data: data
  })
}

// 修改操作记录
export function updateRecords(data) {
  return request({
    url: '/operationRecords/records',
    method: 'put',
    data: data
  })
}

// 删除操作记录
export function delRecords(id) {
  return request({
    url: '/operationRecords/records/' + id,
    method: 'delete'
  })
}
