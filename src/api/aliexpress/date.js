import request from '@/utils/request'

// 查询时间维度统计列表
export function listDate(query) {
  return request({
    url: '/aliexpress/date/list',
    method: 'get',
    params: query
  })
}

// 查询时间维度统计详细
export function getDate(sId) {
  return request({
    url: '/aliexpress/date/' + sId,
    method: 'get'
  })
}

// 新增时间维度统计
export function addDate(data) {
  return request({
    url: '/aliexpress/date',
    method: 'post',
    data: data
  })
}

// 修改时间维度统计
export function updateDate(data) {
  return request({
    url: '/aliexpress/date',
    method: 'put',
    data: data
  })
}

// 删除时间维度统计
export function delDate(sId) {
  return request({
    url: '/aliexpress/date/' + sId,
    method: 'delete'
  })
}
