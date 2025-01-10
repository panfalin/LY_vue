import request from '@/utils/request'

// 查询竞对SKU列表
export function listCompetition(query) {
  return request({
    url: '/aliexpress/competition/list',
    method: 'get',
    params: query
  })
}

// 查询竞对SKU详细
export function getCompetition(sId) {
  return request({
    url: '/aliexpress/competition/' + sId,
    method: 'get'
  })
}

// 新增竞对SKU
export function addCompetition(data) {
  return request({
    url: '/aliexpress/competition',
    method: 'post',
    data: data
  })
}

// 修改竞对SKU
export function updateCompetition(data) {
  return request({
    url: '/aliexpress/competition',
    method: 'put',
    data: data
  })
}

// 删除竞对SKU
export function delCompetition(sId) {
  return request({
    url: '/aliexpress/competition/' + sId,
    method: 'delete'
  })
}
