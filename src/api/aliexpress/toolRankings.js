import request from '@/utils/request'

// 查询速卖通工具-店铺排名列表
export function listToolRankings(query) {
  return request({
    url: '/aliexpress/toolRankings/list',
    method: 'get',
    params: query
  })
}

// 查询速卖通工具-店铺排名详细
export function getToolRankings(shops) {
  return request({
    url: '/aliexpress/toolRankings/' + shops,
    method: 'get'
  })
}

// 新增速卖通工具-店铺排名
export function addToolRankings(data) {
  return request({
    url: '/aliexpress/toolRankings',
    method: 'post',
    data: data
  })
}

// 修改速卖通工具-店铺排名
export function updateToolRankings(data) {
  return request({
    url: '/aliexpress/toolRankings',
    method: 'put',
    data: data
  })
}

// 删除速卖通工具-店铺排名
export function delToolRankings(shops) {
  return request({
    url: '/aliexpress/toolRankings/' + shops,
    method: 'delete'
  })
}
