<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import { Bell, ArrowDown, User, List, Loading, Select, Warning, VideoPause } from '@element-plus/icons-vue';
import DictTag from '@/components/DictTag/index.vue';

const router = useRouter();
const loading = ref(false);
const total = ref(0);
const showSearch = ref(true);
const taskList = ref([]);

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  taskName: undefined,
  metricType: undefined,
  status: undefined,
  targetLevel: undefined
});

// 字典数据
const statusOptions = [
  { label: '进行中', value: 'running', type: 'primary' },
  { label: '已完成', value: 'completed', type: 'success' },
  { label: '已超时', value: 'overtime', type: 'danger' },
  { label: '已暂停', value: 'paused', type: 'info' }
];

const metricTypeOptions = [
  { label: '周转天数', value: 'turnoverDays', type: 'info' },
  { label: '销售额', value: 'salesAmount', type: 'success' },
  { label: '毛利率', value: 'grossProfit', type: 'warning' }
];

// 添加指标级别选项
const targetLevelOptions = [
  { label: '公司指标', value: 'company', type: 'danger' },
  { label: '主管指标', value: 'manager', type: 'warning' },
  { label: '个人指标', value: 'personal', type: 'info' },
  { label: '系统指派', value: 'system', type: 'info' }
];

// 获取指标单位
const getMetricUnit = (type) => {
  const units = {
    turnoverDays: '天',
    salesAmount: '元',
    grossProfit: '%'
  };
  return units[type] || '';
};

// 计算进度
const getProgress = (row) => {
  const { targetValue, currentValue, metricType } = row;
  if (metricType === 'turnoverDays') {
    // 周转天数是越低越好
    return Math.min(100, Math.max(0, (1 - currentValue / targetValue) * 100));
  }
  return Math.min(100, Math.max(0, (currentValue / targetValue) * 100));
};

// 获取进度状态
const getProgressStatus = (progress) => {
  if (progress >= 100) return 'success';
  if (progress >= 80) return 'warning';
  return 'exception';
};

// 格式化剩余时间
const formatRemainingTime = (days) => {
  if (days < 0) return '已超时';
  if (days === 0) return '今天到期';
  return `剩余 ${days} 天`;
};

// 获取时间标签类型
const getTimeTagType = (days) => {
  if (days < 0) return 'danger';
  if (days <= 3) return 'warning';
  return 'info';
};

// 获取通知提示内容
const getNotifyTooltip = (notifications) => {
  if (!notifications?.length) return '暂无通知';
  return notifications.map(n => `${n.time}: ${n.content}`).join('\n');
};

// 获取通知徽章类型
const getNotifyType = (count) => {
  if (count > 5) return 'danger';
  if (count > 0) return 'warning';
  return 'info';
};

// 获取值的样式类
const getValueClass = (row) => {
  const { currentValue, targetValue, metricType } = row;
  if (metricType === 'turnoverDays') {
    return currentValue > targetValue ? 'text-danger' : 'text-success';
  }
  return currentValue < targetValue ? 'text-danger' : 'text-success';
};

