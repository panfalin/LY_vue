import request from '@/utils/request'

// 查询products列表
export function listProducts(query) {
  return request({
    url: '/products/products/list',
    method: 'get',
    params: query
  })
}

// 查询products详细
export function getProducts(id) {
  return request({
    url: '/products/products/' + id,
    method: 'get'
  })
}

// 新增products
export function addProducts(data) {
  return request({
    url: '/products/products',
    method: 'post',
    data: data
  })
}

// 修改products
export function updateProducts(data) {
  return request({
    url: '/products/products',
    method: 'put',
    data: data
  })
}

// 删除products
export function delProducts(id) {
  return request({
    url: '/products/products/' + id,
    method: 'delete'
  })
}

  // 查询速卖通分析-分类列表
  export function listCategories(query) {
    return request({
      url: '/categories/categories/list',
      method: 'get',
      params: query
    })
  }

// 查询速卖通分析-店铺信息列表
export function listStores(query) {
  return request({
    url: '/stores/stores/list',
    method: 'get',
    params: query
  })
}

// 查询速卖通分析-商品维度，今天要做的事情
export function listTODO(query) {
  return request({
    url: '/products/products/toDoList',
    method: 'get',
    params: query
  })
}

// 查询所有分配责任人
export function listResponsible(query) {
  return request({
    url: '/products/products/responsible',
    method: 'get',
    params: query
  })
}

// 查询速卖通分析-任务清单列表
export function listTask(query) {
  return request({
    url: '/task/sales/listListed',
    method: 'get',
    params: query
  })
}

// 查询速卖通分析-任务清单详细
export function getTask(id) {
  return request({
    url: '/task/sales/' + id,
    method: 'get'
  })
}

// 新增速卖通分析-任务清单
export function addTask(data) {
  return request({
    url: '/task/sales',
    method: 'post',
    data: data
  })
}

// 修改速卖通分析-任务清单
export function updateTask(data) {
  return request({
    url: '/task/sales',
    method: 'put',
    data: data
  })
}

// 删除速卖通分析-任务清单
export function delTask(id) {
  return request({
    url: '/task/sales/' + id,
    method: 'delete'
  })
}

export function getTaskDistribution(id) {
    return request({
      url: '/task/sales/updateDailyTasks',
      method: 'get'
    })
}

