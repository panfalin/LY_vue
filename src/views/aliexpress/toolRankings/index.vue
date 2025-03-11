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
      <el-form-item label="店铺负责人" prop="personName">
        <el-select
            v-model="queryParams.personName"
            placeholder="请选择店铺负责人"
            clearable
            @change="handlePersonChange"
        >
          <el-option
              v-for="item in personOptions"
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
          v-hasPermi="['aliexpress:toolRankings:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="toolRankingsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="店铺" align="center" prop="shops" />
      <el-table-column label="负责人" align="center" prop="personName" />
      <el-table-column label="日期" align="center" prop="shopDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.shopDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主营类目" align="center" prop="mainCategory" />
      <el-table-column label="层级" align="center" prop="level" />
      <el-table-column label="排名" align="center" prop="ranking" />
      <el-table-column label="近30天支付金额" align="center" prop="amountPaid" />
      <el-table-column label="访客" align="center" prop="visitors" />
      <el-table-column label="刊登数量" align="center" prop="storesPublished" />

    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改速卖通工具-店铺排名对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="toolRankingsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="店铺" prop="shops">
          <el-input v-model="form.shops" placeholder="请输入店铺" />
        </el-form-item>
        <el-form-item label="负责人" prop="personName">
          <el-input v-model="form.personName" placeholder="请输入负责人" />
        </el-form-item>
        <el-form-item label="日期" prop="shopDate">
          <el-date-picker clearable
            v-model="form.shopDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="主营类目" prop="mainCategory">
          <el-input v-model="form.mainCategory" placeholder="请输入主营类目" />
        </el-form-item>
        <el-form-item label="层级" prop="level">
          <el-input v-model="form.level" placeholder="请输入层级" />
        </el-form-item>
        <el-form-item label="排名" prop="ranking">
          <el-input v-model="form.ranking" placeholder="请输入排名" />
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

<script setup name="ToolRankings">
import { listToolRankings, getToolRankings, delToolRankings, addToolRankings, updateToolRankings } from "@/api/aliexpress/toolRankings";
import { selectShop,SelectShopName } from "@/api/aliexpress/indicators";
import { onMounted } from 'vue'
const { proxy } = getCurrentInstance();

const toolRankingsList = ref([]);
const shopOptions = ref([]);
const personOptions = ref([]);
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
    shops: null,
    personName: null,
    beginTime: new Date(Date.now() - 24*60*60*1000).toISOString().split('T')[0],
    endTime: new Date(Date.now() - 24*60*60*1000).toISOString().split('T')[0],
    mainCategory: null,
    level: null,
    ranking: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

const dateRange = ref([
  new Date(Date.now() - 24*60*60*1000).toISOString().split('T')[0],
  new Date(Date.now() - 24*60*60*1000).toISOString().split('T')[0]
]);

/** 查询速卖通工具-店铺排名列表 */
function getList() {
  loading.value = true;
  const params = {
    ...queryParams.value,
    shops: queryParams.value.shopName,
    personName: queryParams.value.personName,
    beginTime: dateRange.value && dateRange.value[0] ? dateRange.value[0] : null,
    endTime: dateRange.value && dateRange.value[1] ? dateRange.value[1] : null
  };
  // delete params.shopName;
  // delete params.shopPerson;
  
  listToolRankings(params).then(response => {
    toolRankingsList.value = response.rows;
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
    shops: null,
    personName: null,
    shopDate: null,
    mainCategory: null,
    level: null,
    ranking: null
  };
  proxy.resetForm("toolRankingsRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [
    new Date(Date.now() - 24*60*60*1000).toISOString().split('T')[0],
    new Date(Date.now() - 24*60*60*1000).toISOString().split('T')[0]
  ];
  proxy.resetForm("queryRef");
  // 重置后重新获取店铺列表
  getShopList('');
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.shops);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加速卖通工具-店铺排名";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _shops = row.shops || ids.value
  getToolRankings(_shops).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改速卖通工具-店铺排名";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["toolRankingsRef"].validate(valid => {
    if (valid) {
      if (form.value.shops != null) {
        updateToolRankings(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addToolRankings(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 获取店铺列表 */
function getShopList(shopPerson = '') {
  selectShop({ 
    shopPerson,
    type:'POP'
  }).then(response => {
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

/** 获取店铺负责人列表 */
function getPersonList() {
  SelectShopName().then(response => {
    console.log('负责人数据响应:', response);
    if (response.code === 200 && response.rows) {
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

      // 在获取到负责人列表后，立即调用获取店铺列表的方法，并传入当前选中的负责人
      if (queryParams.value.personName) {
        getShopList(queryParams.value.personName);
      } else {
        getShopList();
      }
      
    } else {
      proxy.$modal.msgError('获取负责人列表失败');
    }
  }).catch(error => {
    console.error('获取负责人列表错误:', error);
    proxy.$modal.msgError('获取负责人列表失败');
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _shopss = row.shops || ids.value;
  proxy.$modal.confirm('是否确认删除速卖通工具-店铺排名编号为"' + _shopss + '"的数据项？').then(function() {
    return delToolRankings(_shopss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('aliexpress/toolRankings/export', {
    ...queryParams.value
  }, `toolRankings_${new Date().getTime()}.xlsx`)
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

/** 处理负责人选择变化 */
function handlePersonChange(value) {
  // 获取店铺列表
  getShopList(value);
  // 获取数据列表
  handleQuery();
}

onMounted(() => {
  getList();
  getShopList('');
  getPersonList();
});
getList();
</script>
