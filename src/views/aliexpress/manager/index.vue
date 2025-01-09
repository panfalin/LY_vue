<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="运营ID" prop="operatingId">
        <el-input
          v-model="queryParams.operatingId"
          placeholder="请输入运营ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="日期" prop="date">
        <el-date-picker clearable
          v-model="queryParams.date"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="分析" prop="analyze">
        <el-input
          v-model="queryParams.analyze"
          placeholder="请输入分析"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="结果" prop="result">
        <el-input
          v-model="queryParams.result"
          placeholder="请输入结果"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="店铺名称" prop="shopName">
        <el-input
          v-model="queryParams.shopName"
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
          v-hasPermi="['aliexpress:manager:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['aliexpress:manager:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['aliexpress:manager:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['aliexpress:manager:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="managerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="sId" />
      <el-table-column label="运营ID" align="center" prop="operatingId" />
      <el-table-column label="检查内容" align="center" prop="checkContent" />
      <el-table-column label="具体操作内容" align="center" prop="operationContent" />
      <el-table-column label="日期" align="center" prop="date" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.date, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分析" align="center" prop="analyze" />
      <el-table-column label="结果" align="center" prop="result" />
      <el-table-column label="店铺名称" align="center" prop="shopName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['aliexpress:manager:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['aliexpress:manager:remove']">删除</el-button>
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

    <!-- 添加或修改店长运营对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="managerRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="运营ID" prop="operatingId">
          <el-input v-model="form.operatingId" placeholder="请输入运营ID" />
        </el-form-item>
        <el-form-item label="检查内容">
          <editor v-model="form.checkContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="具体操作内容">
          <editor v-model="form.operationContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="日期" prop="date">
          <el-date-picker clearable
            v-model="form.date"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="分析" prop="analyze">
          <el-input v-model="form.analyze" placeholder="请输入分析" />
        </el-form-item>
        <el-form-item label="结果" prop="result">
          <el-input v-model="form.result" placeholder="请输入结果" />
        </el-form-item>
        <el-form-item label="店铺名称" prop="shopName">
          <el-input v-model="form.shopName" placeholder="请输入店铺名称" />
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

<script setup name="Manager">
import { listManager, getManager, delManager, addManager, updateManager } from "@/api/aliexpress/manager";

const { proxy } = getCurrentInstance();

const managerList = ref([]);
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
    operatingId: null,
    checkContent: null,
    operationContent: null,
    date: null,
    analyze: null,
    result: null,
    shopName: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询店长运营列表 */
function getList() {
  loading.value = true;
  listManager(queryParams.value).then(response => {
    managerList.value = response.rows;
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
    operatingId: null,
    checkContent: null,
    operationContent: null,
    date: null,
    analyze: null,
    result: null,
    shopName: null,
    createTime: null
  };
  proxy.resetForm("managerRef");
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
  title.value = "添加店长运营";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _sId = row.sId || ids.value
  getManager(_sId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改店长运营";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["managerRef"].validate(valid => {
    if (valid) {
      if (form.value.sId != null) {
        updateManager(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addManager(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除店长运营编号为"' + _sIds + '"的数据项？').then(function() {
    return delManager(_sIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('aliexpress/manager/export', {
    ...queryParams.value
  }, `manager_${new Date().getTime()}.xlsx`)
}

getList();
</script>
