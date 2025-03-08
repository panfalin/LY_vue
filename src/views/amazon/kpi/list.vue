<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="考核人">
            <el-select v-model="queryParams.salesPerson" placeholder="请选择考核人" clearable style="width: 100%">
              <el-option v-for="item in salesPersonOptions" :key="item" :label="item" :value="item"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right">
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-col>
      </el-row>
    </el-form>

    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd">新增考核人</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport">导出</el-button>
      </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-table
        v-loading="loading"
        :data="kpiList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="员工姓名" align="center" prop="name"/>
      <el-table-column label="考核项" align="center">
        <template #default="scope">
          <el-table :data="scope.row.targets" style="width: 100%">
            <el-table-column label="考核项名称" prop="name"/>
            <el-table-column label="权重" prop="weight"/>
            <el-table-column label="得分" prop="score"/>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="总得分" align="center" prop="totalScore"/>
      <el-table-column label="操作" fixed="right" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
                v-model:limit="queryParams.pageSize" @pagination="getList"/>

    <!-- 新增/修改弹窗 -->
    <el-dialog :title="title" v-model="open" width="60%" append-to-body class="kpi-dialog">
      <el-form :model="form" ref="kpiFormRef" :rules="rules" label-width="100px">
        <!-- 部门标签页移到这里 -->
        <el-tabs v-model="activeDepartment" @tab-click="handleDepartmentChange">
          <el-tab-pane label="标准开发" name="standard">
          </el-tab-pane>
          <el-tab-pane label="非标业务" name="nonStandard">
          </el-tab-pane>
          <el-tab-pane label="非标准开发" name="nonStandardDev">
          </el-tab-pane>
          <el-tab-pane label="标准件" name="standardParts">
          </el-tab-pane>
          <el-tab-pane label="美工" name="design">
          </el-tab-pane>
        </el-tabs>

        <el-form-item label="考核人姓名" prop="name">
          <el-select v-model="form.name" placeholder="请选择考核人" style="width: 50%">
            <el-option
                v-for="item in departmentStaff[activeDepartment]"
                :key="item"
                :label="item"
                :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="考核项" prop="targets">
          <div class="target-selection">
            <!-- 添加全选按钮 -->
            <div class="checkbox-header">
              <el-checkbox
                  v-model="checkAll"
                  :indeterminate="isIndeterminate"
                  @change="handleCheckAllChange"
              >
                全选
              </el-checkbox>
            </div>
            <el-checkbox-group v-model="selectedTargets" @change="handleTargetSelect">
              <el-checkbox
                  v-for="item in departmentTargets[activeDepartment]"
                  :key="item.name"
                  :label="item.name"
              >
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </div>

          <!-- 选中的考核项表格 -->
          <el-table
              :data="form.targets"
              border
              style="width: 100%"
              class="target-table"
          >
            <el-table-column label="考核项" prop="name" min-width="120"/>
            <el-table-column label="当前值" min-width="120">
              <template #default="scope">
                <span>{{ scope.row.currValue }}</span>
              </template>
            </el-table-column>
            <el-table-column label="目标值" min-width="120">
              <template #default="scope">
                <el-input
                    v-model="scope.row.targetValue"
                    :min="0"
                    :precision="scope.row.name.includes('率') ? 1 : 0"
                    :step="scope.row.name.includes('率') ? 0.1 : 1"
                    controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column label="权重(%)" min-width="120">
              <template #default="scope">
                <el-input-number
                    v-model="scope.row.weight"
                    :min="0"
                    :max="100"
                    :precision="0"
                    controls-position="right"
                    @change="validateTotalWeight"
                />
              </template>
            </el-table-column>
            <el-table-column label="计算方式" min-width="120">
              <template #default="scope">
                <el-select
                    v-model="scope.row.calcType"
                    placeholder="请选择计算方式"
                >
                  <el-option
                      v-for="item in calcOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
          </el-table>

          <div class="weight-info" style="margin-top: 5px">
            <el-alert
                :type="isWeightValid ? 'success' : 'warning'"
                :title="`当前总权重: ${totalWeight}%`"
                :description="!isWeightValid ? '总权重必须等于100%' : '权重设置正确'"
                show-icon
                :closable="false"
            />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm" :disabled="!isWeightValid">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="KpiList">
