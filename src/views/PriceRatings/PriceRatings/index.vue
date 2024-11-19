<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
<!--      <el-form-item label="产品标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入产品标题"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="小图URL" prop="smallImg">
        <el-input
          v-model="queryParams.smallImg"
          placeholder="请输入小图URL"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="中图URL" prop="middleImg">
        <el-input
          v-model="queryParams.middleImg"
          placeholder="请输入中图URL"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="大图URL" prop="largerImg">
        <el-input
          v-model="queryParams.largerImg"
          placeholder="请输入大图URL"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="原价" prop="originalPrice">
        <el-input
          v-model="queryParams.originalPrice"
          placeholder="请输入原价"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="促销价" prop="promotionPrice">
        <el-input
          v-model="queryParams.promotionPrice"
          placeholder="请输入促销价"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="货币符号" prop="currency">
        <el-input
          v-model="queryParams.currency"
          placeholder="请输入货币符号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="促销折扣百分比" prop="promotionDiscount">
        <el-input
          v-model="queryParams.promotionDiscount"
          placeholder="请输入促销折扣百分比"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单数量" prop="orders">
        <el-input
          v-model="queryParams.orders"
          placeholder="请输入订单数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="销售数量" prop="sales">
        <el-input
          v-model="queryParams.sales"
          placeholder="请输入销售数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="平均评分" prop="averageStar">
        <el-input
          v-model="queryParams.averageStar"
          placeholder="请输入平均评分"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="反馈数量" prop="feedbacks">
        <el-input
          v-model="queryParams.feedbacks"
          placeholder="请输入反馈数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否有促销" prop="isPromotion">
        <el-input
          v-model="queryParams.isPromotion"
          placeholder="请输入是否有促销"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否是大促产品" prop="isBigSaleProduct">
        <el-input
          v-model="queryParams.isBigSaleProduct"
          placeholder="请输入是否是大促产品"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="详情页URL" prop="detailUrl">
        <el-input
          v-model="queryParams.detailUrl"
          placeholder="请输入详情页URL"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="店铺名称" prop="storeName">
        <el-input
          v-model="queryParams.storeName"
          placeholder="请输入店铺名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