// 获取列表数据
const getList = () => {
  loading.value = true;
  setTimeout(() => {
    taskList.value = [
      {
        id: 1,
        taskName: 'XXX-Asku-任务',
        metricType: 'turnoverDays',
        remark: '公司指派任务',
        targetLevel: 'company',
        finishTime: '7天',
        sku: 'sku-A',
        targetValue: 30,
        currentValue: 45,
        status: 'running',
        remainingDays: 5,
        notifyCount: 3,
        assignees: [
          { id: 1, name: '张三', role: '销售主管', avatar: '' },
          { id: 2, name: '李四', role: '销售员', avatar: '' },
          { id: 3, name: '王五', role: '库存管理员', avatar: '' }
        ],
        completedTargets: [
          { level: 'personal', name: '周转天数', progress: 85 },
          { level: 'personal', name: '利润率指标', progress: 92 },
          { level: 'manager', name: '销售额指标', progress: 78 },
          { level: 'company', name: '销量', progress: 65 }
        ],
        notifications: [
          { time: '2024-01-20', content: '周转天数超过40天' },
          { time: '2024-01-19', content: '周转天数超过42天' }
        ]
      },
      {
        id: 2,
        taskName: 'XXX-Bsku-任务',
        metricType: 'salesAmount',
        targetLevel: 'manager',
        finishTime: '14天',
        sku: 'sku-B',
        targetValue: 100000,
        currentValue: 85000,
        status: 'running',
        remainingDays: 10,
        notifyCount: 1,
        assignees: [
          { id: 4, name: '赵六', role: '销售主管', avatar: '' },
          { id: 5, name: '谢七', role: '销售员', avatar: '' }
        ],
        completedTargets: [
          { level: 'personal', name: '利润', progress: 95 },
          { level: 'manager', name: '销售额', progress: 85 }
        ],
        notifications: [
          { time: '2024-01-20', content: '销售额未达标' }
        ]
      },
      {
        id: 3,
        taskName: 'XXX-Csku-任务',
        metricType: 'grossProfit',
        targetLevel: 'personal',
        finishTime: '14天',
        sku: 'sku-C',
        targetValue: 25,
        currentValue: 18.5,
        status: 'overtime',
        remainingDays: -2,
        notifyCount: 6,
        assignees: [
          { id: 6, name: '赵八', role: '销售员', avatar: '' }
        ],
        completedTargets: [
          { level: 'personal', name: '采购成本', progress: 74 }
        ],
        notifications: [
          { time: '2024-01-20', content: '毛利率低于20%' },
          { time: '2024-01-19', content: '毛利率持续下降' }
        ]
      },
      {
        id: 4,
        taskName: 'XXX-Dsku-系统任务',
        metricType: 'turnoverDays',
        remark: '系统自动派发任务',
        targetLevel: 'system',
        finishTime: '14天',
        sku: 'sku-D',
        targetValue: 35,
        currentValue: 28,
        status: 'completed',
        remainingDays: 15,
        notifyCount: 0,
        assignees: [
          { id: 7, name: '周九', role: '库存主管', avatar: '' },
          { id: 8, name: '吴十', role: '库存员', avatar: '' },
          { id: 9, name: '郑十一', role: '采购员', avatar: '' }
        ],
        completedTargets: [
          { level: 'company', name: '周转天数', progress: 100 },
          { level: 'manager', name: '利润', progress: 100 },
          { level: 'personal', name: 'GMV', progress: 100 },
          { level: 'personal', name: '销量', progress: 100 }
        ],
        notifications: []
      },
      {
        id: 5,
        taskName: '季度销售目标',
        metricType: 'salesAmount',
        targetLevel: 'company',
        targetValue: 500000,
        currentValue: 420000,
        status: 'running',
        remainingDays: 20,
        notifyCount: 2,
        assignees: [
          { id: 10, name: '马总', role: '销售总监', avatar: '' },
          { id: 11, name: '刘经理', role: '销售经理', avatar: '' },
          { id: 12, name: '陈主管', role: '销售主管', avatar: '' },
          { id: 13, name: '杨员工', role: '销售员', avatar: '' }
        ],
        completedTargets: [
          { level: 'company', name: '公司', progress: 84 },
          { level: 'manager', name: '马总', progress: 88 },
          { level: 'manager', name: '刘经理', progress: 82 },
          { level: 'personal', name: '杨员工', progress: 95 }
        ],
        notifications: [
          { time: '2024-01-21', content: '销售进度略低于预期' },
          { time: '2024-01-18', content: '部分地区销售未达标' }
        ]
      },
      {
        id: 6,
        taskName: '高毛利产品推广',
        metricType: 'grossProfit',
        targetLevel: 'manager',
        targetValue: 35,
        currentValue: 32,
        status: 'running',
        remainingDays: 8,
        notifyCount: 1,
        assignees: [
          { id: 14, name: '黄经理', role: '产品经理', avatar: '' },
          { id: 15, name: '林专员', role: '产品专员', avatar: '' },
          { id: 16, name: '张销售', role: '销售员', avatar: '' }
        ],
        completedTargets: [
          { level: 'manager', name: '黄经理', progress: 91 },
          { level: 'personal', name: '林专员', progress: 88 },
          { level: 'personal', name: '张销售', progress: 94 }
        ],
        notifications: [
          { time: '2024-01-22', content: '部分产品毛利率波动' }
        ]
      },
      {
        id: 7,
        taskName: '滞销品清理',
        metricType: 'turnoverDays',
        targetLevel: 'personal',
        targetValue: 60,
        currentValue: 75,
        status: 'overtime',
        remainingDays: -5,
        notifyCount: 4,
        assignees: [
          { id: 17, name: '王库管', role: '库存管理员', avatar: '' }
        ],
        completedTargets: [
          { level: 'personal', name: '王库管', progress: 65 }
        ],
        notifications: [
          { time: '2024-01-22', content: '清理进度不达标' },
          { time: '2024-01-21', content: '库存积压严重' },
          { time: '2024-01-20', content: '需要加快处理' },
          { time: '2024-01-19', content: '首次预警提醒' }
        ]
      },
      {
        id: 8,
        taskName: '新品销售提升',
        metricType: 'salesAmount',
        targetLevel: 'personal',
        targetValue: 50000,
        currentValue: 48000,
        status: 'running',
        remainingDays: 3,
        notifyCount: 0,
        assignees: [
          { id: 18, name: '陈销售', role: '销售专员', avatar: '' }
        ],
        completedTargets: [
          { level: 'personal', name: '陈销售', progress: 96 }
        ],
        notifications: []
      },
      {
        id: 9,
        taskName: '品类毛利优化',
        metricType: 'grossProfit',
        targetLevel: 'manager',
        targetValue: 30,
        currentValue: 31.5,
        status: 'completed',
        remainingDays: 12,
        notifyCount: 0,
        assignees: [
          { id: 19, name: '赵主管', role: '品类主管', avatar: '' },
          { id: 20, name: '钱专员', role: '品类专员', avatar: '' }
        ],
        completedTargets: [
          { level: 'manager', name: '赵主管', progress: 100 },
          { level: 'personal', name: '钱专员', progress: 105 }
        ],
        notifications: []
      },
      {
        id: 10,
        taskName: '老品库存优化',
        metricType: 'turnoverDays',
        targetLevel: 'company',
        targetValue: 40,
        currentValue: 52,
        status: 'overtime',
        remainingDays: -8,
        notifyCount: 5,
        assignees: [
          { id: 21, name: '孙总监', role: '运营总监', avatar: '' },
          { id: 22, name: '李经理', role: '库存经理', avatar: '' },
          { id: 23, name: '周专员', role: '库存专员', avatar: '' }
        ],
        completedTargets: [
          { level: 'company', name: '公司', progress: 62 },
          { level: 'manager', name: '孙总监', progress: 58 },
          { level: 'manager', name: '李经理', progress: 65 },
          { level: 'personal', name: '周专员', progress: 70 }
        ],
        notifications: [
          { time: '2024-01-22', content: '库存周转严重超标' },
          { time: '2024-01-21', content: '需要加快清理节奏' },
          { time: '2024-01-20', content: '部分SKU库存积压' },
          { time: '2024-01-19', content: '库存预警' },
          { time: '2024-01-18', content: '首次预警提醒' }
        ]
      },
      {
        id: 11,
        taskName: '爆品销售冲刺',
        metricType: 'salesAmount',
        targetLevel: 'company',
        targetValue: 1000000,
        currentValue: 920000,
        status: 'running',
        remainingDays: 5,
        notifyCount: 2,
        assignees: [
          { id: 24, name: '王总', role: '总经理', avatar: '' },
          { id: 25, name: '张总监', role: '销售总监', avatar: '' },
          { id: 26, name: '刘经理', role: '销售经理', avatar: '' },
          { id: 27, name: '吴主管', role: '销售主管', avatar: '' },
          { id: 28, name: '郑销售', role: '销售专员', avatar: '' }
        ],
        completedTargets: [
          { level: 'company', name: '公司', progress: 92 },
          { level: 'manager', name: '张总监', progress: 95 },
          { level: 'manager', name: '刘经理', progress: 88 },
          { level: 'personal', name: '郑销售', progress: 98 }
        ],
        notifications: [
          { time: '2024-01-22', content: '距离目标还差8%' },
          { time: '2024-01-20', content: '部分SKU库存不足' }
        ]
      },
      {
        id: 12,
        taskName: '新品毛利达标',
        metricType: 'grossProfit',
        targetLevel: 'manager',
        targetValue: 40,
        currentValue: 35.8,
        status: 'paused',
        remainingDays: 15,
        notifyCount: 1,
        assignees: [
          { id: 29, name: '陈经理', role: '产品经理', avatar: '' },
          { id: 30, name: '林专员', role: '产品专员', avatar: '' }
        ],
        completedTargets: [
          { level: 'manager', name: '陈经理', progress: 89.5 },
          { level: 'personal', name: '林专员', progress: 92 }
        ],
        notifications: [
          { time: '2024-01-22', content: '任务暂时暂停' }
        ]
      }
    ];
    total.value = taskList.value.length;
    loading.value = false;
  }, 500);
};

