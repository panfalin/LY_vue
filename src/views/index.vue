<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-card class="search-card" :class="{ 'is-collapsed': !showSearch }">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
        <el-form-item label="SKU" prop="sku">
          <el-input
            v-model="queryParams.sku"
            placeholder="请输入SKU"
            clearable
            :prefix-icon="Search"
            style="width: 200px"
            @keyup.enter="handleQuery"
          >
            <template #append>
              <el-button :icon="Search" @click="handleQuery" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
          <el-input
            v-model="queryParams.productName"
            placeholder="请输入商品名称"
            clearable
            :prefix-icon="Document"
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="负责人" prop="selectedResponsiblePerson">
          <el-select 
            v-model="form.selectedResponsiblePerson" 
            placeholder="请选择负责人" 
            clearable
            style="width: 200px"
            filterable
          >
            <el-option
              v-for="person in storeOptions"
              :key="person.value"
              :label="person.label"
              :value="person.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="刊登 ID" prop="id">
          <el-input
              v-model="queryParams.id"
              placeholder="请输入刊登 ID"
              clearable
              :prefix-icon="Search"
              style="width: 200px"
              @keyup.enter="handleQuery"
          />
        </el-form-item>



        <el-form-item>
          <el-button-group>
            <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
            <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 工具栏 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <div class="left-area">
            <span class="card-title">任务列表</span>
            <el-tag type="info" effect="plain">共 {{ total }} 条</el-tag>
          </div>
          <div class="right-btns">
            <el-tooltip content="刷新数据" placement="top">
              <el-button
                :icon="Refresh"
                circle
                @click="refreshList"
                :loading="loading"
              />
            </el-tooltip>
            <el-tooltip content="导出数据" placement="top">
              <el-button
                type="warning"
                :icon="Download"
                circle
                @click="handleExport"
                v-hasPermi="['products:products:export']"
              />
            </el-tooltip>
            <el-tooltip :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
              <el-button
                :icon="showSearch ? 'Hide' : 'Search'"
                circle
                @click="showSearch = !showSearch"
              />
            </el-tooltip>
          </div>
        </div>
      </template>

      <!-- 表格 -->
      <el-table
        v-loading="loading"
        :data="dailyTaskList"
        :span-method="objectSpanMethod"
        style="width: 100%"
        :height="tableHeight"
        highlight-current-row
        border
        stripe
        @row-click="handleRowClick"
      >
        <!-- 合并的列 -->
        <el-table-column 
          label="店铺" 
          align="center" 
          prop="store" 
          min-width="120" 
          fixed="left"
          show-overflow-tooltip="false"
        >
          <template #default="{ row }">
            <div class="cell-content">{{ row.store }}</div>
          </template>
        </el-table-column>

        <el-table-column 
          label="SKU" 
          align="center" 
          prop="sku" 
          min-width="120" 
          fixed="left"
          show-overflow-tooltip="false"
        >
          <template #default="{ row }">
            <el-button link type="primary" @click.stop="copySKU(row.sku)">
              <div class="cell-content">{{ row.sku }}</div>
            </el-button>
          </template>
        </el-table-column>

        <el-table-column 
          label="刊登图片" 
          align="center" 
          width="120" 
          fixed="left"
          show-overflow-tooltip="false"
        >
          <template #default="scope">
            <div class="image-wrapper">
              <img 
                :src="getProxiedImageUrl(scope.row.largeImg || scope.row.imageUrl)"
                class="product-image"
                @error="(e) => handleImageError(e, scope.row)"
              >
            </div>
          </template>
        </el-table-column>

        <el-table-column 
          label="商品名称" 
          align="center" 
          min-width="300" 
          prop="productName"
          show-overflow-tooltip="false"
        >
          <template #default="{ row }">
            <div class="cell-content">{{ row.productName }}</div>
          </template>
        </el-table-column>

        <el-table-column 
          label="刊登ID" 
          align="center" 
          prop="id" 
          min-width="120"
          show-overflow-tooltip="false"
          :filters="getUniqueIds(dailyTaskList)"
          :filter-method="filterById"
          filter-placement="bottom"
        >
          <template #default="{ row }">
            <div class="cell-content">
              <el-button link type="primary" @click.stop="copyID(row.id)">
                {{ row.id }}
              </el-button>
            </div>
          </template>
        </el-table-column>

        <el-table-column 
          label="任务" 
          align="center" 
          prop="tasks" 
          min-width="150"
          show-overflow-tooltip="false"
        >
          <template #default="{ row }">
            <div class="cell-content">{{ row.tasks }}</div>
          </template>
        </el-table-column>

        <el-table-column 
          label="历史销量" 
          align="center" 
          prop="sales" 
          min-width="100"
          show-overflow-tooltip="false"
        >
          <template #default="{ row }">
            <div class="cell-content">{{ row.sales }}</div>
          </template>
        </el-table-column>

        <el-table-column 
          label="近30天访客" 
          align="center" 
          prop="visitorCount" 
          min-width="120"
          show-overflow-tooltip="false"
        >
          <template #default="{ row }">
            <div class="cell-content">{{ row.visitorCount }}</div>
          </template>
        </el-table-column>

        <el-table-column 
          label="责任人" 
          align="center" 
          prop="responsiblePerson" 
          min-width="100"
          show-overflow-tooltip="false"
        >
          <template #default="{ row }">
            <div class="cell-content">{{ row.responsiblePerson }}</div>
          </template>
        </el-table-column>

        <el-table-column 
          label="建议事项" 
          align="center" 
          prop="suggestions" 
          min-width="200"
          show-overflow-tooltip="false"
        >
          <template #default="{ row }">
            <div class="cell-content">{{ row.suggestions }}</div>
          </template>
        </el-table-column>

        <el-table-column 
          label="目标" 
          align="center" 
          prop="goals" 
          min-width="150"
          show-overflow-tooltip="false"
        >
          <template #default="{ row }">
            <div class="cell-content">{{ row.goals }}</div>
          </template>
        </el-table-column>

        <el-table-column 
          label="日志记录" 
          align="center" 
          prop="logs" 
          min-width="150"
          show-overflow-tooltip="false"
        >
          <template #default="{ row }">
            <div class="cell-content" :class="{ 'has-logs': row.logs }">
              {{ row.logs || '暂无' }}
            </div>
          </template>
        </el-table-column>

        <el-table-column 
          label="修改时间" 
          align="center" 
          prop="updateTime" 
          min-width="160"
          show-overflow-tooltip="false"
        >
          <template #default="{ row }">
            <div class="cell-content">{{ row.updateTime }}</div>
          </template>
        </el-table-column>

        <el-table-column 
          label="操作" 
          align="center" 
          fixed="right" 
          min-width="100"
          :filters="[
            { text: '已完成', value: true },
            { text: '未完成', value: false }
          ]"
          :filter-method="filterByStatus"
          filter-placement="bottom-end"
        >
          <template #default="scope">
            <el-button
              :type="scope.row.logs ? 'success' : 'primary'"
              :disabled="scope.row.logs"
              @click.stop="handleComplete(scope.row)"
              v-hasPermi="['task:task:edit']"
            >
              {{ scope.row.logs ? '已完成' : '未完成' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <pagination
        v-show="total > 0"
        :total="total"
        :page-sizes="[20, 50, 100]"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>

    <!-- 详情抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      title="详细信息"
      size="50%"
      :destroy-on-close="true"
    >
      <template #header>
        <h4>{{ selectedRow?.productName || '详细信息' }}</h4>
      </template>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="SKU">{{ selectedRow?.sku }}</el-descriptions-item>
        <el-descriptions-item label="店铺">{{ selectedRow?.store }}</el-descriptions-item>
        <el-descriptions-item label="刊登ID">{{ selectedRow?.id }}</el-descriptions-item>
        <el-descriptions-item label="任务">{{ selectedRow?.tasks }}</el-descriptions-item>
        <el-descriptions-item label="建议事项">{{ selectedRow?.suggestions }}</el-descriptions-item>
        <el-descriptions-item label="目标">{{ selectedRow?.goals }}</el-descriptions-item>
        <el-descriptions-item label="日志记录">{{ selectedRow?.logs || '暂无' }}</el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </div>
</template>

<script setup name="Index">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Document, Picture, Download, Refresh, Loading } from '@element-plus/icons-vue'
import { listTODO, listStores, listTask, updateTask } from "@/api/products/products"
import axios from 'axios';

const {proxy} = getCurrentInstance();

const dailyTaskList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const storeOptions = ref([]);

const data = reactive({
  form: {
    selectedResponsiblePerson: null,
  },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    logs: null,
    responsiblePerson: null,
    id:null,
  },
  rules: {
    sku: [
      {required: true, message: "SKU不能为空", trigger: "blur"}
    ],
  }
});
const {queryParams, form, rules} = toRefs(data);