import {ref, reactive, computed} from 'vue'
import {getCurrentInstance} from 'vue'
import router from "@/router/index.js";
import {useRoute} from "vue-router";
import Template from "@/views/aliexpress/template/index.vue";

const route = useRoute();
const {proxy} = getCurrentInstance()

// 基础数据
const loading = ref(false)
const open = ref(false)
const title = ref('')
const total = ref(0)
const single = ref(true)
const showSearch = ref(true)

// 查询参数
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  salesPerson: undefined
})

// 可选的考核项列表
const availableTargets = ref([
  {
    name: '产品开发效能',
    currValue: 20,
    targetValue: 50,
    defaultWeight: 20,
  },
  {
    name: '开发利润增长率',
    currValue: 1.2,
    targetValue: 1.5,
    defaultWeight: 5,
  },
  {
    name: '新品优化抽查',
    currValue: 0,
    targetValue: 1,
    defaultWeight: 20,
  },
  {
    name: '当月产品重塑率',
    currValue: 0.3,
    targetValue: 0.5,
    defaultWeight: 20,
  },
  {
    name: '供应商开发数量',
    currValue: 2,
    targetValue: 3,
    defaultWeight: 3,
  },
  {
    name: '工作态度',
    currValue: 0,
    targetValue: null,
    defaultWeight: 10,
  }
])

// 已选择的考核项
const selectedTargets = ref([])

// 表单数据
const form = reactive({
  name: '',
  targets: []
})

// 校验规则
const rules = {
  name: [{required: true, message: '请选择考核人', trigger: 'change'}],
  targets: [{required: true, message: '请至少选择一个考核项', trigger: 'change'}]
}

// 计算总权重
const totalWeight = computed(() => {
  return form.targets.reduce((sum, target) => sum + (Number(target.weight) || 0), 0)
})

// 判断权重是否有效
const isWeightValid = computed(() => {
  return totalWeight.value === 100
})

// 考核人列表数据
const kpiList = ref([])

const calcOptions = [
  {
    value: '自动计算',
    label: '自动计算',
  },
  {
    value: '自定义输入',
    label: '自定义输入',
  }
]

// 添加部门相关的数据
const activeDepartment = ref('standard')

