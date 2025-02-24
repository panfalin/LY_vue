import request from '@/utils/request'

// 查询亚马逊数据分析，周转率，mskulist，这个是基础信息列表
export function listAmzTurnover(query) {
  return request({
    url: '/amazon/amzTurnover/list',
    method: 'get',
    params: query
  })
}

// 查询亚马逊数据分析，周转率，mskulist，这个是基础信息详细
export function getAmzTurnover(id) {
  return request({
    url: '/amazon/amzTurnover/' + id,
    method: 'get'
  })
}

// 新增亚马逊数据分析，周转率，mskulist，这个是基础信息
export function addAmzTurnover(data) {
  return request({
    url: '/amazon/amzTurnover',
    method: 'post',
    data: data
  })
}

// 修改亚马逊数据分析，周转率，mskulist，这个是基础信息
export function updateAmzTurnover(data) {
  return request({
    url: '/amazon/amzTurnover',
    method: 'put',
    data: data
  })
}

// 删除亚马逊数据分析，周转率，mskulist，这个是基础信息
export function delAmzTurnover(id) {
  return request({
    url: '/amazon/amzTurnover/' + id,
    method: 'delete'
  })
}

// 汇总亚马逊数据分析，周转率，mskulist，这个是基础信息
export function summaryAmzTurnover(data) {
  return request({
    url: '/amazon/amzTurnover/summary',
    method: 'post',
    data: data
  })
}