<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="88px">
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
      <el-form-item label="店铺负责人" prop="shopPerson">
        <el-select
          v-model="queryParams.shopPerson"
          placeholder="请选择店铺负责人"
          clearable
          @change="handleQuery"
        >
          <el-option
            v-for="item in personOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
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
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['aliexpress:indicators:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="indicatorsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="店铺" align="center" prop="shopName" />
      <el-table-column label="店铺负责人" align="center" prop="shopPerson" />
      <el-table-column label="违背发货承诺订单数" align="center" prop="contraryOrderNum" />
      <el-table-column label="违规侵权" align="center" prop="illegalInfringement" />
      <el-table-column label="jit入库超时" align="center" prop="warehousTimeoutJit" />
      <el-table-column label="件重尺纠纷" align="center" prop="heavyRulerDispute" />
      <el-table-column label="售罄刊登数" align="center" prop="soldOut" />
      <el-table-column
        label="超过24小时未发货订单数" 
        align="center" 
        prop="unshippedOrders24"
        min-width="300"
      >
        <template #default="scope">
          <div v-if="scope.row.unshippedOrders24">
            <div 
              v-for="(item, index) in JSON.parse(scope.row.unshippedOrders24)" 
              :key="index" 
              class="order-item"
            >
              <div>订单编号：<el-text class="order-number" copyable>{{ item.order_id }}</el-text></div>
              <div>原因：{{ item.reason }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="jit订单异常" align="center" prop="orderExceptionJit" />
<!--      <el-table-column label="${comment}" align="center" prop="sId" />-->
<!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
<!--        <template #default="scope">-->
<!--          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['aliexpress:indicators:edit']">修改</el-button>-->
<!--          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['aliexpress:indicators:remove']">删除</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改工具指标对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="indicatorsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="店铺" prop="shopName">
          <el-input v-model="form.shopName" placeholder="请输入店铺" />
        </el-form-item>
        <el-form-item label="店铺负责人" prop="shopPerson">
          <el-input v-model="form.shopPerson" placeholder="请输入店铺负责人" />
        </el-form-item>
        <el-form-item label="违背发货承诺订单数" prop="contraryOrderNum">
          <el-input v-model="form.contraryOrderNum" placeholder="请输入违背发货承诺订单数" />
        </el-form-item>
        <el-form-item label="违规侵权" prop="illegalInfringement">
          <el-input v-model="form.illegalInfringement" placeholder="请输入违规侵权" />
        </el-form-item>
        <el-form-item label="jit入库超时" prop="warehousTimeoutJit">
          <el-input v-model="form.warehousTimeoutJit" placeholder="请输入jit入库超时" />
        </el-form-item>
        <el-form-item label="件重尺纠纷" prop="heavyRulerDispute">
          <el-input v-model="form.heavyRulerDispute" placeholder="请输入件重尺纠纷" />
        </el-form-item>
        <el-form-item label="超过24小时未发货订单数" prop="unshippedOrders24">
          <el-input v-model="form.unshippedOrders24" placeholder="请输入超过24小时未发货订单数" />
        </el-form-item>
        <el-form-item label="jit订单异常" prop="orderExceptionJit">
          <el-input v-model="form.orderExceptionJit" placeholder="请输入jit订单异常" />
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

<script setup name="Indicators">
import { listIndicators, getIndicators, delIndicators, addIndicators, updateIndicators,selectShop,SelectShopName } from "@/api/aliexpress/indicators";
import { onMounted } from 'vue'

const { proxy } = getCurrentInstance();

const indicatorsList = ref([]);
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
    shopName: null,
    shopPerson: null,
    contraryOrderNum: null,
    illegalInfringement: null,
    warehousTimeoutJit: null,
    heavyRulerDispute: null,
    unshippedOrders24: null,
    orderExceptionJit: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

const shopOptions = ref([]);
const personOptions = ref([]);

/** 获取店铺列表 */
function getShopList() {
  selectShop().then(response => {
    if (response.code === 200 && response.rows) {
      shopOptions.value = response.rows.map(item => {
        return {
          value: item.shopName,
          label: item.shopName
        }
      });
    }
  });
}

/** 获取店铺负责人列表 */
function getPersonList() {
  SelectShopName().then(response => {
    if (response.code === 200 && response.rows) {
      // 获取所有不重复的店铺负责人
      const uniquePersons = [...new Set(response.rows
        .map(item => item.shopPerson)
        .filter(person => person !== null && person !== '')
      )];
      
      personOptions.value = uniquePersons.map(person => {
        return {
          value: person,
          label: person
        }
      });
    }
  });
}

/** 查询工具指标列表 */
function getList() {
  loading.value = true;
  listIndicators(queryParams.value).then(response => {
    indicatorsList.value = response.rows;
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
    shopName: null,
    shopPerson: null,
    contraryOrderNum: null,
    illegalInfringement: null,
    warehousTimeoutJit: null,
    heavyRulerDispute: null,
    unshippedOrders24: null,
    orderExceptionJit: null,
    sId: null,
    createTime: null
  };
  proxy.resetForm("indicatorsRef");
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
  title.value = "添加工具指标";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _sId = row.sId || ids.value
  getIndicators(_sId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改工具指标";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["indicatorsRef"].validate(valid => {
    if (valid) {
      if (form.value.sId != null) {
        updateIndicators(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addIndicators(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除工具指标编号为"' + _sIds + '"的数据项？').then(function() {
    return delIndicators(_sIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('aliexpress/indicators/export', {
    ...queryParams.value
  }, `indicators_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
  getShopList();
  getPersonList();
});
</script>

<style scoped>
.order-item {
  text-align: center;
  padding: 5px 10px;
  margin: 5px 0;
  white-space: normal;
  word-break: break-all;
  line-height: 1.5;
}
.order-number {
  cursor: pointer;
}
.order-number:hover {
  color: #409EFF;
}
</style>