// 各部门的考核项配置
const departmentTargets = {
  standard: [
    {
      name: '产品开发效能',
      currValue: 20,
      targetValue: 50,
      defaultWeight: 20,
    },
    {
      name: '供应商管理',
      currValue: 1.2,
      targetValue: 1.5,
      defaultWeight: 20,
    },
    {
      name: '合规与风险管理',
      currValue: 0,
      targetValue: 1,
      defaultWeight: 20,
    },
    {
      name: '文档与流程管理',
      currValue: 0,
      targetValue: 1,
      defaultWeight: 20,
    },
    {
      name: '各部门协作',
      currValue: 0,
      targetValue: 1,
      defaultWeight: 20,
    },
    {
      name: '个人出勤',
      currValue: 0,
      targetValue: 1,
      defaultWeight: 20,
    }
  ],
  nonStandard: [
    {
      name: '销售与转化',
      currValue: 10,
      targetValue: 15,
      defaultWeight: 30,
    },
    {
      name: '动销率',
      currValue: 4.2,
      targetValue: 4.5,
      defaultWeight: 30,
    },
    {
      name: '销售利润率',
      currValue: 4.2,
      targetValue: 4.5,
      defaultWeight: 30,
    },
    {
      name: '供应链协同',
      currValue: 4.2,
      targetValue: 4.5,
      defaultWeight: 30,
    },
    {
      name: '广告指标',
      currValue: 4.2,
      targetValue: 4.5,
      defaultWeight: 30,
    },
    {
      name: '工作态度',
      currValue: 4.2,
      targetValue: 4.5,
      defaultWeight: 30,
    }
  ],
  nonStandardDev: [
    {
      name: '产品开发成效',
      currValue: 30,
      targetValue: 25,
      defaultWeight: 25,
    },
    {
      name: '开发周期',
      currValue: 90,
      targetValue: 95,
      defaultWeight: 25,
    },
    {
      name: '跨部门协作',
      currValue: 90,
      targetValue: 95,
      defaultWeight: 25,
    },
    {
      name: '异常处理',
      currValue: 90,
      targetValue: 95,
      defaultWeight: 25,
    },
    {
      name: '合规与风险管理',
      currValue: 90,
      targetValue: 95,
      defaultWeight: 25,
    },
    {
      name: '工作态度',
      currValue: 90,
      targetValue: 95,
      defaultWeight: 25,
    },
    {
      name: '个人出勤',
      currValue: 90,
      targetValue: 95,
      defaultWeight: 25,
    },
  ],
  standardParts: [
    {
      name: 'GMV',
      currValue: 85,
      targetValue: 90,
      defaultWeight: 30,
    },
    {
      name: 'Profit',
      currValue: 95,
      targetValue: 98,
      defaultWeight: 30,
    },
    {
      name: '老品库存周转天数',
      currValue: 95,
      targetValue: 98,
      defaultWeight: 30,
    },
    {
      name: '老品动销率',
      currValue: 95,
      targetValue: 98,
      defaultWeight: 30,
    },
    {
      name: '新品动销率',
      currValue: 95,
      targetValue: 98,
      defaultWeight: 30,
    },
    {
      name: '清仓率',
      currValue: 95,
      targetValue: 98,
      defaultWeight: 30,
    },
    {
      name: 'Profit Rate',
      currValue: 95,
      targetValue: 98,
      defaultWeight: 30,
    },
    {
      name: '资金利用率',
      currValue: 95,
      targetValue: 98,
      defaultWeight: 30,
    },
    {
      name: '广告占比',
      currValue: 95,
      targetValue: 98,
      defaultWeight: 30,
    },
    {
      name: 'ACOS',
      currValue: 95,
      targetValue: 98,
      defaultWeight: 30,
    },
    {
      name: '其他广告ROI',
      currValue: 95,
      targetValue: 98,
      defaultWeight: 30,
    },
    {
      name: '总退款率',
      currValue: 95,
      targetValue: 98,
      defaultWeight: 30,
    },
    {
      name: '断货',
      currValue: 95,
      targetValue: 98,
      defaultWeight: 30,
    },
    {
      name: '行为/态度',
      currValue: 95,
      targetValue: 98,
      defaultWeight: 30,
    }
  ],
  design: [
    {
      name: '工作能力',
      currValue: 85,
      targetValue: 90,
      defaultWeight: 25,
    },
    {
      name: '个人能力',
      currValue: 88,
      targetValue: 92,
      defaultWeight: 25,
    },
    {
      name: '工作态度',
      currValue: 88,
      targetValue: 92,
      defaultWeight: 25,
    },
    {
      name: '个人出勤',
      currValue: 88,
      targetValue: 92,
      defaultWeight: 25,
    }
  ]
}

// 各部门的员工配置
const departmentStaff = {
  standard: ['张三', '李四', '王五'],
  nonStandard: ['赵六', '钱七', '孙八'],
  nonStandardDev: ['周九', '吴十', '郑十一'],
  standardParts: ['王明', '李亮', '张华'],
  design: ['刘艺', '陈美', '周设']
}

// 添加全选相关的响应式变量
const checkAll = ref(false)
const isIndeterminate = ref(false)

/** 获取列表数据 */
function getList() {
  loading.value = true
  // 模拟数据，实际项目中应该调用API
  kpiList.value = [
    {
      name: '张三',
      targets: [
        {name: 'GMV', weight: 0.4, score: 85},
        {name: 'Profit', weight: 0.3, score: 90},
        {name: '重塑率', weight: 0.3, score: 75}
      ],
      totalScore: 85 // 计算总得分
    },
    {
      name: '李四',
      targets: [
        {name: 'GMV', weight: 0.5, score: 80},
        {name: 'Profit', weight: 0.5, score: 85}
      ],
      totalScore: 82.5 // 计算总得分
    },
    {
      name: '王五',
      targets: [
        {name: 'GMV', weight: 0.3, score: 75},
        {name: '重塑率', weight: 0.7, score: 70}
      ],
      totalScore: 72.5 // 计算总得分
    },
  ]
  total.value = kpiList.value.length
  loading.value = false
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  queryParams.value = {
    pageNum: 1,
    pageSize: 10
  }
  handleQuery()
}

/** 新增按钮操作 */
function handleAdd() {
  form.name = ''
  form.targets = []
  selectedTargets.value = []
  // 设置默认部门
  activeDepartment.value = 'standard'
  open.value = true
  title.value = "新增考核人"
}

/** 修改按钮操作 */
function handleUpdate() {
  // 使用导入的router进行跳转
  router.push({
    name: 'info'
  });
}