// 对数据进行排序的函数
const sortData = (data) => {
  return [...data].sort((a, b) => {
    // 先按店铺排序
    if (a.store !== b.store) {
      return a.store.localeCompare(b.store);
    }
    // 再按SKU排序
    return a.sku.localeCompare(b.sku);
  });
};

/** 查询products列表 */
function getList() {
  loading.value = true;
  listTask(queryParams.value).then(response => {
    // 对数据进行排序后再赋值
    dailyTaskList.value = sortData(response.rows);
    total.value = response.total;
    loading.value = false;
  });
}

// 格式化店铺数据
function formatStores(stores) {
  const storeMap = new Map();
  stores.forEach(store => {
    if (!storeMap.has(store.storeManager)) {
      storeMap.set(store.storeManager, {
        value: store.storeManager,
        label: store.storeManager, // 设 label 和 value 都 storeManager
      });
    }
  });

  return Array.from(storeMap.values());
}

// 获取店铺经理表
function getStoreManagerList() {
  loading.value = true;
  listStores()
      .then(response => {
        const stores = response.rows; // response.rows 应该包含完整数据
        storeOptions.value = formatStores(stores);
        loading.value = false;
      })
      .catch(error => {
        loading.value = false; // 在出现错误时也要停止加载状态
        console.error('获取店铺列表失败:', error); // 记录错误
        // 可以显示错误消息给用户
        ElMessage.error('加载店铺列表时出错，请稍后重试');
      });
}

