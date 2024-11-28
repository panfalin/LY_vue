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
      
      <!-- 在搜索框下方添加筛选选项 -->
      <div class="filter-options">
        <!-- 消息状态筛选 -->
        <el-radio-group 
          v-model="filterStatus" 
          size="small"
          @change="handleStatusChange"
        >
          <el-radio-button label="all">全部消息</el-radio-button>
          <el-radio-button label="unread">未读消息</el-radio-button>
          <el-radio-button label="read">已读消息</el-radio-button>
        </el-radio-group>
        
        <!-- 店铺筛选 -->
        <el-select
          v-model="filterShop"
          placeholder="请选择店铺"
          clearable
          style="width: 100%"
          filterable
          size="small"
          @change="handleStoreChange"
        >
          <el-option
            v-for="storeName in storeOptionNames"
            :key="storeName.value"
            :label="storeName.label"
            :value="storeName.label"
          />
        </el-select>
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
              <el-avatar 
                :size="40" 
                :src="msg.avatarUrl"
              >
                {{ getInitials(msg.customerName) }}
              </el-avatar>
            </div>
            <div class="message-info">
              <div class="message-header">
                <div class="customer-info">
                  <span class="customer-name">{{ msg.customerName }}</span>
                  <span class="customer-number">#{{ msg.clientNumber }}</span>
                </div>
                <span class="message-time">{{ formatTime(msg.lastTime) }}</span>
              </div>
              <div class="store-info">
                <el-tag size="small" type="info">{{ msg.storeName }}</el-tag>
                <span class="message-count" v-if="msg.messageCount">
                  {{ msg.messageCount }}条消息
                </span>
              </div>
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
                  {{ msg.isCustomer ? getInitials(msg.senderId) : getInitials(msg.receiverId) }}
                </el-avatar>
              </div>
              <div class="message-content">
                <div class="message-sender">{{ msg.isCustomer ? msg.senderId : msg.receiverId }}</div>
                <div class="message-text">{{ msg.content }}</div>
                <div class="message-time">
                  {{ formatTime(msg.time) }}
                  <span class="message-status">{{ msg.isRead }}</span>
                </div>
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
            <el-descriptions-item label="电话">{{ currentUser?.phone }}</el-descriptions-item>
            <el-descriptions-item label="国家/地区">{{ currentUser?.country }}</el-descriptions-item>
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
import { ref, computed, onMounted } from 'vue'

import { listClient, getClient } from '@/api/aliexpress/client'
import { listMessage, updateMessageRead, getMessage } from '@/api/aliexpress/message'
import { listStores } from "@/api/products/products"

// 状态数据
const searchQuery = ref('')
const messageInput = ref('')
const currentMessage = ref(null)
const chatMessages = ref([])
const currentUser = ref(null)
const orderHistory = ref([])

// 移除模拟数据,改用ref空数组
const messageList = ref([])

// 筛选状态
const filterStatus = ref('all')
const filterShop = ref('')

// 店铺列表
const shopList = ref([])

// 店铺选项数据
const storeOptionNames = ref([])

// 添加一个变量记录当前选中的用户ID和处理状态
const currentProcessing = ref({
  clientId: null,
  processing: false
})

// 格式化店铺数据方法
const formatStoresname = (stores) => {
  return stores.map(store => ({
    value: store.storeId,
    label: store.storeName
  }))
}

// 获取店铺列表的方法
const getStoreList = async () => {
  try {
    const res = await listStores()
    if (res.rows) {
      storeOptionNames.value = formatStoresname(res.rows)
      console.log("storeOptionNames.value====>", storeOptionNames.value)
    }
  } catch (error) {
    console.error('获取店铺列表失败:', error)
  }
}

// 修改获取消息列表的方法
const getMessageList = async (storeId = '', readStatus = '') => {
  try {
    const params = {
      pageNum: 1,
      pageSize: 10,
      storeName: storeId,
      isRead: readStatus
    }
    console.log("请求参数:", params)
    const res = await listClient(params)
    
    if (res.code === 200) {
      messageList.value = res.rows.map(msg => ({
        id: msg.messageId,
        clientId: msg.clientId,
        customerName: msg.clientName || '未知用户',
        clientNumber: msg.clientNumber,
        email: msg.email,
        storeName: msg.storeName || '速卖通店铺',
        storeId: msg.shopId,
        lastMessage: msg.messageContent || '暂无消息',
        messageCount: msg.messageCount || 0,
        unreadCount: msg.unreadCount || 0,
        lastTime: msg.updateTime || msg.createTime,
        avatarUrl: msg.avatarUrl,
        isRead: msg.isRead
      }))
      console.log("处理后的消息列表:", messageList.value)
    }
  } catch (error) {
    console.error('获取消息列表失败:', error)
  }
}

// 修改消息状态变更处理方法
const handleStatusChange = (value) => {
  filterStatus.value = value
  let readStatus = ''
  
  // 根据选择的状态设置参数
  switch(value) {
    case 'unread':
      readStatus = '未读'
      break
    case 'read':
      readStatus = '已读'
      break
    default:
      readStatus = ''
  }
  
  // 重新获取消息列表
  getMessageList(filterShop.value, readStatus)
}

