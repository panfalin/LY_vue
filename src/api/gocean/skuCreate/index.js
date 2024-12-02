import axios from 'axios'

// 根据环境设置基础URL
const baseURL = import.meta.env.PROD ? 'http://192.168.1.204:3600' : 'http://192.168.1.204:3600'

const api = axios.create({
  baseURL: `${baseURL}/api`
})

const uploadApi = {
  uploadImage: (formData) => api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

const componentApi = {
  list: (params = {}) => api.get('/components', { params }),
  create: (data) => api.post('/components', data),
  update: (id, data) => api.put(`/components/${id}`, data),
  delete: (id) => api.delete(`/components/${id}`)
}

const categoryApi = {
  list: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`)
}

const relationApi = {
  allList: () => api.get('/component-relations/all'),
  list: (params = {}) => {
    return api.get('/component-relations', {
      params: {
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        categoryId: params.categoryId || '',
        relationType: params.relationType || '',
        keyword: params.keyword || '',
        componentId: params.componentId || ''
      }
    })
  },
  getParentRelations: (childId, params = {}) => {
    return api.get(`/component-relations/child/${childId}`, {
      params: {
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        relationType: params.relationType || ''
      }
    })
  },
  getChildRelations: (parentId, params = {}) => {
    return api.get(`/component-relations/parent/${parentId}`, {
      params: {
        page: params.page || 1,
        pageSize: params.pageSize || 10
      }
    })
  },
  create: (data) => api.post('/component-relations', data),
  delete: (parentId, childId) => api.delete(`/component-relations/${parentId}/${childId}`)
}

const codeRuleApi = {
  list: () => api.get('/code-rules'),
  batchSave: (rules) => api.post('/code-rules/batch', { rules }),
  getAccessoryRules: () => api.get('/accessory-code-rules'),
  saveAccessoryRules: (rules) => api.put('/accessory-code-rules', { rules })
}

const hashMappingApi = {
  create: (data) => api.post('/hash-mapping', data),
  getOriginalValue: (shortHash) => api.get(`/hash-mapping/${shortHash}`)
}

export { componentApi, categoryApi, relationApi, uploadApi, codeRuleApi, hashMappingApi }