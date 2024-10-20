import request from '@/utils/request'

// 查询订单数据列表
export function listOrders(query) {
  return request({
    url: '/orders/orders/list',
    method: 'get',
    params: query
  })
}

// 查询订单数据详细
export function getOrders(orderId) {
  return request({
    url: '/orders/orders/' + orderId,
    method: 'get'
  })
}

// 新增订单数据
export function addOrders(data) {
  return request({
    url: '/orders/orders',
    method: 'post',
    data: data
  })
}

// 修改订单数据
export function updateOrders(data) {
  return request({
    url: '/orders/orders',
    method: 'put',
    data: data
  })
}

// 删除订单数据
export function delOrders(orderId) {
  return request({
    url: '/orders/orders/' + orderId,
    method: 'delete'
  })
}

// 获取所有店铺
export function getAllStores() {
  return request({
    url: '/orders/orders/stores',
    method: 'get'
  })
}

// 获取所有国家
export function getAllCountry() {
  return request({
    url: '/orders/orders/country',
    method: 'get'
  })
}