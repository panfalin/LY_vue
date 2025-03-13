<template>
  <div class="app-container">
    <div class="split-container">
      <!-- 左侧分类树 -->
      <div class="left-panel" :style="{ width: leftWidth + 'px' }">
        <el-card class="box-card h-100" shadow="never">
          <template #header>
            <div class="card-header">
              <span class="header-title">商品分类</span>
              <el-input
                v-model="categoryName"
                placeholder="请输入分类名称"
                clearable
                prefix-icon="Search"
                size="small"
                @keyup.enter="filterCategory"
              />
            </div>
          </template>
          <el-tree
            ref="categoryTree"
            :data="categoryOptions"
            :props="{
              label: 'name',
              children: 'children'
            }"
            :highlight-current="true"
            node-key="number"
            :expand-on-click-node="false"
            @node-click="handleCategoryClick"
          >
            <template #default="{ node, data }">
              <span v-if="data.isAll" class="custom-tree-node">
                <el-icon><Folder /></el-icon>
                <span>{{ node.label }}</span>
              </span>
              <span v-else class="custom-tree-node">
                <el-icon><FolderOpened /></el-icon>
                <span>{{ node.label }}</span>
              </span>
            </template>
          </el-tree>
        </el-card>
      </div>

      <!-- 分隔条 -->
      <div class="resizer" :style="{ left: (leftWidth - 10) + 'px' }" @mousedown="startResize">
        <el-icon class="resize-icon"><DArrowLeft /></el-icon>
        <el-icon class="resize-icon"><DArrowRight /></el-icon>
      </div>

      <!-- 右侧内容区 -->
      <div class="right-panel">
        <el-card class="box-card h-100" shadow="never">
          <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
            <el-form-item label="序号" prop="fseq">
              <el-input
                v-model="queryParams.fseq"
                placeholder="请输入序号"
                clearable
                size="small"
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="商品编码" prop="number">
              <el-input
                v-model="queryParams.number"
                placeholder="请输入商品编码"
                clearable
                size="small"
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="商品名称" prop="name">
              <el-input
                v-model="queryParams.name"
                placeholder="请输入商品名称"
                clearable
                size="small"
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" size="small" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" size="small" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>

          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                type="warning"
                plain
                icon="Download"
                size="small"
                @click="handleExport"
                v-hasPermi="['kingdee:product:export']"
              >导出</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
          </el-row>

          <el-table
            v-loading="loading"
            :data="productList"
            row-key="rk"
            border
            max-height="500"
            size="small"
            :height="tableHeight"
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChange"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="序号" align="center" prop="fseq" sortable width="80"/>
            <el-table-column 
              label="商品分类" 
              align="center" 
              prop="parentName" 
              :show-overflow-tooltip="false"
              min-width="120"
            >
              <template #default="scope">
                <div class="table-cell-text">{{ scope.row.parentName }}</div>
              </template>
            </el-table-column>
            <el-table-column label="图片" align="center" prop="url" width="80">
              <template #default="scope">
                <el-image 
                  v-if="scope.row.url"
                  style="width: 50px; height: 50px; cursor: pointer"
                  :src="'https://tf.jdy.com/fileserver/' + scope.row.url"
                  :preview-src-list="['https://tf.jdy.com/fileserver/' + scope.row.url]"
                  :initial-index="0"
                  preview-teleported
                  fit="cover"
                >
                  <template #error>
                    <div class="image-slot">
                      <el-icon><Picture /></el-icon>
                    </div>
                  </template>
                </el-image>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column 
              label="商品编码" 
              align="center" 
              prop="number" 
              sortable 
              :show-overflow-tooltip="false"
              min-width="120"
            >
              <template #default="scope">
                <div class="table-cell-text">{{ scope.row.number }}</div>
              </template>
            </el-table-column>
            <el-table-column 
              label="商品名称" 
              align="center" 
              prop="name" 
              sortable 
              :show-overflow-tooltip="false"
              min-width="200"
            >
              <template #default="scope">
                <div class="table-cell-text">{{ scope.row.name }}</div>
              </template>
            </el-table-column>
            <el-table-column label="参考成本" align="center" prop="costprice" sortable width="100"/>
            <el-table-column label="采购价" align="center" prop="purchaseprice" sortable width="100"/>
            <el-table-column label="零售价" align="center" prop="retailprice" sortable width="100"/>
            <el-table-column label="可用库存" align="center" prop="qtyinv" sortable width="100"/>
          </el-table>

          <pagination
            v-show="total>0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
          />
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup name="Product">
import { listProduct, listProductCategoryTree } from "@/api/kingdee/product";
import { Picture, Folder, FolderOpened, DArrowLeft, DArrowRight } from '@element-plus/icons-vue'
import { onMounted, onBeforeMount, ref, reactive, toRefs } from 'vue';

const {proxy} = getCurrentInstance();

const productList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    rk: null,
    fseq: null,
    url: null,
    number: null,
    name: null,
    costprice: null,
    purchaseprice: null,
    retailprice: null,
    qtyinv: null,
    parentName: null,
  },
  rules: {}
});

const {queryParams, form, rules} = toRefs(data);

const categoryName = ref('');
const categoryOptions = ref([]);

// 添加表格高度计算
const tableHeight = ref(0);

// 添加左侧面板宽度控制
const leftWidth = ref(250); // 初始宽度
const minWidth = 200; // 最小宽度
const maxWidth = 600; // 最大宽度

// 计算表格高度
function calculateTableHeight() {
  const windowHeight = window.innerHeight;
  // 减去其他元素的高度(头部、搜索栏、分页等)
  tableHeight.value = windowHeight - 280;
}

// 监听窗口大小变化
function handleResize() {
  calculateTableHeight();
}