// 组件挂载时加载类别列表
onMounted(() => {
  getStoreManagerList();
});

/** 排序触发事件 */
function handleSortChange(column, prop, order) {
  if (column.prop.startsWith('mabang_info.')) {
    column.prop = column.prop.replace("mabang_info.", "");
  }
  queryParams.value.orderByColumn = column.prop;
  queryParams.value.isAsc = column.order;
  getList();
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    sku: null,
    status: null,
    totalInventory: null,
    latestPurchasePrice: null,
    imageUrl: null
  };
  proxy.resetForm("productsRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  queryParams.value.responsiblePerson = form.value.selectedResponsiblePerson;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  queryParams.value.category = null;
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getList(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修products";
  });
}

/** 单元格修改值的提交按钮 */
function submitForm(row) {
  const _id = row.id || ids.value; // 获取行的 ID
  if (_id) {
    updateProducts(row).then(response => {
      proxy.$modal.msgSuccess("修改成功");
      getList(); // 更新列表
    });
  } else {
    addProducts(row).then(response => {
      proxy.$modal.msgSuccess("新增成功");
      getList(); // 更新列表
    });
  }
}


/** 导出按钮操作 */
function handleExport() {
  proxy.download('task/task/export', {
    ...queryParams.value
  }, `products_${new Date().getTime()}.xlsx`)
}

/**
 * 合并相同的单元格
 */
// 获取合并信息的函数
const getSpanInfo = (data, key) => {
  const spanInfo = [];
  let pos = 0;
  let count = 0;

  // 遍历数据计算合并信息
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      count = 1;
    } else if (data[i][key] === data[i - 1][key]) {
      count++;
    } else {
      spanInfo.push({
        pos: pos,
        count: count
      });
      pos = i;
      count = 1;
    }
  }
  
  // 处理最后一组数据
  if (count > 0) {
    spanInfo.push({
      pos: pos,
      count: count
    });
  }

  // 生成最终的合并信息数组
  const result = new Array(data.length).fill(null);
  spanInfo.forEach(({ pos, count }) => {
    result[pos] = { rowspan: count, colspan: 1 };
    for (let i = pos + 1; i < pos + count; i++) {
      result[i] = { rowspan: 0, colspan: 0 };
    }
  });

  return result;
};

// 计算店铺的合并信息
const storeSpanInfo = computed(() => {
  return getSpanInfo(dailyTaskList.value, 'store');
});

// 计算SKU的合并信息
const skuSpanInfo = computed(() => {
  return getSpanInfo(dailyTaskList.value, 'sku');
});

