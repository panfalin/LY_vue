<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="付款时间" prop="paymentTime">
        <el-date-picker
            clearable
            v-model="queryParams.paymentTimeRange"
            type="daterange"
            value-format="YYYY-MM-DD"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleQuery"
            @clear="reset"
            placeholder="请选择付款时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="店铺名" prop="storeName">
        <el-autocomplete
            v-model="queryParams.storeName"
            :fetch-suggestions="queryStores"
            placeholder="请输入店铺名"
            @select="handleQuery"
            @clear="resetQuery"
            clearable
            :style="{ width: '300px' }"
        />
      </el-form-item>

      <el-form-item label="国家" prop="country">
        <el-autocomplete
            v-model="queryParams.country"
            placeholder="请选择国家"
            :fetch-suggestions="queryCountries"
            @select="handleQuery"
            @clear="resetQuery"
            clearable
        />
      </el-form-item>
      <el-form-item label="SKU" prop="skuDetails">
        <el-input
          v-model="queryParams.skuDetails"
          placeholder="请输入SKU"
          @select="handleQuery"
          clearable
        />
      </el-form-item>
      <!--<el-form-item label="SKU总数量" prop="skuQuantity">-->
      <!--  <el-input-->
      <!--    v-model="queryParams.skuQuantity"-->
      <!--    placeholder="请输入SKU总数量"-->
      <!--    clearable-->
      <!--    @keyup.enter="handleQuery"-->
      <!--  />-->
      <!--</el-form-item>-->
      <!--<el-form-item label="商品总重量" prop="totalProductWeight">-->
      <!--  <el-input-->
      <!--    v-model="queryParams.totalProductWeight"-->
      <!--    placeholder="请输入商品总重量"-->
      <!--    clearable-->
      <!--    @keyup.enter="handleQuery"-->
      <!--  />-->
      <!--</el-form-item>-->
      <!--<el-form-item label="订单总金额" prop="totalOrderAmount">-->
      <!--  <el-input-->
      <!--    v-model="queryParams.totalOrderAmount"-->
      <!--    placeholder="请输入订单总金额"-->
      <!--    clearable-->
      <!--    @keyup.enter="handleQuery"-->
      <!--  />-->
      <!--</el-form-item>-->
      <!--<el-form-item label="实际运费" prop="actualShipping">-->
      <!--  <el-input-->
      <!--    v-model="queryParams.actualShipping"-->
      <!--    placeholder="请输入实际运费"-->
      <!--    clearable-->
      <!--    @keyup.enter="handleQuery"-->
      <!--  />-->
      <!--</el-form-item>-->
      <!--<el-form-item label="广告费(人民币)" prop="adCostRmb">-->
      <!--  <el-input-->
      <!--    v-model="queryParams.adCostRmb"-->
      <!--    placeholder="请输入广告费(人民币)"-->
      <!--    clearable-->
      <!--    @keyup.enter="handleQuery"-->
      <!--  />-->
      <!--</el-form-item>-->
      <!--<el-form-item label="平台交易费(人民币)" prop="platformFeeRmb">-->
      <!--  <el-input-->
      <!--    v-model="queryParams.platformFeeRmb"-->
      <!--    placeholder="请输入平台交易费(人民币)"-->
      <!--    clearable-->
      <!--    @keyup.enter="handleQuery"-->
      <!--  />-->
      <!--</el-form-item>-->
      <!--<el-form-item label="VAT税费" prop="vatFeeRmb">-->
      <!--  <el-input-->
      <!--    v-model="queryParams.vatFeeRmb"-->
      <!--    placeholder="请输入VAT税费"-->
      <!--    clearable-->
      <!--    @keyup.enter="handleQuery"-->
      <!--  />-->
      <!--</el-form-item>-->
      <!--<el-form-item label="订单利润" prop="orderProfit">-->
      <!--  <el-input-->
      <!--    v-model="queryParams.orderProfit"-->
      <!--    placeholder="请输入订单利润"-->
      <!--    clearable-->
      <!--    @keyup.enter="handleQuery"-->
      <!--  />-->
      <!--</el-form-item>-->
      <!--<el-form-item label="订单利润率" prop="orderProfitRate">-->
      <!--  <el-input-->
      <!--    v-model="queryParams.orderProfitRate"-->
      <!--    placeholder="请输入订单利润率"-->
      <!--    clearable-->
      <!--    @keyup.enter="handleQuery"-->
      <!--  />-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" type="danger" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!--<el-col :span="1.5">-->
      <!--  <el-button-->
      <!--    type="primary"-->
      <!--    plain-->
      <!--    icon="Plus"-->
      <!--    @click="handleAdd"-->
      <!--    v-hasPermi="['orders:orders:add']"-->
      <!--  >新增</el-button>-->
      <!--</el-col>-->
      <!--<el-col :span="1.5">-->
      <!--  <el-button-->
      <!--    type="success"-->
      <!--    plain-->
      <!--    icon="Edit"-->
      <!--    :disabled="single"-->
      <!--    @click="handleUpdate"-->
      <!--    v-hasPermi="['orders:orders:edit']"-->
      <!--  >修改</el-button>-->
      <!--</el-col>-->
      <!--<el-col :span="1.5">-->
      <!--  <el-button-->
      <!--    type="danger"-->
      <!--    plain-->
      <!--    icon="Delete"-->
      <!--    :disabled="multiple"-->
      <!--    @click="handleDelete"-->
      <!--    v-hasPermi="['orders:orders:remove']"-->
      <!--  >删除</el-button>-->
      <!--</el-col>-->
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['orders:orders:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
        v-loading="loading"
        :data="ordersList"
        height="600"
        :estimated-row-height="40"
        highlight-current-row
        border
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="订单编号" fixed align="center" prop="orderId" width="120"/>
      <el-table-column label="付款时间" align="center" prop="paymentTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.paymentTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="店铺名" align="center" prop="storeName" min-width="150"/>
      <el-table-column label="国家" align="center" prop="country" min-width="100"/>
      <el-table-column label="重量" align="center" prop="weight" min-width="100"/>
      <el-table-column label="SKU明细" align="center" prop="skuDetails" min-width="200" show-overflow-tooltip/>
      <el-table-column label="SKU总数量" align="center" prop="skuQuantity" min-width="100"/>
      <el-table-column label="商品总重量" align="center" prop="totalProductWeight" min-width="120"/>
      <el-table-column label="订单总金额" align="center" prop="totalOrderAmount" min-width="120"/>
      <el-table-column label="实际运费" align="center" prop="actualShipping" min-width="120"/>
      <el-table-column label="广告费(人民币)" align="center" prop="adCostRmb" min-width="150"/>
      <el-table-column label="平台交易费(人民币)" align="center" prop="platformFeeRmb" min-width="150"/>
      <el-table-column label="VAT税费" align="center" prop="vatFeeRmb" min-width="100"/>
      <el-table-column label="订单利润" align="center" prop="orderProfit" min-width="100" fixed="right">
        <template #default="scope">
          <span :style="{ color: scope.row.orderProfit < 0 ? 'red' : 'black' }">
            {{ scope.row.orderProfit }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="订单利润率" align="center" prop="orderProfitRate" min-width="100" fixed="right">
        <template #default="scope">
          <span :style="{ color: parseFloat(scope.row.orderProfitRate) < 0 ? 'red' : 'black' }">
            {{ scope.row.orderProfitRate }}
          </span>
        </template>
      </el-table-column>

      <!--<el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" min-width="200" >-->
      <!--  <template #default="scope">-->
      <!--    <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['orders:orders:edit']">修改</el-button>-->
      <!--    <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['orders:orders:remove']">删除</el-button>-->
      <!--  </template>-->
      <!--</el-table-column>-->
    </el-table>


    <pagination
        v-show="total>0"
        :total="total"
        :page-sizes="[50, 100, 200]"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- 添加或修改订单数据对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="ordersRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="付款时间" prop="paymentTime">
          <el-date-picker clearable
                          v-model="form.paymentTime"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择付款时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="店铺名" prop="storeName">
          <el-input v-model="form.storeName" placeholder="请输入店铺名"/>
        </el-form-item>
        <el-form-item label="国家" prop="country">
          <el-input v-model="form.country" placeholder="请输入国家"/>
        </el-form-item>
        <el-form-item label="重量" prop="weight">
          <el-input v-model="form.weight" placeholder="请输入重量"/>
        </el-form-item>
        <el-form-item label="SKU明细" prop="skuDetails">
          <el-input v-model="form.skuDetails" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="SKU总数量" prop="skuQuantity">
          <el-input v-model="form.skuQuantity" placeholder="请输入SKU总数量"/>
        </el-form-item>
        <el-form-item label="商品总重量" prop="totalProductWeight">
          <el-input v-model="form.totalProductWeight" placeholder="请输入商品总重量"/>
        </el-form-item>
        <el-form-item label="订单总金额" prop="totalOrderAmount">
          <el-input v-model="form.totalOrderAmount" placeholder="请输入订单总金额"/>
        </el-form-item>
        <el-form-item label="实际运费" prop="actualShipping">
          <el-input v-model="form.actualShipping" placeholder="请输入实际运费"/>
        </el-form-item>
        <el-form-item label="广告费(人民币)" prop="adCostRmb">
          <el-input v-model="form.adCostRmb" placeholder="请输入广告费(人民币)"/>
        </el-form-item>
        <el-form-item label="平台交易费(人民币)" prop="platformFeeRmb">
          <el-input v-model="form.platformFeeRmb" placeholder="请输入平台交易费(人民币)"/>
        </el-form-item>
        <el-form-item label="VAT税费" prop="vatFeeRmb">
          <el-input v-model="form.vatFeeRmb" placeholder="请输入VAT税费"/>
        </el-form-item>
        <el-form-item label="订单利润" prop="orderProfit">
          <el-input v-model="form.orderProfit" placeholder="请输入订单利润"/>
        </el-form-item>
        <el-form-item label="订单利润率" prop="orderProfitRate">
          <el-input v-model="form.orderProfitRate" placeholder="请输入订单利润率"/>
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

<script setup name="Orders">
import {onMounted, ref, reactive, toRefs} from 'vue';
import {
  listOrders,
  getOrders,
  delOrders,
  addOrders,
  updateOrders,
  getAllStores,
  getAllCountry
} from "@/api/orders/orders";
import {getCurrentInstance} from 'vue';
import {parseTime} from "../../../utils/ruoyi.js";

const {proxy} = getCurrentInstance();

const ordersList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const stores = ref([])
const countries = ref([]);
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 50,
    paymentTime: null,
    storeName: null,
    country: null,
    weight: null,
    skuDetails: null,
    skuQuantity: null,
    totalProductWeight: null,
    totalOrderAmount: null,
    actualShipping: null,
    adCostRmb: null,
    platformFeeRmb: null,
    vatFeeRmb: null,
    orderProfit: null,
    orderProfitRate: null,
    paymentTimeRange: null
  },
  rules: {}
});

