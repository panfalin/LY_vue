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
              label="蔡晓纯"
              value="蔡晓纯"
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
      <el-table-column label="图片" align="center" prop="picture" width="180">
        <template #default="scope">
          <img :src="getProxiedImageUrl(scope.row.picture)" alt="图片" style="width: 100%; height: auto;" />
          
        </template>
      </el-table-column>
      <el-table-column label="sku" align="center" prop="sku" width="180" />
      <el-table-column label="负责人" align="center" prop="skuPerson">
        <template #default="scope">
          <el-select
            v-model="scope.row.skuPerson"
            placeholder="请选择负责人"
            @change="handlePersonChange(scope.row)"
            style="width: 120px"
          >
            <el-option
              v-for="item in personOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="POP竞对" align="center" prop="publicationIdPop">
        <template #default="scope">
          <div v-if="scope.row.isEditingPop" class="competition-inputs">
            <div class="competition-inputs-container">
              <div v-for="(id, index) in scope.row.tempPopIds" :key="index" class="competition-input-item">
                <el-input
                  v-model="scope.row.tempPopIds[index]"
                  placeholder="请输入竞对ID"
                >
                  <template #prefix>
                    <el-icon><Document /></el-icon>
                  </template>
                </el-input>
                <el-icon 
                  class="delete-icon" 
                  @click="removeId(scope.row, 'pop', index)" 
                  v-if="scope.row.tempPopIds.length > 1"
                >
                  <Delete />
                </el-icon>
              </div>
              <div class="competition-buttons">
                <el-button 
                  v-if="scope.row.tempPopIds.length < 5"
                  type="primary" 
                  link 
                  @click="addNewId(scope.row, 'pop')"
                >
                  <el-icon><Plus /></el-icon> 添加竞对
                </el-button>
                <el-button 
                  type="primary"
                  size="small"
                  @click="handleSaveIds(scope.row, 'pop')"
                >
                  <el-icon><Check /></el-icon> 保存
                </el-button>
              </div>
            </div>
          </div>
          <div v-else @click="handleEditIds(scope.row, 'pop')" class="competition-cell">
            <template v-if="scope.row.publicationIdPop">
              <div class="competition-tags-vertical">
                <div
                  v-for="(id, index) in scope.row.publicationIdPop.split(',')"
                  :key="index"
                  class="competition-tag-item"
                >
                  {{ id }}
                </div>
              </div>
            </template>
            <div v-else class="add-competition-placeholder">
              <el-icon><Plus /></el-icon>
              <span>点击添加竞对</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="全托管竞对" align="center" prop="publicationIdAll">
        <template #default="scope">
          <div v-if="scope.row.isEditingAll" class="competition-inputs">
            <div class="competition-inputs-container">
              <div v-for="(id, index) in scope.row.tempAllIds" :key="index" class="competition-input-item">
                <el-input
                  v-model="scope.row.tempAllIds[index]"
                  placeholder="请输入竞对ID"
                >
                  <template #prefix>
                    <el-icon><Document /></el-icon>
                  </template>
                </el-input>
                <el-icon 
                  class="delete-icon" 
                  @click="removeId(scope.row, 'all', index)" 
                  v-if="scope.row.tempAllIds.length > 1"
                >
                  <Delete />
                </el-icon>
              </div>
              <div class="competition-buttons">
                <el-button 
                  v-if="scope.row.tempAllIds.length < 5"
                  type="primary" 
                  link 
                  @click="addNewId(scope.row, 'all')"
                >
                  <el-icon><Plus /></el-icon> 添加竞对
                </el-button>
                <el-button 
                  type="primary"
                  size="small"
                  @click="handleSaveIds(scope.row, 'all')"
                >
                  <el-icon><Check /></el-icon> 保存
                </el-button>
              </div>
            </div>
          </div>
          <div v-else @click="handleEditIds(scope.row, 'all')" class="competition-cell">
            <template v-if="scope.row.publicationIdAll">
              <div class="competition-tags-vertical">
                <div
                  v-for="(id, index) in scope.row.publicationIdAll.split(',')"
                  :key="index"
                  class="competition-tag-item"
                >
                  {{ id }}
                </div>
              </div>
            </template>
            <div v-else class="add-competition-placeholder">
              <el-icon><Plus /></el-icon>
              <span>点击添加竞对</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="半托管竞对" align="center" prop="publicationIdHalf">
        <template #default="scope">
          <div v-if="scope.row.isEditingHalf" class="competition-inputs">
            <div class="competition-inputs-container">
              <div v-for="(id, index) in scope.row.tempHalfIds" :key="index" class="competition-input-item">
                <el-input
                  v-model="scope.row.tempHalfIds[index]"
                  placeholder="请输入竞对ID"
                >
                  <template #prefix>
                    <el-icon><Document /></el-icon>
                  </template>
                </el-input>
                <el-icon 
                  class="delete-icon" 
                  @click="removeId(scope.row, 'half', index)" 
                  v-if="scope.row.tempHalfIds.length > 1"
                >
                  <Delete />
                </el-icon>
              </div>
              <div class="competition-buttons">
                <el-button 
                  v-if="scope.row.tempHalfIds.length < 5"
                  type="primary" 
                  link 
                  @click="addNewId(scope.row, 'half')"
                >
                  <el-icon><Plus /></el-icon> 添加竞对
                </el-button>
                <el-button 
                  type="primary"
                  size="small"
                  @click="handleSaveIds(scope.row, 'half')"
                >
                  <el-icon><Check /></el-icon> 保存
                </el-button>
              </div>
            </div>
          </div>
          <div v-else @click="handleEditIds(scope.row, 'half')" class="competition-cell">
            <template v-if="scope.row.publicationIdHalf">
              <div class="competition-tags-vertical">
                <div
                  v-for="(id, index) in scope.row.publicationIdHalf.split(',')"
                  :key="index"
                  class="competition-tag-item"
                >
                  {{ id }}
                </div>
              </div>
            </template>
            <div v-else class="add-competition-placeholder">
              <el-icon><Plus /></el-icon>
              <span>点击添加竞对</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['aliexpress:competition:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['aliexpress:competition:remove']">删除</el-button>
        </template>
      </el-table-column> -->
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
import { Plus, Delete, Document, Check } from '@element-plus/icons-vue'

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
const getProxiedImageUrl = (url) => {
  if (!url) return '';
  // 使用 images.weserv.nl 代理服务
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&default=https://via.placeholder.com/80x80?text=No+Image`;
};
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
    competitionList.value = response.rows.map(row => ({
      ...row,
      isEditingPop: false,
      isEditingAll: false,
      isEditingHalf: false,
      tempPopIds: row.publicationIdPop ? row.publicationIdPop.split(',') : [''],
      tempAllIds: row.publicationIdAll ? row.publicationIdAll.split(',') : [''],
      tempHalfIds: row.publicationIdHalf ? row.publicationIdHalf.split(',') : ['']
    }));
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

// 添加处理竞对ID变化的函数
function handleCompetitorChange(val, row, type) {
  const typeMap = {
    'pop': 'publicationIdPop',
    'all': 'publicationIdAll',
    'half': 'publicationIdHalf'
  };
  
  const updatedData = {
    sId: row.sId,
    [typeMap[type]]: val.join(',')
  };
  
  updateCompetition(updatedData).then(response => {
    proxy.$modal.msgSuccess("修改成功");
    getList();
  }).catch(() => {
    getList(); // 如果失败，重新加载数据
  });
}

// 处理编辑状态
function handleEditIds(row, type) {
  row[`isEditing${type.charAt(0).toUpperCase() + type.slice(1)}`] = true;
}

// 添加新的ID输入框
function addNewId(row, type) {
  const tempField = `temp${type.charAt(0).toUpperCase() + type.slice(1)}Ids`;
  if (row[tempField].length < 5) {
    row[tempField].push('');
  }
}

// 删除ID输入框
function removeId(row, type, index) {
  const tempField = `temp${type.charAt(0).toUpperCase() + type.slice(1)}Ids`;
  row[tempField].splice(index, 1);
}

// 处理保存ID
function handleSaveIds(row, type) {
  const tempField = `temp${type.charAt(0).toUpperCase() + type.slice(1)}Ids`;
  const actualField = `publicationId${type.charAt(0).toUpperCase() + type.slice(1)}`;
  
  // 过滤空值并验证数量
  const ids = row[tempField].filter(id => id.trim());
  if (ids.length > 5) {
    proxy.$modal.msgError("竞对ID不能超过5个");
    return;
  }

  const updatedData = {
    sId: row.sId,
    [actualField]: ids.join(',')
  };

  updateCompetition(updatedData).then(response => {
    if (response.code === 200) {
      row[actualField] = ids.join(',');
      row[`isEditing${type.charAt(0).toUpperCase() + type.slice(1)}`] = false;
      proxy.$modal.msgSuccess("修改成功");
      getList(); // 添加这行来刷新列表数据
    } else {
      proxy.$modal.msgError("修改失败");
      row[tempField] = row[actualField] ? row[actualField].split(',') : [''];
      row[`isEditing${type.charAt(0).toUpperCase() + type.slice(1)}`] = false;
    }
  }).catch(() => {
    proxy.$modal.msgError("修改失败，请重试");
    row[tempField] = row[actualField] ? row[actualField].split(',') : [''];
    row[`isEditing${type.charAt(0).toUpperCase() + type.slice(1)}`] = false;
    getList(); // 如果失败也刷新列表以恢复数据
  });
}

// 修改负责人选项
const personOptions = ref([
  { label: '夏慧颖', value: '夏慧颖' },
  { label: '赵世杰', value: '赵世杰' },
  { label: '陈雪芳', value: '陈雪芳' },
  { label: 'voice', value: 'voice' },
  { label: '沈娟', value: '沈娟' }
]);

// 处理负责人变更
function handlePersonChange(row) {
  const updatedData = {
    sId: row.sId,
    sku: row.sku,
    skuPerson: row.skuPerson,
    publicationIdPop: row.publicationIdPop,
    publicationIdAll: row.publicationIdAll,
    publicationIdHalf: row.publicationIdHalf
  };

  updateCompetition(updatedData).then(response => {
    if (response.code === 200) {
      proxy.$modal.msgSuccess("修改成功");
      getList(); // 重新加载列表以确保数据同步
    } else {
      proxy.$modal.msgError("修改失败");
      getList(); // 如果失败，重新加载数据
    }
  }).catch(error => {
    console.error('更新失败:', error);
    proxy.$modal.msgError("更新失败，请重试");
    getList(); // 如果失败，重新加载数据
  });
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

.competition-cell {
  cursor: pointer;
  padding: 8px;
  min-height: 40px;
  border-radius: 4px;
  transition: all 0.3s;
}

.competition-cell:hover {
  background-color: var(--el-fill-color-light);
}

.competition-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
}

.competition-tag {
  margin: 2px;
  transition: all 0.3s;
}

.competition-tag:hover {
  transform: translateY(-1px);
}

.add-competition-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  height: 32px;
  border: 1px dashed var(--el-border-color);
  border-radius: 4px;
  transition: all 0.3s;
}

