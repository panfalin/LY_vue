<template>
  <div class="chat-container">
    <!-- 左侧消息列表 -->
    <div class="message-sidebar">
      <!-- 搜索框 -->
      <div class="search-box">
        <el-input
          v-model="searchQuery"
          placeholder="搜索消息..."
          prefix-icon="Search"
          clearable
        />
      </div>
      
      <!-- 消息列表 -->
      <div class="message-list">
        <el-scrollbar>
          <div
            v-for="msg in filteredMessages"
            :key="msg.id"
            class="message-item"
            :class="{ active: currentMessage?.id === msg.id }"
            @click="selectMessage(msg)"
          >
            <div class="message-avatar">
              <el-avatar :size="40">{{ getInitials(msg.customerName) }}</el-avatar>
            </div>
            <div class="message-info">
              <div class="message-header">
                <span class="customer-name">{{ msg.customerName }}</span>
                <span class="message-time">{{ formatTime(msg.lastTime) }}</span>
              </div>
              <div class="store-name">{{ msg.storeName }}</div>
              <div class="message-preview">{{ msg.lastMessage }}</div>
            </div>
            <div class="message-status" v-if="msg.unreadCount">
              <el-badge :value="msg.unreadCount" class="unread-badge" />
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>

    <!-- 中间聊天区域 -->
    <div class="chat-main">
      <!-- 聊天头部 -->
      <div class="chat-header">
        <div class="chat-title">
          <span class="customer-name">{{ currentMessage?.customerName }}</span>
          <span class="store-tag">{{ currentMessage?.storeName }}</span>
        </div>
        <div class="chat-tools">
          <el-button-group>
            <el-button icon="Refresh">刷新</el-button>
            <el-button icon="Delete">清空</el-button>
          </el-button-group>
        </div>
      </div>

      <!-- 聊天内容区域 -->
      <div class="chat-content" ref="chatContent">
        <el-scrollbar>
          <div class="chat-messages">
            <div
              v-for="msg in chatMessages"
              :key="msg.id"
              :class="['message-bubble', msg.isCustomer ? 'customer' : 'service']"
            >
              <div class="message-avatar">
                <el-avatar :size="32">
                  {{ msg.isCustomer ? getInitials(currentMessage?.customerName) : 'CS' }}
                </el-avatar>
              </div>
              <div class="message-content">
                <div class="message-text" v-html="msg.content"></div>
                <div class="message-time">{{ formatTime(msg.time) }}</div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>

      <!-- 聊天输入区域 -->
      <div class="chat-input">
        <div class="input-toolbar">
          <el-button-group>
            <el-button icon="Picture">图片</el-button>
            <el-button icon="Files">文件</el-button>
            <el-button icon="ChatDotSquare">快捷回复</el-button>
          </el-button-group>
        </div>
        <div class="input-area">
          <el-input
            v-model="messageInput"
            type="textarea"
            :rows="3"
            placeholder="输入消息..."
            @keyup.enter.ctrl="sendMessage"
          />
        </div>
        <div class="input-actions">
          <el-button type="primary" @click="sendMessage">发送消息</el-button>
        </div>
      </div>
    </div>

    <!-- 右侧用户信息 -->
    <div class="user-sidebar">
      <!-- 用户基本信息 -->
      <div class="user-info-card">
        <div class="card-header">
          <h3>客户信息</h3>
        </div>
        <div class="user-details">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="客户ID">{{ currentUser?.id }}</el-descriptions-item>
            <el-descriptions-item label="姓名">{{ currentUser?.name }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ currentUser?.email }}</el-descriptions-item>
            <el-descriptions-item label="注册时间">{{ formatDate(currentUser?.registerTime) }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <!-- 订单历史 -->
      <div class="order-history-card">
        <div class="card-header">
          <h3>历史订单</h3>
        </div>
        <el-table :data="orderHistory" style="width: 100%" size="small">
          <el-table-column prop="orderId" label="订单号" width="120" />
          <el-table-column prop="amount" label="金额" width="80" />
          <el-table-column prop="status" label="状态">
            <template #default="{ row }">
              <el-tag :type="getOrderStatusType(row.status)">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 状态数据
const searchQuery = ref('')
const messageInput = ref('')
const currentMessage = ref(null)
const chatMessages = ref([])
const currentUser = ref(null)
const orderHistory = ref([])

// 模拟消息列表数据
const messageList = ref([
  {
    id: 1,
    customerName: '张三',
    storeName: '速卖通店铺A',
    lastMessage: '请问这个产品什么时候发货？',
    lastTime: new Date(),
    unreadCount: 2
  },
  // ... 更多消息
])

// 计算属性：过滤后的消息列表
const filteredMessages = computed(() => {
  if (!searchQuery.value) return messageList.value
  return messageList.value.filter(msg => 
    msg.customerName.includes(searchQuery.value) ||
    msg.storeName.includes(searchQuery.value) ||
    msg.lastMessage.includes(searchQuery.value)
  )
})

// 方法
const selectMessage = (message) => {
  currentMessage.value = message
  loadChatHistory(message.id)
  loadUserInfo(message.id)
}

const loadChatHistory = (messageId) => {
  // 模拟加载聊天记录
  chatMessages.value = [
    {
      id: 1,
      content: '您好，请问有什么可以帮您？',
      time: new Date(),
      isCustomer: false
    },
    // ... 更多聊天记录
  ]
}

const loadUserInfo = (messageId) => {
  // 模拟加载用户信息
  currentUser.value = {
    id: '123456',
    name: '张三',
    email: 'zhangsan@example.com',
    registerTime: new Date()
  }
  
  // 模拟加载订单历史
  orderHistory.value = [
    {
      orderId: 'ORDER123',
      amount: 199.99,
      status: '已完成'
    },
    // ... 更多订单
  ]
}

const sendMessage = () => {
  if (!messageInput.value.trim()) return
  
  chatMessages.value.push({
    id: Date.now(),
    content: messageInput.value,
    time: new Date(),
    isCustomer: false
  })
  
  messageInput.value = ''
  scrollToBottom()
}

// 工具方法
const getInitials = (name) => name ? name.charAt(0) : '?'

const formatTime = (date) => {
  if (!date) return '';
  const now = new Date();
  const messageDate = new Date(date);
  const diff = now - messageDate;
  
  // 小于1分钟
  if (diff < 60000) {
    return '刚刚';
  }
  // 小于1小时
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`;
  }
  // 小于24小时
  if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`;
  }
  // 大于24小时
  return messageDate.toLocaleDateString();
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const getOrderStatusType = (status) => {
  const statusMap = {
    '已完成': 'success',
    '待发货': 'warning',
    '已取消': 'danger'
  }
  return statusMap[status] || 'info'
}

const scrollToBottom = () => {
  const content = document.querySelector('.chat-content .el-scrollbar__wrap')
  if (content) {
    setTimeout(() => {
      content.scrollTop = content.scrollHeight
    }, 100)
  }
}
</script>

<style scoped>
.chat-container {
  display: flex;
  height: calc(100vh - 50px);
  background-color: #f5f7fa;
}

/* 左侧消息列表样式 */
.message-sidebar {
  width: 300px;
  border-right: 1px solid #dcdfe6;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.search-box {
  padding: 16px;
  border-bottom: 1px solid #dcdfe6;
}

.message-list {
  flex: 1;
  overflow: hidden;
}

.message-item {
  display: flex;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s;
  border-bottom: 1px solid #ebeef5;
}

.message-item:hover {
  background-color: #f5f7fa;
}

.message-item.active {
  background-color: #ecf5ff;
}

.message-info {
  flex: 1;
  margin-left: 12px;
  overflow: hidden;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.customer-name {
  font-weight: 500;
  color: #303133;
}

.store-name {
  font-size: 13px;
  color: #909399;
  margin-bottom: 4px;
}

.message-preview {
  font-size: 13px;
  color: #606266;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 中间聊天区域样式 */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  margin: 0 1px;
}

.chat-header {
  padding: 16px;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.store-tag {
  padding: 2px 8px;
  background-color: #f0f2f5;
  border-radius: 4px;
  font-size: 12px;
  color: #606266;
}

.chat-content {
  flex: 1;
  overflow: hidden;
  padding: 20px;
}

.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-bubble {
  display: flex;
  gap: 12px;
  max-width: 80%;
}

.message-bubble.customer {
  margin-right: auto;
}

.message-bubble.service {
  margin-left: auto;
  flex-direction: row-reverse;
}

.message-content {
  background-color: #f4f4f5;
  padding: 12px;
  border-radius: 8px;
  position: relative;
}

.service .message-content {
  background-color: #ecf5ff;
}

.message-text {
  color: #303133;
  line-height: 1.5;
}

.message-time {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.chat-input {
  border-top: 1px solid #dcdfe6;
  padding: 16px;
}

.input-toolbar {
  margin-bottom: 12px;
}

.input-actions {
  margin-top: 12px;
  text-align: right;
}

/* 右侧用户信息样式 */
.user-sidebar {
  width: 300px;
  border-left: 1px solid #dcdfe6;
  background-color: #fff;
  padding: 16px;
  overflow-y: auto;
}

.user-info-card,
.order-history-card {
  background-color: #fff;
  border-radius: 4px;
  margin-bottom: 16px;
}

.card-header {
  padding: 12px 16px;
  border-bottom: 1px solid #dcdfe6;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.user-details {
  padding: 16px;
}

/* 工具类 */
.unread-badge :deep(.el-badge__content) {
  background-color: #f56c6c;
}
</style>