const {queryParams, form, rules} = toRefs(data);

/** 查询订单数据列表 */
function getList() {
  loading.value = true;
  listOrders(queryParams.value).then(response => {
    ordersList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 动态搜索店铺名称
const queryStores = (queryString, callback) => {
  console.log('搜索的字符串:', queryString); // 添加调试信息
  const suggestions = stores.value
      .filter(store => store.toLowerCase().includes(queryString.toLowerCase()))
      .map(store => ({label: store, value: store})); // 确保格式正确
  console.log('匹配的建议:', suggestions); // 添加调试信息
  callback(suggestions);
};
// 动态搜索国家名称
const queryCountries = (queryString, callback) => {
  console.log('搜索的字符串:', queryString); // 调试信息
  const suggestions = countries.value
      .filter(country => country.toLowerCase().includes(queryString.toLowerCase()))
      .map(country => ({label: country, value: country})); // 确保格式
  console.log('匹配的建议:', suggestions); // 调试信息
  callback(suggestions);
};
const handleStoreSelect = (selectedStore) => {
  console.log('选择的店铺:', selectedStore); // 添加调试信息
  // 在这里执行任何其他操作，例如重新查询订单
};

onMounted(async () => {
  try {
    const [storesResponse, countriesResponse] = await Promise.all([
      getAllStores(),
      getAllCountry()
    ]);
    stores.value = storesResponse.data;
    console.log('获取的店铺:', stores.value); // 添加调试信息
    countries.value = countriesResponse.data;
    getList(); // 初始化加载订单列表
  } catch (error) {
    console.error('获取数据失败', error);
  }
});


// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    orderId: null,
    paymentTime: null,
    storeName: null,
    country: null,
    weight: null,
    skuDetails: null,
    skuQuantity: null,
    totalProductWeight: null,
    totalOrderAmount: null,
    actualShipping: null,
    adCostRmb: null,
    platformFeeRmb: null,
    vatFeeRmb: null,
    orderProfit: null,
    orderProfitRate: null,
    paymentTimeRange: null,
  };
  queryParams.value.storeName = null;
  queryParams.value.country = null;
  queryParams.value.paymentTimeRange = null;
  queryParams.value.paymentTime = null;
  queryParams.value.skuDetails = null;
  proxy.resetForm("ordersRef");
  // 重新查询
  getList();
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;

  // 将付款时间段转换为字符串并传入 paymentTime
  if (queryParams.value.paymentTimeRange && queryParams.value.paymentTimeRange.length === 2) {
    const startDate = queryParams.value.paymentTimeRange[0];
    const endDate = queryParams.value.paymentTimeRange[1];
    queryParams.value.paymentTime = `${startDate} - ${endDate}`;
  } else {
    queryParams.value.paymentTime = null; // 如果没有选择时间段，清空 paymentTime
  }

  getList();
}


/** 重置按钮操作 */
function resetQuery() {
  form.value = {
    orderId: null,
    paymentTime: null,
    storeName: null,
    country: null,
    weight: null,
    skuDetails: null,
    skuQuantity: null,
    totalProductWeight: null,
    totalOrderAmount: null,
    actualShipping: null,
    adCostRmb: null,
    platformFeeRmb: null,
    vatFeeRmb: null,
    orderProfit: null,
    orderProfitRate: null,
    paymentTimeRange: null,
  };
  proxy.resetForm("ordersRef");
  // 重新查询
  handleQuery()
  getList();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.orderId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加订单数据";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _orderId = row.orderId || ids.value
  getOrders(_orderId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改订单数据";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["ordersRef"].validate(valid => {
    if (valid) {
      if (form.value.orderId != null) {
        updateOrders(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addOrders(form.value).then(response => {
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
  const _orderIds = row.orderId || ids.value;
  proxy.$modal.confirm('是否确认删除订单数据编号为"' + _orderIds + '"的数据项？').then(function () {
    return delOrders(_orderIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('orders/orders/export', {
    ...queryParams.value
  }, `orders_${new Date().getTime()}.xlsx`)
}

getList();
</script>
