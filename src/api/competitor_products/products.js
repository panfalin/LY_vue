import request from '@/utils/request'

// 查询competitor_products列表
export function listProducts(query) {
  return request({
    url: '/competitor_products/products/list',
    method: 'get',
    params: query
  })
}

// 查询competitor_products详细
export function getProducts(id) {
  return request({
    url: '/competitor_products/products/' + id,
    method: 'get'
  })
}

// 新增competitor_products
export function addProducts(data) {
  return request({
    url: '/competitor_products/products',
    method: 'post',
    data: data
  })
}

// 修改competitor_products
export function updateProducts(data) {
  return request({
    url: '/competitor_products/products',
    method: 'put',
    data: data
  })
}

// 删除competitor_products
export function delProducts(id) {
  return request({
    url: '/competitor_products/products/' + id,
    method: 'delete'
  })
}
