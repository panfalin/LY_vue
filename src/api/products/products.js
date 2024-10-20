import request from '@/utils/request'

// 查询products列表
export function listProducts(query) {
  return request({
    url: '/products/products/list',
    method: 'get',
    params: query
  })
}

// 查询products详细
export function getProducts(id) {
  return request({
    url: '/products/products/' + id,
    method: 'get'
  })
}

// 新增products
export function addProducts(data) {
  return request({
    url: '/products/products',
    method: 'post',
    data: data
  })
}

// 修改products
export function updateProducts(data) {
  return request({
    url: '/products/products',
    method: 'put',
    data: data
  })
}

// 删除products
export function delProducts(id) {
  return request({
    url: '/products/products/' + id,
    method: 'delete'
  })
}
