<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px"
             style="max-width: 1000px; margin-bottom: 20px;">
      <el-form-item label="店铺" prop="storeName">
        <el-select
            v-model="queryParams.storeName"
            placeholder="请选择店铺"
            clearable
        >
          <el-option
              v-for="store in storeNameOptions"
              :key="store.value"
              :label="store.label"
              :value="store.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="负责人" prop="storeManager">
        <el-select
            v-model="queryParams.storeManager"
            placeholder="请选择负责人"
            clearable
        >
          <el-option
              v-for="manager in storeManagerOptions"
              :key="manager.value"
              :label="manager.label"
              :value="manager.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="4">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['profit:profit:export']"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['profit:profit:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="20">
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-col>
    </el-row>

    <el-table
        v-loading="loading"
        :data="profitList"
        height="500"
        style="min-width: 1500px;"
        :estimated-row-height="40"
        highlight-current-row
        border
        @selection-change="handleSelectionChange"
        :row-class-name="getTableRowClass"
        :default-sort="{ prop: 'storeName', order: 'ascending' }"
        @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column fixed label="店铺" align="center" prop="storeName" width="200" sortable/>
      <el-table-column fixed label="负责人" align="center" prop="storeManager" width="80" sortable/>
      <el-table-column label="订单金额" align="center" prop="orderAmount" width="100" sortable/>
      <el-table-column label="运费" align="center" prop="shippingFee" width="80" sortable/>
      <el-table-column label="其他收入" align="center" prop="otherIncome" width="100" sortable/>
      <el-table-column label="补贴金额" align="center" prop="subsidyAmount" width="100" sortable/>
      <el-table-column label="退货成本" align="center" prop="returnCost" width="80" sortable/>
      <el-table-column label="运费退回" align="center" prop="shippingReturn" width="100" sortable/>
      <el-table-column label="其他店铺收入" align="center" prop="otherStoreIncome" width="120" sortable/>
      <el-table-column label="合计" align="center" prop="total" width="80" sortable/>
      <el-table-column label="订单量" align="center" prop="orderQuantity" width="80" sortable/>
      <el-table-column label="退款订单量" align="center" prop="refundOrderQuantity" width="120" sortable/>
      <el-table-column label="退款金额" align="center" prop="refundAmount" width="80" sortable/>
      <el-table-column label="客单价" align="center" prop="customerUnitPrice" width="80" sortable/>
      <el-table-column label="毛利" align="center" prop="grossProfit" width="80" sortable/>
      <el-table-column label="实际退款USD" align="center" prop="actualRefundUsd" width="80" sortable/>
      <el-table-column label="直通车充值" align="center" prop="directCar" width="120" sortable/>
      <el-table-column label="取消订单" align="center" prop="cancelOrderRmb" width="120" sortable/>
      <el-table-column label="清仓成本补助" align="center" prop="clearanceCostSubsidy" width="120" sortable/>
      <el-table-column label="退款差值" align="center" prop="refundDifference" width="120" sortable/>
      <el-table-column label="直通车花费" align="center" prop="directCarCost" width="120" sortable/>
      <!--<el-table-column label="海外仓头程运费" align="center" prop="overseasFirstShipping" width="120" sortable/>-->
      <!--<el-table-column label="海外仓尾程运费" align="center" prop="overseasLastShipping" width="120" sortable/>-->
      <!--<el-table-column label="操作费" align="center" prop="operationFee" width="120" sortable/>-->
      <el-table-column label="退货成本" align="center" prop="returnCost2" width="120" sortable/>
      <!--<el-table-column label="供应商补发成本" align="center" prop="supplierReshipCost" width="120" sortable/>-->
      <!--<el-table-column label="仓库发错损失" align="center" prop="warehouseErrorLoss" width="120" sortable/>-->
      <el-table-column label="实际花费毛利" align="center" prop="actualCostProfit" width="120" sortable>
        <template #default="scope">
          <span>{{ scope.row.actualCostProfit.toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际花费毛利率1" align="center" prop="actualCostProfitRate1" width="120" sortable>
        <template #default="scope">
          <span>{{ (scope.row.actualCostProfitRate1 * 100).toFixed(1) + '%' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单实际毛利" align="center" prop="orderActualProfit" width="120" sortable/>
      <el-table-column label="订单实际毛利率" align="center" prop="orderActualProfitRate" width="120" sortable>
        <template #default="scope">
          <span>{{ (scope.row.orderActualProfitRate * 100).toFixed(1) + '%' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="半托管营业额" align="center" prop="half托管Revenue" width="120" sortable/>
      <el-table-column label="半托管利润" align="center" prop="half托管Profit" width="120" sortable/>
      <el-table-column label="自营+半托管营业额" align="center" prop="selfHalf托管Revenue" width="120" sortable/>
      <el-table-column label="自营+半托管利润" align="center" prop="selfHalf托管Profit" width="120" sortable/>
      <el-table-column fixed = "right" label="利润率" align="center" prop="profitRate" width="80" sortable>
        <template #default="scope">
          <span>{{ (scope.row.profitRate * 100).toFixed(1) + '%' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="9月营业额" align="center" prop="septemberRevenue" width="120" sortable/>
      <el-table-column label="9月利润" align="center" prop="septemberProfit" width="120" sortable/>
      <el-table-column label="9月利润率" align="center" prop="septemberProfitRate" width="120" sortable/>
      <el-table-column label="对比营业额" align="center" prop="compareRevenue" width="120" sortable/>
      <el-table-column label="对比利润率" align="center" prop="compareProfitRate" width="120" sortable/>
    </el-table>

    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="profitRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="店铺" prop="storeName">
          <el-input disabled v-model="form.storeName" placeholder="请输入店铺" />
        </el-form-item>
         <el-form-item label="直通车" prop="directCar">
          <el-input v-model="form.directCar" placeholder="请输入直通车" />
        </el-form-item>
        <el-form-item label="直通车花费" prop="directCarCost">
          <el-input v-model="form.directCarCost" placeholder="请输入直通车花费" />
        </el-form-item>
        <el-form-item label="取消订单" prop="cancelOrderRmb">
          <el-input v-model="form.cancelOrderRmb" placeholder="请输入取消订单" />
        </el-form-item>
        <el-form-item label="清仓成本补助" prop="clearanceCostSubsidy">
          <el-input v-model="form.clearanceCostSubsidy" placeholder="请输入清仓成本补助" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 添加汇总信息 -->
    <el-row class="summary" :gutter="10" style="margin-top: 20px;">
      <el-col :span="6"><strong>营业额合计:</strong> {{ totalSum.toFixed(2) }}</el-col>
      <el-col :span="6"><strong>总订单量:</strong> {{ totalOrderQuantity }}</el-col>
      <el-col :span="6"><strong>直通车花费合计:</strong> {{ totalDirectCarCost.toFixed(2) }}</el-col>
      <el-col :span="6"><strong>实际花费毛利合计:</strong> {{ totalActualCostProfit.toFixed(2) }}</el-col>
      <el-col :span="6"><strong>利润合计:</strong> {{ totalProfit.toFixed(2) }}</el-col>
      <el-col :span="6"><strong>退款金额合计:</strong> {{ totalRefundAmount.toFixed(2) }}</el-col>
      <el-col :span="6"><strong>运费合计:</strong> {{ totalShippingFee.toFixed(2) }}</el-col>
      <el-col :span="6"><strong>其他收入合计:</strong> {{ totalOtherIncome.toFixed(2) }}</el-col>
      <el-col :span="6"><strong>补贴金额合计:</strong> {{ totalSubsidyAmount.toFixed(2) }}</el-col>
      <el-col :span="6"><strong>自营+半托管营业额合计:</strong> {{ totalSelfHalf托管Revenue.toFixed(2) }}</el-col>
      <el-col :span="6"><strong>自营+半托管利润合计:</strong> {{ totalSelfHalf托管Profit.toFixed(2) }}</el-col>
    </el-row>
  </div>
</template>

<script setup name="Profit">
import {ref, reactive, toRefs} from 'vue';
import {listProfit, getProfit, delProfit, addProfit, updateProfit, listStores} from "@/api/profit/profit";

const {proxy} = getCurrentInstance();

const profitList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const totalProfit = ref(0);
const totalSum = ref(0);
const totalOrderQuantity = ref(0);
const totalRefundAmount = ref(0);
const totalShippingFee = ref(0);
const totalOtherIncome = ref(0);
const totalSubsidyAmount = ref(0);
const totalDirectCarCost = ref(0);
const totalActualCostProfit = ref(0);
const totalSelfHalf托管Revenue = ref(0);
const totalSelfHalf托管Profit = ref(0);
const storeOptions = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    storeName: null,
    storeManager: null,
    orderAmount: null,
    shippingFee: null,
    otherIncome: null,
    subsidyAmount: null,
    returnCost: null,
    shippingReturn: null,
    otherStoreIncome: null,
    total: null,
    orderQuantity: null,
    refundOrderQuantity: null,
    refundAmount: null,
    customerUnitPrice: null,
    grossProfit: null,
    actualRefundUsd: null,
    directCar: null,
    cancelOrderRmb: null,
    clearanceCostSubsidy: null,
    refundDifference: null,
    directCarCost: null,
    overseasFirstShipping: null,
    overseasLastShipping: null,
    operationFee: null,
    returnCost2: null,
    supplierReshipCost: null,
    warehouseErrorLoss: null,
    actualCostProfit: null,
    actualCostProfitRate1: null,
    orderActualProfit: null,
    orderActualProfitRate: null,
    half托管Revenue: null,
    half托管Profit: null,
    selfHalf托管Revenue: null,
    selfHalf托管Profit: null,
    profitRate: null,
    septemberRevenue: null,
    septemberProfit: null,
    septemberProfitRate: null,
    compareRevenue: null,
    compareProfitRate: null
  },
  rules: {}
});

const {queryParams, form, rules} = toRefs(data);

/** 查询店铺利润汇总列表 */
function getList() {
  loading.value = true;
  listProfit(queryParams.value).then(response => {
    profitList.value = response.rows;
    total.value = response.total;

    // 计算汇总数据
    calculateTotals(profitList.value);

    loading.value = false;
  });
}

// 格式化店铺和负责人数据
function formatStores(stores) {
  const storeNames = new Set(); // 用于存储店铺名称，避免重复
  const storeManagers = new Set(); // 用于存储负责人，避免重复

  stores.forEach(store => {
    if (store.storeName) {
      storeNames.add(store.storeName); // 提取店铺名称
    }
    if (store.storeManager) {
      storeManagers.add(store.storeManager); // 提取负责人
    }
  });

  return {
    storeNames: Array.from(storeNames).map(name => ({label: name, value: name})), // 转换成下拉框数据结构
    storeManagers: Array.from(storeManagers).map(manager => ({label: manager, value: manager})), // 转换成下拉框数据结构
  };
}

// 在组件挂载时加载类别列表
onMounted(() => {
  getStoreManagerList();
});

function getStoreManagerList() {
  loading.value = true;
  listStores()
      .then(response => {
        const stores = response.rows; // response.rows 应该包含完整数据
        const {storeNames, storeManagers} = formatStores(stores); // 获取店铺和负责人数据
        storeNameOptions.value = storeNames; // 更新店铺数据
        storeManagerOptions.value = storeManagers; // 更新负责人数据
        loading.value = false;
      })
      .catch(error => {
        loading.value = false; // 在出现错误时也要停止加载状态
        console.error('获取店铺列表失败:', error); // 记录错误
        ElMessage.error('加载店铺列表时出错，请稍后重试。'); // 提示用户
      });
}

const storeNameOptions = ref([]); // 存储店铺选项
const storeManagerOptions = ref([]); // 存储负责人选项


// 计算汇总数据
function calculateTotals(data) {
      totalProfit.value = data.reduce((sum, item) => sum + (item.grossProfit || 0), 0);
      totalSum.value = data.reduce((sum, item) => sum + (item.total || 0), 0);
      totalOrderQuantity.value = data.reduce((sum, item) => sum + (item.orderQuantity || 0), 0);
      totalRefundAmount.value = data.reduce((sum, item) => sum + (item.refundAmount || 0), 0);
      totalShippingFee.value = data.reduce((sum, item) => sum + (item.shippingFee || 0), 0);
      totalOtherIncome.value = data.reduce((sum, item) => sum + (item.otherIncome || 0), 0);
      totalSubsidyAmount.value = data.reduce((sum, item) => sum + (item.subsidyAmount || 0), 0);
      totalDirectCarCost.value = data.reduce((sum, item) => sum + (item.directCarCost || 0), 0);
      totalActualCostProfit.value = data.reduce((sum, item) => sum + (item.actualCostProfit || 0), 0);
      totalSelfHalf托管Revenue.value = data.reduce((sum, item) => sum + (item.selfHalf托管Revenue || 0), 0);
      totalSelfHalf托管Profit.value = data.reduce((sum, item) => sum + (item.selfHalf托管Profit || 0), 0);
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
    storeName: null,
    storeManager: null,
    orderAmount: null,
    shippingFee: null,
    otherIncome: null,
    subsidyAmount: null,
    returnCost: null,
    shippingReturn: null,
    otherStoreIncome: null,
    total: null,
    orderQuantity: null,
    refundOrderQuantity: null,
    refundAmount: null,
    customerUnitPrice: null,
    grossProfit: null,
    actualRefundUsd: null,
    directCar: null,
    cancelOrderRmb: null,
    clearanceCostSubsidy: null,
    refundDifference: null,
    directCarCost: null,
    overseasFirstShipping: null,
    overseasLastShipping: null,
    operationFee: null,
    returnCost2: null,
    supplierReshipCost: null,
    warehouseErrorLoss: null,
    actualCostProfit: null,
    actualCostProfitRate1: null,
    orderActualProfit: null,
    orderActualProfitRate: null,
    half托管Revenue: null,
    half托管Profit: null,
    selfHalf托管Revenue: null,
    selfHalf托管Profit: null,
    profitRate: null,
    septemberRevenue: null,
    septemberProfit: null,
    septemberProfitRate: null,
    compareRevenue: null,
    compareProfitRate: null
  };
  proxy.resetForm("profitRef");
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
  title.value = "添加店铺利润汇总";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value;
  getProfit(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改店铺利润汇总";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["profitRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateProfit(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addProfit(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除店铺利润汇总编号为"' + _ids + '"的数据项？').then(function () {
    return delProfit(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('profit/profit/export', {
    ...queryParams.value
  }, `profit_${new Date().getTime()}.xlsx`);
}

/** 排序变化处理函数 */
function handleSortChange({prop, order}) {
  // 根据排序的字段和顺序更新查询参数
  queryParams.value.sortField = prop;
  queryParams.value.sortOrder = order;
  getList();  // 重新获取列表数据
}

getList();
</script>

<style>
.summary {
  margin-top: 20px;
  font-weight: bold;
}
</style>