onBeforeMount(() => {
  window.addEventListener('resize', handleResize);
  calculateTableHeight();
});

function getCategoryOptions() {
  listProductCategoryTree().then(response => {
    // 添加"全部"选项
    categoryOptions.value = [{
      name: '全部',
      number: 'all',
      isAll: true,
      children: response.data
    }];
  });
}

function handleCategoryClick(data, node) {
  if (data.number === 'all') {
    queryParams.value.parentName = null;
  } else {
    queryParams.value.parentName = data.name;
  }
  // 切换展开/收起状态
  node.expanded = !node.expanded;
  handleQuery();
}

// 分类树过滤功能实现
function filterCategory() {
  if (!categoryName.value) {
    getCategoryOptions();
    return;
  }
  
  const filterNode = (value, data) => {
    if (!value) return true;
    return data.name.indexOf(value) !== -1;
  };
  
  proxy.$refs.categoryTree.filter(filterNode);
}

onMounted(() => {
  getCategoryOptions();
});

/** 查询金蝶商品信息列表 */
function getList() {
  loading.value = true;
  listProduct(queryParams.value).then(response => {
    productList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    rk: null,
    fseq: null,
    barcode: null,
    url: null,
    number: null,
    name: null,
    costprice: null,
    purchaseprice: null,
    retailprice: null,
    saleprice4: null,
    saleprice5: null,
    saleprice6: null,
    saleprice7: null,
    saleprice8: null,
    saleprice9: null,
    saleprice10: null,
    qtyinv: null,
    ispurchase: null,
    issale: null,
    isassembly: null,
    isbackflushed: null,
    isoutsource: null,
    isselfrestraint: null,
    issubpart: null,
    isweight: null,
    maxpurchaseprice: null,
    costmethod: null,
    intaxrate: null,
    cprop: null,
    parentName: null,
    backflushedSpaceidName: null,
    backflushedStockidName: null,
    spaceidName: null,
    s: null,
    createdAt: null
  };
  proxy.resetForm("productRef");
}

/** 排序变化处理函数 */
function handleSortChange({prop, order}) {
  // 更新查询参数
  queryParams.value.orderByColumn = prop;
  queryParams.value.isAsc = order === 'ascending' ? 'asc' : 'desc';
  getList();  // 重新获取列表数据
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  categoryName.value = '';
  queryParams.value.parentName = null;
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.rk);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('kingdee/product/export', {
    ...queryParams.value
  }, `product_${new Date().getTime()}.xlsx`)
}

// 处理拖动逻辑
function startResize(e) {
  e.preventDefault();
  const resizeContainer = document.querySelector('.split-container');
  resizeContainer.classList.add('resizing');
  
  const startX = e.clientX;
  const startWidth = leftWidth.value;

  function onMouseMove(e) {
    e.preventDefault();
    const newWidth = startWidth + (e.clientX - startX);
    leftWidth.value = Math.min(Math.max(newWidth, minWidth), maxWidth);
  }

  function onMouseUp() {
    resizeContainer.classList.remove('resizing');
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    // 触发窗口resize事件以更新表格高度
    window.dispatchEvent(new Event('resize'));
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

getList();
</script>

<style scoped>
.app-container {
  padding: 10px;
  height: calc(100vh - 84px);
}

.h-100 {
  height: 100%;
}

.split-container {
  display: flex;
  height: 100%;
  position: relative;
}

.left-panel {
  flex-shrink: 0;
  transition: width 0.1s ease-out;
}

.right-panel {
  flex: 1;
  overflow: hidden;
  margin-left: 20px; /* 增加间距，给分隔条留出空间 */
  transition: margin-left 0.1s ease-out;
}

.resizer {
  position: absolute;
  width: 20px;
  height: 100px;
  background-color: var(--el-color-primary-light-9);
  border: 1px solid var(--el-border-color-light);
  border-radius: 3px;
  cursor: col-resize;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  z-index: 100;
  top: 50%;
  transform: translateY(-50%);
  transition: background-color 0.3s, left 0.1s;
}

.resizer:hover {
  background-color: var(--el-color-primary-light-7);
}

.resizer .resize-icon {
  color: var(--el-color-primary);
  font-size: 14px;
}

/* 优化拖动时的效果 */
.split-container.resizing {
  cursor: col-resize;
  user-select: none;
}

.split-container.resizing .resizer {
  background-color: var(--el-color-primary-light-5);
}

.left-panel .box-card,
.right-panel .box-card {
  height: 100%;
  margin: 0;
  position: relative;
  z-index: 1;
}

.card-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
  background-color: #fff;
}

.header-title {
  font-size: 15px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
  display: block;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 20px;
}

:deep(.el-card__body) {
  height: calc(100% - 50px); /* 减去头部高度 */
  overflow: auto;
}

:deep(.el-tree) {
  background: none;
  height: 100%;
  overflow: auto;
}

.custom-tree-node {
  display: flex;
  align-items: center;
  gap: 4px;
}

:deep(.el-tree-node__content) {
  height: 32px;
}

:deep(.el-tree-node__content:hover) {
  background-color: var(--el-tree-node-hover-bg-color);
}

:deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: var(--el-tree-node-hover-bg-color);
  color: var(--el-color-primary);
}

:deep(.el-card__header) {
  padding: 0;
  flex-shrink: 0;
}

/* 添加表格单元格自动换行样式 */
.table-cell-text {
  white-space: pre-wrap;
  word-break: break-all;
  line-height: 1.5;
  text-align: center;
}

:deep(.el-table__cell) {
  padding: 8px 0;
}

:deep(.el-table .cell) {
  padding: 0 8px;
}

/* 设置表格行高度自适应 */
:deep(.el-table__row) {
  height: auto;
}
</style>
