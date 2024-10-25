import request from '@/utils/request'

// 查询price_ratings列表
export function listRatings(query) {
  return request({
    url: '/price_ratings/ratings/list',
    method: 'get',
    params: query
  })
}

// 查询price_ratings详细
export function getRatings(id) {
  return request({
    url: '/price_ratings/ratings/' + id,
    method: 'get'
  })
}

// 新增price_ratings
export function addRatings(data) {
  return request({
    url: '/price_ratings/ratings',
    method: 'post',
    data: data
  })
}

// 修改price_ratings
export function updateRatings(data) {
  return request({
    url: '/price_ratings/ratings',
    method: 'put',
    data: data
  })
}

// 删除price_ratings
export function delRatings(id) {
  return request({
    url: '/price_ratings/ratings/' + id,
    method: 'delete'
  })
}
