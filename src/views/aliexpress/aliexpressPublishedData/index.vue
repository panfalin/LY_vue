<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="商品ID" prop="commodityId">
        <el-input
          v-model="queryParams.commodityId"
          placeholder="请输入商品ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="店铺" prop="shopName">
        <el-select
            v-model="queryParams.shopName"
            placeholder="请选择店铺"
            clearable
            @change="handleQuery"
        >
          <el-option
              v-for="item in shopOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="日期范围" prop="dateRange">
        <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            placeholder="请选择日期"
            @change="handleQuery">
        </el-date-picker>
        <div style="margin-top: 0px;">
          <el-button style="margin-right: 15px;" type="primary" link @click="handleDateRange(7)">近7天</el-button>
          <el-button style="margin-right: 15px;" type="primary" link @click="handleDateRange(14)">近14天</el-button>
          <el-button type="primary" link @click="handleDateRange(30)">近30天</el-button>
        </div>
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
          v-hasPermi="['aliexpress:aliexpressPublishedData:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="aliexpressPublishedDataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="商品ID" align="center" prop="commodityId"  width="180" />
      <el-table-column label="店铺" align="center" prop="shopName" width="180" />
      <el-table-column label="统计时间" align="center" prop="statisticalTime" >
        <template #default="scope">
          <span>{{ parseTime(scope.row.statisticalTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付转化率" align="center" prop="paymentConversion" />
      <el-table-column label="搜索曝光" align="center" prop="searchExposure" />
      <el-table-column label="成功退款" align="center" prop="successfulRefund" />
      <el-table-column label="访客数" align="center" prop="visitors" />
      <el-table-column label="商品加购" align="center" prop="goodsAdditional" />
      <el-table-column label="商品收藏" align="center" prop="goodsCollection" />
      <el-table-column label="搜索点击率" align="center" prop="searchClicks" />
      <el-table-column label="成交金额" align="center" prop="transactionAmount" />
      <el-table-column label="支付件单价" align="center" prop="pricePay" />
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改速卖通刊登数据对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="aliexpressPublishedDataRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商品ID" prop="commodityId">
          <el-input v-model="form.commodityId" placeholder="请输入商品ID" />
        </el-form-item>
        <el-form-item label="统计时间" prop="statisticalTime">
          <el-date-picker clearable
            v-model="form.statisticalTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择统计时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="支付转化率" prop="paymentConversion">
          <el-input v-model="form.paymentConversion" placeholder="请输入支付转化率" />
        </el-form-item>
        <el-form-item label="搜索曝光" prop="searchExposure">
          <el-input v-model="form.searchExposure" placeholder="请输入搜索曝光" />
        </el-form-item>
        <el-form-item label="成功退款" prop="successfulRefund">
          <el-input v-model="form.successfulRefund" placeholder="请输入成功退款" />
        </el-form-item>
        <el-form-item label="访客数" prop="visitors">
          <el-input v-model="form.visitors" placeholder="请输入访客数" />
        </el-form-item>
        <el-form-item label="商品加购" prop="goodsAdditional">
          <el-input v-model="form.goodsAdditional" placeholder="请输入商品加购" />
        </el-form-item>
        <el-form-item label="商品收藏" prop="goodsCollection">
          <el-input v-model="form.goodsCollection" placeholder="请输入商品收藏" />
        </el-form-item>
        <el-form-item label="搜索点击率" prop="searchClicks">
          <el-input v-model="form.searchClicks" placeholder="请输入搜索点击率" />
        </el-form-item>
        <el-form-item label="成交金额" prop="transactionAmount">
          <el-input v-model="form.transactionAmount" placeholder="请输入成交金额" />
        </el-form-item>
        <el-form-item label="支付件单价" prop="pricePay">
          <el-input v-model="form.pricePay" placeholder="请输入支付件单价" />
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

<script setup name="AliexpressPublishedData">
import { listAliexpressPublishedData, getAliexpressPublishedData, delAliexpressPublishedData, addAliexpressPublishedData, updateAliexpressPublishedData } from "@/api/aliexpress/aliexpressPublishedData";
import {selectShop } from "@/api/aliexpress/indicators";
import {onMounted} from "vue";

const { proxy } = getCurrentInstance();
const aliexpressPublishedDataList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dateRange = ref([
  new Date(Date.now() ).toISOString().split('T')[0],
  new Date(Date.now() ).toISOString().split('T')[0]
]);


const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    commodityId: null,
    statisticalTime: null,
    paymentConversion: null,
    searchExposure: null,
    successfulRefund: null,
    visitors: null,
    goodsAdditional: null,
    goodsCollection: null,
    searchClicks: null,
    transactionAmount: null,
    pricePay: null
  },
  rules: {
  }
});
const shopOptions = ref([]);
const { queryParams, form, rules } = toRefs(data);

/** 查询速卖通刊登数据列表 */
function getList() {
  loading.value = true;

  const params = {
    ...queryParams.value,
    beginTime: dateRange.value && dateRange.value[0] ? dateRange.value[0] : null,
    endTime: dateRange.value && dateRange.value[1] ? dateRange.value[1] : null
  };


  listAliexpressPublishedData(params).then(response => {
    aliexpressPublishedDataList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

/** 获取店铺列表 */
function getShopList() {
  selectShop().then(response => {
    console.log('店铺数据响应:', response);
    if (response.code === 200 && response.rows) {
      shopOptions.value = response.rows.map(item => {
        return {
          value: item.shopName,
          label: item.shopName
        }
      });
    } else {
      proxy.$modal.msgError('获取店铺列表失败');
    }
  }).catch(error => {
    console.error('获取店铺列表错误:', error);
    proxy.$modal.msgError('获取店铺列表失败');
  });
}



// 表单重置
function reset() {
  form.value = {
    commodityId: null,
    statisticalTime: null,
    paymentConversion: null,
    searchExposure: null,
    successfulRefund: null,
    visitors: null,
    goodsAdditional: null,
    goodsCollection: null,
    searchClicks: null,
    transactionAmount: null,
    pricePay: null
  };
  proxy.resetForm("aliexpressPublishedDataRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [
    new Date(Date.now() ).toISOString().split('T')[0],
    new Date(Date.now() ).toISOString().split('T')[0]
  ];
  proxy.resetForm("queryRef");
  handleQuery();
}
/** 处理日期范围快捷选择 */
function handleDateRange(days) {
  const end = new Date()
  const start = new Date()
  start.setTime(start.getTime() - 3600 * 1000 * 24 * days)
  dateRange.value = [
    start.toISOString().split('T')[0],
    end.toISOString().split('T')[0]
  ]
  handleQuery()
}
// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.commodityId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加速卖通刊登数据";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _commodityId = row.commodityId || ids.value
  getAliexpressPublishedData(_commodityId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改速卖通刊登数据";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["aliexpressPublishedDataRef"].validate(valid => {
    if (valid) {
      if (form.value.commodityId != null) {
        updateAliexpressPublishedData(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addAliexpressPublishedData(form.value).then(response => {
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
  const _commodityIds = row.commodityId || ids.value;
  proxy.$modal.confirm('是否确认删除速卖通刊登数据编号为"' + _commodityIds + '"的数据项？').then(function() {
    return delAliexpressPublishedData(_commodityIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('aliexpress/aliexpressPublishedData/export', {
    ...queryParams.value
  }, `aliexpressPublishedData_${new Date().getTime()}.xlsx`)
}
onMounted(() => {
  getList();
  getShopList();
});
getList();
</script>
