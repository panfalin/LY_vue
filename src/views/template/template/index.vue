<template>
  <div class="app-container">
    <!-- 主列表页面 -->
    <div v-show="!showDetail" class="main-container">
      <!-- 搜索区域和工具栏使用sticky定位 -->
      <div class="sticky-header">
        <!-- 搜索区域 -->
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
        
        <!-- 表格工具栏 -->
        <div class="table-toolbar">
          <div class="left-tools">
            <span class="total-count">共 {{ total }} 条数据</span>
          </div>
        </div>
      </div>

      <!-- 表格内容区域 -->
      <div class="scrollable-container">
        <el-table
          v-loading="loading"
          :data="templateList"
          :height="600"
          style="width: 100%"
        >
          <el-table-column label="问题类型" align="left" width="120">
            <template #default="{ row }">
              <el-select 
                v-model="row.typeQuestion"
                size="small"
                style="width: 90px"
                @change="handleTypeChange(row)"
              >
                <el-option label="售前" value="售前" />
                <el-option label="售后" value="售后" />
                <el-option label="订单" value="订单" />
                <el-option label="物流" value="物流" />
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="产品类型" align="center" width="120">
            <template #default="{ row }">
              <el-select 
                v-model="row.productType"
                size="small"
                style="width: 90px"
                @change="handleProductTypeChange(row)"
              >
                <el-option label="灯具" value="灯具" />
                <el-option label="轮胎" value="轮胎" />
                <el-option label="配件" value="配件" />
                <el-option label="其他" value="其他" />
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="状态" align="center" width="70">
            <template #default="{ row }">
              <el-tag
                :class="['status-tag', getStatusClass(row.proceStatus)]"
                size="small"
              >
                {{ row.proceStatus || '待处理' }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="SKU" align="center" prop="sku" width="100" />
          
          <el-table-column label="订单号" align="center" prop="orderNo" width="120" />
          
          <el-table-column label="刊登ID" align="center" prop="listingId" width="120" />

          <el-table-column label="问题内容" align="center" min-width="180">
            <template #default="{ row }">
              <div class="question-content">
                <div v-if="row.preQuestions" class="question-item">
                  <span class="question-label">售前:</span>
                  <span class="question-text">{{ stripHtml(row.preQuestions) }}</span>
                </div>
                <div v-if="row.afterQuestions" class="question-item">
                  <span class="question-label">售后:</span>
                  <span class="question-text">{{ stripHtml(row.afterQuestions) }}</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="询问时间" align="center" width="100">
            <template #default="{ row }">
              {{ formatDate(row.preAskTime || row.afterAskTime) }}
            </template>
          </el-table-column>

          <el-table-column label="处理人" align="center" width="120">
            <template #default="{ row }">
              <el-select 
                v-model="row.processors"
                size="small"
                style="width: 100px"
                @change="handleProcessorChange(row)"
              >
                <template #default>
                  <el-option
                    v-for="user in userOptions"
                    :key="user.value"
                    :label="user.label"
                    :value="user.value"
                  />
                </template>
                <!-- 自定义显示内容 -->
                <template #prefix>
                  <div class="processors-display">
                    <template v-if="row.processors">
                      <el-avatar :size="24" class="assignee-avatar">
                        {{ getInitials(row.processors) }}
                      </el-avatar>
                      <span>{{ row.processors }}</span>
                    </template>
                    <span v-else class="unassigned">未指派</span>
                  </div>
                </template>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="解决方案" align="center" width="120">
            <template #default="{ row }">
              <el-select 
                v-model="row.finalTreatment"
                size="small"
                style="width: 90px"
                @change="handleSolutionChange(row)"
              >
                <el-option label="重发" value="重发" />
                <el-option label="退款" value="退款" />
                <el-option label="补发" value="补发" />
                <el-option label="其他" value="其他" />
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="备注一" align="center" min-width="120">
            <template #default="{ row }">
              <div class="remark-content">{{ stripHtml(row.remark1) || '-' }}</div>
            </template>
          </el-table-column>

          <el-table-column label="备注二" align="center" min-width="120">
            <template #default="{ row }">
              <div class="remark-content">{{ stripHtml(row.remark2) || '-' }}</div>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" width="60" fixed="right">
            <template #default="{ row }">
              <el-button
                link
                type="primary"
                @click.stop="handleUpdate(row)"
              >
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="queryParams.pageNum"
            v-model:page-size="queryParams.pageSize"
            :total="total"
            :page-sizes="[10, 20, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
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
          <el-button type="success" @click="handleComplete" style="margin-right: 12px">
            <el-icon><Check /></el-icon>完成工单
          </el-button>
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
              
              <!-- 新增问题类型行 -->
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item
                      label="问题类型"
                      required
                      :rules="[{ required: true, message: '请选择问题类型' }]"
                  >
                    <el-select
                        v-model="currentItem.typeQuestion"
                        placeholder="请选择问题类型"
                        style="width: 100%"
                    >
                      <el-option label="售前" value="售前" />
                      <el-option label="售后" value="售后" />
                      <el-option label="订单" value="订单" />
                      <el-option label="物流" value="物流" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>

          <!-- 售前问题区域 -->
          <div class="detail-card">
            <div class="card-title">
              <span>���前问题记录</span>
              <el-tooltip content="记录客户售前咨询的问" placement="top">
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
                      placeholder="请选择工处理状态"
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
                <el-form-item label="处理人">
                  <el-select 
                    v-model="currentItem.processors" 
                    style="width: 100%"
                    placeholder="请选择处理人"
                    clearable
                  >
                    <el-option
                      v-for="user in userOptions"
                      :key="user.value"
                      :label="user.label"
                      :value="user.value"
                    />
                  </el-select>
                </el-form-item>

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
  Tickets,
  Check
} from '@element-plus/icons-vue'
import { listTemplate, getTemplate, delTemplate, addTemplate, updateTemplate, exportTemplate, getPeopleList } from "@/api/template/template.js"
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
    Editor,
    Check
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

    // 将userOptions改为ref，以便动态更新
    const userOptions = ref([])
    
    // 添加获取用户列表的方法
    const peopleList = async () => {
      try {
        const res = await getPeopleList(queryParams.value)
        console.log('获取处理人列表响应:', res)
     
          // 根据返回的数据结构重新映射
          userOptions.value = res.map(item => ({
            label: item.nickName,  // 使用 nickName 作为显示标
            value: item.nickName   // 使用 nickName 作为值
          }))
        
          console.log('理后的用户选项:', userOptions.value[0])
       
      } catch (error) {
        console.error('获取理人列表失败:', error)
        ElMessage.error(error.message || '获取处理人列表失')
      }
    }

    // 获取头像URL（如果没有实际的头像服务返回空字符）
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

    // 取头像始字
    const getInitials = (name) => {
      return name ? name.charAt(0).toUpperCase() : '?'
    }

    // 获取列表数据
    const getList = async () => {
      try {
        loading.value = true
        const res = await listTemplate(queryParams.value)
        if (res.code === 200) {
          // 为每行数据添加编辑状态标记
          templateList.value = (res.rows || []).map(row => ({
            ...row,
            isEditingProcessor: false // 添加处理人编辑状态标记
          }))
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
      currentItem.value = {}  // 清空前项
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

// 修改 handleSave 方法
const handleSave = async () => {
  try {
    // 构建完整的提交数据
    const submitData = {
      s_id: currentItem.value.sId,
      sku: currentItem.value.sku,
      pre_questions: currentItem.value.preQuestions,
      pre_response: currentItem.value.preResponse,
      pre_ask_time: currentItem.value.preAskTime,
      after_questions: currentItem.value.afterQuestions,
      after_response: currentItem.value.afterResponse,
      after_ask_time: currentItem.value.afterAskTime,
      supplier_response: currentItem.value.supplierResponse,
      order_no: currentItem.value.orderNo,
      listing_id: currentItem.value.listingId,
      store_id: currentItem.value.storeId,
      type_question: currentItem.value.typeQuestion,
      recorders: currentItem.value.recorders,
      expect_results: currentItem.value.expectResults,
      expect_time: currentItem.value.expectTime,
      processors: currentItem.value.processors,
      proce_status: currentItem.value.proceStatus,
      finals_treatment: currentItem.value.finalTreatment,
      remark1: currentItem.value.remark1,
      remark2: currentItem.value.remark2,
      standard_responses: currentItem.value.standardResponses,
      final_treatment:currentItem.value.finalTreatment
    }

    // 判断是新增还是修改
    const api = submitData.s_id ? updateTemplate : addTemplate
    console.log("api:", submitData.s_id)
    console.log("提交的数据:", submitData) // 添加日志

    const res = await api(submitData)
    
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

    // 处分页
    const handleSizeChange = (val) => {
      queryParams.value.pageSize = val
      getList()
    }

    const handleCurrentChange = (val) => {
      queryParams.value.pageNum = val
      getList()
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

    // 重置查
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

    // 添加完成工单方法
    const handleComplete = async () => {
      try {
        // 更新处理状态为已完成
        currentItem.value.proceStatus = '已完成'
        
        // 调用保存方法
        await handleSave()
        
        ElMessage.success('工单已完成')
      } catch (error) {
        console.error('完成工单失败:', error)
        ElMessage.error(error.message || '完成工单失败')
      }
    }

    // 修改问题类型变更处理方法
    const handleTypeChange = async (row) => {
      try {
        // 构建更新数据,参考编辑时的数据格式
        const updateData = {
          s_id: row.sId,
          sku: row.sku,
          pre_questions: row.preQuestions,
          pre_response: row.preResponse,
          pre_ask_time: row.preAskTime,
          after_questions: row.afterQuestions,
          after_response: row.afterResponse,
          after_ask_time: row.afterAskTime,
          supplier_response: row.supplierResponse,
          order_no: row.orderNo,
          listing_id: row.listingId,
          store_id: row.storeId,
          type_question: row.typeQuestion,
          recorders: row.recorders,
          expect_results: row.expectResults,
          expect_time: row.expectTime,
          processors: row.processors,
          proce_status: row.proceStatus,
          finals_treatment: row.finalTreatment,
          remark1: row.remark1,
          remark2: row.remark2,
          standard_responses: row.standardResponses,
          final_treatment: row.finalTreatment
        }
        
        console.log('更新数据:', updateData) // 添加日志查看数据

        // 调用更新接口
        const res = await updateTemplate(updateData)
        
        if (res.code === 200) {
          ElMessage.success('问题类型更新成功')
        } else {
          throw new Error(res.msg || '新失败')
        }
      } catch (error) {
        console.error('更新问题类型失败:', error)
        ElMessage.error(error.message || '更新问题类型失败')
        // 更新失败时恢复原值
        getList()
      }
    }

    // 添加产品类型变更处理方法
    const handleProductTypeChange = async (row) => {
      try {
        const updateData = {
          s_id: row.sId,
          sku: row.sku,
          pre_questions: row.preQuestions,
          pre_response: row.preResponse,
          pre_ask_time: row.preAskTime,
          after_questions: row.afterQuestions,
          after_response: row.afterResponse,
          after_ask_time: row.afterAskTime,
          supplier_response: row.supplierResponse,
          order_no: row.orderNo,
          listing_id: row.listingId,
          store_id: row.storeId,
          type_question: row.typeQuestion,
          product_type: row.productType, // 新增产品类型字段
          recorders: row.recorders,
          expect_results: row.expectResults,
          expect_time: row.expectTime,
          processors: row.processors,
          proce_status: row.proceStatus,
          finals_treatment: row.finalTreatment,
          remark1: row.remark1,
          remark2: row.remark2,
          standard_responses: row.standardResponses,
          final_treatment: row.finalTreatment
        }
        
        const res = await updateTemplate(updateData)
        
        if (res.code === 200) {
          ElMessage.success('产品类型更新成功')
        } else {
          throw new Error(res.msg || '更新失败')
        }
      } catch (error) {
        console.error('更新产品类型失败:', error)
        ElMessage.error(error.message || '更新产品类型失败')
        getList()
      }
    }

    // 添加解决方案更处理方法
    const handleSolutionChange = async (row) => {
      try {
        const updateData = {
          s_id: row.sId,
          sku: row.sku,
          pre_questions: row.preQuestions,
          pre_response: row.preResponse,
          pre_ask_time: row.preAskTime,
          after_questions: row.afterQuestions,
          after_response: row.afterResponse,
          after_ask_time: row.afterAskTime,
          supplier_response: row.supplierResponse,
          order_no: row.orderNo,
          listing_id: row.listingId,
          store_id: row.storeId,
          type_question: row.typeQuestion,
          product_type: row.productType,
          recorders: row.recorders,
          expect_results: row.expectResults,
          expect_time: row.expectTime,
          processors: row.processors,
          proce_status: row.proceStatus,
          finals_treatment: row.finalTreatment,
          remark1: row.remark1,
          remark2: row.remark2,
          standard_responses: row.standardResponses,
          final_treatment: row.finalTreatment
        }
        
        const res = await updateTemplate(updateData)
        
        if (res.code === 200) {
          ElMessage.success('解决方案更新成功')
        } else {
          throw new Error(res.msg || '更新失败')
        }
      } catch (error) {
        console.error('更新解决方案失败:', error)
        ElMessage.error(error.message || '更新解决方案失败')
        getList()
      }
    }

    // 添加处理人变更处理方法
    const handleProcessorChange = async (row) => {
      try {
        const updateData = {
          s_id: row.sId,
          sku: row.sku,
          pre_questions: row.preQuestions,
          pre_response: row.preResponse,
          pre_ask_time: row.preAskTime,
          after_questions: row.afterQuestions,
          after_response: row.afterResponse,
          after_ask_time: row.afterAskTime,
          supplier_response: row.supplierResponse,
          order_no: row.orderNo,
          listing_id: row.listingId,
          store_id: row.storeId,
          type_question: row.typeQuestion,
          product_type: row.productType,
          recorders: row.recorders,
          expect_results: row.expectResults,
          expect_time: row.expectTime,
          processors: row.processors, // 更新处理人
          proce_status: row.proceStatus,
          finals_treatment: row.finalTreatment,
          remark1: row.remark1,
          remark2: row.remark2,
          standard_responses: row.standardResponses,
          final_treatment: row.finalTreatment
        }
        
        const res = await updateTemplate(updateData)
        
        if (res.code === 200) {
          ElMessage.success('处理人更新成功')
          row.isEditingProcessor = false // 更新成功后关闭编辑状态
        } else {
          throw new Error(res.msg || '更新失败')
        }
      } catch (error) {
        console.error('更新处理人失败:', error)
        ElMessage.error(error.message || '更新处理人失败')
        getList()
      }
    }

    // 添加去除HTML标签的方法
    const stripHtml = (html) => {
      if (!html) return '';
      return html.replace(/<[^>]*>/g, '')  // 移除所有HTML标签
                .replace(/&nbsp;/g, ' ')    // 替换HTML空格
                .replace(/\s+/g, ' ')       // 合并多个空格
                .trim();                    // 去除首尾空格
    }

    onMounted(() => {
      peopleList()  // 先获取处人列表
      getList()     // 再获取主列表据
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
      handleExport,
      resetQuery,
      getPreviewText,
      getStatusClass,
      handleComplete,
      peopleList,
      handleTypeChange,
      handleProductTypeChange,
      handleSolutionChange,
      handleProcessorChange,
      stripHtml
    }
  }
}
</script>

<style scoped>
.app-container {
  padding: 16px;
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
  margin-bottom: 16px;
}

.search-input {
  width: 200px;
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

.table-container {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin: 0 auto;
  width: 100%;
  max-width: 1600px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.processors-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 4px 0;
  cursor: pointer; /* 添加指针样式表明可点击 */
}

.processors-cell:hover {
  background-color: #f3f4f6;
  border-radius: 4px;
}

.assignee-avatar {
  font-size: 12px;
}

.unassigned {
  color: #909399;
}

.question-content {
  text-align: left;
  padding: 4px 8px;
}

.question-item {
  margin-bottom: 4px;
  line-height: 1.4;
  font-size: 12px;
}

.question-text {
  color: #333;
}

:deep(.el-table td) {
  padding: 10px 0;
}

:deep(.el-table th) {
  padding: 12px 0;
  background-color: #f8fafc;
  color: #374151;
  font-weight: 600;
  font-size: 14px;
}

.status-tag {
  padding: 5px 10px !important;
  font-size: 13px !important;
}

.sku-text {
  font-size: 14px;
  font-weight: 500;
}

.pagination-container {
  display: none;
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

/* 选项说明文样式 */
.option-description {
  color: #6b7280;
  font-size: 12px;
  margin-left: 8px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 添加表格工具栏样式 */
.table-toolbar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: #fff;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
}

.left-tools {
  display: flex;
  align-items: center;
  gap: 12px;
}

.right-tools {
  display: none;
}

.total-count {
  font-size: 13px;
  color: #666;
}

/* 修改搜索区域样式 */
.filter-container {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto 16px;
  padding: 24px;
  gap: 18px;
}

/* 移除原有的分页容器样式 */
.pagination-container {
  display: none;
}

/* 调整表格内容区域样式 */
:deep(.el-table) {
  width: 100% !important;
}

:deep(.el-table__body) {
  width: 100% !important;
}

:deep(.el-table__header) {
  width: 100% !important;
}

/* 修改主容器样式 */
.main-container {
  margin-left: 0 !important;
  height: calc(100vh - 30px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 改用sticky定位替代fixed */
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #f5f7fa;
  padding: 20px 20px 0;
}

/* 表格可滚动容器 */
.scrollable-container {
  flex: 1;
  overflow: auto;
  padding: 0 16px;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
}

/* 搜索区域样式 */
.filter-container {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
}

/* 表格工具栏样式 */
.table-toolbar {
  background: #fff;
  padding: 8px 12px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
}

/* 表格容器样式 */
.table-container {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 添加分页器包装样式 */
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 16px;
  background: #fff;
  margin-top: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 优化表格内显示 */
.question-content {
  text-align: left;
  padding: 6px 10px;
}

.question-item {
  margin-bottom: 6px;
  line-height: 1.5;
  font-size: 13px;
}

.question-text {
  color: #333;
  margin-left: 4px;
}

/* 优化处理人单元格样 */
.processors-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 4px 0;
}

.assignee-avatar {
  font-size: 13px;
  background-color: #3b82f6;
}

.unassigned {
  color: #909399;
}

/* 添加表格内下拉框的通用样式 */
:deep(.table-select) {
  width: 90px;
}

:deep(.table-select .el-input__wrapper) {
  padding: 0 8px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}

:deep(.table-select:hover .el-input__wrapper) {
  border-color: #3b82f6;
}

:deep(.table-select .el-input__inner) {
  height: 32px;
  line-height: 32px;
  font-size: 13px;
}

/* 处理人下拉框的特殊样式保持不变 */
.processors-display {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 0;
}

/* 恢复基础下拉框样式 */
:deep(.el-select .el-input__wrapper) {
  padding: 0 8px;
}

:deep(.el-select .el-input__inner) {
  height: 32px;
  line-height: 32px;
}

/* 只为处理人保留特殊样式 */
.processors-display {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 0;
}

/* 处理人头像样式 */
.assignee-avatar {
  font-size: 13px;
  background-color: #3b82f6;
}

.unassigned {
  color: #909399;
}

/* 备注内容样式 */
.remark-content {
  text-align: left;
  padding: 6px 10px;
  white-space: pre-wrap;     /* 允许换行，替换原来的 nowrap */
  word-break: break-word;    /* 在单词内换行 */
  color: #666;
  font-size: 13px;
}

.remark-content:hover {
  white-space: pre-wrap;    /* 保持换行 */
}

/* 状态样式 */
.status-pending {
  background-color: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}

.status-processing {
  background-color: #fffbeb;
  color: #d97706;
  border-color: #fef3c7;
}

.status-completed {
  background-color: #f0fdf4;
  color: #16a34a;
  border-color: #dcfce7;
}

.status-waiting {
  background-color: #f3f4f6;
  color: #4b5563;
  border-color: #e5e7eb;
}

/* 修复处理人下拉框样式 */
:deep(.el-select .el-input__wrapper) {
  background: transparent;
}

:deep(.el-select:hover .el-input__wrapper) {
  border-color: #3b82f6;
}

/* 修改表格表头样式 */
:deep(.el-table th) {
  background-color: #f0f2f5;    /* 稍深的背景色 */
  color: #1a1a1a;              /* 更深的文字颜色 */
  font-weight: 600;            /* 加粗 */
  font-size: 15px;             /* 增大字体 */
  padding: 14px 8px;           /* 增加内边距 */
  border-bottom: 2px solid #e5e7eb;  /* 加粗底部边框 */
  text-transform: none;        /* 防止文字变形 */
}

/* 表头文字对齐 */
:deep(.el-table th > .cell) {
  padding: 0 8px;
  line-height: 1.6;           /* 增加行高 */
  white-space: nowrap;        /* 防止文字换行 */
  color: #1a1a1a;            /* 确保文字颜色一致 */
}

/* 表头hover效果 */
:deep(.el-table th.is-leaf) {
  border-bottom: 2px solid #e5e7eb;  /* 保持底部边框一致 */
}

/* 表头分割线 */
:deep(.el-table__header th.el-table__cell) {
  border-right: 1px solid #ebeef5;  /* 添加右侧分割线 */
}

/* 最后一个表头单元格不显示右边框 */
:deep(.el-table__header th.el-table__cell:last-child) {
  border-right: none;
}

/* 表格单元格样式 */
:deep(.el-table td) {
  padding: 12px 8px;
}

/* 表格hover效果 */
:deep(.el-table tr:hover > td) {
  background-color: #f9fafb !important;
}

/* 表格斑马纹样式 */
:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background-color: #fafafa;
}

/* 表格边框样式 */
:deep(.el-table) {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

/* 表格内容对齐方式 */
:deep(.el-table .cell) {
  padding: 0 8px;
  line-height: 1.5;
}

/* 表头文字对齐 */
:deep(.el-table th > .cell) {
  padding: 0 8px;
  line-height: 1.5;
}

/* 去除表格外边框 */
:deep(.el-table--border) {
  border: none;
}

/* 优化表格内分割线 */
:deep(.el-table--border .el-table__inner-wrapper::after),
:deep(.el-table--border::after) {
  display: none;
}

/* 表格行高度 */
:deep(.el-table__row) {
  height: auto !important;  /* 自适应高度，而不是固定高度 */
  min-height: 48px;        /* 设置最小高度 */
}

/* 调整表格内下拉框样式 */
:deep(.el-select .el-input__wrapper) {
  padding: 0 4px;  /* 减小内边距 */
}

:deep(.el-select .el-input__inner) {
  font-size: 13px;  /* 调整字体大小 */
  height: 28px;     /* 调整高度 */
  line-height: 28px;
}

/* 调整下拉选项样式 */
:deep(.el-select-dropdown__item) {
  padding: 0 8px;  /* 调整选项内边距 */
  height: 32px;    /* 调整选项高度 */
  line-height: 32px;
  font-size: 13px;
}

/* 优化下拉框显示 */
:deep(.el-input__suffix) {
  right: 2px;  /* 调整下拉箭头位置 */
}

:deep(.el-input__suffix-inner) {
  font-size: 12px;  /* 调整下拉箭头大小 */
}

/* 修改表格内容显示样式 */
:deep(.el-table .cell) {
  white-space: pre-wrap !important;  /* 允许内容换行 */
  word-break: break-word;            /* 在单词内换行 */
  line-height: 1.5;
  padding: 0 8px;
}

/* 修改问题内容样式 */
.question-content {
  text-align: left;
  padding: 6px 10px;
}

.question-item {
  margin-bottom: 6px;
  line-height: 1.5;
  font-size: 13px;
  white-space: pre-wrap;     /* 允许换行 */
  word-break: break-word;    /* 在单词内换行 */
}

.question-text {
  color: #333;
  margin-left: 4px;
}

/* 修改备注内容样式 */
.remark-content {
  text-align: left;
  padding: 6px 10px;
  white-space: pre-wrap;     /* 允许换行，替换原来的 nowrap */
  word-break: break-word;    /* 在单词内换行 */
  color: #666;
  font-size: 13px;
}

/* 移除hover时的样式覆盖 */
.remark-content:hover {
  white-space: pre-wrap;    /* 保持换行 */
}

/* 调整表格行高 */
:deep(.el-table__row) {
  height: auto !important;  /* 自适应高度，而不是固定高度 */
  min-height: 48px;        /* 设置最小高度 */
}
</style>
