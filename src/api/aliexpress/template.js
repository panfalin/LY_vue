import request from '@/utils/request.js'

// 查询列表
export function listTemplate(query) {
  return request({
    url: '/template/template/list',
    method: 'get',
    params: {
      sId: query.sId,
      pageNum: query.pageNum,
      pageSize: query.pageSize,
      sku: query.sku,
      orderNo: query.orderNo,
      listingId: query.listingId,
      storeId: query.storeId,
      typeQuestion: query.typeQuestion,
      processors: query.processors,
      proceStatus: query.proceStatus,
      orderByColumn: query.orderByColumn,
      isAsc: query.isAsc,
      preQuestions: query.questionContent,
    }
  })
}


export function getPeopleList(query) {
  return request({
    url: '/template/template/list/peopleList',
    method: 'get',
    params: query
  })
}

export function getquestionList(query) {
  return request({
    url: '/template/template/list/questionType',
    method: 'get',
    params: query
  })
}

export function listProductType(query) {
  return request({
    url: '/template/template/list/productType',
    method: 'get',
    params: query
  })
}

export function listFinalTreatment(query) {
  return request({
    url: '/template/template/list/finalTreatment',
    method: 'get',
    params: query
  })
}



// 查询详细
export function getTemplate(sId) {
  return request({
    url: `/template/template/${sId}`,
    method: 'get'
  })
}

// 新增
export function addTemplate(data) {
  return request({
    url: '/template/template',
    method: 'post',
    data: {
      sId: data.s_id,
      sku: data.sku,
      preQuestions: data.pre_questions,
      preResponse: data.pre_response,
      preAskTime: data.pre_ask_time,
      afterQuestions: data.after_questions,
      afterResponse: data.after_response,
      afterAskTime: data.after_ask_time,
      supplierResponse: data.supplier_response,
      orderNo: data.order_no,
      listingId: data.listing_id,
      storeId: data.store_id,
      typeQuestion: data.type_question,
      recorders: data.recorders,
      expectResults: data.expect_results,
      expectTime: data.expect_time,
      processors: data.processors,
      proceStatus: data.proce_status,
      finalTreatment: data.final_treatment,
      remark1: data.remark1,
      remark2: data.remark2,
      standardResponses: data.standard_responses,
      productType: data.product_type,
      dataTag: data.data_tag,
    }
  })
}


// 新增
export function addTemplateDict(data) {
  return request({
    url: '/template/template/dict',
    method: 'post',
    data: {
      dictLabel: data.dict_label,
      dictValue: data.dict_value,
      dictType: data.dict_type,
      listClass: data.list_class,
      status: data.status,
    }
  })
}




// 修改
export function updateTemplate(data) {
  return request({
    url: '/template/template',
    method: 'put',
    data: {
      sId: data.s_id,
      sku: data.sku,
      preQuestions: data.pre_questions,
      preResponse: data.pre_response,
      preAskTime: data.pre_ask_time,
      afterQuestions: data.after_questions,
      afterResponse: data.after_response,
      afterAskTime: data.after_ask_time,
      supplierResponse: data.supplier_response,
      orderNo: data.order_no,
      listingId: data.listing_id,
      storeId: data.store_id,
      typeQuestion: data.type_question,
      recorders: data.recorders,
      expectResults: data.expect_results,
      expectTime: data.expect_time,
      processors: data.processors,
      proceStatus: data.proce_status,
      finalTreatment: data.final_treatment,
      remark1: data.remark1,
      remark2: data.remark2,
      standardResponses: data.standard_responses,
      productType: data.product_type,
      dataTag: data.data_tag,
    }
  })
}

// 删除
export function delTemplate(skus) {
  return request({
    url: `/template/template/${skus}`,
    method: 'delete'
  })
}

// 导出
export function exportTemplate(query) {
  return request({
    url: '/template/template/export',
    method: 'post',
    params: query
  })
}

// 获取问题内容联想词
export function getQuestionSuggestions(keyword) {
  return request({
    url: '/template/template/suggestions',
    method: 'get',
    params: {
      keyword: keyword,
      fields: ['preQuestions', 'afterQuestions']
    }
  })
}



