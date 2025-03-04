import request from '@/utils/request'

// 查询工具指标列表
export function listIndicators(query) {
  return request({
    url: '/aliexpress/indicators/list',
    method: 'get',
    params: query
  })
}


// 查询工具指标列表
export function selectShop(query) {
  return request({
    url: '/aliexpress/indicators/listShop',
    method: 'get',
    params: query
  })
}

export function SelectShopName(query) {
  return request({
    url: '/aliexpress/indicators/listShopName',
    method: 'get',
    params: query
  })
}


// 查询工具指标详细
export function getIndicators(sId) {
  return request({
    url: '/aliexpress/indicators/' + sId,
    method: 'get'
  })
}

// 新增工具指标
export function addIndicators(data) {
  return request({
    url: '/aliexpress/indicators',
    method: 'post',
    data: data
  })
}

// 修改工具指标
export function updateIndicators(data) {
  return request({
    url: '/aliexpress/indicators',
    method: 'put',
    data: data
  })
}

// 删除工具指标
export function delIndicators(sId) {
  return request({
    url: '/aliexpress/indicators/' + sId,
    method: 'delete'
  })
}
