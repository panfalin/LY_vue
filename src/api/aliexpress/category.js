import request from '@/utils/request'

// 查询马帮后台导出金额订单数据列表
export function listCategory(query) {
  return request({
    url: '/aliexpress/category/list',
    method: 'get',
    params: query
  })
}

// 查询马帮后台导出金额订单数据详细
export function getCategory(sId) {
  return request({
    url: '/aliexpress/category/' + sId,
    method: 'get'
  })
}

// 新增马帮后台导出金额订单数据
export function addCategory(data) {
  return request({
    url: '/aliexpress/category',
    method: 'post',
    data: data
  })
}

// 修改马帮后台导出金额订单数据
export function updateCategory(data) {
  return request({
    url: '/aliexpress/category',
    method: 'put',
    data: data
  })
}

// 删除马帮后台导出金额订单数据
export function delCategory(sId) {
  return request({
    url: '/aliexpress/category/' + sId,
    method: 'delete'
  })
}
