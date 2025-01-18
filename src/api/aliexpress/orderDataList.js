import request from '@/utils/request'

// 查询马帮订单数据列表
export function listOrderDataList(query) {
  return request({
    url: '/aliexpress/orderDataList/list',
    method: 'get',
    params: query
  })
}

// 查询马帮订单数据详细
export function getOrderDataList(sId) {
  return request({
    url: '/aliexpress/orderDataList/' + sId,
    method: 'get'
  })
}

// 新增马帮订单数据
export function addOrderDataList(data) {
  return request({
    url: '/aliexpress/orderDataList',
    method: 'post',
    data: data
  })
}

// 修改马帮订单数据
export function updateOrderDataList(data) {
  return request({
    url: '/aliexpress/orderDataList',
    method: 'put',
    data: data
  })
}

// 删除马帮订单数据
export function delOrderDataList(sId) {
  return request({
    url: '/aliexpress/orderDataList/' + sId,
    method: 'delete'
  })
}
