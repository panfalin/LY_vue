<template>
  <div class="app-container">
    <!-- 主列表页面 -->
    <div v-show="!showDetail" class="main-container">
      <!-- 搜索区域简化 -->
      <div class="filter-container">
        <el-input
          v-model="queryParams.sku"
          placeholder="输入SKU搜索..."
          class="search-input"
          clearable
          @keyup.enter="handleQuery"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <el-input
          v-model="queryParams.orderNo"
          placeholder="输入订单号搜索..."
          class="search-input"
          clearable
          @keyup.enter="handleQuery"
        >
          <template #prefix>
            <el-icon><Document /></el-icon>
          </template>
        </el-input>
        
        <el-input
          v-model="queryParams.listingId"
          placeholder="输入刊登ID搜索..."
          class="search-input"
          clearable
          @keyup.enter="handleQuery"
        >
          <template #prefix>
            <el-icon><Document /></el-icon>
          </template>
        </el-input>

        <el-select
          v-model="queryParams.typeQuestion"
          placeholder="问题类型"
          clearable
        >
          <el-option label="售前" value="售前" />
          <el-option label="买错" value="买错" />
          <el-option label="质量问题" value="质量问题" />
          <el-option label="车型不匹配" value="车型不匹配" />
          <el-option label="仓库发错" value="仓库发错" />
          <el-option label="专业问题" value="专业问题" />
        </el-select>

        <el-select
          v-model="queryParams.proceStatus"
          placeholder="处理状态"
          clearable
        >
          <el-option label="待处理" value="待处理" />
          <el-option label="处理中" value="处理中" />
          <el-option label="已完成" value="已完成" />
        </el-select>

        <el-select
          v-model="queryParams.processors"
          placeholder="处理人"
          clearable
        >
          <el-option
            v-for="user in userOptions"
            :key="user.value"
            :label="user.label"
            :value="user.value"
          />
        </el-select>

        <div class="button-group">
          <el-button type="primary" @click="handleQuery">
            <el-icon><Search /></el-icon>搜索
          </el-button>
          <el-button @click="resetQuery">
            <el-icon><Refresh /></el-icon>重置
          </el-button>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新建工单
          </el-button>
        </div>
      </div>

      <!-- 修改列表部分 -->
      <div class="issue-list">
        <div
          v-for="item in templateList"
          :key="item.s_id"
          class="issue-card"
          @click="handleIssueClick(item)"
        >
          <!-- 卡片头部 -->
          <div class="card-header">
            <div class="left-info">
              <el-tag 
                :class="['status-tag', getStatusClass(item.proceStatus)]" 
                size="small"
              >
                {{ item.proceStatus || '待处理' }}
              </el-tag>
              <span class="sku-text">#{{ item.s_id }} {{ item.sku }}</span>
            </div>
            <div class="right-info">
              <div class="assignee-info" v-if="item.processors">
                <el-avatar :size="24" class="assignee-avatar">
                  {{ getInitials(item.processors) }}
                </el-avatar>
                <span class="assignee-name">{{ item.processors }}</span>
              </div>
              <div class="assignee-info unassigned" v-else>
                <el-icon><UserFilled /></el-icon>
                <span>未指派</span>
              </div>
            </div>
          </div>

          <!-- 卡片主体 -->
          <div class="card-body">
            <div class="issue-title">
              {{ item.typeQuestion || '未分类' }}
              <el-tag size="small" type="info" class="store-tag" v-if="item.storeId">
                {{ item.storeId }}
              </el-tag>
            </div>
            
            <div class="issue-meta">
              <span class="meta-item">
                <el-icon><Document /></el-icon>
                订单号: {{ item.orderNo || '-' }}
              </span>
              <span class="meta-item">
                <el-icon><Link /></el-icon>
                刊登ID: {{ item.listingId || '-' }}
              </span>
              <span class="meta-item">
                <el-icon><Clock /></el-icon>
                {{ formatDate(item.preAskTime || item.afterAskTime) }}
              </span>
            </div>

            <!-- 问题内容预览 -->
            <div class="preview-content" v-if="item.preQuestions || item.afterQuestions">
              <p class="preview-text">{{ getPreviewText(item) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页器简化 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 详情页面简化 -->
    <div v-show="showDetail" class="detail-container">
      <!-- 头部导航 -->
      <div class="detail-header">
        <div class="header-left">
          <el-button text @click="backToList">
            <el-icon><Back /></el-icon>返回列表
          </el-button>
          <div class="header-info">
            <span class="title">工单 #{{ currentItem?.s_id }}</span>
            <el-tag :class="['status-tag', getStatusClass(currentItem?.proceStatus)]">
              {{ currentItem?.proceStatus || '待处理' }}
            </el-tag>
          </div>
        </div>
        <div class="header-actions">
          <el-button type="primary" @click="handleSave">保存工单</el-button>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="detail-content">
        <!-- 左侧主要内容 -->
        <div class="main-section">
          <!-- 基本信息卡片 -->
          <div class="detail-card">
            <div class="card-title">
              <span>基本信息</span>
              <el-tag type="info">必填项</el-tag>
            </div>
            <el-form :model="currentItem" label-width="100px" class="detail-form">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item 
                    label="SKU" 
                    required
                    :rules="[{ required: true, message: '请输入SKU' }]"
                  >
                    <el-input 
                      v-model="currentItem.sku" 
                      placeholder="请输入商品SKU编号"
                    >
                      <template #prefix>
                        <el-icon><Document /></el-icon>
                      </template>
                      <template #append>
                        <el-tooltip content="商品唯一标识码" placement="top">
                          <el-icon><QuestionFilled /></el-icon>
                        </el-tooltip>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item 
                    label="订单号"
                    :rules="[{ required: true, message: '请输入订单号' }]"
                  >
                    <el-input 
                      v-model="currentItem.orderNo" 
                      placeholder="请输入订单编号"
                    >
                      <template #prefix>
                        <el-icon><Tickets /></el-icon>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item 
                    label="刊登ID"
                    :rules="[{ required: true, message: '请输入刊登ID' }]"
                  >
                    <el-input 
                      v-model="currentItem.listingId" 
                      placeholder="请输入商品刊登ID"
                    >
                      <template #prefix>
                        <el-icon><Link /></el-icon>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>

          <!-- 售前问题区域 -->
          <div class="detail-card">
            <div class="card-title">
              <span>售前问题记录</span>
              <el-tooltip content="记录客户售前咨询的问题" placement="top">
                <el-icon class="info-icon"><InfoFilled /></el-icon>
              </el-tooltip>
            </div>
            <div class="card-content">
              <div class="time-selector">
                <span class="time-label">询问时间：</span>
                <el-date-picker
                  v-model="currentItem.preAskTime"
                  type="datetime"
                  placeholder="选择售前询问时间"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                />
              </div>
              <div class="editor-section">
                <div class="editor-label">
                  <span>问题内容</span>
                  <el-tag size="small" type="warning">请详细记录客户的问题</el-tag>
                </div>
                <editor v-model="currentItem.preQuestions" :min-height="150" />
              </div>
            </div>
          </div>

          <!-- 售前回复区域 -->
          <div class="detail-card">
            <div class="card-title">售前回复</div>
            <div class="editor-container">
              <editor v-model="currentItem.preResponse" :min-height="150" />
            </div>
          </div>

          <!-- 售后问题区域 -->
          <div class="detail-card">
            <div class="card-title">
              <span>售后问题</span>
              <el-date-picker
                v-model="currentItem.afterAskTime"
                type="datetime"
                placeholder="选择售后询问时间"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                class="time-picker"
              />
            </div>
            <div class="editor-container">
              <editor v-model="currentItem.afterQuestions" :min-height="150" />
            </div>
          </div>

          <!-- 售后回复区域 -->
          <div class="detail-card">
            <div class="card-title">售后回复</div>
            <div class="editor-container">
              <editor v-model="currentItem.afterResponse" :min-height="150" />
            </div>
          </div>
        </div>

        <!-- 右侧信息栏 -->
        <div class="side-section">
          <!-- 工单状态 -->
          <div class="detail-card">
            <div class="card-title">
              <span>工单状态</span>
              <el-tag type="danger">必须设置</el-tag>
            </div>
            <div class="card-content">
              <el-form :model="currentItem" label-width="100px">
                <el-form-item 
                  label="处理状态" 
                  required
                  :rules="[{ required: true, message: '请选择处理状态' }]"
                >
                  <el-select 
                    v-model="currentItem.proceStatus" 
                    style="width: 100%"
                    placeholder="请选择工单处理状态"
                  >
                    <el-option 
                      v-for="(label, value) in {
                        '待处理': '新建工单，等待处理',
                        '处理中': '工单正在处理中',
                        '已完成': '工单处理完成'
                      }"
                      :key="value"
                      :label="value"
                      :value="value"
                    >
                      <span>{{ value }}</span>
                      <span style="color: #999; font-size: 12px; margin-left: 8px">{{ label }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
          </div>

          <!-- 处理信息 -->
          <div class="detail-card">
            <div class="card-title">处理信息</div>
            <div class="card-content">
              <el-form :model="currentItem" label-width="100px">
                <el-form-item label="期望处理时间">
                  <el-date-picker
                    v-model="currentItem.expectTime"
                    type="datetime"
                    placeholder="选择期望处理时间"
                    format="YYYY-MM-DD HH:mm:ss"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    style="width: 100%"
                  />
                </el-form-item>
                <el-form-item label="处理方案">
                  <el-select v-model="currentItem.finalTreatment" style="width: 100%">
                    <el-option label="重发" value="重发" />
                    <el-option label="退款" value="退款" />
                  </el-select>
                </el-form-item>
                <el-form-item label="期望结果">
                  <el-input
                    v-model="currentItem.expectResults"
                    type="textarea"
                    rows="3"
                    placeholder="请输入期望处理结果"
                  />
                </el-form-item>
              </el-form>
            </div>
          </div>

          <!-- 备注信息 -->
          <div class="detail-card">
            <div class="card-title">备注信息</div>
            <div class="card-content">
              <el-form :model="currentItem" label-width="100px">
                <el-form-item label="供应商回复">
                  <el-input
                    v-model="currentItem.supplierResponse"
                    type="textarea"
                    rows="3"
                    placeholder="请输入供应商回复"
                  />
                </el-form-item>
                <el-form-item label="备注1">
                  <el-input
                    v-model="currentItem.remark1"
                    type="textarea"
                    rows="3"
                    placeholder="请输入备注1"
                  />
                </el-form-item>
                <el-form-item label="备注2">
                  <el-input
                    v-model="currentItem.remark2"
                    type="textarea"
                    rows="3"
                    placeholder="请输入备注2"
                  />
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Search, 
  Plus, 
  Back, 
  Clock, 
  Document, 
  Refresh, 
  UserFilled, 
  Link, 
  QuestionFilled, 
  InfoFilled, 
  Tickets 
} from '@element-plus/icons-vue'
import { listTemplate, getTemplate, delTemplate, addTemplate, updateTemplate, exportTemplate } from "@/api/template/template.js"
import Editor from "@/components/Editor"

export default {
  name: "Template",
  components: {
    Search,
    Plus,
    Back,
    Clock,
    Document,
    Refresh,
    UserFilled,
    Link,
    QuestionFilled,
    InfoFilled,
    Tickets,
    Editor
  },
  setup() {
    const loading = ref(false)
    const templateList = ref([])
    const total = ref(0)
    const showDetail = ref(false)  // 添加这个控制详情页显示
    const currentItem = ref({})    // 添加当前选中项
    
    const queryParams = ref({
      pageNum: 1,
      pageSize: 10,
      sku: '',
      orderNo: '',
      listingId: '',
      storeId: '',
      typeQuestion: '',
      processors: '',
      proceStatus: ''
    })

    // 模拟用户数据
    const userOptions = [
      { label: '张三', value: '张三' },
      { label: '李四', value: '李四' },
      { label: '王五', value: '王五' }
    ]

    // 获取头像URL（如果没有实际的头像服务，返回空字符串）
    const getAvatarUrl = (name) => {
      return ''  // 这里可以返回实际的头像URL
    }

    // 获取状态类型
    const getStatusType = (status) => {
      const map = {
        '待处理': 'danger',
        '处理中': 'warning',
        '已处理': 'success',
        '已完成': 'success',
        '待回应': 'info'
      }
      return map[status] || 'info'
    }

    // 格式化日期
    const formatDate = (date) => {
      if (!date) return ''
      return new Date(date).toLocaleDateString()
    }

    // 获取头像初始字母
    const getInitials = (name) => {
      return name ? name.charAt(0).toUpperCase() : '?'
    }

    // 获取列表数据
    const getList = async () => {
      try {
        loading.value = true
        const res = await listTemplate(queryParams.value)
        console.log('获取到的数据:', res) // 调试日志
        if (res.code === 200) {
          templateList.value = res.rows || []
          total.value = res.total || 0
        } else {
          throw new Error(res.msg || '获取数据失败')
        }
      } catch (error) {
        console.error('获取数据失败:', error)
        ElMessage.error(error.message || '获取数据失败')
      } finally {
        loading.value = false
      }
    }

    // 处理搜索
    const handleQuery = () => {
      queryParams.value.pageNum = 1
      console.log('搜索参数:', queryParams.value) // 添加日志
      getList()
    }

    // 处理新增
    const handleAdd = () => {
      currentItem.value = {}  // 清空当前项
      showDetail.value = true // 显示详情页
    }

    // 处理编辑
    const handleUpdate = async (row) => {
      try {
        console.log('编辑行数据:', row) // 调试日志
        currentItem.value = { ...row }  // 使用解构赋值创建新对象
        showDetail.value = true
      } catch (error) {
        console.error('编辑失败:', error)
        ElMessage.error(error.message || '编辑失败')
      }
    }

    // 返回列表
    const backToList = () => {
      showDetail.value = false
      currentItem.value = {}
    }

    // 保存更改
    const handleSave = async () => {
      try {
        const api = currentItem.value.s_id ? updateTemplate : addTemplate
        const res = await api(currentItem.value)
        if (res.code === 200) {
          ElMessage.success('保存成功')
          showDetail.value = false
          getList()
        } else {
          throw new Error(res.msg || '保存失败')
        }
      } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error(error.message || '保存失败')
      }
    }

    // 处理分页
    const handleSizeChange = (val) => {
      queryParams.value.pageSize = val
      getList()
    }

    const handleCurrentChange = (val) => {
      queryParams.value.pageNum = val
      getList()
    }

    // 点击问题项
    const handleIssueClick = (item) => {
      handleUpdate(item)
    }

    // 添加导出方法
    const handleExport = async () => {
      try {
        await exportTemplate(queryParams.value)
        ElMessage.success('导出成')
      } catch (error) {
        console.error('导出失败:', error)
        ElMessage.error('导出失败')
      }
    }

    // 重置查询
    const resetQuery = () => {
      queryParams.value = {
        pageNum: 1,
        pageSize: 10,
        sku: '',
        orderNo: '',
        listingId: '',
        storeId: '',
        typeQuestion: '',
        processors: '',
        proceStatus: ''
      }
      handleQuery()
    }

    // 添加 getPreviewText 方
    const getPreviewText = (item) => {
      if (item.preQuestions) {
        return `售前问题: ${item.preQuestions}`
      }
      if (item.afterQuestions) {
        return `售后问题: ${item.afterQuestions}`
      }
      return '暂无问题描述'
    }

    // 修改状态类型判断方法
    const getStatusClass = (status) => {
      switch(status) {
        case '待处理':
          return 'status-pending'
        case '处理中':
          return 'status-processing'
        case '已处理':
        case '已完成':
          return 'status-completed'
        case '待回应':
          return 'status-waiting'
        default:
          return 'status-default'
      }
    }

    onMounted(() => {
      getList()
    })

    return {
      loading,
      templateList,
      total,
      showDetail,
      currentItem,
      queryParams,
      userOptions,
      getStatusType,
      formatDate,
      getInitials,
      getAvatarUrl,
      handleQuery,
      handleAdd,
      handleUpdate,
      handleSave,
      backToList,
      handleSizeChange,
      handleCurrentChange,
      handleIssueClick,
      handleExport,
      resetQuery,
      getPreviewText,
      getStatusClass
    }
  }
}
</script>

