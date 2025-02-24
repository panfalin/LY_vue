<template>
  <div class="container">
    <el-card class="search-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="店铺名称">
            <el-input v-model="form.storeName" placeholder="请输入店铺名称" clearable />
      </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品一级目录">
            <el-input v-model="form.categoryLevelOne" placeholder="请输入一级目录" clearable />
      </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品二级目录">
            <el-input v-model="form.categoryLevelTwo" placeholder="请输入二级目录" clearable />
      </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="销售员">
            <el-input v-model="form.salesPerson" placeholder="请输入销售员" clearable />
      </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="可售">
            <el-input v-model="form.available" placeholder="请输入可售" clearable />
      </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="待入库">
            <el-input v-model="form.awaitingStock" placeholder="请输入待入库" clearable />
      </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="开发员">
            <el-input v-model="form.developer" placeholder="请输入开发员" clearable />
      </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="上架时间">
            <el-date-picker
            v-model="form.listingDate"
              type="date"
              placeholder="选择上架时间"
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
              <span 
                class="clickable" 
                @click="handleSkuCountClick"
              >{{ amzTurnoverSummary.listedSkuCount || 0 }}</span>
            </div>
            <div class="summary-item">
              <span>库存个数总计</span>
              <span>{{ amzTurnoverSummary?.totalInventoryCount || 0 }}</span>
          </div>
            <div class="summary-item">
            <span>库存金额总计</span>
              <span>¥{{ formatCurrency(amzTurnoverSummary?.totalInventoryValue) }}</span>
            </div>
            <div class="summary-item">
              <span>采购在途总额</span>
              <span>¥{{ formatCurrency(amzTurnoverSummary?.totalProcurementInventory) }}</span>
            </div>
            <div class="summary-item">
              <span>本地库存总额</span>
              <span>¥{{ formatCurrency(amzTurnoverSummary?.totalLocalInventory) }}</span>
            </div>
            <div class="summary-item">
              <span>FBA在途总额</span>
              <span>¥{{ formatCurrency(amzTurnoverSummary?.totalFbaInTransit)}}</span>
          </div>
            <div class="summary-item">
              <span>FBA可售总额</span>
              <span>¥{{ formatCurrency(amzTurnoverSummary?.totalFbaAvailable) }}</span>
        </div>
            <div class="summary-item">
              <span>销售额（近7天平均）</span>
              <span>¥{{ formatCurrency(amzTurnoverSummary?.avgSalesLast7Days) }}</span>
          </div>
            <div class="summary-item">
              <span>销售成本（近7天平均）</span>
              <span>¥{{ formatCurrency(amzTurnoverSummary?.avgSalesCostLast7Days) }}</span>
          </div>
            <div class="summary-item">
              <span>周转天数（近7天平均）</span>
              <span>{{ amzTurnoverSummary?.avgTurnoverDaysLast7Days || 0 }}</span>
          </div>
            <div class="summary-item">
              <span>营业额</span>
              <span>¥{{ formatCurrency(amzTurnoverSummary?.totalRevenue) }}</span>
        </div>
            <div class="summary-item">
              <span>利润</span>
              <span>¥{{ formatCurrency(amzTurnoverSummary?.totalProfit) }}</span>
      </div>
    </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card class="turnover-card">
          <template #header>
            <div class="card-header">统计数据-周转天数（每天）</div>
          </template>
          <el-table 
            :data="turnoverTableData" 
            border 
            size="small" 
            style="width: 100%"
            :header-cell-style="{background:'#f5f7fa',color:'#606266',height:'40px'}"
          >
            <el-table-column prop="label" label="指标" width="100" fixed/>
            <el-table-column prop="over360" label=">360" min-width="100"/>
            <el-table-column prop="d270_360" label="270~360" min-width="100"/>
            <el-table-column prop="d210_270" label="210~270" min-width="100"/>
            <el-table-column prop="d150_210" label="150~210" min-width="100"/>
            <el-table-column prop="d120_150" label="120~150" min-width="100"/>
            <el-table-column prop="d60_120" label="60~120" min-width="100"/>
            <el-table-column prop="under60" label="<60" min-width="100"/>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script setup name="AmzTurnover">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAmzTurnoverStore } from '@/store/modules/amzTurnover';
