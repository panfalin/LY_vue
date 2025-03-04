<template>
  <div class="container">
    <el-card class="search-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="店铺名称">
            <el-select
                v-model="form.storeName"
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
          <el-form-item label="商品一级目录">
            <el-input v-model="form.categoryLevelOne" placeholder="请输入一级目录" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品二级目录">
            <el-input v-model="form.categoryLevelTwo" placeholder="请输入二级目录" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="销售员">
            <el-select
                v-model="form.salesPerson"
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
        <!--<el-col :span="6">-->
        <!--  <el-form-item label="可售">-->
        <!--    <el-input v-model="form.available" placeholder="请输入可售" clearable/>-->
        <!--  </el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="6">-->
        <!--  <el-form-item label="待入库">-->
        <!--    <el-input v-model="form.awaitingStock" placeholder="请输入待入库" clearable/>-->
        <!--  </el-form-item>-->
        <!--</el-col>-->
        <el-col :span="6">
          <el-form-item label="开发员">
            <el-select
                v-model="form.developer"
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
        <el-col :span="6">
          <el-form-item label="库存上架时间范围">
            <el-select v-model="form.quickFilter" placeholder="选择商品类型" @change="handleQuickFilterChange">
              <el-option label="新品(90天内)" value="new"></el-option>
              <el-option label="次新品(90-180天)" value="semi_new"></el-option>
              <el-option label="老品(180天以上)" value="old"></el-option>
              <el-option label="自定义" value="custom"></el-option>
            </el-select>
            <el-date-picker
              v-model="form.inventoryShelfTimeRange"
              type="daterange"
              value-format="YYYY-MM-DD"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right">
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-row :gutter="20" class="data-section">
      <el-col :span="8">
        <el-card class="summary-card">
          <template #header>
            <div class="card-header">全公司汇总数据（每天）</div>
          </template>
          <div class="summary-list">
            <div class="summary-item">
              <span>上架SKU数量</span>
              <span class="clickable" @click="handleSumSkuCountClick">
                {{ amzTurnoverSummary.listedSkuCount || 0 }}
              </span>
            </div>
            <div class="summary-item">
              <span>库存个数总计</span>
              <span>{{ amzTurnoverSummary?.totalInventoryCount || 0 }}</span>
            </div>
            <div class="summary-item money-total">
              <span>库存金额总计</span>
              <span>¥{{ formatCurrency(amzTurnoverSummary?.totalInventoryValue) }}</span>
            </div>
            <div class="summary-item money">
              <span>采购在途总额</span>
              <span>¥{{ formatCurrency(amzTurnoverSummary?.totalProcurementInventory) }}</span>
            </div>
            <div class="summary-item money">
              <span>本地库存总额</span>
              <span>¥{{ formatCurrency(amzTurnoverSummary?.totalLocalInventory) }}</span>
            </div>
            <div class="summary-item money">
              <span>FBA在途总额</span>
              <span>¥{{ formatCurrency(amzTurnoverSummary?.totalFbaInTransit) }}</span>
            </div>
            <div class="summary-item money">
              <span>FBA可售总额</span>
              <span>¥{{ formatCurrency(amzTurnoverSummary?.totalFbaAvailable) }}</span>
            </div>
            <div class="summary-item money">
              <span>销售额（近7天平均）</span>
              <span>¥{{ formatCurrency(amzTurnoverSummary?.avgSalesLast7Days) }}</span>
            </div>
            <div class="summary-item money">
              <span>销售成本（近7天平均）</span>
              <span>¥{{ formatCurrency(amzTurnoverSummary?.avgSalesCostLast7Days) }}</span>
            </div>
            <div class="summary-item">
              <span>周转天数（近7天平均）</span>
              <span>{{ formatDays(amzTurnoverSummary?.avgTurnoverDaysLast7Days) }}</span>
            </div>
            <div class="summary-item">
              <span>FBA周转天数（近7天平均）</span>
              <span>{{ formatDays(amzTurnoverSummary?.avgFbaTurnoverDaysLast7Days) }}</span>
            </div>
            <div class="summary-item money-important">
              <span>营业额</span>
              <span>¥{{ formatCurrency(amzTurnoverSummary?.totalRevenue) }}</span>
            </div>
            <div class="summary-item money-important">
              <span>利润</span>
              <span>¥{{ formatCurrency(amzTurnoverSummary?.totalProfit) }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card class="turnover-card">
          <template #header>
            <div class="card-header">总体周转天数统计</div>
          </template>
          <el-table
              :data="turnoverTableData"
              border
              size="small"
              style="width: 100%"
              :header-cell-style="{background:'#f5f7fa',color:'#606266',height:'40px'}"
          >
            <el-table-column prop="label" label="周转天数" width="100" fixed/>
            <el-table-column prop="skuCount" label="SKU数量" min-width="100">
              <template #default="{ row }">
                    <span class="clickable_table" @click="handleSkuCountClick(row.label)">
                        {{ row.skuCount }}
                    </span>
              </template>
            </el-table-column>
            <el-table-column prop="skuRatio" label="SKU比例" min-width="100"/>
            <el-table-column prop="inventoryValue" label="库存金额" min-width="100"/>
            <el-table-column prop="inventoryRatio" label="库存比例" min-width="100"/>
            <el-table-column prop="revenue" label="营业额" min-width="100"/>
            <el-table-column prop="revenueRatio" label="营业额比例" min-width="100"/>
            <el-table-column prop="profit" label="利润" min-width="100"/>
            <el-table-column prop="profitRatio" label="利润比例" min-width="100"/>
            <el-table-column prop="profitMargin" label="利润率" min-width="100"/>
          </el-table>
        </el-card>

        <el-card class="turnover-card" style="margin-top: 16px;">
          <template #header>
            <div class="card-header">FBA周转天数统计</div>
          </template>
          <el-table
              :data="fbaTurnoverTableData"
              border
              size="small"
              style="width: 100%"
              :header-cell-style="{background:'#f5f7fa',color:'#606266',height:'40px'}"
          >
            <el-table-column prop="label" label="周转天数" width="100" fixed/>
            <el-table-column prop="skuCount" label="SKU数量" min-width="100"/>
            <el-table-column prop="skuRatio" label="SKU比例" min-width="100"/>
            <el-table-column prop="inventoryValue" label="库存金额" min-width="100"/>
            <el-table-column prop="inventoryRatio" label="库存比例" min-width="100"/>
            <el-table-column prop="revenue" label="营业额" min-width="100"/>
            <el-table-column prop="revenueRatio" label="营业额比例" min-width="100"/>
            <el-table-column prop="profit" label="利润" min-width="100"/>
            <el-table-column prop="profitRatio" label="利润比例" min-width="100"/>
            <el-table-column prop="profitMargin" label="利润率" min-width="100"/>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script setup name="AmzTurnover">
import {ref, computed, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {useAmzTurnoverStore} from '@/store/modules/amzTurnover';
import {
  summaryAmzTurnover,
  getStoreList,
  getSalesPersonList,
  getDeveloperList
} from "@/api/amazon/amzTurnover";

const {proxy} = getCurrentInstance();

const router = useRouter();
const store = useAmzTurnoverStore();
const amzInventoryShelfTime = ref([]);

const data = reactive({
  form: {
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
    salesPerson: null,
    developer: null,
    inventoryShelfTimeRange: null,
    quickFilter: null,
  },
  queryParams: {
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
    inventoryShelfTimeRange: null,
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
    version: null
  },
  rules: {
    sku: [
      {required: true, message: "库存SKU不能为空", trigger: "blur"}
    ],
    isDelete: [
      {required: true, message: "是否删除不能为空", trigger: "blur"}
    ],
  },
  turnoverDaysMin: null,
  turnoverDaysMax: null
});

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
    inventoryShelfTimeRange: null,
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
    quickFilter: null,
  };
  proxy.resetForm("amzTurnoverRef");
}

