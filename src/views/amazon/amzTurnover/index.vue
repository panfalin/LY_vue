<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="店铺名称" prop="msku">
        <el-input
            v-model="queryParams.storeName"
            placeholder="请输入店铺名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="MSKU" prop="msku">
        <el-input
            v-model="queryParams.msku"
            placeholder="请输入MSKU"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品一级目录" prop="categoryLevelOne">
        <el-input
            v-model="queryParams.categoryLevelOne"
            placeholder="请输入商品一级目录"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品二级目录" prop="categoryLevelTwo">
        <el-input
            v-model="queryParams.categoryLevelTwo"
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
      <el-form-item label="库存SKU" prop="sku">
        <el-input
            v-model="queryParams.sku"
            placeholder="请输入库存SKU"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <!--      <el-form-item label="仓库名称" prop="warehouseName">
              <el-input
                v-model="queryParams.warehouseName"
                placeholder="请输入仓库名称"
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
            <el-form-item label="AM-季节性产品-淡季【扩展属性】" prop="amSeasonalProductOffseason">
              <el-input
                v-model="queryParams.amSeasonalProductOffseason"
                placeholder="请输入AM-季节性产品-淡季【扩展属性】"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="AM-季节性产品-旺季上升比例【扩展属性】" prop="amSeasonalProductPeakIncreaseRatio">
              <el-input
                v-model="queryParams.amSeasonalProductPeakIncreaseRatio"
                placeholder="请输入AM-季节性产品-旺季上升比例【扩展属性】"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="AM-季节性产品-旺季【扩展属性】" prop="amSeasonalProductPeak">
              <el-input
                v-model="queryParams.amSeasonalProductPeak"
                placeholder="请输入AM-季节性产品-旺季【扩展属性】"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="AM-竞对销量【扩展属性】" prop="amCompetitorSales">
              <el-input
                v-model="queryParams.amCompetitorSales"
                placeholder="请输入AM-竞对销量【扩展属性】"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="AM-市场容量【扩展属性】" prop="amMarketCapacity">
              <el-input
                v-model="queryParams.amMarketCapacity"
                placeholder="请输入AM-市场容量【扩展属性】"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="AM-季节性产品-淡季下滑比例【扩展属性】" prop="amSeasonalProductOffseasonDecline">
              <el-input
                v-model="queryParams.amSeasonalProductOffseasonDecline"
                placeholder="请输入AM-季节性产品-淡季下滑比例【扩展属性】"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="供应商名称" prop="supplierName">
              <el-input
                v-model="queryParams.supplierName"
                placeholder="请输入供应商名称"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="最新采购价" prop="latestPurchasePrice">
              <el-input
                v-model="queryParams.latestPurchasePrice"
                placeholder="请输入最新采购价"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="重量" prop="weight">
              <el-input
                v-model="queryParams.weight"
                placeholder="请输入重量"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="体积(cm³)" prop="volumeCm3">
              <el-input
                v-model="queryParams.volumeCm3"
                placeholder="请输入体积(cm³)"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="仓库最小采购量" prop="minPurchaseQuantity">
              <el-input
                v-model="queryParams.minPurchaseQuantity"
                placeholder="请输入仓库最小采购量"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="AMZ-库存上架时间【扩展属性】" prop="amzInventoryShelfTime">
              <el-input
                v-model="queryParams.amzInventoryShelfTime"
                placeholder="请输入AMZ-库存上架时间【扩展属性】"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="重塑人【扩展属性】" prop="reshaper">
              <el-input
                v-model="queryParams.reshaper"
                placeholder="请输入重塑人【扩展属性】"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="重塑【扩展属性】" prop="reshaping">
              <el-input
                v-model="queryParams.reshaping"
                placeholder="请输入重塑【扩展属性】"
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
            <el-form-item label="备注" prop="remarks">
              <el-input
                v-model="queryParams.remarks"
                placeholder="请输入备注"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="预留" prop="reserved">
              <el-input
                v-model="queryParams.reserved"
                placeholder="请输入预留"
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
            </el-form-item>-->
      <el-form-item label="销售员" prop="salesPerson">
        <el-input
            v-model="queryParams.salesPerson"
            placeholder="请输入销售员"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开发员" prop="developer">
        <el-input
            v-model="queryParams.developer"
            placeholder="请输入开发员"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上架时间" prop="listingDate">
        <el-input
            v-model="queryParams.listingDate"
            placeholder="请输入上架时间"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <!--      <el-form-item label="是否删除" prop="isDelete">
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
                v-hasPermi="['amazon:amzTurnover:add']"
              >新增</el-button>
            </el-col>-->
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['amazon:amzTurnover:edit']"
        >修改
        </el-button>
      </el-col>
      <!--      <el-col :span="1.5">
              <el-button
                type="danger"
                plain
                icon="Delete"
                :disabled="multiple"
                @click="handleDelete"
                v-hasPermi="['amazon:amzTurnover:remove']"
              >删除</el-button>
            </el-col>-->
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['amazon:amzTurnover:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
        v-loading="loading"
        :data="amzTurnoverList"
        height="500"
        style="min-width: 1500px;"
        :estimated-row-height="40"
        highlight-current-row
        border
        @selection-change="handleSelectionChange"
        :default-sort="{ prop: 'storeName', order: 'ascending' }"
        @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="店铺名称" align="center" sortable prop="storeName" fixed min-width="120"/>
      <el-table-column label="商品信息" align="center" sortable prop="msku" fixed min-width="200">
        <!-- 表头 -->
        <template #header>
          <div style="text-align: center;">
            <div>商品信息</div>
            <div style="font-size: 12px; color: #909399;">
              (MSKU / ASIN / FNSKU / 本地SKU / 主SKU)
            </div>
          </div>
        </template>
        <!-- 单元格内容 -->
        <template #default="scope">
          <div style="text-align: left;">
            <div><strong>MSKU:</strong> {{ scope.row.msku }}</div>
            <div><strong>ASIN:</strong> {{ scope.row.asin }}</div>
            <div><strong>FNSKU:</strong> {{ scope.row.fnsku }}</div>
            <div><strong>本地SKU:</strong> {{ scope.row.localSku }}</div>
            <div><strong>主SKU:</strong> {{ scope.row.mainSku }}</div>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="MSKU" align="center" sortable prop="msku" /> -->
      <!-- <el-table-column label="FNSKU" align="center" sortable prop="fnsku" /> -->
      <!-- <el-table-column label="本地SKU" align="center" sortable prop="localSku" /> -->
      <!-- <el-table-column label="主SKU" align="center" sortable prop="mainSku" /> -->
      <!-- <el-table-column label="ASIN" align="center" sortable prop="asin" /> -->
      <el-table-column label="商品一级目录" align="center" prop="categoryLevelOne" min-width="150"/>
      <el-table-column label="商品二级目录" align="center" prop="categoryLevelTwo" min-width="150"/>
      <!-- 这里暂时先注释掉，等会恢复 -->
      <el-table-column label="产品名称" align="center" prop="productName" min-width="250">
        <template #default="scope">
          <div style="white-space: pre-line; word-break: break-all;">{{ scope.row.productName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="库存状态" align="center" prop="stockStatus" min-width="120"/>
      <!-- 这里是销量相关的字段 -->
      <el-table-column label="销量(7/14/30/90)" align="center" sortable
                       :sort-by="['sales7Days', 'sales14Days', 'sales30Days', 'sales90Days']" min-width="180">
        <template #header>
          <div style="text-align: left;">
            <div>
              销量(7/14/30/90)
              <i class="el-icon-caret-top"></i>
              <i class="el-icon-caret-bottom"></i>
            </div>
          </div>
        </template>
        <template #default="scope">
          <div>7天: {{ scope.row.sales7Days }}</div>
          <div>14天: {{ scope.row.sales14Days }}</div>
          <div>30天: {{ scope.row.sales30Days }}</div>
          <div>90天: {{ scope.row.sales90Days }}</div>
        </template>
      </el-table-column>
      <el-table-column label="日均销量" align="center" prop="avgDailySales"/>
      <el-table-column label="本地库存" align="center">
        <el-table-column label="采购在途" align="center" prop="procurementInTransit"/>
        <el-table-column label="本地库存" align="center" prop="localInventory"/>
      </el-table-column>
      <el-table-column label="FBA库存" align="center">
        <el-table-column label="可售" align="center" prop="available"/>
        <el-table-column label="待入库" align="center" prop="awaitingStock"/>
        <el-table-column label="在途" align="center" prop="inTransit"/>
      </el-table-column>
      <!--库存SKU这个字段没有，并没有在这里显示-->
      <!--<el-table-column label="库存SKU" align="center" prop="sku"/>-->
      <el-table-column label="SKU信息模板" align="center">
        <el-table-column label="仓库名称" align="center" prop="warehouseName"/>
        <el-table-column label="库存警戒天数" align="center" prop="stockWarningDays"/>
        <el-table-column label="AM-季节性产品-淡季【扩展属性】" align="center" prop="amSeasonalProductOffseason"/>
        <el-table-column label="AM-季节性产品-旺季上升比例【扩展属性】" align="center"
                         prop="amSeasonalProductPeakIncreaseRatio"/>
        <el-table-column label="AM-季节性产品-旺季【扩展属性】" align="center" prop="amSeasonalProductPeak"/>
        <el-table-column label="AM-竞对销量【扩展属性】" align="center" prop="amCompetitorSales"/>
        <el-table-column label="AM-市场容量【扩展属性】" align="center" prop="amMarketCapacity"/>
        <el-table-column label="AM-产品生命周期状态【扩展属性】" align="center" prop="amProductLifecycleStatus"/>
        <el-table-column label="AM-季节性产品-淡季下滑比例【扩展属性】" align="center"
                         prop="amSeasonalProductOffseasonDecline"/>
        <el-table-column label="供应商名称" align="center" prop="supplierName"/>
        <el-table-column label="最新采购价" align="center" prop="latestPurchasePrice"/>
        <el-table-column label="重量" align="center" prop="weight"/>
        <el-table-column label="体积(cm³)" align="center" prop="volumeCm3"/>
        <el-table-column label="仓库最小采购量" align="center" prop="minPurchaseQuantity"/>
        <el-table-column label="AMZ-库存上架时间【扩展属性】" align="center" prop="amzInventoryShelfTime"/>
        <el-table-column label="重塑人【扩展属性】" align="center" prop="reshaper"/>
        <el-table-column label="重塑【扩展属性】" align="center" prop="reshaping"/>
      </el-table-column>
      <el-table-column label="可售天数" align="center" prop="availableDays"/>
      <el-table-column label="采购天数" align="center" prop="procurementDays"/>
      <el-table-column label="备注" align="center" prop="remarks"/>
      <el-table-column label="预留" align="center" prop="reserved"/>
      <el-table-column label="计划入库" align="center" prop="plannedStockIn"/>
      <el-table-column label="销售员" align="center" prop="salesPerson"/>
      <el-table-column label="开发员" align="center" prop="developer"/>
      <el-table-column label="上架时间" align="center" prop="listingDate"/>
      <el-table-column label="操作" fixed="right" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['amazon:amzTurnover:edit']">详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- 添加或修改亚马逊数据分析，周转率，mskulist，这个是基础信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="amzTurnoverRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="MSKU" prop="msku">
          <el-input v-model="form.msku" placeholder="请输入MSKU"/>
        </el-form-item>
        <el-form-item label="商品一级目录" prop="categoryLevelOne">
          <el-input v-model="form.categoryLevelOne" placeholder="请输入商品一级目录"/>
        </el-form-item>
        <el-form-item label="商品二级目录" prop="categoryLevelTwo">
          <el-input v-model="form.categoryLevelTwo" placeholder="请输入商品二级目录"/>
        </el-form-item>
        <el-form-item label="FNSKU" prop="fnsku">
          <el-input v-model="form.fnsku" placeholder="请输入FNSKU"/>
        </el-form-item>
        <el-form-item label="本地SKU" prop="localSku">
          <el-input v-model="form.localSku" placeholder="请输入本地SKU"/>
        </el-form-item>
        <el-form-item label="主SKU" prop="mainSku">
          <el-input v-model="form.mainSku" placeholder="请输入主SKU"/>
        </el-form-item>
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入产品名称"/>
        </el-form-item>
        <el-form-item label="ASIN" prop="asin">
          <el-input v-model="form.asin" placeholder="请输入ASIN"/>
        </el-form-item>
        <el-form-item label="7天销量" prop="sales7Days">
          <el-input v-model="form.sales7Days" placeholder="请输入7天销量"/>
        </el-form-item>
        <el-form-item label="14天销量" prop="sales14Days">
          <el-input v-model="form.sales14Days" placeholder="请输入14天销量"/>
        </el-form-item>
        <el-form-item label="30天销量" prop="sales30Days">
          <el-input v-model="form.sales30Days" placeholder="请输入30天销量"/>
        </el-form-item>
        <el-form-item label="90天销量" prop="sales90Days">
          <el-input v-model="form.sales90Days" placeholder="请输入90天销量"/>
        </el-form-item>
        <el-form-item label="日均销量" prop="avgDailySales">
          <el-input v-model="form.avgDailySales" placeholder="请输入日均销量"/>
        </el-form-item>
        <el-form-item label="采购在途" prop="procurementInTransit">
          <el-input v-model="form.procurementInTransit" placeholder="请输入采购在途"/>
        </el-form-item>
        <el-form-item label="本地库存" prop="localInventory">
          <el-input v-model="form.localInventory" placeholder="请输入本地库存"/>
        </el-form-item>
        <el-form-item label="可售" prop="available">
          <el-input v-model="form.available" placeholder="请输入可售"/>
        </el-form-item>
        <el-form-item label="待入库" prop="awaitingStock">
          <el-input v-model="form.awaitingStock" placeholder="请输入待入库"/>
        </el-form-item>
        <el-form-item label="库存SKU" prop="sku">
          <el-input v-model="form.sku" placeholder="请输入库存SKU"/>
        </el-form-item>
        <el-form-item label="仓库名称" prop="warehouseName">
          <el-input v-model="form.warehouseName" placeholder="请输入仓库名称"/>
        </el-form-item>
        <el-form-item label="库存警戒天数" prop="stockWarningDays">
          <el-input v-model="form.stockWarningDays" placeholder="请输入库存警戒天数"/>
        </el-form-item>
        <el-form-item label="AM-季节性产品-淡季【扩展属性】" prop="amSeasonalProductOffseason">
          <el-input v-model="form.amSeasonalProductOffseason" placeholder="请输入AM-季节性产品-淡季【扩展属性】"/>
        </el-form-item>
        <el-form-item label="AM-季节性产品-旺季上升比例【扩展属性】" prop="amSeasonalProductPeakIncreaseRatio">
          <el-input v-model="form.amSeasonalProductPeakIncreaseRatio"
                    placeholder="请输入AM-季节性产品-旺季上升比例【扩展属性】"/>
        </el-form-item>
        <el-form-item label="AM-季节性产品-旺季【扩展属性】" prop="amSeasonalProductPeak">
          <el-input v-model="form.amSeasonalProductPeak" placeholder="请输入AM-季节性产品-旺季【扩展属性】"/>
        </el-form-item>
        <el-form-item label="AM-竞对销量【扩展属性】" prop="amCompetitorSales">
          <el-input v-model="form.amCompetitorSales" placeholder="请输入AM-竞对销量【扩展属性】"/>
        </el-form-item>
        <el-form-item label="AM-市场容量【扩展属性】" prop="amMarketCapacity">
          <el-input v-model="form.amMarketCapacity" placeholder="请输入AM-市场容量【扩展属性】"/>
        </el-form-item>
        <el-form-item label="AM-季节性产品-淡季下滑比例【扩展属性】" prop="amSeasonalProductOffseasonDecline">
          <el-input v-model="form.amSeasonalProductOffseasonDecline"
                    placeholder="请输入AM-季节性产品-淡季下滑比例【扩展属性】"/>
        </el-form-item>
        <el-form-item label="供应商名称" prop="supplierName">
          <el-input v-model="form.supplierName" placeholder="请输入供应商名称"/>
        </el-form-item>
        <el-form-item label="最新采购价" prop="latestPurchasePrice">
          <el-input v-model="form.latestPurchasePrice" placeholder="请输入最新采购价"/>
        </el-form-item>
        <el-form-item label="重量" prop="weight">
          <el-input v-model="form.weight" placeholder="请输入重量"/>
        </el-form-item>
        <el-form-item label="体积(cm³)" prop="volumeCm3">
          <el-input v-model="form.volumeCm3" placeholder="请输入体积(cm³)"/>
        </el-form-item>
        <el-form-item label="仓库最小采购量" prop="minPurchaseQuantity">
          <el-input v-model="form.minPurchaseQuantity" placeholder="请输入仓库最小采购量"/>
        </el-form-item>
        <el-form-item label="AMZ-库存上架时间【扩展属性】" prop="amzInventoryShelfTime">
          <el-input v-model="form.amzInventoryShelfTime" placeholder="请输入AMZ-库存上架时间【扩展属性】"/>
        </el-form-item>
        <el-form-item label="重塑人【扩展属性】" prop="reshaper">
          <el-input v-model="form.reshaper" placeholder="请输入重塑人【扩展属性】"/>
        </el-form-item>
        <el-form-item label="重塑【扩展属性】" prop="reshaping">
          <el-input v-model="form.reshaping" placeholder="请输入重塑【扩展属性】"/>
        </el-form-item>
        <el-form-item label="在途" prop="inTransit">
          <el-input v-model="form.inTransit" placeholder="请输入在途"/>
        </el-form-item>
        <el-form-item label="可售天数" prop="availableDays">
          <el-input v-model="form.availableDays" placeholder="请输入可售天数"/>
        </el-form-item>
        <el-form-item label="采购天数" prop="procurementDays">
          <el-input v-model="form.procurementDays" placeholder="请输入采购天数"/>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" placeholder="请输入备注"/>
        </el-form-item>
        <el-form-item label="预留" prop="reserved">
          <el-input v-model="form.reserved" placeholder="请输入预留"/>
        </el-form-item>
        <el-form-item label="计划入库" prop="plannedStockIn">
          <el-input v-model="form.plannedStockIn" placeholder="请输入计划入库"/>
        </el-form-item>
        <el-form-item label="销售员" prop="salesPerson">
          <el-input v-model="form.salesPerson" placeholder="请输入销售员"/>
        </el-form-item>
        <el-form-item label="开发员" prop="developer">
          <el-input v-model="form.developer" placeholder="请输入开发员"/>
        </el-form-item>
        <el-form-item label="上架时间" prop="listingDate">
          <el-input v-model="form.listingDate" placeholder="请输入上架时间"/>
        </el-form-item>
        <el-form-item label="是否删除" prop="isDelete">
          <el-input v-model="form.isDelete" placeholder="请输入是否删除"/>
        </el-form-item>
        <el-form-item label="创建时间" prop="createdAt">
          <el-date-picker clearable
                          v-model="form.createdAt"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="记录当天有没有新增过记录" prop="version">
          <el-input v-model="form.version" placeholder="请输入记录当天有没有新增过记录"/>
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

<script setup name="AmzTurnover">
import {
  listAmzTurnover,
  getAmzTurnover,
  delAmzTurnover,
  addAmzTurnover,
  updateAmzTurnover
} from "@/api/amazon/amzTurnover";
import router from "@/router/index.js";
import {ref, onMounted} from 'vue';
import {useRoute} from 'vue-router';
import { useAmzTurnoverStore } from '@/store/modules/amzTurnover';

const route = useRoute();
const store = useAmzTurnoverStore();
const {proxy} = getCurrentInstance();

const amzTurnoverList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const queryParams = ref({});

const data = reactive({
  form: {},
  rules: {
    sku: [
      {required: true, message: "库存SKU不能为空", trigger: "blur"}
    ],
    isDelete: [
      {required: true, message: "是否删除不能为空", trigger: "blur"}
    ],
  }
});

const {form, rules} = toRefs(data);

// 初始化查询表单
onMounted(() => {
  // 优先使用路由参数，如果没有则使用存储的参数
  const routeParams = {
    storeName: route.query.storeName,
    categoryLevelOne: route.query.categoryLevelOne,
    categoryLevelTwo: route.query.categoryLevelTwo,
    available: route.query.available,
    awaitingStock: route.query.awaitingStock,
    salesPerson: route.query.salesPerson,
    developer: route.query.developer,
    listingDate: route.query.listingDate
  };

  // 如果有路由参数，使用路由参数，否则使用存储的参数
  const hasRouteParams = Object.values(routeParams).some(val => val !== undefined);
  
  queryParams.value = {
    ...(hasRouteParams ? routeParams : store.listQueryParams),
    pageNum: 1,
    pageSize: 10
  };

  handleQuery();
});

/** 查询亚马逊数据分析，周转率，mskulist，这个是基础信息列表 */
function getList() {
  loading.value = true;
  listAmzTurnover(queryParams.value).then(response => {
    amzTurnoverList.value = response.rows;
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
    categoryLevelOne: null,
    categoryLevelTwo: null,
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
    sku: null,
    warehouseName: null,
    stockWarningDays: null,
    amSeasonalProductOffseason: null,
    amSeasonalProductPeakIncreaseRatio: null,
    amSeasonalProductPeak: null,
    amCompetitorSales: null,
    amMarketCapacity: null,
    amProductLifecycleStatus: null,
    amSeasonalProductOffseasonDecline: null,
    supplierName: null,
    latestPurchasePrice: null,
    weight: null,
    volumeCm3: null,
    minPurchaseQuantity: null,
    amzInventoryShelfTime: null,
    reshaper: null,
    reshaping: null,
    inTransit: null,
    availableDays: null,
    procurementDays: null,
    remarks: null,
    reserved: null,
    plannedStockIn: null,
    salesPerson: null,
    developer: null,
    listingDate: null,
    isDelete: null,
    createdAt: null,
    updateTime: null,
    createBy: null,
    updateBy: null,
    version: null
  };
  proxy.resetForm("amzTurnoverRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  // 保存查询参数到 store
  store.setListQueryParams(queryParams.value);
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  queryParams.value = {
    pageNum: 1,
    pageSize: 10
  };
  // 清除存储的参数
  store.setListQueryParams(queryParams.value);
  handleQuery();
}

/** 排序变化处理函数 */
function handleSortChange({prop, order}) {
  // 根据排序的字段和顺序更新查询参数
  queryParams.value.sortField = prop;
  queryParams.value.sortOrder = order;
  getList();  // 重新获取列表数据
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
  title.value = "添加亚马逊数据分析，周转率，mskulist，这个是基础信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  const _id = row.id || ids.value[0];  // 取第一个选中项的id
  getAmzTurnover(_id).then(response => {
    form.value = response.data;
    // 使用导入的router进行跳转
    router.push({
      path: `/amzTurnover/detail/${_id}`
    });
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["amzTurnoverRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateAmzTurnover(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addAmzTurnover(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除亚马逊数据分析，周转率，mskulist，这个是基础信息编号为"' + _ids + '"的数据项？').then(function () {
    return delAmzTurnover(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('amazon/amzTurnover/export', {
    ...queryParams.value
  }, `amzTurnover_${new Date().getTime()}.xlsx`)
}

getList();
</script>
