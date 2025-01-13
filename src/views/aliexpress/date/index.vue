<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
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

      <el-form-item label="日期" prop="day">
        <el-select
            v-model="queryParams.day"
            placeholder="请选择日期"
            clearable
            style="width: 180px"
        >
          <el-option
              v-for="day in dayOptions"
              :key="day"
              :label="`${day}`"
              :value="day"
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
          v-hasPermi="['aliexpress:date:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['aliexpress:date:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['aliexpress:date:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['aliexpress:date:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="dateList" @selection-change="handleSelectionChange" @sort-change="handleSortChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="日期" align="center" sortable="custom" prop="date" width="120">
        <template #default="{ row }">
          {{ `${row.year}-${String(row.moon).padStart(2, '0')}-${String(row.day).padStart(2, '0')}` }}
        </template>
      </el-table-column>
      <el-table-column label="店铺名称" align="center" prop="storeName" sortable  width="260"/>
      <!-- 总销售数量、实际总利润和销售总金额 -->
      <el-table-column label="总销售数量" align="center" prop="quantity" sortable width="100"/>
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

    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改时间维度统计对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="dateRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="年份" prop="year">
          <el-input v-model="form.year" placeholder="请输入年份" />
        </el-form-item>
        <el-form-item label="月份" prop="moon">
          <el-input v-model="form.moon" placeholder="请输入月份" />
        </el-form-item>
        <el-form-item label="日期" prop="day">
          <el-input v-model="form.day" placeholder="请输入日期" />
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
        <el-form-item label="POP实际利润" prop="actualProfitPop">
          <el-input v-model="form.actualProfitPop" placeholder="请输入POP实际利润" />
        </el-form-item>
        <el-form-item label="POP销售数量" prop="quantityPop">
          <el-input v-model="form.quantityPop" placeholder="请输入POP销售数量" />
        </el-form-item>
        <el-form-item label="POP销售金额" prop="loanAmountPop">
          <el-input v-model="form.loanAmountPop" placeholder="请输入POP销售金额" />
        </el-form-item>
        <el-form-item label="POP利润率" prop="profitMarginPop">
          <el-input v-model="form.profitMarginPop" placeholder="请输入POP利润率" />
        </el-form-item>
        <el-form-item label="半托管-JIT实际利润" prop="actualProfitJitHalf">
          <el-input v-model="form.actualProfitJitHalf" placeholder="请输入半托管-JIT实际利润" />
        </el-form-item>
        <el-form-item label="半托管-JIT销售数量" prop="quantityJitHalf">
          <el-input v-model="form.quantityJitHalf" placeholder="请输入半托管-JIT销售数量" />
        </el-form-item>
        <el-form-item label="半托管-JIT销售金额" prop="loanAmountJitHalf">
          <el-input v-model="form.loanAmountJitHalf" placeholder="请输入半托管-JIT销售金额" />
        </el-form-item>
        <el-form-item label="半托管-JIT利润率" prop="profitMarginJitHalf">
          <el-input v-model="form.profitMarginJitHalf" placeholder="请输入半托管-JIT利润率" />
        </el-form-item>
        <el-form-item label="半托管-仓发实际利润" prop="actualProfitWarehouseHalf">
          <el-input v-model="form.actualProfitWarehouseHalf" placeholder="请输入半托管-仓发实际利润" />
        </el-form-item>
        <el-form-item label="半托管-仓发销售数量" prop="quantityWarehouseHalf">
          <el-input v-model="form.quantityWarehouseHalf" placeholder="请输入半托管-仓发销售数量" />
        </el-form-item>
        <el-form-item label="半托管-仓发销售金额" prop="loanAmountWarehouseHalf">
          <el-input v-model="form.loanAmountWarehouseHalf" placeholder="请输入半托管-仓发销售金额" />
        </el-form-item>
        <el-form-item label="半托管-仓发利润率" prop="profitMarginWarehouseHalf">
          <el-input v-model="form.profitMarginWarehouseHalf" placeholder="请输入半托管-仓发利润率" />
        </el-form-item>
        <el-form-item label="全托管-JIT实际利润" prop="actualProfitAllJit">
          <el-input v-model="form.actualProfitAllJit" placeholder="请输入全托管-JIT实际利润" />
        </el-form-item>
        <el-form-item label="全托管-JIT销售数量" prop="quantityAllJit">
          <el-input v-model="form.quantityAllJit" placeholder="请输入全托管-JIT销售数量" />
        </el-form-item>
        <el-form-item label="全托管-JIT销售金额" prop="loanAmountAllJit">
          <el-input v-model="form.loanAmountAllJit" placeholder="请输入全托管-JIT销售金额" />
        </el-form-item>
        <el-form-item label="全托管-JIT利润率" prop="profitMarginAllJit">
          <el-input v-model="form.profitMarginAllJit" placeholder="请输入全托管-JIT利润率" />
        </el-form-item>
        <el-form-item label="全托管-仓发实际利润" prop="actualProfitAllWarehouse">
          <el-input v-model="form.actualProfitAllWarehouse" placeholder="请输入全托管-仓发实际利润" />
        </el-form-item>
        <el-form-item label="全托管-仓发销售数量" prop="quantityAllWarehouse">
          <el-input v-model="form.quantityAllWarehouse" placeholder="请输入全托管-仓发销售数量" />
        </el-form-item>
        <el-form-item label="全托管-仓发销售金额" prop="loanAmountAllWarehouse">
          <el-input v-model="form.loanAmountAllWarehouse" placeholder="请输入全托管-仓发销售金额" />
        </el-form-item>
        <el-form-item label="全托管-仓发利润率" prop="profitMarginAllWarehouse">
          <el-input v-model="form.profitMarginAllWarehouse" placeholder="请输入全托管-仓发利润率" />
        </el-form-item>
        <el-form-item label="SKU负责人" prop="personCharge">
          <el-input v-model="form.personCharge" placeholder="请输入SKU负责人" />
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
  <div class="floating-summary" v-if="summaryList">
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

