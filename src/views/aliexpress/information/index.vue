<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="88px">
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



      <el-form-item label="渠道类型" prop="orderType">
        <el-select
            v-model="queryParams.orderType"
            placeholder="请选择渠道类型"
            clearable
            style="width: 200px"
        >
          
        <el-option
              label="半托管"
              value="半托管"
          />
          
          <el-option
              label="POP"
              value="POP"
          />
          <el-option
              label="全托管"
              value="全托管"
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
          v-hasPermi="['aliexpress:information:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['aliexpress:information:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['aliexpress:information:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['aliexpress:information:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="informationList" :span-method="spanMethod" border>
      <el-table-column label="图片" align="center" prop="picture" width="180">
        <template #default="scope">
          <img :src="getProxiedImageUrl(scope.row.picture)" alt="图片" style="width: 100%; height: auto;" />
        </template>
      </el-table-column>
      <el-table-column label="sku" align="center" prop="sku"width="150px" />
      <el-table-column label="sku负责人" align="center" prop="skuPerson"width="150px" />
      <el-table-column label="渠道类型" align="center" prop="orderType" width="70px"/>
      <el-table-column label="市场容量" align="center" prop="marketCapacity" width="70px"/>
      <el-table-column label="刊登ID" align="center" prop="publicationId" width="150px"/>
      <el-table-column label="店铺" align="center" prop="shops" width="300px" />
      <el-table-column label="店铺类型" align="center" prop="shopsType"width="70px" />
      <el-table-column label="链接类型" align="center" prop="linkType" width="110px"/>
      <el-table-column label="7日订单日均量" align="center" prop="averageDailyOrder7" width="110px"/>
      <el-table-column label="评分" align="center" prop="score" />
      <el-table-column label="180天订单数" align="center" prop="orderNumber180"  width="100px" />
      <el-table-column label="首次发现时间" align="center" prop="firstDiscoveryTime"width="120px" />
      <el-table-column label="包裹重量" align="center" prop="packageWeight" width="100px"/>
      <el-table-column label="TOP3国家分布" align="center" prop="hotCountries" width="220px"/>
      <el-table-column label="包裹尺寸" align="center" prop="packageSize" width="100px"/>
      <el-table-column label="销售国家" align="center" prop="countries" width="100px"/>
      <el-table-column label="产品类型" align="center" prop="attribute"  width="150px"/>
      <el-table-column label="价格" align="center" prop="price"width="120px" />
      <el-table-column label="运费" align="center" prop="freight" width="120px" />
      <el-table-column label="我们ID" align="center" prop="selfPublicationId" width="170px" />
      <el-table-column label="我们价格" align="center" prop="selfPrice" width="120px" />
      <!-- <el-table-column label="我们运费" align="center" prop="selfFreight" width="120px" /> -->
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      :page-sizes="[50, 100, 200, 500]"
      @pagination="getList"
    />

    <!-- 添加或修改竞对信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="informationRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="sku" prop="sku">
          <el-input v-model="form.sku" placeholder="请输入sku" />
        </el-form-item>
        <el-form-item label="刊登ID" prop="publicationId">
          <el-input v-model="form.publicationId" placeholder="请输入刊登ID" />
        </el-form-item>
        <el-form-item label="店铺" prop="shops">
          <el-input v-model="form.shops" placeholder="请输入店铺" />
        </el-form-item>
        <el-form-item label="7日订单日均量" prop="averageDailyOrder7">
          <el-input v-model="form.averageDailyOrder7" placeholder="请输入7日订单日均量" />
        </el-form-item>
        <el-form-item label="评分" prop="score">
          <el-input v-model="form.score" placeholder="请输入评分" />
        </el-form-item>
        <el-form-item label="180天订单数" prop="orderNumber180">
          <el-input v-model="form.orderNumber180" placeholder="请输入180天订单数" />
        </el-form-item>
        <el-form-item label="首次发现时间" prop="firstDiscoveryTime">
          <el-input v-model="form.firstDiscoveryTime" placeholder="请输入首次发现时间" />
        </el-form-item>
        <el-form-item label="包裹重量" prop="packageWeight">
          <el-input v-model="form.packageWeight" placeholder="请输入包裹重量" />
        </el-form-item>
        <el-form-item label="TOP3国家分布" prop="hotCountries">
          <el-input v-model="form.hotCountries" placeholder="请输入TOP3国家分布" />
        </el-form-item>
        <el-form-item label="包裹尺寸" prop="packageSize">
          <el-input v-model="form.packageSize" placeholder="请输入包裹尺寸" />
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