const loading = ref(true);
const showSearch = ref(true);
const {queryParams, form, rules} = toRefs(data);
const amzTurnoverSummary = ref({});

// 店铺选项
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

// 常量定义
const TABLE_COLUMNS = [
  {prop: 'over360', label: '大于360天', minWidth: 100},
  {prop: 'd270_360', label: '270~360天', minWidth: 100},
  {prop: 'd210_270', label: '210~270天', minWidth: 100},
  {prop: 'd150_210', label: '150~210天', minWidth: 100},
  {prop: 'd120_150', label: '120~150天', minWidth: 100},
  {prop: 'd60_120', label: '60~120天', minWidth: 100},
  {prop: 'under60', label: '小于60天', minWidth: 100}
];

const ROW_TYPES = {
  SKU_COUNT: 'SKU数量',
  SKU_RATIO: 'SKU数量占比',
  INVENTORY_VALUE: '库存金额',
  INVENTORY_RATIO: '库存金额占比',
  REVENUE: '营业额',
  REVENUE_RATIO: '营业额占比',
  PROFIT: '利润',
  PROFIT_RATIO: '利润占比',
  PROFIT_MARGIN: '利润率'
};

// 数据转换工具函数
const transformTurnoverData = (stats, formatters) => {
  if (!stats || !Array.isArray(stats) || stats.length !== 7) return [];

  const getColumnValue = (stat, key, formatter, prefix = '') => {
    const value = stat?.[key] ?? 0;
    return formatter ? `${prefix}${formatter(value)}` : value;
  };

  return [
    {
      label: ROW_TYPES.SKU_COUNT,
      ...TABLE_COLUMNS.reduce((acc, col) => ({
        ...acc,
        [col.prop]: getColumnValue(stats[getColumnIndex(col.prop)], 'skuCount')
      }), {})
    },
    {
      label: ROW_TYPES.SKU_RATIO,
      ...TABLE_COLUMNS.reduce((acc, col) => ({
        ...acc,
        [col.prop]: getColumnValue(stats[getColumnIndex(col.prop)], 'skuRatio', formatters.percent)
      }), {})
    },
    {
      label: ROW_TYPES.INVENTORY_VALUE,
      ...TABLE_COLUMNS.reduce((acc, col) => ({
        ...acc,
        [col.prop]: getColumnValue(stats[getColumnIndex(col.prop)], 'inventoryValue', formatters.currency, '¥')
      }), {})
    },
    {
      label: ROW_TYPES.INVENTORY_RATIO,
      ...TABLE_COLUMNS.reduce((acc, col) => ({
        ...acc,
        [col.prop]: getColumnValue(stats[getColumnIndex(col.prop)], 'inventoryRatio', formatters.percent)
      }), {})
    },
    {
      label: ROW_TYPES.REVENUE,
      ...TABLE_COLUMNS.reduce((acc, col) => ({
        ...acc,
        [col.prop]: getColumnValue(stats[getColumnIndex(col.prop)], 'revenue', formatters.currency, '¥')
      }), {})
    },
    {
      label: ROW_TYPES.REVENUE_RATIO,
      ...TABLE_COLUMNS.reduce((acc, col) => ({
        ...acc,
        [col.prop]: getColumnValue(stats[getColumnIndex(col.prop)], 'revenueRatio', formatters.percent)
      }), {})
    },
    {
      label: ROW_TYPES.PROFIT,
      ...TABLE_COLUMNS.reduce((acc, col) => ({
        ...acc,
        [col.prop]: getColumnValue(stats[getColumnIndex(col.prop)], 'profit', formatters.currency, '¥')
      }), {})
    },
    {
      label: ROW_TYPES.PROFIT_RATIO,
      ...TABLE_COLUMNS.reduce((acc, col) => ({
        ...acc,
        [col.prop]: getColumnValue(stats[getColumnIndex(col.prop)], 'profitRatio', formatters.percent)
      }), {})
    },
    {
      label: ROW_TYPES.PROFIT_MARGIN,
      ...TABLE_COLUMNS.reduce((acc, col) => ({
        ...acc,
        [col.prop]: getColumnValue(stats[getColumnIndex(col.prop)], 'profitMargin', formatters.percent)
      }), {})
    }
  ];
};

