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
      <el-form-item label="LBX单号" prop="lbxOrder">
        <el-input
          v-model="queryParams.lbxOrder"
          placeholder="请输入LBX单号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="揽收单号" prop="externalOrder">
        <el-input
          v-model="queryParams.externalOrder"
          placeholder="请输入外部揽收单号"
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
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Box"
          @click="openPrepareWarehouseDialog"
        >备仓</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Upload"
          @click="handleImportExcel"
        >导入Excel</el-button>
        <input
          type="file"
          ref="fileInput"
          style="display: none"
          accept=".xlsx,.xls"
          @change="handleFileChange"
        />
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Document"
          @click="openMabangDialog"
        >马帮订单</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="warehouseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="sku" align="center" prop="sku" width="120" />
      <el-table-column label="备货单号" align="center" prop="stockId" width="180" show-overflow-tooltip />
      <el-table-column label="备货仓" align="center" prop="stockWarehouse" width="180" />
      <el-table-column label="货品数量" align="center" prop="goodsNumber" width="80" />
      <el-table-column label="店铺名" align="center" prop="shopId" width="180" show-overflow-tooltip />
      <el-table-column label="最晚发货时间" align="center" prop="sendTime" width="120">
        <template #default="{ row }">
          {{ formatSendTime(row.sendTime) }}
        </template>
      </el-table-column>
      <el-table-column label="预约时间" align="center" prop="appointmentTime" width="160">
        <template #default="scope">
          {{ scope.row.appointmentTime || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="仓位" align="center" prop="warehousePosition" width="100">
        <template #default="scope">
          {{ scope.row.warehousePosition || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="箱号1" align="center" prop="box1" width="100" />
      <el-table-column label="箱号2" align="center" prop="box2" width="100" />
      <el-table-column label="箱号3" align="center" prop="box3" width="100" />
      <el-table-column label="箱号4" align="center" prop="box4" width="100" />
      <el-table-column label="箱号5" align="center" prop="box5" width="100" />
      <el-table-column label="箱号6" align="center" prop="box6" width="100" />
      <el-table-column label="箱号7" align="center" prop="box7" width="100" />
      <el-table-column label="箱号8" align="center" prop="box8" width="100" />
      <el-table-column label="箱号9" align="center" prop="box9" width="100" />
      <el-table-column label="LBX单号" align="center" prop="lbxOrder" min-width="150" show-overflow-tooltip>
        <template #default="{ row }">
          <el-button 
            link 
            type="primary" 
            @click="copyText(row.lbxOrder)"
          >
            {{ row.lbxOrder }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="揽收单号" align="center" prop="externalOrder" min-width="150" show-overflow-tooltip>
        <template #default="{ row }">
          <el-button 
            link 
            type="primary" 
            @click="copyText(row.externalOrder)"
          >
            {{ row.externalOrder }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120" />
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
        <!-- 新增预约时间字段 -->
        <el-form-item label="预约时间" prop="appointmentTime">
          <el-date-picker
            v-model="form.appointmentTime"
            type="datetime"
            placeholder="选择预约时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
        />
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
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 备仓弹窗 -->
    <el-dialog
      v-model="prepareWarehouseDialogVisible"
      title="备仓操作"
      width="500px"
      append-to-body
    >
      <el-form :model="prepareWarehouseForm" label-width="100px">
        <el-form-item label="选择店铺">
          <el-select
            v-model="prepareWarehouseForm.shopName"
            filterable
            placeholder="请选择店铺"
            style="width: 100%"
          >
            <el-option
              v-for="item in shopNameList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closePrepareWarehouseDialog">取消</el-button>
          <el-button type="primary" @click="confirmPrepareWarehouse">确定</el-button>

        </div>
      </template>
    </el-dialog>

    <!-- 马帮订单弹窗 -->
    <el-dialog
      title="马帮订单"
      v-model="mabangDialogVisible"
      width="400px"
    >
      <el-form :model="mabangForm">
        <el-form-item label="订单号" prop="orderNo">
          <el-input v-model="mabangForm.orderNo" placeholder="请输入订单号" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeMabangDialog">取消</el-button>
        <el-button type="primary" @click="confirmMabangOrder">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="Warehouse">
import { listWarehouse, getWarehouse, delWarehouse, addWarehouse, updateWarehouse, importExcel, getShopNameList } from "@/api/warehouse/warehouse";
import axios from 'axios';

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

// 初始化备仓弹窗的可见性
const prepareWarehouseDialogVisible = ref(false);
const prepareWarehouseForm = ref({
  shopName: ''
});

// 初始化马帮订单弹窗的可见性
const mabangDialogVisible = ref(false);
const mabangForm = reactive({
  orderNo: ''
});

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
    appointmentTime: null, 
    shopId: null,
    box1: null,
    box2: null,
    box3: null,
    box4: null,
    box5: null,
    box6: null,
    box7: null,
    box8: null,
    lbxOrder: undefined,
    externalOrder: undefined
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

// 在 setup 中添加
const shopNameList = ref([]) // 店铺名称列表

// 获取店铺名称列表
const getShopNames = async () => {
  try {
    const res = await getShopNameList()
    console.log("店铺列表",res)
    if (res.code === 200) {
      shopNameList.value = res.rows.map(item => ({
        value: item.store_name,
        label: item.store_name
      }))
    }
  } catch (error) {
    console.error('获取店铺列表失败:', error)
  }
}

/** 查询warehouse列表 */
function getList() {
  loading.value = true;
  listWarehouse(queryParams.value).then(response => {
    warehouseList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 打开备仓弹窗
function openPrepareWarehouseDialog() {
  prepareWarehouseDialogVisible.value = true;
  getShopNames() // 获取店铺列表
}

// 关闭备仓弹窗
function closePrepareWarehouseDialog() {
  prepareWarehouseDialogVisible.value = false;
  prepareWarehouseForm.value.shopName = ''; // 重置表单
}

// 确认备仓操作
function confirmPrepareWarehouse() {
  if (!prepareWarehouseForm.value.shopName) {
    proxy.$modal.msgError("请选择店铺");
    return;
  }

  proxy.$modal.loading("正在执行备仓操作...");

  // 发送备仓请求
  axios.post('http://192.168.1.122:5002/warehouse', 
    {
      username: prepareWarehouseForm.value.shopName
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  ).then(response => {
    if (response.data && response.status === 200) {
      proxy.$modal.msgSuccess("备仓操作成功");
      closePrepareWarehouseDialog();
      getList();
    } else {
      proxy.$modal.msgError(response.data.msg || "操作失败");
    }
  }).catch(error => {
    console.error('备仓操作失败:', error);
    proxy.$modal.msgError(error.response?.data?.message || "备仓操作失败，请重试");
  }).finally(() => {
    proxy.$modal.closeLoading();
  });
}

// 一键全店铺备仓
function prepareAllShops() {
  console.log('一键备仓所有店铺');
  // 在这里添加一键备仓逻辑
  closePrepareWarehouseDialog();
  proxy.$modal.msgSuccess("所有店铺备仓成功");
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
  ids.value = selection.map(item => item.sId);
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
  const sId = row.sId || ids.value
  getWarehouse(sId).then(response => {
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
  // 获取搜索栏的备货单号
  const warehouseNo = queryParams.value.stockId || 'warehouse'
  console.log(queryParams.value)
  proxy.download('warehouse/warehouse/export', {
    ...queryParams.value
  }, `${warehouseNo}.xlsx`)
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

// 触发文件选择
function handleImportExcel() {
  proxy.$refs.fileInput.click()
}

// 处理文件选择变化
function handleFileChange(event) {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  proxy.$modal.loading("正在导入数据，请稍候...")

  importExcel(formData).then(response => {
    console.log(response)
    if (response === '数据导入成功！') {
      proxy.$modal.msgSuccess("导入成功")
      getList() // 刷新列表
    } else {
      proxy.$modal.msgError(response.msg || "导入失败")
    }
  }).catch(error => {
    console.error('导入失败:', error)
    proxy.$modal.msgError(error.message || "导入失败，请检查文件格式是否正确")
  }).finally(() => {
    proxy.$modal.closeLoading()
    // 清空文件输入框
    event.target.value = ''
  })
}

// 打开马帮订单弹窗
function openMabangDialog() {
  mabangDialogVisible.value = true;
}

// 关闭马帮订单弹窗
function closeMabangDialog() {
  mabangDialogVisible.value = false;
  mabangForm.orderNo = ''; // 清空输入
}

// 确认马帮订单操作
function confirmMabangOrder() {
  if (!mabangForm.orderNo) {
    proxy.$modal.msgError("请输入订单号");
    return;
  }

  proxy.$modal.loading("正在生成马帮订单...");

  axios.post('http://192.168.1.122:5012/warehouse', 
    {
      stock_id: mabangForm.orderNo
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  ).then(response => {
    console.log('马帮响应数据:', response);
    if (response.data && response.status === 200) {
      proxy.$modal.msgSuccess("马帮订单生成成功");
      closeMabangDialog();
      getList();
    } else {
      proxy.$modal.msgError(response.data.msg || "生成订单失败");
    }
  }).catch(error => {
    console.error('马帮订单生成失败:', error);
    const errorMsg = error.response?.data?.message || "马帮订单生成失败，请重试";
    proxy.$modal.msgError(errorMsg);
  }).finally(() => {
    proxy.$modal.closeLoading();
  });
}

// 添加日期格式化函数
function formatSendTime(sendTime) {
  if (!sendTime) return '';
  
  // 从字符串中提取月/日
  const match = sendTime.match(/(\d{1,2})\/(\d{1,2})/);
  if (!match) return sendTime;
  
  const currentYear = new Date().getFullYear();
  const [, month, day] = match;
  
  // 格式化为 YYYY/MM/DD
  return `${month.padStart(2, '0')}/${day.padStart(2, '0')}`;
}

// 添加复制文本的方法
const copyText = async (text) => {
  if (!text) return
  
  try {
    await navigator.clipboard.writeText(text)
    ElMessage({
      message: '复制成功',
      type: 'success',
      duration: 1500
    })
  } catch (err) {
    // 降级处理方案
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    try {
      document.execCommand('copy')
      ElMessage({
        message: '复制成功',
        type: 'success',
        duration: 1500
      })
    } catch (err) {
      ElMessage.error('复制失败，请手动复制')
    }
    document.body.removeChild(textarea)
  }
}

getList();
</script>
