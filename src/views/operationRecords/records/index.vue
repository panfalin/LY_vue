<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="店铺名称" prop="storeName">
        <el-input v-model="queryParams.storeName" placeholder="请输入店铺名称" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="MSKU" prop="msku">
        <el-input v-model="queryParams.msku" placeholder="请输入MSKU" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="商品一级目录" prop="categoryLevel1">
        <el-input
          v-model="queryParams.categoryLevel1"
          placeholder="请输入商品一级目录"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品二级目录" prop="categoryLevel2">
        <el-input
          v-model="queryParams.categoryLevel2"
          placeholder="请输入商品二级目录"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="FNSKU" prop="fnsku">
        <el-input
          v-model="queryParams.fnsku"
          placeholder="请输入FNSKU"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="本地SKU" prop="localSku">
        <el-input
          v-model="queryParams.localSku"
          placeholder="请输入本地SKU"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="主SKU" prop="mainSku">
        <el-input
          v-model="queryParams.mainSku"
          placeholder="请输入主SKU"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产品名称" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入产品名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="ASIN" prop="asin">
        <el-input
          v-model="queryParams.asin"
          placeholder="请输入ASIN"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="7天销量" prop="sales7Days">
        <el-input
          v-model="queryParams.sales7Days"
          placeholder="请输入7天销量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="14天销量" prop="sales14Days">
        <el-input
          v-model="queryParams.sales14Days"
          placeholder="请输入14天销量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="30天销量" prop="sales30Days">
        <el-input
          v-model="queryParams.sales30Days"
          placeholder="请输入30天销量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="90天销量" prop="sales90Days">
        <el-input
          v-model="queryParams.sales90Days"
          placeholder="请输入90天销量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="日均销量" prop="avgDailySales">
        <el-input
          v-model="queryParams.avgDailySales"
          placeholder="请输入日均销量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="采购在途" prop="procurementInTransit">
        <el-input
          v-model="queryParams.procurementInTransit"
          placeholder="请输入采购在途"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="本地库存" prop="localInventory">
        <el-input
          v-model="queryParams.localInventory"
          placeholder="请输入本地库存"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="可售" prop="available">
        <el-input
          v-model="queryParams.available"
          placeholder="请输入可售"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="待入库" prop="awaitingStock">
        <el-input
          v-model="queryParams.awaitingStock"
          placeholder="请输入待入库"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="在途" prop="inTransit">
        <el-input
          v-model="queryParams.inTransit"
          placeholder="请输入在途"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="可售天数" prop="availableDays">
        <el-input
          v-model="queryParams.availableDays"
          placeholder="请输入可售天数"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="采购天数" prop="procurementDays">
        <el-input
          v-model="queryParams.procurementDays"
          placeholder="请输入采购天数"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计划入库" prop="plannedStockIn">
        <el-input
          v-model="queryParams.plannedStockIn"
          placeholder="请输入计划入库"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="销售员" prop="salesPerson">
        <el-input
          v-model="queryParams.salesPerson"
          placeholder="请输入销售员"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="库存警戒天数" prop="stockWarningDays">
        <el-input
          v-model="queryParams.stockWarningDays"
          placeholder="请输入库存警戒天数"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="供应商" prop="supplier">
        <el-input
          v-model="queryParams.supplier"
          placeholder="请输入供应商"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="成本" prop="cost">
        <el-input
          v-model="queryParams.cost"
          placeholder="请输入成本"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最小采购量" prop="minPurchaseQuantity">
        <el-input
          v-model="queryParams.minPurchaseQuantity"
          placeholder="请输入最小采购量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="AM-季节性产品-淡季【扩展属性】" prop="seasonalProductOffseason">
        <el-input
          v-model="queryParams.seasonalProductOffseason"
          placeholder="请输入AM-季节性产品-淡季【扩展属性】"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="AM-季节性产品-淡季下滑比例【扩展属性】" prop="seasonalProductOffseasonDecline">
        <el-input
          v-model="queryParams.seasonalProductOffseasonDecline"
          placeholder="请输入AM-季节性产品-淡季下滑比例【扩展属性】"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="AM-季节性产品-旺季【扩展属性】" prop="seasonalProductPeak">
        <el-input
          v-model="queryParams.seasonalProductPeak"
          placeholder="请输入AM-季节性产品-旺季【扩展属性】"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="AM-季节性产品-旺季上升比例【扩展属性】" prop="seasonalProductPeakIncrease">
        <el-input
          v-model="queryParams.seasonalProductPeakIncrease"
          placeholder="请输入AM-季节性产品-旺季上升比例【扩展属性】"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="AM-竞对销量【扩展属性】" prop="competitorSales">
        <el-input
          v-model="queryParams.competitorSales"
          placeholder="请输入AM-竞对销量【扩展属性】"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="AM-市场容量【扩展属性】" prop="marketCapacity">
        <el-input
          v-model="queryParams.marketCapacity"
          placeholder="请输入AM-市场容量【扩展属性】"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上架时间" prop="shelfTime">
        <el-input
          v-model="queryParams.shelfTime"
          placeholder="请输入上架时间"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="重塑人" prop="reshaper">
        <el-input
          v-model="queryParams.reshaper"
          placeholder="请输入重塑人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="大类目Rank" prop="categoryRankLarge">
        <el-input
          v-model="queryParams.categoryRankLarge"
          placeholder="请输入大类目Rank"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="小类目Rank" prop="categoryRankSmall">
        <el-input
          v-model="queryParams.categoryRankSmall"
          placeholder="请输入小类目Rank"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="页面浏览次数百分比-合计" prop="pageViewsPercentage">
        <el-input
          v-model="queryParams.pageViewsPercentage"
          placeholder="请输入页面浏览次数百分比-合计"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="页面浏览次数-合计" prop="pageViewsTotal">
        <el-input
          v-model="queryParams.pageViewsTotal"
          placeholder="请输入页面浏览次数-合计"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="转化率" prop="conversionRate">
        <el-input
          v-model="queryParams.conversionRate"
          placeholder="请输入转化率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="广告投入产出比" prop="acos">
        <el-input
          v-model="queryParams.acos"
          placeholder="请输入广告投入产出比"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天销售额" prop="salesLast30Days">
        <el-input
          v-model="queryParams.salesLast30Days"
          placeholder="请输入近30天销售额"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天利润率" prop="profitMarginLast30Days">
        <el-input
          v-model="queryParams.profitMarginLast30Days"
          placeholder="请输入近30天利润率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天退款率" prop="refundRateLast30Days">
        <el-input
          v-model="queryParams.refundRateLast30Days"
          placeholder="请输入近30天退款率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="马帮预测可售天数" prop="forecastAvailableDays">
        <el-input
          v-model="queryParams.forecastAvailableDays"
          placeholder="请输入马帮预测可售天数"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="" prop="fbaAvailableDays">
        <el-input
          v-model="queryParams.fbaAvailableDays"
          placeholder="请输入"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="FBA+本地--可售天数" prop="fbaLocalAvailableDays">
        <el-input
          v-model="queryParams.fbaLocalAvailableDays"
          placeholder="请输入FBA+本地--可售天数"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否需要给采购计划" prop="procurementPlanNeeded">
        <el-input
          v-model="queryParams.procurementPlanNeeded"
          placeholder="请输入是否需要给采购计划"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="对比供应商最低采购个数/淡旺季加权" prop="minPurchaseQuantityComparison">
        <el-input
          v-model="queryParams.minPurchaseQuantityComparison"
          placeholder="请输入对比供应商最低采购个数/淡旺季加权"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="初步预计采购个数" prop="preliminaryPurchaseQuantity">
        <el-input
          v-model="queryParams.preliminaryPurchaseQuantity"
          placeholder="请输入初步预计采购个数"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="对比供应商最低采购个数/淡旺季加权.1" prop="minPurchaseQuantityComparisonTwo">
        <el-input
          v-model="queryParams.minPurchaseQuantityComparisonTwo"
          placeholder="请输入对比供应商最低采购个数/淡旺季加权.1"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="修正计划采购个数" prop="adjustedPurchaseQuantity">
        <el-input
          v-model="queryParams.adjustedPurchaseQuantity"
          placeholder="请输入修正计划采购个数"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计划下采购单日期" prop="procurementOrderDate">
        <el-date-picker clearable
          v-model="queryParams.procurementOrderDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择计划下采购单日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="预估货到本地仓时间" prop="estimatedLocalWarehouseArrival">
        <el-input
          v-model="queryParams.estimatedLocalWarehouseArrival"
          placeholder="请输入预估货到本地仓时间"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="预计FBA货发出时间" prop="estimatedFbaShipment">
        <el-input
          v-model="queryParams.estimatedFbaShipment"
          placeholder="请输入预计FBA货发出时间"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="预计FBA入仓时间" prop="estimatedFbaWarehouse">
        <el-input
          v-model="queryParams.estimatedFbaWarehouse"
          placeholder="请输入预计FBA入仓时间"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="预计FBA上架时间" prop="estimatedFbaShelving">
        <el-input
          v-model="queryParams.estimatedFbaShelving"
          placeholder="请输入预计FBA上架时间"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上架前可售天数" prop="preShelvingAvailableDays">
        <el-input
          v-model="queryParams.preShelvingAvailableDays"
          placeholder="请输入上架前可售天数"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上架后可售天数" prop="postShelvingAvailableDays">
        <el-input
          v-model="queryParams.postShelvingAvailableDays"
          placeholder="请输入上架后可售天数"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="业务建议采购个数【0或者个数】" prop="businessSuggestedPurchaseQuantity">
        <el-input
          v-model="queryParams.businessSuggestedPurchaseQuantity"
          placeholder="请输入业务建议采购个数【0或者个数】"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="业务建议采购付款日期" prop="businessSuggestedPaymentDate">
        <el-date-picker clearable
          v-model="queryParams.businessSuggestedPaymentDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择业务建议采购付款日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="上架后可售天数.1" prop="postShelvingAvailableDaysTwo">
        <el-input
          v-model="queryParams.postShelvingAvailableDaysTwo"
          placeholder="请输入上架后可售天数.1"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="采购金额" prop="procurementAmount">
        <el-input
          v-model="queryParams.procurementAmount"
          placeholder="请输入采购金额"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="运管操作日期" prop="operationsDate">
        <el-date-picker clearable
          v-model="queryParams.operationsDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择运管操作日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="本地库存" prop="localInventoryTwo">
        <el-input
          v-model="queryParams.localInventoryTwo"
          placeholder="请输入本地库存"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="FBA库存" prop="fbaInventory">
        <el-input
          v-model="queryParams.fbaInventory"
          placeholder="请输入FBA库存"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="本地库存金额" prop="localInventoryValue">
        <el-input
          v-model="queryParams.localInventoryValue"
          placeholder="请输入本地库存金额"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="FBA库存金额" prop="fbaInventoryValue">
        <el-input
          v-model="queryParams.fbaInventoryValue"
          placeholder="请输入FBA库存金额"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="总库存金额" prop="totalInventoryValue">
        <el-input
          v-model="queryParams.totalInventoryValue"
          placeholder="请输入总库存金额"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否删除" prop="isDelete">
        <el-input
          v-model="queryParams.isDelete"
          placeholder="请输入是否删除"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createdAt">
        <el-date-picker clearable
          v-model="queryParams.createdAt"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="记录当天有没有新增过记录" prop="version">
        <el-input
          v-model="queryParams.version"
          placeholder="请输入记录当天有没有新增过记录"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd"
          v-hasPermi="['operationRecords:records:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['operationRecords:records:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['operationRecords:records:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['operationRecords:records:export']">导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="Edit" @click="openSelectColumn">选择显示列</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <template>
      <div>
        <!-- <el-form :inline="true" :model="filterForm" class="demo-form-inline">
          <el-form-item v-for="column in columns" :key="column.prop">
            <el-checkbox v-model="visibleColumns" :label="column.prop">{{ column.label }}</el-checkbox>
          </el-form-item>
        </el-form> -->

        <el-table v-loading="loading" :data="recordsList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['operationRecords:records:edit']">修改</el-button>
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                v-hasPermi="['operationRecords:records:remove']">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
    <el-table :data="recordsList" border max-height="600"> style="width: 100%">
      <!-- <el-table-column
        v-for="col of columns"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        align="center"
        header-align="center"
        :min-width="col.minWidth || 'auto'"
        :max-width="col.maxWidth || 'auto'"
        :width="col.width || 'auto'"
        :flex="col.flex || 'auto'" 
      > -->
      <!-- </el-table-column> -->
      <template v-for="col in columns" :key="col.prop">
        <el-table-column
          v-if="col.visible"
          :prop="col.prop"
          :label="col.label"
          :sortable="col.sortable"
          :align="col.align"
          :width="col.width"
          :fixed="col.fixed"
        >
          <template #default="{ row }">
            <el-input
              v-if="row._editing"
              v-model="row[col.prop]"
              size="small"
            ></el-input>
            <span v-else>
              <!-- Custom rendering logic based on column properties -->
              <template v-if="col.custom">
                <span v-if="col.prop === 'procurementOrderDate'">
                  {{ parseTime(row[col.prop], '{y}-{m}-{d}') }}
                </span>
                <!-- Add more custom rendering cases here if needed -->
              </template>
              <template v-else>
                {{ row[col.prop] }}
              </template>
            </span>
          </template>
        </el-table-column>
      </template>
      
              <!-- <el-table-column label="自增id" align="center" prop="id" v-if="showIdColumn" />
      <el-table-column label="店铺名称" fixed sortable align="center" prop="storeName" min-width="150"/>
      <el-table-column label="MSKU" sortable align="center" prop="msku" />
      <el-table-column label="商品一级目录" sortable align="center" prop="categoryLevel1" />
      <el-table-column label="商品二级目录" sortable align="center" prop="categoryLevel2" />
      <el-table-column label="FNSKU" sortable align="center" prop="fnsku" />
      <el-table-column label="本地SKU" sortable align="center" prop="localSku" />
      <el-table-column label="主SKU" sortable align="center" prop="mainSku" />
      <el-table-column label="产品名称" sortable align="center" prop="productName" width="200" show-overflow-tooltip />
      <el-table-column label="ASIN" sortable align="center" prop="asin" />
      <el-table-column label="库存状态" sortable align="center" prop="stockStatus" />
      <el-table-column label="7天销量" sortable align="center" prop="sales7Days" />
      <el-table-column label="14天销量" sortable align="center" prop="sales14Days" />
      <el-table-column label="30天销量" sortable align="center" prop="sales30Days" />
      <el-table-column label="90天销量" sortable align="center" prop="sales90Days" />
      <el-table-column label="日均销量" sortable align="center" prop="avgDailySales" />
      <el-table-column label="采购在途" sortable align="center" prop="procurementInTransit" />
      <el-table-column label="本地库存" sortable align="center" prop="localInventory" />
      <el-table-column label="可售" sortable align="center" prop="available" />
      <el-table-column label="待入库" sortable align="center" prop="awaitingStock" />
      <el-table-column label="在途" sortable align="center" prop="inTransit" />
      <el-table-column label="可售天数" sortable align="center" prop="availableDays" />
      <el-table-column label="采购天数" sortable align="center" prop="procurementDays" />
      <el-table-column label="备注" sortable align="center" prop="remarks" />
      <el-table-column label="预留" sortable align="center" prop="reserved" />
      <el-table-column label="计划入库" sortable align="center" prop="plannedStockIn" />
      <el-table-column label="销售员" sortable align="center" prop="salesPerson" />
      <el-table-column label="库存警戒天数" sortable align="center" prop="stockWarningDays" />
      <el-table-column label="供应商" sortable align="center" prop="supplier" />
      <el-table-column label="成本" sortable align="center" prop="cost" />
      <el-table-column label="生命周期状态" sortable align="center" prop="lifecycleStatus" />
      <el-table-column label="最小采购量" sortable align="center" prop="minPurchaseQuantity" />
      <el-table-column label="AM-季节性产品-淡季【扩展属性】" sortable show-overflow-tooltip min-width = "100" align="center" prop="seasonalProductOffseason" />
      <el-table-column label="AM-季节性产品-淡季下滑比例【扩展属性】" sortable align="center" prop="seasonalProductOffseasonDecline" />
      <el-table-column label="AM-季节性产品-旺季【扩展属性】" sortable align="center" prop="seasonalProductPeak" />
      <el-table-column label="AM-季节性产品-旺季上升比例【扩展属性】" sortable align="center" prop="seasonalProductPeakIncrease" />
      <el-table-column label="AM-竞对销量【扩展属性】" align="center" sortable prop="competitorSales" />
      <el-table-column label="AM-市场容量【扩展属性】" align="center" sortable prop="marketCapacity" />
      <el-table-column label="上架时间" sortable align="center" prop="shelfTime" />
      <el-table-column label="重塑人" sortable align="center" prop="reshaper" />
      <el-table-column label="重塑" align="center" prop="reshaping" />
      <el-table-column label="大类目Rank" align="center" prop="categoryRankLarge" />
      <el-table-column label="小类目Rank" align="center" prop="categoryRankSmall" />
      <el-table-column label="页面浏览次数百分比-合计" align="center" prop="pageViewsPercentage" />
      <el-table-column label="页面浏览次数-合计" align="center" prop="pageViewsTotal" />
      <el-table-column label="转化率" align="center" prop="conversionRate" />
      <el-table-column label="广告投入产出比" align="center" prop="acos" />
      <el-table-column label="近30天销售额" align="center" prop="salesLast30Days" />
      <el-table-column label="近30天利润率" align="center" prop="profitMarginLast30Days" />
      <el-table-column label="近30天退款率" align="center" prop="refundRateLast30Days" />
      <el-table-column label="马帮预测可售天数" align="center" prop="forecastAvailableDays" />
      <el-table-column label="" align="center" prop="fbaAvailableDays" />
      <el-table-column label="FBA库存状态" align="center" prop="fbaStockStatus" />
      <el-table-column label="FBA+本地--可售天数" align="center" prop="fbaLocalAvailableDays" />
      <el-table-column label="是否需要给采购计划" align="center" prop="procurementPlanNeeded" />
      <el-table-column label="对比供应商最低采购个数/淡旺季加权" align="center" prop="minPurchaseQuantityComparison" />
      <el-table-column label="初步预计采购个数" align="center" prop="preliminaryPurchaseQuantity" />
      <el-table-column label="对比供应商最低采购个数/淡旺季加权.1" align="center" prop="minPurchaseQuantityComparisonTwo" />
      <el-table-column label="修正计划采购个数" align="center" prop="adjustedPurchaseQuantity" />
      <el-table-column label="计划下采购单日期" align="center" prop="procurementOrderDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.procurementOrderDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预估货到本地仓时间" align="center" prop="estimatedLocalWarehouseArrival" />
      <el-table-column label="预计FBA货发出时间" align="center" prop="estimatedFbaShipment" />
      <el-table-column label="预计FBA入仓时间" align="center" prop="estimatedFbaWarehouse" />
      <el-table-column label="预计FBA上架时间" align="center" prop="estimatedFbaShelving" />
      <el-table-column label="上架前可售天数" align="center" prop="preShelvingAvailableDays" />
      <el-table-column label="上架后可售天数" align="center" prop="postShelvingAvailableDays" />
      <el-table-column label="业务建议采购个数【0或者个数】" align="center" prop="businessSuggestedPurchaseQuantity" />
      <el-table-column label="业务建议采购付款日期" align="center" prop="businessSuggestedPaymentDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.businessSuggestedPaymentDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上架后可售天数.1" align="center" prop="postShelvingAvailableDaysTwo" />
      <el-table-column label="采购金额" align="center" prop="procurementAmount" />
      <el-table-column label="建议归因类型【利润率，退款率，评价，清仓，停售，销量，新品】" align="center" prop="suggestedAttributionType" />
      <el-table-column label="归因说明和长期打算" align="center" prop="attributionDescription" />
      <el-table-column label="运管操作日期" align="center" prop="operationsDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.operationsDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运管操作记录" align="center" prop="operationsRecord" />
      <el-table-column label="本地库存" align="center" prop="localInventoryTwo" />
      <el-table-column label="FBA库存" align="center" prop="fbaInventory" />
      <el-table-column label="本地库存金额" align="center" prop="localInventoryValue" />
      <el-table-column label="FBA库存金额" align="center" prop="fbaInventoryValue" />
      <el-table-column label="总库存金额" align="center" prop="totalInventoryValue" />
      <el-table-column label="是否删除" align="center" prop="isDelete" v-if="showIdColumn" />
      <el-table-column label="创建时间" align="center" prop="createdAt" width="180" v-if="showIdColumn">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="记录当天有没有新增过记录" align="center" prop="version" v-if="showIdColumn" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" min-width="150">
        <template #default="{row}">
          <el-button v-if="!row._editing" type="primary" icon="Edit" link  @click="editRow(row)" size="small"
            >编辑</el-button
          >
          <el-button v-else  type="warning" icon="Edit" link @click="saveRow(row)" size="small">保存</el-button>
          <!-- <el-button link type="primary" icon="Edit" @click="handleUpdate(row)"
            v-hasPermi="['operationRecords:records:edit']">修改</el-button> -->
          <el-button link type="primary" icon="Delete" @click="handleDelete(row)"
            v-hasPermi="['operationRecords:records:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-table v-loading="loading" :data="recordsList" @selection-change="handleSelectionChange" style="width: 100%" max-height="800">
      <el-table-column v-bind="{ align: 'center', 'show-overflow-tooltip': true }" type="selection" width="55" />
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="自增id" align="center" prop="id" v-if="showIdColumn" />
      <el-table-column label="店铺名称" fixed align="center" prop="storeName" />
      <el-table-column label="MSKU" align="center" prop="msku" />
      <el-table-column label="商品一级目录" align="center" prop="categoryLevel1" />
      <el-table-column label="商品二级目录" align="center" prop="categoryLevel2" />
      <el-table-column label="FNSKU" align="center" prop="fnsku" />
      <el-table-column label="本地SKU" align="center" prop="localSku" />
      <el-table-column label="主SKU" align="center" prop="mainSku" />
      <el-table-column label="产品名称" align="center" prop="productName" width="200" show-overflow-tooltip/>
      <el-table-column label="ASIN" align="center" prop="asin" />
      <el-table-column label="库存状态" align="center" prop="stockStatus" />
      <el-table-column label="7天销量" align="center" prop="sales7Days" />
      <el-table-column label="14天销量" align="center" prop="sales14Days" />
      <el-table-column label="30天销量" align="center" prop="sales30Days" />
      <el-table-column label="90天销量" align="center" prop="sales90Days" />
      <el-table-column label="日均销量" align="center" prop="avgDailySales" />
      <el-table-column label="采购在途" align="center" prop="procurementInTransit" />
      <el-table-column label="本地库存" align="center" prop="localInventory" />
      <el-table-column label="可售" align="center" prop="available" />
      <el-table-column label="待入库" align="center" prop="awaitingStock" />
      <el-table-column label="在途" align="center" prop="inTransit" />
      <el-table-column label="可售天数" align="center" prop="availableDays" />
      <el-table-column label="采购天数" align="center" prop="procurementDays" />
      <el-table-column label="备注" align="center" prop="remarks" />
      <el-table-column label="预留" align="center" prop="reserved" />
      <el-table-column label="计划入库" align="center" prop="plannedStockIn" />
      <el-table-column label="销售员" align="center" prop="salesPerson" />
      <el-table-column label="库存警戒天数" align="center" prop="stockWarningDays" />
      <el-table-column label="供应商" align="center" prop="supplier" />
      <el-table-column label="成本" align="center" prop="cost" />
      <el-table-column label="生命周期状态" align="center" prop="lifecycleStatus" />
      <el-table-column label="最小采购量" align="center" prop="minPurchaseQuantity" />
      <el-table-column label="AM-季节性产品-淡季【扩展属性】" align="center" prop="seasonalProductOffseason" />
      <el-table-column label="AM-季节性产品-淡季下滑比例【扩展属性】" align="center" prop="seasonalProductOffseasonDecline" />
      <el-table-column label="AM-季节性产品-旺季【扩展属性】" align="center" prop="seasonalProductPeak" />
      <el-table-column label="AM-季节性产品-旺季上升比例【扩展属性】" align="center" prop="seasonalProductPeakIncrease" />
      <el-table-column label="AM-竞对销量【扩展属性】" align="center" prop="competitorSales" />
      <el-table-column label="AM-市场容量【扩展属性】" align="center" prop="marketCapacity" />
      <el-table-column label="上架时间" align="center" prop="shelfTime" />
      <el-table-column label="重塑人" align="center" prop="reshaper" />
      <el-table-column label="重塑" align="center" prop="reshaping" />
      <el-table-column label="大类目Rank" align="center" prop="categoryRankLarge" />
      <el-table-column label="小类目Rank" align="center" prop="categoryRankSmall" />
      <el-table-column label="页面浏览次数百分比-合计" align="center" prop="pageViewsPercentage" />
      <el-table-column label="页面浏览次数-合计" align="center" prop="pageViewsTotal" />
      <el-table-column label="转化率" align="center" prop="conversionRate" />
      <el-table-column label="广告投入产出比" align="center" prop="acos" />
      <el-table-column label="近30天销售额" align="center" prop="salesLast30Days" />
      <el-table-column label="近30天利润率" align="center" prop="profitMarginLast30Days" />
      <el-table-column label="近30天退款率" align="center" prop="refundRateLast30Days" />
      <el-table-column label="马帮预测可售天数" align="center" prop="forecastAvailableDays" />
      <el-table-column label="" align="center" prop="fbaAvailableDays" />
      <el-table-column label="FBA库存状态" align="center" prop="fbaStockStatus" />
      <el-table-column label="FBA+本地--可售天数" align="center" prop="fbaLocalAvailableDays" />
      <el-table-column label="是否需要给采购计划" align="center" prop="procurementPlanNeeded" />
      <el-table-column label="对比供应商最低采购个数/淡旺季加权" align="center" prop="minPurchaseQuantityComparison" />
      <el-table-column label="初步预计采购个数" align="center" prop="preliminaryPurchaseQuantity" />
      <el-table-column label="对比供应商最低采购个数/淡旺季加权.1" align="center" prop="minPurchaseQuantityComparisonTwo" />
      <el-table-column label="修正计划采购个数" align="center" prop="adjustedPurchaseQuantity" />
      <el-table-column label="计划下采购单日期" align="center" prop="procurementOrderDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.procurementOrderDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预估货到本地仓时间" align="center" prop="estimatedLocalWarehouseArrival" />
      <el-table-column label="预计FBA货发出时间" align="center" prop="estimatedFbaShipment" />
      <el-table-column label="预计FBA入仓时间" align="center" prop="estimatedFbaWarehouse" />
      <el-table-column label="预计FBA上架时间" align="center" prop="estimatedFbaShelving" />
      <el-table-column label="上架前可售天数" align="center" prop="preShelvingAvailableDays" />
      <el-table-column label="上架后可售天数" align="center" prop="postShelvingAvailableDays" />
      <el-table-column label="业务建议采购个数【0或者个数】" align="center" prop="businessSuggestedPurchaseQuantity" />
      <el-table-column label="业务建议采购付款日期" align="center" prop="businessSuggestedPaymentDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.businessSuggestedPaymentDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上架后可售天数.1" align="center" prop="postShelvingAvailableDaysTwo" />
      <el-table-column label="采购金额" align="center" prop="procurementAmount" />
      <el-table-column label="建议归因类型【利润率，退款率，评价，清仓，停售，销量，新品】" align="center" prop="suggestedAttributionType" />
      <el-table-column label="归因说明和长期打算" align="center" prop="attributionDescription" />
      <el-table-column label="运管操作日期" align="center" prop="operationsDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.operationsDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运管操作记录" align="center" prop="operationsRecord" />
      <el-table-column label="本地库存" align="center" prop="localInventoryTwo" />
      <el-table-column label="FBA库存" align="center" prop="fbaInventory" />
      <el-table-column label="本地库存金额" align="center" prop="localInventoryValue" />
      <el-table-column label="FBA库存金额" align="center" prop="fbaInventoryValue" />
      <el-table-column label="总库存金额" align="center" prop="totalInventoryValue" />
      <el-table-column label="是否删除" align="center" prop="isDelete" v-if="showIdColumn" />
      <el-table-column label="创建时间" align="center" prop="createdAt" width="180" v-if="showIdColumn">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="记录当天有没有新增过记录" align="center" prop="version" v-if="showIdColumn" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['operationRecords:records:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['operationRecords:records:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table> -->

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改操作记录对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" min-height="400px" append-to-body>
      <el-form ref="recordsRef" :model="form" :rules="rules" label-width="300px" class="fixed-height-form">
        <el-form-item label="店铺名称" prop="storeName">
          <el-input v-model="form.storeName" placeholder="请输入店铺名称" />
        </el-form-item>
        <el-form-item label="MSKU" prop="msku">
          <el-input v-model="form.msku" placeholder="请输入MSKU" />
        </el-form-item>
        <el-form-item label="商品一级目录" prop="categoryLevel1">
          <el-input v-model="form.categoryLevel1" placeholder="请输入商品一级目录" />
        </el-form-item>
        <el-form-item label="商品二级目录" prop="categoryLevel2">
          <el-input v-model="form.categoryLevel2" placeholder="请输入商品二级目录" />
        </el-form-item>
        <el-form-item label="FNSKU" prop="fnsku">
          <el-input v-model="form.fnsku" placeholder="请输入FNSKU" />
        </el-form-item>
        <el-form-item label="本地SKU" prop="localSku">
          <el-input v-model="form.localSku" placeholder="请输入本地SKU" />
        </el-form-item>
        <el-form-item label="主SKU" prop="mainSku">
          <el-input v-model="form.mainSku" placeholder="请输入主SKU" />
        </el-form-item>
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="ASIN" prop="asin">
          <el-input v-model="form.asin" placeholder="请输入ASIN" />
        </el-form-item>
        <el-form-item label="7天销量" prop="sales7Days">
          <el-input v-model="form.sales7Days" placeholder="请输入7天销量" />
        </el-form-item>
        <el-form-item label="14天销量" prop="sales14Days">
          <el-input v-model="form.sales14Days" placeholder="请输入14天销量" />
        </el-form-item>
        <el-form-item label="30天销量" prop="sales30Days">
          <el-input v-model="form.sales30Days" placeholder="请输入30天销量" />
        </el-form-item>
        <el-form-item label="90天销量" prop="sales90Days">
          <el-input v-model="form.sales90Days" placeholder="请输入90天销量" />
        </el-form-item>
        <el-form-item label="日均销量" prop="avgDailySales">
          <el-input v-model="form.avgDailySales" placeholder="请输入日均销量" />
        </el-form-item>
        <el-form-item label="采购在途" prop="procurementInTransit">
          <el-input v-model="form.procurementInTransit" placeholder="请输入采购在途" />
        </el-form-item>
        <el-form-item label="本地库存" prop="localInventory">
          <el-input v-model="form.localInventory" placeholder="请输入本地库存" />
        </el-form-item>
        <el-form-item label="可售" prop="available">
          <el-input v-model="form.available" placeholder="请输入可售" />
        </el-form-item>
        <el-form-item label="待入库" prop="awaitingStock">
          <el-input v-model="form.awaitingStock" placeholder="请输入待入库" />
        </el-form-item>
        <el-form-item label="在途" prop="inTransit">
          <el-input v-model="form.inTransit" placeholder="请输入在途" />
        </el-form-item>
        <el-form-item label="可售天数" prop="availableDays">
          <el-input v-model="form.availableDays" placeholder="请输入可售天数" />
        </el-form-item>
        <el-form-item label="采购天数" prop="procurementDays">
          <el-input v-model="form.procurementDays" placeholder="请输入采购天数" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="预留" prop="reserved">
          <el-input v-model="form.reserved" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="计划入库" prop="plannedStockIn">
          <el-input v-model="form.plannedStockIn" placeholder="请输入计划入库" />
        </el-form-item>
        <el-form-item label="销售员" prop="salesPerson">
          <el-input v-model="form.salesPerson" placeholder="请输入销售员" />
        </el-form-item>
        <el-form-item label="库存警戒天数" prop="stockWarningDays">
          <el-input v-model="form.stockWarningDays" placeholder="请输入库存警戒天数" />
        </el-form-item>
        <el-form-item label="供应商" prop="supplier">
          <el-input v-model="form.supplier" placeholder="请输入供应商" />
        </el-form-item>
        <el-form-item label="成本" prop="cost">
          <el-input v-model="form.cost" placeholder="请输入成本" />
        </el-form-item>
        <el-form-item label="最小采购量" prop="minPurchaseQuantity">
          <el-input v-model="form.minPurchaseQuantity" placeholder="请输入最小采购量" />
        </el-form-item>
        <el-form-item label="AM-季节性产品-淡季【扩展属性】" prop="seasonalProductOffseason">
          <el-input v-model="form.seasonalProductOffseason" placeholder="请输入AM-季节性产品-淡季【扩展属性】" />
        </el-form-item>
        <el-form-item label="AM-季节性产品-淡季下滑比例【扩展属性】" prop="seasonalProductOffseasonDecline">
          <el-input v-model="form.seasonalProductOffseasonDecline" placeholder="请输入AM-季节性产品-淡季下滑比例【扩展属性】" />
        </el-form-item>
        <el-form-item label="AM-季节性产品-旺季【扩展属性】" prop="seasonalProductPeak">
          <el-input v-model="form.seasonalProductPeak" placeholder="请输入AM-季节性产品-旺季【扩展属性】" />
        </el-form-item>
        <el-form-item label="AM-季节性产品-旺季上升比例【扩展属性】" prop="seasonalProductPeakIncrease">
          <el-input v-model="form.seasonalProductPeakIncrease" placeholder="请输入AM-季节性产品-旺季上升比例【扩展属性】" />
        </el-form-item>
        <el-form-item label="AM-竞对销量【扩展属性】" prop="competitorSales">
          <el-input v-model="form.competitorSales" placeholder="请输入AM-竞对销量【扩展属性】" />
        </el-form-item>
        <el-form-item label="AM-市场容量【扩展属性】" prop="marketCapacity">
          <el-input v-model="form.marketCapacity" placeholder="请输入AM-市场容量【扩展属性】" />
        </el-form-item>
        <el-form-item label="上架时间" prop="shelfTime">
              <el-date-picker v-model="form.shelfTime" type="date" placeholder="请选择上架时间" format="YYYY-MM-DD"
                style="width: 100%;" />
        </el-form-item>
        <el-form-item label="重塑人" prop="reshaper">
          <el-input v-model="form.reshaper" placeholder="请输入重塑人" />
        </el-form-item>
        <el-form-item label="重塑" prop="reshaping">
          <el-input v-model="form.reshaping" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="大类目Rank" prop="categoryRankLarge">
          <el-input v-model="form.categoryRankLarge" placeholder="请输入大类目Rank" />
        </el-form-item>
        <el-form-item label="小类目Rank" prop="categoryRankSmall">
          <el-input v-model="form.categoryRankSmall" placeholder="请输入小类目Rank" />
        </el-form-item>
        <el-form-item label="页面浏览次数百分比-合计" prop="pageViewsPercentage">
          <el-input v-model="form.pageViewsPercentage" placeholder="请输入页面浏览次数百分比-合计" />
        </el-form-item>
        <el-form-item label="页面浏览次数-合计" prop="pageViewsTotal">
          <el-input v-model="form.pageViewsTotal" placeholder="请输入页面浏览次数-合计" />
        </el-form-item>
        <el-form-item label="转化率" prop="conversionRate">
          <el-input v-model="form.conversionRate" placeholder="请输入转化率" />
        </el-form-item>
        <el-form-item label="广告投入产出比" prop="acos">
          <el-input v-model="form.acos" placeholder="请输入广告投入产出比" />
        </el-form-item>
        <el-form-item label="近30天销售额" prop="salesLast30Days">
          <el-input v-model="form.salesLast30Days" placeholder="请输入近30天销售额" />
        </el-form-item>
        <el-form-item label="近30天利润率" prop="profitMarginLast30Days">
          <el-input v-model="form.profitMarginLast30Days" placeholder="请输入近30天利润率" />
        </el-form-item>
        <el-form-item label="近30天退款率" prop="refundRateLast30Days">
          <el-input v-model="form.refundRateLast30Days" placeholder="请输入近30天退款率" />
        </el-form-item>
        <el-form-item label="马帮预测可售天数" prop="forecastAvailableDays">
          <el-input v-model="form.forecastAvailableDays" placeholder="请输入马帮预测可售天数" />
        </el-form-item>
        <el-form-item label="(可售FBA+FBA待入库+预留+FBA在途)/日均" prop="fbaAvailableDays">
          <el-input v-model="form.fbaAvailableDays" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="FBA+本地--可售天数" prop="fbaLocalAvailableDays">
          <el-input v-model="form.fbaLocalAvailableDays" placeholder="请输入FBA+本地--可售天数" />
        </el-form-item>
        <el-form-item label="是否需要给采购计划" prop="procurementPlanNeeded">
          <el-input v-model="form.procurementPlanNeeded" placeholder="请输入是否需要给采购计划" />
        </el-form-item>
        <el-form-item label="对比供应商最低采购个数/淡旺季加权" prop="minPurchaseQuantityComparison">
          <el-input v-model="form.minPurchaseQuantityComparison" placeholder="请输入对比供应商最低采购个数/淡旺季加权" />
        </el-form-item>
        <el-form-item label="初步预计采购个数" prop="preliminaryPurchaseQuantity">
          <el-input v-model="form.preliminaryPurchaseQuantity" placeholder="请输入初步预计采购个数" />
        </el-form-item>
        <el-form-item label="对比供应商最低采购个数/淡旺季加权.1" prop="minPurchaseQuantityComparisonTwo">
          <el-input v-model="form.minPurchaseQuantityComparisonTwo" placeholder="请输入对比供应商最低采购个数/淡旺季加权.1" />
        </el-form-item>
        <el-form-item label="修正计划采购个数" prop="adjustedPurchaseQuantity">
          <el-input v-model="form.adjustedPurchaseQuantity" placeholder="请输入修正计划采购个数" />
        </el-form-item>
        <el-form-item label="计划下采购单日期" prop="procurementOrderDate">
          <el-date-picker clearable v-model="form.procurementOrderDate" type="date" value-format="YYYY-MM-DD"
            placeholder="请选择计划下采购单日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预估货到本地仓时间" prop="estimatedLocalWarehouseArrival">
          <el-input v-model="form.estimatedLocalWarehouseArrival" placeholder="请输入预估货到本地仓时间" />
        </el-form-item>
        <el-form-item label="预计FBA货发出时间" prop="estimatedFbaShipment">
          <el-input v-model="form.estimatedFbaShipment" placeholder="请输入预计FBA货发出时间" />
        </el-form-item>
        <el-form-item label="预计FBA入仓时间" prop="estimatedFbaWarehouse">
          <el-input v-model="form.estimatedFbaWarehouse" placeholder="请输入预计FBA入仓时间" />
        </el-form-item>
        <el-form-item label="预计FBA上架时间" prop="estimatedFbaShelving">
          <el-input v-model="form.estimatedFbaShelving" placeholder="请输入预计FBA上架时间" />
        </el-form-item>
        <el-form-item label="上架前可售天数" prop="preShelvingAvailableDays">
          <el-input v-model="form.preShelvingAvailableDays" placeholder="请输入上架前可售天数" />
        </el-form-item>
        <el-form-item label="上架后可售天数" prop="postShelvingAvailableDays">
          <el-input v-model="form.postShelvingAvailableDays" placeholder="请输入上架后可售天数" />
        </el-form-item>
        <el-form-item label="业务建议采购个数【0或者个数】" prop="businessSuggestedPurchaseQuantity">
          <el-input v-model="form.businessSuggestedPurchaseQuantity" placeholder="请输入业务建议采购个数【0或者个数】" />
        </el-form-item>
        <el-form-item label="业务建议采购付款日期" prop="businessSuggestedPaymentDate">
          <el-date-picker clearable v-model="form.businessSuggestedPaymentDate" type="date" value-format="YYYY-MM-DD"
            placeholder="请选择业务建议采购付款日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上架后可售天数.1" prop="postShelvingAvailableDaysTwo">
          <el-input v-model="form.postShelvingAvailableDaysTwo" placeholder="请输入上架后可售天数.1" />
        </el-form-item>
        <el-form-item label="采购金额" prop="procurementAmount">
          <el-input v-model="form.procurementAmount" placeholder="请输入采购金额" />
        </el-form-item>
        <el-form-item label="归因说明和长期打算" prop="attributionDescription">
          <el-input v-model="form.attributionDescription" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="运管操作日期" prop="operationsDate">
          <el-date-picker clearable v-model="form.operationsDate" type="date" value-format="YYYY-MM-DD"
            placeholder="请选择运管操作日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="运管操作记录" prop="operationsRecord">
          <el-input v-model="form.operationsRecord" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="本地库存" prop="localInventoryTwo">
          <el-input v-model="form.localInventoryTwo" placeholder="请输入本地库存" />
        </el-form-item>
        <el-form-item label="FBA库存" prop="fbaInventory">
          <el-input v-model="form.fbaInventory" placeholder="请输入FBA库存" />
        </el-form-item>
        <el-form-item label="本地库存金额" prop="localInventoryValue">
          <el-input v-model="form.localInventoryValue" placeholder="请输入本地库存金额" />
        </el-form-item>
        <el-form-item label="FBA库存金额" prop="fbaInventoryValue">
          <el-input v-model="form.fbaInventoryValue" placeholder="请输入FBA库存金额" />
        </el-form-item>
        <el-form-item label="总库存金额" prop="totalInventoryValue">
          <el-input v-model="form.totalInventoryValue" placeholder="请输入总库存金额" />
        </el-form-item>
        <el-form-item label="是否删除" prop="isDelete" v-if="showIdColumn">
          <el-input v-model="form.isDelete" placeholder="请输入是否删除" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createdAt" v-if="showIdColumn">
          <el-date-picker clearable v-model="form.createdAt" type="date" value-format="YYYY-MM-DD" placeholder="请选择创建时间"
            v-if="showIdColumn">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="记录当天有没有新增过记录" prop="version" v-if="showIdColumn">
          <el-input v-model="form.version" placeholder="请输入记录当天有没有新增过记录" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="columnDialogVisible" title="选择可见列">
      <div class="dialog-content">
        <el-checkbox-group
          v-model="visibleColumns"
          @change="handleVisibleColumnsChange"
        >
          <el-checkbox
            v-for="column in columns"
            :label="column.prop"
            :key="column.prop"
          >
            {{ column.label }}
          </el-checkbox>
        </el-checkbox-group>
        <div class="dialog-buttons">
          <el-button @click="selectAllColumns">全部可见</el-button>
          <el-button @click="selectNoColumns">全部隐藏</el-button>
          <el-button @click="closeDialog">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="Records">
  import {ref} from 'vue'
import { listRecords, getRecords, delRecords, addRecords, updateRecords } from "@/api/operationRecords/records";

const { proxy } = getCurrentInstance();

const recordsList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const showIdColumn = ref(false); // 控制列是否显示

const columnDialogVisible = ref(false)
const visibleColumns = ref([])

// 定义所有列
const columns = ref([
  { prop: 'storeName', label: '店铺名称', sortable: true, align: 'center', fixed: 'left', minWidth: 150, fixed: 'left', visible: true },
  { prop: 'msku', label: 'MSKU', sortable: true, align: 'center',  visible: true },
  { prop: 'categoryLevel1', label: '商品一级目录', sortable: true, align: 'center', visible: true },
  { prop: 'categoryLevel2', label: '商品二级目录', sortable: true, align: 'center', visible: true },
  { prop: 'fnsku', label: 'FNSKU', sortable: true, align: 'center', visible: true },
  { prop: 'localSku', label: '本地SKU', sortable: true, align: 'center', visible: true },
  { prop: 'mainSku', label: '主SKU', sortable: true, align: 'center', visible: true },
  { prop: 'productName', label: '产品名称', sortable: true, align: 'center', width: 200, showOverflowTooltip: true, visible: true },
  { prop: 'asin', label: 'ASIN', sortable: true, align: 'center', visible: true },
  { prop: 'stockStatus', label: '库存状态', sortable: true, align: 'center', visible: true },
  { prop: 'sales7Days', label: '7天销量', sortable: true, align: 'center', visible: true },
  { prop: 'sales14Days', label: '14天销量', sortable: true, align: 'center', visible: true },
  { prop: 'sales30Days', label: '30天销量', sortable: true, align: 'center', visible: true },
  { prop: 'sales90Days', label: '90天销量', sortable: true, align: 'center', visible: true },
  { prop: 'avgDailySales', label: '日均销量', sortable: true, align: 'center', visible: true },
  { prop: 'procurementInTransit', label: '采购在途', sortable: true, align: 'center', visible: true },
  { prop: 'localInventory', label: '本地库存', sortable: true, align: 'center', visible: true },
  { prop: 'available', label: '可售', sortable: true, align: 'center', visible: true },
  { prop: 'awaitingStock', label: '待入库', sortable: true, align: 'center', visible: true },
  { prop: 'inTransit', label: '在途', sortable: true, align: 'center', visible: true },
  { prop: 'availableDays', label: '可售天数', sortable: true, align: 'center', visible: true },
  { prop: 'procurementDays', label: '采购天数', sortable: true, align: 'center', visible: true },
  { prop: 'remarks', label: '备注', sortable: true, align: 'center', visible: true },
  { prop: 'reserved', label: '预留', sortable: true, align: 'center', visible: true },
  { prop: 'plannedStockIn', label: '计划入库', sortable: true, align: 'center', visible: true },
  { prop: 'salesPerson', label: '销售员', sortable: true, align: 'center', visible: true },
  { prop: 'stockWarningDays', label: '库存警戒天数', sortable: true, align: 'center', visible: true },
  { prop: 'supplier', label: '供应商', sortable: true, align: 'center', visible: true },
  { prop: 'cost', label: '成本', sortable: true, align: 'center', visible: true },
  { prop: 'lifecycleStatus', label: '生命周期状态', sortable: true, align: 'center', visible: true },
  { prop: 'minPurchaseQuantity', label: '最小采购量', sortable: true, align: 'center', visible: true },
  { prop: 'seasonalProductOffseason', label: 'AM-季节性产品-淡季【扩展属性】', sortable: true, align: 'center', minWidth: 100, showOverflowTooltip: true, visible: true },
  { prop: 'seasonalProductOffseasonDecline', label: 'AM-季节性产品-淡季下滑比例【扩展属性】', sortable: true, align: 'center', visible: true },
  { prop: 'seasonalProductPeak', label: 'AM-季节性产品-旺季【扩展属性】', sortable: true, align: 'center', visible: true },
  { prop: 'seasonalProductPeakIncrease', label: 'AM-季节性产品-旺季上升比例【扩展属性】', sortable: true, align: 'center', visible: true },
  { prop: 'competitorSales', label: 'AM-竞对销量【扩展属性】', sortable: true, align: 'center', visible: true },
  { prop: 'marketCapacity', label: 'AM-市场容量【扩展属性】', sortable: true, align: 'center', visible: true },
  { prop: 'shelfTime', label: '上架时间', sortable: true, align: 'center', visible: true },
  { prop: 'reshaper', label: '重塑人', sortable: true, align: 'center', visible: true },
  { prop: 'reshaping', label: '重塑', sortable: true, align: 'center', visible: true },
  { prop: 'categoryRankLarge', label: '大类目Rank', sortable: true, align: 'center', visible: true },
  { prop: 'categoryRankSmall', label: '小类目Rank', sortable: true, align: 'center', visible: true },
  { prop: 'pageViewsPercentage', label: '页面浏览次数百分比-合计', sortable: true, align: 'center', visible: true },
  { prop: 'pageViewsTotal', label: '页面浏览次数-合计', sortable: true, align: 'center', visible: true },
  { prop: 'conversionRate', label: '转化率', sortable: true, align: 'center', visible: true },
  { prop: 'acos', label: '广告投入产出比', sortable: true, align: 'center', visible: true },
  { prop: 'salesLast30Days', label: '近30天销售额', sortable: true, align: 'center', visible: true },
  { prop: 'profitMarginLast30Days', label: '近30天利润率', sortable: true, align: 'center', visible: true },
  { prop: 'refundRateLast30Days', label: '近30天退款率', sortable: true, align: 'center', visible: true },
  { prop: 'forecastAvailableDays', label: '马帮预测可售天数', sortable: true, align: 'center', visible: true },
  { prop: 'fbaAvailableDays', label: '本地库存金额', sortable: true, align: 'center', visible: true },
  { prop: 'fbaStockStatus', label: 'FBA库存状态', sortable: true, align: 'center', visible: true },
  { prop: 'fbaLocalAvailableDays', label: 'FBA+本地--可售天数', sortable: true, align: 'center', visible: true },
  { prop: 'procurementPlanNeeded', label: '是否需要给采购计划', sortable: true, align: 'center', visible: true },
  { prop: 'minPurchaseQuantityComparison', label: '对比供应商最低采购个数/淡旺季加权', sortable: true, align: 'center', visible: true },
  { prop: 'preliminaryPurchaseQuantity', label: '初步预计采购个数', sortable: true, align: 'center', visible: true },
  { prop: 'minPurchaseQuantityComparisonTwo', label: '对比供应商最低采购个数/淡旺季加权.1', sortable: true, align: 'center', visible: true },
  { prop: 'adjustedPurchaseQuantity', label: '修正计划采购个数', sortable: true, align: 'center', visible: true },
  { prop: 'procurementOrderDate', label: '计划下采购单日期', sortable: true, align: 'center', width: 180, custom: true, visible: true },
  { prop: 'estimatedLocalWarehouseArrival', label: '预估货到本地仓时间', sortable: true, custom: true, align: 'center', visible: true },
  { prop: 'estimatedFbaShipment', label: '预计FBA货发出时间', sortable: true, custom: true, align: 'center', visible: true },
  { prop: 'estimatedFbaWarehouse', label: '预计FBA入仓时间', sortable: true, custom: true, align: 'center', visible: true },
  { prop: 'estimatedFbaShelving', label: '预计FBA上架时间', sortable: true, custom: true, align: 'center', visible: true },
  { prop: 'preShelvingAvailableDays', label: '上架前可售天数', sortable: true, align: 'center', visible: true },
  { prop: 'postShelvingAvailableDays', label: '上架后可售天数', sortable: true, align: 'center', visible: true },
  { prop: 'businessSuggestedPurchaseQuantity', label: '业务建议采购个数【0或者个数】', sortable: true, align: 'center', visible: true },
  { prop: 'businessSuggestedPaymentDate', label: '业务建议采购付款日期', sortable: true, align: 'center', width: 180, custom: true, visible: true },
  { prop: 'postShelvingAvailableDaysTwo', label: '上架后可售天数.1', sortable: true, align: 'center', visible: true },
  { prop: 'procurementAmount', label: '采购金额', sortable: true, align: 'center', visible: true },
  { prop: 'suggestedAttributionType', label: '建议归因类型【利润率，退款率，评价，清仓，停售，销量，新品】', sortable: true, align: 'center', visible: true },
  { prop: 'attributionDescription', label: '归因说明和长期打算', sortable: true, align: 'center', visible: true },
  { prop: 'operationsDate', label: '运管操作日期', sortable: true, align: 'center', width: 180, custom: true, visible: true },
  { prop: 'operationsRecord', label: '运管操作记录', sortable: true, align: 'center', visible: true },
  { prop: 'localInventoryTwo', label: '本地库存', sortable: true, align: 'center', visible: true },
  { prop: 'fbaInventory', label: 'FBA库存', sortable: true, align: 'center', visible: true },
  { prop: 'localInventoryValue', label: '本地库存金额', sortable: true, align: 'center', visible: true },
  { prop: 'fbaInventoryValue', label: 'FBA库存金额', sortable: true, align: 'center', visible: true },
  { prop: 'totalInventoryValue', label: '总库存金额', sortable: true, align: 'center', visible: true },

]);


// 改成编辑状态
const editRow = (row) => {
  row._editing = true
}

// 保存行数据
const saveRow = (row) => {
  row._editing = false
}

const openSelectColumn = () => {
      
      visibleColumns.value = columns.value
      .filter((column) => column.visible)
      .map((column) => column.prop)

    columnDialogVisible.value = true


    
  }

  const handleVisibleColumnsChange = (val) => {
    columns.value.forEach((column) => {
      column.visible = val.includes(column.prop)
    })
  }
// 选择全部可见列
const selectAllColumns = () => {
  visibleColumns.value = columns.value.map(col => col.prop);
  handleVisibleColumnsChange(visibleColumns.value);
};

// 选择全部隐藏列
const selectNoColumns = () => {
  visibleColumns.value = [];
  handleVisibleColumnsChange(visibleColumns.value);
};

// 关闭对话框
const closeDialog = () => {
  columnDialogVisible.value = false;
};

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    storeName: null,
    msku: null,
    categoryLevel1: null,
    categoryLevel2: null,
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
    inTransit: null,
    availableDays: null,
    procurementDays: null,
    remarks: null,
    reserved: null,
    plannedStockIn: null,
    salesPerson: null,
    stockWarningDays: null,
    supplier: null,
    cost: null,
    lifecycleStatus: null,
    minPurchaseQuantity: null,
    seasonalProductOffseason: null,
    seasonalProductOffseasonDecline: null,
    seasonalProductPeak: null,
    seasonalProductPeakIncrease: null,
    competitorSales: null,
    marketCapacity: null,
    shelfTime: null,
    reshaper: null,
    reshaping: null,
    categoryRankLarge: null,
    categoryRankSmall: null,
    pageViewsPercentage: null,
    pageViewsTotal: null,
    conversionRate: null,
    acos: null,
    salesLast30Days: null,
    profitMarginLast30Days: null,
    refundRateLast30Days: null,
    forecastAvailableDays: null,
    fbaAvailableDays: null,
    fbaStockStatus: null,
    fbaLocalAvailableDays: null,
    procurementPlanNeeded: null,
    minPurchaseQuantityComparison: null,
    preliminaryPurchaseQuantity: null,
    minPurchaseQuantityComparisonTwo: null,
    adjustedPurchaseQuantity: null,
    procurementOrderDate: null,
    estimatedLocalWarehouseArrival: null,
    estimatedFbaShipment: null,
    estimatedFbaWarehouse: null,
    estimatedFbaShelving: null,
    preShelvingAvailableDays: null,
    postShelvingAvailableDays: null,
    businessSuggestedPurchaseQuantity: null,
    businessSuggestedPaymentDate: null,
    postShelvingAvailableDaysTwo: null,
    procurementAmount: null,
    suggestedAttributionType: null,
    attributionDescription: null,
    operationsDate: null,
    operationsRecord: null,
    localInventoryTwo: null,
    fbaInventory: null,
    localInventoryValue: null,
    fbaInventoryValue: null,
    totalInventoryValue: null,
    isDelete: null,
    createdAt: null,
    version: null
  },
  rules: {
    isDelete: [
      { required: true, message: "是否删除不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询操作记录列表 */
function getList() {
  loading.value = true;
  listRecords(queryParams.value).then(response => {
    response.rows.forEach(item => {
      item._editing = false;
    })
    recordsList.value = response.rows;
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
    id: null,
    storeName: null,
    msku: null,
    categoryLevel1: null,
    categoryLevel2: null,
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
    inTransit: null,
    availableDays: null,
    procurementDays: null,
    remarks: null,
    reserved: null,
    plannedStockIn: null,
    salesPerson: null,
    stockWarningDays: null,
    supplier: null,
    cost: null,
    lifecycleStatus: null,
    minPurchaseQuantity: null,
    seasonalProductOffseason: null,
    seasonalProductOffseasonDecline: null,
    seasonalProductPeak: null,
    seasonalProductPeakIncrease: null,
    competitorSales: null,
    marketCapacity: null,
    shelfTime: null,
    reshaper: null,
    reshaping: null,
    categoryRankLarge: null,
    categoryRankSmall: null,
    pageViewsPercentage: null,
    pageViewsTotal: null,
    conversionRate: null,
    acos: null,
    salesLast30Days: null,
    profitMarginLast30Days: null,
    refundRateLast30Days: null,
    forecastAvailableDays: null,
    fbaAvailableDays: null,
    fbaStockStatus: null,
    fbaLocalAvailableDays: null,
    procurementPlanNeeded: null,
    minPurchaseQuantityComparison: null,
    preliminaryPurchaseQuantity: null,
    minPurchaseQuantityComparisonTwo: null,
    adjustedPurchaseQuantity: null,
    procurementOrderDate: null,
    estimatedLocalWarehouseArrival: null,
    estimatedFbaShipment: null,
    estimatedFbaWarehouse: null,
    estimatedFbaShelving: null,
    preShelvingAvailableDays: null,
    postShelvingAvailableDays: null,
    businessSuggestedPurchaseQuantity: null,
    businessSuggestedPaymentDate: null,
    postShelvingAvailableDaysTwo: null,
    procurementAmount: null,
    suggestedAttributionType: null,
    attributionDescription: null,
    operationsDate: null,
    operationsRecord: null,
    localInventoryTwo: null,
    fbaInventory: null,
    localInventoryValue: null,
    fbaInventoryValue: null,
    totalInventoryValue: null,
    isDelete: null,
    createdAt: null,
    updateTime: null,
    createBy: null,
    updateBy: null,
    version: null
  };
  proxy.resetForm("recordsRef");
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
  title.value = "添加操作记录";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getRecords(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改操作记录";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["recordsRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateRecords(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addRecords(form.value).then(response => {
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
  const msku = row.msku
  proxy.$modal.confirm('是否确认删除编号为"' + msku + '"的数据项？').then(function () {
    return delRecords(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('operationRecords/records/export', {
    ...queryParams.value
  }, `records_${new Date().getTime()}.xlsx`)
}

// 表头部重新渲染
function renderHeader(h, { column, $index }) {
			// 新建一个 span
			let span = document.createElement('span');
			// 设置表头名称
			span.innerText = column.label;
			// 临时插入 document
			document.body.appendChild(span);
			// 重点：获取 span 最小宽度，设置当前列，注意这里加了 20，字段较多时还是有挤压，且渲染后的 div 内左右 padding 都是 10，所以 +20 。（可能还有边距/边框等值，需要根据实际情况加上）
			column.minWidth = span.getBoundingClientRect().width + 20;
			// 移除 document 中临时的 span
			document.body.removeChild(span);
			return h('span', column.label);
		}


getList();
</script>
