import request from '@/utils/request'

// 查询马帮后台导出金额订单数据列表
export function listStatistics(query) {
  return request({
    url: '/statistics/statistics/list',
    method: 'get',
    params: query
  })
}


export function listStatisticsToal(query) {
  return request({
    url: '/statistics/statistics/listToal',
    method: 'get',
    params: query
  })
}


// 查询马帮后台导出金额订单数据详细
export function getStatistics(sId) {
  return request({
    url: '/statistics/statistics/' + sId,
    method: 'get'
  })
}

// 新增马帮后台导出金额订单数据
export function addStatistics(data) {
  return request({
    url: '/statistics/statistics',
    method: 'post',
    data: data
  })
}

// 修改马帮后台导出金额订单数据
export function updateStatistics(data) {
  return request({
    url: '/statistics/statistics',
    method: 'put',
    data: data
  })
}

// 删除马帮后台导出金额订单数据
export function delStatistics(sId) {
  return request({
    url: '/statistics/statistics/' + sId,
    method: 'delete'
  })
}
