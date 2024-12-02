<template>
  <div class="sku-management">
    <el-card>
      <div class="filter-container">
        <el-form :inline="true" :model="filterForm" @submit.prevent>
          <el-form-item label="物料编码">
            <el-input
              v-model="filterForm.skuCode"
              placeholder="请输入物料编码"
              clearable
              @clear="handleFilter"
              @keyup.enter="handleFilter"
            />
          </el-form-item>
          <el-form-item label="物料名称">
            <el-input
              v-model="filterForm.skuName"
              placeholder="请输入物料名称"
              clearable
              @clear="handleFilter"
              @keyup.enter="handleFilter"
            />
          </el-form-item>
          <el-form-item label="可用天数(30天)">
            <el-select
              v-model="filterForm.days30"
              placeholder="选择范围"
              clearable
              @change="handleFilter"
              style="width: 150px;"
            >
              <el-option label="小于0天" value="lt0" />
              <el-option label="等于0天" value="eq0" />
              <el-option label="小于30天" value="lt30" />
              <el-option label="30-60天" value="30to60" />
              <el-option label="小于60天" value="lt60" />
              <el-option label="小于90天" value="lt90" />
              <el-option label="大于60天" value="gt60" />
              <el-option label="大于90天" value="gt90" />
            </el-select>
          </el-form-item>



          <el-form-item label="可用天数(90天)">
            <el-select
              v-model="filterForm.days90"
              placeholder="选择范围"
              clearable
              @change="handleFilter"
              style="width: 150px;"
            >
              <el-option label="小于0天" value="lt0" />
              <el-option label="等于0天" value="eq0" />
              <el-option label="小于30天" value="lt30" />
              <el-option label="30-60天" value="30to60" />
              <el-option label="小于60天" value="lt60" />
              <el-option label="小于90天" value="lt90" />
              <el-option label="大于60天" value="gt60" />
              <el-option label="大于90天" value="gt90" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click.prevent="handleFilter">搜索</el-button>
            <el-button @click.prevent="resetFilter">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table
        :data="skuList"
        border
        style="width: 100%"
        v-loading="loading"
        :row-style="{ height: '200px' }"
        :cell-style="{ padding: '5px' }"
        height="calc(100vh - 200px)"
        :header-cell-style="{ background: '#f5f7fa' }"
        @sort-change="handleSortChange"
      >
        <el-table-column prop="sku_code" label="物料编码" width="100" fixed="left" />
        <el-table-column prop="sku_name" label="物料名称" width="120" fixed="left" />
        <el-table-column label="图片" width="80">
          <template #default="scope">
            <el-image
              :src="'https://tf.jdy.com/fileserver' + scope.row.sku_image"
              :preview-src-list="[scope.row.sku_image]"
              style="width: 40px; height: 40px"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column prop="sku_stock" label="系统库存" width="80">
          <template #default="scope">
            <span>{{ Math.floor(scope.row.sku_stock) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="采购时间" width="120">
          <template #default="scope">
            <div class="text-with-line-break">
              {{ scope.row.sku_purchase_time }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="采购数量" width="70">
          <template #default="scope">
            <div class="text-with-line-break">
              {{ scope.row.sku_purchase_num }}
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="usage_plan" label="预计耗量" width="80">
          <template #default="scope">
            <span>{{ Math.floor(scope.row.usage_plan) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sku_available_stock" label="可用库存（扣除预计消耗量）" width="80">
          <template #default="scope">
            <span>{{ Math.floor(scope.row.sku_available_stock) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="安全库存" width="80">
          <template #default>
            <span>500</span>
          </template>
        </el-table-column>
        <el-table-column label="消耗趋势" min-width="300">
          <template #default="scope">
            <div class="usage-chart">
              <UsageChart :usage-data="scope.row.usage" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="耗量" width="100">
          <template #default="scope">
            <div>30天: {{ Math.floor(scope.row.usage_30) }}</div>
            <div>90天: {{ Math.floor(scope.row.usage_90) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="日均耗量" width="100">
          <template #default="scope">
            <div>30天: {{ Math.floor(scope.row.sku_daily_usage_30) }}</div>
            <div>90天: {{ Math.floor(scope.row.sku_daily_usage_90) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="单价" width="70">
          <template #default="scope">
            <div class="text-with-line-break">
              {{ scope.row.price }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="min_purchase_quantity" label="最小起订量" width="80">
          <template #default="scope">
            <span>{{ scope.row.min_purchase_quantity ? Math.floor(scope.row.min_purchase_quantity) : 500 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最小起订价" width="70">
          <template #default="scope">
            <div class="text-with-line-break">
              {{ scope.row.price && scope.row.min_purchase_quantity
                ? Math.floor(scope.row.price * scope.row.min_purchase_quantity)
                : '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="purchase_cycle" label="采购周期" width="80">
          <template #default="scope">
            <span>{{ Math.floor(scope.row.purchase_cycle) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="available_days_30"
          label="可用天数(30天)"
          width="120"
          sortable="custom"
          fixed="right"
        >
          <template #default="scope">
            <span>{{ Math.floor(scope.row.available_days_30) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="available_days_90"
          label="可用天数(90天)"
          width="120"
          sortable="custom"
          fixed="right"
        >
          <template #default="scope">
            <span>{{ Math.floor(scope.row.available_days_90) }}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model="currentPage"
          :total="total"
          :page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import UsageChart from './components/UsageChart.vue'
import { ElMessage } from 'element-plus'


function splitInTransitData(data) {
  const newData = {...data }; // 创建一个新的数据对象副本，避免直接修改原数据
  const inTransitStr = newData.sku_in_transit?.trim();
  if (inTransitStr) {
    console.log('原始数据字符串:', inTransitStr);
    const quantityTimePairs = [];
    const splitRegex = /(采购数量: ([\d.]+), 采购时间: ([\d-]+))/g;
    splitRegex.lastIndex = 0; // 重置匹配起始位置
    let match;
    // 使用循环不断查找匹配项
    while ((match = splitRegex.exec(inTransitStr))!== null) {
      if (match[2] && match[3]) {
        const quantity = parseFloat(match[2]);
        const time = match[3];
        quantityTimePairs.push({ quantity, time });
      }
    }
    console.log("quantityTimePairs==>",quantityTimePairs);
    // 使用换行符 \n 替代原来的逗号
    newData.sku_purchase_num = quantityTimePairs.map(pair => pair.quantity).join('\n');
    newData.sku_purchase_time = quantityTimePairs.map(pair => pair.time).join('\n');
  } else {
    // 当 inTransitStr 本身为空时，设置默认显示值为空字符串
    newData.sku_purchase_num = '';
    newData.sku_purchase_time = '';
  }
  return newData;
}
function useSkuList() {
  const skuList = ref([])
  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = ref(0)
  const filterForm = ref({
    skuCode: '',
    skuName: '',
    days30: '',
    days90: ''
  })
  const sortParams = ref({
    prop: '',
    order: ''
  })

  const fetchSkuList = async () => {
    loading.value = true
    try {
      const params = new URLSearchParams()

      // 添加分页参数
      params.append('page', currentPage.value.toString())
      params.append('limit', pageSize.value.toString())

      // 添加搜索条件
      if (filterForm.value.skuCode?.trim()) {
        params.append('skuCode', filterForm.value.skuCode.trim())
      }
      if (filterForm.value.skuName?.trim()) {
        params.append('skuName', filterForm.value.skuName.trim())
      }
      if (filterForm.value.days30) {
        params.append('days30Filter', filterForm.value.days30)
      }
      if (filterForm.value.days90) {
        params.append('days90Filter', filterForm.value.days90)
      }

      // 添加排序参数
      if (sortParams.value.prop && sortParams.value.order) {
        params.append('sortProp', sortParams.value.prop)
        params.append('sortOrder', sortParams.value.order)
      }

      console.log('发送请求参数：', params.toString()) // 添加日志

      const response = await fetch(
        `http://192.168.1.204:3900/api/sku/list?${params.toString()}`
      )
      const data = await response.json()

      console.log('接收到的数据：', data) // 添加日志

      skuList.value = data.data.map(item => {
        try {
          return splitInTransitData(item)
        } catch (error) {
          console.error('处理单个SKU数据失败:', error)
          return item
        }
      })
      total.value = data.total
    } catch (error) {
      console.error('获取SKU列表失败:', error)
      ElMessage.error('获取数据失败')
    } finally {
      loading.value = false
    }
  }

  const handleFilter = () => {
    console.log('执行搜索，过滤条件：', filterForm.value) // 添加日志
    currentPage.value = 1
    fetchSkuList()
  }

  const handleSizeChange = (val) => {
    pageSize.value = val
    fetchSkuList()
  }

  const handleCurrentChange = (val) => {
    currentPage.value = val
    fetchSkuList()
  }

  const handleSortChange = ({ prop, order }) => {
    sortParams.value = {
      prop: prop || '',
      order: order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : ''
    }
    fetchSkuList()
  }

  const resetFilter = () => {
    filterForm.value = {
      skuCode: '',
      skuName: '',
      days30: '',
      days90: ''
    }
    handleFilter()
  }

  return {
    skuList,
    loading,
    currentPage,
    pageSize,
    total,
    filterForm,
    fetchSkuList,
    handleFilter,
    handleSizeChange,
    handleCurrentChange,
    handleSortChange,
    resetFilter
  }
}

export default {
  name: 'SkuManagement',
  components: {
    UsageChart
  },
  setup() {
    const {
      skuList,
      loading,
      currentPage,
      pageSize,
      total,
      filterForm,
      fetchSkuList,
      handleFilter,
      handleSizeChange,
      handleCurrentChange,
      handleSortChange,
      resetFilter
    } = useSkuList()

    onMounted(() => {
      fetchSkuList()
    })

    return {
      skuList,
      loading,
      currentPage,
      pageSize,
      total,
      filterForm,
      handleFilter,
      handleSizeChange,
      handleCurrentChange,
      handleSortChange,
      resetFilter
    }
  }
}
</script>

<style scoped>

.text-with-line-break {
  white-space: pre-line !important;
  word-break: break-word !important;
  line-height: 1.5;
  padding: 5px 0;
}

.sku-management {
  padding: 20px;
  height: 100vh;
  box-sizing: border-box;
}

.usage-chart {
  width: 100%;
  height: 180px;
  margin: 5px 0;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-table__row) {
  height: 200px !important;
}

:deep(.el-table__cell) {
  padding: 5px !important;
}

:deep(.el-table) {
  width: 100%;
  overflow-x: auto;
}

:deep(.el-table__header-wrapper) {
  position: sticky;
  top: 0;
  z-index: 1;
}

:deep(.el-table__fixed-header-wrapper) {
  background-color: #f5f7fa;
}

.filter-container {
  margin-bottom: 20px;
}

:deep(.el-form--inline .el-form-item) {
  margin-right: 20px;
}
</style>