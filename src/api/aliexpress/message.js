import request from '@/utils/request'

// 查询消息列表
export function listMessage(query) {
  return request({
    url: '/aliexpress/message/list',
    method: 'get',
    params: query
  })
}

export function listMessageUnread() {
  return request({
    url: '/aliexpress/message/list/unread',
    method: 'get'
  })
}



// 查询消息详细
export function getMessage(senderId, shopId) {
  return request({
    url: '/aliexpress/message/' + senderId + '/' + shopId,
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

export function updateMessageRead(data) {
  return request({
    url: '/aliexpress/message/read',
    method: 'put',
    data: data
  })
}


export function updateMessageSendNew(data) {
  return request({
    url: '/aliexpress/message/sendnew',
    method: 'put',
    data: data
  })
}


export function updateMessageStatus(data) {
  return request({
    url: '/aliexpress/message/status',
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



