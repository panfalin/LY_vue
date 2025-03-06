<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 左侧面板：基本信息和筛选条件 -->
      <el-col :span="8">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span class="title">基础设置</span>
            </div>
          </template>

          <el-form :model="taskForm" ref="taskFormRef" :rules="rules" label-width="100px">
            <!-- 基本信息 -->
            <el-form-item label="备注" prop="remark">
              <el-input 
                v-model="taskForm.remark" 
                placeholder="请输入备注信息"
                maxlength="150"
                show-word-limit
              />
            </el-form-item>

            <!-- 时间范围 -->
            <el-form-item label="时间范围">
              <el-select v-model="taskForm.timeRange" placeholder="请选择" style="width: 100%">
                <el-option label="过去30天" value="last30days"/>
                <el-option label="过去60天" value="last60days"/>
                <el-option label="过去90天" value="last90days"/>
                <el-option label="自定义" value="custom"/>
              </el-select>
            </el-form-item>

            <el-form-item v-if="taskForm.timeRange === 'custom'">
              <el-date-picker
                v-model="taskForm.customTimeRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%"
              />
            </el-form-item>

            <!-- 商品筛选 -->
            <div class="filter-section">
              <div class="section-title">商品筛选</div>
              <el-form-item label="类目">
                <el-select v-model="taskForm.category" placeholder="全部类目" style="width: 100%">
                  <el-option label="全部类目" value="all"/>
                  <el-option 
                    v-for="item in categoryOptions" 
                    :key="item.value" 
                    :label="item.label" 
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="分组">
                <el-select v-model="taskForm.group" placeholder="全部分组" style="width: 100%">
                  <el-option label="全部分组" value="all"/>
                  <el-option 
                    v-for="item in groupOptions" 
                    :key="item.value" 
                    :label="item.label" 
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>

              <!-- 添加高级筛选条件 -->
              <div class="advanced-filter">
                <div class="filter-title">高级筛选</div>
                <el-row :gutter="20">
                  <el-col :span="24">
                    <el-form-item label="周转天数">
                      <el-row :gutter="8">
                        <el-col :span="11">
                          <el-input-number 
                            v-model="taskForm.filter.turnoverDays.min" 
                            :min="0"
                            placeholder="最小值"
                            style="width: 100%"
                          />
                        </el-col>
                        <el-col :span="2" class="text-center">
                          <span class="separator">-</span>
                        </el-col>
                        <el-col :span="11">
                          <el-input-number 
                            v-model="taskForm.filter.turnoverDays.max" 
                            :min="0"
                            placeholder="最大值"
                            style="width: 100%"
                          />
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="20">
                  <el-col :span="24">
                    <el-form-item label="毛利率">
                      <el-row :gutter="8">
                        <el-col :span="11">
                          <el-input-number 
                            v-model="taskForm.filter.grossProfit.min" 
                            :min="0"
                            :max="100"
                            :precision="2"
                            placeholder="最小值"
                            style="width: 100%"
                          />
                        </el-col>
                        <el-col :span="2" class="text-center">
                          <span class="separator">-</span>
                        </el-col>
                        <el-col :span="11">
                          <el-input-number 
                            v-model="taskForm.filter.grossProfit.max" 
                            :min="0"
                            :max="100"
                            :precision="2"
                            placeholder="最大值"
                            style="width: 100%"
                          />
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="20">
                  <el-col :span="24">
                    <el-form-item label="销售额">
                      <el-row :gutter="8">
                        <el-col :span="11">
                          <el-input-number 
                            v-model="taskForm.filter.salesAmount.min" 
                            :min="0"
                            :precision="2"
                            placeholder="最小值"
                            style="width: 100%"
                          />
                        </el-col>
                        <el-col :span="2" class="text-center">
                          <span class="separator">-</span>
                        </el-col>
                        <el-col :span="11">
                          <el-input-number 
                            v-model="taskForm.filter.salesAmount.max" 
                            :min="0"
                            :precision="2"
                            placeholder="最大值"
                            style="width: 100%"
                          />
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>

              <!-- SKU筛选保持不变 -->
              <el-form-item label="SKU">
                <el-input
                  type="textarea"
                  v-model="taskForm.skuFilter"
                  placeholder="请输入SKU，多个SKU可用换行或逗号分隔"
                  :rows="4"
                />
              </el-form-item>
            </div>

            <!-- 人员筛选 -->
            <div class="filter-section">
              <div class="section-title">人员筛选</div>
              <el-form-item label="运营人员">
                <el-select v-model="taskForm.operator" placeholder="全部运营人员" style="width: 100%">
                  <el-option label="全部运营人员" value="all"/>
                  <el-option 
                    v-for="item in operatorOptions" 
                    :key="item.value" 
                    :label="item.label" 
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="ISKU负责人">
                <el-select v-model="taskForm.iskuOwner" placeholder="全部负责人" style="width: 100%">
                  <el-option label="全部负责人" value="all"/>
                  <el-option 
                    v-for="item in iskuOwnerOptions" 
                    :key="item.value" 
                    :label="item.label" 
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </div>
          </el-form>
        </el-card>
      </el-col>

      <!-- 右侧面板：指标设置 -->
      <el-col :span="16">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span class="title">指标设置</span>
            </div>
          </template>

          <!-- 统一指标设置 -->
          <div class="metric-section">
            <div class="section-title">监控指标</div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="指标">
                  <el-select v-model="taskForm.metric" placeholder="请选择指标" @change="handleMetricChange" style="width: 100%">
                    <el-option-group label="销售指标">
                      <el-option label="销售额" value="salesAmount"/>
                      <el-option label="销售数量" value="salesQuantity"/>
                      <el-option label="转化率" value="conversionRate"/>
                    </el-option-group>
                    <el-option-group label="库存指标">
                      <el-option label="周转天数" value="turnoverDays"/>
                      <el-option label="可售库存" value="availableStock"/>
                      <el-option label="在途库存" value="inTransitStock"/>
                    </el-option-group>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="对比方式">
                  <el-select v-model="taskForm.compareType" placeholder="请选择对比方式" @change="handleCompareTypeChange" style="width: 100%">
                    <el-option label="固定值" value="fixed"/>
                    <el-option label="环比" value="chain"/>
                    <el-option label="同比" value="year"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 目标设置 -->
            <div class="target-setting" v-if="taskForm.compareType">
              <el-row :gutter="20" v-if="taskForm.compareType === 'fixed'">
                <el-col :span="12">
                  <el-form-item label="目标值">
                    <el-input-number 
                      v-model="taskForm.targetValue" 
                      :min="0"
                      :precision="getMetricPrecision(taskForm.metric)"
                      :step="getMetricStep(taskForm.metric)"
                      style="width: 100%"
                    >
                      <template #append>{{ getMetricUnit(taskForm.metric) }}</template>
                    </el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
              
              <el-row :gutter="20" v-else>
                <el-col :span="12">
                  <el-form-item label="变化幅度">
                    <el-input-number 
                      v-model="taskForm.changeRate" 
                      :min="-100"
                      :max="1000"
                      :precision="2"
                      style="width: 100%"
                    >
                      <template #append>%</template>
                    </el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="完成周期">
                    <el-input-number 
                      v-model="taskForm.completionDays" 
                      :min="1"
                      :precision="0"
                      style="width: 100%"
                    >
                      <template #append>天</template>
                    </el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>

          <!-- 数据展示 -->
          <div class="data-panel">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="data-item">
                  <div class="data-label">当前值</div>
                  <div class="data-value">{{ taskForm.currentValue }}{{ getMetricUnit(taskForm.metric) }}</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="data-item">
                  <div class="data-label">对比值</div>
                  <div class="data-value">{{ taskForm.compareValue }}{{ getMetricUnit(taskForm.metric) }}</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="data-item">
                  <div class="data-label">变化幅度</div>
                  <div class="data-value" :class="{ 'up': taskForm.changeRate > 0, 'down': taskForm.changeRate < 0 }">
                    {{ taskForm.changeRate }}%
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>

          <!-- 分级指标设置 -->
          <div class="target-section">
            <div class="section-title">分级指标</div>
            <div v-for="(target, type) in taskForm.targets" :key="type" class="target-item">
              <div class="target-header">
                <span class="target-type">{{ targetTypeLabels[type] }}</span>
                <el-tag size="small" type="info">{{ getNotifyUsers(type).map(u => u.name).join(', ') }}</el-tag>
              </div>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="触发条件">
                    <el-select v-model="target.condition" placeholder="请选择触发条件" style="width: 100%">
                      <el-option
                        v-for="option in getConditionOptions"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="目标值">
                    <el-input-number
                      v-model="target.threshold"
                      :precision="getMetricPrecision(taskForm.metric)"
                      placeholder="请输入目标值"
                      style="width: calc(100% - 40px)"
                    />
                    <span class="unit">{{ getMetricUnit(taskForm.metric) }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>

          <div class="notify-strategy">
            <div class="section-title">通知策略</div>
            <div v-for="(strategy, index) in taskForm.notifyStrategies" :key="index" class="strategy-item">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item :label="'触发条件' + (index + 1)">
                    <el-select v-model="strategy.condition" style="width: 100%">
                      <el-option label="完成进度达到" value="progress"/>
                      <el-option label="剩余天数少于" value="remainingDays"/>
                      <el-option label="超出目标" value="exceedTarget"/>
                      <el-option label="低于目标" value="belowTarget"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="阈值">
                    <el-input-number 
                      v-model="strategy.threshold" 
                      :min="0"
                      :max="strategy.condition === 'progress' ? 100 : undefined"
                      style="width: 100%"
                    >
                      <template #append>{{ getStrategyUnit(strategy.condition) }}</template>
                    </el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="通知对象">
                    <el-select 
                      v-model="strategy.notifyTo" 
                      multiple 
                      collapse-tags 
                      collapse-tags-tooltip
                      style="width: 100%"
                    >
                      <el-option label="任务负责人" value="owner"/>
                      <el-option label="部门主管" value="manager"/>
                      <el-option label="运营人员" value="operator"/>
                      <el-option label="全部成员" value="all"/>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-button 
                type="danger" 
                link 
                icon="Delete"
                @click="removeStrategy(index)"
                class="remove-strategy"
              >删除策略</el-button>
            </div>
            <div class="add-strategy">
              <el-button 
                type="primary" 
                plain 
                icon="Plus"
                @click="addStrategy"
              >添加通知策略</el-button>
            </div>
          </div>

          <!-- 通知方式设置 -->
          <div class="notify-section">
            <div class="section-title">通知方式</div>
            <el-form-item label="通知方式">
              <el-checkbox-group v-model="taskForm.notifyTypes">
                <el-checkbox label="email">邮件通知</el-checkbox>
                <el-checkbox label="system">系统通知</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="通知频率">
              <el-select v-model="taskForm.notifyFrequency" placeholder="请选择" style="width: 100%">
                <el-option label="实时通知" value="realtime"/>
                <el-option label="每日通知" value="daily"/>
                <el-option label="每周通知" value="weekly"/>
              </el-select>
            </el-form-item>
          </div>

          
          <div class="target-section">
            <div class="section-title">分级指标</div>
            <div v-for="(target, type) in taskForm.targets" :key="type" class="target-item">
              <div class="target-header">
                <span class="target-type">{{ targetTypeLabels[type] }}</span>
                <el-tag size="small" type="info">{{ getNotifyUsers(type).map(u => u.name).join(', ') }}</el-tag>
              </div>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="触发条件">
                    <el-select v-model="target.condition" placeholder="请选择触发条件" style="width: 100%">
                      <el-option 
                        v-for="option in getConditionOptions" 
                        :key="option.value" 
                        :label="option.label" 
                        :value="option.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="目标值">
                    <el-input-number 
                      v-model="target.threshold" 
                      :precision="getMetricPrecision(taskForm.metric)"
                      placeholder="请输入目标值"
                      style="width: calc(100% - 40px)"
                    />
                    <span class="unit">{{ getMetricUnit(taskForm.metric) }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="action-buttons">
            <el-button type="primary" @click="submitForm">确定</el-button>
            <el-button @click="resetForm">重置</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { listAmzTurnover } from "@/api/amazon/amzTurnover";

// 模拟数据
const mskuOptions = ref([
  { msku: 'SKU001', productName: '测试商品1' },
  { msku: 'SKU002', productName: '测试商品2' }
]);

const currentUser = {
  id: 1,
  name: '张三'
};

const companyNotifyUsers = [
  { id: 1, name: '张三' },
  { id: 2, name: '总监' },
  { id: 3, name: '经理' }
];

const managerNotifyUsers = [
  { id: 1, name: '张三' },
  { id: 2, name: '主管' }
];

const targetTypeLabels = {
  company: '公司指标',
  manager: '主管指标',
  personal: '个人指标'
};

// 模拟数据 - 更多选项
const categoryOptions = ref([
  { value: 'cat1', label: '电子产品' },
  { value: 'cat2', label: '家居用品' },
  { value: 'cat3', label: '厨房用具' },
  { value: 'cat4', label: '户外运动' },
  { value: 'cat5', label: '服装鞋帽' }
]);

const groupOptions = ref([
  { value: 'group1', label: '重点商品' },
  { value: 'group2', label: '新品推广' },
  { value: 'group3', label: '清仓商品' },
  { value: 'group4', label: '季节性商品' }
]);

const operatorOptions = ref([
  { value: 'op1', label: '张三' },
  { value: 'op2', label: '李四' },
  { value: 'op3', label: '王五' },
  { value: 'op4', label: '赵六' }
]);

// 表单数据
const taskForm = reactive({
  remark: '',
  targetType: '',
  timeRange: 'last30days',
  customTimeRange: [],
  category: 'all',
  group: 'all',
  tag: 'all',
  operator: 'all',
  iskuOwner: 'all',
  iskuDev: 'all',
  skuFilter: '',
  notifyTypes: [],
  notifyFrequency: '',
  
  // 统一指标设置
  metric: '',
  compareType: 'fixed',
  comparePeriod: 30,
  currentValue: 100,
  compareValue: 120,
  changeRate: -16.67,

  // 分级指标设置
  targets: {
    company: {
      condition: 'decreaseOver',
      threshold: 20,
      notifyInterval: 7
    },
    manager: {
      condition: 'decreaseOver',
      threshold: 15,
      notifyInterval: 3
    },
    personal: {
      condition: 'decreaseOver',
      threshold: 10,
      notifyInterval: 1
    }
  },

  filter: {
    turnoverDays: {
      min: null,
      max: null
    },
    grossProfit: {
      min: null,
      max: null
    },
    salesAmount: {
      min: null,
      max: null
    }
  },

  targetValue: 0,
  completionDays: 30,
  notifyStrategies: [
    {
      condition: 'progress',
      threshold: 80,
      notifyTo: ['owner']
    }
  ],
  assignedTo: null,
});

// 当前选中的指标对象
const currentTarget = computed(() => {
  switch (taskForm.targetType) {
    case 'company':
      return taskForm.companyTarget;
    case 'manager':
      return taskForm.managerTarget;
    case 'personal':
      return taskForm.personalTarget;
    default:
      return null;
  }
});

// 获取通知对象
const getNotifyUsers = (type) => {
  const currentUser = { id: 1, name: '张三' };
  const manager = { id: 2, name: '主管' };
  const director = { id: 3, name: '总监' };

  switch (type) {
    case 'company':
      return [currentUser, manager, director];
    case 'manager':
      return [currentUser, manager];
    case 'personal':
      return [currentUser];
    default:
      return [];
  }
};

// 处理指标类型变更
const handleTargetTypeChange = () => {
  // 可以在这里处理指标类型切换时的逻辑
};

// 指标配置
const metricConfig = {
  salesAmount: {
    unit: '元',
    precision: 2,
    isPercentage: false
  },
  salesQuantity: {
    unit: '个',
    precision: 0,
    isPercentage: false
  },
  conversionRate: {
    unit: '%',
    precision: 2,
    isPercentage: true
  },
  turnoverDays: {
    unit: '天',
    precision: 1,
    isPercentage: false
  },
  availableStock: {
    unit: '个',
    precision: 0,
    isPercentage: false
  },
  inTransitStock: {
    unit: '个',
    precision: 0,
    isPercentage: false
  },
  grossProfitRate: {
    unit: '%',
    precision: 2,
    isPercentage: true
  }
};

// 获取指标单位
const getMetricUnit = (metric) => {
  return metricConfig[metric]?.unit || '';
};

// 获取指标精度
const getMetricPrecision = (metric) => {
  const precisions = {
    salesAmount: 2,
    turnoverDays: 1,
    grossProfit: 2,
    salesQuantity: 0,
    conversionRate: 2,
    availableStock: 0,
    inTransitStock: 0
  };
  return precisions[metric] || 0;
};

// 获取指标步进值
const getMetricStep = (metric) => {
  const steps = {
    salesAmount: 100,
    turnoverDays: 0.5,
    grossProfit: 0.1,
    salesQuantity: 1,
    conversionRate: 0.1,
    availableStock: 1,
    inTransitStock: 1
  };
  return steps[metric] || 1;
};

// 获取策略单位
const getStrategyUnit = (condition) => {
  const units = {
    progress: '%',
    remainingDays: '天',
    exceedTarget: '%',
    belowTarget: '%'
  };
  return units[condition] || '';
};

// 添加通知策略
const addStrategy = () => {
  taskForm.notifyStrategies.push({
    condition: 'progress',
    threshold: 0,
    notifyTo: []
  });
};

// 删除通知策略
const removeStrategy = (index) => {
  taskForm.notifyStrategies.splice(index, 1);
};

// 修改触发条件选项
const getConditionOptions = computed(() => {
  const isPercentage = isPercentageMetric(taskForm.metric);
  
  if (taskForm.compareType === 'fixed') {
    return [
      { label: '低于', value: 'lessThan' },
      { label: '高于', value: 'moreThan' },
      { label: '等于', value: 'equals' }
    ];
  } else {
    return [
      { label: '下降超过', value: 'decreaseOver' },
      { label: '上升超过', value: 'increaseOver' }
    ];
  }
});

// 判断是否为百分比指标
const isPercentageMetric = (metric) => {
  return metricConfig[metric]?.isPercentage ?? false;
};

// 修改handleMetricChange方法
const handleMetricChange = () => {
  // 模拟获取当前值和对比值
  const mockData = {
    salesAmount: { current: 10000, compare: 12000 },
    turnoverDays: { current: 45, compare: 40 },
    grossProfitRate: { current: 25, compare: 22 },
    salesQuantity: { current: 1000, compare: 800 },
    conversionRate: { current: 15.5, compare: 14.2 },
    availableStock: { current: 500, compare: 450 },
    inTransitStock: { current: 200, compare: 180 }
  };

  const data = mockData[taskForm.metric] || { current: 0, compare: 0 };
  taskForm.currentValue = data.current;
  taskForm.compareValue = data.compare;
  
  // 重置触发条件
  Object.values(taskForm.targets).forEach(target => {
    target.condition = getConditionOptions.value[0].value;
    target.threshold = null;
  });
  
  // 计算变化率
  const change = ((data.current - data.compare) / data.compare * 100).toFixed(2);
  taskForm.changeRate = Number(change);
};

// 处理对比方式变更
const handleCompareTypeChange = () => {
  // 根据对比方式获取不同的对比数据
  const mockCompareData = {
    fixed: { compare: 100 },
    chain: { compare: 120 },
    year: { compare: 90 }
  };

  const data = mockCompareData[taskForm.compareType];
  taskForm.compareValue = data.compare;
  
  // 重新计算变化率
  const change = ((taskForm.currentValue - data.compare) / data.compare * 100).toFixed(2);
  taskForm.changeRate = Number(change);
};

// 表单校验规则
const rules = {
  remark: [
    { required: true, message: '请输入备注信息', trigger: 'blur' }
  ],
  targetType: [
    { required: true, message: '请选择指标类型', trigger: 'change' }
  ],
  timeRange: [
    { required: true, message: '请选择时间范围', trigger: 'change' }
  ],
  category: [
    { required: true, message: '请选择类目', trigger: 'change' }
  ],
  group: [
    { required: true, message: '请选择分组', trigger: 'change' }
  ],
  tag: [
    { required: true, message: '请选择标签', trigger: 'change' }
  ],
  operator: [
    { required: true, message: '请选择运营人员', trigger: 'change' }
  ],
  iskuOwner: [
    { required: true, message: '请选择ISKU负责人', trigger: 'change' }
  ],
  iskuDev: [
    { required: true, message: '请选择ISKU开发人', trigger: 'change' }
  ]
};

const taskFormRef = ref(null);

// 提交表单
const submitForm = async () => {
  if (!taskFormRef.value) return;
  
  await taskFormRef.value.validate((valid, fields) => {
    if (valid) {
      console.log('submit!', taskForm);
      // TODO: 调用保存接口
    } else {
      console.log('error submit!', fields);
    }
  });
};

// 重置表单
const resetForm = () => {
  if (!taskFormRef.value) return;
  taskFormRef.value.resetFields();
};
</script>

<style scoped lang="scss">
.app-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.metric-section {
  margin-bottom: 20px;
}

.target-item {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.change-rate {
  font-weight: bold;
  &.up {
    color: #f56c6c;
  }
  &.down {
    color: #67c23a;
  }
}

.target-title {
  margin: 0 0 20px 0;
  font-size: 16px;
  color: #409EFF;
  border-left: 3px solid #409EFF;
  padding-left: 10px;
}

.action-buttons {
  text-align: center;
  margin-top: 30px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin: 20px 0 15px;
  padding-left: 10px;
  border-left: 3px solid #409EFF;
}

.filter-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #EBEEF5;
}

.data-panel {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 4px;
  margin: 20px 0;
}

.data-item {
  text-align: center;
}

.data-label {
  color: #909399;
  font-size: 14px;
  margin-bottom: 8px;
}

.data-value {
  font-size: 24px;
  font-weight: bold;
  &.up { color: #f56c6c; }
  &.down { color: #67c23a; }
}

.target-item {
  background-color: #f8f9fa;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 4px;
}

.target-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.target-type {
  font-weight: bold;
  color: #409EFF;
}

.unit {
  margin-left: 5px;
}

.notify-section {
  margin-top: 30px;
}

.advanced-filter {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  margin: 15px 0;

  .filter-title {
    font-size: 14px;
    color: #606266;
    margin-bottom: 15px;
    font-weight: bold;
  }
}

.text-center {
  text-align: center;
  line-height: 32px;
}

.separator {
  color: #909399;
}

// 调整输入框组的样式
:deep(.el-input-number) {
  .el-input__wrapper {
    padding: 0 8px;
  }
}

.strategy-item {
  position: relative;
  padding: 20px;
  margin-bottom: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
  
  .remove-strategy {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}

.add-strategy {
  text-align: center;
  margin-top: 20px;
}

.assign-section {
  margin-top: 30px;
}
</style>