// 修改店铺选择变更处理方法
const handleStoreChange = (value) => {
  filterShop.value = value
  
  // 获取当前消息状态
  let readStatus = ''
  switch(filterStatus.value) {
    case 'unread':
      readStatus = '0'
      break
    case 'read':
      readStatus = '1'
      break
  }
  
  // 重新获取消息列表，同时传入消息状态
  getMessageList(value, readStatus)
}

// 修改初始化加载
onMounted(() => {
  getStoreList() // 先获取店铺列表
  getMessageList() // 再获取消息列表
})

// 移除或简化原有的过滤计算属性，因为现在完全依赖后端过滤
const filteredMessages = computed(() => {
  let result = messageList.value

  // 只保留关键词搜索功能
  if (searchQuery.value) {
    const keyword = searchQuery.value.toLowerCase()
    result = result.filter(msg => 
      msg.customerName.toLowerCase().includes(keyword) ||
      msg.email?.toLowerCase().includes(keyword) ||
      msg.lastMessage.toLowerCase().includes(keyword)
    )
  }

  return result
})

// 方法
const selectMessage = async (message) => {
  // 如果正在处理同一个用户的请求，则直接返回
  if (currentProcessing.value.processing && currentProcessing.value.clientId === message.clientId) {
    return
  }

  try {
    // 设置当前正在处理的用户和状态
    currentProcessing.value = {
      clientId: message.clientId,
      processing: true
    }

    currentMessage.value = message
    console.log("message====>", message)
    // 直接使用消息列表中的用户信息更新右侧面板
    currentUser.value = {
      id: message.clientId,
      name: message.customerName,
      email: message.email,
      phone: message.clientNumber || '暂无',
      country: message.country || '暂无',
      registerTime: message.lastTime
    }

    // 调用修改消息接口，更新消息状态
    if(message.lastMessage !== '暂无消息') {
      await updateMessageRead({
        senderId: message.clientId,  // 用户ID
        shopId: message.storeName,    // 店铺名
        isRead: '已读'                   // 设置为已读
      })
    }

    // 加载聊天记录
    loadChatHistory(message.id)
    
    // 更新完状态后重新获取消息列表
    getMessageList(filterShop.value)
  } catch (error) {
    //console.error('获取用户订单失败:', error)
  } finally {
    // 处理完成后重置状态
    currentProcessing.value = {
      clientId: null,
      processing: false
    }
  }
}

// 修改加载聊天记录的方法
const loadChatHistory = async (messageId) => {
  try {
    // 确保必要的参数存在
    if (!currentMessage.value?.clientId || !currentMessage.value?.storeName) {
      console.log("缺少必要参数:", {
        senderId: currentMessage.value?.clientId,
        shopId: currentMessage.value?.storeName
      })
      return
    }

    // 直接传入senderId和shopId作为路径参数
    const res = await getMessage(
      currentMessage.value.clientId.toString(),
      currentMessage.value.storeName.toString()
    )
    
    console.log("获取聊天记录参数:", {
      senderId: currentMessage.value.clientId,
      shopId: currentMessage.value.storeName
    })
    console.log("获取到的聊天记录响应:", res.rows)
    
 
      // 将后端返回的聊天记录映射为前端需要的格式
      chatMessages.value = res.rows.map(msg => ({
        id: msg.messageId,
        content: msg.messageContent || '',
        time: msg.sendTime,
        // 判断是否为客户消息：发送者ID是否为当前选中的客户
        isCustomer: msg.senderId === currentMessage.value.clientId,
        senderName: msg.senderId || '', // 使用senderId作为发送者名称
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        isRead: msg.isRead,
        shopId: msg.shopId,
        updateTime: msg.updateTime
      }))
      
      console.log("处理后的聊天记录:", chatMessages.value)
      scrollToBottom()

  } catch (error) {
    console.error('获取聊天记录失败:', error)
    chatMessages.value = []
  }
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
  if (!date) return ''
  
  const now = new Date()
  const messageDate = new Date(date)
  const diff = now - messageDate
  
  // 转换为分钟
  const minutes = Math.floor(diff / 1000 / 60)
  // 转换为小时
  const hours = Math.floor(minutes / 60)
  // 转换为天
  const days = Math.floor(hours / 24)
  
  if (minutes < 1) {
    return '刚刚'
  } else if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 30) {
    return `${days}天前`
  } else {
    return messageDate.toLocaleDateString()
  }
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

.customer-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.customer-number {
  font-size: 12px;
  color: #909399;
}

.custom-field {
  color: #409eff;
  margin-right: 8px;
  font-size: 12px;
}

.message-preview {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #606266;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.filter-options {
  padding: 12px;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-options :deep(.el-radio-group) {
  display: flex;
  width: 100%;
}

.filter-options :deep(.el-radio-button) {
  flex: 1;
}

.filter-options :deep(.el-radio-button__inner) {
  width: 100%;
}

.filter-options :deep(.el-select) {
  width: 100%;
}

.message-sender {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.message-status {
  margin-left: 8px;
  font-size: 12px;
  color: #909399;
}

.message-content {
  position: relative;
  padding: 12px;
  border-radius: 8px;
  max-width: 400px;
}

.customer .message-content {
  background-color: #e1f3ff;
}

.service .message-content {
  background-color: #f4f4f5;
}
</style>