import {
  summaryAmzTurnover
} from "@/api/amazon/amzTurnover";
const {proxy} = getCurrentInstance();

const router = useRouter();
const store = useAmzTurnoverStore();

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
    version: null
  },
  rules: {
    sku: [
      {required: true, message: "库存SKU不能为空", trigger: "blur"}
    ],
    isDelete: [
      {required: true, message: "是否删除不能为空", trigger: "blur"}
    ],
  }
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
    version: null
  };
  proxy.resetForm("amzTurnoverRef");
}
const loading = ref(true);
const showSearch = ref(true);
const {queryParams, form, rules} = toRefs(data);
const amzTurnoverSummary = ref({});

// 移除写死的初始值
const stats = ref({
  over360: {
    skuCount: 0,
    skuRatio: 0,
    inventoryValue: 0,
    inventoryRatio: 0,
    revenue: 0,
    revenueRatio: 0,
    profit: 0,
    profitRatio: 0,
    profitMargin: 0
  },
  d270_360: {
    skuCount: 0,
    skuRatio: 0,
    inventoryValue: 0,
    inventoryRatio: 0,
    revenue: 0,
    revenueRatio: 0,
    profit: 0,
    profitRatio: 0,
    profitMargin: 0
  },
  d210_270: {
    skuCount: 0,
    skuRatio: 0,
    inventoryValue: 0,
    inventoryRatio: 0,
    revenue: 0,
    revenueRatio: 0,
    profit: 0,
    profitRatio: 0,
    profitMargin: 0
  },
  d150_210: {
    skuCount: 0,
    skuRatio: 0,
    inventoryValue: 0,
    inventoryRatio: 0,
    revenue: 0,
    revenueRatio: 0,
    profit: 0,
    profitRatio: 0,
    profitMargin: 0
  },
  d120_150: {
    skuCount: 0,
    skuRatio: 0,
    inventoryValue: 0,
    inventoryRatio: 0,
    revenue: 0,
    revenueRatio: 0,
    profit: 0,
    profitRatio: 0,
    profitMargin: 0
  },
  d60_120: {
    skuCount: 0,
    skuRatio: 0,
    inventoryValue: 0,
    inventoryRatio: 0,
    revenue: 0,
    revenueRatio: 0,
    profit: 0,
    profitRatio: 0,
    profitMargin: 0
  },
  under60: {
    skuCount: 0,
    skuRatio: 0,
    inventoryValue: 0,
    inventoryRatio: 0,
    revenue: 0,
    revenueRatio: 0,
    profit: 0,
    profitRatio: 0,
    profitMargin: 0
  }
});

// 移除不需要的常量
const totalInventory = ref(0);
const totalValue = ref(0);
const turnoverDays = ref({});
const skuCount = ref({});
const inventoryValue = ref({});
const revenue = ref({});
const profit = ref({});
const profitMargin = ref({});

