<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="清仓SKU" prop="sku" label-width="80px">
        <el-input
            v-model="queryParams.sku"
            placeholder="请输入清仓SKU"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['aliexpress:slowMovingInventory:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
        v-loading="loading"
        :data="clearanceList"
        height="600"
        style="min-width: 1500px;"
        :estimated-row-height="40"
        highlight-current-row
        border
        @selection-change="handleSelectionChange"
        :row-class-name="getTableRowClass"
        :default-sort="{ prop: 'sku', order: 'ascending' }"
        @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="55" align="center" fixed />
      <el-table-column
          label="清仓SKU"
          align="center"
          prop="sku"
          sortable="custom"
          width="240"
          fixed
          show-overflow-tooltip
      />
      <el-table-column
          label="商品名称"
          align="center"
          prop="skuName"
          sortable="custom"
          width="240"
          fixed
          show-overflow-tooltip
      />
      <el-table-column
          label="图片"
          align="center"
          prop="stockImageUrl"
          width="140"
          fixed
      >

        <template #default="scope">
          <img :src="getProxiedImageUrl(scope.row.stockImageUrl)" alt="图片" style="width: 80px; height: 80px;" />
        </template>

      </el-table-column>
      <el-table-column label="重量" align="center" prop="weight" sortable="custom" width="140"/>
      <!-- 库存相关列 -->
      <el-table-column label="库存" align="center">
        <el-table-column label="成本单价" align="center" prop="warehouseCost" sortable="custom" width="100"/>
        <el-table-column label="成本总价" align="center" prop="totalWarehouseCost" sortable="custom" width="100"/>
        <el-table-column label="本地采购在途" align="center" prop="localInTransitQuantity" sortable="custom" width="100"/>
        <el-table-column label="本地可用" align="center" prop="localAvailableQuantity" sortable="custom" width="100"/>
        <el-table-column label="本地库存" align="center" prop="totalStock" sortable="custom" width="100"/>
        <el-table-column label="备仓在途" align="center" prop="backupInTransitQuantity" sortable="custom" width="100"/>
        <el-table-column label="半托管备仓可用" align="center" prop="halfManagementBackupAvailableQuantity" sortable="custom" width="120"/>
        <el-table-column label="全托管备仓可用" align="center" prop="fullManagementBackupAvailableQuantity" sortable="custom" width="120"/>
      </el-table-column>
      <el-table-column label="pop日均市场容量" align="center" prop="popDailyMarketCapacity" sortable="custom" width="140"/>
      <el-table-column label="全托管日均市场容量" align="center" prop="fullManagementDailyMarketCapacity" sortable="custom" width="150"/>
      <el-table-column label="半托管日均市场容量" align="center" prop="halfManagementDailyMarketCapacity" sortable="custom" width="150"/>
      <el-table-column label="竞对热销国家" align="center" prop="competitorHotSalesCountries" width="250"/>
      <el-table-column label="竞对热销价格" align="center" prop="competitorHotSalesPrice" width="350"/>
      <el-table-column label="市场最低价" align="center" prop="marketAveragePrice"  width="120"/>
      <el-table-column label="建议指导价格" align="center" prop="priceComparison" width="140"/>
      <el-table-column label="pop在线刊登数" align="center" prop="popOnlineListings" width="120" />
      <el-table-column label="全托管在线刊登数" align="center" prop="fullManagementOnlineListings" width="120" />
      <el-table-column label="半托管在线刊登数" align="center" prop="halfManagementOnlineListings"  width="120"/>
      <el-table-column label="推荐操作" align="center" prop="recommendedAction" width="340" />
      <el-table-column label="操作状态" align="center" prop="status" />
      <el-table-column label="操作完成时间" align="center" prop="completedAt" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.completedAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['aliexpress:slowMovingInventory:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['aliexpress:slowMovingInventory:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- 添加统计浮框 -->
    <div class="statistics-float">
      <el-table :data="[totalData]" size="small" border>
        <el-table-column label="清仓SKU数量" align="center">
          <template #default="scope">
            {{ scope.row.skuTotal }}
          </template>
        </el-table-column>
        <el-table-column label="清仓商品总数" align="center">
          <template #default="scope">
            {{ scope.row.totalWarehouse }}
          </template>
        </el-table-column>
        <el-table-column label="清仓产品总金额" align="center">
          <template #default="scope">
            ¥{{ parseFloat(scope.row.totalWarehouseCost).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup name="Clearance">
import { listClearance, getClearance, delClearance, addClearance, updateClearance, listClearanceTotal} from "@/api/aliexpress/clearance";

const { proxy } = getCurrentInstance();

const clearanceList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const totalData = ref({
  skuTotal: 0,
  totalWarehouse: 0,
  totalWarehouseCost: 0
});

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    sku: null,
    availableStock: null,
    popDailyMarketCapacity: null,
    fullManagementDailyMarketCapacity: null,
    halfManagementDailyMarketCapacity: null,
    competitorHotSalesCountries: null,
    competitorHotSalesPrice: null,
    marketAveragePrice: null,
    priceComparison: null,
    popOnlineListings: null,
    fullManagementOnlineListings: null,
    halfManagementOnlineListings: null,
    recommendedAction: null,
    status: null,
    completedAt: null,
    operationLog: null,
  },
  rules: {
    sku: [
      { required: true, message: "滞销SKU不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);
const getProxiedImageUrl = (url) => {
  if (!url) return '';
  // 使用 images.weserv.nl 代理服务
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&default=https://via.placeholder.com/80x80?text=No+Image`;
};

function getList() {
  loading.value = true;
  queryParams.value.params = {};

  // 使用 Promise.all 同时调用两个接口
  Promise.all([
    listClearance(queryParams.value),
    listClearanceTotal(queryParams.value)
  ]).then(([listResponse, totalResponse]) => {
    clearanceList.value = listResponse.rows;
    total.value = listResponse.total;
    
    // 修改判断条件，检查 totalResponse.rows
    if (totalResponse && totalResponse.rows && totalResponse.rows.length > 0) {
      totalData.value = {
        skuTotal: totalResponse.rows[0].skuTotal,
        totalWarehouse: totalResponse.rows[0].totalWarehouse,
        totalWarehouseCost: totalResponse.rows[0].totalWarehouseCost
      };
    }

    loading.value = false;
  }).catch(error => {
    loading.value = false;
    proxy.$modal.msgError("获取数据失败");
    console.error(error);
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
    id: null,
    sku: null,
    skuName: null,
    weight: null,
    skuStatus: null,
    stockImageUrl: null,
    totalStock: null,
    localInTransitQuantity: null,
    localAvailableQuantity: null,
    backupInTransitQuantity: null,
    halfManagementBackupAvailableQuantity: null,
    fullManagementBackupAvailableQuantity: null,
    warehouseCost: null,
    totalWarehouseCost: null,
    salesLast7Days: null,
    salesLast28Days: null,
    salesLast42Days: null,
    popDailyMarketCapacity: null,
    fullManagementDailyMarketCapacity: null,
    halfManagementDailyMarketCapacity: null,
    competitorHotSalesCountries: null,
    competitorHotSalesPrice: null,
    marketAveragePrice: null,
    priceComparison: null,
    popOnlineListings: null,
    fullManagementOnlineListings: null,
    halfManagementOnlineListings: null,
    recommendedAction: null,
    status: null,
    completedAt: null,
    operationLog: null,
    createdBy: null,
    createdAt: null,
    updatedBy: null,
    updatedAt: null
  };
  proxy.resetForm("clearanceRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加清仓库存";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getClearance(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改清仓库存";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["clearanceRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateClearance(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addClearance(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除清仓库存编号为"' + _ids + '"的数据项？').then(function() {
    return delClearance(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('aliexpress/clearance/export', {
    ...queryParams.value
  }, `clearance_${new Date().getTime()}.xlsx`)
}

function getTableRowClass({ row }) {
  if (row.availableStock <= 0) {
    return 'warning-row';
  }
  return '';
}

function handleSortChange({ prop, order }) {
  queryParams.value.orderByColumn = prop;
  queryParams.value.isAsc = order === 'ascending' ? 'asc' : 'desc';
  getList();
}

getList();
</script>

<style scoped>
:deep(.warning-row) {
  background-color: #fdf5e6;
}

:deep(.el-table .cell) {
  white-space: nowrap;
}

/* 添加浮框样式 */
.statistics-float {
  position: fixed;
  bottom: 5px;  /* 修改这里，从20px改为80px，让它离底部更远 */
  right: 20px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: auto;
  min-width: 95%;
  border-radius: 4px; /* 添加圆角效果 */
}

:deep(.el-table) {
  margin: 0;
}
</style>