<script setup name="Date">
import { listDate, getDate, delDate, addDate, updateDate } from "@/api/aliexpress/date";
import { listStatistics_shopsToal } from "@/api/aliexpress/statistics_shops";
const { proxy } = getCurrentInstance();

const dateList = ref([]);
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
    day: null,
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
    profitMarginAllWarehouse: null,
    personCharge: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询时间维度统计列表 */
function getList() {
  loading.value = true;
  listDate(queryParams.value).then(response => {
    dateList.value = response.rows;
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
      '全托管-仓发': 5
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


/** 排序变化处理函数 */
function handleSortChange({prop, order}) {
  // 特殊处理日期字段的排序
  if (prop === 'date') {
    // 根据排序方向设置年月日的排序
    queryParams.value.orderByColumn = 'year,moon,day';  // 使用多字段排序
    queryParams.value.isAsc = order;
  } else {
    // 其他字段正常处理
  queryParams.value.orderByColumn = prop;
  queryParams.value.isAsc = order;
  }
  getList();  // 重新获取列表数据
}


// 表单重置
function reset() {
  form.value = {
    sId: null,
    year: null,
    moon: null,
    day: null,
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
    profitMarginAllWarehouse: null,
    personCharge: null
  };
  proxy.resetForm("dateRef");
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
  title.value = "添加时间维度统计";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _sId = row.sId || ids.value
  getDate(_sId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改时间维度统计";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["dateRef"].validate(valid => {
    if (valid) {
      if (form.value.sId != null) {
        updateDate(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addDate(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除时间维度统计编号为"' + _sIds + '"的数据项？').then(function() {
    return delDate(_sIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('aliexpress/date/export', {
    ...queryParams.value
  }, `date_${new Date().getTime()}.xlsx`)
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


// 添加月份选项（1-31日）
const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1)


// 添加转换后的汇总数据计算属性
const transformedSummaryData = computed(() => [
  { label: '单量', type: 'quantity' },
  { label: '销售额', type: 'amount' },
  { label: '利润', type: 'profit' },
  { label: '利润率', type: 'profitMargin' }
]);

getList();
</script>
<style scoped>
/* 浮动汇总样式 */
.floating-summary {
  position: fixed;
  bottom: 0;
  left: 50px;
  right: 0;
  z-index: 1000;
  padding: 0 10px;
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 20%);
  pointer-events: none;
}

.summary-card {
  margin-bottom: 20px;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  background-color: #fff;
  pointer-events: auto;
}

/* 新增表格相关样式 */
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

/* 为了防止内容被浮动卡片遮挡，给主容器添加底部间距 */
.app-container {
  padding-bottom: 200px;
  min-height: 100vh;
}

/* 添加响应式布局 */
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


</style>