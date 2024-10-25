import request from '@/utils/request'

// 查询online_data列表
export function listData(query) {
  return request({
    url: '/online_data/data/list',
    method: 'get',
    params: query
  })
}

// 查询online_data详细
export function getData(id) {
  return request({
    url: '/online_data/data/' + id,
    method: 'get'
  })
}

// 新增online_data
export function addData(data) {
  return request({
    url: '/online_data/data',
    method: 'post',
    data: data
  })
}

// 修改online_data
export function updateData(data) {
  return request({
    url: '/online_data/data',
    method: 'put',
    data: data
  })
}

// 删除online_data
export function delData(id) {
  return request({
    url: '/online_data/data/' + id,
    method: 'delete'
  })
}