<style scoped>
.app-container {
  padding: 20px;
  background-color: #f5f7fa;
}

.filter-container {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
  margin-bottom: 16px;
}

.search-input {
  width: 220px;
}

.button-group {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

:deep(.el-input__inner) {
  border-radius: 4px;
}

:deep(.el-select) {
  width: 160px;
}

.issue-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0;
  max-width: 1200px;
  margin: 0 auto;
}

.issue-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.issue-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.card-header {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
}

.left-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.right-info {
  display: flex;
  align-items: center;
}

.assignee-info {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border-radius: 20px;
  background: #f0f9ff;
  border: 1px solid #e0f2fe;
  transition: all 0.2s ease;
}

.assignee-info:hover {
  background: #e0f2fe;
  border-color: #bae6fd;
}

.assignee-avatar {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.assignee-name {
  color: #0369a1;
  font-weight: 500;
  font-size: 13px;
}

.unassigned {
  background: #f3f4f6;
  border-color: #e5e7eb;
  color: #6b7280;
  cursor: pointer;
}

.unassigned:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
}

.issue-title {
  font-size: 16px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.store-tag {
  font-weight: normal;
  font-size: 12px;
}

.issue-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6b7280;
  font-size: 13px;
}

.meta-item .el-icon {
  font-size: 14px;
}

