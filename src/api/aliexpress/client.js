import request from '@/utils/request'

// 查询用户列表
export function listClient(query) {
  return request({
    url: '/aliexpress/client/list',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getClient(clientId) {
  return request({
    url: '/aliexpress/client/' + clientId,
    method: 'get'
  })
}

// 新增用户
export function addClient(data) {
  return request({
    url: '/aliexpress/client',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateClient(data) {
  return request({
    url: '/aliexpress/client',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delClient(clientId) {
  return request({
    url: '/aliexpress/client/' + clientId,
    method: 'delete'
  })
}