/** 搜索按钮操作 */
function handleQuery() {
  loading.value = true;
  // 保存查询条件到 store
  store.setSummaryQueryParams(form.value);
  summaryAmzTurnover(form.value).then(response => {
    if (response.code === 200) {
      const data = response.data;
      
      // 更新汇总数据
      amzTurnoverSummary.value = {
        listedSkuCount: data.listedSkuCount || 0,
        totalInventoryCount: data.totalInventoryCount || 0,
        totalInventoryValue: data.totalInventoryValue || 0,
        totalProcurementInventory: data.totalProcurementInventory || 0,
        totalLocalInventory: data.totalLocalInventory || 0,
        totalFbaInTransit: data.totalFbaInTransit || 0,
        totalFbaAvailable: data.totalFbaAvailable || 0,
        avgSalesLast7Days: data.avgSalesLast7Days || 0,
        avgSalesCostLast7Days: data.avgSalesCostLast7Days || 0,
        avgTurnoverDaysLast7Days: data.avgTurnoverDaysLast7Days || 0,
        totalRevenue: data.totalRevenue || 0,
        totalProfit: data.totalProfit || 0
      };

      // 更新周转天数统计数据
      if (data.turnoverStats && data.turnoverStats.length === 7) {
        stats.value = {
          over360: {
            skuCount: data.turnoverStats[0].skuCount,
            skuRatio: data.turnoverStats[0].skuRatio / 100, // 转换为小数
            inventoryValue: data.turnoverStats[0].inventoryValue,
            inventoryRatio: data.turnoverStats[0].inventoryRatio / 100,
            revenue: data.turnoverStats[0].revenue,
            revenueRatio: data.turnoverStats[0].revenueRatio / 100,
            profit: data.turnoverStats[0].profit,
            profitRatio: data.turnoverStats[0].profitRatio / 100,
            profitMargin: data.turnoverStats[0].profitMargin / 100
          },
          d270_360: {
            skuCount: data.turnoverStats[1].skuCount,
            skuRatio: data.turnoverStats[1].skuRatio / 100,
            inventoryValue: data.turnoverStats[1].inventoryValue,
            inventoryRatio: data.turnoverStats[1].inventoryRatio / 100,
            revenue: data.turnoverStats[1].revenue,
            revenueRatio: data.turnoverStats[1].revenueRatio / 100,
            profit: data.turnoverStats[1].profit,
            profitRatio: data.turnoverStats[1].profitRatio / 100,
            profitMargin: data.turnoverStats[1].profitMargin / 100
          },
          d210_270: {
            skuCount: data.turnoverStats[2].skuCount,
            skuRatio: data.turnoverStats[2].skuRatio / 100,
            inventoryValue: data.turnoverStats[2].inventoryValue,
            inventoryRatio: data.turnoverStats[2].inventoryRatio / 100,
            revenue: data.turnoverStats[2].revenue,
            revenueRatio: data.turnoverStats[2].revenueRatio / 100,
            profit: data.turnoverStats[2].profit,
            profitRatio: data.turnoverStats[2].profitRatio / 100,
            profitMargin: data.turnoverStats[2].profitMargin / 100
          },
          d150_210: {
            skuCount: data.turnoverStats[3].skuCount,
            skuRatio: data.turnoverStats[3].skuRatio / 100,
            inventoryValue: data.turnoverStats[3].inventoryValue,
            inventoryRatio: data.turnoverStats[3].inventoryRatio / 100,
            revenue: data.turnoverStats[3].revenue,
            revenueRatio: data.turnoverStats[3].revenueRatio / 100,
            profit: data.turnoverStats[3].profit,
            profitRatio: data.turnoverStats[3].profitRatio / 100,
            profitMargin: data.turnoverStats[3].profitMargin / 100
          },
          d120_150: {
            skuCount: data.turnoverStats[4].skuCount,
            skuRatio: data.turnoverStats[4].skuRatio / 100,
            inventoryValue: data.turnoverStats[4].inventoryValue,
            inventoryRatio: data.turnoverStats[4].inventoryRatio / 100,
            revenue: data.turnoverStats[4].revenue,
            revenueRatio: data.turnoverStats[4].revenueRatio / 100,
            profit: data.turnoverStats[4].profit,
            profitRatio: data.turnoverStats[4].profitRatio / 100,
            profitMargin: data.turnoverStats[4].profitMargin / 100
          },
          d60_120: {
            skuCount: data.turnoverStats[5].skuCount,
            skuRatio: data.turnoverStats[5].skuRatio / 100,
            inventoryValue: data.turnoverStats[5].inventoryValue,
            inventoryRatio: data.turnoverStats[5].inventoryRatio / 100,
            revenue: data.turnoverStats[5].revenue,
            revenueRatio: data.turnoverStats[5].revenueRatio / 100,
            profit: data.turnoverStats[5].profit,
            profitRatio: data.turnoverStats[5].profitRatio / 100,
            profitMargin: data.turnoverStats[5].profitMargin / 100
          },
          under60: {
            skuCount: data.turnoverStats[6].skuCount,
            skuRatio: data.turnoverStats[6].skuRatio / 100,
            inventoryValue: data.turnoverStats[6].inventoryValue,
            inventoryRatio: data.turnoverStats[6].inventoryRatio / 100,
            revenue: data.turnoverStats[6].revenue,
            revenueRatio: data.turnoverStats[6].revenueRatio / 100,
            profit: data.turnoverStats[6].profit,
            profitRatio: data.turnoverStats[6].profitRatio / 100,
            profitMargin: data.turnoverStats[6].profitMargin / 100
          }
        };
      }
      
      console.log('汇总数据:', amzTurnoverSummary.value);
      console.log('周转天数统计:', stats.value);
    } else {
      proxy.$modal.msgError(response.msg);
    }
  }).catch(error => {
    console.error("获取数据失败:", error);
  }).finally(() => {
    loading.value = false;
  });
}

