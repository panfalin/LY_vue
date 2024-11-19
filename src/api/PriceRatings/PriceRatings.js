import request from '@/utils/request'

// 查询价格和评分信息列表
export function listPriceRatings(query) {
  return request({
    url: '/PriceRatings/PriceRatings/list',
    method: 'get',
    params: query
  })
}

// 查询价格和评分信息详细
export function getPriceRatings(id) {
  return request({
    url: '/PriceRatings/PriceRatings/' + id,
    method: 'get'
  })
}

// 新增价格和评分信息
export function addPriceRatings(data) {
  return request({
    url: '/PriceRatings/PriceRatings',
    method: 'post',
    data: data
  })
}

// 修改价格和评分信息
export function updatePriceRatings(data) {
  return request({
    url: '/PriceRatings/PriceRatings',
    method: 'put',
    data: data
  })
}

// 删除价格和评分信息
export function delPriceRatings(id) {
  return request({
    url: '/PriceRatings/PriceRatings/' + id,
    method: 'delete'
  })
}

export class onMounted {
}