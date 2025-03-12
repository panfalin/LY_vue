<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const kpiInfo = ref({
  department: '开发部',
  position: '产品开发专员',
  assessmentTime: '2024年3月',
  assessedPerson: '张三',
  items: [
    {
      index: 1,
      category: '产品开发效能',
      items: [
        {
          indicator: '新品开发数量',
          evaluationCriteria: '目标值：50个产品每月，每少1个扣5分',
          weight: 20,
          finalScore: 15,
          remarks: '本月完成47个新品开发'
        },
        {
          indicator: '开发利润增长率',
          evaluationCriteria: '利润率增长：目标：1.5% 总分共5分。超出加2分，每未达到0.5%扣2分，直到分数扣完为止',
          weight: 5,
          finalScore: 7,
          remarks: '本月利润增长率达到1.8%'
        },
        {
          indicator: '新品优化抽查',
          evaluationCriteria: '每周最低抽查1次; 每抽查1次未做优化，扣除5分，直到分数扣完为止',
          weight: 20,
          finalScore: 15,
          remarks: '第三周一次优化未完成'
        },
        {
          indicator: '当月产品重塑率',
          evaluationCriteria: '根据开发上架的产品，进入重塑，开发专员每款加0.5分，扣完即止。',
          weight: 20,
          finalScore: 22,
          remarks: '完成4款产品重塑优化'
        }
      ]
    },
    {
      index: 2,
      category: '供应商管理',
      items: [
        {
          indicator: '供应商开发数量',
          evaluationCriteria: '目标值：3家/月；每少1家扣1分，每多1家加1分（需通过资质审核）',
          weight: 3,
          finalScore: 4,
          remarks: '本月成功开发4家合格供应商'
        }
      ]
    },
    {
      index: 3,
      category: '合规与风险管理',
      items: [
        {
          indicator: '专利侵权风险规避率',
          evaluationCriteria: '每出现1次图片和设计商标侵权扣5分一次(以平台投诉和抽查记录为准)',
          weight: 5,
          finalScore: 5,
          remarks: '本月无侵权投诉'
        }
      ]
    },
    {
      index: 4,
      category: '文档与流程管理',
      items: [
        {
          indicator: '产品资料归档完整性',
          evaluationCriteria: '产品资料检查出OEM、车型、年份有问题，缺失1项扣2分',
          weight: 15,
          finalScore: 13,
          remarks: '有1个产品年份信息不完整'
        }
      ]
    },
    {
      index: 5,
      category: '各部门协作',
      items: [
        {
          indicator: '工作态度',
          evaluationCriteria: '主管交代的工作是否完成，以及配合度，如出现不配合情况一次扣除5分。',
          weight: 4,
          finalScore: 4,
          remarks: '工作配合度高'
        },
        {
          indicator: '配合其他工作部门完成工作',
          evaluationCriteria: '运营和美工，如出现投诉1次，此项分数为0',
          weight: 4,
          finalScore: 4,
          remarks: '与各部门合作顺畅'
        }
      ]
    },
    {
      index: 6,
      category: '个人出勤',
      items: [
        {
          indicator: '当月无迟到早退',
          evaluationCriteria: '迟到早退≥2次，此项0分',
          weight: 4,
          finalScore: 4,
          remarks: '本月全勤'
        }
      ]
    }
  ]
})

// 添加编辑状态控制
const editingRow = ref(null)

// 添加编辑相关方法
const handleEdit = (row) => {
  editingRow.value = row
}

const handleSave = (row) => {
  editingRow.value = null
  // 这里可以添加保存到后端的逻辑
}

const handleCancel = () => {
  editingRow.value = null
}

// 处理数据格式，将嵌套的items展平为表格数据
const flattenKpiItems = () => {
  const flattenedItems = []
  kpiInfo.value.items.forEach(category => {
    category.items.forEach((item, index) => {
      flattenedItems.push({
        index: index === 0 ? category.index : '',
        category: index === 0 ? category.category : '',
        indicator: item.indicator,
        evaluationCriteria: item.evaluationCriteria,
        weight: item.weight,
        finalScore: item.finalScore,
        remarks: item.remarks
      })
    })
  })
  kpiInfo.value.items = flattenedItems
}

// 初始化数据
const initData = () => {
  // 从路由参数中获取数据
  const { name, department, position, assessmentTime } = route.query
  
  if (name) {
    kpiInfo.value.assessedPerson = name
    kpiInfo.value.department = department
    kpiInfo.value.position = position
    kpiInfo.value.assessmentTime = assessmentTime
  }
  
  flattenKpiItems()
}

