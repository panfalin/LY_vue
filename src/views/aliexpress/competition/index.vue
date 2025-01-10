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
      <el-form-item label="刊登ID" prop="publicationId">
        <el-input
          v-model="queryParams.publicationId"
          placeholder="请输入刊登ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="下载链接" prop="link">-->
<!--        <el-input-->
<!--          v-model="queryParams.link"-->
<!--          placeholder="请输入下载链接"-->
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
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['aliexpress:competition:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['aliexpress:competition:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['aliexpress:competition:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['aliexpress:competition:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="competitionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="${comment}" align="center" prop="sId" />-->
      <el-table-column label="sku" align="center" prop="sku" />
      <el-table-column label="刊登ID" align="center" prop="publicationId" />
      <el-table-column label="下载链接" align="center" prop="link" />
      <el-table-column label="爬取状态" align="center" prop="crawlStatus" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['aliexpress:competition:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['aliexpress:competition:remove']">删除</el-button>
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

    <!-- 添加或修改竞对SKU对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="competitionRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="sku" prop="sku">
          <el-input v-model="form.sku" placeholder="请输入sku" />
        </el-form-item>
        <el-form-item label="刊登ID" prop="publicationId">
          <el-input v-model="form.publicationId" placeholder="请输入刊登ID" />
        </el-form-item>
        <el-form-item label="下载链接" prop="link">
          <el-input v-model="form.link" placeholder="请输入下载链接" />
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

<script setup name="Competition">
import { listCompetition, getCompetition, delCompetition, addCompetition, updateCompetition } from "@/api/aliexpress/competition";

const { proxy } = getCurrentInstance();

const competitionList = ref([]);
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
    publicationId: null,
    link: null,
    crawlStatus: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询竞对SKU列表 */
function getList() {
  loading.value = true;
  listCompetition(queryParams.value).then(response => {
    competitionList.value = response.rows;
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
    sku: null,
    publicationId: null,
    link: null,
    crawlStatus: null,
    createTime: null
  };
  proxy.resetForm("competitionRef");
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
  title.value = "添加竞对SKU";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _sId = row.sId || ids.value
  getCompetition(_sId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改竞对SKU";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["competitionRef"].validate(valid => {
    if (valid) {
      if (form.value.sId != null) {
        updateCompetition(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addCompetition(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除竞对SKU编号为"' + _sIds + '"的数据项？').then(function() {
    return delCompetition(_sIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('aliexpress/competition/export', {
    ...queryParams.value
  }, `competition_${new Date().getTime()}.xlsx`)
}

getList();
</script>