// 处理查询
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

// 重置查询
const resetQuery = () => {
  queryParams.taskName = undefined;
  queryParams.metricType = undefined;
  queryParams.status = undefined;
  queryParams.targetLevel = undefined;
  handleQuery();
};

// 新增任务
const handleAdd = () => {
  router.push('/amzTurnover/task');
};

// 修改任务
const handleUpdate = (row) => {
  router.push(`/amzTurnover/task?id=${row.id}`);
};

// 删除任务
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `是否确认删除任务"${row.taskName}"？`,
    "警告",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  ).then(() => {
    // TODO: 调用删除接口
    ElMessage.success("删除成功");
    getList();
  });
};

// 暂停/恢复任务
const handlePause = (row) => {
  const action = row.status === 'paused' ? '恢复' : '暂停';
  ElMessageBox.confirm(
    `是否确认${action}任务"${row.taskName}"？`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  ).then(() => {
    // TODO: 调用暂停/恢复接口
    row.status = row.status === 'paused' ? 'running' : 'paused';
    ElMessage.success(`${action}成功`);
  });
};

// 通知设置
const handleNotifySettings = (row) => {
  router.push(`/amzTurnover/task?id=${row.id}&tab=notify`);
};

// 格式化指派人员显示
const formatAssignees = (assignees) => {
  if (!assignees?.length) return '未指派';
  return assignees.map(a => `${a.name}(${a.role})`).join('\n');
};

