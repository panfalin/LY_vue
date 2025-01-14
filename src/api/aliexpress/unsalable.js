import request from '@/utils/request'

// 查询滞销库存列表
export function listUnsalable(query) {
  return request({
    url: '/aliexpress/unsalable/list',
    method: 'get',
    params: query
  })
}

// 查询滞销库存详细
export function getUnsalable(year) {
  return request({
    url: '/aliexpress/unsalable/' + year,
    method: 'get'
  })
}

// 新增滞销库存
export function addUnsalable(data) {
  return request({
    url: '/aliexpress/unsalable',
    method: 'post',
    data: data
  })
}

// 修改滞销库存
export function updateUnsalable(data) {
  return request({
    url: '/aliexpress/unsalable',
    method: 'put',
    data: data
  })
}

// 删除滞销库存
export function delUnsalable(year) {
  return request({
    url: '/aliexpress/unsalable/' + year,
    method: 'delete'
  })
}
