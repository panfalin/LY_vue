<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="客户姓名" prop="clientName">
        <el-input
          v-model="queryParams.clientName"
          placeholder="请输入客户姓名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户联系电话" prop="clientNumber">
        <el-input
          v-model="queryParams.clientNumber"
          placeholder="请输入客户联系电话"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户电子邮箱" prop="email">
        <el-input
          v-model="queryParams.email"
          placeholder="请输入客户电子邮箱"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户头像链接" prop="avatarUrl">
        <el-input
          v-model="queryParams.avatarUrl"
          placeholder="请输入客户头像链接"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createdTime">
        <el-date-picker clearable
          v-model="queryParams.createdTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="自定义字段1" prop="customFieldOne">
        <el-input
          v-model="queryParams.customFieldOne"
          placeholder="请输入自定义字段1"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="自定义字段2" prop="customFieldTwo">
        <el-input
          v-model="queryParams.customFieldTwo"
          placeholder="请输入自定义字段2"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="自定义字段3" prop="customFieldThree">
        <el-input
          v-model="queryParams.customFieldThree"
          placeholder="请输入自定义字段3"
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
          v-hasPermi="['aliexpress:client:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['aliexpress:client:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['aliexpress:client:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['aliexpress:client:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="clientList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="客户ID" align="center" prop="clientId" />
      <el-table-column label="客户姓名" align="center" prop="clientName" />
      <el-table-column label="客户联系电话" align="center" prop="clientNumber" />
      <el-table-column label="客户电子邮箱" align="center" prop="email" />
      <el-table-column label="客户头像链接" align="center" prop="avatarUrl" />
      <el-table-column label="创建时间" align="center" prop="createdTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createdTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="自定义字段1" align="center" prop="customFieldOne" />
      <el-table-column label="自定义字段2" align="center" prop="customFieldTwo" />
      <el-table-column label="自定义字段3" align="center" prop="customFieldThree" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['aliexpress:client:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['aliexpress:client:remove']">删除</el-button>
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

    <!-- 添加或修改用户对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="clientRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="客户姓名" prop="clientName">
          <el-input v-model="form.clientName" placeholder="请输入客户姓名" />
        </el-form-item>
        <el-form-item label="客户联系电话" prop="clientNumber">
          <el-input v-model="form.clientNumber" placeholder="请输入客户联系电话" />
        </el-form-item>
        <el-form-item label="客户电子邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入客户电子邮箱" />
        </el-form-item>
        <el-form-item label="客户头像链接" prop="avatarUrl">
          <el-input v-model="form.avatarUrl" placeholder="请输入客户头像链接" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createdTime">
          <el-date-picker clearable
            v-model="form.createdTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="自定义字段1" prop="customFieldOne">
          <el-input v-model="form.customFieldOne" placeholder="请输入自定义字段1" />
        </el-form-item>
        <el-form-item label="自定义字段2" prop="customFieldTwo">
          <el-input v-model="form.customFieldTwo" placeholder="请输入自定义字段2" />
        </el-form-item>
        <el-form-item label="自定义字段3" prop="customFieldThree">
          <el-input v-model="form.customFieldThree" placeholder="请输入自定义字段3" />
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

<script setup name="Client">
import { listClient, getClient, delClient, addClient, updateClient } from "@/api/aliexpress/client";

const { proxy } = getCurrentInstance();

const clientList = ref([]);
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
    clientName: null,
    clientNumber: null,
    email: null,
    avatarUrl: null,
    createdTime: null,
    customFieldOne: null,
    customFieldTwo: null,
    customFieldThree: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询用户列表 */
function getList() {
  loading.value = true;
  listClient(queryParams.value).then(response => {
    clientList.value = response.rows;
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
    clientId: null,
    clientName: null,
    clientNumber: null,
    email: null,
    avatarUrl: null,
    createdTime: null,
    updateTime: null,
    createBy: null,
    updateBy: null,
    customFieldOne: null,
    customFieldTwo: null,
    customFieldThree: null
  };
  proxy.resetForm("clientRef");
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
  ids.value = selection.map(item => item.clientId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加用户";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _clientId = row.clientId || ids.value
  getClient(_clientId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改用户";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["clientRef"].validate(valid => {
    if (valid) {
      if (form.value.clientId != null) {
        updateClient(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addClient(form.value).then(response => {
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
  const _clientIds = row.clientId || ids.value;
  proxy.$modal.confirm('是否确认删除用户编号为"' + _clientIds + '"的数据项？').then(function() {
    return delClient(_clientIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('aliexpress/client/export', {
    ...queryParams.value
  }, `client_${new Date().getTime()}.xlsx`)
}

getList();
</script>
