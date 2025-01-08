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
      <el-form-item label="SKU" prop="sku">
        <el-input
          v-model="queryParams.sku"
          placeholder="请输入SKU"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品数量" prop="quantity">
        <el-input
          v-model="queryParams.quantity"
          placeholder="请输入商品数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="实际利润" prop="actualProfit">
        <el-input
          v-model="queryParams.actualProfit"
          placeholder="请输入实际利润"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>


      <el-form-item label="可售天数大于" prop="saleDays">
        <el-input
            v-model="queryParams.saleDays"
            placeholder="请输入可售天数大于"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单类型" prop="category">
        <el-input
            v-model="queryParams.category"
            placeholder="请输入订单类型"
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
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['statistics:statistics:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['statistics:statistics:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['statistics:statistics:remove']"
        >删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['statistics:statistics:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="statisticsList" @selection-change="handleSelectionChange "@sort-change="handleSortChange" >
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="主键ID" align="center" prop="sId" /> -->
      <el-table-column label="年份" align="center" prop="year" sortable width="60" />
      <el-table-column label="月份" align="center" prop="moon" sortable width="60" />
      <el-table-column label="SKU" align="center" prop="sku" sortable width="120"/>
      <el-table-column label="SKU状态" align="center" prop="skuState" sortable/>
      <el-table-column label="订单类型" align="center" prop="category" sortable/>
      <el-table-column label="销售数量" align="center" prop="quantity"sortable />
      <el-table-column label="日均销量" align="center" prop="dailyAvgSales"sortable />
      <el-table-column label="市场容量" align="center" prop="marketCapacity"sortable />
      <el-table-column label="销售金额" align="center" prop="loanAmount"sortable />
      <el-table-column label="实际利润" align="center" prop="actualProfit" sortable/>
      <el-table-column label="利润率%" align="center" prop="profitMargin" sortable>
        <template #default="{ row }">
          {{ row.profitMargin ? `${row.profitMargin}%` : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="成本价格" align="center" prop="costPrice" sortable />
<!--      <el-table-column label="在途数量" align="center" prop="transitQuantity" sortable />-->
<!--&lt;!&ndash;       <el-table-column label="库存数量" align="center" prop="stockQuantity" sortable/> &ndash;&gt;-->
<!--      <el-table-column label="本地库存数量" align="center" prop="bdStockQuantity" sortable width="110"/>-->
<!--      <el-table-column label="备仓库存数量" align="center" prop="bcStockQuantity" sortable width="110"/>-->
<!--      <el-table-column label="未发货数" align="center" prop="unshippedQuantity"sortable  />-->
<!--      <el-table-column label="总库存数量" align="center" prop="stockQuantity" sortable width="100"/>-->
<!--      <el-table-column label="库存金额" align="center" prop="inventoryCost" sortable/>-->
<!--      <el-table-column label="月库存资金使用率%" align="center" prop="monthlyReturn" sortable width="150">-->
<!--      <template #default="{ row }">-->
<!--        {{ row.monthlyReturn === null || row.monthlyReturn === undefined ? '-' : (row.monthlyReturn === 0 ? '0%' : `${row.monthlyReturn}%`) }}-->
<!--      </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="周转率%" align="center" prop="inventoryTurns" sortable >-->
<!--        <template #default="{ row }">-->
<!--          {{ row.inventoryTurns === null || row.inventoryTurns === undefined ? '-' : (row.inventoryTurns === 0 ? '0%' : `${row.inventoryTurns}%`) }}-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="回报率%" align="center" prop="returnRate" sortable >-->
<!--        <template #default="{ row }">-->
<!--          {{ row.returnRate === null || row.returnRate === undefined ? '-' : (row.returnRate === 0 ? '0%' : `${row.returnRate}%`) }}-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="可售天数" align="center" prop="saleDays" sortable/>-->
    
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
      <el-form ref="statisticsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="年份" prop="year">
          <el-input v-model="form.year" placeholder="请输入年份" />
        </el-form-item>
        <el-form-item label="月份" prop="moon">
          <el-input v-model="form.moon" placeholder="请输入月份" />
        </el-form-item>
        <el-form-item label="SKU" prop="sku">
          <el-input v-model="form.sku" placeholder="请输入SKU" />
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
        <el-form-item label="库存数量" prop="stockQuantity">
          <el-input v-model="form.stockQuantity" placeholder="请输入库存数量" />
        </el-form-item>
        <el-form-item label="未发货数" prop="unshippedQuantity">
          <el-input v-model="form.unshippedQuantity" placeholder="请输入未发货数" />
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

<script setup name="Statistics">
import { listStatistics, getStatistics, delStatistics, addStatistics, updateStatistics } from "@/api/statistics/statistics";

const { proxy } = getCurrentInstance();

const statisticsList = ref([]);
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
    quantity: null,
    actualProfit: null,
    transitQuantity: null,
    stockQuantity: null,
    unshippedQuantity: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询马帮后台导出金额订单数据列表 */
function getList() {
  loading.value = true;
  listStatistics(queryParams.value).then(response => {
    statisticsList.value = response.rows;
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
    quantity: null,
    actualProfit: null,
    transitQuantity: null,
    stockQuantity: null,
    unshippedQuantity: null,
    saleDays: null,
    category: null,
  };
  proxy.resetForm("statisticsRef");
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
  getStatistics(_sId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改马帮后台导出金额订单数据";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["statisticsRef"].validate(valid => {
    if (valid) {
      if (form.value.sId != null) {
        updateStatistics(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addStatistics(form.value).then(response => {
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
    return delStatistics(_sIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('statistics/statistics/export', {
    ...queryParams.value
  }, `statistics_${new Date().getTime()}.xlsx`)
}

getList();
</script>
