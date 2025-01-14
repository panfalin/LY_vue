<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
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
      <el-form-item label="sku" prop="sku">
        <el-input
          v-model="queryParams.sku"
          placeholder="请输入sku"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="在途库存数量" prop="transitQuantity">-->
<!--        <el-input-->
<!--          v-model="queryParams.transitQuantity"-->
<!--          placeholder="请输入在途库存数量"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="库存数量" prop="stockQuantity">-->
<!--        <el-input-->
<!--          v-model="queryParams.stockQuantity"-->
<!--          placeholder="请输入库存数量"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="未发货数量" prop="unshippedQuantity">-->
<!--        <el-input-->
<!--          v-model="queryParams.unshippedQuantity"-->
<!--          placeholder="请输入未发货数量"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="店铺名称" prop="storeName">
        <el-input
          v-model="queryParams.storeName"
          placeholder="请输入店铺名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="成本价格" prop="costPrice">-->
<!--        <el-input-->
<!--          v-model="queryParams.costPrice"-->
<!--          placeholder="请输入成本价格"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="库存金额" prop="inventoryCost">-->
<!--        <el-input-->
<!--          v-model="queryParams.inventoryCost"-->
<!--          placeholder="请输入库存金额"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
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
          v-hasPermi="['aliexpress:unsalable:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="unsalableList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="年份" align="center" prop="year" />
      <el-table-column label="月份" align="center" prop="moon" />
      <el-table-column label="sku" align="center" prop="sku" />
      <el-table-column label="在途库存数量" align="center" prop="transitQuantity" />
      <el-table-column label="库存数量" align="center" prop="stockQuantity" />
      <el-table-column label="未发货数量" align="center" prop="unshippedQuantity" />
      <el-table-column label="店铺名称" align="center" prop="storeName" />
      <el-table-column label="成本价格" align="center" prop="costPrice" />
      <el-table-column label="库存金额" align="center" prop="inventoryCost" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['aliexpress:unsalable:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['aliexpress:unsalable:remove']">删除</el-button>
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

<script setup name="Unsalable">
import { listUnsalable, getUnsalable, delUnsalable, addUnsalable, updateUnsalable } from "@/api/aliexpress/unsalable";

const { proxy } = getCurrentInstance();

const unsalableList = ref([]);
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
    transitQuantity: null,
    stockQuantity: null,
    unshippedQuantity: null,
    storeName: null,
    costPrice: null,
    inventoryCost: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询滞销库存列表 */
function getList() {
  loading.value = true;
  listUnsalable(queryParams.value).then(response => {
    unsalableList.value = response.rows;
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
    year: null,
    moon: null,
    sku: null,
    transitQuantity: null,
    stockQuantity: null,
    unshippedQuantity: null,
    storeName: null,
    costPrice: null,
    inventoryCost: null
  };
  proxy.resetForm("unsalableRef");
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
  ids.value = selection.map(item => item.year);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加滞销库存";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _year = row.year || ids.value
  getUnsalable(_year).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改滞销库存";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["unsalableRef"].validate(valid => {
    if (valid) {
      if (form.value.year != null) {
        updateUnsalable(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addUnsalable(form.value).then(response => {
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
  const _years = row.year || ids.value;
  proxy.$modal.confirm('是否确认删除滞销库存编号为"' + _years + '"的数据项？').then(function() {
    return delUnsalable(_years);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('aliexpress/unsalable/export', {
    ...queryParams.value
  }, `unsalable_${new Date().getTime()}.xlsx`)
}

getList();
</script>
