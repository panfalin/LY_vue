import request from '@/utils/request'

// 查询速卖通分析-店铺维度列表
export function listOrder_data(query) {
  return request({
    url: '/order_data/order_data/list',
    method: 'get',
    params: query
  })
}

// 查询速卖通分析-店铺维度详细
export function getOrder_data(productId) {
  return request({
    url: '/order_data/order_data/' + productId,
    method: 'get'
  })
}

// 新增速卖通分析-店铺维度
export function addOrder_data(data) {
  return request({
    url: '/order_data/order_data',
    method: 'post',
    data: data
  })
}

// 修改速卖通分析-店铺维度
export function updateOrder_data(data) {
  return request({
    url: '/order_data/order_data',
    method: 'put',
    data: data
  })
}

// 删除速卖通分析-店铺维度
export function delOrder_data(productId) {
  return request({
    url: '/order_data/order_data/' + productId,
    method: 'delete'
  })
}

// 获取所有店铺
export function getAllStores() {
  return request({
    url: '/order_data/order_data/stores',
    method: 'get'
  })
}