// 计算总分
const totalScore = computed(() => {
  return kpiInfo.value.items.reduce((sum, item) => sum + (item.finalScore || 0), 0)
})

// 导出考核表
const handleExport = () => {
  // 实现导出功能
}

const handleScoreChange = () => {
  // 当分数改变时重新计算总分
  // totalScore 是计算属性，会自动更新
}

const handleRemarksChange = () => {
  // 备注改变时的处理逻辑
  // 可以在这里添加保存或其他操作
}

onMounted(() => {
  initData()
})
</script>

<template>
  <div class="app-container">
    <div class="kpi-detail-card">
      <div class="header">
        <h2>开发部标准-KPI绩效考核表</h2>
        <div class="basic-info">
          <div class="info-item">
            <span class="label">所属部门：</span>
            <span class="value">{{ kpiInfo.department }}</span>
          </div>
          <div class="info-item">
            <span class="label">岗位：</span>
            <span class="value">{{ kpiInfo.position }}</span>
          </div>
          <div class="info-item">
            <span class="label">考核时间：</span>
            <span class="value">{{ kpiInfo.assessmentTime }}</span>
          </div>
          <div class="info-item">
            <span class="label">被考核人：</span>
            <span class="value">{{ kpiInfo.assessedPerson }}</span>
          </div>
        </div>
      </div>

      <el-table :data="kpiInfo.items" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="category" label="考核指标" min-width="120">
          <template #default="scope">
            <div class="category-cell">
              <span class="index">{{ scope.row.index }}</span>
              <span>{{ scope.row.category }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="indicator" label="指标解释" min-width="150" :show-overflow-tooltip="false" />
        <el-table-column prop="evaluationCriteria" label="评分原则" min-width="250" :show-overflow-tooltip="false" />
        <el-table-column prop="weight" label="权重" width="80" align="center" />
        <el-table-column prop="finalScore" label="最终得分" width="100" align="center">
          <template #default="scope">
            <template v-if="editingRow === scope.row">
              <el-input-number 
                v-model="scope.row.finalScore" 
                :min="0" 
                :max="100"
                size="small"
                controls-position="right"
                @change="handleScoreChange"
              />
            </template>
            <span v-else>{{ scope.row.finalScore }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" min-width="120">
          <template #default="scope">
            <template v-if="editingRow === scope.row">
              <el-input
                v-model="scope.row.remarks"
                type="textarea"
                size="small"
                :rows="1"
                @change="handleRemarksChange"
              />
            </template>
            <span v-else>{{ scope.row.remarks }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template #default="scope">
            <template v-if="editingRow === scope.row">
              <el-button 
                type="success" 
                link
                @click="handleSave(scope.row)"
              >
                保存
              </el-button>
              <el-button 
                type="danger" 
                link
                @click="handleCancel"
              >
                取消
              </el-button>
            </template>
            <el-button 
              v-else
              type="primary" 
              link
              @click="handleEdit(scope.row)"
            >
              修改
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="score-summary">
        <div class="summary-item">
          <span class="label">总得分：</span>
          <span class="value">{{ totalScore }}</span>
        </div>
      </div>

      <div class="footer">
        <el-button type="primary" @click="handleExport">导出考核表</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.kpi-detail-card {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .header {
    margin-bottom: 20px;

    h2 {
      text-align: center;
      margin-bottom: 20px;
      font-weight: bold;
    }

    .basic-info {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-bottom: 20px;

      .info-item {
        flex: 1;
        min-width: 200px;

        .label {
          font-weight: bold;
          margin-right: 8px;
        }
      }
    }
  }

  .category-cell {
    display: flex;
    align-items: center;

    .index {
      margin-right: 8px;
      font-weight: bold;
    }
  }

  .score-summary {
    margin-top: 20px;
    text-align: right;
    
    .summary-item {
      .label {
        font-weight: bold;
        margin-right: 8px;
      }
      
      .value {
        color: #409EFF;
        font-size: 18px;
        font-weight: bold;
      }
    }
  }

  .footer {
    margin-top: 20px;
    text-align: right;
  }
}

:deep(.el-table) {
  .el-table__row {
    .el-table__cell {
      padding: 8px;
      white-space: pre-wrap;
      .cell {
        white-space: pre-wrap;
      }
    }
  }
}
</style>