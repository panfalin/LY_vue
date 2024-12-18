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

      <!-- 在搜索框上方添加更新时间显示 -->
      <div class="last-update-time">
        最近更新时间: {{ lastUpdateTimeDate }}
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
          <el-radio-button label="unrespond">未回复消息</el-radio-button>
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
                  :src="getProxiedImageUrl(msg.avatarUrl)"
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
       
      </div>

      <!-- 聊天内容区域 -->
      <div class="chat-content" ref="chatContent">
        <el-scrollbar>
          <div class="chat-messages">
            <template v-for="(msg, index) in chatMessages" :key="msg.id">
              <!-- 添加时间分割线 -->
              <div v-if="shouldShowTimestamp(msg, index)" class="timestamp-divider">
                {{ formatMessageTime(msg.time) }}
              </div>
              
              <div :class="['message-bubble', msg.isCustomer ? 'customer' : 'service']">
                <div class="message-avatar">
                  <el-avatar 
                      :size="32"
                      :src="msg.isCustomer ? getProxiedImageUrl(msg.avatarUrl) : ''"
                  >
                    {{ msg.isCustomer ? getInitials(msg.senderName) : '客服' }}
                  </el-avatar>
                </div>
                <div class="message-wrapper">
                  <div class="message-content">
                    <div
                        class="message-text"
                        v-html="formatMessageContent(msg.content)"
                        @click="handleMessageClick"
                    ></div>
                  </div>
                  <!-- 添加消息状态显示 -->
                  <div class="message-read-status" :class="{ 'unread': msg.isRead === '未读' }">
                    {{ msg.isRead }}
                  </div>
                </div>
              </div>
            </template>
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
                    :src="getProxiedImageUrl(order.productImage)"
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
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import axios from 'axios'
import { listClient, getClient } from '@/api/aliexpress/client'
import { listMessage, updateMessageRead,updateMessageStatus, getMessage,addMessage,listMessageUnread } from '@/api/aliexpress/message'
import { listStores } from "@/api/products/products.js"
import request from '@/utils/request'
import { ElImageViewer, ElMessage } from 'element-plus'
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

// 添加上次更新时间的响应式变量
const lastUpdateTimeDate = ref('--')

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

// 获取最后更新时间
const getLastUpdateTimeFromServer = async () => {
  try {
    const response = await fetch('http://192.168.1.122:5001/get_last_update_time')
    const res = await response.json()
    if (res.last_update_time) {
      lastUpdateTimeDate.value = formatTimeData(res.last_update_time)
    }
  } catch (error) {
    console.error('获取最后更新时间失败:', error)
  }
}

// 修改获取消息列表的方法
const getMessageList = async (storeId = '', readStatus = '',messageStatus = '') => {
  try {
    const params = {
      pageNum: 1,
      pageSize: 9999,
      storeName: storeId,
      isRead: readStatus,
      messageStatus: messageStatus
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
          isRead: msg.isRead,
          messageStatus: msg.messageStatus
        }
      })
      console.log("newList====>", newList)
      // 直接更新消息列表
      messageList.value = newList
      
      // 获取服务器端的最后更新时间
      await getLastUpdateTimeFromServer()
    }
  } catch (error) {
    console.error('获取消息列表失败:', error)
  }
}

// 修改消息状态变更处理方法
const handleStatusChange = (value) => {
  filterStatus.value = value
  let readStatus = ''
  let messageStatus = ''

  // 根据选择的状态设置参数
  switch(value) {
    case 'unread':
      readStatus = '未读'
      break
    case 'unrespond':
      messageStatus = '未回复'
      break
    default:
      readStatus = ''
      messageStatus=''
  }

  // 重新获取消息列表
  getMessageList(filterShop.value, readStatus,messageStatus)
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
  getLastUpdateTimeFromServer()
})

// 移除或简化原有的过滤计算属性，因为现在完全依赖后端过滤
const filteredMessages = computed(() => {
  let result = messageList.value

  // 关键词搜索
  if (searchQuery.value) {
    const keyword = searchQuery.value.toLowerCase()
    result = result.filter(msg =>
        msg.customerName.toLowerCase().includes(keyword) ||
        msg.email?.toLowerCase().includes(keyword) ||
        msg.lastMessage.toLowerCase().includes(keyword)
    )
  }

  // 对消息进行排序：未读消息在前，已读消息在后
  // 在每个分组内按时间倒序排序
  return result.sort((a, b) => {
    // 首先按未读状态排序
    if (a.unreadCount > 0 && b.unreadCount === 0) return -1
    if (a.unreadCount === 0 && b.unreadCount > 0) return 1
    
    // 如果未读状态相同，则按时间倒序排序
    return new Date(b.lastTime) - new Date(a.lastTime)
  })
})