// 获取状态标签类型
const getStatusType = (status) => {
  const types = {
    running: 'primary',
    completed: 'success',
    overtime: 'danger',
    paused: 'info'
  };
  return types[status] || 'info';
};

// 获取状态标签效果
const getStatusEffect = (status) => {
  return status === 'running' ? 'light' : 'plain';
};

// 获取状态标签文本
const getStatusLabel = (status) => {
  const labels = {
    running: '进行中',
    completed: '已完成',
    overtime: '已超时',
    paused: '已暂停'
  };
  return labels[status] || status;
};

onMounted(() => {
  getList();
});
</script>

<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="SKU" prop="taskName">
        <el-input
          v-model="queryParams.taskName"
          placeholder="请输入SKU"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="指标类型" prop="metricType">
        <el-select v-model="queryParams.metricType" placeholder="请选择指标类型" clearable style="width: 200px">
          <el-option
            v-for="dict in metricTypeOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 200px">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="指标级别" prop="targetLevel">
        <el-select v-model="queryParams.targetLevel" placeholder="请选择指标级别" clearable style="width: 200px">
          <el-option
            v-for="dict in targetLevelOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮区域 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
        >新增任务</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"/>
    </el-row>

    <!-- 任务列表 -->
    <el-table
      v-loading="loading"
      :data="taskList"
      border
      height="600"
    >
      <el-table-column label="任务名称" align="center" prop="taskName" min-width="150" fixed="left">
        <template #default="scope">
          <el-button type="text" @click="handleDetail(scope.row)">{{ scope.row.taskName }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="SKU" align="center" prop="sku" min-width="100"></el-table-column>
      <el-table-column label="指标类型" align="center" prop="metricType" min-width="100">
        <template #default="scope">
          <dict-tag :options="metricTypeOptions" :value="scope.row.metricType"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" min-width="150"></el-table-column>
      <el-table-column label="目标值/当前值" align="center" min-width="150">
        <template #default="scope">
          <div>
            <span>{{ scope.row.targetValue }}{{ getMetricUnit(scope.row.metricType) }}</span>
            <span style="margin: 0 4px">/</span>
            <span :class="getValueClass(scope.row)">
              {{ scope.row.currentValue }}{{ getMetricUnit(scope.row.metricType) }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="完成进度" align="center" width="200">
        <template #default="scope">
          <el-progress
            :percentage="getProgress(scope.row)"
            :status="getProgressStatus(scope.row.currentValue / scope.row.targetValue * 100)"
          />
        </template>
      </el-table-column>
      <el-table-column label="完成时间" align="center" prop="finishTime" min-width="150"></el-table-column>
      <el-table-column label="剩余时间" align="center" min-width="100">
        <template #default="scope">
          <el-tag :type="getTimeTagType(scope.row.remainingDays)" size="small">
            {{ formatRemainingTime(scope.row.remainingDays) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="通知情况" align="center" prop="notifyCount">
        <template #default="scope">
          <el-popover
            placement="right"
            :height="300"
            :width="300"
            trigger="hover"
          >
            <template #reference>
              <el-badge :value="scope.row.notifyCount" :type="getNotifyType(scope.row.notifyCount)">
                <el-icon><Bell /></el-icon>
              </el-badge>
            </template>
            <template #default>
              <div class="notify-history">
                <div class="notify-header">
                  <span class="title">通知历史</span>
                  <el-tag size="small" :type="getNotifyType(scope.row.notifyCount)">
                    共 {{ scope.row.notifyCount }} 条
                  </el-tag>
                </div>
                <el-divider />
                <div v-if="scope.row.notifications.length" class="notify-list">
                  <div v-for="(notify, index) in scope.row.notifications"
                    :key="index"
                    class="notify-item"
                  >
                    <div class="notify-time">{{ notify.time }}</div>
                    <div class="notify-content">{{ notify.content }}</div>
                  </div>
                </div>
                <div v-else class="notify-empty">
                  暂无通知记录
                </div>
              </div>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="指标级别" align="center" prop="targetLevel" min-width="100">
        <template #default="scope">
          <dict-tag :options="targetLevelOptions" :value="scope.row.targetLevel"/>
        </template>
      </el-table-column>
      <el-table-column label="任务指派" align="center" min-width="150">
        <template #default="scope">
          <el-popover
            placement="top"
            :width="200"
            trigger="hover"
          >
            <template #reference>
              <div class="assignees-wrapper">
                <div class="avatar-group">
                  <el-avatar
                    v-for="(assignee, index) in scope.row.assignees.slice(0, 3)"
                    :key="assignee.id"
                    :size="30"
                    :class="['assignee-avatar', `avatar-${index}`]"
                  >
                    {{ assignee.name.charAt(0) }}
                  </el-avatar>
                </div>
                <el-tag
                  v-if="scope.row.assignees.length > 3"
                  size="small"
                  type="info"
                  class="more-tag"
                >
                  +{{ scope.row.assignees.length - 3 }}
                </el-tag>
              </div>
            </template>
            <div class="assignee-list">
              <div v-for="assignee in scope.row.assignees" :key="assignee.id" class="assignee-item">
                <el-avatar :size="24">{{ assignee.name.charAt(0) }}</el-avatar>
                <span class="assignee-name">{{ assignee.name }}</span>
                <span class="assignee-role">{{ assignee.role }}</span>
              </div>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="完成情况" align="center" min-width="200">
        <template #default="scope">
          <div class="progress-list">
            <div v-for="target in scope.row.completedTargets" :key="target.level" class="progress-item">
              <span class="progress-label">{{ target.name }}</span>
              <el-progress
                :percentage="target.progress"
                :status="getProgressStatus(target.progress)"
                :stroke-width="8"
                :text-inside="true"
              />
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <el-tag
            :type="getStatusType(scope.row.status)"
            :effect="getStatusEffect(scope.row.status)"
            class="status-tag"
          >
            <el-icon class="status-icon" v-if="scope.row.status === 'running'"><Loading class="is-loading" /></el-icon>
            <el-icon class="status-icon" v-else-if="scope.row.status === 'completed'"><Select /></el-icon>
            <el-icon class="status-icon" v-else-if="scope.row.status === 'overtime'"><Warning /></el-icon>
            <el-icon class="status-icon" v-else-if="scope.row.status === 'paused'"><VideoPause /></el-icon>
            {{ getStatusLabel(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['amazon:amzTurnover:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['amazon:amzTurnover:remove']"
          >删除</el-button>
          <el-dropdown>
            <el-button type="text">
              更多<el-icon><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handlePause(scope.row)">
                  {{ scope.row.status === 'paused' ? '恢复' : '暂停' }}
                </el-dropdown-item>
                <el-dropdown-item @click="handleNotifySettings(scope.row)">通知设置</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<style scoped lang="scss">
.text-danger {
  color: #f56c6c;
}

.text-success {
  color: #67c23a;
}

.mb8 {
  margin-bottom: 8px;
}

:deep(.el-badge__content) {
  z-index: 1;
}

// 添加表格hover效果
:deep(.el-table__row) {
  &:hover {
    background-color: #f5f7fa;
  }
}

// 优化通知图标样式
.el-icon {
  font-size: 18px;
  color: #909399;
}

.assignees-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  .avatar-group {
    display: flex;
    align-items: center;
  }
}

.assignee-avatar {
  background-color: var(--el-color-primary);
  border: 2px solid #fff;
  cursor: pointer;
  transition: all 0.3s;

  &.avatar-0 { z-index: 3; margin-right: -10px; }
  &.avatar-1 { z-index: 2; margin-right: -10px; }
  &.avatar-2 { z-index: 1; }

  &:hover {
    transform: translateY(-2px);
  }
}

.more-tag {
  margin-left: 8px;
  height: 22px;
  line-height: 20px;
  padding: 0 6px;
}

.assignee-list {
  .assignee-item {
    display: flex;
    align-items: center;
    padding: 4px 0;
    
    .assignee-name {
      margin: 0 8px;
      font-weight: bold;
    }
    
    .assignee-role {
      color: #909399;
      font-size: 12px;
    }
  }
}

.progress-list {
  padding: 4px;
  
  .progress-item {
    margin: 8px 0;
    
    .progress-label {
      display: inline-block;
      width: 60px;
      text-align: right;
      margin-right: 8px;
      font-size: 12px;
      color: #606266;
    }
  }
}

// 通知历史样式
.notify-history {
  .notify-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .title {
      font-weight: bold;
      font-size: 14px;
    }
  }
  
  .notify-list {
    max-height: 300px;
    overflow-y: auto;
    
    .notify-item {
      padding: 8px 0;
      border-bottom: 1px solid #ebeef5;
      
      &:last-child {
        border-bottom: none;
      }
      
      .notify-time {
        font-size: 12px;
        color: #909399;
        margin-bottom: 4px;
      }
      
      .notify-content {
        color: #303133;
        line-height: 1.4;
      }
    }
  }
  
  .notify-empty {
    text-align: center;
    color: #909399;
    padding: 20px 0;
  }
}

// 状态标签样式
.status-tag {
  display: inline-flex;
  align-items: center;
  padding: 0 10px;
  height: 24px;
  
  .status-icon {
    margin-right: 4px;
    font-size: 14px;
  } 
  
  &.el-tag--primary {
    .is-loading {
      animation: rotating 2s linear infinite;
    }
  }
}

@keyframes rotating {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>