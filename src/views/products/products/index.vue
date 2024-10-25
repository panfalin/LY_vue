<template>
  <div class="app-container" style="overflow-x: auto;">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="SKU" prop="productCode">
        <el-input
            v-model="queryParams.productCode"
            placeholder="请输入SKU"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品名称" prop="productName">
        <el-input
            v-model="queryParams.productName"
            placeholder="请输入商品名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-input
            v-model="queryParams.status"
            placeholder="请输入状态"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="7天销量" prop="salesDays7">
        <el-input
            v-model="queryParams.salesDays7"
            placeholder="请输入数量"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="28天销量" prop="salesDays28">
        <el-input
            v-model="queryParams.salesDays28"
            placeholder="请输入数量"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="42天销量" prop="salesDays42">
        <el-input
            v-model="queryParams.salesDays42"
            placeholder="请输入数量"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <!--      <el-form-item label="可用库存" prop="totalInventory">
              <el-input
                v-model="queryParams.totalInventory"
                placeholder="请输入可用库存"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="最新采购价" prop="latestPurchasePrice">
              <el-input
                v-model="queryParams.latestPurchasePrice"
                placeholder="请输入最新采购价"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="图片" prop="imageUrl">
              <el-input
                v-model="queryParams.imageUrl"
                placeholder="请输入图片"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>-->
      <!-- 级联选择器 -->
      <el-form-item label="选择分类" prop="selectedOptions">
        <el-cascader
            v-model="selectedCategory"
            :options="cascaderOptions"
            placeholder="请选择"
            clearable
            @change="handleCategoryChange"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!--<el-col :span="1.5">-->
      <!--  <el-button-->
      <!--      type="primary"-->
      <!--      plain-->
      <!--      icon="Plus"-->
      <!--      @click="handleAdd"-->
      <!--      v-hasPermi="['products:products:add']"-->
      <!--  >新增-->
      <!--  </el-button>-->
      <!--</el-col>-->
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['products:products:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['products:products:remove']"
        >删除
        </el-button>
      </el-col>
      <!--<el-col :span="1.5">-->
      <!--  <el-button-->
      <!--      type="warning"-->
      <!--      plain-->
      <!--      icon="Download"-->
      <!--      @click="handleExport"-->
      <!--      v-hasPermi="['products:products:export']"-->
      <!--  >导出-->
      <!--  </el-button>-->
      <!--</el-col>-->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 表格部分 -->
    <el-table
        v-loading="loading"
        :data="productsList"
        height="600"
        style="min-width: 1500px;"
        :estimated-row-height="40"
        highlight-current-row
        border
        @selection-change="handleSelectionChange"
        :row-class-name="getTableRowClass"
        :default-sort="defaultSort"
        @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column fixed label="SKU" align="center" prop="productCode" :min-width="200" sortable="custom"
                       :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="分类" align="center" prop="mabang_info.category" sortable="custom"
                       :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="商品名称" align="center" prop="mabang_info.productName" min-width="300" sortable="custom"
                       :sort-orders="['descending', 'ascending']">
        <template #default="scope">
          <div style="white-space: normal; word-break: break-word;">
            {{ scope.row.mabang_info.productName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="mabang_info.status"/>
      <el-table-column label="目标" align="center" prop="mabang_info.target" min-width="200">
        <template #default="scope">
          <div style="white-space: pre-wrap; word-break: break-word; text-align: left;">
            <span v-if="!scope.row._editing">{{ scope.row.mabang_info.target || '' }}</span>
            <el-input
                v-else
                type="textarea"
                v-model="scope.row.mabang_info.target"
                placeholder="请输入目标"
                :autosize="{ minRows: 4, maxRows: 6 }"
                style="width: 100%;"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="可用库存" align="center" prop="mabang_info.totalInventory" sortable="custom"
                       :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="最新采购价" align="center" prop="mabang_info.latestPurchasePrice" sortable="custom"
                       :sort-orders="['descending', 'ascending']">
        <template #default="scope">
          <div>¥{{ scope.row.mabang_info.latestPurchasePrice }}</div>
        </template>
      </el-table-column>
      <el-table-column label="市场容量" align="center" prop="mabang_info.marketCapacity"/>
      <el-table-column label="7天销量" align="center" prop="mabang_info.salesDays7" sortable="custom"
                       :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="28天销量" align="center" prop="mabang_info.salesDays28" sortable="custom"
                       :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="42天销量" align="center" prop="mabang_info.salesDays42" sortable="custom"
                       :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="图片" align="center" width="120">
        <template #default="scope">
          <el-popover
              effect="light"
              trigger="hover"
              placement="right"
              width="auto"
          >
            <template #default>
              <el-image
                  :src="scope.row.mabang_info?.imageUrl"
                  style="width: 350px;"
                  fit="contain"
                  v-lazy="scope.row.mabang_info?.imageUrl"
              />
            </template>
            <template #reference>
              <el-image
                  :src="scope.row.mabang_info?.imageUrl"
                  style="width: 80px;"
                  fit="contain"
                  v-lazy="scope.row.mabang_info?.imageUrl"
              />
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="上架店铺数" align="center" prop="mabang_info.store_count" sortable="custom"
                       :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="总刊登数" align="center" prop="mabang_info.totalListingCount" sortable="custom"
                       :sort-orders="['descending', 'ascending']"/>
      <!--动态展示在线刊登数据 -->
      <el-table-column label="刊登数据" align="left" :min-width="250">
        <template #default="scope">
          <div style="line-height: 1.5;">
            <div v-for="(data, index) in scope.row.online_data" :key="index"
                 :style="{ backgroundColor:  '#f9f9f9', color: 'black' }"
                 style="margin-bottom: 10px; padding: 10px; border-radius: 4px;">
              <div>店铺: {{ data.店铺 }}</div>
              <div>刊登数: {{ data.刊登数 }}</div>
              <div>刊登ID:
                <span v-for="(listingId, idx) in data.刊登ID.split(',')" :key="idx"
                      style="display: block;">{{ listingId.trim() }}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <!--<el-table-column label="刊登数据" align="left" :min-width="250">-->
      <!--  <template #default="scope">-->
      <!--    <div style="line-height: 1.5;">-->
      <!--      &lt;!&ndash; 展开/收起按钮 &ndash;&gt;-->
      <!--      <el-button-->
      <!--          @click="scope.row._expanded = !scope.row._expanded"-->
      <!--          type="text"-->
      <!--          style="padding: 0; font-weight: bold; color: #409EFF;">-->
      <!--        {{ scope.row._expanded ? '收起刊登数据' : '展开刊登数据' }}-->
      <!--      </el-button>-->

      <!--      <div v-if="scope.row._expanded" style="margin-top: 10px;">-->
      <!--        <div-->
      <!--            v-for="(data, index) in scope.row.online_data"-->
      <!--            :key="index"-->
      <!--            :style="{ backgroundColor: data.刊登数 < 5 ? '#d37a7a' : '#f9f9f9', color: data.刊登数 < 5 ? 'white' : 'black' }"-->
      <!--            style="margin-bottom: 10px; padding: 12px; border-radius: 4px; border: 1px solid #e4e4e4; transition: background-color 0.3s;">-->

      <!--          <div style="display: flex; justify-content: space-between; align-items: center;">-->
      <!--            <span style="font-weight: bold;">{{ data.店铺 }}</span>-->
      <!--            <el-button-->
      <!--                @click="data._expanded = !data._expanded"-->
      <!--                type="text"-->
      <!--                style="padding: 0; margin-left: 10px; color: #409EFF;">-->
      <!--              {{ data._expanded ? '收起' : '展开' }}-->
      <!--            </el-button>-->
      <!--          </div>-->

      <!--          <div v-if="data._expanded" style="margin-top: 10px;">-->
      <!--            <div>刊登数: <strong>{{ data.刊登数 }}</strong></div>-->
      <!--            <div>-->
      <!--              <div style="font-weight: bold;">刊登ID:</div>-->
      <!--              <div>-->
      <!--                  <span-->
      <!--                      v-for="(listingId, idx) in data.刊登ID.split(',')"-->
      <!--                      :key="idx"-->
      <!--                      style="display: block; margin-left: 10px;">-->
      <!--                    {{ listingId.trim() }}-->
      <!--                  </span>-->
      <!--              </div>-->
      <!--            </div>-->

      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--    </div>-->
      <!--  </template>-->
      <!--</el-table-column>-->
      <!-- 竞品一 -->
      <el-table-column label="竞品一" align="left" :min-width="200">
        <template #default="scope">
          <div v-if="scope.row.mabang_info['竞品一']" style="white-space: nowrap;">
            <div>竞品ID: {{ scope.row.mabang_info['竞品一'].competitorId }}</div>
            <div>180天销量: {{ scope.row.mabang_info['竞品一'].sales180Days }}</div>
            <div>7天销量: {{ scope.row.mabang_info['竞品一'].sales7Days }}</div>
            <div>评论数: {{ scope.row.mabang_info['竞品一'].reviewsCount }}</div>
            <div>收藏数: {{ scope.row.mabang_info['竞品一'].favoritesCount }}</div>
            <div>最低价: {{ scope.row.mabang_info['竞品一'].minPrice }}$</div>
            <div>最高价: {{ scope.row.mabang_info['竞品一'].maxPrice }}$</div>
          </div>
        </template>
      </el-table-column>


      <!-- 竞品二 -->
      <el-table-column label="竞品二" align="left" :min-width="200">
        <template #default="scope">
          <div v-if="scope.row.mabang_info['竞品二']" style="white-space: nowrap;">
            <div>竞品ID: {{ scope.row.mabang_info['竞品二'].competitorId }}</div>
            <div>180天销量: {{ scope.row.mabang_info['竞品二'].sales180Days }}</div>
            <div>7天销量: {{ scope.row.mabang_info['竞品二'].sales7Days }}</div>
            <div>评论数: {{ scope.row.mabang_info['竞品二'].reviewsCount }}</div>
            <div>收藏数: {{ scope.row.mabang_info['竞品二'].favoritesCount }}</div>
            <div>最低价: {{ scope.row.mabang_info['竞品二'].minPrice }}$</div>
            <div>最高价: {{ scope.row.mabang_info['竞品二'].maxPrice }}$</div>
          </div>
        </template>
      </el-table-column>

      <!-- 竞品三 -->
      <el-table-column label="竞品三" align="left" :min-width="200">
        <template #default="scope">
          <div v-if="scope.row.mabang_info['竞品三']" style="white-space: nowrap;">
            <div>竞品ID: {{ scope.row.mabang_info['竞品三'].competitorId }}</div>
            <div>180天销量: {{ scope.row.mabang_info['竞品三'].sales180Days }}</div>
            <div>7天销量: {{ scope.row.mabang_info['竞品三'].sales7Days }}</div>
            <div>评论数: {{ scope.row.mabang_info['竞品三'].reviewsCount }}</div>
            <div>收藏数: {{ scope.row.mabang_info['竞品三'].favoritesCount }}</div>
            <div>最低价: {{ scope.row.mabang_info['竞品三'].minPrice }}$</div>
            <div>最高价: {{ scope.row.mabang_info['竞品三'].maxPrice }}$</div>
          </div>
        </template>
      </el-table-column>


      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right"
                       :min-width="120">
        <template #default="{row}">
          <el-button v-if="!row._editing" type="primary" icon="Edit" link @click="editRow(row)" size="small"
          >编辑
          </el-button
          >
          <el-button v-else type="warning" icon="Edit" link @click="saveRow(row)" size="small">保存</el-button>
          <!--<el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['products:products:remove']">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>


    <pagination
        v-show="total>0"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- 添加或修改products对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="productsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="SKU" prop="productCode">
          <el-input v-model="form.productCode" placeholder="请输入SKU" disabled/>
        </el-form-item>
        <el-form-item label="目标" prop="target">
          <el-input v-model="form.target" type="textarea" placeholder="请输入目标"
                    :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
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

<script setup name="Products">
import {
  listProducts,
  getProducts,
  delProducts,
  addProducts,
  updateProducts,
  listCategories
} from "@/api/products/products";

const {proxy} = getCurrentInstance();

const productsList = ref([]);
const categories = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const cascaderOptions = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    productCode: null,
    category: null,
    productName: null,
    target: null,
    status: null,
    totalInventory: null,
    latestPurchasePrice: null,
    imageUrl: null,
    salesDays7: null,
    salesDays28: null,
    salesDays42: null,
  },
  rules: {
    productCode: [
      {required: true, message: "SKU不能为空", trigger: "blur"}
    ],
  }
});
const {queryParams, form, rules} = toRefs(data);