<script setup name="Information">
import { listInformation, getInformation, delInformation, addInformation, updateInformation } from "@/api/aliexpress/information";

const { proxy } = getCurrentInstance();

const informationList = ref([]);
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
    pageSize: 50,
    sku: null,
    orderType: null,
    publicationId: null,
    shops: null,
    shopsType: null,
    linkType: null,
    averageDailyOrder7: null,
    score: null,
    orderNumber180: null,
    firstDiscoveryTime: null,
    packageWeight: null,
    hotCountries: null,
    packageSize: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询竞对信息列表 */
function getList() {
  loading.value = true;
  listInformation(queryParams.value).then(response => {
    informationList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

const getProxiedImageUrl = (url) => {
  if (!url) return '';
  // 使用 images.weserv.nl 代理服务
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&default=https://via.placeholder.com/80x80?text=No+Image`;
};

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    sku: null,
    orderType: null,
    publicationId: null,
    shops: null,
    shopsType: null,
    linkType: null,
    averageDailyOrder7: null,
    score: null,
    orderNumber180: null,
    firstDiscoveryTime: null,
    packageWeight: null,
    hotCountries: null,
    packageSize: null,
    createTime: null,
    ifUpdate: null
  };
  proxy.resetForm("informationRef");
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
  title.value = "添加竞对信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _sku = row.sku || ids.value
  getInformation(_sku).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改竞对信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["informationRef"].validate(valid => {
    if (valid) {
      if (form.value.sku != null) {
        updateInformation(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addInformation(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除竞对信息编号为"' + _skus + '"的数据项？').then(function() {
    return delInformation(_skus);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('aliexpress/information/export', {
    ...queryParams.value
  }, `information_${new Date().getTime()}.xlsx`)
}

// 合并单元格的方法
const spanMethod = ({ row, column, rowIndex, columnIndex }) => {
  // 产品类型、价格、运费列不合并
  if (['attribute', 'price', 'freight'].includes(column.property)) {
    return [1, 1];
  }

  // 图片、SKU、SKU负责人、我们ID、我们价格列根据SKU合并
  if (['picture', 'sku', 'skuPerson', 'selfPublicationId', 'selfPrice','selfFreight'].includes(column.property)) {
    if (rowIndex === 0) {
      let count = 1;
      for (let i = 1; i < informationList.value.length; i++) {
        if (informationList.value[i].sku === informationList.value[0].sku) {
          count++;
        } else {
          break;
        }
      }
      return [count, 1];
    } else {
      if (informationList.value[rowIndex].sku === informationList.value[rowIndex - 1].sku) {
        return [0, 0];
      } else {
        let count = 1;
        for (let i = rowIndex + 1; i < informationList.value.length; i++) {
          if (informationList.value[i].sku === informationList.value[rowIndex].sku) {
            count++;
          } else {
            break;
          }
        }
        return [count, 1];
      }
    }
  }

  // 渠道类型和市场容量根据SKU+渠道类型+市场容量合并
  if (['orderType', 'marketCapacity'].includes(column.property)) {
    if (rowIndex === 0) {
      let count = 1;
      for (let i = 1; i < informationList.value.length; i++) {
        if (informationList.value[i].sku === informationList.value[0].sku &&
            informationList.value[i].orderType === informationList.value[0].orderType &&
            informationList.value[i].marketCapacity === informationList.value[0].marketCapacity) {
          count++;
        } else {
          break;
        }
      }
      return [count, 1];
    } else {
      if (informationList.value[rowIndex].sku === informationList.value[rowIndex - 1].sku &&
          informationList.value[rowIndex].orderType === informationList.value[rowIndex - 1].orderType &&
          informationList.value[rowIndex].marketCapacity === informationList.value[rowIndex - 1].marketCapacity) {
        return [0, 0];
      } else {
        let count = 1;
        for (let i = rowIndex + 1; i < informationList.value.length; i++) {
          if (informationList.value[i].sku === informationList.value[rowIndex].sku &&
              informationList.value[i].orderType === informationList.value[rowIndex].orderType &&
              informationList.value[i].marketCapacity === informationList.value[rowIndex].marketCapacity) {
            count++;
          } else {
            break;
          }
        }
        return [count, 1];
      }
    }
  }

  // 销售国家列根据SKU+渠道类型+市场容量+刊登ID+国家合并
  if (column.property === 'countries') {
    if (rowIndex === 0) {
      let count = 1;
      for (let i = 1; i < informationList.value.length; i++) {
        if (informationList.value[i].sku === informationList.value[0].sku &&
            informationList.value[i].orderType === informationList.value[0].orderType &&
            informationList.value[i].marketCapacity === informationList.value[0].marketCapacity &&
            informationList.value[i].publicationId === informationList.value[0].publicationId &&
            informationList.value[i].countries === informationList.value[0].countries) {
          count++;
        } else {
          break;
        }
      }
      return [count, 1];
    } else {
      if (informationList.value[rowIndex].sku === informationList.value[rowIndex - 1].sku &&
          informationList.value[rowIndex].orderType === informationList.value[rowIndex - 1].orderType &&
          informationList.value[rowIndex].marketCapacity === informationList.value[rowIndex - 1].marketCapacity &&
          informationList.value[rowIndex].publicationId === informationList.value[rowIndex - 1].publicationId &&
          informationList.value[rowIndex].countries === informationList.value[rowIndex - 1].countries) {
        return [0, 0];
      } else {
        let count = 1;
        for (let i = rowIndex + 1; i < informationList.value.length; i++) {
          if (informationList.value[i].sku === informationList.value[rowIndex].sku &&
              informationList.value[i].orderType === informationList.value[rowIndex].orderType &&
              informationList.value[i].marketCapacity === informationList.value[rowIndex].marketCapacity &&
              informationList.value[i].publicationId === informationList.value[rowIndex].publicationId &&
              informationList.value[i].countries === informationList.value[rowIndex].countries) {
            count++;
          } else {
            break;
          }
        }
        return [count, 1];
      }
    }
  }

  // 其他列根据SKU+渠道类型+市场容量+刊登ID合并
  if (rowIndex === 0) {
    let count = 1;
    for (let i = 1; i < informationList.value.length; i++) {
      if (informationList.value[i].sku === informationList.value[0].sku &&
          informationList.value[i].orderType === informationList.value[0].orderType &&
          informationList.value[i].marketCapacity === informationList.value[0].marketCapacity &&
          informationList.value[i].publicationId === informationList.value[0].publicationId) {
        count++;
      } else {
        break;
      }
    }
    return [count, 1];
  } else {
    if (informationList.value[rowIndex].sku === informationList.value[rowIndex - 1].sku &&
        informationList.value[rowIndex].orderType === informationList.value[rowIndex - 1].orderType &&
        informationList.value[rowIndex].marketCapacity === informationList.value[rowIndex - 1].marketCapacity &&
        informationList.value[rowIndex].publicationId === informationList.value[rowIndex - 1].publicationId) {
      return [0, 0];
    } else {
      let count = 1;
      for (let i = rowIndex + 1; i < informationList.value.length; i++) {
        if (informationList.value[i].sku === informationList.value[rowIndex].sku &&
            informationList.value[i].orderType === informationList.value[rowIndex].orderType &&
            informationList.value[i].marketCapacity === informationList.value[rowIndex].marketCapacity &&
            informationList.value[i].publicationId === informationList.value[rowIndex].publicationId) {
          count++;
        } else {
          break;
        }
      }
      return [count, 1];
    }
  }
};
getList();
</script>

<style scoped>
.el-table .cell {
  padding: 10px; /* 调整单元格内边距 */
}

.el-table .cell span {
  display: block; /* 确保文本在单元格中垂直居中 */
  text-align: center; /* 文本居中 */
}

.el-table .cell.merged {
  background-color: #f5f5f5; /* 合并单元格的背景色 */
  font-weight: bold; /* 合并单元格的字体加粗 */
}

.el-table .cell:not(.merged) {
  border-bottom: 1px solid #e4e7ed; /* 单元格底部边框 */
}
</style>
