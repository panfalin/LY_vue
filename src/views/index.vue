<template>
  <div class="dashboard-container">
    <!-- 快捷导航区 -->
    <el-row :gutter="20" class="mb-4">
      <el-col :span="24">
        <el-card class="quick-nav">
          <template #header>
            <div class="card-header">
              <span>快捷导航</span>
              <el-button-group>
                <!--<el-button type="primary" plain @click="customizeShortcuts">-->
                <!--  <el-icon><Setting /></el-icon>-->
                <!--  自定义-->
                <!--</el-button>-->
              </el-button-group>
            </div>
          </template>
          <div class="shortcut-list">
            <el-button
              v-for="item in shortcuts" 
              :key="item.path"
              :type="item.type"
              class="shortcut-item"
              @click="navigateTo(item.path)"
            >
              <el-icon><component :is="item.icon" /></el-icon>
              {{ item.name }}
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 更新日志和功能展示区 -->
    <el-row :gutter="20" class="mb-4">
      <el-col :span="16">
        <el-card class="update-log">
          <template #header>
            <div class="card-header">
              <span>最新更新</span>
              <el-tag type="success">v{{ currentVersion }}</el-tag>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="(update, index) in updateLogs"
              :key="index"
              :timestamp="update.date"
              :type="update.type"
            >
              <h4>{{ update.version }}</h4>
              <ul class="update-list">
                <li v-for="(item, idx) in update.content" :key="idx">
                  {{ item }}
                </li>
              </ul>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="version-detail">
          <template #header>
            <div class="card-header">
              <span>最新版本</span>
              <el-tag type="success">v{{ currentVersion }}</el-tag>
            </div>
          </template>
          <div class="version-content">
            <div class="version-info">
              <div class="version-date">发布时间：2024-03-15</div>
              <div class="version-number">版本号：v2.1.0</div>
            </div>
            
            <div class="update-categories">
              <div class="category">
                <h4><el-icon><Plus /></el-icon> 新增功能</h4>
                <ul>
                  <li>新增需求反馈系统，支持用户提交和跟踪需求</li>
                  <li>新增数据导出功能，支持多种格式导出</li>
                  <li>新增批量操作功能，提升操作效率</li>
                </ul>
              </div>
              
              <div class="category">
                <h4><el-icon><Setting /></el-icon> 功能优化</h4>
                <ul>
                  <li>优化页面加载性能，提升响应速度</li>
                  <li>优化数据展示方式，更直观清晰</li>
                  <li>优化用户操作流程，提升使用体验</li>
                </ul>
              </div>
              
              <div class="category">
                <h4><el-icon><CircleCheck /></el-icon> 问题修复</h4>
                <ul>
                  <li>修复数据统计偶发性计算错误的问题</li>
                  <li>修复在特定情况下页面卡顿的问题</li>
                  <li>修复部分浏览器兼容性问题</li>
                </ul>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 需求反馈区 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="feedback-section">
          <template #header>
            <div class="card-header">
              <span>需求反馈</span>
              <!--<el-button type="primary" @click="createNewIssue">-->
              <!--  <el-icon><Plus /></el-icon>-->
              <!--  提交新需求-->
              <!--</el-button>-->
            </div>
          </template>
          
          <el-tabs v-model="activeTab">
            <el-tab-pane label="我的需求" name="myIssues">
              <el-table :data="myIssues" style="width: 100%">
                <el-table-column prop="id" label="编号" width="80" />
                <el-table-column prop="title" label="标题" min-width="200">
                  <template #default="{ row }">
                    <div :class="{ 'editing-row': isCurrentEditing(row.id) }">
                      <el-icon v-if="isCurrentEditing(row.id)" class="editing-icon"><Edit /></el-icon>
                      {{ row.title }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="priority" label="优先级" width="100">
                  <template #default="{ row }">
                    <el-tag :type="getPriorityType(row.priority)">
                      {{ row.priority }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="100">
                  <template #default="{ row }">
                    <el-tag :type="getStatusType(row.status)">
                      {{ row.status }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column label="操作" width="150" fixed="right">
                  <template #default="{ row }">
                    <el-button-group>
                      <el-button link type="primary" @click="viewIssueDetail(row)">
                        查看
                      </el-button>
                      <el-button link type="primary" @click="editIssue(row)">
                        编辑
                      </el-button>
                    </el-button-group>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            
            <el-tab-pane label="全部需求" name="allIssues">
              <el-table :data="allIssues" style="width: 100%">
                <el-table-column prop="id" label="编号" width="80" />
                <el-table-column prop="title" label="标题" min-width="200" />
                <el-table-column prop="creator" label="提交人" width="120" />
                <el-table-column prop="priority" label="优先级" width="100">
                  <template #default="{ row }">
                    <el-tag :type="getPriorityType(row.priority)">
                      {{ row.priority }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="100">
                  <template #default="{ row }">
                    <el-tag :type="getStatusType(row.status)">
                      {{ row.status }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column label="操作" width="100" fixed="right">
                  <template #default="{ row }">
                    <el-button link type="primary" @click="viewIssueDetail(row)">
                      查看
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Setting, Plus, Document, Search, Edit, 
  Delete, Download, Refresh, Link, Calendar, CircleCheck 
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const router = useRouter()

// 快捷导航数据
const shortcuts = ref([
  { name: '竞品分析', path: '/aliexpress/competition', icon: 'Document', type: 'primary' },
  { name: '数据统计', path: '/aliexpress/statistics', icon: 'TrendCharts', type: 'success' },
  { name: '利润计算', path: '/aliexpress/profit', icon: 'Money', type: 'warning' },
  { name: '类目管理', path: '/aliexpress/category', icon: 'Files', type: 'info' }
])

// 版本更新日志
const currentVersion = ref('2.1.0')
const updateLogs = ref([
  {
    version: 'v2.1.0',
    date: '2024-03-15',
    type: 'success',
    content: [
      '新增需求反馈系统',
      '优化页面加载性能',
      '修复已知问题'
    ]
  },
  {
    version: 'v2.0.0',
    date: '2024-03-01',
    type: 'primary',
    content: [
      '全新的UI设计',
      '增加数据分析功能',
      '支持自定义快捷导航'
    ]
  }
])

// 功能亮点
const statistics = ref([
  {
    title: '今日订单',
    value: 168,
    trend: '+12%',
    status: 'up',
    icon: 'ShoppingCart'
  },
  {
    title: '本月销售额',
    value: '￥286,394',
    trend: '+23.4%',
    status: 'up',
    icon: 'Money'
  },
  {
    title: '产品总数',
    value: 1243,
    trend: '+5',
    status: 'up',
    icon: 'Goods'
  },
  {
    title: '待处理退款',
    value: 12,
    trend: '-2',
    status: 'down',
    icon: 'Warning'
  }
])

// 需求管理相关
const activeTab = ref('myIssues')
const issueDialogVisible = ref(false)
const dialogTitle = ref('新建需求')
const issueFormRef = ref(null)

const issueForm = reactive({
  title: '',
  priority: '',
  type: '',
  assignee: '',
  module: [],
  expectedTime: '',
  tags: [],
  description: '',
  attachments: []
})

const issueRules = {
  title: [{ required: true, message: '请输入需求标题', trigger: 'blur' }],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
  type: [{ required: true, message: '请选择需求类型', trigger: 'change' }],
  assignee: [{ required: true, message: '请选择处理人', trigger: 'change' }],
  module: [{ required: true, message: '请选择关联模块', trigger: 'change' }],
  expectedTime: [{ required: true, message: '请选择期望完成时间', trigger: 'change' }],
  description: [{ 
    required: true, 
    message: '请输入需求描述', 
    trigger: 'blur',
    validator: (rule, value, callback) => {
      if (!value || value.trim() === '<p><br></p>') {
        callback(new Error('请输入需求描述'))
      } else {
        callback()
      }
    }
  }]
}

// 模拟数据
const myIssues = ref([
  {
    id: 'ISS-001',
    title: '希望增加批量导出功能',
    priority: '高',
    status: '处理中',
    createTime: '2024-03-15 10:30:00'
  }
])

const allIssues = ref([
  {
    id: 'ISS-001',
    title: '希望增加批量导出功能',
    creator: '张三',
    priority: '高',
    status: '处理中',
    createTime: '2024-03-15 10:30:00'
  }
])

const userList = ref([
  { userId: 1, nickName: '张三', dept: '研发部', avatar: '' },
  { userId: 2, nickName: '李四', dept: '产品部', avatar: '' },
  // ...
])

const moduleOptions = ref([
  {
    value: 'system',
    label: '系统管理',
    children: [
      { value: 'user', label: '用户管理' },
      { value: 'role', label: '角色管理' }
    ]
  },
  {
    value: 'business',
    label: '业务功能',
    children: [
      { value: 'product', label: '产品管理' },
      { value: 'order', label: '订单管理' }
    ]
  }
])

const tagOptions = ref(['紧急', 'UI相关', '性能优化', '用户反馈'])

// 禁用过去的日期
const disabledDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7
}

// 处理超出附件上传限制
const handleExceed = (files) => {
  ElMessage.warning(`最多只能上传5个文件`)
}

// 方法定义
const navigateTo = (path) => {
  router.push(path)
}

const customizeShortcuts = () => {
  // 实现自定义快捷导航的逻辑
}

const createNewIssue = () => {
  router.push('/issue/create')
}

const editIssue = (row) => {
  router.push(`/issue/edit/${row.id}`)
}

const getPriorityType = (priority) => {
  const types = {
    '高': 'danger',
    '中': 'warning',
    '低': 'info'
  }
  return types[priority] || 'info'
}

const getStatusType = (status) => {
  const types = {
    '待处理': 'info',
    '处理中': 'warning',
    '已完成': 'success',
    '已关闭': 'danger'
  }
  return types[status] || 'info'
}

const refreshStatistics = () => {
  // 这里添加刷新数据的逻辑
  ElMessage.success('数据已更新')
}

onMounted(() => {
  // 页面加载时的初始化逻辑
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  background-color: var(--el-bg-color-page);
  height: calc(100vh - 84px);  /* 减去顶部导航和标签栏的高度 */
  display: flex;
  flex-direction: column;
}

/* 上部分区域自适应 */
.mb-4 {
  margin-bottom: 20px;
  flex-shrink: 0;  /* 防止被压缩 */
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.shortcut-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.shortcut-item {
  min-width: 120px;
}

.update-list {
  margin: 0;
  padding-left: 20px;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  background-color: var(--el-bg-color);
  transition: all 0.3s;
  border: 1px solid var(--el-border-color-lighter);
}

.feature-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 28px;
  padding: 8px;
  border-radius: 8px;
  background-color: var(--el-color-primary-light-9);
}

.feature-info h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
}

.feature-info p {
  margin: 0;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

:deep(.el-timeline-item__content h4) {
  margin: 0 0 8px 0;
  font-size: 16px;
}

:deep(.el-table) {
  margin-top: 12px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.statistics-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.statistics-item {
  padding: 16px;
  border-radius: 8px;
  background-color: var(--el-fill-color-light);
  display: flex;
  align-items: center;
  gap: 12px;
}

.statistics-icon {
  font-size: 24px;
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
  padding: 8px;
  border-radius: 8px;
}

.statistics-info {
  flex: 1;
}

.statistics-title {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-bottom: 4px;
}

.statistics-value {
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.statistics-trend {
  font-size: 12px;
  font-weight: normal;
  padding: 2px 6px;
  border-radius: 4px;
}

.statistics-trend.up {
  color: var(--el-color-success);
  background-color: var(--el-color-success-light-9);
}

.statistics-trend.down {
  color: var(--el-color-danger);
  background-color: var(--el-color-danger-light-9);
}

.version-content {
  height: 300px;  /* 减小高度 */
  overflow-y: auto;
  padding: 8px 16px;
  background-color: var(--el-bg-color);
}

.version-info {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.version-date,
.version-number {
  color: var(--el-text-color-regular);
  line-height: 24px;
  font-size: 14px;
}

.update-categories .category {
  margin-bottom: 20px;
}

.update-categories .category h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px 0;
  font-size: 16px;
  color: var(--el-text-color-primary);
}

.update-categories .category h4 .el-icon {
  font-size: 18px;
  color: var(--el-color-primary);
}

.update-categories ul {
  margin: 0;
  padding-left: 24px;
}

.update-categories li {
  margin-bottom: 8px;
  color: var(--el-text-color-regular);
  line-height: 1.6;
}

.update-categories li:last-child {
  margin-bottom: 0;
}

.update-log .el-timeline {
  height: 300px;  /* 减小高度 */
  overflow-y: auto;
  padding-right: 16px;
}

.update-log .el-timeline::-webkit-scrollbar,
.version-content::-webkit-scrollbar {
  width: 6px;
}

.update-log .el-timeline::-webkit-scrollbar-thumb,
.version-content::-webkit-scrollbar-thumb {
  background-color: var(--el-border-color-lighter);
  border-radius: 3px;
}

.update-log .el-timeline::-webkit-scrollbar-track,
.version-content::-webkit-scrollbar-track {
  background-color: var(--el-fill-color-lighter);
  border-radius: 3px;
}

.update-categories {
  padding-top: 8px;
}

/* 需求反馈区域固定高度 */
.feedback-section {
  flex-shrink: 0;  /* 防止被压缩 */
  margin-top: auto;  /* 推到底部 */
}

/* 需求反馈表格高度限制 */
.el-tabs :deep(.el-table) {
  max-height: 200px;  /* 限制表格高度 */
  overflow-y: auto;
}

/* 修改时间轴样式 */
.update-log :deep(.el-timeline-item__node) {
  z-index: 2;  /* 确保节点在上层 */
}

.update-log :deep(.el-timeline-item__content) {
  padding-left: 25px;  /* 增加内容区域的左边距 */
}

.update-log :deep(.el-timeline-item__timestamp) {
  margin-left: 25px;  /* 增加时间戳的左边距 */
  display: block;  /* 让时间戳独占一行 */
  margin-bottom: 8px;  /* 添加底部间距 */
  color: var(--el-text-color-secondary);
}

.update-log :deep(.el-timeline-item__wrapper) {
  padding-top: 1px;
  padding-left: 28px;  /* 调整整体内容的左边距 */
  position: relative;  /* 添加相对定位 */
}

.update-log :deep(.el-timeline-item__tail) {
  left: 4px;  /* 调整时间轴线的位置 */
}

/* 添加富文本编辑器样式 */
:deep(.ql-container) {
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
}

:deep(.ql-toolbar) {
  line-height: 1;
}

/* 调整对话框的宽度，为富文本编辑器留出足够空间 */
.el-dialog {
  min-width: 700px;
}

/* 添加高亮样式 */
.highlight-row {
  color: var(--el-color-primary);
  font-weight: bold;
  position: relative;
}

.highlight-row::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 16px;
  background-color: var(--el-color-primary);
  border-radius: 2px;
}

.editing-row {
  position: relative;
  padding: 8px 12px;
  margin: -8px -12px;
  background-color: var(--el-color-primary-light-9);
  border-radius: 4px;
  color: var(--el-color-primary);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.editing-icon {
  font-size: 14px;
  color: var(--el-color-primary);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>