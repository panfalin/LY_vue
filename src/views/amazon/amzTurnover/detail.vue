<script setup name="Detail">
import {useRoute} from 'vue-router'; // 确保导入 useRoute
import {
  getAmzTurnover,
} from "@/api/amazon/amzTurnover";

const route = useRoute();
const data = ref({});
const selectedDataModules = ref([]);
const selectedFields = ref([]);
const currentValues = ref([]);
const targetValues = ref([]);
const completionDates = ref([]);
const assignedTos = ref([]);
const notificationMethods = ref([]); // 新增通知方式
const reminderFrequency = ref(''); // 新增提醒频率
const userOptions = ref([
  {id: 1, name: '张三'},
  {id: 2, name: '李四'},
  {id: 3, name: '王五'}
]);
const companyTargets = ref([]); // 公司指标
const supervisorTargets = ref([]); // 主管指标
const personalTargets = ref([]); // 个人指标
const globalCompletionDate = ref(null); // 统一完成时间

// 格式化金额：添加千分位和货币符号
const formatMoney = (value) => {
  if (!value && value !== 0) return '--';
  return `¥ ${value.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
};

// 格式化数量：添加千分位
const formatQuantity = (value) => {
  if (!value && value !== 0) return '--';
  return value.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
};

// 格式化小数
const formatDecimal = (value) => {
  if (!value && value !== 0) return '--';
  return value.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
};

// 从查询参数中获取数据
if (route.query.data) {
  data.value = JSON.parse(route.query.data); // 解析传递的数据
} else {
  const id = route.params?.id;
  if (id) {
    getAmzTurnover(id).then(res => {
      data.value = res.data; // 直接赋值，因为返回的数据结构已经匹配
      // 初始化现有值
      currentValues.value = [
        data.value.sales7Days,
        data.value.sales14Days,
        data.value.sales30Days,
        data.value.latestPurchasePrice,
        data.value.minPurchaseQuantity,
        data.value.procurementDays,
        data.value.weight,
        data.value.volumeCm3,
        data.value.turnoverDays,
      ];
    }).catch(error => {
      console.error("获取数据失败:", error); // 添加错误处理
      console.log("错误详情:", error); // 添加详细错误信息打印
      data.value = {}; // 设置为空对象以避免模板崩溃
    });
  }
}

// 可选择的指标字段
const allFields = [
  {label: '过去7天销量', value: 'sales7Days'},
  {label: '过去14天销量', value: 'sales14Days'},
  {label: '过去30天销量', value: 'sales30Days'},
  {label: '最新采购价', value: 'latestPurchasePrice'},
  {label: '周转天数', value: 'turnoverDays'},
];

const publishTask = () => {
  // 这里可以根据设置的指标和统一完成时间生成任务
  selectedFields.value.forEach((field, index) => {
    const task = {
      field,
      companyTarget: companyTargets.value[index],
      supervisorTarget: supervisorTargets.value[index],
      personalTarget: personalTargets.value[index],
      completionDate: globalCompletionDate.value, // 使用统一完成时间
    };
    // 这里可以将任务发送到后端或进行其他处理
    console.log("发布任务:", task);
  });
};

const setMetrics = () => {
  // 根据选择的字段初始化指标值
  companyTargets.value = Array(selectedFields.value.length).fill(0);
  supervisorTargets.value = Array(selectedFields.value.length).fill(0);
  personalTargets.value = Array(selectedFields.value.length).fill(0);
};
</script>

<template>
  <div class="detail-container">
    <div class="detail-layout">
      <!-- 左侧区域 -->
      <div class="detail-left">
        <!-- 基本信息 -->
        <div class="detail-section">
          <div class="section-title">基本信息</div>
          <div class="detail-row">
            <label>店铺名称：</label>
            <span>{{ data.storeName }}</span>
          </div>
          <div class="detail-row">
            <label>产品名称：</label>
            <span>{{ data.productName }}</span>
          </div>
          <div class="detail-row">
            <label>商品目录：</label>
            <span>{{ data.categoryLevelOne }} / {{ data.categoryLevelTwo }}</span>
          </div>
          <div class="detail-grid">
            <div class="grid-item">
              <label>MSKU</label>
              <span>{{ data.msku }}</span>
            </div>
            <div class="grid-item">
              <label>ASIN</label>
              <span>{{ data.asin }}</span>
            </div>
            <div class="grid-item">
              <label>FNSKU</label>
              <span>{{ data.fnsku }}</span>
            </div>
            <div class="grid-item">
              <label>本地SKU</label>
              <span>{{ data.localSku }}</span>
            </div>
            <div class="grid-item">
              <label>库存状态</label>
              <span class="status-tag">{{ data.stockStatus }}</span>
            </div>
          </div>
        </div>

        <!-- 销量信息 -->
        <div class="detail-section">
          <div class="section-title">销量信息</div>
          <div class="detail-grid">
            <div class="grid-item">
              <label>7天销量</label>
              <span>{{ formatQuantity(data.sales7Days) }} 个</span>
            </div>
            <div class="grid-item">
              <label>14天销量</label>
              <span>{{ formatQuantity(data.sales14Days) }} 个</span>
            </div>
            <div class="grid-item">
              <label>30天销量</label>
              <span>{{ formatQuantity(data.sales30Days) }} 个</span>
            </div>
            <div class="grid-item">
              <label>90天销量</label>
              <span>{{ formatQuantity(data.sales90Days) }} 个</span>
            </div>
            <div class="grid-item">
              <label>日均销量</label>
              <span>{{ formatQuantity(data.avgDailySales) }} 个</span>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <div class="section-title">市场数据</div>
          <div class="detail-grid">
            <div class="grid-item">
              <label>竞争对手销量</label>
              <span>{{ formatQuantity(data.amCompetitorSales) }} 个</span>
            </div>
            <div class="grid-item">
              <label>市场容量</label>
              <span>{{ formatQuantity(data.amMarketCapacity) }} 个</span>
            </div>
            <div class="grid-item">
              <label>上架时间</label>
              <span>{{ formatQuantity(data.amzInventoryShelfTime) }} 天</span>
            </div>
            <div class="grid-item">
              <label>预警天数</label>
              <span>{{ formatQuantity(data.stockWarningDays) }} 天</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧区域 -->
      <div class="detail-right">
        <!-- 库存信息 -->
        <div class="detail-section">
          <div class="section-title">库存信息</div>
          <div class="detail-row">
            <label>库存状态：</label>
            <span class="status-tag">{{ data.stockStatus }}</span>
          </div>
          <div class="detail-grid">
            <div class="grid-item">
              <label>本地库存</label>
              <span>{{ formatQuantity(data.localInventory) }} 个</span>
            </div>
            <div class="grid-item">
              <label>采购在途</label>
              <span>{{ formatQuantity(data.procurementInTransit) }} 个</span>
            </div>
            <div class="grid-item">
              <label>FBA可售</label>
              <span>{{ formatQuantity(data.available) }} 个</span>
            </div>
            <div class="grid-item">
              <label>FBA待入库</label>
              <span>{{ formatQuantity(data.awaitingStock) }} 个</span>
            </div>
            <div class="grid-item">
              <label>FBA在途</label>
              <span>{{ formatQuantity(data.inTransit) }} 个</span>
            </div>
            <div class="grid-item">
              <label>FBA预留</label>
              <span>{{ formatQuantity(data.reserved) }} 个</span>
            </div>
            <div class="grid-item">
              <label>总库存数量</label>
              <span>{{ formatQuantity(data.totalInventoryCount) }} 个</span>
            </div>
          </div>
        </div>

        <!-- 库存价值与周转 -->
        <div class="detail-section">
          <div class="section-title">库存价值与周转</div>
          <div class="detail-grid">
            <div class="grid-item">
              <label>本地库存价值</label>
              <span class="money">{{ formatMoney(data.totalLocalInventoryValue) }}</span>
            </div>
            <div class="grid-item">
              <label>FBA库存价值</label>
              <span class="money">{{ formatMoney(data.totalFbaInventoryValue) }}</span>
            </div>
            <div class="grid-item">
              <label>总库存价值</label>
              <span class="money">{{ formatMoney(data.totalInventoryValue) }}</span>
            </div>
            <div class="grid-item">
              <label>总周转天数</label>
              <span>{{ formatQuantity(data.turnoverDays) }} 天</span>
            </div>
            <div class="grid-item">
              <label>FBA周转天数</label>
              <span>{{ formatQuantity(data.fbaTurnoverDays) }} 天</span>
            </div>
            <div class="grid-item">
              <label>可售天数</label>
              <span>{{ formatQuantity(data.availableDays) }} 天</span>
            </div>
          </div>
        </div>

        <!-- 采购与规格 -->
        <div class="detail-section">
          <div class="section-title">采购与规格</div>
          <div class="detail-row">
            <label>供应商：</label>
            <span>{{ data.supplierName }}</span>
          </div>
          <div class="detail-grid">
            <div class="grid-item">
              <label>最新采购价</label>
              <span class="money">{{ formatMoney(data.latestPurchasePrice) }}</span>
            </div>
            <div class="grid-item">
              <label>最小采购量</label>
              <span>{{ formatQuantity(data.minPurchaseQuantity) }} 个</span>
            </div>
            <div class="grid-item">
              <label>采购天数</label>
              <span>{{ formatQuantity(data.procurementDays) }} 天</span>
            </div>
            <div class="grid-item">
              <label>重量(g)</label>
              <span>{{ formatQuantity(data.weight) }} g</span>
            </div>
            <div class="grid-item">
              <label>体积(cm³)</label>
              <span>{{ formatQuantity(data.volumeCm3) }} cm³</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="detail-layout">
      <!-- 左侧区域 -->
      <div class="detail-left">
        <!-- 指标设置 -->
        <div class="metric-section">
          <div class="section-title">指标设置</div>
          <div class="metric-layout">
            <!-- 左侧区域：字段选择 -->
            <div class="field-selection">
              <el-checkbox-group v-model="selectedFields">
                <div v-for="field in allFields" :key="field.value">
                  <el-checkbox :label="field.value">{{ field.label }}</el-checkbox>
                </div>
              </el-checkbox-group>
              <el-button type="primary" @click="setMetrics">设置指标</el-button>
            </div>
            <!-- 右侧区域：指标设置 -->
            <div class="metric-settings" v-if="selectedFields.length > 0">
              <el-form-item label="统一完成时间">
                <el-date-picker v-model="globalCompletionDate" type="date" placeholder="选择完成日期"
                                style="width: 100%"></el-date-picker>
              </el-form-item>
              <div v-for="(field, index) in selectedFields" :key="index" class="metric-item">
                <div class="metric-header">
                  <span>{{ field }}</span>
                </div>
                <el-row :gutter="20">
                  <el-col :span="6">
                    <el-form-item label="公司指标">
                      <el-input-number v-model="companyTargets[index]" :min="0" style="width: 100%"></el-input-number>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="主管指标">
                      <el-input-number v-model="supervisorTargets[index]" :min="0"
                                       style="width: 100%"></el-input-number>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="个人指标">
                      <el-input-number v-model="personalTargets[index]" :min="0" style="width: 100%"></el-input-number>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
            <!-- 发布任务按钮 -->
            <div class="publish-button">
              <el-button type="primary" @click="publishTask">发布任务</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.detail-container {
  padding: 10px;
  background: #f5f7fa;
}

.detail-layout {
  display: flex;
  gap: 10px;
}

.detail-left,
.detail-right {
  flex: 1;
  min-width: 0;
}

.detail-section {
  margin-bottom: 10px;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
}

.section-title {
  padding: 8px 10px;
  font-weight: bold;
  background: #f5f7fa;
  border-bottom: 1px solid #dcdfe6;
}

.detail-row {
  padding: 8px 10px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ebeef5;

  &:last-child {
    border-bottom: none;
  }

  label {
    width: 120px;
    color: #606266;
  }

  span {
    flex: 1;
    color: #303133;
  }
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  padding: 10px;
  gap: 10px;
}

.grid-item {
  display: flex;
  flex-direction: column;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;

  label {
    color: #909399;
    font-size: 13px;
    margin-bottom: 4px;
  }

  span {
    color: #303133;
    font-size: 14px;
  }
}

.status-tag {
  padding: 2px 8px;
  background: #f0f9eb;
  color: #67c23a;
  border-radius: 2px;
}

.money {
  color: #f56c6c !important; // 使用红色突出显示金额
  font-weight: 500;
}

.publish-button {
  margin-top: 10px;
}

@media screen and (max-width: 1200px) {
  .detail-layout {
    flex-direction: column;
  }

  .detail-left,
  .detail-right {
    width: 100%;
  }
}
</style>