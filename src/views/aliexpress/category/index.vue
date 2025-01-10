<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="98px">
      <el-form-item label="年份" prop="year">
        <el-select
          v-model="queryParams.year"
          placeholder="请选择年份"
          clearable
          style="width: 150px"
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
          style="width: 150px"
        >
          <el-option
            v-for="month in monthOptions"
            :key="month"
            :label="`${month}月`"
            :value="month"
          />
        </el-select>
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
        <el-select
            v-model="queryParams.skuState"
            placeholder="请选择SKU状态"
            clearable
            style="width: 200px"
        >
          <el-option
              label="停止销售"
              value="停止销售"
          />
          <el-option
              label="商品清仓"
              value="商品清仓"
          />
          <el-option
              label="正常销售"
              value="正常销售"
          />
        </el-select>
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
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['aliexpress:category:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['aliexpress:category:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['aliexpress:category:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['aliexpress:category:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="categoryList" @selection-change="handleSelectionChange" @sort-change="handleSortChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="主键ID" align="center" prop="sId" />-->
      <el-table-column label="年份" align="center" prop="year"sortable />
      <el-table-column label="月份" align="center" prop="moon" sortable/>
      <el-table-column label="SKU" align="center" prop="sku" sortable  width="150"/>
      <el-table-column label="SKU负责人" align="center" prop="personCharge" sortable  width="120"/>
      <el-table-column label="SKU状态" align="center" prop="skuState" sortable width="90"/>
      <!-- 总销售数量、实际总利润和销售总金额 -->
      <el-table-column label="总销售数量" align="center" prop="quantity" sortable width="100"/>
      <el-table-column label="市场容量" align="center" prop="marketCapacity"sortable width="90" />
      <el-table-column label="销售总金额" align="center" prop="loanAmount" sortable width="100"/>
      <el-table-column label="实际总利润" align="center" prop="actualProfit" sortable width="100"/>
      <el-table-column label="利润率%" align="center" prop="profitMargin" sortable width="90">
        <template #default="{ row }">
          {{ row.profitMargin ? `${row.profitMargin}%` : '-' }}
        </template>
      </el-table-column>
      <!-- POP-自发 -->
      <el-table-column label="POP-自发" align="center" class-name="group-parent">
        <el-table-column 
          label="销量" 
          align="center" 
          prop="quantityPop" 
          sortable 
          class-name="first-column"
        />
        <el-table-column label="利润" align="center" prop="actualProfitPop" sortable />
        <el-table-column label="销售金额" align="center" prop="loanAmountPop" sortable width="90"/>
        <el-table-column 
          label="利润率%" 
          align="center" 
          prop="profitMarginPop" 
          sortable 
          width="90"
          class-name="last-column"
        >
          <template #default="{ row }">
            {{ row.profitMarginPop ? `${row.profitMarginPop}%` : '-' }}
          </template>
        </el-table-column>
      </el-table-column>

      <!-- 半托管-JIT -->
      <el-table-column label="半托管-JIT" align="center" class-name="group-parent">
        <el-table-column 
          label="销量" 
          align="center" 
          prop="quantityJitHalf" 
          sortable 
          
        />
        <el-table-column label="利润" align="center" prop="actualProfitJitHalf" sortable />
        <el-table-column label="销售金额" align="center" prop="loanAmountJitHalf" sortable width="90"/>
        <el-table-column 
          label="利润率%" 
          align="center" 
          prop="profitMarginJitHalf" 
          sortable 
          width="90"
          class-name="last-column"
        >
          <template #default="{ row }">
            {{ row.profitMarginJitHalf ? `${row.profitMarginJitHalf}%` : '-' }}
          </template>
        </el-table-column>
      </el-table-column>

      <!-- 半托管-仓发 -->
      <el-table-column label="半托管-仓发" align="center" class-name="group-parent">
        <el-table-column 
          label="销量" 
          align="center" 
          prop="quantityWarehouseHalf" 
          sortable 
         
        />
        <el-table-column label="利润" align="center" prop="actualProfitWarehouseHalf" sortable />
        <el-table-column label="销售金额" align="center" prop="loanAmountWarehouseHalf" sortable width="90"/>
        <el-table-column 
          label="利润率%" 
          align="center" 
          prop="profitMarginWarehouseHalf" 
          sortable 
          width="90"
          class-name="last-column"
        >
          <template #default="{ row }">
            {{ row.profitMarginWarehouseHalf ? `${row.profitMarginWarehouseHalf}%` : '-' }}
          </template>
        </el-table-column>
      </el-table-column>

      <!-- 全托管-JIT -->
      <el-table-column label="全托管-JIT" align="center" class-name="group-parent">
        <el-table-column 
          label="销量" 
          align="center" 
          prop="quantityAllJit" 
          sortable 
         
        />
        <el-table-column label="利润" align="center" prop="actualProfitAllJit" sortable />
        <el-table-column label="销售金额" align="center" prop="loanAmountAllJit" sortable width="90"/>
        <el-table-column 
          label="利润率%" 
          align="center" 
          prop="profitMarginAllJit" 
          sortable 
          width="90"
          class-name="last-column"
        >
          <template #default="{ row }">
            {{ row.profitMarginAllJit ? `${row.profitMarginAllJit}%` : '-' }}
          </template>
        </el-table-column>
      </el-table-column>

      <!-- 全托管-仓发 -->
      <el-table-column label="全托管-仓发" align="center" class-name="group-parent">
        <el-table-column 
          label="销量" 
          align="center" 
          prop="quantityAllWarehouse" 
          sortable 
        
        />
        <el-table-column label="利润" align="center" prop="actualProfitAllWarehouse" sortable />
        <el-table-column label="销售金额" align="center" prop="loanAmountAllWarehouse" sortable width="90"/>
        <el-table-column 
          label="利润率%" 
          align="center" 
          prop="profitMarginAllWarehouse" 
          sortable 
          width="90"
          class-name="last-column"
        >
          <template #default="{ row }">
            {{ row.profitMarginAllWarehouse ? `${row.profitMarginAllWarehouse}%` : '-' }}
          </template>
        </el-table-column>
      </el-table-column>


      <el-table-column label="在途数量" align="center" prop="transitQuantity" sortable width="90" />
      <el-table-column label="本地库存数量" align="center" prop="bdStockQuantity" sortable width="110"/>
      <el-table-column label="备仓库存数量" align="center" prop="bcStockQuantity" sortable width="110"/>
      <el-table-column label="未发货数量" align="center" prop="unshippedQuantity"sortable width="100"/>
      <el-table-column label="库存总数量" align="center" prop="stockQuantity"sortable width="100"/>
      <el-table-column label="总库存成本金额" align="center" prop="inventoryCost"sortable width="125"/>
      <el-table-column label="日均销量" align="center" prop="dailyAvgSales"sortable width="100" />
      <el-table-column label="成本价格" align="center" prop="costPrice"sortable width="90"/>
      <el-table-column label="可售天数" align="center" prop="saleDays"sortable width="90"/>
      <el-table-column label="月库存资金使用率%" align="center" prop="monthlyReturn" sortable width="150">
        <template #default="{ row }">
          {{ row.monthlyReturn ? `${row.monthlyReturn}%` : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="库存周转率%" align="center" prop="inventoryTurns" sortable width="110">
        <template #default="{ row }">
          {{ row.inventoryTurns ? `${row.inventoryTurns}%` : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="回报率%" align="center" prop="returnRate" sortable width="85">
        <template #default="{ row }">
          {{ row.returnRate ? `${row.returnRate}%` : '-' }}
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

    <!-- 添加或修改马帮后台导出金额订单数据对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="categoryRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="年份" prop="year">
          <el-input v-model="form.year" placeholder="请输入年份" />
        </el-form-item>
        <el-form-item label="月份" prop="moon">
          <el-input v-model="form.moon" placeholder="请输入月份" />
        </el-form-item>
        <el-form-item label="SKU" prop="sku">
          <el-input v-model="form.sku" placeholder="请输入SKU" />
        </el-form-item>
        <el-form-item label="SKU状态" prop="skuState">
          <el-input v-model="form.skuState" placeholder="请输入SKU状态" />
        </el-form-item>
        <el-form-item label="订单分类" prop="category">
          <el-input v-model="form.category" placeholder="请输入订单分类" />
        </el-form-item>
        <el-form-item label="商品数量" prop="quantity">
          <el-input v-model="form.quantity" placeholder="请输入商品数量" />
        </el-form-item>
        <el-form-item label="实际利润" prop="actualProfit">
          <el-input v-model="form.actualProfit" placeholder="请输入实际利润" />
        </el-form-item>
        <el-form-item label="在途数量" prop="transitQuantity">
          <el-input v-model="form.transitQuantity" placeholder="请输入在途数量" />
        </el-form-item>
        <el-form-item label="库存总数量" prop="stockQuantity">
          <el-input v-model="form.stockQuantity" placeholder="请输入库存总数量" />
        </el-form-item>
        <el-form-item label="本地库存数量" prop="bdStockQuantity">
          <el-input v-model="form.bdStockQuantity" placeholder="请输入本地库存数量" />
        </el-form-item>
        <el-form-item label="备仓库存数量" prop="bcStockQuantity">
          <el-input v-model="form.bcStockQuantity" placeholder="请输入备仓库存数量" />
        </el-form-item>
        <el-form-item label="未发货数量" prop="unshippedQuantity">
          <el-input v-model="form.unshippedQuantity" placeholder="请输入未发货数量" />
        </el-form-item>
        <el-form-item label="总库存成本金额" prop="inventoryCost">
          <el-input v-model="form.inventoryCost" placeholder="请输入总库存成本金额" />
        </el-form-item>
        <el-form-item label="日均销量" prop="dailyAvgSales">
          <el-input v-model="form.dailyAvgSales" placeholder="请输入日均销量" />
        </el-form-item>
        <el-form-item label="销售金额" prop="loanAmount">
          <el-input v-model="form.loanAmount" placeholder="请输入销售金额" />
        </el-form-item>
        <el-form-item label="利润率" prop="profitMargin">
          <el-input v-model="form.profitMargin" placeholder="请输入利润率" />
        </el-form-item>
        <el-form-item label="成本价格" prop="costPrice">
          <el-input v-model="form.costPrice" placeholder="请输入成本价格" />
        </el-form-item>
        <el-form-item label="可售天数" prop="saleDays">
          <el-input v-model="form.saleDays" placeholder="请输入可售天数" />
        </el-form-item>
        <el-form-item label="月库存资金使用率" prop="monthlyReturn">
          <el-input v-model="form.monthlyReturn" placeholder="请输入月库存资金使用率" />
        </el-form-item>
        <el-form-item label="库存周转率" prop="inventoryTurns">
          <el-input v-model="form.inventoryTurns" placeholder="请输入库存周转率" />
        </el-form-item>
        <el-form-item label="回报率" prop="returnRate">
          <el-input v-model="form.returnRate" placeholder="请输入回报率" />
        </el-form-item>
        <el-form-item label="市场容量" prop="marketCapacity">
          <el-input v-model="form.marketCapacity" placeholder="请输入市场容量" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Category">
import { listCategory, getCategory, delCategory, addCategory, updateCategory } from "@/api/aliexpress/category";

const { proxy } = getCurrentInstance();

const categoryList = ref([]);
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
    marketCapacity: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询马帮后台导出金额订单数据列表 */
function getList() {
  loading.value = true;
  listCategory(queryParams.value).then(response => {
    categoryList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 排序变化处理函数 */
function handleSortChange({prop, order}) {
  // 根据排序的字段和顺序更新查询参数
  queryParams.value.orderByColumn = prop;
  queryParams.value.isAsc = order;
  getList();  // 重新获取列表数据
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
    marketCapacity: null
  };
  proxy.resetForm("categoryRef");
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
  getCategory(_sId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改马帮后台导出金额订单数据";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["categoryRef"].validate(valid => {
    if (valid) {
      if (form.value.sId != null) {
        updateCategory(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addCategory(form.value).then(response => {
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
    return delCategory(_sIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('aliexpress/category/export', {
    ...queryParams.value
  }, `category_${new Date().getTime()}.xlsx`)
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
</style>