<!--      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['PriceRatings:PriceRatings:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['PriceRatings:PriceRatings:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['PriceRatings:PriceRatings:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['PriceRatings:PriceRatings:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
        v-loading="loading"
        :data="PriceRatingsList"
        height="600"
        style="min-width: 1500px;"
        :estimated-row-height="40"
        highlight-current-row
        border
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="刊登ID" align="center" prop="id" />
      <el-table-column label="产品标题" align="center" prop="title" />
      <el-table-column label="销量变化" align="center" prop="visitorCountsByDate">
        <template #default="scope">
          <div class="echart" :id="`mychart-${scope.$index}`" :style="myChartStyle"></div>
        </template>
      </el-table-column>
      <!--<el-table-column label="小图URL" align="center" prop="smallImg" />-->
      <!--<el-table-column label="中图URL" align="center" prop="middleImg" />-->
      <el-table-column label="刊登图片" align="center" width="120">
        <template #default="scope">
          <img :src="scope.row?.largerImg || ''" width="100" alt="刊登图片"/>
        </template>
      </el-table-column>
      <el-table-column label="原价" align="center" prop="originalPrice" />
      <el-table-column label="促销价" align="center" prop="promotionPrice" />
      <!--<el-table-column label="货币符号" align="center" prop="currency" />-->
      <el-table-column label="促销折扣百分比" align="center" prop="promotionDiscount">
        <template #default="scope">
          <div>{{ scope.row.promotionDiscount }}%</div>
        </template>
      </el-table-column>
      <el-table-column label="订单数量" align="center" prop="orders" />
      <el-table-column label="销售数量" align="center" prop="sales" />
      <el-table-column label="平均评分" align="center" prop="averageStar" />
      <el-table-column label="反馈数量" align="center" prop="feedbacks" />
      <el-table-column label="是否有促销" align="center" prop="isPromotion" />
      <el-table-column label="是否是大促产品" align="center" prop="isBigSaleProduct" />
      <!--<el-table-column label="详情页URL" align="center" prop="detailUrl" />-->
      <el-table-column label="店铺名称" align="center" prop="storeName" />
      <!--<el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
      <!--  <template #default="scope">-->
      <!--    <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['PriceRatings:PriceRatings:edit']">修改</el-button>-->
      <!--    <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['PriceRatings:PriceRatings:remove']">删除</el-button>-->
      <!--  </template>-->
      <!--</el-table-column>-->
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改价格和评分信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="PriceRatingsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="产品标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入产品标题" />
        </el-form-item>
        <el-form-item label="小图URL" prop="smallImg">
          <el-input v-model="form.smallImg" placeholder="请输入小图URL" />
        </el-form-item>
        <el-form-item label="中图URL" prop="middleImg">
          <el-input v-model="form.middleImg" placeholder="请输入中图URL" />
        </el-form-item>
        <el-form-item label="大图URL" prop="largerImg">
          <el-input v-model="form.largerImg" placeholder="请输入大图URL" />
        </el-form-item>
        <el-form-item label="原价" prop="originalPrice">
          <el-input v-model="form.originalPrice" placeholder="请输入原价" />
        </el-form-item>
        <el-form-item label="促销价" prop="promotionPrice">
          <el-input v-model="form.promotionPrice" placeholder="请输入促销价" />
        </el-form-item>
        <el-form-item label="货币符号" prop="currency">
          <el-input v-model="form.currency" placeholder="请输入货币符号" />
        </el-form-item>
        <el-form-item label="促销折扣百分比" prop="promotionDiscount">
          <el-input v-model="form.promotionDiscount" placeholder="请输入促销折扣百分比" />
        </el-form-item>
        <el-form-item label="订单数量" prop="orders">
          <el-input v-model="form.orders" placeholder="请输入订单数量" />
        </el-form-item>
        <el-form-item label="销售数量" prop="sales">
          <el-input v-model="form.sales" placeholder="请输入销售数量" />
        </el-form-item>
        <el-form-item label="平均评分" prop="averageStar">
          <el-input v-model="form.averageStar" placeholder="请输入平均评分" />
        </el-form-item>
        <el-form-item label="反馈数量" prop="feedbacks">
          <el-input v-model="form.feedbacks" placeholder="请输入反馈数量" />
        </el-form-item>
        <el-form-item label="是否有促销" prop="isPromotion">
          <el-input v-model="form.isPromotion" placeholder="请输入是否有促销" />
        </el-form-item>
        <el-form-item label="是否是大促产品" prop="isBigSaleProduct">
          <el-input v-model="form.isBigSaleProduct" placeholder="请输入是否是大促产品" />
        </el-form-item>
        <el-form-item label="详情页URL" prop="detailUrl">
          <el-input v-model="form.detailUrl" placeholder="请输入详情页URL" />
        </el-form-item>
        <el-form-item label="店铺名称" prop="storeName">
          <el-input v-model="form.storeName" placeholder="请输入店铺名称" />
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

<script setup name="PriceRatings">
import { listPriceRatings, getPriceRatings, delPriceRatings, addPriceRatings, updatePriceRatings, onMounted } from "@/api/PriceRatings/PriceRatings";
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([LineChart, TitleComponent, TooltipComponent, GridComponent, CanvasRenderer]);

const { proxy } = getCurrentInstance();

const PriceRatingsList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const myChartStyle = { float: "left", width: "100%", height: "200px" };


const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    title: null,
    smallImg: null,
    middleImg: null,
    largerImg: null,
    originalPrice: null,
    promotionPrice: null,
    currency: null,
    promotionDiscount: null,
    orders: null,
    sales: null,
    averageStar: null,
    feedbacks: null,
    isPromotion: null,
    isBigSaleProduct: null,
    detailUrl: null,
    storeName: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询价格和评分信息列表 */
function getList() {
  loading.value = true;
  listPriceRatings(queryParams.value).then(response => {
    PriceRatingsList.value = response.rows;
    total.value = response.total;
    loading.value = false;
    nextTick(() => {
      initEcharts();
    });
  });
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
    title: null,
    smallImg: null,
    middleImg: null,
    largerImg: null,
    originalPrice: null,
    promotionPrice: null,
    currency: null,
    promotionDiscount: null,
    orders: null,
    sales: null,
    averageStar: null,
    feedbacks: null,
    isPromotion: null,
    isBigSaleProduct: null,
    detailUrl: null,
    storeName: null
  };
  proxy.resetForm("PriceRatingsRef");
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
  title.value = "添加价格和评分信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getPriceRatings(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改价格和评分信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["PriceRatingsRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updatePriceRatings(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPriceRatings(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除价格和评分信息编号为"' + _ids + '"的数据项？').then(function() {
    return delPriceRatings(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('PriceRatings/PriceRatings/export', {
    ...queryParams.value
  }, `PriceRatings_${new Date().getTime()}.xlsx`)
}

// 初始化 ECharts 图表
const initEcharts = () => {
  PriceRatingsList.value.forEach((item, index) => {
    const chartId = `mychart-${index}`;
    const chartDom = document.getElementById(chartId);
    if (chartDom) {
      const chart = echarts.init(chartDom);
      const visitorCountsByDate = item.visitorCountsByDate;

      // 获取最近30天的日期
      const today = new Date();
      const dates = [];
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
      }

      // 填充 xData 和 yData
      const xData = dates.reverse();
      const yData = dates.map(date => visitorCountsByDate[date] ?? 0);

      const option = {
        xAxis: {
          type: 'category',
          data: xData
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: yData,
            type: 'line' // 类型设置为折线图
          }
        ]
      };

      chart.setOption(option);

      // 监听图表容器的可见性变化
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            chart.resize();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      observer.observe(chartDom);
    }
  });
};

// 监听 PriceRatingsList 变化，重新初始化图表
watch(PriceRatingsList, () => {
  nextTick(() => {
    initEcharts();
  });
});

onMounted(() => {
  getList();
});

onBeforeUnmount(() => {
  // 清理图表实例
  PriceRatingsList.value.forEach((_, index) => {
    const chartId = `mychart-${index}`;
    const chartDom = document.getElementById(chartId);
    if (chartDom) {
      const chart = echarts.getInstanceByDom(chartDom);
      if (chart) {
        chart.dispose();
      }
    }
  });
});

// getList();
</script>

<style scoped>
.echart {
  float: left;
  width: 100%;
  height: 200px;
}
</style>