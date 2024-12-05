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
                  {{ msg.isCustomer ? getInitials(msg.senderId) : '客服' }}
                </el-avatar>
              </div>
              <div class="message-content">
                <div
                    class="message-text"
                    v-html="formatMessageContent(msg.content)"
                    @click="handleImageClick"
                ></div>
                <div class="message-time">
                  {{ formatTime(msg.time) }}
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
            <el-upload
                ref="imageUploadRef"
                :show-file-list="false"
                accept="image/*"
                :before-upload="handleImageUpload"
            >
              <el-button icon="Picture">图片</el-button>
            </el-upload>
          </el-button-group>
        </div>

        <!-- 修改输入框部分 -->
        <div class="editor-container">
          <!-- 添加一个隐藏的输入框用于存储实际内容 -->
          <el-input
              v-model="messageInput"
              type="hidden"
          />
          <!-- 添加一个可编辑的div来显示内容 -->
          <div
              ref="editableDiv"
              class="editable-div"
              contenteditable="true"
              @input="handleInput"
              @paste="handlePaste"
              placeholder="请输入消息..."
          ></div>
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
        <div class="order-list">
          <div v-for="order in orderHistory" :key="order.orderId" class="order-item">
            <div class="order-header">
              <span class="order-id">订单号: {{ order.orderId }}</span>
              <el-tag
                  :type="getOrderStatusType(order.status)"
                  size="small"
              >
                {{ order.status }}
              </el-tag>
            </div>
            <div class="order-content">
              <!-- 添加产品信息区域 -->
              <div class="product-info">
                <el-image
                    class="product-image"
                    :src="order.productImage"
                    fit="cover"
                    :preview-src-list="[order.productImage]"
                >
                  <template #error>
                    <div class="image-placeholder">
                      <el-icon><Picture /></el-icon>
                    </div>
                  </template>
                </el-image>
                <div class="product-details">
                  <div class="product-name">{{ order.productName }}</div>
                </div>
              </div>
              <div class="order-info">
                <div class="order-amount">
                  <span class="label">金额:</span>
                  <span class="value">{{ order.amount }}</span>
                </div>
                <div class="order-time">
                  <span class="label">时间:</span>
                  <span class="value">{{ formatTime(order.createTime) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改图片预览组件 -->
    <el-image-viewer
        v-if="showImageViewer"
        :url-list="[previewImageUrl]"
        :initial-index="0"
        @close="closeImageViewer"
        :on-switch="handleSwitch"
        hide-on-click-modal
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

import { listClient, getClient } from '@/api/aliexpress/client'
import { listMessage, updateMessageRead, getMessage,addMessage,listMessageUnread } from '@/api/aliexpress/message'
import { listStores } from "@/api/products/products"
import request from '@/utils/request'
import { ElImageViewer } from 'element-plus'
import { getOrder } from '@/api/aliexpress/order'

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
      pageSize: 9999, // 设置一个足够大的数字来获取所有消息
      storeName: storeId,
      isRead: readStatus
    }
    console.log("params====>", params)
    const [res, resUnread] = await Promise.all([
      listClient(params),
      listMessageUnread(params)
    ])
    console.log("res====>", res)
    if (res.code === 200) {
      const newList = res.rows.map(msg => {
        const unreadInfo = resUnread.rows?.find(
            unread => unread.clientId === msg.clientId &&
                unread.storeName === msg.storeName
        )

        return {
          id: msg.messageId,
          clientId: msg.clientId,
          customerName: msg.clientName || '未知用户',
          clientNumber: msg.clientNumber,
          email: msg.email,
          storeName: msg.storeName || '速卖通店铺',
          storeId: msg.shopId,
          lastMessage: msg.messageContent || '暂无消息',
          messageCount: msg.messageCount || 0,
          unreadCount: unreadInfo?.unreadCount || 0,
          lastTime:  msg.createdTime,
          avatarUrl: msg.avatarUrl,
          isRead: msg.isRead
        }
      })
      console.log("newList====>", newList)
      // 直接更新消息列表
      messageList.value = newList
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
  console.log("message.clientId====>", message.clientId)
  // 如果正在处理同一个用户的请求，则直接返回
  if (currentProcessing.value.processing && currentProcessing.value.clientId === message.clientId) {
    return
  }

  try {
    currentProcessing.value = {
      clientId: message.clientId,
      processing: true
    }

    currentMessage.value = message
    console.log("message====>", message)
    // 直接使用消息列表的用户信息更新右侧面板
    currentUser.value = {
      id: message.clientId,
      name: message.customerName,
      email: message.email,
      phone: message.clientNumber || '暂无',
      country: message.country || '暂无',
      registerTime: message.lastTime
    }

    // 获取订单数据
    try {
      const res = await getOrder(message.clientId, message.storeName)
      console.log("res====>", res)
      // 处理订单数据
      orderHistory.value = res.rows.map(order => ({
        orderId: order.orderId,
        amount: order.orderAmount,
        status: order.orderStatus,
        createTime: order.createdTime,
        productName: order.produceName || '未知商品',
        productImage: order.producePicture || ''  // 如果没有图片则使用空字符串
      }))
    } catch (error) {
      console.error('获取订单数据出错:', error)
      orderHistory.value = [] // 出错时清空订单列表
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
    await loadChatHistory(message.id)

    // 开始轮询
    startPolling()

    // 更新完状态后重新获取消息列表
    getMessageList(filterShop.value)

  } catch (error) {
    console.error('获取用户信息失败:', error)
  } finally {
    // 处理完成后重置状态
    currentProcessing.value = {
      clientId: null,
      processing: false
    }
  }
}

// 添加一个工具方法来生成消息ID
const generateMessageId = (senderId, receiverId) => {
  // 将两个ID按字符串大小排序
  const [smaller, bigger] = [senderId, receiverId].sort()
  // 用下划线连接
  return `${smaller}_${bigger}`
}

// 使用 Element Plus 富文本编辑器配置
const editorConfig = {
  placeholder: '请输入内容',
  height: 150
}

// 添加图片预览相关的状态
const showImageViewer = ref(false)
const previewImageUrl = ref('')

// 添加关闭预览的方法
const closeImageViewer = () => {
  showImageViewer.value = false
  previewImageUrl.value = ''
}

// 修改图片点击预览方法
const handleImageClick = (event) => {
  const img = event.target.closest('img')
  if (img) {
    previewImageUrl.value = img.src
    showImageViewer.value = true
  }
}

// 可选：添加切换图片的处理方法
const handleSwitch = (index) => {
  console.log('切换到图片:', index)
}

// 添加可编辑div的引用
const editableDiv = ref(null)

// 处理输入事件
const handleInput = (e) => {
  messageInput.value = e.target.innerHTML
}

// 处理粘贴事件，防止粘贴带格式的内容
const handlePaste = (e) => {
  e.preventDefault()
  const text = e.clipboardData.getData('text/plain')
  document.execCommand('insertText', false, text)
}

// 修改图片上传处理方法
const handleImageUpload = async (file) => {
  const isImage = file.type.indexOf('image/') !== -1
  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }

  // 创建 FormData 对象
  const formData = new FormData()
  formData.append('file', file)

  try {
    // 手动上传文件
    const res = await request({
      url: '/common/upload',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (res.code === 200) {
      // 获取图片URL
      const imgUrl = import.meta.env.VITE_APP_BASE_API + res.fileName
      // 构造图片HTML
      const imgHtml = `<img src="${imgUrl}" style="max-width:200px;" />`

      // 将图片插入到可编辑div中
      document.execCommand('insertHTML', false, imgHtml)
      // 同步内容到messageInput
      messageInput.value = editableDiv.value.innerHTML
    } else {
      ElMessage.error('图片上传失败')
    }
  } catch (error) {
    console.error('图片上传失败:', error)
    ElMessage.error('图片上传失败')
  }

  return false
}

// 修改发送消息方法
const sendMessage = async () => {
  if (!messageInput.value.trim()) return

  try {
    const senderId = '客服'
    const receiverId = currentMessage.value.clientId

    // 获取当前时间，并调整为东八区
    debugger
    const now = new Date()
    // 使用 toLocaleString 获取本地时间字符串，指定为中国时区
    const currentTime = now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '-') // 将斜杠替换为横杠

    console.log("currentTime====>", currentTime) // 本地时间，格式：YYYY-MM-DD HH:mm:ss

    // 构造发送消息的参数
    const messageData = {
      senderId: senderId,
      receiverId: receiverId,
      shopId: currentMessage.value.storeName,
      messageContent: messageInput.value,
      sendTime: currentTime, // 使用本地时间
      isRead: '已读',
      conversationId: generateMessageId(senderId, receiverId)
    }

    const res = await addMessage(messageData)

    // 发送成功后，将消息添加到聊天记录中
    chatMessages.value.push({
      content: messageInput.value,
      time: messageData.sendTime,
      isCustomer: false,
      senderId: messageData.senderId,
      receiverId: messageData.receiverId,
      isRead: messageData.isRead,
      id: messageData.messageId
    })

    // 清空输入框和可编辑div的内容
    messageInput.value = ''
    editableDiv.value.innerHTML = ''

    scrollToBottom()
  } catch (error) {
    console.error('发送消息失败:', error)
  }
}

// 添加轮询间隔时间常量（毫秒）
const POLLING_INTERVAL = 3000 // 3秒

// 添加轮询定时器引用
const pollingTimer = ref(null)

// 添加新消息时间戳，用于优化请求
const lastUpdateTime = ref(null)

// 修改轮询方法，同时更新消息列表和聊天记录
const startPolling = () => {
  // 先清除可能存在的定时器
  stopPolling()

  // 设置新的定时器
  pollingTimer.value = setInterval(async () => {
    if (currentMessage.value?.clientId && currentMessage.value?.storeName) {
      // 同时更新消息列表和聊天记录
      await Promise.all([
        loadChatHistory(),
        getMessageList(filterShop.value, filterStatus.value === 'unread' ? '未读' :
            filterStatus.value === 'read' ? '已读' : '')
      ])
    }
  }, POLLING_INTERVAL)
}

// 添加停止轮询的方法
const stopPolling = () => {
  if (pollingTimer.value) {
    clearInterval(pollingTimer.value)
    pollingTimer.value = null
  }
}

// 在组件卸载时清除定时器
onUnmounted(() => {
  stopPolling()
})

// 修改加载聊天记录的方法，优化更新逻辑
const loadChatHistory = async (messageId) => {
  try {
    if (!currentMessage.value?.clientId || !currentMessage.value?.storeName) {
      return
    }

    const res = await getMessage(
        currentMessage.value.clientId.toString(),
        currentMessage.value.storeName.toString()
    )

    if (res.rows && res.rows.length > 0) {
      const newMessages = res.rows.map(msg => ({
        id: generateMessageId(msg.senderId, msg.receiverId),
        content: msg.messageContent || '',
        time: msg.sendTime,
        isCustomer: msg.senderId === currentMessage.value.clientId,
        senderName: msg.senderId || '',
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        isRead: msg.isRead,
        shopId: msg.shopId,
        updateTime: msg.updateTime
      }))

      // 检查是否有新消息或消息状态变化
      const hasChanges = newMessages.some(newMsg => {
        const existingMsg = chatMessages.value.find(msg => msg.id === newMsg.id)
        return !existingMsg ||
            existingMsg.isRead !== newMsg.isRead ||
            existingMsg.content !== newMsg.content
      })

      if (hasChanges) {
        chatMessages.value = newMessages
        scrollToBottom()
        notifyNewMessage()

        // 更新当前选中消息的未读状态
        if (currentMessage.value) {
          const latestMessage = newMessages[newMessages.length - 1]
          currentMessage.value = {
            ...currentMessage.value,
            lastMessage: latestMessage.content,
            lastTime: latestMessage.time,
            unreadCount: newMessages.filter(msg => msg.isRead === '未读').length
          }
        }
      }
    }
  } catch (error) {
    console.error('获取聊天记录失败:', error)
  }
}

// 添加新消息提示方法
const notifyNewMessage = () => {
  // 可以添加提示音或其他通知方式
  const audio = new Audio('/path/to/notification-sound.mp3') // 添加提示音文件
  audio.play().catch(e => console.log('无法播放提示音:', e))

  // 或者使用系统通知
  if (Notification.permission === 'granted') {
    new Notification('新消息提醒', {
      body: '您有新消息',
      icon: '/path/to/icon.png'
    })
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

// 工具方法
const getInitials = (name) => name ? name.charAt(0) : '?'

const formatTime = (date) => {
  if (!date) return ''

  const now = new Date()
  const messageDate = new Date(date)
  const diff = now - messageDate

  // 换为分钟
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
    '待发货': 'warning',
    '已发货': 'info',
    '已完成': 'success',
    '已取消': 'danger',
    '退款中': 'danger'
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

// 添加模拟订单数据
const mockOrderHistory = [
  {
    orderId: '111055265202523',
    amount: 29.99,
    status: '待发货',
    createTime: '2024-03-15 10:30:00'
  },
  {
    orderId: '111055265202524',
    amount: 45.50,
    status: '已发货',
    createTime: '2024-03-14 15:20:00'
  },
  {
    orderId: '111055265202525',
    amount: 99.99,
    status: '已完成',
    createTime: '2024-03-13 09:15:00'
  },
  {
    orderId: '111055265202526',
    amount: 15.99,
    status: '已取消',
    createTime: '2024-03-12 14:45:00'
  },
  {
    orderId: '111055265202527',
    amount: 159.99,
    status: '退款中',
    createTime: '2024-03-11 16:30:00'
  }
]

// 添加消息内容格式化方法
const formatMessageContent = (content) => {
  if (!content) return ''

  // 检查是否是图片URL
  const isImageUrl = (url) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url) ||
        url.includes('alicdn.com') ||  // 针对阿里云图片
        url.includes('aliexpress.com')  // 针对速卖通图片
  }

  // 如果内容是图片URL，转换为img标签
  if (isImageUrl(content.trim())) {
    return `<img src="${content}" style="max-width:200px;" />`
  }

  // 如果内容中包含HTML标签（可能已经是图片），直接返回
  if (/<[^>]*>/g.test(content)) {
    return content
  }

  // 普通文本，进行换行符转换
  return content.replace(/\n/g, '<br>')
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

/* 中间聊天域样式 */
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
  text-align: right;
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

.editor-container {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin: 10px 0;
}

.editor-container :deep(.el-textarea__inner) {
  border: none;
  padding: 10px;
  min-height: 120px;
}

.editor-container :deep(.el-textarea__inner:focus) {
  box-shadow: none;
}

.message-text {
  color: #303133;
  line-height: 1.5;
}

.message-text img {
  max-width: 200px;
  height: auto;
  margin: 4px 0;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
}

.message-text img:hover {
  transform: scale(1.02);
}

/* 确保图片预览组件在最上层 */
:deep(.el-image-viewer__wrapper) {
  z-index: 2100;
}

/* 添加可编辑div的样式 */
.editable-div {
  min-height: 120px;
  padding: 10px;
  outline: none;
  overflow-y: auto;
  word-break: break-word;
}

.editable-div:empty:before {
  content: attr(placeholder);
  color: #999;
}

.editable-div img {
  max-width: 200px;
  height: auto;
  margin: 4px 0;
  border-radius: 4px;
}

/* 订单列表样式 */
.order-list {
  padding: 8px 0;
}

.order-item {
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
}

.order-item:last-child {
  border-bottom: none;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.order-id {
  font-size: 13px;
  color: #606266;
}

.order-content {
  font-size: 13px;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-amount, .order-time {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  color: #909399;
  min-width: 40px;
}

.value {
  color: #303133;
}

/* 修改订单状态标签样式 */
:deep(.el-tag--small) {
  height: 20px;
  padding: 0 6px;
  font-size: 12px;
}

/* 产品信息样式 */
.product-info {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
  padding: 8px 0;
}

.product-image {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  color: #909399;
}

.product-details {
  flex: 1;
  min-width: 0; /* 防止文本溢出 */
}

.product-name {
  font-size: 13px;
  color: #303133;
  line-height: 1.4;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 调整订单内容的间距 */
.order-content {
  padding: 0 4px;
}

/* 调整订单信息的布局 */
.order-info {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #f0f2f5;
}
</style>