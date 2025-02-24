<script setup name="Detail">
import { useRoute } from 'vue-router'; // 确保导入 useRoute
import {
  getAmzTurnover,
} from "@/api/amazon/amzTurnover";

const route = useRoute();
const data = ref({});
// 从查询参数中获取数据
if (route.query.data) {
  data.value = JSON.parse(route.query.data); // 解析传递的数据
} else {
  const id = route.params?.id;
  if (id) {
    getAmzTurnover(id).then(res => {
      data.value = res.data; // 直接赋值，因为返回的数据结构已经匹配
    }).catch(error => {
      console.error("获取数据失败:", error); // 添加错误处理
      console.log("错误详情:", error); // 添加详细错误信息打印
      data.value = {}; // 设置为空对象以避免模板崩溃
    });
  }
}
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
            <label>MSKU：</label>
            <span>{{ data.msku }}</span>
          </div>
          <div class="detail-row">
            <label>ASIN：</label>
            <span>{{ data.asin }}</span>
          </div>
          <div class="detail-row">
            <label>FNSKU：</label>
            <span>{{ data.fnsku }}</span>
          </div>
          <div class="detail-row">
            <label>本地SKU：</label>
            <span>{{ data.localSku }}</span>
          </div>
          <div class="detail-row">
            <label>主SKU：</label>
            <span>{{ data.mainSku || '暂无数据' }}</span>
          </div>
          <div class="detail-row">
            <label>商品目录：</label>
            <span>{{ data.categoryLevelOne }} / {{ data.categoryLevelTwo }}</span>
          </div>
          <div class="detail-row">
            <label>产品名称：</label>
            <span>{{ data.productName }}</span>
          </div>
        </div>

        <!-- 销售数据 -->
        <div class="detail-section">
          <div class="section-title">销售数据</div>
          <div class="detail-row">
            <label>7天销量：</label>
            <span>{{ data.sales7Days }}</span>
          </div>
          <div class="detail-row">
            <label>14天销量：</label>
            <span>{{ data.sales14Days }}</span>
          </div>
          <div class="detail-row">
            <label>30天销量：</label>
            <span>{{ data.sales30Days }}</span>
          </div>
          <div class="detail-row">
            <label>90天销量：</label>
            <span>{{ data.sales90Days }}</span>
          </div>
          <div class="detail-row">
            <label>日均销量：</label>
            <span>{{ data.avgDailySales }}</span>
          </div>
        </div>

        <!-- 市场数据 -->
        <div class="detail-section">
          <div class="section-title">市场数据</div>
          <div class="detail-row">
            <label>竞争对手销量：</label>
            <span>{{ data.amCompetitorSales }}</span>
          </div>
          <div class="detail-row">
            <label>市场容量：</label>
            <span>{{ data.amMarketCapacity }}</span>
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
          <div class="detail-row">
            <label>本地库存：</label>
            <span>{{ data.localInventory }}</span>
          </div>
          <div class="detail-row">
            <label>采购在途：</label>
            <span>{{ data.procurementInTransit }}</span>
          </div>
          <div class="detail-row">
            <label>FBA可售：</label>
            <span>{{ data.available }}</span>
          </div>
          <div class="detail-row">
            <label>FBA待入库：</label>
            <span>{{ data.awaitingStock }}</span>
          </div>
          <div class="detail-row">
            <label>FBA在途：</label>
            <span>{{ data.inTransit }}</span>
          </div>
        </div>

        <!-- 采购信息 -->
        <div class="detail-section">
          <div class="section-title">采购信息</div>
          <div class="detail-row">
            <label>供应商：</label>
            <span>{{ data.supplierName }}</span>
          </div>
          <div class="detail-row">
            <label>最新采购价：</label>
            <span>{{ data.latestPurchasePrice }}</span>
          </div>
          <div class="detail-row">
            <label>最小采购量：</label>
            <span>{{ data.minPurchaseQuantity }}</span>
          </div>
          <div class="detail-row">
            <label>采购天数：</label>
            <span>{{ data.procurementDays }}</span>
          </div>
        </div>

        <!-- 未开发的功能 -->
        <div class="detail-section">
          <div class="section-title">其他信息</div>
          <div class="undeveloped">
            以下功能正在开发中：
            <ul>
              <li>季节性产品信息</li>
              <li>产品生命周期状态</li>
              <li>改造信息</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.detail-container {
  padding: 10px;
  min-height: calc(100vh - 100px);
  background: #f5f7fa;
}

.detail-layout {
  display: flex;
  gap: 10px;
}

.detail-left,
.detail-right {
  flex: 1;
  min-width: 0; // 防止flex子项溢出
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

.status-tag {
  padding: 2px 8px;
  background: #f0f9eb;
  color: #67c23a;
  border-radius: 2px;
}

.undeveloped {
  padding: 10px;
  color: #f56c6c;
  font-size: 14px;
  
  ul {
    margin: 5px 0 0 20px;
    padding: 0;
  }
}

// 响应式布局
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