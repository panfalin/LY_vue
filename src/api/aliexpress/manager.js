import request from '@/utils/request'

// 查询店长运营列表
export function listManager(query) {
  return request({
    url: '/aliexpress/manager/list',
    method: 'get',
    params: query
  })
}

// 查询店长运营详细
export function getManager(sId) {
  return request({
    url: '/aliexpress/manager/' + sId,
    method: 'get'
  })
}

// 新增店长运营
export function addManager(data) {
  return request({
    url: '/aliexpress/manager',
    method: 'post',
    data: data
  })
}

// 修改店长运营
export function updateManager(data) {
  return request({
    url: '/aliexpress/manager',
    method: 'put',
    data: data
  })
}

// 删除店长运营
export function delManager(sId) {
  return request({
    url: '/aliexpress/manager/' + sId,
    method: 'delete'
  })
}
