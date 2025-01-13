<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="98px">
      <el-form-item label="年份" prop="year">
        <el-select
            v-model="queryParams.year"
            placeholder="请选择年份"
            clearable
            style="width: 180px"
        >
          <el-option
              v-for="year in yearOptions"
              :key="year"
              :label="year"
              :value="year"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="月份" prop="moon">
        <el-select
            v-model="queryParams.moon"
            placeholder="请选择月份"
            clearable
            style="width: 180px"
        >
          <el-option
              v-for="month in monthOptions"
              :key="month"
              :label="`${month}月`"
              :value="month"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="店铺名称" prop="storeName">
        <el-input
          v-model="queryParams.storeName"
          placeholder="请输入店铺名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <!-- 新增的筛选建议事项下拉框 -->
              <el-form-item label="店铺类型" prop="storeType">
                <el-select
                    v-model="queryParams.storeType"
                    placeholder="请选择店铺类型"
                    clearable
                    style="width: 200px"
                >
                  <el-option
                      label="全托管"
                      value="全托管"
                  />
                  <el-option
                      label="半托管"
                      value="半托管"
                  />
                  <el-option
                      label="POP"
                      value="POP"
                  />
                </el-select>
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
          v-hasPermi="['aliexpress:statistics_shops:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="statistics_shopsList" @selection-change="handleSelectionChange" @sort-change="handleSortChange">
      <el-table-column type="selection" width="55" align="center" />
      <!--      <el-table-column label="主键ID" align="center" prop="sId" />-->
      <el-table-column label="年份" align="center" prop="year" sortable />
      <el-table-column label="月份" align="center" prop="moon" sortable/>
<!--      <el-table-column label="SKU" align="center" prop="sku" sortable  width="120"/>-->

<!--      <el-table-column label="SKU状态" align="center" prop="skuState" sortable width="90"/>-->
      <el-table-column label="店铺名称" align="center" prop="storeName" sortable  width="260"/>

      <!-- 总销售数量、实际总利润和销售总金额 -->
      <el-table-column label="总销售数量" align="center" prop="quantity" sortable width="100"/>
      <!--      <el-table-column label="市场容量" align="center" prop="marketCapacity"sortable width="90" />-->
      <el-table-column label="销售总金额" align="center" prop="loanAmount" sortable width="100"/>
      <el-table-column label="实际总利润" align="center" prop="actualProfit" sortable width="100"/>
      <el-table-column label="利润率%" align="center" prop="profitMargin" sortable width="90">
        <template #default="{ row }">
          {{ row.profitMargin ? `${row.profitMargin}%` : '-' }}
        </template>
      </el-table-column>
      <!-- POP-自发 -->
      <el-table-column label="POP-自发" align="center" class-name="group-parent">
        <el-table-column label="销量" align="center" prop="quantityPop" sortable   class-name="first-column"/>
        <el-table-column label="利润" align="center" prop="actualProfitPop" sortable />
        <el-table-column label="销售金额" align="center" prop="loanAmountPop" sortable width="90"/>
        <el-table-column label="利润率%" align="center" prop="profitMarginPop" sortable width="90"  class-name="last-column">
          <template #default="{ row }">
            {{ row.profitMarginPop ? `${row.profitMarginPop}%` : '-' }}
          </template>
        </el-table-column>

      </el-table-column>

      <!-- 半托管-JIT -->
      <el-table-column label="半托管-JIT" align="center" class-name="group-parent">
        <el-table-column label="销量" align="center" prop="quantityJitHalf" sortable  />
        <el-table-column label="利润" align="center" prop="actualProfitJitHalf" sortable />
        <el-table-column label="销售金额" align="center" prop="loanAmountJitHalf" sortable  width="90"/>
        <el-table-column label="利润率%" align="center" prop="profitMarginJitHalf" sortable width="90"  class-name="last-column">
          <template #default="{ row }">
            {{ row.profitMarginJitHalf ? `${row.profitMarginJitHalf}%` : '-' }}
          </template>
        </el-table-column>
      </el-table-column>

      <!-- 半托管-仓发 -->
      <el-table-column label="半托管-仓发" align="center" class-name="group-parent">
        <el-table-column label="销量" align="center" prop="quantityWarehouseHalf" sortable  />
        <el-table-column label="利润" align="center" prop="actualProfitWarehouseHalf" sortable  />
        <el-table-column label="销售金额" align="center" prop="loanAmountWarehouseHalf" sortable width="90" />
        <el-table-column label="利润率%" align="center" prop="profitMarginWarehouseHalf" sortable width="90" class-name="last-column">
          <template #default="{ row }">
            {{ row.profitMarginWarehouseHalf ? `${row.profitMarginWarehouseHalf}%` : '-' }}
          </template>
        </el-table-column>
      </el-table-column>

      <!-- 全托管-JIT -->
      <el-table-column label="全托管-JIT" align="center"class-name="group-parent">
        <el-table-column label="销量" align="center" prop="quantityAllJit" sortable />
        <el-table-column label="利润" align="center" prop="actualProfitAllJit" sortable />
        <el-table-column label="销售金额" align="center" prop="loanAmountAllJit" sortable width="90"/>
        <el-table-column label="利润率%" align="center" prop="profitMarginAllJit" sortable width="90"class-name="last-column">
          <template #default="{ row }">
            {{ row.profitMarginAllJit ? `${row.profitMarginAllJit}%` : '-' }}
          </template>
        </el-table-column>
      </el-table-column>

      <!-- 全托管-仓发 -->
      <el-table-column label="全托管-仓发" align="center"class-name="group-parent">
        <el-table-column label="销量" align="center" prop="quantityAllWarehouse" sortable />
        <el-table-column label="利润" align="center" prop="actualProfitAllWarehouse" sortable />
        <el-table-column label="销售金额" align="center" prop="loanAmountAllWarehouse" sortable width="90"/>
        <el-table-column label="利润率%" align="center" prop="profitMarginAllWarehouse" sortable width="90"class-name="last-column">
          <template #default="{ row }">
            {{ row.profitMarginAllWarehouse ? `${row.profitMarginAllWarehouse}%` : '-' }}
          </template>
        </el-table-column>
      </el-table-column>



    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改马帮后台导出金额订单数据对话框 -->



