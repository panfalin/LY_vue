<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="98px">
      <el-form-item label="年份" prop="year">
        <el-input
          v-model="queryParams.year"
          placeholder="请输入年份"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="月份" prop="moon">
        <el-input
          v-model="queryParams.moon"
          placeholder="请输入月份"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="店铺名称" prop="storeName">
        <el-input
          v-model="queryParams.storeName"
          placeholder="请输入店铺名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="SKU" prop="sku">
        <el-input
          v-model="queryParams.sku"
          placeholder="请输入SKU"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="SKU状态" prop="skuState">
        <el-input
          v-model="queryParams.skuState"
          placeholder="请输入SKU状态"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="可售天数" prop="saleDays">
        <el-input
          v-model="queryParams.saleDays"
          placeholder="请输入可售天数"
          clearable
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

      <!-- POP-自发 -->
      <el-table-column label="POP-自发" align="center">
        <el-table-column label="销量" align="center" prop="quantityPop" sortable />
        <el-table-column label="利润" align="center" prop="actualProfitPop" sortable />
        <el-table-column label="销售金额" align="center" prop="loanAmountPop" sortable width="90"/>
        <el-table-column label="利润率%" align="center" prop="profitMarginPop" sortable width="90">
          <template #default="{ row }">
            {{ row.profitMarginPop ? `${row.profitMarginPop}%` : '-' }}
          </template>
        </el-table-column>

      </el-table-column>

      <!-- 半托管-JIT -->
      <el-table-column label="半托管-JIT" align="center">
        <el-table-column label="销量" align="center" prop="quantityJitHalf" sortable  />
        <el-table-column label="利润" align="center" prop="actualProfitJitHalf" sortable />
        <el-table-column label="销售金额" align="center" prop="loanAmountJitHalf" sortable  width="90"/>
        <el-table-column label="利润率%" align="center" prop="profitMarginJitHalf" sortable width="90">
          <template #default="{ row }">
            {{ row.profitMarginJitHalf ? `${row.profitMarginJitHalf}%` : '-' }}
          </template>
        </el-table-column>
      </el-table-column>

      <!-- 半托管-仓发 -->
      <el-table-column label="半托管-仓发" align="center">
        <el-table-column label="销量" align="center" prop="quantityWarehouseHalf" sortable  />
        <el-table-column label="利润" align="center" prop="actualProfitWarehouseHalf" sortable  />
        <el-table-column label="销售金额" align="center" prop="loanAmountWarehouseHalf" sortable width="90" />
        <el-table-column label="利润率%" align="center" prop="profitMarginWarehouseHalf" sortable width="90">
          <template #default="{ row }">
            {{ row.profitMarginWarehouseHalf ? `${row.profitMarginWarehouseHalf}%` : '-' }}
          </template>
        </el-table-column>
      </el-table-column>

      <!-- 全托管-JIT -->
      <el-table-column label="全托管-JIT" align="center">
        <el-table-column label="销量" align="center" prop="quantityAllJit" sortable />
        <el-table-column label="利润" align="center" prop="actualProfitAllJit" sortable />
        <el-table-column label="销售金额" align="center" prop="loanAmountAllJit" sortable width="90"/>
        <el-table-column label="利润率%" align="center" prop="profitMarginAllJit" sortable width="90">
          <template #default="{ row }">
            {{ row.profitMarginAllJit ? `${row.profitMarginAllJit}%` : '-' }}
          </template>
        </el-table-column>
      </el-table-column>

      <!-- 全托管-仓发 -->
      <el-table-column label="全托管-仓发" align="center">
        <el-table-column label="销量" align="center" prop="quantityAllWarehouse" sortable />
        <el-table-column label="利润" align="center" prop="actualProfitAllWarehouse" sortable />
        <el-table-column label="销售金额" align="center" prop="loanAmountAllWarehouse" sortable width="90"/>
        <el-table-column label="利润率%" align="center" prop="profitMarginAllWarehouse" sortable width="90">
          <template #default="{ row }">
            {{ row.profitMarginAllWarehouse ? `${row.profitMarginAllWarehouse}%` : '-' }}
          </template>
        </el-table-column>
      </el-table-column>

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
<!--      <el-table-column label="在途数量" align="center" prop="transitQuantity" sortable width="90" />-->
<!--      <el-table-column label="本地库存数量" align="center" prop="bdStockQuantity" sortable width="110"/>-->
<!--      <el-table-column label="备仓库存数量" align="center" prop="bcStockQuantity" sortable width="110"/>-->
<!--      <el-table-column label="未发货数量" align="center" prop="unshippedQuantity"sortable width="100"/>-->
<!--      <el-table-column label="库存总数量" align="center" prop="stockQuantity"sortable width="100"/>-->
<!--      <el-table-column label="总库存成本金额" align="center" prop="inventoryCost"sortable width="125"/>-->
<!--      <el-table-column label="日均销量" align="center" prop="dailyAvgSales"sortable width="100" />-->
<!--      <el-table-column label="成本价格" align="center" prop="costPrice"sortable width="90"/>-->
<!--      <el-table-column label="可售天数" align="center" prop="saleDays"sortable width="90"/>-->
<!--      <el-table-column label="月库存资金使用率%" align="center" prop="monthlyReturn" sortable width="150">-->
<!--        <template #default="{ row }">-->
<!--          {{ row.monthlyReturn ? `${row.monthlyReturn}%` : '-' }}-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="库存周转率%" align="center" prop="inventoryTurns" sortable width="110">-->
<!--        <template #default="{ row }">-->
<!--          {{ row.inventoryTurns ? `${row.inventoryTurns}%` : '-' }}-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="回报率%" align="center" prop="returnRate" sortable width="85">-->
<!--        <template #default="{ row }">-->
<!--          {{ row.returnRate ? `${row.returnRate}%` : '-' }}-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改马帮后台导出金额订单数据对话框 -->

  </div>
</template>

<script setup name="Statistics_shops">
import { listStatistics_shops, getStatistics_shops, delStatistics_shops, addStatistics_shops, updateStatistics_shops } from "@/api/aliexpress/statistics_shops";

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

getList();
</script>