.preview-content {
  background: #f9fafb;
  padding: 12px;
  border-radius: 6px;
  margin-top: 8px;
}

.preview-text {
  color: #4b5563;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.status-tag {
  padding: 6px 12px !important;
  border-radius: 16px !important;
  font-weight: 500 !important;
  font-size: 13px !important;
  border: none !important;
  min-width: 80px !important;
  text-align: center !important;
}

.status-pending {
  background: #dc2626 !important;  /* 红色背景 */
  color: white !important;
}

.status-processing {
  background: #eab308 !important;  /* 黄色背景 */
  color: white !important;
}

.status-completed {
  background: #16a34a !important;  /* 绿色背景 */
  color: white !important;
}

.status-waiting {
  background: #2563eb !important;  /* 蓝色背景 */
  color: white !important;
}

.status-default {
  background: #6b7280 !important;  /* 灰色背景 */
  color: white !important;
}

:deep(.el-tag) {
  --el-tag-bg-color: transparent !important;
  --el-tag-border-color: transparent !important;
  --el-tag-hover-color: transparent !important;
}

.sku-text {
  font-weight: 500;
  color: #2563eb;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  max-width: 1200px;
  margin: 20px auto 0;
}

:deep(.el-avatar) {
  background-color: #3b82f6;
  color: #fff;
}