<!-- 在最后添加浮动的汇总卡片 -->
  <div class="floating-summary" v-if="summaryList">
      <el-card class="summary-card">
        <el-row :gutter="24" class="summary-content">
          <el-col :span="3" v-for="(item, index) in summaryList" :key="index">
            <div class="summary-item">
              <div class="category-title">{{ item.category }}</div>
              <div class="detail-item">
                <span class="label">销量:</span>
                <span class="value">
                  {{ item.quantity }}
                  <span v-if="index !== 0" class="percentage">
                    ({{ ((item.quantity / summaryList[0].quantity) * 100).toFixed(2) }}%)
                  </span>
                </span>
              </div>
              <div class="detail-item">
                <span class="label">金额:</span>
                <span class="value">
                  ¥{{ item.loanAmount?.toFixed(2) }}
                  <span v-if="index !== 0" class="percentage">
                    ({{ ((item.loanAmount / summaryList[0].loanAmount) * 100).toFixed(2) }}%)
                  </span>
                </span>
              </div>
              <div class="detail-item">
                <span class="label">利润:</span>
                <span class="value" :class="{'negative': item.actualProfit < 0}">
                  ¥{{ item.actualProfit?.toFixed(2) }}
                  <span v-if="index !== 0" class="percentage">
                    ({{ ((item.actualProfit / summaryList[0].actualProfit) * 100).toFixed(2) }}%)
                  </span>
                </span>
              </div>
              <div class="detail-item">
                <span class="label">利润率:</span>
                <span class="value" :class="{'negative': item.profitMargin < 0}">
                  {{ item.profitMargin?.toFixed(2) }}%
                </span>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>

  </div>
</template>

<script setup name="Statistics_shops">
import { listStatistics_shops, getStatistics_shops, delStatistics_shops, addStatistics_shops, updateStatistics_shops,listStatistics_shopsToal } from "@/api/aliexpress/statistics_shops";

const { proxy } = getCurrentInstance();

