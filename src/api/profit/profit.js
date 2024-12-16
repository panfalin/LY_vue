import request from '@/utils/request'

// 查询店铺利润汇总列表
export function listProfit(query) {
  return request({
    url: '/profit/profit/list',
    method: 'get',
    params: query
  })
}

// 查询店铺利润汇总详细
export function getProfit(id) {
  return request({
    url: '/profit/profit/' + id,
    method: 'get'
  })
}

// 新增店铺利润汇总
export function addProfit(data) {
  return request({
    url: '/profit/profit',
    method: 'post',
    data: data
  })
}

// 修改店铺利润汇总
export function updateProfit(data) {
  return request({
    url: '/profit/profit',
    method: 'put',
    data: data
  })
}

// 删除店铺利润汇总
export function delProfit(id) {
  return request({
    url: '/profit/profit/' + id,
    method: 'delete'
  })
}

// 查询速卖通分析-店铺信息列表
export function listStores(query) {
  return request({
    url: '/stores/stores/list',
    method: 'get',
    params: query
  })
}