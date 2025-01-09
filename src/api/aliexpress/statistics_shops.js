import request from '@/utils/request'

// 查询马帮后台导出金额订单数据列表
export function listStatistics_shops(query) {
  return request({
    url: '/aliexpress/statistics_shops/list',
    method: 'get',
    params: query
  })
}

// 查询马帮后台导出金额订单数据详细
export function getStatistics_shops(sId) {
  return request({
    url: '/aliexpress/statistics_shops/' + sId,
    method: 'get'
  })
}

// 新增马帮后台导出金额订单数据
export function addStatistics_shops(data) {
  return request({
    url: '/aliexpress/statistics_shops',
    method: 'post',
    data: data
  })
}

// 修改马帮后台导出金额订单数据
export function updateStatistics_shops(data) {
  return request({
    url: '/aliexpress/statistics_shops',
    method: 'put',
    data: data
  })
}

// 删除马帮后台导出金额订单数据
export function delStatistics_shops(sId) {
  return request({
    url: '/aliexpress/statistics_shops/' + sId,
    method: 'delete'
  })
}
