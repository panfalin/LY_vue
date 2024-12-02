<template>
  <div class="app-container">
    <!-- 选择店铺框 -->
    <el-row :gutter="10" class="mb8 button-container" style="flex-wrap: wrap;">
      <!-- 全选按钮 -->
      <el-col :span="4" style="min-width: 120px;">
        <el-button
            :type="isAllSelected ? 'primary' : 'default'"
            @click="toggleAllSelection"
            class="full-width-button"
        >
          {{ isAllSelected ? '取消全选' : '全选' }}
        </el-button>
      </el-col>
      <el-col
          v-for="(item, index) in stores"
          :key="index"
          :span="2"
          :xs="12"
          :sm="8"
          :md="6"
          :lg="4"
          class="button-col"
      >
        <el-button
            :type="isSelected(item) ? 'primary' : 'default'"
            @click="toggleSelection(item)"
            class="full-width-button"
        >
          {{ item }}
        </el-button>
      </el-col>
    </el-row>

    <div>
      <el-radio-group
          v-model="dateRange"
          size="large"
          @change="handleQuery"
      >
        <el-radio-button label="近3天" value="3_days"/>
        <el-radio-button label="近7天" value="7_days"/>
        <el-radio-button label="近15天" value="15_days"/>
        <el-radio-button label="近1个月" value="1_month"/>
      </el-radio-group>
    </div>

    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="商品ID" prop="productId">
        <el-input
            v-model="queryParams.productId"
            placeholder="请输入商品ID"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <!--      <el-form-item label="统计时间" prop="statisticalDate">
              <el-date-picker clearable
                v-model="queryParams.statisticalDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择统计时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="类目ID" prop="categoryId">
              <el-input
                v-model="queryParams.categoryId"
                placeholder="请输入类目ID"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="排名" prop="rank">
              <el-input
                v-model="queryParams.rank"
                placeholder="请输入排名"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="支付老买家" prop="payingOldBuyers">
              <el-input
                v-model="queryParams.payingOldBuyers"
                placeholder="请输入支付老买家"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="支付买家数" prop="payingBuyers">
              <el-input
                v-model="queryParams.payingBuyers"
                placeholder="请输入支付买家数"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="支付商品件数" prop="paidProductQuantity">
              <el-input
                v-model="queryParams.paidProductQuantity"
                placeholder="请输入支付商品件数"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="浏览量" prop="pageViews">
              <el-input
                v-model="queryParams.pageViews"
                placeholder="请输入浏览量"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="下单金额" prop="orderAmount">
              <el-input
                v-model="queryParams.orderAmount"
                placeholder="请输入下单金额"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="平均停留时长" prop="averageStayDuration">
              <el-input
                v-model="queryParams.averageStayDuration"
                placeholder="请输入平均停留时长"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="支付新买家" prop="payingNewBuyers">
              <el-input
                v-model="queryParams.payingNewBuyers"
                placeholder="请输入支付新买家"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="老访客数" prop="oldVisitorCount">
              <el-input
                v-model="queryParams.oldVisitorCount"
                placeholder="请输入老访客数"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="支付转化率" prop="paymentConversionRate">
              <el-input
                v-model="queryParams.paymentConversionRate"
                placeholder="请输入支付转化率"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="新访客数" prop="newVisitorCount">
              <el-input
                v-model="queryParams.newVisitorCount"
                placeholder="请输入新访客数"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="搜索曝光量" prop="searchExposure">
              <el-input
                v-model="queryParams.searchExposure"
                placeholder="请输入搜索曝光量"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="下单商品件数" prop="orderedProductQuantity">
              <el-input
                v-model="queryParams.orderedProductQuantity"
                placeholder="请输入下单商品件数"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="下单买家数" prop="orderingBuyers">
              <el-input
                v-model="queryParams.orderingBuyers"
                placeholder="请输入下单买家数"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="客单价" prop="averageOrderValue">
              <el-input
                v-model="queryParams.averageOrderValue"
                placeholder="请输入客单价"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="成功退款金额" prop="successfulRefundAmount">
              <el-input
                v-model="queryParams.successfulRefundAmount"
                placeholder="请输入成功退款金额"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="税费" prop="tax">
              <el-input
                v-model="queryParams.tax"
                placeholder="请输入税费"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="商品收藏人数" prop="productFavorites">
              <el-input
                v-model="queryParams.productFavorites"
                placeholder="请输入商品收藏人数"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="商品加购人数" prop="productAddToCart">
              <el-input
                v-model="queryParams.productAddToCart"
                placeholder="请输入商品加购人数"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="访客数" prop="visitorCount">
              <el-input
                v-model="queryParams.visitorCount"
                placeholder="请输入访客数"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="搜索点击率" prop="searchClickThroughRate">
              <el-input
                v-model="queryParams.searchClickThroughRate"
                placeholder="请输入搜索点击率"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="成交金额" prop="transactionAmount">
              <el-input
                v-model="queryParams.transactionAmount"
                placeholder="请输入成交金额"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="支付件单价" prop="paidItemPrice">
              <el-input
                v-model="queryParams.paidItemPrice"
                placeholder="请输入支付件单价"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="支付主订单数" prop="paidMainOrders">
              <el-input
                v-model="queryParams.paidMainOrders"
                placeholder="请输入支付主订单数"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="下单转化率" prop="orderConversionRate">
              <el-input
                v-model="queryParams.orderConversionRate"
                placeholder="请输入下单转化率"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="下单主订单数" prop="orderedMainOrders">
              <el-input
                v-model="queryParams.orderedMainOrders"
                placeholder="请输入下单主订单数"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="根类目名称" prop="rootCategoryName">
              <el-input
                v-model="queryParams.rootCategoryName"
                placeholder="请输入根类目名称"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="类目路径" prop="categoryPath">
              <el-input
                v-model="queryParams.categoryPath"
                placeholder="请输入类目路径"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="创建时间" prop="createdTime">
              <el-date-picker clearable
                v-model="queryParams.createdTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择创建时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="店铺名" prop="storeName">
              <el-input
                v-model="queryParams.storeName"
                placeholder="请输入店铺名"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>-->
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
                  v-hasPermi="['order_data:order_data:add']"
              >新增
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                  type="success"
                  plain
                  icon="Edit"
                  :disabled="single"
                  @click="handleUpdate"
                  v-hasPermi="['order_data:order_data:edit']"
              >修改
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                  type="danger"
                  plain
                  icon="Delete"
                  :disabled="multiple"
                  @click="handleDelete"
                  v-hasPermi="['order_data:order_data:remove']"
              >删除
              </el-button>
            </el-col>-->
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['order_data:order_data:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
        v-loading="loading"
        :data="order_dataList"
        height="600"
        :estimated-row-height="40"
        highlight-current-row
        border
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="店铺" fixed width="150" align="center" prop="storeName"/>
      <el-table-column label="统计时间" align="center" prop="statisticalDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.statisticalDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单主订单数" align="center" prop="orderedMainOrders"/>
      <el-table-column label="支付买家数" align="center" prop="payingBuyers"/>
      <!--<el-table-column label="类目ID" align="center" prop="categoryId"/>-->
      <!--<el-table-column label="排名" align="center" prop="rank"/>-->
      <el-table-column label="链接数" align="center" prop="productId"/>
      <el-table-column label="支付商品件数" align="center" prop="paidProductQuantity"/>
      <el-table-column label="支付老买家" align="center" prop="payingOldBuyers"/>
      <el-table-column label="浏览量" align="center" prop="pageViews"/>
      <el-table-column label="下单金额" align="center">
        <template #default="scope">
          {{ scope.row.orderAmount }}
          <span v-if="scope.row.orderAmount != null">￥</span>
        </template>
      </el-table-column>
      <el-table-column label="平均停留时长" align="center" prop="averageStayDuration"/>
      <el-table-column label="支付新买家" align="center" prop="payingNewBuyers"/>
      <el-table-column label="老访客数" align="center" prop="oldVisitorCount"/>
      <el-table-column label="SKU明细" align="center" prop="skuDetails"/>
      <el-table-column label="总销售数" align="center" prop="totalQuantity"/>
      <el-table-column label="订单总金额" align="center">
        <template #default="scope">
          <span>
            {{ scope.row.totalOrderAmount }}
            <span v-if="scope.row.totalOrderAmount != null">￥</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="总运费" align="center">
        <template #default="scope">
          <span>{{ scope.row.totalShippingCost }}</span>
          <span v-if="scope.row.totalShippingCost != null">￥</span>
        </template>
      </el-table-column>
      <el-table-column label="广告费(人民币)" align="center" prop="totalAdCost"/>
      <el-table-column label="税费" align="center" prop="totalVatFee"/>
      <el-table-column label="总收入" align="center" prop="totalSales"/>
      <el-table-column label="总订单数量" align="center" prop="orderCount"/>
      <el-table-column label="总订单数量" align="center" prop="orderCount"/>
      <el-table-column label="国家详情" align="center" prop="countryDetail"/>
      <el-table-column label="平台交易费" align="center" prop="totalPlatformFee"/>
      <el-table-column label="国家数量" align="center" prop="uniqueCountries"/>
      <el-table-column label="支付转化率" align="center" prop="paymentConversionRate"/>
      <el-table-column label="新访客数" align="center" prop="newVisitorCount"/>
      <el-table-column label="搜索曝光量" align="center" prop="searchExposure"/>
      <el-table-column label="下单商品件数" align="center" prop="orderedProductQuantity"/>
      <el-table-column label="下单买家数" align="center" prop="orderingBuyers"/>
      <el-table-column label="客单价" align="center" prop="averageOrderValue"/>
      <el-table-column label="成功退款金额" align="center" prop="successfulRefundAmount"/>
      <el-table-column label="税费" align="center" prop="tax"/>
      <el-table-column label="商品收藏人数" align="center" prop="productFavorites"/>
      <el-table-column label="商品加购人数" align="center" prop="productAddToCart"/>
      <el-table-column label="访客数" align="center" prop="visitorCount"/>
      <el-table-column label="搜索点击率" align="center" prop="searchClickThroughRate"/>
      <el-table-column label="成交金额" align="center" prop="transactionAmount"/>
      <el-table-column label="支付件单价" align="center" prop="paidItemPrice"/>
      <el-table-column label="支付主订单数" align="center" prop="paidMainOrders"/>
      <el-table-column label="下单转化率" align="center" prop="orderConversionRate"/>
      <!--<el-table-column label="根类目名称" align="center" prop="rootCategoryName"/>-->
      <!--<el-table-column label="类目路径" align="center" prop="categoryPath"/>-->
      <!--<el-table-column label="创建时间" align="center" prop="createdTime" width="180">-->
      <!--  <template #default="scope">-->
      <!--    <span>{{ parseTime(scope.row.createdTime, '{y}-{m}-{d}') }}</span>-->
      <!--  </template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
      <!--  <template #default="scope">-->
      <!--    <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"-->
      <!--               v-hasPermi="['order_data:order_data:edit']">修改-->
      <!--    </el-button>-->
      <!--    <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"-->
      <!--               v-hasPermi="['order_data:order_data:remove']">删除-->
      <!--    </el-button>-->
      <!--  </template>-->
      <!--</el-table-column>-->
    </el-table>

    <!-- 这里放一些文本展示信息 -->
    <el-form>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item label="总收入:">
            <div class="text-left">
              <el-text>{{ totalAmount }}</el-text>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="总支出:">
            <div class="text-left">
              <el-text>{{ totalPayment }}</el-text>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="毛利:">
            <div class="text-left">
              <el-text>{{ totalSalesAmount }}</el-text>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item label="广告费:">
            <div class="text-left">
              <el-text>{{ totalAllAdCost }}</el-text>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="运费:">
            <div class="text-left">
              <el-text>{{ totalALLShippingCost }}</el-text>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="平台交易费:">
            <div class="text-left">
              <el-text>{{ totalAllPlatformFee }}</el-text>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>


    <!--    <pagination
            v-show="total>0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
        />-->

    <!-- 添加或修改速卖通分析-店铺维度对话框 -->
    <!--    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
          <el-form ref="order_dataRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="商品ID" prop="productId">
              <el-input v-model="form.productId" placeholder="请输入商品ID"/>
            </el-form-item>
            <el-form-item label="统计时间" prop="statisticalDate">
              <el-date-picker clearable
                              v-model="form.statisticalDate"
                              type="date"
                              value-format="YYYY-MM-DD"
                              placeholder="请选择统计时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="类目ID" prop="categoryId">
              <el-input v-model="form.categoryId" placeholder="请输入类目ID"/>
            </el-form-item>
            <el-form-item label="排名" prop="rank">
              <el-input v-model="form.rank" placeholder="请输入排名"/>
            </el-form-item>
            <el-form-item label="支付老买家" prop="payingOldBuyers">
              <el-input v-model="form.payingOldBuyers" placeholder="请输入支付老买家"/>
            </el-form-item>
            <el-form-item label="支付买家数" prop="payingBuyers">
              <el-input v-model="form.payingBuyers" placeholder="请输入支付买家数"/>
            </el-form-item>
            <el-form-item label="支付商品件数" prop="paidProductQuantity">
              <el-input v-model="form.paidProductQuantity" placeholder="请输入支付商品件数"/>
            </el-form-item>
            <el-form-item label="浏览量" prop="pageViews">
              <el-input v-model="form.pageViews" placeholder="请输入浏览量"/>
            </el-form-item>
            <el-form-item label="下单金额" prop="orderAmount">
              <el-input v-model="form.orderAmount" placeholder="请输入下单金额"/>
            </el-form-item>
            <el-form-item label="平均停留时长" prop="averageStayDuration">
              <el-input v-model="form.averageStayDuration" placeholder="请输入平均停留时长"/>
            </el-form-item>
            <el-form-item label="支付新买家" prop="payingNewBuyers">
              <el-input v-model="form.payingNewBuyers" placeholder="请输入支付新买家"/>
            </el-form-item>
            <el-form-item label="老访客数" prop="oldVisitorCount">
              <el-input v-model="form.oldVisitorCount" placeholder="请输入老访客数"/>
            </el-form-item>
            <el-form-item label="支付转化率" prop="paymentConversionRate">
              <el-input v-model="form.paymentConversionRate" placeholder="请输入支付转化率"/>
            </el-form-item>
            <el-form-item label="新访客数" prop="newVisitorCount">
              <el-input v-model="form.newVisitorCount" placeholder="请输入新访客数"/>
            </el-form-item>
            <el-form-item label="搜索曝光量" prop="searchExposure">
              <el-input v-model="form.searchExposure" placeholder="请输入搜索曝光量"/>
            </el-form-item>
            <el-form-item label="下单商品件数" prop="orderedProductQuantity">
              <el-input v-model="form.orderedProductQuantity" placeholder="请输入下单商品件数"/>
            </el-form-item>
            <el-form-item label="下单买家数" prop="orderingBuyers">
              <el-input v-model="form.orderingBuyers" placeholder="请输入下单买家数"/>
            </el-form-item>
            <el-form-item label="客单价" prop="averageOrderValue">
              <el-input v-model="form.averageOrderValue" placeholder="请输入客单价"/>
            </el-form-item>
            <el-form-item label="成功退款金额" prop="successfulRefundAmount">
              <el-input v-model="form.successfulRefundAmount" placeholder="请输入成功退款金额"/>
            </el-form-item>
            <el-form-item label="税费" prop="tax">
              <el-input v-model="form.tax" placeholder="请输入税费"/>
            </el-form-item>
            <el-form-item label="商品收藏人数" prop="productFavorites">
              <el-input v-model="form.productFavorites" placeholder="请输入商品收藏人数"/>
            </el-form-item>
            <el-form-item label="商品加购人数" prop="productAddToCart">
              <el-input v-model="form.productAddToCart" placeholder="请输入商品加购人数"/>
            </el-form-item>
            <el-form-item label="访客数" prop="visitorCount">
              <el-input v-model="form.visitorCount" placeholder="请输入访客数"/>
            </el-form-item>
            <el-form-item label="搜索点击率" prop="searchClickThroughRate">
              <el-input v-model="form.searchClickThroughRate" placeholder="请输入搜索点击率"/>
            </el-form-item>
            <el-form-item label="成交金额" prop="transactionAmount">
              <el-input v-model="form.transactionAmount" placeholder="请输入成交金额"/>
            </el-form-item>
            <el-form-item label="支付件单价" prop="paidItemPrice">
              <el-input v-model="form.paidItemPrice" placeholder="请输入支付件单价"/>
            </el-form-item>
            <el-form-item label="支付主订单数" prop="paidMainOrders">
              <el-input v-model="form.paidMainOrders" placeholder="请输入支付主订单数"/>
            </el-form-item>
            <el-form-item label="下单转化率" prop="orderConversionRate">
              <el-input v-model="form.orderConversionRate" placeholder="请输入下单转化率"/>
            </el-form-item>
            <el-form-item label="下单主订单数" prop="orderedMainOrders">
              <el-input v-model="form.orderedMainOrders" placeholder="请输入下单主订单数"/>
            </el-form-item>
            <el-form-item label="根类目名称" prop="rootCategoryName">
              <el-input v-model="form.rootCategoryName" placeholder="请输入根类目名称"/>
            </el-form-item>
            <el-form-item label="类目路径" prop="categoryPath">
              <el-input v-model="form.categoryPath" placeholder="请输入类目路径"/>
            </el-form-item>
            <el-form-item label="创建时间" prop="createdTime">
              <el-date-picker clearable
                              v-model="form.createdTime"
                              type="date"
                              value-format="YYYY-MM-DD"
                              placeholder="请选择创建时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="店铺名" prop="storeName">
              <el-input v-model="form.storeName" placeholder="请输入店铺名"/>
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button type="primary" @click="submitForm">确 定</el-button>
              <el-button @click="cancel">取 消</el-button>
            </div>
          </template>
        </el-dialog>-->
  </div>
</template>

<script setup name="Order_data">
import {
  listOrder_data,
  getOrder_data,
  delOrder_data,
  addOrder_data,
  updateOrder_data,
  getAllStores
} from "@/api/order_data/order_data.js";
import {ref} from "vue";

const {proxy} = getCurrentInstance();

const order_dataList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const stores = ref([]);
const dateRange = ref([]);
const totalAmount = ref(0);
// 总支出
const totalPayment = ref(0);
const totalAllAdCost = ref(0);
const totalALLShippingCost = ref(0);
const totalAllPlatformFee = ref(0);
const totalSalesAmount = ref(0);


const data = reactive({
  form: {},
  queryParams: {
    // pageNum: 1,
    // pageSize: 10,
    storeName: null,
    productId: null,
    statisticalDate: null,
    categoryId: null,
    rank: null,
    payingOldBuyers: null,
    payingBuyers: null,
    paidProductQuantity: null,
    pageViews: null,
    orderAmount: null,
    averageStayDuration: null,
    payingNewBuyers: null,
    oldVisitorCount: null,
    paymentConversionRate: null,
    newVisitorCount: null,
    searchExposure: null,
    orderedProductQuantity: null,
    orderingBuyers: null,
    averageOrderValue: null,
    successfulRefundAmount: null,
    tax: null,
    productFavorites: null,
    productAddToCart: null,
    visitorCount: null,
    searchClickThroughRate: null,
    transactionAmount: null,
    paidItemPrice: null,
    paidMainOrders: null,
    orderConversionRate: null,
    orderedMainOrders: null,
    rootCategoryName: null,
    categoryPath: null,
    createdTime: null,
    sku_details: null,
    total_quantity: null,
    total_order_amount: null,
    total_shipping_cost: null,
    total_ad_cost: null,
    total_vat_fee: null,
    total_sales: null,
    order_count: null,
    country_detail: null,
    total_platform_fee: null,
    unique_countries: null,
  },
  rules: {
    createdTime: [
      {required: true, message: "创建时间不能为空", trigger: "blur"}
    ],
    storeName: [
      {required: true, message: "店铺名不能为空", trigger: "blur"}
    ]
  }
});

const {queryParams, form, rules} = toRefs(data);

/** 查询速卖通分析-店铺维度列表 */
function getList() {
  loading.value = true;
  listOrder_data(queryParams.value).then(response => {
    order_dataList.value = response.rows;
// 计算总金额并保留两位小数
    totalAmount.value = parseFloat(order_dataList.value.reduce((total, item) => total + item.orderAmount, 0).toFixed(2));
// 计算总支付金额（包括税费、运费和平台费）并保留两位小数
    totalPayment.value = parseFloat(order_dataList.value.reduce((total, item) => total + (item.totalVatFee + item.totalShippingCost + item.totalPlatformFee), 0).toFixed(2));
// 计算总广告费用并保留两位小数
    totalAllAdCost.value = parseFloat(order_dataList.value.reduce((total, item) => total + item.totalAdCost, 0).toFixed(2));
// 计算总运费并保留两位小数
    totalALLShippingCost.value = parseFloat(order_dataList.value.reduce((total, item) => total + item.totalShippingCost, 0).toFixed(2));
    totalAllPlatformFee.value = parseFloat(order_dataList.value.reduce((total, item) => total + item.totalPlatformFee, 0).toFixed(2));
    totalSalesAmount.value = parseFloat((totalAmount.value - totalPayment.value).toFixed(2));
    total.value = response.total;
    loading.value = false;
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
    productId: null,
    statisticalDate: null,
    categoryId: null,
    rank: null,
    payingOldBuyers: null,
    payingBuyers: null,
    paidProductQuantity: null,
    pageViews: null,
    orderAmount: null,
    averageStayDuration: null,
    payingNewBuyers: null,
    oldVisitorCount: null,
    paymentConversionRate: null,
    newVisitorCount: null,
    searchExposure: null,
    orderedProductQuantity: null,
    orderingBuyers: null,
    averageOrderValue: null,
    successfulRefundAmount: null,
    tax: null,
    productFavorites: null,
    productAddToCart: null,
    visitorCount: null,
    searchClickThroughRate: null,
    transactionAmount: null,
    paidItemPrice: null,
    paidMainOrders: null,
    orderConversionRate: null,
    orderedMainOrders: null,
    rootCategoryName: null,
    categoryPath: null,
    createdTime: null,
    storeName: null
  };
  proxy.resetForm("order_dataRef");
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
  ids.value = selection.map(item => item.productId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加速卖通分析-店铺维度";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _productId = row.productId || ids.value
  getOrder_data(_productId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改速卖通分析-店铺维度";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["order_dataRef"].validate(valid => {
    if (valid) {
      if (form.value.productId != null) {
        updateOrder_data(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addOrder_data(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

function parseBestSellingCountries(countries) {
  if (typeof countries === 'string') {
    try {
      // 尝试将字符串解析为对象
      const parsed = JSON.parse(countries);
      return parsed;
    } catch (e) {
      console.error('Failed to parse best selling countries:', e);
      return {};
    }
  }
  return countries || {};
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _productIds = row.productId || ids.value;
  proxy.$modal.confirm('是否确认删除速卖通分析-店铺维度编号为"' + _productIds + '"的数据项？').then(function () {
    return delOrder_data(_productIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('order_data/order_data/export', {
    ...queryParams.value
  }, `order_data_${new Date().getTime()}.xlsx`)
}

onMounted(async () => {
  try {
    const storesResponse = await getAllStores();
    stores.value = storesResponse.data;
    console.log('获取的店铺:', stores.value); // 添加调试信息
  } catch (error) {
    console.error('获取数据失败', error);
  }
});

/// 选中的店铺数组
const selectedStores = ref([]);

// 判断店铺是否被选中
const isSelected = (item) => selectedStores.value.includes(item);

// 切换店铺的选中状态
const toggleSelection = (item) => {
  if (isSelected(item)) {
    selectedStores.value = selectedStores.value.filter((store) => store !== item);
  } else {
    selectedStores.value.push(item);
  }
};

// 判断是否所有店铺都被选中
const isAllSelected = computed(() => selectedStores.value.length === stores.value.length);

// 切换全选/取消全选
const toggleAllSelection = () => {
  if (isAllSelected.value) {
    // 如果已经全选，则取消所有选中
    selectedStores.value = [];
  } else {
    // 如果未全选，则选中所有店铺
    selectedStores.value = [...stores.value];
  }
};

// 监听选中的店铺变化并更新 queryParams
watch(
    selectedStores,
    (newSelectedStores) => {
      console.log(selectedStores)
      queryParams.value.storeName = newSelectedStores.join(','); // 数组转换为字符串
      getList(); // 每当店铺选择发生变化时发起请求
    },
    {deep: true} // 确保深度监听数组内部的变化
);

function subtractDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

function subtractMonths(date, months) {
  const result = new Date(date);
  result.setMonth(result.getMonth() - months);
  return result;
}

getList();
</script>
