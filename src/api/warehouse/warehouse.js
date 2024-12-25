import request from '@/utils/request'

// 查询warehouse列表
export function listWarehouse(query) {
  return request({
    url: '/warehouse/warehouse/list',
    method: 'get',
    params: query
  })
}

// 查询warehouse详细
export function getWarehouse(sId) {
  return request({
    url: '/warehouse/warehouse/' + sId,
    method: 'get'
  })
}

export function getWarehouse2(sku,stockId) {
  return request({
    url: '/warehouse/warehouse/' + sku + '/' + stockId,
    method: 'get'
  })
}

// 新增warehouse
export function addWarehouse(data) {
  return request({
    url: '/warehouse/warehouse',
    method: 'post',
    data: data
  })
}

// 修改warehouse
export function updateWarehouse(data) {
  return request({
    url: '/warehouse/warehouse',
    method: 'put',
    data: data
  })
}

// 删除warehouse
export function delWarehouse(sku) {
  return request({
    url: '/warehouse/warehouse/' + sku,
    method: 'delete'
  })
}

// 添加导入Excel方法
export function importExcel(data) {
  return request({
    url: '/warehouse/warehouse/import',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 获取店铺名称列表
export function getShopNameList() {
  return request({
    url: '/warehouse/warehouse/list/shopname',
    method: 'get'
  })
}