// 方法
const selectMessage = async (message) => {
  if (currentProcessing.value.processing && currentProcessing.value.clientId === message.clientId) {
    return
  }

  try {
    currentProcessing.value = {
      clientId: message.clientId,
      processing: true
    }

    currentMessage.value = message

    // 获取当前筛选状态对应的参数
    let readStatus = ''
    let messageStatus = ''
    
    // 保持当前的筛选状态
    switch(filterStatus.value) {
      case 'unread':
        readStatus = '未读'
        break
      case 'unrespond':
        messageStatus = '未回复'
        break
    }

    // 更新消息状态
    if(message.lastMessage !== '暂无消息') {
      await updateMessageRead({
        senderId: message.clientId,
        shopId: message.storeName,
        isRead: '已读'
      })
    }

    // 获取订单数据
    try {
      const res = await getOrder(message.clientId, message.storeName)
      orderHistory.value = res.rows.map(order => ({
        orderId: order.orderId,
        amount: order.orderAmount,
        status: order.orderStatus,
        createTime: order.createdTime,
        productName: order.produceName || '未知商品',
        productImage: order.producePicture || ''
      }))
    } catch (error) {
      console.error('获取订单数据出错:', error)
      orderHistory.value = []
    }

    // 加载聊天记录
    await loadChatHistory(message.id)

    // 开始轮询
    startPolling()

    // 使用当前的筛选状态重新获取消息列表
    await getMessageList(filterShop.value, readStatus, messageStatus)

  } catch (error) {
    console.error('获取用户信息失败:', error)
  } finally {
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

// 添加生成唯一send_id的方法
const generateSendId = () => {
  const timestamp = new Date().getTime()
  const random = Math.floor(Math.random() * 1000)
  return `${timestamp}_${random}`
}

// 添加一个清理HTML和特殊字符的函数
const cleanHtmlContent = (html) => {
  // 替换&nbsp;为普通空格
  let content = html.replace(/&nbsp;/g, ' ')
  
  // 替换<br>和<div><br></div>为换行符
  content = content.replace(/<br\s*\/?>/gi, '\n')
  content = content.replace(/<div><br><\/div>/gi, '\n')
  
  // 替换<div>开头的为换行符（保留内容）
  content = content.replace(/<div>/gi, '\n')
  
  // 移除所有剩余的HTML标签
  content = content.replace(/<[^>]+>/g, '')
  
  // 处理连续的换行符
  content = content.replace(/\n\s*\n/g, '\n')
  
  // 移除开头的换行符
  content = content.replace(/^\n+/, '')
  
  // 移除结尾的换行符
  content = content.replace(/\n+$/, '')
  
  // 处理连续的空格
  content = content.replace(/\s+/g, ' ')
  
  return content.trim()
}

// 修改发送消息方法
const sendMessage = async () => {
  if (!messageInput.value.trim()) return

  try {
    const senderId = '客服'
    const receiverId = currentMessage.value.clientId
    const send_id = generateSendId()

    // 获取当前时间，并调整为东八区
    const now = new Date()
    const currentTime = now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '-')

    // 检查消息内容是否包含图片
    const hasImage = /<img[^>]+src="([^">]+)"/i.test(messageInput.value)
    
    let messageContent
    if (hasImage) {
      const imgMatch = messageInput.value.match(/<img[^>]+src="([^">]+)"/i)
      messageContent = imgMatch ? imgMatch[1] : ''
      
      try {
        // 获取图片数据
        const response = await fetch(messageContent)
        const blob = await response.blob()
        
        // 从URL中获取文件名
        const fileName = messageContent.split('/').pop() || 'image.jpg'
        
        // 创建File对象
        const file = new File([blob], fileName, { type: blob.type })
        
        // 创建FormData对象
        const formData = new FormData()
        formData.append('file', file)
        formData.append('receiverId', receiverId)
        formData.append('shopId', currentMessage.value.storeName)
        
        // 发送图片数据到接口
        const result = await axios.post('http://192.168.1.122:5000/send_message', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        
        // 处理返回结果
        if (result.data) {
          // 成功提示
          ElMessage({
            type: 'success',
            message: result.data.message || '图片发送成功'
          })
          
        }
      } catch (error) {
        console.error('图片处理失败:', error)
        ElMessage({
          type: 'error',
          message: error.response?.data?.message || '图片发送失败'
        })
        throw error
      }
    } else {
      // 如果是文本消息，则清理HTML内容
      messageContent = cleanHtmlContent(messageInput.value)
      try {
        // 发送普通文本消息
        const result = await axios.post('http://192.168.1.122:5000/send_message', {
          receiverId: receiverId,
          messageContent: messageContent,
          shopId: currentMessage.value.storeName
        })
        console.log("resultmesssssss====>", result)
        // 处理返回结果
        if (result.data) {
          // 成功提示
          ElMessage({
            type: 'success',
            message: result.data.message || '消息发送成功'
          })

        }
      } catch (error) {
        console.error('消息发送失败:', error)
        ElMessage({
          type: 'error',
          message: error.response?.data?.message || '消息发送失败'
        })
        throw error
      }
    }

    console.log('send_id发送成功:', send_id)

    // 发送成功后，将消息添加到聊天记录中
    chatMessages.value.push({
      content: messageContent,
      time: currentTime,
      isCustomer: false,
      senderId: senderId,
      receiverId: receiverId,
      isRead: '已读',
      id: generateMessageId(senderId, receiverId),
      send_id: send_id
    })

    // 清空输入框和可编辑div的内容
    messageInput.value = ''
    editableDiv.value.innerHTML = ''
    console.log("generateMessageId====>", generateMessageId(senderId, receiverId))

    await updateMessageStatus({
      receiverId: receiverId,  // 用户ID
      shopId: currentMessage.value.storeName,    // 店铺名
      messageStatus: '已回复', // 设置为已读
      conversationId: generateMessageId(senderId, receiverId)                
    })
    
    
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

// 修改轮询方法
const startPolling = () => {
  stopPolling()

  pollingTimer.value = setInterval(async () => {
    if (currentMessage.value?.clientId && currentMessage.value?.storeName) {
      // 获取当前筛选状态对应的参数
      let readStatus = ''
      let messageStatus = ''
      
      switch(filterStatus.value) {
        case 'unread':
          readStatus = '未读'
          break
        case 'unrespond':
          messageStatus = '未回复'
          break
      }

      // 保持当前筛选状态进行更新
      await getMessageList(filterShop.value, readStatus, messageStatus)
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
        // createTime: msg.createTime,
        isCustomer: msg.senderId === currentMessage.value.clientId,
        senderName: msg.senderId || '',
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        isRead: msg.isRead,
        shopId: msg.shopId,
        avatarUrl: msg.avatarUrl,
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
        
        // 使用 nextTick 确保在 DOM 更新后再滚动
        nextTick(() => {
          scrollToBottom()
        })
        
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

const getProxiedImageUrl = (url) => {
  if (!url) return '';
  // 使用 images.weserv.nl 代理服务
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&default=https://via.placeholder.com/80x80?text=No+Image`;
};

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


// 格式化时间的方法（如果还没有的话）
const formatTimeData = (date) => {
  if (!date) return '--'
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}



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
  
  const content_str = content.trim()

  // 检查是否是图片URL
  const isImageUrl = (url) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url) ||
        url.includes('alicdn.com/kf/') ||  // 阿里云图片
        url.includes('/i.alicdn.com/')     // 阿里云图片的另一种格式
  }

  // 检查是否是商品链接
  const isProductUrl = (url) => {
    return url.includes('aliexpress.com/item/') || // 商品链接
           url.includes('aliexpress.com/p/')
  }

  // 检查是否是推荐商品消息（以"推荐商品"开头）
  if (content_str.startsWith('推荐商品')) {
    const lines = content_str.split('\n')
    if (lines.length >= 2) {
      // 提取商品信息
      const title = lines[1]  // 商品标题
      const remainingContent = lines[2] || ''  // 包含价格、图片和链接的行
      
      // 使用正则表达式匹配价格格式 "US $数"
      const priceMatch = remainingContent.match(/US \$\d+(\.\d{2})?/)
      const price = priceMatch ? priceMatch[0] : ''
      
      // 分割其余部分来获取图和链接
      const parts = remainingContent.split(' ')
      const imageUrl = parts.find(part => isImageUrl(part))
      const productUrl = parts.find(part => isProductUrl(part))
      
      if (imageUrl && productUrl) {
        const proxiedUrl = getProxiedImageUrl(imageUrl)
        return `
          <a href="${productUrl}" target="_blank" class="product-card">
            <div class="product-info">
              <div class="product-title">${title}</div>
              <div class="product-price">${price}</div>
            </div>
            <img src="${proxiedUrl}" class="product-image" />
          </a>
        `
      }
    }
  }

  // 其他类型消息的处理保持不变
  if (isImageUrl(content_str)) {
    const proxiedUrl = getProxiedImageUrl(content_str)
    return `<img src="${proxiedUrl}" style="max-width:200px;" />`
  }
  
  if (isProductUrl(content_str)) {
    return `<a href="${content_str}" target="_blank" class="product-link">${content_str}</a>`
  }

  if (/<[^>]*>/g.test(content_str)) {
    return content_str
  }

  return content_str.replace(/\n/g, '<br>')
}

// 添加消息点击处理函数
const handleMessageClick = (event) => {
  // 如果点击的是推荐商品卡片中的图片，不执行任何操作（让 a 标签的跳转生效）
  if (event.target.tagName === 'IMG' && event.target.closest('.product-card')) {
    return
  }



  
  // 如果是普通图片，执行预览
  if (event.target.tagName === 'IMG') {
    handleImageClick(event)
    // ... 预览图片的代码
  }
}

// 添加判断是否显示时间戳的方法
const shouldShowTimestamp = (currentMsg, index) => {
  if (index === 0) return true // 第一条消息总是显示时间
  
  const prevMsg = chatMessages.value[index - 1]
  const currentTime = new Date(currentMsg.time)
  const prevTime = new Date(prevMsg.time)
  
  // 如果两条消息间隔超过5分钟，显示时间戳
  return (currentTime - prevTime) > 5 * 60 * 1000
}

// 添加格式化消息时间的方法
const formatMessageTime = (time) => {
  const msgDate = new Date(time)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  // 格式化时间部分
  const timeStr = msgDate.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
  
  // 如果是今天的消息
  if (msgDate.toDateString() === today.toDateString()) {
    return timeStr
  }
  
  // 如果是昨天的消息
  if (msgDate.toDateString() === yesterday.toDateString()) {
    return `昨天 ${timeStr}`
  }
  
  // 其他日期显示完整日期
  return `${msgDate.toLocaleDateString('zh-CN')} ${timeStr}`
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

.product-link {
  color: #1890ff;
  text-decoration: underline;
  word-break: break-all;
}

.product-link:hover {
  color: #40a9ff;
}

.product-recommendation {
  display: block;
  text-decoration: none;
  color: inherit;
  padding: 10px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  transition: all 0.3s;
}

.product-recommendation:hover {
  background-color: #f5f5f5;
  border-color: #d9d9d9;
}

.product-title {
  margin-bottom: 8px;
  color: #333;
  font-size: 14px;
  line-height: 1.4;
}

.product-recommendation img {
  display: block;
  margin: 0 auto;
}

/* 添加更新时间的样式 */
.last-update-time {
  padding: 8px 16px;
  color: #909399;
  font-size: 12px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
}


.message-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.service .message-wrapper {
  align-items: flex-end;
}

.message-read-status {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  padding: 0 4px;
}

.message-read-status.unread {
  color: #409EFF;
}

/* 调整消息气泡的样式以适应新的布局 */
.message-bubble {
  display: flex;
  gap: 12px;
  max-width: 80%;
  margin-bottom: 20px; /* 增加气泡之间的间距 */
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
  margin-bottom: 2px; /* 为已读/未读状态留出空间 */
}

.service .message-content {
  background-color: #ecf5ff;
}


.message-bubble:hover .message-time {
  background: rgba(144, 147, 153, 0.2);
}

/* 时间分割线样式 */
.timestamp-divider {
  text-align: center;
  margin: 10px 0;
  font-size: 12px;
  color: #909399;
}

/* 左侧消息列表时间样式 */
.message-header .message-time {
  font-size: 11px;
  color: #909399;
}

/* 最近更新时间样式 */
.last-update-time {
  padding: 8px 16px;
  color: #909399;
  font-size: 12px;
  border-bottom: 1px solid #ebeef5;
}
</style>