/** 查询products列表 */
function getList() {
  loading.value = true;
  listProducts(queryParams.value).then(response => {
    productsList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

function getCategoryList() {
  loading.value = true;
  listCategories() // 假设这个方法返回完整的类别数据
      .then(response => {
        categories.value = response.rows; // response.rows 应该包含完整数据
        cascaderOptions.value = formatCategories(categories.value); // 格式化为 cascader 需要的格式
        loading.value = false;
      })
      .catch(error => {
        loading.value = false; // 在出现错误时也要停止加载状态
        console.error('获取类别列表失败:', error); // 记录错误
        // 可以显示错误消息给用户
        alert('加载类别列表时出错，请稍后重试。');
      });
}


// 转换函数
function formatCategories(categories) {
  const categoryMap = {};

  // 创建一个类别映射，以便快速查找
  categories.forEach(category => {
    categoryMap[category.categoryId] = {
      value: category.categoryId,
      label: category.categoryNameCn, // 显示中文名称
      name: category.categoryNameCn, // 新增字段存储中文名称
      children: []
    };
  });

  const cascaderOptions = [];

  // 组装树形结构
  categories.forEach(category => {
    if (category.parentId === null) {
      // 顶级类别
      cascaderOptions.push(categoryMap[category.categoryId]);
    } else {
      // 子类别
      if (categoryMap[category.parentId]) {
        categoryMap[category.parentId].children.push(categoryMap[category.categoryId]);
      }
    }
  });

  return cascaderOptions;
}

// 处理类别变化
function handleCategoryChange(value) {
  // 获取最后一个选中的类别
  const lastSelectedOption = cascaderOptions.value.reduce((acc, option) => {
    const findOption = (children, val) => {
      for (const child of children) {
        if (child.value === val) return child;
        if (child.children.length) {
          const found = findOption(child.children, val);
          if (found) return found;
        }
      }
      return null;
    };
    const found = findOption(option.children, value[value.length - 1]);
    return found ? found : acc;
  }, null);

  // 将最后一个选中的类别名称赋给 queryParams.category
  if (lastSelectedOption) {
    queryParams.value.category = lastSelectedOption.name; // 取中文名称
  }
}


// 在组件挂载时加载类别列表
onMounted(() => {
  getCategoryList();
});
// 你可以在这里添加其他的 onMounted 钩子，例如获取店铺和国家
onMounted(async () => {
  try {
    const [storesResponse, countriesResponse] = await Promise.all([
      getAllStores(),
      getAllCountry()
    ]);
    stores.value = storesResponse.data;
    console.log('获取的店铺:', stores.value); // 添加调试信息
    countries.value = countriesResponse.data;
    getList(); // 初始化加载订单列表
  } catch (error) {
    console.error('获取数据失败', error);
  }
});



/** 将目标改成编辑状态 */
const editRow = (row) => {
  row._editing = true
}

const saveRow = (row) => {
  row._editing = false; // 退出编辑模式
  row.target = row.mabang_info.target || "";
  submitForm(row); // 直接提交
}

/** 排序触发事件 */
function handleSortChange(column, prop, order) {
  if (column.prop.startsWith('mabang_info.')) {
    column.prop = column.prop.replace("mabang_info.", "");
  }
  queryParams.value.orderByColumn = column.prop;
  queryParams.value.isAsc = column.order;
  getList();
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    productCode: null,
    status: null,
    totalInventory: null,
    latestPurchasePrice: null,
    imageUrl: null
  };
  proxy.resetForm("productsRef");
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
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加products";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getProducts(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改products";
  });
}

