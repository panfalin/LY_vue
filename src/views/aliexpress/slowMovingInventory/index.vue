<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="滞销SKU" prop="sku" label-width="80px">
        <el-input
          v-model="queryParams.sku"
          placeholder="请输入滞销SKU"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="可用库存" prop="availableStock">
        <el-input
          v-model="queryParams.availableStock"
          placeholder="请输入可用库存"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="pop日均市场容量" prop="popDailyMarketCapacity">
        <el-input
          v-model="queryParams.popDailyMarketCapacity"
          placeholder="请输入pop日均市场容量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="全托管日均市场容量" prop="fullManagementDailyMarketCapacity">
        <el-input
          v-model="queryParams.fullManagementDailyMarketCapacity"
          placeholder="请输入全托管日均市场容量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="半托管日均市场容量" prop="halfManagementDailyMarketCapacity">
        <el-input
          v-model="queryParams.halfManagementDailyMarketCapacity"
          placeholder="请输入半托管日均市场容量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="竞对热销国家" prop="competitorHotSalesCountries">
        <el-input
          v-model="queryParams.competitorHotSalesCountries"
          placeholder="请输入竞对热销国家"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="竞对热销价格" prop="competitorHotSalesPrice">
        <el-input
          v-model="queryParams.competitorHotSalesPrice"
          placeholder="请输入竞对热销价格"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="市场平均售价" prop="marketAveragePrice">
        <el-input
          v-model="queryParams.marketAveragePrice"
          placeholder="请输入市场平均售价"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="对比我们刊登的价格" prop="priceComparison">
        <el-input
          v-model="queryParams.priceComparison"
          placeholder="请输入对比我们刊登的价格"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="pop在线刊登数" prop="popOnlineListings">
        <el-input
          v-model="queryParams.popOnlineListings"
          placeholder="请输入pop在线刊登数"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="全托管在线刊登数" prop="fullManagementOnlineListings">
        <el-input
          v-model="queryParams.fullManagementOnlineListings"
          placeholder="请输入全托管在线刊登数"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="半托管在线刊登数" prop="halfManagementOnlineListings">
        <el-input
          v-model="queryParams.halfManagementOnlineListings"
          placeholder="请输入半托管在线刊登数"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="推荐操作" prop="recommendedAction">
        <el-input
          v-model="queryParams.recommendedAction"
          placeholder="请输入推荐操作"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作完成时间" label-width="100px" style="width: 308px">
        <el-date-picker
          v-model="daterangeCompletedAt"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['aliexpress:slowMovingInventory:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['aliexpress:slowMovingInventory:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['aliexpress:slowMovingInventory:remove']"
        >删除</el-button>
      </el-col>
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
      :data="slowMovingInventoryList"
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
        label="滞销SKU"
        align="center"
        prop="sku"
        sortable="custom"
        width="240"
        fixed
        show-overflow-tooltip
      />
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
      <el-table-column label="市场平均售价" align="center" prop="marketAveragePrice"  width="120"/>
      <el-table-column label="我们刊登的价格" align="center" prop="priceComparison" width="140"/>
      <el-table-column label="pop在线刊登数" align="center" prop="popOnlineListings" width="120" />
      <el-table-column label="全托管在线刊登数" align="center" prop="fullManagementOnlineListings" width="120" />
      <el-table-column label="半托管在线刊登数" align="center" prop="halfManagementOnlineListings"  width="120"/>
      <el-table-column label="推荐操作" align="center" prop="recommendedAction" />
      <el-table-column label="操作状态" align="center" prop="status" />
      <el-table-column label="操作完成时间" align="center" prop="completedAt" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.completedAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作日志" align="center" prop="operationLog" />
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
        <el-table-column label="滞销SKU数量" align="center">
          <template #default="scope">
            {{ scope.row.skuTotal }}
          </template>
        </el-table-column>
        <el-table-column label="滞销商品总数" align="center">
          <template #default="scope">
            {{ scope.row.totalWarehouse }}
          </template>
        </el-table-column>
        <el-table-column label="滞销产品总金额" align="center">
          <template #default="scope">
            ¥{{ parseFloat(scope.row.totalWarehouseCost).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加或修改速卖通滞销SKU分析对话框 -->
<!--    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="slowMovingInventoryRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="滞销SKU" prop="sku">
          <el-input v-model="form.sku" placeholder="请输入滞销SKU" />
        </el-form-item>
        <el-form-item label="可用库存" prop="availableStock">
          <el-input v-model="form.availableStock" placeholder="请输入可用库存" />
        </el-form-item>
        <el-form-item label="pop日均市场容量" prop="popDailyMarketCapacity">
          <el-input v-model="form.popDailyMarketCapacity" placeholder="请输入pop日均市场容量" />
        </el-form-item>
        <el-form-item label="全托管日均市场容量" prop="fullManagementDailyMarketCapacity">
          <el-input v-model="form.fullManagementDailyMarketCapacity" placeholder="请输入全托管日均市场容量" />
        </el-form-item>
        <el-form-item label="半托管日均市场容量" prop="halfManagementDailyMarketCapacity">
          <el-input v-model="form.halfManagementDailyMarketCapacity" placeholder="请输入半托管日均市场容量" />
        </el-form-item>
        <el-form-item label="竞对热销国家" prop="competitorHotSalesCountries">
          <el-input v-model="form.competitorHotSalesCountries" placeholder="请输入竞对热销国家" />
        </el-form-item>
        <el-form-item label="竞对热销价格" prop="competitorHotSalesPrice">
          <el-input v-model="form.competitorHotSalesPrice" placeholder="请输入竞对热销价格" />
        </el-form-item>
        <el-form-item label="市场平均售价" prop="marketAveragePrice">
          <el-input v-model="form.marketAveragePrice" placeholder="请输入市场平均售价" />
        </el-form-item>
        <el-form-item label="对比我们刊登的价格" prop="priceComparison">
          <el-input v-model="form.priceComparison" placeholder="请输入对比我们刊登的价格" />
        </el-form-item>
        <el-form-item label="pop在线刊登数" prop="popOnlineListings">
          <el-input v-model="form.popOnlineListings" placeholder="请输入pop在线刊登数" />
        </el-form-item>
        <el-form-item label="全托管在线刊登数" prop="fullManagementOnlineListings">
          <el-input v-model="form.fullManagementOnlineListings" placeholder="请输入全托管在线刊登数" />
        </el-form-item>
        <el-form-item label="半托管在线刊登数" prop="halfManagementOnlineListings">
          <el-input v-model="form.halfManagementOnlineListings" placeholder="请输入半托管在线刊登数" />
        </el-form-item>
        <el-form-item label="推荐操作" prop="recommendedAction">
          <el-input v-model="form.recommendedAction" placeholder="请输入推荐操作" />
        </el-form-item>
        <el-form-item label="操作完成时间" prop="completedAt">
          <el-date-picker clearable
            v-model="form.completedAt"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择操作完成时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="操作日志" prop="operationLog">
          <el-input v-model="form.operationLog" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="创建人" prop="createdBy">
          <el-input v-model="form.createdBy" placeholder="请输入创建人" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createdAt">
          <el-date-picker clearable
            v-model="form.createdAt"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="更新人" prop="updatedBy">
          <el-input v-model="form.updatedBy" placeholder="请输入更新人" />
        </el-form-item>
        <el-form-item label="更新时间" prop="updatedAt">
          <el-date-picker clearable
            v-model="form.updatedAt"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择更新时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>-->
  </div>
</template>

<script setup name="SlowMovingInventory">
import { listSlowMovingInventory, getSlowMovingInventory, delSlowMovingInventory, addSlowMovingInventory, updateSlowMovingInventory ,listSlowMovingInventoryTotal} from "@/api/aliexpress/slowMovingInventory";

const { proxy } = getCurrentInstance();

const slowMovingInventoryList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const daterangeCompletedAt = ref([]);
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

/** 查询速卖通滞销SKU分析列表 */
function getList() {
  loading.value = true;
  queryParams.value.params = {};
  if (null != daterangeCompletedAt && '' != daterangeCompletedAt) {
    queryParams.value.params["beginCompletedAt"] = daterangeCompletedAt.value[0];
    queryParams.value.params["endCompletedAt"] = daterangeCompletedAt.value[1];
  }
  
  // 使用 Promise.all 同时调用两个接口
  Promise.all([
    listSlowMovingInventory(queryParams.value),
    listSlowMovingInventoryTotal(queryParams.value)
  ]).then(([listResponse, totalResponse]) => {
    console.log("123123===>",totalResponse)

    slowMovingInventoryList.value = listResponse.rows;
    total.value = listResponse.total;
    // 处理总计数据
    totalData.value = totalResponse.rows[0];
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
    createdBy: null,
    createdAt: null,
    updatedBy: null,
    updatedAt: null
  };
  proxy.resetForm("slowMovingInventoryRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  daterangeCompletedAt.value = [];
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
  title.value = "添加速卖通滞销SKU分析";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getSlowMovingInventory(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改速卖通滞销SKU分析";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["slowMovingInventoryRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateSlowMovingInventory(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addSlowMovingInventory(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除速卖通滞销SKU分析编号为"' + _ids + '"的数据项？').then(function() {
    return delSlowMovingInventory(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('aliexpress/slowMovingInventory/export', {
    ...queryParams.value
  }, `slowMovingInventory_${new Date().getTime()}.xlsx`)
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