/** 重置按钮操作 */
function resetQuery() {
  reset();
  proxy.resetForm("queryRef");
  handleQuery();
}

// 组件挂载时自动加载数据
onMounted(() => {
  // 如果有存储的查询条件，使用它
  if (store.summaryQueryParams) {
    form.value = { ...store.summaryQueryParams };
  }
  handleQuery();
});

// 修改格式化函数
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

// 将周转天数数据转换为表格数据
const turnoverTableData = computed(() => {
  return [
    {
      label: 'SKU数量',
      over360: stats.value?.over360?.skuCount || 0,
      d270_360: stats.value?.d270_360?.skuCount || 0,
      d210_270: stats.value?.d210_270?.skuCount || 0,
      d150_210: stats.value?.d150_210?.skuCount || 0,
      d120_150: stats.value?.d120_150?.skuCount || 0,
      d60_120: stats.value?.d60_120?.skuCount || 0,
      under60: stats.value?.under60?.skuCount || 0
    },
    {
      label: 'SKU数量占比',
      over360: formatPercent(stats.value?.over360?.skuRatio),
      d270_360: formatPercent(stats.value?.d270_360?.skuRatio),
      d210_270: formatPercent(stats.value?.d210_270?.skuRatio),
      d150_210: formatPercent(stats.value?.d150_210?.skuRatio),
      d120_150: formatPercent(stats.value?.d120_150?.skuRatio),
      d60_120: formatPercent(stats.value?.d60_120?.skuRatio),
      under60: formatPercent(stats.value?.under60?.skuRatio)
    },
    {
      label: '库存金额',
      over360: `¥${formatCurrency(stats.value?.over360?.inventoryValue)}`,
      d270_360: `¥${formatCurrency(stats.value?.d270_360?.inventoryValue)}`,
      d210_270: `¥${formatCurrency(stats.value?.d210_270?.inventoryValue)}`,
      d150_210: `¥${formatCurrency(stats.value?.d150_210?.inventoryValue)}`,
      d120_150: `¥${formatCurrency(stats.value?.d120_150?.inventoryValue)}`,
      d60_120: `¥${formatCurrency(stats.value?.d60_120?.inventoryValue)}`,
      under60: `¥${formatCurrency(stats.value?.under60?.inventoryValue)}`
    },
    {
      label: '库存金额占比',
      over360: formatPercent(stats.value?.over360?.inventoryRatio),
      d270_360: formatPercent(stats.value?.d270_360?.inventoryRatio),
      d210_270: formatPercent(stats.value?.d210_270?.inventoryRatio),
      d150_210: formatPercent(stats.value?.d150_210?.inventoryRatio),
      d120_150: formatPercent(stats.value?.d120_150?.inventoryRatio),
      d60_120: formatPercent(stats.value?.d60_120?.inventoryRatio),
      under60: formatPercent(stats.value?.under60?.inventoryRatio)
    },
    {
      label: '营业额',
      over360: `¥${formatCurrency(stats.value?.over360?.revenue)}`,
      d270_360: `¥${formatCurrency(stats.value?.d270_360?.revenue)}`,
      d210_270: `¥${formatCurrency(stats.value?.d210_270?.revenue)}`,
      d150_210: `¥${formatCurrency(stats.value?.d150_210?.revenue)}`,
      d120_150: `¥${formatCurrency(stats.value?.d120_150?.revenue)}`,
      d60_120: `¥${formatCurrency(stats.value?.d60_120?.revenue)}`,
      under60: `¥${formatCurrency(stats.value?.under60?.revenue)}`
    },
    {
      label: '营业额占比',
      over360: formatPercent(stats.value?.over360?.revenueRatio),
      d270_360: formatPercent(stats.value?.d270_360?.revenueRatio),
      d210_270: formatPercent(stats.value?.d210_270?.revenueRatio),
      d150_210: formatPercent(stats.value?.d150_210?.revenueRatio),
      d120_150: formatPercent(stats.value?.d120_150?.revenueRatio),
      d60_120: formatPercent(stats.value?.d60_120?.revenueRatio),
      under60: formatPercent(stats.value?.under60?.revenueRatio)
    },
    {
      label: '利润',
      over360: `¥${formatCurrency(stats.value?.over360?.profit)}`,
      d270_360: `¥${formatCurrency(stats.value?.d270_360?.profit)}`,
      d210_270: `¥${formatCurrency(stats.value?.d210_270?.profit)}`,
      d150_210: `¥${formatCurrency(stats.value?.d150_210?.profit)}`,
      d120_150: `¥${formatCurrency(stats.value?.d120_150?.profit)}`,
      d60_120: `¥${formatCurrency(stats.value?.d60_120?.profit)}`,
      under60: `¥${formatCurrency(stats.value?.under60?.profit)}`
    },
    {
      label: '利润占比',
      over360: formatPercent(stats.value?.over360?.profitRatio),
      d270_360: formatPercent(stats.value?.d270_360?.profitRatio),
      d210_270: formatPercent(stats.value?.d210_270?.profitRatio),
      d150_210: formatPercent(stats.value?.d150_210?.profitRatio),
      d120_150: formatPercent(stats.value?.d120_150?.profitRatio),
      d60_120: formatPercent(stats.value?.d60_120?.profitRatio),
      under60: formatPercent(stats.value?.under60?.profitRatio)
    },
    {
      label: '利润率',
      over360: formatPercent(stats.value?.over360?.profitMargin),
      d270_360: formatPercent(stats.value?.d270_360?.profitMargin),
      d210_270: formatPercent(stats.value?.d210_270?.profitMargin),
      d150_210: formatPercent(stats.value?.d150_210?.profitMargin),
      d120_150: formatPercent(stats.value?.d120_150?.profitMargin),
      d60_120: formatPercent(stats.value?.d60_120?.profitMargin),
      under60: formatPercent(stats.value?.under60?.profitMargin)
    }
  ]
})

// 处理SKU数量点击事件
const handleSkuCountClick = () => {
  // 构建查询参数
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

  // 跳转到列表页面
  router.push({
    name: 'ListAmz',
    query: queryParams
  });
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
  .clickable {
    cursor: pointer;
    color: #409eff !important;
    text-decoration: underline;
    
    &:hover {
      color: #66b1ff !important;
    }
  }
}
</style>