/** 新增当上架店铺数小于5时 高亮显示 */
function getTableRowClass({row}) {
  if (row.mabang_info && row.mabang_info.上架店铺数 < 5) {
    return 'highlight-row';
  }
  return 'success-row';
}

/** 单元格修改值的提交按钮 */
function submitForm(row) {
  const _id = row.id || ids.value; // 获取行的 ID
  if (_id) {
    updateProducts(row).then(response => {
      proxy.$modal.msgSuccess("修改成功");
      getList(); // 更新列表
    });
  } else {
    addProducts(row).then(response => {
      proxy.$modal.msgSuccess("新增成功");
      getList(); // 更新列表
    });
  }
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id ? [row.id] : ids.value; // 确保 _ids 是一个数组
  let productCodes = []; // 使用数组存储多个 SKU

  // 将 _ids 转换为数字数组
  const numericIds = _ids.map(id => Number(id));

  // 使用 Promise.all 处理多个 getProducts 请求
  Promise.all(numericIds.map(id => getProducts(id))).then(responses => {
    responses.forEach(response => {
      const product = response.data;
      const productCode = product.productCode;
      productCodes.push(productCode);
    });

    // 确保在获取到所有 productCodes 后再显示确认对话框
    const maxDisplayCount = 5; // 设置最多显示的 SKU 数量
    const additionalCount = productCodes.length - maxDisplayCount; // 计算额外的 SKU 数量

    // 构建确认对话框的消息
    let confirmMessage = `是否确认删除以下 SKU ：\n`;
    confirmMessage += productCodes.slice(0, maxDisplayCount).map(code => `${code}`).join('\n'); // 显示前 N 个 SKU

    if (additionalCount > 0) {
      confirmMessage += `\n还有 ${additionalCount} 个 SKU 被删除。`; // 显示额外的数量
    }

    return proxy.$modal.confirm(confirmMessage);
  }).then(() => {
    // 用户确认删除
    return delProducts(numericIds);
  }).then(() => {
    // 删除成功
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(error => {
    console.error('删除失败', error);
  });
}


/** 导出按钮操作 */
function handleExport() {
  proxy.download('products/products/export', {
    ...queryParams.value
  }, `products_${new Date().getTime()}.xlsx`)
}

getList();
</script>

<style scoped>
/* 添加样式 */
.highlight-row {
  background-color: red !important;
  color: white !important;
}
</style>