const statistics_shopsList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const summaryList = ref(null);
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    year: null,
    moon: null,
    storeName: null,
    sku: null,
    skuState: null,
    category: null,
    quantity: null,
    actualProfit: null,
    transitQuantity: null,
    stockQuantity: null,
    bdStockQuantity: null,
    bcStockQuantity: null,
    unshippedQuantity: null,
    inventoryCost: null,
    dailyAvgSales: null,
    loanAmount: null,
    profitMargin: null,
    costPrice: null,
    saleDays: null,
    monthlyReturn: null,
    inventoryTurns: null,
    returnRate: null,
    marketCapacity: null,
    actualProfitPop: null,
    quantityPop: null,
    loanAmountPop: null,
    profitMarginPop: null,
    actualProfitJitHalf: null,
    quantityJitHalf: null,
    loanAmountJitHalf: null,
    profitMarginJitHalf: null,
    actualProfitWarehouseHalf: null,
    quantityWarehouseHalf: null,
    loanAmountWarehouseHalf: null,
    profitMarginWarehouseHalf: null,
    actualProfitAllJit: null,
    quantityAllJit: null,
    loanAmountAllJit: null,
    profitMarginAllJit: null,
    actualProfitAllWarehouse: null,
    quantityAllWarehouse: null,
    loanAmountAllWarehouse: null,
    profitMarginAllWarehouse: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询马帮后台导出金额订单数据列表 */
