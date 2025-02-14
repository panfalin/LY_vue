import request from '@/utils/request'

// 查询清仓库存列表
export function listClearance(query) {
  return request({
    url: '/aliexpress/clearance/list',
    method: 'get',
    params: query
  })
}

// 查询速卖通滞销SKU分析列表
export function listClearanceTotal(query) {
  return request({
    url: '/aliexpress/clearance/listTotal',
    method: 'get',
    params: query
  })
}




// 查询清仓库存详细
export function getClearance(id) {
  return request({
    url: '/aliexpress/clearance/' + id,
    method: 'get'
  })
}

// 新增清仓库存
export function addClearance(data) {
  return request({
    url: '/aliexpress/clearance',
    method: 'post',
    data: data
  })
}

// 修改清仓库存
export function updateClearance(data) {
  return request({
    url: '/aliexpress/clearance',
    method: 'put',
    data: data
  })
}

// 删除清仓库存
export function delClearance(id) {
  return request({
    url: '/aliexpress/clearance/' + id,
    method: 'delete'
  })
}
