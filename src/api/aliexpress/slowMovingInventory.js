import request from '@/utils/request'

// 查询速卖通滞销SKU分析列表
export function listSlowMovingInventory(query) {
  return request({
    url: '/aliexpress/slowMovingInventory/list',
    method: 'get',
    params: query
  })
}

// 查询速卖通滞销SKU分析详细
export function getSlowMovingInventory(id) {
  return request({
    url: '/aliexpress/slowMovingInventory/' + id,
    method: 'get'
  })
}

// 新增速卖通滞销SKU分析
export function addSlowMovingInventory(data) {
  return request({
    url: '/aliexpress/slowMovingInventory',
    method: 'post',
    data: data
  })
}

// 修改速卖通滞销SKU分析
export function updateSlowMovingInventory(data) {
  return request({
    url: '/aliexpress/slowMovingInventory',
    method: 'put',
    data: data
  })
}

// 删除速卖通滞销SKU分析
export function delSlowMovingInventory(id) {
  return request({
    url: '/aliexpress/slowMovingInventory/' + id,
    method: 'delete'
  })
}