function getList() {
  loading.value = true;
  listStatistics_shops(queryParams.value).then(response => {
    statistics_shopsList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });


  // 获取汇总数据（不带分页参数）
  const totalQueryParams = { ...queryParams.value };
  delete totalQueryParams.pageNum;
  delete totalQueryParams.pageSize;
  
  listStatistics_shopsToal(totalQueryParams).then(response => {
    // 定义期望的排序顺序
    const orderMap = {
      'POP-自发': 1,
      '半托管-JIT': 2,
      '半托管-仓发': 3,
      '全托管-JIT': 4,
      '全托管-仓发': 5,
      null: 6
    };

    // 计算汇总数据
    const totalData = {
      category: '总计',
      quantity: 0,
      loanAmount: 0,
      actualProfit: 0,
      profitMargin: 0
    };

    // 累加所有数据
    response.rows.forEach(item => {
      totalData.quantity += item.quantity || 0;
      totalData.loanAmount += item.loanAmount || 0;
      totalData.actualProfit += item.actualProfit || 0;
    });

    // 计算总利润率
    totalData.profitMargin = totalData.loanAmount ? 
      (totalData.actualProfit / totalData.loanAmount) * 100 : 0;

    // 对数据进行排序,并将总计放在最前面
    summaryList.value = [
      totalData,
      ...response.rows.sort((a, b) => orderMap[a.category] - orderMap[b.category])
    ];
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
    sId: null,
    year: null,
    moon: null,
    storeName: null,
    sku: null,
    skuState: null,
    category: null,
    quantity: null,
    actualProfit: null,
    transitQuantity: null,
    stockQuantity: null,
    bdStockQuantity: null,
    bcStockQuantity: null,
    unshippedQuantity: null,
    inventoryCost: null,
    dailyAvgSales: null,
    loanAmount: null,
    profitMargin: null,
    costPrice: null,
    saleDays: null,
    monthlyReturn: null,
    inventoryTurns: null,
    returnRate: null,
    marketCapacity: null,
    actualProfitPop: null,
    quantityPop: null,
    loanAmountPop: null,
    profitMarginPop: null,
    actualProfitJitHalf: null,
    quantityJitHalf: null,
    loanAmountJitHalf: null,
    profitMarginJitHalf: null,
    actualProfitWarehouseHalf: null,
    quantityWarehouseHalf: null,
    loanAmountWarehouseHalf: null,
    profitMarginWarehouseHalf: null,
    actualProfitAllJit: null,
    quantityAllJit: null,
    loanAmountAllJit: null,
    profitMarginAllJit: null,
    actualProfitAllWarehouse: null,
    quantityAllWarehouse: null,
    loanAmountAllWarehouse: null,
    profitMarginAllWarehouse: null
  };
  proxy.resetForm("statistics_shopsRef");
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
  ids.value = selection.map(item => item.sId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}


/** 排序变化处理函数 */
function handleSortChange({prop, order}) {
  // 根据排序的字段和顺序更新查询参数
  queryParams.value.orderByColumn = prop;
  queryParams.value.isAsc = order;
  getList();  // 重新获取列表数据
}



/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加马帮后台导出金额订单数据";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _sId = row.sId || ids.value
  getStatistics_shops(_sId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改马帮后台导出金额订单数据";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["statistics_shopsRef"].validate(valid => {
    if (valid) {
      if (form.value.sId != null) {
        updateStatistics_shops(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addStatistics_shops(form.value).then(response => {
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
  const _sIds = row.sId || ids.value;
  proxy.$modal.confirm('是否确认删除马帮后台导出金额订单数据编号为"' + _sIds + '"的数据项？').then(function() {
    return delStatistics_shops(_sIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('aliexpress/statistics_shops/export', {
    ...queryParams.value
  }, `statistics_shops_${new Date().getTime()}.xlsx`)
}

// 添加年份选项（前后5年）
const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    years.push(i)
  }
  return years
})

// 添加月份选项（1-12月）
const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1)

getList();
</script>

<style>
/* 大类的左右边框 */
.el-table .pop-column > .el-table__header-wrapper th.is-leaf,
.el-table .pop-column > .el-table__body-wrapper td {
  position: relative;
}

/* 大类的左边框 */
.el-table .pop-column > .el-table__header-wrapper th.is-leaf:first-child::before,
.el-table .pop-column > .el-table__body-wrapper td:first-child::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: #000;
}

/* 大类的右边框 */
.el-table .pop-column > .el-table__header-wrapper th.is-leaf:last-child::after,
.el-table .pop-column > .el-table__body-wrapper td:last-child::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: #000;
}

/* 小类中销量列的左边框 */
.el-table .pop-column .el-table-column--sales th:first-child,
.el-table .pop-column .el-table-column--sales td:first-child {
  border-left: 3px solid #000 !important;
}

/* 小类中利润率列的右边框 */
.el-table .pop-column .el-table-column--profit-rate th:last-child,
.el-table .pop-column .el-table-column--profit-rate td:last-child {
  border-right: 3px solid #000 !important;
}

/* 分组父列的左右边框 */
.el-table .group-parent {
  border-left: 3px solid #DCDFE6;
  border-right: 3px solid #DCDFE6;
}

/* 第一个子列的左边框 */
.el-table .first-column {
  border-left: 3px solid #DCDFE6 !important;
}

/* 最后一个子列的右边框 */
.el-table .last-column {
  border-right: 3px solid #DCDFE6 !important;
}

/* 确保边框显示 */
.el-table__body td.first-column,
.el-table__header th.first-column {
  border-left: 3px solid #DCDFE6 !important;
}

.el-table__body td.last-column,
.el-table__header th.last-column {
  border-right: 3px solid #DCDFE6 !important;
}

/* 处理边框重叠 */
.el-table .group-parent + .group-parent {
  border-left: none;
}

.floating-summary {
  position: fixed;
  bottom: 0;
  left: 50px;
  right: 0;
  z-index: 1000;
  padding: 0 10px;
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 20%);
  pointer-events: none; /* 允许滚动穿透 */
}

.summary-card {
  margin-bottom: 20px;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  background-color: #fff;
  pointer-events: auto; /* 恢复卡片的交互性 */
}
.summary-content {
  padding: 16px;
  display: flex;
  justify-content: center; /* 让整行内容居中 */
  gap: 20px; /* 卡片之间的间距 */
}


.summary-item {
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 12px;
  height: 100%;
  transition: all 0.3s;
}

.summary-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

.category-title {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #EBEEF5;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
  font-size: 13px;
}

.label {
  color: #909399;
}

.value {
  color: #67c23a;
  font-weight: 500;
  word-break: break-all;
}

.value.negative {
  color: #f56c6c;
}

/* 为了防止内容被浮动卡片遮挡，给主容器添加底部间距 */
.app-container {
  padding-bottom: 500px; /* 增加底部空间，让滚动条可以继续下拉 */
  min-height: 150vh; /* 确保有足够的滚动空间 */
}

/* 添加响应式布局 */
@media screen and (max-width: 1400px) {
  .floating-summary {
    left: 80px; /* 收起的菜单宽度 */
  }
}

/* 添加过渡动画 */
/* .floating-summary {
  transition: all 0.3s ease-in-out;
} */

/* 滚动时的样式 */
/* .floating-summary.scrolling {
  transform: translateY(100%);
} */

.percentage {
  font-size: 12px;
  color: #909399;
  margin-left: 4px;
}
</style>

