import request from '@/utils/request'

// 查询工具指标-全托管列表
export function listAuto(query) {
  return request({
    url: '/aliexpress/auto/list',
    method: 'get',
    params: query
  })
}

// 查询工具指标-全托管详细
export function getAuto(sId) {
  return request({
    url: '/aliexpress/auto/' + sId,
    method: 'get'
  })
}

// 新增工具指标-全托管
export function addAuto(data) {
  return request({
    url: '/aliexpress/auto',
    method: 'post',
    data: data
  })
}

// 修改工具指标-全托管
export function updateAuto(data) {
  return request({
    url: '/aliexpress/auto',
    method: 'put',
    data: data
  })
}

// 删除工具指标-全托管
export function delAuto(sId) {
  return request({
    url: '/aliexpress/auto/' + sId,
    method: 'delete'
  })
}
