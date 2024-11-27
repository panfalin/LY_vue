import request from '@/utils/request'

// 查询消息列表
export function listMessage(query) {
  return request({
    url: '/aliexpress/message/list',
    method: 'get',
    params: query
  })
}

// 查询消息详细
export function getMessage(messageId) {
  return request({
    url: '/aliexpress/message/' + messageId,
    method: 'get'
  })
}

// 新增消息
export function addMessage(data) {
  return request({
    url: '/aliexpress/message',
    method: 'post',
    data: data
  })
}

// 修改消息
export function updateMessage(data) {
  return request({
    url: '/aliexpress/message',
    method: 'put',
    data: data
  })
}

// 删除消息
export function delMessage(messageId) {
  return request({
    url: '/aliexpress/message/' + messageId,
    method: 'delete'
  })
}
