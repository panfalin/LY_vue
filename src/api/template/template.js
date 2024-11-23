import request from '../../../../RuoYi-Vue3/src/utils/request.js'

// 查询客服问答SKU收集模板列表
export function listTemplate(query) {
  return request({
    url: '/template/template/list',
    method: 'get',
    params: query
  })
}

// 查询客服问答SKU收集模板详细
export function getTemplate(sId) {
  return request({
    url: '/template/template/' + sId,
    method: 'get'
  })
}

// 新增客服问答SKU收集模板
export function addTemplate(data) {
  return request({
    url: '/template/template',
    method: 'post',
    data: data
  })
}

// 修改客服问答SKU收集模板
export function updateTemplate(data) {
  return request({
    url: '/template/template',
    method: 'put',
    data: data
  })
}

// 删除客服问答SKU收集模板
export function delTemplate(sku) {
  return request({
    url: '/template/template/' + sku,
    method: 'delete'
  })
}
