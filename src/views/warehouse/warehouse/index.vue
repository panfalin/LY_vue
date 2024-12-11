<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="sku" prop="sku">
        <el-input
          v-model="queryParams.sku"
          placeholder="请输入sku"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="备货单号" prop="stockId">
        <el-input
          v-model="queryParams.stockId"
          placeholder="请输入备货单号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="备货仓" prop="stockWarehouse">
        <el-input
          v-model="queryParams.stockWarehouse"
          placeholder="请输入备货仓"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="货品编号" prop="goodsId">
        <el-input
          v-model="queryParams.goodsId"
          placeholder="请输入货品编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="货品数量" prop="goodsNumber">
        <el-input
          v-model="queryParams.goodsNumber"
          placeholder="请输入货品数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="店铺名" prop="shopId">
        <el-input
          v-model="queryParams.shopId"
          placeholder="请输入店铺名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="箱号1" prop="box1">
        <el-input
          v-model="queryParams.box1"
          placeholder="请输入箱号1"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="箱号2" prop="box2">
        <el-input
          v-model="queryParams.box2"
          placeholder="请输入箱号2"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="箱号3" prop="box3">
        <el-input
          v-model="queryParams.box3"
          placeholder="请输入箱号3"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="箱号4" prop="box4">
        <el-input
          v-model="queryParams.box4"
          placeholder="请输入箱号4"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="箱号5" prop="box5">
        <el-input
          v-model="queryParams.box5"
          placeholder="请输入箱号5"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="箱号6" prop="box6">
        <el-input
          v-model="queryParams.box6"
          placeholder="请输入箱号6"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="箱号7" prop="box7">
        <el-input
          v-model="queryParams.box7"
          placeholder="请输入箱号7"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="箱号8" prop="box8">
        <el-input
          v-model="queryParams.box8"
          placeholder="请输入箱号8"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="箱号9" prop="box9">
        <el-input
          v-model="queryParams.box9"
          placeholder="请输入箱号9"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="箱号10" prop="box10">
        <el-input
          v-model="queryParams.box10"
          placeholder="请输入箱号10"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="外箱尺寸" prop="boxSize">
        <el-input
          v-model="queryParams.boxSize"
          placeholder="请输入外箱尺寸"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="重量" prop="weight">
        <el-input
          v-model="queryParams.weight"
          placeholder="请输入重量"
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
          v-hasPermi="['warehouse:warehouse:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['warehouse:warehouse:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['warehouse:warehouse:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['warehouse:warehouse:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Document"
          @click="handleExportPackingList"
          v-hasPermi="['warehouse:warehouse:export']"
        >导出装箱单</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="warehouseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="sku" align="center" prop="sku" />
      <el-table-column label="备货单号" align="center" prop="stockId" />
      <el-table-column label="备货仓" align="center" prop="stockWarehouse" />
      <el-table-column label="货品编号" align="center" prop="goodsId" />
      <el-table-column label="货品数量" align="center" prop="goodsNumber" />
      <el-table-column label="店铺名" align="center" prop="shopId" />
      <el-table-column label="箱号1" align="center" prop="box1" />
      <el-table-column label="箱号2" align="center" prop="box2" />
      <el-table-column label="箱号3" align="center" prop="box3" />
      <el-table-column label="箱号4" align="center" prop="box4" />
      <el-table-column label="箱号5" align="center" prop="box5" />
      <el-table-column label="箱号6" align="center" prop="box6" />
      <el-table-column label="箱号7" align="center" prop="box7" />
      <el-table-column label="箱号8" align="center" prop="box8" />
      <el-table-column label="箱号9" align="center" prop="box9" />
      <el-table-column label="箱号10" align="center" prop="box10" />
      <el-table-column label="外箱尺寸" align="center" prop="boxSize" />
      <el-table-column label="重量" align="center" prop="weight" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['warehouse:warehouse:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['warehouse:warehouse:remove']">删除</el-button>
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

    <!-- 添加或修改warehouse对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="warehouseRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="sku" prop="sku">
          <el-input v-model="form.sku" placeholder="请输入sku" />
        </el-form-item>
        <el-form-item label="备货单号" prop="stockId">
          <el-input v-model="form.stockId" placeholder="请输入备货单号" />
        </el-form-item>
        <el-form-item label="备货仓" prop="stockWarehouse">
          <el-input v-model="form.stockWarehouse" placeholder="请输入备货仓" />
        </el-form-item>
        <el-form-item label="货品编号" prop="goodsId">
          <el-input v-model="form.goodsId" placeholder="请输入货品编号" />
        </el-form-item>
        <el-form-item label="货品数量" prop="goodsNumber">
          <el-input v-model="form.goodsNumber" placeholder="请输入货品数量" />
        </el-form-item>
        <el-form-item label="店铺名" prop="shopId">
          <el-input v-model="form.shopId" placeholder="请输入店铺名" />
        </el-form-item>
        <el-form-item label="箱号1" prop="box1">
          <el-input v-model="form.box1" placeholder="请输入箱号1" />
        </el-form-item>
        <el-form-item label="箱号2" prop="box2">
          <el-input v-model="form.box2" placeholder="请输入箱号2" />
        </el-form-item>
        <el-form-item label="箱号3" prop="box3">
          <el-input v-model="form.box3" placeholder="请输入箱号3" />
        </el-form-item>
        <el-form-item label="箱号4" prop="box4">
          <el-input v-model="form.box4" placeholder="请输入箱号4" />
        </el-form-item>
        <el-form-item label="箱号5" prop="box5">
          <el-input v-model="form.box5" placeholder="请输入箱号5" />
        </el-form-item>
        <el-form-item label="箱号6" prop="box6">
          <el-input v-model="form.box6" placeholder="请输入箱号6" />
        </el-form-item>
        <el-form-item label="箱号7" prop="box7">
          <el-input v-model="form.box7" placeholder="请输入箱号7" />
        </el-form-item>
        <el-form-item label="箱号8" prop="box8">
          <el-input v-model="form.box8" placeholder="请输入箱号8" />
        </el-form-item>
        <el-form-item label="箱号9" prop="box9">
          <el-input v-model="form.box9" placeholder="请输入箱号9" />
        </el-form-item>
        <el-form-item label="箱号10" prop="box10">
          <el-input v-model="form.box10" placeholder="请输入箱号10" />
        </el-form-item>
        <el-form-item label="外箱尺寸" prop="boxSize">
          <el-input v-model="form.boxSize" placeholder="请输入外箱尺寸" />
        </el-form-item>
        <el-form-item label="重量" prop="weight">
          <el-input v-model="form.weight" placeholder="请输入重量" />
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

<script setup name="Warehouse">
import { listWarehouse, getWarehouse, delWarehouse, addWarehouse, updateWarehouse } from "@/api/warehouse/warehouse";

const { proxy } = getCurrentInstance();

const warehouseList = ref([]);
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
    sku: null,
    stockId: null,
    stockWarehouse: null,
    goodsId: null,
    goodsNumber: null,
    shopId: null,
    box1: null,
    box2: null,
    box3: null,
    box4: null,
    box5: null,
    box6: null,
    box7: null,
    box8: null,
    box9: null,
    box10: null,
    boxSize: null,
    weight: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询warehouse列表 */
function getList() {
  loading.value = true;
  listWarehouse(queryParams.value).then(response => {
    warehouseList.value = response.rows;
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
    sku: null,
    stockId: null,
    stockWarehouse: null,
    goodsId: null,
    goodsNumber: null,
    shopId: null,
    box1: null,
    box2: null,
    box3: null,
    box4: null,
    box5: null,
    box6: null,
    box7: null,
    box8: null,
    box9: null,
    box10: null,
    boxSize: null,
    weight: null
  };
  proxy.resetForm("warehouseRef");
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
  ids.value = selection.map(item => item.sku);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加warehouse";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _sku = row.sku || ids.value
  getWarehouse(_sku).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改warehouse";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["warehouseRef"].validate(valid => {
    if (valid) {
      if (form.value.sku != null) {
        updateWarehouse(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addWarehouse(form.value).then(response => {
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
  const _skus = row.sku || ids.value;
  proxy.$modal.confirm('是否确认删除warehouse编号为"' + _skus + '"的数据项？').then(function() {
    return delWarehouse(_skus);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('warehouse/warehouse/export', {
    ...queryParams.value
  }, `warehouse_${new Date().getTime()}.xlsx`)
}

/** 导出装箱单按钮操作 */
function handleExportPackingList() {
  proxy.$modal.confirm('是否确认导出所有装箱单数据项？').then(() => {
    proxy.$modal.loading("正在导出装箱单，请稍候...");
    return proxy.download('warehouse/warehouse/exportPackingList', {
      ...queryParams.value
    }, `装箱单_${new Date().getTime()}.xlsx`);
  }).then(() => {
    proxy.$modal.msgSuccess("导出成功");
  }).catch(() => {});
}

getList();
</script>