// 合并方法
const objectSpanMethod = ({ rowIndex, columnIndex }) => {
  // 只处理前四列的合并
  if (columnIndex === 0) {
    // 店铺列
    return storeSpanInfo.value[rowIndex] || { rowspan: 1, colspan: 1 };
  }
  else if (columnIndex >= 1 && columnIndex <= 3) {
    // SKU、图片和商品名称列
    return skuSpanInfo.value[rowIndex] || { rowspan: 1, colspan: 1 };
  }
  // 其他列不合并
  return { rowspan: 1, colspan: 1 };
};

// 检查是否是同一
const isSameDay = (date1, date2) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate()
}

// 处理完成操作
const handleComplete = async (row) => {
  console.log('开始处理完成操作', row) // 调试日志

  if (row.logs) {
    return
  }

  try {
    await ElMessageBox.confirm('确认要完成此操作吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 准备更新数据
    const taskData = {
      id: row.id,
      logs: new Date().toLocaleString()
    }
    
    console.log('准备发送的数据：', taskData) // 调试日志
    
    // 调用更新API
    const res = await updateTask(taskData)
    console.log('API响应：', res) // 调试日志
    
    if (res.code === 200) {
      // 更新本地状态
      row.logs = taskData.logs
      ElMessage.success('操作已完成')
      // 刷新列表
      getList()
    } else {
      ElMessage.error(res.msg || '操作失败')
    }
  } catch (error) {
    console.log('发生错误：', error) // 调试日志
    ElMessage.error('操作失败')
  }
}

// 计算表格高度
const tableHeight = ref(window.innerHeight - 300)

// 监听窗口大小变化
onMounted(() => {
  window.addEventListener('resize', () => {
    tableHeight.value = window.innerHeight - 300
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', () => {
    tableHeight.value = window.innerHeight - 300
  })
})

// 新增的交互功能
const drawerVisible = ref(false)
const selectedRow = ref(null)

// 处理行点击
const handleRowClick = (row) => {
  selectedRow.value = row
  drawerVisible.value = true
}

// 复制SKU
const copySKU = async (sku) => {
  try {
    await navigator.clipboard.writeText(sku);
    ElMessage({
      message: 'SKU已复制到剪贴板',
      type: 'success',
      duration: 1500
    });
  } catch (err) {
    // 降级处理方案
    const textarea = document.createElement('textarea');
    textarea.value = sku;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      ElMessage({
        message: 'SKU已复制到剪贴板',
        type: 'success',
        duration: 1500
      });
    } catch (err) {
      ElMessage.error('复制失败，请手动复制');
    }
    document.body.removeChild(textarea);
  }
};

// 复制ID
const copyID = async (id) => {
  try {
    await navigator.clipboard.writeText(id.toString());
    ElMessage({
      message: 'ID已复制到剪贴板',
      type: 'success',
      duration: 1500
    });
  } catch (err) {
    // 降级处理方案
    const textarea = document.createElement('textarea');
    textarea.value = id.toString();
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      ElMessage({
        message: 'ID已复制到剪贴板',
        type: 'success',
        duration: 1500
      });
    } catch (err) {
      ElMessage.error('复制失败，请手动复制');
    }
    document.body.removeChild(textarea);
  }
};

// 刷新列表
const refreshList = () => {
  getList()
}

// 获取责任人标签类型
const getResponsiblePersonType = (person) => {
  const types = ['', 'success', 'warning', 'danger', 'info']
  const hash = person.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return types[hash % types.length]
}

// 获取唯一的刊登ID列表
const getUniqueIds = (list) => {
  if (!list) return [];
  const ids = new Set(list.map(item => item.id));
  return Array.from(ids).map(id => ({
    text: id.toString(),
    value: id
  }));
};

// 刊登ID的筛选方法
const filterById = (value, row) => {
  return row.id === value;
};

// 操作状态的筛选方法
const filterByStatus = (value, row) => {
  return value ? !!row.logs : !row.logs;
};

// 处理图片加载错误
const handleImageError = (e, row) => {
  console.error('图片加载失败:', row.largeImg || row.imageUrl);
  // 可以尝试使用备用图片URL
  if (row.largeImg && e.target.src === row.largeImg) {
    console.log('尝试加载备用图片:', row.imageUrl);
    e.target.src = row.imageUrl;
  } else {
    e.target.closest('.image-wrapper').innerHTML = `
      <div class="image-error">
        <el-icon><Picture /></el-icon>
        <span>暂无图片</span>
      </div>
    `;
  }
};

