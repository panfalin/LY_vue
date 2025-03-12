<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="100px">
      <el-row :gutter="20">
        <!-- 第一行 -->
        <el-col :span="6">
          <el-form-item label="店铺名称">
            <el-select
                v-model="queryParams.storeName"
                placeholder="请选择店铺名称"
                clearable
                style="width: 100%"
            >
              <el-option
                  v-for="item in storeOptions"
                  :key="item"
                  :label="item"
                  :value="item"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品一级目录" prop="categoryLevelOne">
            <el-input
              v-model="queryParams.categoryLevelOne"
              placeholder="请输入一级目录"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品二级目录" prop="categoryLevelTwo">
            <el-input
              v-model="queryParams.categoryLevelTwo"
              placeholder="请输入二级目录"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="MSKU" prop="msku">
            <el-input
              v-model="queryParams.msku"
              placeholder="请输入MSKU"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第二行 -->
      <el-row :gutter="20">
        <!-- <el-col :span="6">
          <el-form-item label="周转天数" prop="turnoverDays">
            <el-input-number
              v-model="queryParams.turnoverDaysMin"
              placeholder="最小天数"
              :min="0"
              style="width: 110px"
            />
            <span class="el-range-separator">-</span>
            <el-input-number
              v-model="queryParams.turnoverDaysMax"
              placeholder="最大天数"
              :min="0"
              style="width: 110px"
            />
          </el-form-item>
        </el-col> -->
        <el-col :span="6">
          <el-form-item label="上架时间" prop="inventoryShelfTimeRange">
            <el-select v-model="queryParams.quickFilter" placeholder="选择商品类型" @change="handleQuickFilterChange" style="width: 100%">
              <el-option label="新品(90天内)" value="new"></el-option>
              <el-option label="次新品(90-180天)" value="semi_new"></el-option>
              <el-option label="老品(180天以上)" value="old"></el-option>
              <el-option label="自定义" value="custom"></el-option>
            </el-select>
            <el-date-picker
              v-show="queryParams.quickFilter === 'custom'"
              v-model="queryParams.inventoryShelfTimeRange"
              type="daterange"
              value-format="YYYY-MM-DD"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 100%; margin-top: 5px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="销售员">
            <el-select
                v-model="queryParams.salesPerson"
                placeholder="请选择销售员"
                clearable
                style="width: 100%"
            >
              <el-option
                  v-for="item in salesPersonOptions"
                  :key="item"
                  :label="item"
                  :value="item"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="开发员">
            <el-select
                v-model="queryParams.developer"
                placeholder="请选择开发员"
                clearable
                style="width: 100%"
            >
              <el-option
                  v-for="item in salesDeveloperOptions"
                  :key="item"
                  :label="item"
                  :value="item"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 可见列设置
      <el-row>
        <el-col :span="24">
          <div style="margin-bottom: 10px;">
            <span>可见列设置:</span>
            <el-checkbox-group v-model="visibleColumns">
              <el-checkbox label="店铺名称" name="visibleColumns"></el-checkbox>
              <el-checkbox label="商品信息" name="visibleColumns"></el-checkbox>
              <el-checkbox label="库存状态" name="visibleColumns"></el-checkbox>
              <el-checkbox label="日均销量" name="visibleColumns"></el-checkbox>
              <el-checkbox label="周转天数" name="visibleColumns"></el-checkbox>
              <el-checkbox label="目标值" name="visibleColumns"></el-checkbox>
              <el-checkbox label="当前值" name="visibleColumns"></el-checkbox>
            </el-checkbox-group>
          </div>
        </el-col>
      </el-row> -->

      <!-- 按钮行 -->
      <el-row>
        <el-col :span="24" style="text-align: right">
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          <el-button type="info" @click="openVisibleColumnsDialog">设置可见列</el-button>
        </el-col>
      </el-row>
      <!-- 这里添加一个br空行，使这里的边框的有点距离 -->
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['amazon:amzTurnover:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['amazon:amzTurnover:export']"
        >导出
        </el-button>
      </el-col>
      <!-- 这里的权限设置应该关闭 -->
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Bell"
          @click="handleTask"
        >任务设置</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="List"
          @click="goToTaskList"
        >任务列表</el-button>
      </el-col>
      <!--      这里将这个编辑按钮去掉-->

      <!--      <el-col :span="1.5">
              <el-button
                  type="primary"
                  circle
                  icon="Edit"
              ></el-button>
            </el-col>-->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
        v-loading="loading"
        :data="amzTurnoverList"
        height="500"
        style="min-width: 1500px;"
        :estimated-row-height="40"
        highlight-current-row
        border
        @selection-change="handleSelectionChange"
        :default-sort="{ prop: 'storeName', order: 'ascending' }"
        @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column v-if="visibleColumns.includes('店铺名称')" label="店铺名称" align="center" sortable prop="storeName" fixed min-width="120"/>
      <el-table-column v-if="visibleColumns.includes('商品信息')" label="商品信息" align="center" sortable prop="msku" fixed min-width="200">
        <template #header>
          <div style="text-align: center;">
            <div>商品信息</div>
            <div style="font-size: 12px; color: #909399;">
              (MSKU / ASIN / FNSKU / 本地SKU / 主SKU)
            </div>
          </div>
        </template>
        <template #default="scope">
          <div style="text-align: left;">
            <div><strong>MSKU:</strong> {{ scope.row.msku }}</div>
            <div><strong>ASIN:</strong> {{ scope.row.asin }}</div>
            <div><strong>FNSKU:</strong> {{ scope.row.fnsku }}</div>
            <div><strong>本地SKU:</strong> {{ scope.row.localSku }}</div>
            <div><strong>主SKU:</strong> {{ scope.row.mainSku }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="visibleColumns.includes('库存状态')" label="库存状态" align="center" prop="stockStatus" min-width="120"/>
      <el-table-column v-if="visibleColumns.includes('日均销量')" label="日均销量" align="center" prop="avgDailySales"/>
      <el-table-column label="销量(7/14/30/90)" align="center" sortable
      :sort-by="['sales7Days', 'sales14Days', 'sales30Days', 'sales90Days']" min-width="180">
      <template #header>
        <div style="text-align: left;">
          <div>
            销量(7/14/30/90)
              <i class="el-icon-caret-top"></i>
              <i class="el-icon-caret-bottom"></i>
            </div>
          </div>
        </template>
        <template #default="scope">
          <div>7天: {{ scope.row.sales7Days }}</div>
          <div>14天: {{ scope.row.sales14Days }}</div>
          <div>30天: {{ scope.row.sales30Days }}</div>
          <div>90天: {{ scope.row.sales90Days }}</div>
        </template>
      </el-table-column>
      <el-table-column v-if="visibleColumns.includes('目标值')" label="目标值" align="center" prop="targetValue"/>
      <el-table-column v-if="visibleColumns.includes('当前值')" label="当前值" align="center" prop="currentValue"/>
      <el-table-column label="本地库存" align="center">
        <el-table-column label="采购在途" align="center" prop="procurementInTransit"/>
        <el-table-column label="本地库存" align="center" prop="localInventory"/>
      </el-table-column>
      <el-table-column label="FBA库存" align="center">
        <el-table-column label="可售" align="center" prop="available"/>
        <el-table-column label="待入库" align="center" prop="awaitingStock"/>
        <el-table-column label="在途" align="center" prop="inTransit"/>
      </el-table-column>  
      <!--库存SKU这个字段没有，并没有在这里显示-->
      <!--<el-table-column label="库存SKU" align="center" prop="sku"/>-->
      <el-table-column label="SKU信息模板" align="center">
        <el-table-column label="仓库名称" align="center" prop="warehouseName"/>
        <el-table-column label="库存警戒天数" align="center" prop="stockWarningDays"/>
        <el-table-column label="AM-季节性产品-淡季【扩展属性】" align="center" prop="amSeasonalProductOffseason"/>
        <el-table-column label="AM-季节性产品-旺季上升比例【扩展属性】" align="center"
        prop="amSeasonalProductPeakIncreaseRatio"/>
        <el-table-column label="AM-季节性产品-旺季【扩展属性】" align="center" prop="amSeasonalProductPeak"/>
        <el-table-column label="AM-竞对销量【扩展属性】" align="center" prop="amCompetitorSales"/>
        <el-table-column label="AM-市场容量【扩展属性】" align="center" prop="amMarketCapacity"/>
        <el-table-column label="AM-产品生命周期状态【扩展属性】" align="center" prop="amProductLifecycleStatus"/>
        <el-table-column label="AM-季节性产品-淡季下滑比例【扩展属性】" align="center"
                         prop="amSeasonalProductOffseasonDecline"/>
        <el-table-column label="供应商名称" align="center" prop="supplierName"/>
        <el-table-column label="最新采购价" align="center" prop="latestPurchasePrice"/>
        <el-table-column label="重量" align="center" prop="weight"/>
        <el-table-column label="体积(cm³)" align="center" prop="volumeCm3"/>
        <el-table-column label="仓库最小采购量" align="center" prop="minPurchaseQuantity"/>
        <el-table-column label="AMZ-库存上架时间【扩展属性】" align="center" prop="amzInventoryShelfTime"/>
        <el-table-column label="重塑人【扩展属性】" align="center" prop="reshaper"/>
        <el-table-column label="重塑【扩展属性】" align="center" prop="reshaping"/>
      </el-table-column>
      <el-table-column label="可售天数" align="center" prop="availableDays"/>
      <el-table-column label="采购天数" align="center" prop="procurementDays"/>
      <el-table-column label="备注" align="center" prop="remarks"/>
      <el-table-column label="预留" align="center" prop="reserved"/>
      <el-table-column label="计划入库" align="center" prop="plannedStockIn"/>
      <el-table-column v-if="visibleColumns.includes('周转天数')" label="周转天数" align="center"  prop="turnoverDays" min-width="200"/>
      <el-table-column label="销售/开发" align="center" prop="msku" fixed="right" min-width="100">
        <!-- 表头 -->
        <template #header>
          <div style="text-align: center;">
            <div>销售/开发</div>
          </div>
        </template>
        <!-- 单元格内容 -->
        <template #default="scope">
          <div style="text-align: left;">
            <div><strong>销售:</strong> {{ scope.row.salesPerson }}</div>
            <div><strong>开发:</strong> {{ scope.row.developer }}</div>
          </div>
        </template>
      </el-table-column>
      <!--<el-table-column label="FBA库存总额" fixed="right" align="center"  sortable prop="totalFbaInventoryValue"/>-->
      <!--<el-table-column label="FBA周转天数" fixed="right" align="center"  sortable prop="fbaTurnoverDays"/>-->
      <el-table-column label="库存总额" fixed="right" align="center" sortable prop="totalInventoryValue" min-width="100"/>
      <!--
      这里增加一个任务状态，用来显示当前的sku，当前登陆人的未完成或者已完成的任务
      -->
      <!-- <el-table-column label="任务状态" align="center" fixed="right" min-width="200">
        <template #default="scope">
          <div class="progress-list">
            <div v-for="target in scope.row.completedTargets" :key="target.level" class="progress-item">
              <span class="progress-label">{{ target.name }}</span>
              <el-progress
                  :percentage="target.progress.toFixed(2)"
                  :status="getProgressStatus(target.progress)"
                  :stroke-width="8"
                  :text-inside="true"
              />
              <div style="display: flex; justify-content: space-between;">
                <span> {{ target.initialValue }}</span>
                <span> {{ target.currentValue }}</span>
                <span> {{ target.targetValue }}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" fixed="right" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['amazon:amzTurnover:edit']">详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="可见列设置" v-model="visibleColumnsDialog" width="800px" append-to-body>
      <div class="custom-list-container">
        <el-input type="text" placeholder="输入列名称进行搜索" v-model="searchQuery" border />
        <el-form :model="form">
          <el-form-item label="商品信息" :label-width="formLabelWidth">
            <div class="checkbox-group">
              <el-checkbox-group v-model="visibleColumns">
                <el-checkbox label="店铺名称" border></el-checkbox>
                <el-checkbox label="商品信息" border></el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>
          <el-form-item label="销售" :label-width="formLabelWidth">
            <div class="checkbox-group">
              <el-checkbox-group v-model="visibleColumns">
                <el-checkbox label="日均销量" border></el-checkbox>
                <el-checkbox label="7天销量" border></el-checkbox>
                <el-checkbox label="14天销量" border></el-checkbox>
                <el-checkbox label="30天销量" border></el-checkbox>
                <el-checkbox label="90天销量" border></el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />
  </div>
</template>

<script setup name="AmzTurnover">
import {
  listAmzTurnover,
  getAmzTurnover,
  delAmzTurnover,
  addAmzTurnover,
  updateAmzTurnover, getStoreList, getSalesPersonList, getDeveloperList
} from "@/api/amazon/amzTurnover";
import router from "@/router/index.js";
import {ref, onMounted, reactive} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import { useAmzTurnoverStore } from '@/store/modules/amzTurnover';

const route = useRoute();
const store = useAmzTurnoverStore();
const {proxy} = getCurrentInstance();

const amzTurnoverList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const queryParams = ref({});
const visibleColumnsDialog = ref(false);

const data = reactive({
  form: {},
  rules: {
    sku: [
      {required: true, message: "库存SKU不能为空", trigger: "blur"}
    ],
    isDelete: [
      {required: true, message: "是否删除不能为空", trigger: "blur"}
    ],
  }
});

const storeOptions = ref([]);
// 销售员选项
const salesPersonOptions = ref([]);
// 开发员选项
const salesDeveloperOptions = ref([]);

// 获取店铺和销售员列表
const getOptions = async () => {
  try {
    // 获取店铺列表
    const storeRes = await getStoreList();
    if (storeRes.code === 200) {
      storeOptions.value = storeRes.data;
    }

    // 获取销售员列表
    const salesPersonRes = await getSalesPersonList();
    if (salesPersonRes.code === 200) {
      salesPersonOptions.value = salesPersonRes.data;
    }
    // 获取销售员列表
    const salesDevelopers = await getDeveloperList();
    if (salesDevelopers.code === 200) {
      salesDeveloperOptions.value = salesDevelopers.data;
    }
  } catch (error) {
    console.error("获取选项数据失败:", error);
    proxy.$modal.msgError("获取选项数据失败");
  }
};


const {form, rules} = toRefs(data);

// 初始化查询表单
onMounted(() => {
  // 优先使用路由参数，如果没有则使用存储的参数
  const routeParams = {
    storeName: route.query.storeName,
    categoryLevelOne: route.query.categoryLevelOne,
    categoryLevelTwo: route.query.categoryLevelTwo,
    available: route.query.available,
    awaitingStock: route.query.awaitingStock,
    salesPerson: route.query.salesPerson,
    developer: route.query.developer,
    listingDate: route.query.listingDate,
    turnoverRange: route.query?.turnoverRange || null,
    // 添加时间范围参数
    beginTime: route.query.beginTime || null,
    endTime: route.query.endTime || null,
    // 如果有开始和结束时间，设置时间范围数组
    inventoryShelfTimeRange: route.query.beginTime && route.query.endTime ?
      [route.query.beginTime, route.query.endTime] : null,
    // 添加其他可能的查询参数
    turnoverDaysMin: route.query.turnoverDaysMin || null,
    turnoverDaysMax: route.query.turnoverDaysMax || null,
    msku: route.query.msku || null
  };

  getOptions();

  // 如果有路由参数，使用路由参数，否则使用存储的参数
  const hasRouteParams = Object.values(routeParams).some(val => val !== undefined && val !== null);

  // 设置查询参数
  queryParams.value = {
    ...(hasRouteParams ? routeParams : store.listQueryParams),
    pageNum: 1,
    pageSize: 10
  };

  // 设置表单数据
  data.form = {
    ...data.form,
    ...queryParams.value
  };

  handleQuery();
});

/** 查询亚马逊数据分析，周转率，mskulist，这个是基础信息列表 */
function getList() {
  loading.value = true;
  listAmzTurnover(queryParams.value).then(response => {
    // 生成目标值、当前值和初始值的函数
    const generateTargetData = (minTarget, maxTarget) => {
        const targetValue = minTarget + Math.floor(Math.random() * (maxTarget - minTarget + 1)); // 生成目标值
        const currentValue = Math.floor(Math.random() * 100); // 生成当前值
        const initialValue = Math.floor(Math.random() * targetValue); // 确保初始值小于目标值
        return { targetValue, currentValue, initialValue };
    };

    amzTurnoverList.value = response.rows.map(item => ({
      ...item,
      completedTargets: [
        (() => {
          const { targetValue, currentValue, initialValue } = generateTargetData(60, 100); // 生成周转天数的数据
          const progress = (currentValue / targetValue) * 100; // 计算进度百分比
          return {
            level: 'personal',
            name: '周转天数',
            progress,
            targetValue,
            currentValue,
            initialValue
          };
        })(),
        (() => {
          const { targetValue, currentValue, initialValue } = generateTargetData(50, 100); // 生成利润率指标的数据
          const progress = (currentValue / targetValue) * 100; // 计算进度百分比
          return {
            level: 'personal',
            name: '利润率指标',
            progress,
            targetValue,
            currentValue,
            initialValue
          };
        })(),
        (() => {
          const { targetValue, currentValue, initialValue } = generateTargetData(70, 100); // 生成销售额指标的数据
          const progress = (currentValue / targetValue) * 100; // 计算进度百分比
          return {
            level: 'manager',
            name: '销售额指标',
            progress,
            targetValue,
            currentValue,
            initialValue
          };
        })(),
        (() => {
          const { targetValue, currentValue, initialValue } = generateTargetData(80, 100); // 生成销量的数据
          const progress = (currentValue / targetValue) * 100; // 计算进度百分比
          return {
            level: 'company',
            name: '销量',
            progress,
            targetValue,
            currentValue,
            initialValue
          };
        })()
      ]
    }));
    total.value = response.total;
    loading.value = false;
  });
}

// 获取进度状态
/**
 * 这里是任务状态进度条的颜色划分
 * @param progress
 * @returns {string}
 */
const getProgressStatus = (progress) => {
  if (progress >= 100) return 'success';
  if (progress >= 80) return 'warning';
  return 'exception';
};

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    storeName: null,
    msku: null,
    categoryLevelOne: null,
    categoryLevelTwo: null,
    fnsku: null,
    localSku: null,
    mainSku: null,
    productName: null,
    asin: null,
    stockStatus: null,
    sales7Days: null,
    sales14Days: null,
    sales30Days: null,
    sales90Days: null,
    avgDailySales: null,
    procurementInTransit: null,
    localInventory: null,
    available: null,
    awaitingStock: null,
    sku: null,
    warehouseName: null,
    stockWarningDays: null,
    amSeasonalProductOffseason: null,
    amSeasonalProductPeakIncreaseRatio: null,
    amSeasonalProductPeak: null,
    amCompetitorSales: null,
    amMarketCapacity: null,
    amProductLifecycleStatus: null,
    amSeasonalProductOffseasonDecline: null,
    supplierName: null,
    latestPurchasePrice: null,
    weight: null,
    volumeCm3: null,
    minPurchaseQuantity: null,
    amzInventoryShelfTime: null,
    reshaper: null,
    reshaping: null,
    inTransit: null,
    availableDays: null,
    procurementDays: null,
    remarks: null,
    reserved: null,
    plannedStockIn: null,
    salesPerson: null,
    developer: null,
    listingDate: null,
    isDelete: null,
    createdAt: null,
    updateTime: null,
    createBy: null,
    updateBy: null,
    version: null,
    turnoverDaysMin: null,
    turnoverDaysMax: null
  };
  proxy.resetForm("amzTurnoverRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  // 保存查询参数到 store
  store.setListQueryParams(queryParams.value);
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  queryParams.value = {
    pageNum: 1,
    pageSize: 10
  };
  // 清除存储的参数
  store.setListQueryParams(queryParams.value);
  handleQuery();
}

/** 排序变化处理函数 */
function handleSortChange({prop, order}) {
  // 根据排序的字段和顺序更新查询参数
  queryParams.value.sortField = prop;
  queryParams.value.sortOrder = order;
  getList();  // 重新获取列表数据
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 修改按钮操作 */
function handleUpdate(row) {
  const _id = row.id || ids.value[0];  // 取第一个选中项的id
  getAmzTurnover(_id).then(response => {
    form.value = response.data;
    // 使用导入的router进行跳转
    router.push({
      path: `/amzTurnover/detail/${_id}`
    });
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["amzTurnoverRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateAmzTurnover(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addAmzTurnover(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('amazon/amzTurnover/export', {
    ...queryParams.value
  }, `amzTurnover_${new Date().getTime()}.xlsx`)
}

// 添加快捷筛选处理函数
const handleQuickFilterChange = (value) => {
  const today = new Date();
  
  switch (value) {
    case 'new':
      // 新品：90天（3个月）内 - 从3个月前到现在
      const threeMonthsAgo = new Date(today);
      threeMonthsAgo.setDate(today.getDate() - 90);
      queryParams.value.inventoryShelfTimeRange = [
        threeMonthsAgo.toISOString().split('T')[0],
        today.toISOString().split('T')[0]
      ];
      queryParams.value.beginTime = threeMonthsAgo.toISOString().split('T')[0];
      queryParams.value.endTime = today.toISOString().split('T')[0];
      break;
      
    case 'semi_new':
      // 次新品：180天到90天（6个月前到3个月前）
      const sixMonthsAgo = new Date(today);
      const threeMonthsAgo2 = new Date(today);
      sixMonthsAgo.setDate(today.getDate() - 180);
      threeMonthsAgo2.setDate(today.getDate() - 90);
      queryParams.value.inventoryShelfTimeRange = [
        sixMonthsAgo.toISOString().split('T')[0],
        threeMonthsAgo2.toISOString().split('T')[0]
      ];
      queryParams.value.beginTime = sixMonthsAgo.toISOString().split('T')[0];
      queryParams.value.endTime = threeMonthsAgo2.toISOString().split('T')[0];
      break;
      
    case 'old':
      // 老品：180天以上（从1900年到6个月前）
      const sixMonthsAgo2 = new Date(today);
      sixMonthsAgo2.setDate(today.getDate() - 180);
      queryParams.value.inventoryShelfTimeRange = [
        '1900-01-01',  // 设置一个足够早的日期
        sixMonthsAgo2.toISOString().split('T')[0]
      ];
      queryParams.value.beginTime = '1900-01-01';
      queryParams.value.endTime = sixMonthsAgo2.toISOString().split('T')[0];
      break;
      
    case 'custom':
      // 自定义：清空日期范围
      queryParams.value.inventoryShelfTimeRange = null;
      queryParams.value.beginTime = null;
      queryParams.value.endTime = null;
      break;
  }
  
  // 触发查询
  handleQuery();
};


/*
* 这里是跳转页面的逻辑，这些需要注意，跳转任务设置，跳转任务列表
* */
/** 添加任务设置按钮操作 */
function handleTask() {
  router.push({
    name: 'TaskAmz'
  });
}

// 跳转到任务列表
const goToTaskList = () => {
  router.push('/amzTurnover/taskList');
};

const visibleColumns = ref(['店铺名称', '商品信息', '库存状态', '日均销量', '周转天数', '目标值', '当前值']); // 默认可见列

// 打开可见列设置对话框
const openVisibleColumnsDialog = () => {
  visibleColumnsDialog.value = true;
};

getList();
</script>

<style scoped>
.el-range-separator {
  padding: 0 5px;
}

.el-form-item {
  margin-bottom: 18px;
}

.el-input-number {
  width: 120px;
}
</style>