/** 取消按钮 */
function cancel() {
  open.value = false
}

/** 表单提交 */
function submitForm() {
  proxy.$refs["kpiFormRef"].validate(valid => {
    if (valid) {
      // 转换权重为小数
      const submitData = {
        ...form,
        targets: form.targets.map(t => ({
          ...t,
          weight: t.weight / 100 // 转换回小数
        }))
      }

      // 实际项目中这里应该调用API
      proxy.$modal.msgSuccess("操作成功")
      open.value = false
      getList()
    }
  })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('kpi/export', {
    ...queryParams.value
  }, `kpi_${new Date().getTime()}.xlsx`)
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  single.value = selection.length !== 1
}

// 处理全选
function handleCheckAllChange(val) {
  const targetNames = departmentTargets[activeDepartment.value].map(item => item.name)
  selectedTargets.value = val ? targetNames : []
  isIndeterminate.value = false
  // 触发考核项选择处理
  handleTargetSelect(selectedTargets.value)
}

// 修改考核项选择处理函数
function handleTargetSelect(checkedValues) {
  // 处理全选状态
  const targetNames = departmentTargets[activeDepartment.value].map(item => item.name)
  const checkedCount = checkedValues.length
  checkAll.value = checkedCount === targetNames.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < targetNames.length

  // 原有的处理逻辑保持不变
  const addedTargets = checkedValues.filter(name => !form.targets.find(t => t.name === name))
  const removedTargets = form.targets.filter(t => !checkedValues.includes(t.name))

  form.targets = form.targets.filter(t => !removedTargets.map(rt => rt.name).includes(t.name))

  addedTargets.forEach(targetName => {
    const template = departmentTargets[activeDepartment.value].find(t => t.name === targetName)
    if (template) {
      form.targets.push({
        ...template,
        weight: template.defaultWeight,
        calcType: '自动计算'
      })
    }
  })

  validateTotalWeight()
}

// 修改验证总权重的函数
function validateTotalWeight() {
  const total = form.targets.reduce((sum, target) => sum + (Number(target.weight) || 0), 0)

  // 如果总权重超过100，按比例调整所有权重
  if (total > 100) {
    const ratio = 100 / total
    form.targets.forEach(target => {
      target.weight = Math.floor(target.weight * ratio)
    })

    // 处理由于取整可能导致的总和不等于100的情况
    const newTotal = form.targets.reduce((sum, target) => sum + target.weight, 0)
    if (newTotal < 100 && form.targets.length > 0) {
      // 将差值加到第一个考核项上
      form.targets[0].weight += (100 - newTotal)
    }
  }
}

// 修改部门切换处理函数
function handleDepartmentChange(tab) {
  selectedTargets.value = []
  form.targets = []
  form.name = ''
  // 重置全选状态
  checkAll.value = false
  isIndeterminate.value = false
}

// 初始化
getList()
</script>

<style scoped>
.kpi-dialog :deep(.el-dialog) {
  margin: 5vh auto !important;
  max-height: 90vh;
  height: 80vh;  /* 添加固定高度 */
  display: flex;
  flex-direction: column;
}

.kpi-dialog :deep(.el-dialog__body) {
  flex: 1;
  overflow: auto;
  padding: 20px;
  display: flex;  /* 添加flex布局 */
  flex-direction: column;  /* 垂直方向排列 */
}

/* 让表单占满剩余空间 */
.kpi-dialog :deep(.el-form) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 让考核项表单项占满剩余空间 */
.kpi-dialog :deep(.el-form-item.is-required) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 让表格容器占30%高度 */
.target-table {
  margin-top: 15px;
  height: 30vh !important;  /* 设置为视窗高度的50% */
  overflow: auto;
}

.target-table :deep(.el-table__body-wrapper) {
  overflow-y: auto !important;
}

.target-selection {
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid #EBEEF5;
  border-radius: 4px;
}

.weight-info {
  margin-top: 15px;
}

.el-form-item {
  margin-bottom: 18px;
}

.el-table {
  width: 100% !important;
}

.el-table__body-wrapper {
  overflow-x: hidden !important;
}

.el-tabs {
  margin-bottom: 20px;
}

.checkbox-header {
  margin-bottom: 1px;
  padding-bottom: 1px;
  border-bottom: 1px dashed #EBEEF5;
}
</style>