:deep(.el-button--link) {
  padding: 4px 8px;
}

:deep(.el-button--link:hover) {
  background-color: #f3f4f6;
  border-radius: 4px;
}

.detail-container {
  background-color: #f9fafb;
  min-height: 100vh;
}

.detail-header {
  background: #fff;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.detail-content {
  padding: 24px;
  display: flex;
  gap: 24px;
  max-width: 1600px;
  margin: 0 auto;
}

.main-section {
  flex: 1;
  min-width: 0;
}

.side-section {
  width: 380px;
}

.detail-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #f8fafc;
}

.card-title span:first-child {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.card-content {
  padding: 16px;
}

.editor-container {
  padding: 16px;
}

.time-picker {
  width: 220px;
}

/* 表单样式优化 */
.detail-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.detail-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #374151;
}

.detail-form :deep(.el-input__wrapper) {
  box-shadow: none;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.detail-form :deep(.el-input__wrapper:hover) {
  border-color: #3b82f6;
}

.detail-form :deep(.el-input__wrapper.is-focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

/* 富文本编辑器样式 */
:deep(.w-e-text-container) {
  background: #fff !important;
  border: 1px solid #e5e7eb !important;
}

:deep(.w-e-toolbar) {
  border: 1px solid #e5e7eb !important;
  border-bottom: none !important;
  background: #fff !important;
}

:deep(.w-e-text) {
  background: #fff !important;
}

/* 编辑器标签样式 */
.editor-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.editor-label span {
  font-weight: 500;
  color: #374151;
}

/* 时间选择器样式 */
.time-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.time-label {
  font-weight: 500;
  color: #374151;
}

/* 信息图标样式 */
.info-icon {
  color: #3b82f6;
  cursor: help;
}

/* 必填标记样式 */
.required-mark {
  color: #dc2626;
  margin-left: 4px;
}

/* 卡片标题样式优化 */
.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #f8fafc;
}

.card-title span:first-child {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

/* 提示信息样式 */
.field-tip {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

/* 选项说明文本样式 */
.option-description {
  color: #6b7280;
  font-size: 12px;
  margin-left: 8px;
}
</style>
