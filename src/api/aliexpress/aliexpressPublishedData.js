import request from '@/utils/request'

// 查询速卖通刊登数据列表
export function listAliexpressPublishedData(query) {
  return request({
    url: '/aliexpress/aliexpressPublishedData/list',
    method: 'get',
    params: query
  })
}

// 查询速卖通刊登数据详细
export function getAliexpressPublishedData(commodityId) {
  return request({
    url: '/aliexpress/aliexpressPublishedData/' + commodityId,
    method: 'get'
  })
}

// 新增速卖通刊登数据
export function addAliexpressPublishedData(data) {
  return request({
    url: '/aliexpress/aliexpressPublishedData',
    method: 'post',
    data: data
  })
}

// 修改速卖通刊登数据
export function updateAliexpressPublishedData(data) {
  return request({
    url: '/aliexpress/aliexpressPublishedData',
    method: 'put',
    data: data
  })
}

// 删除速卖通刊登数据
export function delAliexpressPublishedData(commodityId) {
  return request({
    url: '/aliexpress/aliexpressPublishedData/' + commodityId,
    method: 'delete'
  })
}
