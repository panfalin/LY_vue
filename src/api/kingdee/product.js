import request from '@/utils/request'

// 查询金蝶商品信息列表
export function listProduct(query) {
  return request({
    url: '/kingdee/product/list',
    method: 'get',
    params: query
  })
}

// 查询金蝶商品信息详细
export function getProduct(rk) {
  return request({
    url: '/kingdee/product/' + rk,
    method: 'get'
  })
}

// 新增金蝶商品信息
export function addProduct(data) {
  return request({
    url: '/kingdee/product',
    method: 'post',
    data: data
  })
}

// 修改金蝶商品信息
export function updateProduct(data) {
  return request({
    url: '/kingdee/product',
    method: 'put',
    data: data
  })
}

// 删除金蝶商品信息
export function delProduct(rk) {
  return request({
    url: '/kingdee/product/' + rk,
    method: 'delete'
  })
}

// 查询分类树结构
export function listProductCategoryTree() {
  return request({
    url: '/kingdee/productCategory/tree',
    method: 'get'
  })
}