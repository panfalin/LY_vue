<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="98px">
      <el-form-item label="年份" prop="year">
        <el-select
            v-model="queryParams.year"
            placeholder="请选择年份"
            clearable
            style="width: 193px"
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
            style="width: 193px"
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
<!--       新增的订单类型下拉框-->
      <el-form-item label="订单类型" prop="category">
        <el-select
            v-model="queryParams.category"
            placeholder="请选择订单类型"
            clearable
            style="width: 200px"
        >
          <el-option
              label="全托管-仓发"
              value="全托管-仓发"
          />
          <el-option
              label="全托管-JIT"
              value="全托管-JIT"
          />
          <el-option
              label="半托管-JIT"
              value="半托管-JIT"
          />
          <el-option
              label="半托管-仓发"
              value="半托管-仓发"
          />
          <el-option
              label="POP-自发"
              value="POP-自发"
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
          v-hasPermi="['statistics:statistics:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="statisticsList" @selection-change="handleSelectionChange "@sort-change="handleSortChange" >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="年份" align="center" prop="year" sortable width="60" />
      <el-table-column label="月份" align="center" prop="moon" sortable width="60" />
      <el-table-column label="SKU" align="center" prop="sku" sortable width="120"/>
      <el-table-column label="SKU负责人" align="center" prop="personCharge" sortable/>
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

    <!-- 在最后添加浮动的汇总卡片 -->
    <div class="floating-summary" v-show="summaryList">
      <el-card class="summary-card">
        <el-table 
          :data="transformedSummaryData" 
          :show-header="true" 
          size="small" 
          style="width: 100%"
          :border="true"
          class="summary-table"
        >
          <el-table-column 
            prop="label" 
            label="" 
            width="120" 
            align="center"
            fixed="left"
          />
          <el-table-column 
            v-for="(item, index) in summaryList" 
            :key="index"
            :label="item.category"
            align="center"
            :class-name="index === 0 ? 'total-column' : ''"
          >
            <template #default="{ row }">
              <template v-if="row.type === 'quantity'">
                <span>{{ item.quantity }}</span>
                <span v-if="index !== 0" class="percentage">
                  ({{ ((item.quantity / summaryList[0].quantity) * 100).toFixed(2) }}%)
                </span>
              </template>
              <template v-else-if="row.type === 'amount'">
                <span>¥{{ item.loanAmount?.toFixed(2) }}</span>
                <span v-if="index !== 0" class="percentage">
                  ({{ ((item.loanAmount / summaryList[0].loanAmount) * 100).toFixed(2) }}%)
                </span>
              </template>
              <template v-else-if="row.type === 'profit'">
                <span :class="{'negative': item.actualProfit < 0}">
                  ¥{{ item.actualProfit?.toFixed(2) }}
                </span>
                <span v-if="index !== 0" class="percentage">
                  ({{ ((item.actualProfit / summaryList[0].actualProfit) * 100).toFixed(2) }}%)
                </span>
              </template>
              <template v-else-if="row.type === 'profitMargin'">
                <span :class="{'negative': item.profitMargin < 0}">
                  {{ item.profitMargin?.toFixed(2) }}%
                </span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>


  
</template>

<script setup name="Statistics">
import { listStatistics, getStatistics, delStatistics, addStatistics, updateStatistics,listStatisticsToal} from "@/api/statistics/statistics";

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
const summaryList = ref(null);

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

  // 获取汇总数据（不带分页参数）
  const totalQueryParams = { ...queryParams.value };
  delete totalQueryParams.pageNum;
  delete totalQueryParams.pageSize;
  
  listStatisticsToal(totalQueryParams).then(response => {
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

// 添加滚动处理
import { onMounted, onUnmounted } from 'vue';

let scrollTimer = null;
const handleScroll = () => {
  const summary = document.querySelector('.floating-summary');
  if (!summary) return;
  
  // 添加滚动时的类
  summary.classList.add('scrolling');
  
  // 清除之前的定时器
  if (scrollTimer) clearTimeout(scrollTimer);
  
  // 设置新的定时器
  scrollTimer = setTimeout(() => {
    summary.classList.remove('scrolling');
  }, 150);
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  if (scrollTimer) clearTimeout(scrollTimer);
});

const transformedSummaryData = computed(() => [
  { label: '单量', type: 'quantity' },
  { label: '销售额', type: 'amount' },
  { label: '利润', type: 'profit' },
  { label: '利润率', type: 'profitMargin' }
]);
</script>

<style scoped>
.floating-summary {
  position: fixed;
  bottom: 0;
  left: 200px; /* 左侧菜单展开时的宽度 */
  right: 0;
  z-index: 1000;
  padding: 0 10px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 20%);
  opacity: 0;
  transition: all 0.3s ease-in-out;
}

/* 当左侧菜单收起时的样式 */
.hideSidebar .floating-summary {
  left: 54px; /* 收起时左侧菜单的宽度 */
}

.floating-summary:not(:empty) {
  opacity: 1;
}

.summary-card {
  margin-bottom: 20px;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  background-color: #fff;
  pointer-events: auto;
  transition: all 0.3s ease-in-out;
}

.summary-table {
  margin: 0;
  background-color: transparent;
}

/* 总计列样式 */
.summary-table .total-column {
  background-color: #f0f9eb;
  font-weight: bold;
}

.summary-table .percentage {
  color: #909399;
  font-size: 12px;
  margin-left: 4px;
}

/* .summary-table .negative {
  color: #f56c6c;
} */

/* 确保表格内容垂直居中 */
.summary-table .el-table__cell {
  vertical-align: middle;
}

/* 自定义表格边框和分割线颜色 */
.summary-table.el-table--border,
.summary-table.el-table--group {
  border-color: #EBEEF5;
}

.summary-table .el-table__cell {
  border-color: #EBEEF5;
}

/* 调整总计列的样式 */
.summary-table .el-table__cell.total-column {
  background-color: #f0f9eb;
}

.summary-table .el-table__header th.total-column {
  background-color: #f0f9eb;
  font-weight: bold;
}

/* 确保有足够的底部空间 */
.app-container {
  padding-bottom: 200px;
  min-height: 100vh;
}

@media screen and (max-width: 1400px) {
  .floating-summary {
    left: 80px;
  }
}

.percentage {
  font-size: 12px;
  color: #909399;
  margin-left: 4px;
}

.floating-table {
  position: fixed;
  bottom: 0;
  left: 200px; /* 左侧菜单栏的宽度 */
  right: 0;
  z-index: 1000;
  background: #fff;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
}

/* 当左侧菜单收起时的样式 */
.hideSidebar .floating-table {
  left: 54px; /* 收起时左侧菜单的宽度 */
}

/* 其他样式保持不变 */
.floating-table.el-table {
  --el-table-header-bg-color: #f5f7fa;
  --el-table-border-color: #ebeef5;
  --el-table-header-text-color: #606266;
}


</style>
