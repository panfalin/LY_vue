import request from '@/utils/request'

// 查询竞对信息列表
export function listInformation(query) {
  return request({
    url: '/aliexpress/information/list',
    method: 'get',
    params: query
  })
}

// 查询竞对信息详细
export function getInformation(sku) {
  return request({
    url: '/aliexpress/information/' + sku,
    method: 'get'
  })
}

// 新增竞对信息
export function addInformation(data) {
  return request({
    url: '/aliexpress/information',
    method: 'post',
    data: data
  })
}

// 修改竞对信息
export function updateInformation(data) {
  return request({
    url: '/aliexpress/information',
    method: 'put',
    data: data
  })
}

// 删除竞对信息
export function delInformation(sku) {
  return request({
    url: '/aliexpress/information/' + sku,
    method: 'delete'
  })
}