// 修改图片加载函数
const loadImage = async (url) => {
  if (!url) return '';
  try {
    console.log('开始加载图片:', url); // 调试日志
    const response = await axios.get(url, {
      responseType: 'blob',
      headers: {
        'Referer': 'https://www.alibaba.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    console.log('图片响应:', response); // 调试日志
    
    // 检查响应类型
    if (!response.headers['content-type'].startsWith('image/')) {
      console.error('响应不是图片类型:', response.headers['content-type']);
      return '';
    }
    
    const blob = new Blob([response.data], { type: response.headers['content-type'] });
    const objectUrl = URL.createObjectURL(blob);
    console.log('创建的 Blob URL:', objectUrl); // 调试日志
    return objectUrl;
  } catch (error) {
    console.error('图片加载详细错误:', error);
    return '';
  }
};

// 需要在组件卸载时清理 blob URL
onUnmounted(() => {
  // 清理所有创建的 blob URLs
  dailyTaskList.value.forEach(item => {
    if (item.imageUrl && item.imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(item.imageUrl);
    }
    if (item.largeImg && item.largeImg.startsWith('blob:')) {
      URL.revokeObjectURL(item.largeImg);
    }
  });
});

// 使用图片代理服务
const getProxiedImageUrl = (url) => {
  if (!url) return '';
  // 使用 images.weserv.nl 代理服务
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&default=https://via.placeholder.com/80x80?text=No+Image`;
};

getList();
</script>

<style scoped>
.app-container {
  padding: 20px;
  background-color: #f5f7fa;
}

.search-card {
  margin-bottom: 20px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.search-card.is-collapsed {
  margin-bottom: 10px;
}

.table-card {
  border-radius: 4px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
}

.right-btns {
  display: flex;
  gap: 10px;
}

.product-name {
  text-align: left;
  line-height: 1.5;
  padding: 8px;
}

.image-error {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;
  color: #909399;
}

.highlight-sales {
  color: #67c23a;
  font-weight: bold;
}

.has-logs {
  color: #409eff;
}

:deep(.el-table) {
  border-radius: 4px;
  transition: all 0.3s ease;
}

:deep(.el-table:hover) {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

:deep(.el-table th) {
  background-color: #f5f7fa !important;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background-color: #fafafa;
}

:deep(.el-card__header) {
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-table__row) {
  cursor: pointer;
  transition: all 0.3s ease;
}

:deep(.el-table__row:hover) {
  background-color: #f0f9ff !important;
}

:deep(.el-button--link) {
  padding: 2px 4px;
}

:deep(.el-button--link:hover) {
  text-decoration: underline;
}

:deep(.el-tag) {
  transition: all 0.3s ease;
}

:deep(.el-tag:hover) {
  transform: scale(1.05);
}

.el-drawer__body {
  padding: 20px;
}

/* 添加单元格内容样式 */
.cell-content {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.5;
  padding: 8px;
  text-align: left;
}

:deep(.el-table .cell) {
  white-space: pre-wrap !important;
  word-break: break-word !important;
}

:deep(.el-table td) {
  padding: 8px 0 !important;
}

/* 调整表格行高以适应内容 */
:deep(.el-table__row) {
  height: auto !important;
}

/* 确保按钮内容也可以换行 */
:deep(.el-button--link) {
  white-space: normal;
  height: auto;
  line-height: 1.5;
}

/* 优化长文本显示 */
.product-name,
.suggestions,
.goals,
.tasks {
  max-height: none !important;
  height: auto !important;
}

/* 调整图片列的样式 */
.el-image {
  margin: 8px 0;
}

.image-wrapper {
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  cursor: zoom-in;
  transition: all 0.3s ease;
}

.product-image:hover {
  transform: scale(1.05);
}

.image-error,
.image-loading {
  width: 80px;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  color: #909399;
  font-size: 12px;
  border-radius: 4px;
}

.image-error .el-icon,
.image-loading .el-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.image-loading .el-icon {
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

:deep(.el-image-viewer__wrapper) {
  z-index: 2100; /* 确保片预览在最上层 */
}

/* 添加筛选相关样式 */
:deep(.el-table-filter) {
  max-height: 300px;
}

:deep(.el-table-filter__list) {
  min-width: 150px;
}

:deep(.el-table-filter__bottom) {
  border-top: 1px solid #EBEEF5;
}
</style>