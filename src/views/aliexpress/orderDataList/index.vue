<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="订单编号" prop="orderId">
        <el-input
          v-model="queryParams.orderId"
          placeholder="请输入订单编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类别" prop="category">
        <el-input
          v-model="queryParams.category"
          placeholder="请输入类别"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
    
      <el-form-item label="店铺名" prop="store">
        <el-input
          v-model="queryParams.store"
          placeholder="请输入店铺名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="国家" prop="country">
        <el-input
          v-model="queryParams.country"
          placeholder="请输入国家"
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
          v-hasPermi="['aliexpress:orderDataList:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="orderDataListList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="主键ID" align="center" prop="sId" />-->
      <el-table-column label="订单编号" align="center" prop="orderId" width="180"/>
      <el-table-column label="类别" align="center" prop="category" />
      <el-table-column label="付款时间" align="center" prop="paymentTime" width="150">
        <template #default="scope">
          <span>{{ parseTime(scope.row.paymentTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="店铺名" align="center" prop="store"width="170" />
      <el-table-column label="国家" align="center" prop="country"width="110" />
      <el-table-column label="重量" align="center" prop="weight" />
      <el-table-column label="SKU明细" align="center" prop="skuDetails" width="180"/>
      <el-table-column label="SKU总数量" align="center" prop="skuQuantity" />
<!--      <el-table-column label="商品数量" align="center" prop="quantity" />-->
      <el-table-column label="商品总重量" align="center" prop="totalProductWeight" />
      <el-table-column label="订单总金额" align="center" prop="totalOrderAmount" />
      <el-table-column label="实际运费" align="center" prop="actualShipping" />
      <el-table-column label="运费收入" align="center" prop="shippingRevenue" />
      <el-table-column label="广告费(人民币)" align="center" prop="adCostRmb" width="110"/>
      <el-table-column label="平台交易费(人民币)" align="center" prop="platformFeeRmb" width="130"/>
      <el-table-column label="VAT税费" align="center" prop="vatFeeRmb" />
      <el-table-column label="物流赔付" align="center" prop="logisticsCompensation" />
      <el-table-column label="半托管赔付" align="center" prop="semiManagedCompensation" />
      <el-table-column label="实际退款" align="center" prop="actualRefund" />
      <el-table-column label="清仓补助" align="center" prop="clearanceSubsidy" />
      <el-table-column label="订单利润" align="center" prop="orderProfit" />
      <el-table-column label="订单利润率" align="center" prop="orderProfitRate" >
        <template #default="scope">
          {{ scope.row.orderProfitRate ? `${(scope.row.orderProfitRate * 100).toFixed(2)}%` : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="实际利润" align="center" prop="actualProfit" />


      <el-table-column label="实际利润率" align="center" prop="actualProfitRate">
        <template #default="scope">
          {{ scope.row.actualProfitRate ? `${(scope.row.actualProfitRate * 100).toFixed(2)}%` : '-' }}
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


  </div>
</template>

<script setup name="OrderDataList">
import { listOrderDataList, getOrderDataList, delOrderDataList, addOrderDataList, updateOrderDataList } from "@/api/aliexpress/orderDataList";

const { proxy } = getCurrentInstance();

const orderDataListList = ref([]);
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
    orderId: null,
    category: null,
    paymentTime: null,
    store: null,
    country: null,
    weight: null,
    skuDetails: null,
    skuQuantity: null,
    quantity: null,
    totalProductWeight: null,
    totalOrderAmount: null,
    actualShipping: null,
    shippingRevenue: null,
    adCostRmb: null,
    platformFeeRmb: null,
    vatFeeRmb: null,
    logisticsCompensation: null,
    semiManagedCompensation: null,
    actualRefund: null,
    clearanceSubsidy: null,
    orderProfit: null,
    orderProfitRate: null,
    actualProfit: null,
    actualProfitRate: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询马帮订单数据列表 */
function getList() {
  loading.value = true;
  listOrderDataList(queryParams.value).then(response => {
    orderDataListList.value = response.rows;
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
    orderId: null,
    category: null,
    paymentTime: null,
    store: null,
    country: null,
    weight: null,
    skuDetails: null,
    skuQuantity: null,
    quantity: null,
    totalProductWeight: null,
    totalOrderAmount: null,
    actualShipping: null,
    shippingRevenue: null,
    adCostRmb: null,
    platformFeeRmb: null,
    vatFeeRmb: null,
    logisticsCompensation: null,
    semiManagedCompensation: null,
    actualRefund: null,
    clearanceSubsidy: null,
    orderProfit: null,
    orderProfitRate: null,
    actualProfit: null,
    actualProfitRate: null
  };
  proxy.resetForm("orderDataListRef");
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
  title.value = "添加马帮订单数据";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _sId = row.sId || ids.value
  getOrderDataList(_sId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改马帮订单数据";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["orderDataListRef"].validate(valid => {
    if (valid) {
      if (form.value.sId != null) {
        updateOrderDataList(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addOrderDataList(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除马帮订单数据编号为"' + _sIds + '"的数据项？').then(function() {
    return delOrderDataList(_sIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('aliexpress/orderDataList/export', {
    ...queryParams.value
  }, `orderDataList_${new Date().getTime()}.xlsx`)
}

getList();
</script>