.add-competition-placeholder:hover {
  color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}

.competition-inputs-container {
  background-color: var(--el-fill-color-blank);
  border-radius: 4px;
  padding: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.competition-input-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.competition-input-item:last-child {
  margin-bottom: 0;
}

.competition-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.delete-icon {
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  color: var(--el-color-danger);
  transition: all 0.3s;
  font-size: 18px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--el-color-danger-light-9);
}

.delete-icon:hover {
  background-color: var(--el-color-danger-light-7);
  transform: scale(1.1);
  color: var(--el-color-danger-dark-2);
}

/* 添加动画效果 */
.competition-inputs-container {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 表格hover效果 */
:deep(.el-table__row) {
  transition: all 0.3s;
}

:deep(.el-table__row:hover) {
  background-color: var(--el-fill-color-lighter) !important;
}

/* 输入框样式优化 */
:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-border-color) inset;
  transition: all 0.3s;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--el-color-primary) inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--el-color-primary) inset !important;
}

.competition-tags-horizontal {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  align-items: center;
  padding: 4px;
}

.competition-tag {
  margin: 0;
  transition: all 0.3s;
  white-space: nowrap;
}

.competition-tag:hover {
  transform: translateY(-1px);
}

.competition-cell {
  cursor: pointer;
  padding: 4px 8px;
  min-height: 40px;
  border-radius: 4px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.competition-tags-vertical {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  padding: 4px 0;
}

.competition-tag-item {
  padding: 8px 12px;
  background-color: var(--el-fill-color);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  text-align: center;
  transition: all 0.3s;
  margin: 2px 0;
  font-size: 14px;
  color: var(--el-text-color-primary);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.competition-tag-item:hover {
  background-color: var(--el-color-primary-light-9);
  border-color: var(--el-color-primary-light-5);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.competition-cell {
  cursor: pointer;
  padding: 4px;
  min-height: 40px;
  border-radius: 4px;
  transition: all 0.3s;
}

:deep(.el-select .el-input__wrapper) {
  padding: 0 8px;
}

:deep(.el-select) {
  width: 120px;
}

:deep(.el-select:hover .el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-color-primary) inset;
}
</style>