// 辅助函数
const getColumnIndex = (columnProp) => {
  const indexMap = {
    'over360': 0,
    'd270_360': 1,
    'd210_270': 2,
    'd150_210': 3,
    'd120_150': 4,
    'd60_120': 5,
    'under60': 6
  };
  return indexMap[columnProp] ?? 0;
};

// 格式化函数
const formatters = {
  currency: (value) => {
    if (!value && value !== 0) return '¥0.00';
    return `¥${Number(value).toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  },
  percent: (value) => {
    if (!value && value !== 0) return '0.00%';
    return `${Number(value).toFixed(2)}%`;
  },
  days: (value) => {
    if (!value && value !== 0) return '0天';
    return `${Number(value).toFixed(2)}天`;
  }
};

// 计算属性
const turnoverTableData = computed(() => {
  return (amzTurnoverSummary.value?.turnoverStats || []).map(stat => ({
    label: stat.turnover_range,
    over360: formatters.currency(stat.over360),
    d270_360: formatters.currency(stat.d270_360),
    d210_270: formatters.currency(stat.d210_270),
    d150_210: formatters.currency(stat.d150_210),
    d120_150: formatters.currency(stat.d120_150),
    d60_120: formatters.currency(stat.d60_120),
    under60: formatters.currency(stat.under60),
    skuCount: stat.skuCount,
    skuRatio: formatters.percent(stat.skuRatio),
    inventoryValue: formatters.currency(stat.inventoryValue),
    inventoryRatio: formatters.percent(stat.inventoryRatio),
    revenue: formatters.currency(stat.revenue),
    revenueRatio: formatters.percent(stat.revenueRatio),
    profit: formatters.currency(stat.profit),
    profitRatio: formatters.percent(stat.profitRatio),
    profitMargin: formatters.percent(stat.profitMargin),
    turnover_days: getTurnoverDays(stat.turnover_range)
  }));
});

const fbaTurnoverTableData = computed(() => {
  return (amzTurnoverSummary.value?.fbaTurnoverStats || []).map(stat => ({
    label: stat.turnover_range,
    skuCount: stat.skuCount,
    skuRatio: formatters.percent(stat.skuRatio),
    inventoryValue: formatters.currency(stat.inventoryValue),
    inventoryRatio: formatters.percent(stat.inventoryRatio),
    revenue: formatters.currency(stat.revenue),
    revenueRatio: formatters.percent(stat.revenueRatio),
    profit: formatters.currency(stat.profit),
    profitRatio: formatters.percent(stat.profitRatio),
    profitMargin: formatters.percent(stat.profitMargin),
    turnover_days: getTurnoverDays(stat.turnover_range)
  }));
});

// 事件处理
const handleQuery = async () => {
  try {
    loading.value = true;
    store.setSummaryQueryParams(form.value);
    const response = await summaryAmzTurnover(form.value);

    if (response.code === 200) {
      amzTurnoverSummary.value = response.data;
    } else {
      proxy.$modal.msgError(response.msg);
    }
  } catch (error) {
    console.error("获取数据失败:", error);
    proxy.$modal.msgError("获取数据失败");
  } finally {
    loading.value = false;
  }
};

/** 重置按钮操作 */
function resetQuery() {
  reset();
  proxy.resetForm("queryRef");
  handleQuery();
}

// 确保在这里调用 onMounted
onMounted(async () => {
  try {
    // 如果有存储的查询条件，使用它
    if (store.summaryQueryParams) {
      data.form = {...store.summaryQueryParams};
    }
    await getOptions();
    await handleQuery();
  } catch (error) {
    console.error("组件挂载时出错:", error);
  }
});

// 添加天数格式化函数
const formatDays = (value) => {
  if (!value && value !== 0) return '0天';
  return `${Number(value).toFixed(2)}天`;
};

// 修改金额格式化函数
const formatCurrency = (value) => {
  if (!value || isNaN(value)) return '0.00';
  return Number(value).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const formatPercent = (value) => {
  if (!value) return '0.00%';
  return Number(value).toFixed(2) + '%';  // 不需要乘100，因为后端已经返回百分比值
};

// 处理SKU数量点击事件
const handleSkuCountClick = (turnoverRange) => {
  const queryParams = {
    storeName: form.value.storeName,
    categoryLevelOne: form.value.categoryLevelOne,
    categoryLevelTwo: form.value.categoryLevelTwo,
    available: form.value.available,
    awaitingStock: form.value.awaitingStock,
    salesPerson: form.value.salesPerson,
    developer: form.value.developer,
    listingDate: form.value.listingDate,
    turnoverDaysMin: data.turnoverDaysMin,
    turnoverDaysMax: data.turnoverDaysMax,
    turnoverRange: turnoverRange || null,
    beginTime: form.value.inventoryShelfTimeRange ? form.value.inventoryShelfTimeRange[0] : null,
    endTime: form.value.inventoryShelfTimeRange ? form.value.inventoryShelfTimeRange[1] : null
  };

  // 移除空值
  Object.keys(queryParams).forEach(key => {
    if (!queryParams[key]) {
      delete queryParams[key];
    }
  });

  router.push({
    name: 'ListAmz',
    query: queryParams
  });
};

const handleSumSkuCountClick = () => {
  const queryParams = {
    storeName: form.value.storeName,
    categoryLevelOne: form.value.categoryLevelOne,
    categoryLevelTwo: form.value.categoryLevelTwo,
    available: form.value.available,
    awaitingStock: form.value.awaitingStock,
    salesPerson: form.value.salesPerson,
    developer: form.value.developer,
    listingDate: form.value.listingDate
  };

  // 移除空值
  Object.keys(queryParams).forEach(key => {
    if (!queryParams[key]) {
      delete queryParams[key];
    }
  });

  router.push({
    name: 'ListAmz',
    query: queryParams
  });
};

// 示例函数，根据 turnover_range 返回对应的周转天数
const getTurnoverDays = (range) => {
  switch (range) {
    case 'over360':
      return 361; // 示例值
    case 'd270_360':
      return 270; // 示例值
    case 'd210_270':
      return 210; // 示例值
    case 'd150_210':
      return 150; // 示例值
    case 'd120_150':
      return 120; // 示例值
    case 'd60_120':
      return 60; // 示例值
    case 'under60':
      return 0; // 示例值
    default:
      return null;
  }
};

// 添加快捷筛选处理函数
const handleQuickFilterChange = (value) => {
    const today = new Date();
    
    switch (value) {
        case 'new':
            // 新品：90天（3个月）内 - 从3个月前到现在
            const threeMonthsAgo = new Date(today);
            threeMonthsAgo.setDate(today.getDate() - 90);
            form.value.inventoryShelfTimeRange = [
                threeMonthsAgo.toISOString().split('T')[0],
                today.toISOString().split('T')[0]
            ];
            break;
            
        case 'semi_new':
            // 次新品：180天到90天（6个月前到3个月前）
            const sixMonthsAgo = new Date(today);
            const threeMonthsAgo2 = new Date(today);  
            sixMonthsAgo.setDate(today.getDate() - 180);
            threeMonthsAgo2.setDate(today.getDate() - 90);
            form.value.inventoryShelfTimeRange = [
                sixMonthsAgo.toISOString().split('T')[0],
                threeMonthsAgo2.toISOString().split('T')[0]
            ];
            break;
            
        case 'old':
            // 老品：180天以上（从1900年到6个月前）
            const sixMonthsAgo2 = new Date(today);
            sixMonthsAgo2.setDate(today.getDate() - 180);
            form.value.inventoryShelfTimeRange = [
                '1900-01-01',  // 设置一个足够早的日期
                sixMonthsAgo2.toISOString().split('T')[0]
            ];
            break;
            
        case 'custom':
            // 自定义：清空日期范围
            form.value.inventoryShelfTimeRange = null;
            break;
    }
    
    // 可以选择在这里直接触发查询
    handleQuery();
};
</script>
<style scoped lang="scss">
.container {
  padding: 16px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 84px);

  .search-card {
    margin-bottom: 16px;

    :deep(.el-form-item) {
      margin-bottom: 18px;
    }
  }

  .data-section {
    .summary-card {
      height: 100%;

      .summary-list {
        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
          border-bottom: 1px solid #ebeef5;

          &:last-child {
            border-bottom: none;
          }

          span:first-child {
            color: #606266;
          }

          span:last-child {
            font-weight: 500;
            color: #303133;
          }
        }
      }
    }

    .turnover-card {
      :deep(.el-table) {
        .el-table__header th {
          font-size: 13px;
          padding: 8px 0;
        }

        .el-table__body td {
          padding: 4px;
          font-size: 13px;
        }
      }
    }
  }

  .card-header {
    font-size: 15px;
    font-weight: 500;
    color: #303133;
  }
}

.turnover-stats {
  .turnover-row {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 10px;
    padding: 8px 0;
    border-bottom: 1px solid #ddd;

    &.header {
      font-weight: bold;
      background-color: #f5f7fa;
    }

    span {
      text-align: center;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &:first-child {
        text-align: left;
        padding-left: 10px;
      }
    }
  }
}

// 添加数字格式化相关样式
.currency {
  font-family: monospace;
  color: #67c23a;
}

.percent {
  color: #409eff;
}

.summary-item {
  &.money {
    span:last-child {
      color: #606266;
      font-weight: 600;
    }
  }

  &.money-total {
    background: #f8f9fa;

    span:last-child {
      color: #f56c6c;
      font-size: 16px;
      font-weight: 600;
    }
  }

  &.money-important {
    background: #fff3f3;

    span:last-child {
      color: #f56c6c;
      font-size: 16px;
      font-weight: 600;
    }
  }

  .clickable {
    cursor: pointer;
    color: #409eff !important;
    text-decoration: underline !important;
    padding: 4px 8px !important;
    border-radius: 4px !important;
    transition: color 0.3s, background-color 0.3s !important;

    &:hover {
      color: #66b1ff !important;
      background-color: rgba(64, 158, 255, 0.1) !important;
    }
  }

  .clickable_table {
    cursor: pointer;
    color: #409eff;
    text-decoration: underline;
    padding: 4px 8px;
    border-radius: 4px;
    transition: color 0.3s, background-color 0.3s;

    &:hover {
      color: #66b1ff;
      background-color: rgba(64, 158, 255, 0.1);
    }
  }
}

.el-table .clickable_table {
  cursor: pointer;
  color: #409eff;
  text-decoration: underline;
  padding: 4px 8px;
  border-radius: 4px;
  transition: color 0.3s, background-color 0.3s;

  &:hover {
    color: #66b1ff;
    background-color: rgba(64, 158, 255, 0.1);
  }
}
</style>