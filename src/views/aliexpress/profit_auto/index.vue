<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px"
             style="max-width: 1500px; margin-bottom: 20px;">
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
      <!--<el-form-item label="类别" prop="category">-->
      <!--  <el-  select-->
      <!--      v-model="queryParams.category"-->
      <!--      placeholder="请选择类别"-->
      <!--      clearable-->
      <!--  >-->
      <!--    <el-option label="POP" value="POP"></el-option>-->
      <!--    <el-option label="半托管" value="半托管"></el-option>-->
      <!--    &lt;!&ndash;<el-option label="全托管" value="全托管"></el-option>&ndash;&gt;-->
      <!--  </el-select>-->
      <!--</el-form-item>-->
      <el-form-item label="货币类型" prop="category">
        <el-select
            v-model="queryParams.moneyType"
            placeholder="请选择货币类型"
            clearable
        >
          <el-option label="人民币店铺" value="CNY"></el-option>
          <el-option label="美元店铺" value="USD"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="月份" prop="mouth">
        <el-select
            v-model="queryParams.mouth"
            placeholder="请选择月份"
            clearable
        >
          <el-option label="2024-11" value="2024-11"></el-option>
          <el-option label="2024-10" value="2024-10"></el-option>
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
        type="success"
        plain
        icon="Edit"
        :disabled="single"
        @click="handleUpdate"
        v-hasPermi="['profit:profit:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['profit:profit:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" style="float: right;"></right-toolbar>
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
      <template #empty>
        <el-empty description="暂无数据"></el-empty>
      </template>
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column fixed label="店铺" align="center" prop="storeName" width="200" sortable/>
      <el-table-column fixed label="负责人" align="center" prop="storeManager" width="80" sortable/>
      <el-table-column fixed label="月份" align="center" prop="mouth" width="80" sortable/>
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
      <!--<el-table-column label="实际退款USD" align="center" prop="actualRefundUsd" width="80" sortable/>-->
      <!--<el-table-column label="直通车充值" align="center" prop="directCar" width="120" sortable/>-->
      <!--<el-table-column label="物流赔付" align="center" prop="cancelOrderRmb" width="120" sortable/>-->
      <!--<el-table-column label="清仓成本补助" align="center" prop="clearanceCostSubsidy" width="120" sortable/>-->
      <!--<el-table-column label="退款差值" align="center" prop="refundDifference" width="120" sortable/>-->
      <!--<el-table-column label="直通车花费" align="center" prop="directCarCost" width="120" sortable/>-->
      <!--<el-table-column label="半托管赔付" align="center" prop="overseasFirstShipping" width="120" sortable/>-->
      <!--<el-table-column label="海外仓尾程运费" align="center" prop="overseasLastShipping" width="120" sortable/>-->
      <!--<el-table-column label="操作费" align="center" prop="operationFee" width="120" sortable/>-->
      <el-table-column label="退货成本" align="center" prop="returnCost2" width="120" sortable/>
      <!--<el-table-column label="供应商补发成本" align="center" prop="supplierReshipCost" width="120" sortable/>-->
      <!--<el-table-column label="仓库发错损失" align="center" prop="warehouseErrorLoss" width="120" sortable/>-->
      <el-table-column label="运营利润" align="center" prop="actualCostProfit" width="120" sortable>
        <template #default="scope">
          <span>{{ scope.row?.actualCostProfit?.toFixed(2) || '0.00' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运营利润率" align="center" prop="actualCostProfitRate1" width="120" sortable>
        <template #default="scope">
          <span>{{ (scope.row.actualCostProfitRate1 * 100).toFixed(1) + '%' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="财务利润" align="center" prop="orderActualProfit" width="120" sortable/>
      <el-table-column label="财务利润率" align="center" prop="orderActualProfitRate" width="120" sortable>
        <template #default="scope">
          <span>{{ (scope.row.orderActualProfitRate * 100).toFixed(1) + '%' }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="半托管营业额" align="center" prop="half托管Revenue" width="120" sortable/>-->
      <!--<el-table-column label="半托管利润" align="center" prop="half托管Profit" width="120" sortable/>-->
      <!--<el-table-column label="自营+半托管营业额" align="center" prop="selfHalf托管Revenue" width="120" sortable/>-->
      <!--<el-table-column label="自营+半托管利润" align="center" prop="selfHalf托管Profit" width="120" sortable/>-->
      <el-table-column fixed = "right" label="利润率" align="center" prop="profitRate" width="80" sortable>
        <template #default="scope">
          <span>{{ (scope.row.profitRate * 100).toFixed(1) + '%' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备仓利润" align="center" prop="septemberProfit" width="120" sortable/>
      <el-table-column label="jit利润" align="center" prop="septemberProfitRate" width="120" sortable/>
      <el-table-column label="当月揽收费用" align="center" prop="septemberRevenue" width="120" sortable/>
      <el-table-column label="上月活动差价" align="center" prop="compareRevenue" width="120" sortable/>
      <el-table-column label="当月产生罚款" align="center" prop="compareProfitRate" width="120" sortable/>
      <el-table-column fixed = "right" label="利润汇总" align="center" prop="totalProfit" width="120" sortable>
        <template #default="scope">
          <span>{{ (scope.row.septemberProfit + scope.row.septemberProfitRate + scope.row.septemberRevenue + scope.row.compareRevenue - scope.row.compareProfitRate).toFixed(2) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="title" v-model="open" width="700px" append-to-body>
      <el-form ref="profitRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="店铺" prop="storeName">
          <el-input disabled v-model="form.storeName" placeholder="请输入店铺" />
        </el-form-item>
         <el-form-item label="直通车" prop="directCar">
          <el-input v-model="form.directCar" placeholder="请输入直通车" />
        </el-form-item>
        <el-form-item label="直通车花费" prop="directCarCost">
          <el-input v-model="form.directCarCost" placeholder="请输入直通车花费" />
        </el-form-item>
        <el-form-item label="物流赔付" prop="cancelOrderRmb">
          <el-input v-model="form.cancelOrderRmb" placeholder="请输入物流赔付" />
        </el-form-item>
        <el-form-item label="清仓成本补助" prop="clearanceCostSubsidy">
          <el-input v-model="form.clearanceCostSubsidy" placeholder="请输入清仓成本补助" />
        </el-form-item>
        <el-form-item label="当月产生罚款" prop="compareProfitRate">
          <el-input v-model="form.compareProfitRate" placeholder="请输入当月产生罚款" />
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
    <el-card class="summary-card">
      <el-row :gutter="24" class="summary-row">
        <el-col :span="8">
          <div class="summary-item">
            <span class="label">总营业额合计:</span>
            <span class="value" :class="{'negative': totalSum < 0}">
              {{ formatMoney(totalSum) }}
            </span>
          </div>
        </el-col>
         <el-col :span="8">
          <div class="summary-item">
            <span class="label">备仓利润合计:</span>
            <span class="value" :class="{'negative': totalDirectCarCost < 0}">
              {{ formatMoney(totalDirectCarCost) }}
            </span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="summary-item">
            <span class="label">JIT利润合计:</span>
            <span class="value" :class="{'negative': totalDirectCar < 0}">
              {{ formatMoney(totalDirectCar) }}
            </span>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="24" class="summary-row">
         <el-col :span="8">
          <div class="summary-item">
            <span class="label">当月揽收费用合计:</span>
            <span class="value" :class="{'negative': totalOrderActualProfit < 0}">
              {{ formatMoney(totalOrderActualProfit) }}
            </span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="summary-item">
            <span class="label">当月产生罚款合计:</span>
            <span class="value" :class="{'negative': totalHalf托管Profit < 0}">
              {{ formatMoney(totalHalf托管Profit) }}
            </span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="summary-item">
            <span class="label">利润合计:</span>
            <span class="value" :class="{'negative': totalSelfHalf托管Profit < 0}">
              {{ formatMoney(totalSelfHalf托管Profit) }}
            </span>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup name="Profit">
import {ref, reactive, toRefs, onMounted, getCurrentInstance} from 'vue';
import {listProfit, getProfit, delProfit, addProfit, updateProfit, listStores} from "@/api/profit/profit";
import {ElMessage} from 'element-plus';

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
const totalOrderActualProfit = ref(0);
const totalSum = ref(0);
const totalOrderQuantity = ref(0);
const totalRefundAmount = ref(0);
const totalShippingFee = ref(0);
const totalOtherIncome = ref(0);
const totalSubsidyAmount = ref(0);
const totalActualRefundUsdAmount = ref(0);
const totalDirectCarCost = ref(0);
const totalDirectCar = ref(0);
const totalActualCostProfit = ref(0);
const totalSelfHalf托管Revenue = ref(0);
const totalSelfHalf托管Profit = ref(0);
const totalHalf托管Profit = ref(0);
const storeOptions = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    storeName: null,
    storeManager: null,
    category: '全托管',
    mouth: '2024-11',
    moneyType: null,
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

// 添加新的响应式变量用于多选
const selectedCategories = ref(['全托管']);

// 添加 category change 处理函数
function handleCategoryChange(values) {
  queryParams.value.category = values.join(',');
}

/** 查询店铺利润汇总列表 */
function getList() {
  loading.value = true;
  try {
    listProfit(queryParams.value).then(response => {
      if (response.code === 200) {
        // 确保数据是数组且进行数据预处理
        profitList.value = Array.isArray(response.rows) ? response.rows.map(row => ({
          ...row,
          actualCostProfit: row.actualCostProfit ?? 0,
          actualCostProfitRate1: row.actualCostProfitRate1 ?? 0,
          profitRate: row.profitRate ?? 0,
          orderActualProfitRate: row.orderActualProfitRate ?? 0
        })) : [];
        total.value = response.total || 0;
        calculateTotals(profitList.value);
      } else {
        ElMessage.error(response.msg || '获取数据失败');
        profitList.value = [];
      }
    }).catch(error => {
      console.error('获取数据失败:', error);
      ElMessage.error('获取数据失败，请稍后重试');
      profitList.value = [];
    }).finally(() => {
      loading.value = false;
    });
  } catch (error) {
    console.error('getList执行错误:', error);
    loading.value = false;
    profitList.value = [];
    ElMessage.error('系统错误，请稍后重试');
  }
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
  try {
    getStoreManagerList();
    getList();
  } catch (error) {
    console.error('组件挂载时出错:', error);
    ElMessage.error('初始化数据失败，请刷新页面重试');
  }
});

function getStoreManagerList() {
  loading.value = true;
  try {
    listStores()
      .then(response => {
        if (response.code === 200) {
          const stores = response.rows || [];
          const {storeNames, storeManagers} = formatStores(stores);
          storeNameOptions.value = storeNames;
          storeManagerOptions.value = storeManagers;
        } else {
          ElMessage.error(response.msg || '获取店铺列表失败');
        }
      })
      .catch(error => {
        console.error('获取店铺列表失败:', error);
        ElMessage.error('获取店铺列表失败，请稍后重试');
      })
      .finally(() => {
        loading.value = false;
      });
  } catch (error) {
    console.error('getStoreManagerList执行错误:', error);
    loading.value = false;
    ElMessage.error('系统错误，请稍后重试');
  }
}

const storeNameOptions = ref([]); // 存储店铺选项
const storeManagerOptions = ref([]); // 存储负责人选项


// 计算汇总数据
function calculateTotals(data) {
  try {
    if (!Array.isArray(data)) {
      console.error('计算汇总的数据不是数组格式');
      return;
    }

    const safeReduce = (array, key) => {
      return array.reduce((sum, item) => {
        const value = Number(item[key]);
        return sum + (isNaN(value) ? 0 : value);
      }, 0);
    };

    // 其他汇总数据
    totalSum.value = safeReduce(data, 'total');
    totalDirectCarCost.value = safeReduce(data, 'septemberProfit');
    totalDirectCar.value = safeReduce(data, 'septemberProfitRate');
    totalOrderActualProfit.value = safeReduce(data, 'septemberRevenue');
    totalHalf托管Profit.value = safeReduce(data, 'compareProfitRate');
    totalSelfHalf托管Profit.value = totalDirectCarCost.value + totalDirectCar.value + totalOrderActualProfit.value - totalHalf托管Profit.value;


  } catch (error) {
    console.error('计算汇总数据时出错:', error);
    ElMessage.error('计算汇总数据出错');
  }
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
    category: null,
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
  selectedCategories.value = ['全托管'];
  queryParams.value.category = '全托管';
  queryParams.value.mouth = '2024-11';
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

// 添加表格行样式处理函数
function getTableRowClass({ row }) {
  try {
    if (!row) return '';
    return row.grossProfit < 0 ? 'negative-profit' : '';
  } catch (error) {
    console.error('行样式处理错误:', error);
    return '';
  }
}

// 添加金额格式化函数
const formatMoney = (num) => {
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

</script>

<style>
.summary {
  margin-top: 20px;
  font-weight: bold;
}

.negative-profit {
  color: #F56C6C;
}

.error-text {
  color: #F56C6C;
  font-size: 12px;
}

.summary-card {
  margin-top: 20px;
}

.summary-row {
  margin-bottom: 16px;
}

.summary-item {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-item .label {
  color: #606266;
  font-size: 14px;
  font-weight: 500;
}

.summary-item .value {
  color: #303133;
  font-size: 16px;
  font-weight: bold;
}

.summary-item .value.negative {
  color: #f56c6c;
}
</style>
