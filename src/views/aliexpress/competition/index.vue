<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="98px">
      <el-form-item label="sku" prop="sku">
        <el-input
          v-model="queryParams.sku"
          placeholder="请输入sku"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="刊登ID" prop="publicationId">
        <el-input
          v-model="queryParams.publicationId"
          placeholder="请输入刊登ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item> -->


      <!-- <el-form-item label="竞对订单类型" prop="orderType">
        <el-select
            v-model="queryParams.orderType"
            placeholder="请选择竞对订单类型"
            clearable
            style="width: 200px"
        >
          <el-option
              label="POP"
              value="POP"
          />
          <el-option
              label="半托管"
              value="半托管"
          />
          <el-option
              label="全托管"
              value="全托管"
          />
        </el-select>
      </el-form-item> -->


      <el-form-item label="sku负责人" prop="skuPerson">
        <el-input
          v-model="queryParams.skuPerson"
          placeholder="sku负责人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="sku负责人" prop="skuPerson">
        <el-select
            v-model="queryParams.skuPerson"
            placeholder="请选择负责人"
            clearable
            style="width: 200px"
        >
          <el-option
              label="夏慧颖"
              value="夏慧颖"
          />
          <el-option
              label="赵世杰"
              value="赵世杰"
          />
          <el-option
              label="陈雪芳"
              value="陈雪芳"
          />
          <el-option
              label="voice"
              value="voice"
          />
          <el-option
              label="沈娟"
              value="沈娟"
          />
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
      <el-table-column label="sku" align="center" prop="sku"  width="180" />
      <el-table-column label="负责人" align="center" prop="skuPerson" />
      <!-- <el-table-column label="竞对类型" align="center" prop="orderType" /> -->
      <el-table-column label="POP竞对" align="center" prop="publicationIdPop" />
      <el-table-column label="全托管竞对" align="center" prop="publicationIdAll" />
      <el-table-column label="半托管竞对" align="center" prop="publicationIdHalf" />
      <!-- <el-table-column label="下载链接" align="center" prop="link" /> -->
      <!-- <el-table-column label="爬取状态" align="center" prop="crawlStatus" /> -->
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
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="competitionRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="sku" prop="sku">
          <el-input v-model="form.sku" placeholder="请输入sku" />
        </el-form-item>

        <!-- <el-form-item label="sku负责人" prop="skuPerson">
          <el-input v-model="form.skuPerson" placeholder="sku负责人" />
        </el-form-item> -->

        <el-form-item label="POP竞对" prop="publicationIdPop">
          <div v-for="(item, index) in popInputs" :key="index" class="input-with-button">
            <el-input v-model="item.value" placeholder="请输入刊登ID" />
            <el-button type="danger" icon="Delete" @click="removeInput('pop', index)" v-if="popInputs.length > 1"></el-button>
          </div>
          <el-button type="primary" icon="Plus" @click="addInput('pop')">添加POP竞对</el-button>
        </el-form-item>

        <el-form-item label="全托管竞对" prop="publicationIdAll">
          <div v-for="(item, index) in allInputs" :key="index" class="input-with-button">
            <el-input v-model="item.value" placeholder="请输入刊登ID" />
            <el-button type="danger" icon="Delete" @click="removeInput('all', index)" v-if="allInputs.length > 1"></el-button>
          </div>
          <el-button type="primary" icon="Plus" @click="addInput('all')">添加全托管竞对</el-button>
        </el-form-item>

        <el-form-item label="半托管竞对" prop="publicationIdHalf">
          <div v-for="(item, index) in halfInputs" :key="index" class="input-with-button">
            <el-input v-model="item.value" placeholder="请输入刊登ID" />
            <el-button type="danger" icon="Delete" @click="removeInput('half', index)" v-if="halfInputs.length > 1"></el-button>
          </div>
          <el-button type="primary" icon="Plus" @click="addInput('half')">添加半托管竞对</el-button>
        </el-form-item>



        <!-- <el-form-item label="竞对订单类型" prop="orderType">
        <el-select
            v-model="form.orderType"
            placeholder="请选择竞对订单类型"
            clearable
            style="width: 200px"
        >
          <el-option
              label="POP"
              value="POP"
          />
          <el-option
              label="半托管"
              value="半托管"
          />
          <el-option
              label="全托管"
              value="全托管"
          />
        </el-select>
      </el-form-item> -->

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

const popInputs = ref([{ value: '' }]);
const allInputs = ref([{ value: '' }]);
const halfInputs = ref([{ value: '' }]);

const addInput = (type) => {
  const inputsMap = {
    'pop': popInputs,
    'all': allInputs,
    'half': halfInputs
  };
  inputsMap[type].value.push({ value: '' });
};

const removeInput = (type, index) => {
  const inputsMap = {
    'pop': popInputs,
    'all': allInputs,
    'half': halfInputs
  };
  inputsMap[type].value.splice(index, 1);
};

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
  popInputs.value = [{ value: '' }];
  allInputs.value = [{ value: '' }];
  halfInputs.value = [{ value: '' }];
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
    if (form.value.publicationIdPop) {
      popInputs.value = form.value.publicationIdPop.split(',').map(value => ({ value }));
    }
    if (form.value.publicationIdAll) {
      allInputs.value = form.value.publicationIdAll.split(',').map(value => ({ value }));
    }
    if (form.value.publicationIdHalf) {
      halfInputs.value = form.value.publicationIdHalf.split(',').map(value => ({ value }));
    }
    open.value = true;
    title.value = "修改竞对SKU";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["competitionRef"].validate(valid => {
    if (valid) {
      form.value.publicationIdPop = popInputs.value.map(item => item.value).filter(Boolean).join(',');
      form.value.publicationIdAll = allInputs.value.map(item => item.value).filter(Boolean).join(',');
      form.value.publicationIdHalf = halfInputs.value.map(item => item.value).filter(Boolean).join(',');

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
  proxy.$modal.confirm('是否确认删除数据项？').then(function() {
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

<style scoped>
.input-with-button {
  display: flex;
  margin-bottom: 5px;
  align-items: center;
  gap: 5px;
}
</style>
