<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="亚马逊标准识别号" prop="ASIN" label-width="150">
        <el-input v-model="queryParams.ASIN" placeholder="请输入亚马逊标准识别号" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="马帮SKU" prop="MSKU" label-width="200">
        <el-input v-model="queryParams.MSKU" placeholder="请输入马帮SKU" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="销售部门" prop="Sales">
        <el-input
          v-model="queryParams.Sales"
          placeholder="请输入销售部门"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开发部门" prop="Development">
        <el-input
          v-model="queryParams.Development"
          placeholder="请输入开发部门"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="美工部门" prop="Designer">
        <el-input
          v-model="queryParams.Designer"
          placeholder="请输入美工部门"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上架时间" prop="ListingDate">
        <el-input
          v-model="queryParams.ListingDate"
          placeholder="请输入上架时间"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="自定义标签" prop="CustomTags">
        <el-input
          v-model="queryParams.CustomTags"
          placeholder="请输入自定义标签"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="SKU更新日志" prop="SKULog">
        <el-input
          v-model="queryParams.SKULog"
          placeholder="请输入SKU更新日志"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分析类别" prop="AnalysisCategory">
        <el-input
          v-model="queryParams.AnalysisCategory"
          placeholder="请输入分析类别"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="竞对ASIN" prop="CompetitorASIN">
        <el-input
          v-model="queryParams.CompetitorASIN"
          placeholder="请输入竞对ASIN"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="竞对品牌" prop="CompetitorBrand">
        <el-input
          v-model="queryParams.CompetitorBrand"
          placeholder="请输入竞对品牌"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="竞对小类目排名" prop="CompetitorSubRank">
        <el-input
          v-model="queryParams.CompetitorSubRank"
          placeholder="请输入竞对小类目排名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="竞对大类目排名" prop="CompetitorMainRank">
        <el-input
          v-model="queryParams.CompetitorMainRank"
          placeholder="请输入竞对大类目排名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="竞对月均销量" prop="CompetitorMonthlySales">
        <el-input
          v-model="queryParams.CompetitorMonthlySales"
          placeholder="请输入竞对月均销量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="竞对日均销量" prop="CompetitorDailySales">
        <el-input
          v-model="queryParams.CompetitorDailySales"
          placeholder="请输入竞对日均销量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="竞对售价" prop="CompetitorPrice">
        <el-input
          v-model="queryParams.CompetitorPrice"
          placeholder="请输入竞对售价"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="竞对毛利率" prop="CompetitorGrossMargin">
        <el-input
          v-model="queryParams.CompetitorGrossMargin"
          placeholder="请输入竞对毛利率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="竞对日均毛利" prop="CompetitorDailyProfit">
        <el-input
          v-model="queryParams.CompetitorDailyProfit"
          placeholder="请输入竞对日均毛利"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="竞对变体" prop="CompetitorVariants">
        <el-input
          v-model="queryParams.CompetitorVariants"
          placeholder="请输入竞对变体"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="竞对上架日期" prop="CompetitorListingDate">
        <el-input
          v-model="queryParams.CompetitorListingDate"
          placeholder="请输入竞对上架日期"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="竞对评论数" prop="CompetitorReviews">
        <el-input
          v-model="queryParams.CompetitorReviews"
          placeholder="请输入竞对评论数"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="竞对星级评分" prop="CompetitorRating">
        <el-input
          v-model="queryParams.CompetitorRating"
          placeholder="请输入竞对星级评分"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="竞对文案质量" prop="CompetitorCopyQuality">
        <el-input
          v-model="queryParams.CompetitorCopyQuality"
          placeholder="请输入竞对文案质量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="竞对是否重铺" prop="CompetitorRelisting">
        <el-input
          v-model="queryParams.CompetitorRelisting"
          placeholder="请输入竞对是否重铺"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="竞对ASIN-2" prop="CompetitorASIN2">
        <el-input
          v-model="queryParams.CompetitorASIN2"
          placeholder="请输入竞对ASIN-2"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="市场月容量" prop="MarketMonthlyCapacity">
        <el-input
          v-model="queryParams.MarketMonthlyCapacity"
          placeholder="请输入市场月容量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="目标日均销量" prop="TargetDailySales">
        <el-input
          v-model="queryParams.TargetDailySales"
          placeholder="请输入目标日均销量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="目标售价" prop="TargetPrice">
        <el-input
          v-model="queryParams.TargetPrice"
          placeholder="请输入目标售价"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="目标日均销售额" prop="TargetDailyRevenue">
        <el-input
          v-model="queryParams.TargetDailyRevenue"
          placeholder="请输入目标日均销售额"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="目标毛利率" prop="TargetGrossMargin">
        <el-input
          v-model="queryParams.TargetGrossMargin"
          placeholder="请输入目标毛利率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="目标日利润" prop="TargetDailyProfit">
        <el-input
          v-model="queryParams.TargetDailyProfit"
          placeholder="请输入目标日利润"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="目标小类目排名" prop="TargetSubRank">
        <el-input
          v-model="queryParams.TargetSubRank"
          placeholder="请输入目标小类目排名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="目标大类目排名" prop="TargetMainRank">
        <el-input
          v-model="queryParams.TargetMainRank"
          placeholder="请输入目标大类目排名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="目标资金使用率" prop="TargetCapitalUtilization">
        <el-input
          v-model="queryParams.TargetCapitalUtilization"
          placeholder="请输入目标资金使用率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上一个月利润" prop="LastMonthProfit">
        <el-input
          v-model="queryParams.LastMonthProfit"
          placeholder="请输入上一个月利润"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上月日均利润" prop="LastMonthDailyProfit">
        <el-input
          v-model="queryParams.LastMonthDailyProfit"
          placeholder="请输入上月日均利润"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天目标总利润" prop="TargetLast30DaysTotalProfit">
        <el-input
          v-model="queryParams.TargetLast30DaysTotalProfit"
          placeholder="请输入近30天目标总利润"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天实际总利润" prop="ActualLast30DaysTotalProfit">
        <el-input
          v-model="queryParams.ActualLast30DaysTotalProfit"
          placeholder="请输入近30天实际总利润"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近14天实际总利润" prop="ActualLast14DaysTotalProfit">
        <el-input
          v-model="queryParams.ActualLast14DaysTotalProfit"
          placeholder="请输入近14天实际总利润"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近7天实际总利润" prop="ActualLast7DaysTotalProfit">
        <el-input
          v-model="queryParams.ActualLast7DaysTotalProfit"
          placeholder="请输入近7天实际总利润"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天总库存金额" prop="TotalInventoryAmountLast30Days">
        <el-input
          v-model="queryParams.TotalInventoryAmountLast30Days"
          placeholder="请输入近30天总库存金额"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天资金利用率" prop="CapitalUtilizationLast30Days">
        <el-input
          v-model="queryParams.CapitalUtilizationLast30Days"
          placeholder="请输入近30天资金利用率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近7天销量" prop="ActualLast7DaysSales">
        <el-input
          v-model="queryParams.ActualLast7DaysSales"
          placeholder="请输入近7天销量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上个月总销售额" prop="LastMonthTotalSales">
        <el-input
          v-model="queryParams.LastMonthTotalSales"
          placeholder="请输入上个月总销售额"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上月日均销售额" prop="LastMonthDailySales">
        <el-input
          v-model="queryParams.LastMonthDailySales"
          placeholder="请输入上月日均销售额"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天目标销售额" prop="TargetLast30DaysTotalSales">
        <el-input
          v-model="queryParams.TargetLast30DaysTotalSales"
          placeholder="请输入近30天目标销售额"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天实际销售额" prop="ActualLast30DaysTotalSales">
        <el-input
          v-model="queryParams.ActualLast30DaysTotalSales"
          placeholder="请输入近30天实际销售额"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近14天实际销售额" prop="ActualLast14DaysTotalSales">
        <el-input
          v-model="queryParams.ActualLast14DaysTotalSales"
          placeholder="请输入近14天实际销售额"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近7天实际销售额" prop="ActualLast7DaysTotalSales">
        <el-input
          v-model="queryParams.ActualLast7DaysTotalSales"
          placeholder="请输入近7天实际销售额"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分析-执行-复盘" prop="AnalysisExecutionReview">
        <el-input
          v-model="queryParams.AnalysisExecutionReview"
          placeholder="请输入分析-执行-复盘"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上个月利润率" prop="LastMonthProfitRate">
        <el-input
          v-model="queryParams.LastMonthProfitRate"
          placeholder="请输入上个月利润率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天目标利润率" prop="TargetLast30DaysProfitRate">
        <el-input
          v-model="queryParams.TargetLast30DaysProfitRate"
          placeholder="请输入近30天目标利润率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天利润率" prop="ActualLast30DaysProfitRate">
        <el-input
          v-model="queryParams.ActualLast30DaysProfitRate"
          placeholder="请输入近30天利润率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近14天利润率" prop="ActualLast14DaysProfitRate">
        <el-input
          v-model="queryParams.ActualLast14DaysProfitRate"
          placeholder="请输入近14天利润率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近7天利润率" prop="ActualLast7DaysProfitRate">
        <el-input
          v-model="queryParams.ActualLast7DaysProfitRate"
          placeholder="请输入近7天利润率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分析-执行-复盘" prop="AnalysisExecutionReview2">
        <el-input
          v-model="queryParams.AnalysisExecutionReview2"
          placeholder="请输入分析-执行-复盘"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上个月月库存周转天数" prop="LastMonthInventoryTurnoverDays">
        <el-input
          v-model="queryParams.LastMonthInventoryTurnoverDays"
          placeholder="请输入上个月月库存周转天数"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="当月目标库存周转天数" prop="CurrentTargetInventoryTurnoverDays">
        <el-input
          v-model="queryParams.CurrentTargetInventoryTurnoverDays"
          placeholder="请输入当月目标库存周转天数"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近7天周转天数库存" prop="ActualLast7DaysInventoryTurnoverDays">
        <el-input
          v-model="queryParams.ActualLast7DaysInventoryTurnoverDays"
          placeholder="请输入近7天周转天数库存"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分析-执行-复盘" prop="AnalysisExecutionReview3">
        <el-input
          v-model="queryParams.AnalysisExecutionReview3"
          placeholder="请输入分析-执行-复盘"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近14天广告计划-预算" prop="TargetLast14DaysAdBudget">
        <el-input
          v-model="queryParams.TargetLast14DaysAdBudget"
          placeholder="请输入近14天广告计划-预算"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近14天广告实际消耗" prop="ActualLast14DaysAdSpending">
        <el-input
          v-model="queryParams.ActualLast14DaysAdSpending"
          placeholder="请输入近14天广告实际消耗"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天总广告花费" prop="TotalAdSpendingLast30Days">
        <el-input
          v-model="queryParams.TotalAdSpendingLast30Days"
          placeholder="请输入近30天总广告花费"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上一个月广告花费占比" prop="LastMonthAdSpendingRatio">
        <el-input
          v-model="queryParams.LastMonthAdSpendingRatio"
          placeholder="请输入上一个月广告花费占比"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="30天【目标】广告花费占比" prop="TargetLast30DaysAdSpendingRatio">
        <el-input
          v-model="queryParams.TargetLast30DaysAdSpendingRatio"
          placeholder="请输入30天【目标】广告花费占比"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天广告花费占比" prop="ActualLast30DaysAdSpendingRatio">
        <el-input
          v-model="queryParams.ActualLast30DaysAdSpendingRatio"
          placeholder="请输入近30天广告花费占比"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近14天广告花费占比" prop="ActualLast14DaysAdSpendingRatio">
        <el-input
          v-model="queryParams.ActualLast14DaysAdSpendingRatio"
          placeholder="请输入近14天广告花费占比"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近7天广告花费占比" prop="ActualLast7DaysAdSpendingRatio">
        <el-input
          v-model="queryParams.ActualLast7DaysAdSpendingRatio"
          placeholder="请输入近7天广告花费占比"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天广告曝光" prop="TotalAdExposureLast30Days">
        <el-input
          v-model="queryParams.TotalAdExposureLast30Days"
          placeholder="请输入近30天广告曝光"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近14天广告曝光" prop="TotalAdExposureLast14Days">
        <el-input
          v-model="queryParams.TotalAdExposureLast14Days"
          placeholder="请输入近14天广告曝光"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近7天广告曝光" prop="TotalAdExposureLast7Days">
        <el-input
          v-model="queryParams.TotalAdExposureLast7Days"
          placeholder="请输入近7天广告曝光"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天广告点击量" prop="TotalAdClicksLast30Days">
        <el-input
          v-model="queryParams.TotalAdClicksLast30Days"
          placeholder="请输入近30天广告点击量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近14天广告点击量" prop="TotalAdClicksLast14Days">
        <el-input
          v-model="queryParams.TotalAdClicksLast14Days"
          placeholder="请输入近14天广告点击量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近7天广告点击量" prop="TotalAdClicksLast7Days">
        <el-input
          v-model="queryParams.TotalAdClicksLast7Days"
          placeholder="请输入近7天广告点击量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天广告转化率" prop="AdConversionRateLast30Days">
        <el-input
          v-model="queryParams.AdConversionRateLast30Days"
          placeholder="请输入近30天广告转化率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近14天广告转化率" prop="AdConversionRateLast14Days">
        <el-input
          v-model="queryParams.AdConversionRateLast14Days"
          placeholder="请输入近14天广告转化率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近7天广告转化率" prop="AdConversionRateLast7Days">
        <el-input
          v-model="queryParams.AdConversionRateLast7Days"
          placeholder="请输入近7天广告转化率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天ACOS" prop="ACOSLast30Days">
        <el-input
          v-model="queryParams.ACOSLast30Days"
          placeholder="请输入近30天ACOS"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近14天ACOS" prop="ACOSLast14Days">
        <el-input
          v-model="queryParams.ACOSLast14Days"
          placeholder="请输入近14天ACOS"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近7天ACOS" prop="ACOSLast7Days">
        <el-input
          v-model="queryParams.ACOSLast7Days"
          placeholder="请输入近7天ACOS"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天目标ACOS" prop="TargetACOSLast30Days">
        <el-input
          v-model="queryParams.TargetACOSLast30Days"
          placeholder="请输入近30天目标ACOS"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分析-执行-复盘" prop="AnalysisExecutionReview4">
        <el-input
          v-model="queryParams.AnalysisExecutionReview4"
          placeholder="请输入分析-执行-复盘"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上一个月总页面浏览次数" prop="TotalPageViewsLastMonth">
        <el-input
          v-model="queryParams.TotalPageViewsLastMonth"
          placeholder="请输入上一个月总页面浏览次数"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天目标页面浏览次数" prop="TargetTotalPageViewsLast30Days">
        <el-input
          v-model="queryParams.TargetTotalPageViewsLast30Days"
          placeholder="请输入近30天目标页面浏览次数"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天页面浏览次数" prop="ActualTotalPageViewsLast30Days">
        <el-input
          v-model="queryParams.ActualTotalPageViewsLast30Days"
          placeholder="请输入近30天页面浏览次数"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近14天页面浏览次数" prop="ActualTotalPageViewsLast14Days">
        <el-input
          v-model="queryParams.ActualTotalPageViewsLast14Days"
          placeholder="请输入近14天页面浏览次数"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近7天页面浏览次数" prop="ActualTotalPageViewsLast7Days">
        <el-input
          v-model="queryParams.ActualTotalPageViewsLast7Days"
          placeholder="请输入近7天页面浏览次数"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分析-执行-复盘" prop="AnalysisExecutionReview5">
        <el-input
          v-model="queryParams.AnalysisExecutionReview5"
          placeholder="请输入分析-执行-复盘"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上个月总转化率" prop="ConversionRateLastMonth">
        <el-input
          v-model="queryParams.ConversionRateLastMonth"
          placeholder="请输入上个月总转化率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天目标总转化率" prop="TargetTotalConversionRateLast30Days">
        <el-input
          v-model="queryParams.TargetTotalConversionRateLast30Days"
          placeholder="请输入近30天目标总转化率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天总转化率" prop="ActualTotalConversionRateLast30Days">
        <el-input
          v-model="queryParams.ActualTotalConversionRateLast30Days"
          placeholder="请输入近30天总转化率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近14天总转化率" prop="ActualTotalConversionRateLast14Days">
        <el-input
          v-model="queryParams.ActualTotalConversionRateLast14Days"
          placeholder="请输入近14天总转化率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近7天总转化率" prop="ActualTotalConversionRateLast7Days">
        <el-input
          v-model="queryParams.ActualTotalConversionRateLast7Days"
          placeholder="请输入近7天总转化率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分析-执行-复盘" prop="AnalysisExecutionReview6">
        <el-input
          v-model="queryParams.AnalysisExecutionReview6"
          placeholder="请输入分析-执行-复盘"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="SP广告" prop="SPAd">
        <el-input
          v-model="queryParams.SPAd"
          placeholder="请输入SP广告"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天广告ROI" prop="ROILast30DaysSPAd">
        <el-input
          v-model="queryParams.ROILast30DaysSPAd"
          placeholder="请输入近30天广告ROI"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近14天广告花费占比" prop="ROILast14DaysSPAd">
        <el-input
          v-model="queryParams.ROILast14DaysSPAd"
          placeholder="请输入近14天广告花费占比"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天广告曝光" prop="TotalAdExposureLast30DaysSPAd">
        <el-input
          v-model="queryParams.TotalAdExposureLast30DaysSPAd"
          placeholder="请输入近30天广告曝光"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近14天广告曝光" prop="TotalAdExposureLast14DaysSPAd">
        <el-input
          v-model="queryParams.TotalAdExposureLast14DaysSPAd"
          placeholder="请输入近14天广告曝光"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天广告点击量" prop="TotalAdClicksLast30DaysSPAd">
        <el-input
          v-model="queryParams.TotalAdClicksLast30DaysSPAd"
          placeholder="请输入近30天广告点击量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近14天广告点击量" prop="TotalAdClicksLast14DaysSPAd">
        <el-input
          v-model="queryParams.TotalAdClicksLast14DaysSPAd"
          placeholder="请输入近14天广告点击量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天广告转化率" prop="AdConversionRateLast30DaysSPAd">
        <el-input
          v-model="queryParams.AdConversionRateLast30DaysSPAd"
          placeholder="请输入近30天广告转化率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近14天广告转化率" prop="AdConversionRateLast14DaysSPAd">
        <el-input
          v-model="queryParams.AdConversionRateLast14DaysSPAd"
          placeholder="请输入近14天广告转化率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天ACOS" prop="ACOSLast30DaysSPAd">
        <el-input
          v-model="queryParams.ACOSLast30DaysSPAd"
          placeholder="请输入近30天ACOS"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近14天ACOS" prop="ACOSLast14DaysSPAd">
        <el-input
          v-model="queryParams.ACOSLast14DaysSPAd"
          placeholder="请输入近14天ACOS"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="SP分析-执行-复盘" prop="AnalysisExecutionReviewSPAd">
        <el-input
          v-model="queryParams.AnalysisExecutionReviewSPAd"
          placeholder="请输入SP分析-执行-复盘"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="SD广告" prop="SDAd">
        <el-input
          v-model="queryParams.SDAd"
          placeholder="请输入SD广告"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天广告ROI" prop="ROILast30DaysSDAd">
        <el-input
          v-model="queryParams.ROILast30DaysSDAd"
          placeholder="请输入近30天广告ROI"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近14天广告花费占比" prop="ROILast14DaysSDAd">
        <el-input
          v-model="queryParams.ROILast14DaysSDAd"
          placeholder="请输入近14天广告花费占比"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天广告曝光" prop="TotalAdExposureLast30DaysSDAd">
        <el-input
          v-model="queryParams.TotalAdExposureLast30DaysSDAd"
          placeholder="请输入近30天广告曝光"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近14天广告曝光" prop="TotalAdExposureLast14DaysSDAd">
        <el-input
          v-model="queryParams.TotalAdExposureLast14DaysSDAd"
          placeholder="请输入近14天广告曝光"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天广告点击量" prop="TotalAdClicksLast30DaysSDAd">
        <el-input
          v-model="queryParams.TotalAdClicksLast30DaysSDAd"
          placeholder="请输入近30天广告点击量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近14天广告点击量" prop="TotalAdClicksLast14DaysSDAd">
        <el-input
          v-model="queryParams.TotalAdClicksLast14DaysSDAd"
          placeholder="请输入近14天广告点击量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天广告转化率" prop="AdConversionRateLast30DaysSDAd">
        <el-input
          v-model="queryParams.AdConversionRateLast30DaysSDAd"
          placeholder="请输入近30天广告转化率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近14天广告转化率" prop="AdConversionRateLast14DaysSDAd">
        <el-input
          v-model="queryParams.AdConversionRateLast14DaysSDAd"
          placeholder="请输入近14天广告转化率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天ACOS" prop="ACOSLast30DaysSDAd">
        <el-input
          v-model="queryParams.ACOSLast30DaysSDAd"
          placeholder="请输入近30天ACOS"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近14天ACOS" prop="ACOSLast14DaysSDAd">
        <el-input
          v-model="queryParams.ACOSLast14DaysSDAd"
          placeholder="请输入近14天ACOS"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="SD分析-执行-复盘" prop="AnalysisExecutionReviewSDAd">
        <el-input
          v-model="queryParams.AnalysisExecutionReviewSDAd"
          placeholder="请输入SD分析-执行-复盘"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="SB广告" prop="SBad">
        <el-input
          v-model="queryParams.SBad"
          placeholder="请输入SB广告"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天广告ROI" prop="ROILast30DaysSBad">
        <el-input
          v-model="queryParams.ROILast30DaysSBad"
          placeholder="请输入近30天广告ROI"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近14天广告花费占比" prop="ROILast14DaysSBad">
        <el-input
          v-model="queryParams.ROILast14DaysSBad"
          placeholder="请输入近14天广告花费占比"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天广告曝光" prop="TotalAdExposureLast30DaysSBad">
        <el-input
          v-model="queryParams.TotalAdExposureLast30DaysSBad"
          placeholder="请输入近30天广告曝光"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近14天广告曝光" prop="TotalAdExposureLast14DaysSBad">
        <el-input
          v-model="queryParams.TotalAdExposureLast14DaysSBad"
          placeholder="请输入近14天广告曝光"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天广告点击量" prop="TotalAdClicksLast30DaysSBad">
        <el-input
          v-model="queryParams.TotalAdClicksLast30DaysSBad"
          placeholder="请输入近30天广告点击量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近14天广告点击量" prop="TotalAdClicksLast14DaysSBad">
        <el-input
          v-model="queryParams.TotalAdClicksLast14DaysSBad"
          placeholder="请输入近14天广告点击量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天广告转化率" prop="AdConversionRateLast30DaysSBad">
        <el-input
          v-model="queryParams.AdConversionRateLast30DaysSBad"
          placeholder="请输入近30天广告转化率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近14天广告转化率" prop="AdConversionRateLast14DaysSBad">
        <el-input
          v-model="queryParams.AdConversionRateLast14DaysSBad"
          placeholder="请输入近14天广告转化率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天ACOS" prop="ACOSLast30DaysSBad">
        <el-input
          v-model="queryParams.ACOSLast30DaysSBad"
          placeholder="请输入近30天ACOS"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近14天ACOS" prop="ACOSLast14DaysSBad">
        <el-input
          v-model="queryParams.ACOSLast14DaysSBad"
          placeholder="请输入近14天ACOS"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="SB分析-执行-复盘" prop="AnalysisExecutionReviewSBad">
        <el-input
          v-model="queryParams.AnalysisExecutionReviewSBad"
          placeholder="请输入SB分析-执行-复盘"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上个月退款率" prop="RefundRateLastMonth">
        <el-input
          v-model="queryParams.RefundRateLastMonth"
          placeholder="请输入上个月退款率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天目标退款率" prop="TargetRefundRateLast30Days">
        <el-input
          v-model="queryParams.TargetRefundRateLast30Days"
          placeholder="请输入近30天目标退款率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近30天退款率" prop="ActualRefundRateLast30Days">
        <el-input
          v-model="queryParams.ActualRefundRateLast30Days"
          placeholder="请输入近30天退款率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近14天退款率" prop="ActualRefundRateLast14Days">
        <el-input
          v-model="queryParams.ActualRefundRateLast14Days"
          placeholder="请输入近14天退款率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="近7天退款率" prop="ActualRefundRateLast7Days">
        <el-input
          v-model="queryParams.ActualRefundRateLast7Days"
          placeholder="请输入近7天退款率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分析-执行-复盘" prop="AnalysisExecutionReview7">
        <el-input
          v-model="queryParams.AnalysisExecutionReview7"
          placeholder="请输入分析-执行-复盘"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上架是否大于3个月(90天)" prop="ListingAgeMoreThan3Months">
        <el-input
          v-model="queryParams.ListingAgeMoreThan3Months"
          placeholder="请输入上架是否大于3个月(90天)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="动销" prop="SalesVelocity">
        <el-input
          v-model="queryParams.SalesVelocity"
          placeholder="请输入动销"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上月广告花费" prop="AdSpendingLastMonth">
        <el-input
          v-model="queryParams.AdSpendingLastMonth"
          placeholder="请输入上月广告花费"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上月广告销售额" prop="AdSalesLastMonth">
        <el-input
          v-model="queryParams.AdSalesLastMonth"
          placeholder="请输入上月广告销售额"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上月广告ROI" prop="ROILastMonth">
        <el-input
          v-model="queryParams.ROILastMonth"
          placeholder="请输入上月广告ROI"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="本地库存" prop="LocalInventory">
        <el-input
          v-model="queryParams.LocalInventory"
          placeholder="请输入本地库存"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="本地采购在途" prop="LocalProcurementInTransit">
        <el-input
          v-model="queryParams.LocalProcurementInTransit"
          placeholder="请输入本地采购在途"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="FBA可售库存" prop="FBASellableInventory">
        <el-input
          v-model="queryParams.FBASellableInventory"
          placeholder="请输入FBA可售库存"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="FBA在途库存" prop="FBAInTransitInventory">
        <el-input
          v-model="queryParams.FBAInTransitInventory"
          placeholder="请输入FBA在途库存"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="本地库存金额" prop="LocalInventoryValue">
        <el-input
          v-model="queryParams.LocalInventoryValue"
          placeholder="请输入本地库存金额"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="本地采购在途金额" prop="LocalProcurementInTransitValue">
        <el-input
          v-model="queryParams.LocalProcurementInTransitValue"
          placeholder="请输入本地采购在途金额"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="FBA可售库存金额" prop="FBASellableInventoryValue">
        <el-input
          v-model="queryParams.FBASellableInventoryValue"
          placeholder="请输入FBA可售库存金额"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="FBA在途库存金额" prop="FBAInTransitInventoryValue">
        <el-input
          v-model="queryParams.FBAInTransitInventoryValue"
          placeholder="请输入FBA在途库存金额"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="总库存金额" prop="TotalInventoryValue">
        <el-input
          v-model="queryParams.TotalInventoryValue"
          placeholder="请输入总库存金额"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上月资金利用率" prop="CapitalUtilizationLastMonth">
        <el-input
          v-model="queryParams.CapitalUtilizationLastMonth"
          placeholder="请输入上月资金利用率"
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
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd"
          v-hasPermi="['amzlog:analysis:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['amzlog:analysis:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['amzlog:analysis:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['amzlog:analysis:export']">导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="Edit" @click="openSelectColumn">选择显示列</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="analysisList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="自增id" align="center" prop="id" />
      <el-table-column label="亚马逊标准识别号" align="center" prop="ASIN" />
      <el-table-column label="马帮SKU" align="center" prop="MSKU" />
      <el-table-column label="销售部门" align="center" prop="Sales" />
      <el-table-column label="开发部门" align="center" prop="Development" />
      <el-table-column label="美工部门" align="center" prop="Designer" />
      <el-table-column label="上架时间" align="center" prop="ListingDate" />
      <el-table-column label="自定义标签" align="center" prop="CustomTags" />
      <el-table-column label="SKU更新日志" align="center" prop="SKULog" />
      <el-table-column label="状态" align="center" prop="Status" />
      <el-table-column label="分析类别" align="center" prop="AnalysisCategory" />
      <el-table-column label="分析内容" align="center" prop="AnalysisContent" />
      <el-table-column label="动作内容" align="center" prop="ActionContent" />
      <el-table-column label="竞对ASIN" align="center" prop="CompetitorASIN" />
      <el-table-column label="竞对品牌" align="center" prop="CompetitorBrand" />
      <el-table-column label="竞对小类目排名" align="center" prop="CompetitorSubRank" />
      <el-table-column label="竞对大类目排名" align="center" prop="CompetitorMainRank" />
      <el-table-column label="竞对月均销量" align="center" prop="CompetitorMonthlySales" />
      <el-table-column label="竞对日均销量" align="center" prop="CompetitorDailySales" />
      <el-table-column label="竞对售价" align="center" prop="CompetitorPrice" />
      <el-table-column label="竞对毛利率" align="center" prop="CompetitorGrossMargin" />
      <el-table-column label="竞对日均毛利" align="center" prop="CompetitorDailyProfit" />
      <el-table-column label="竞对变体" align="center" prop="CompetitorVariants" />
      <el-table-column label="竞对上架日期" align="center" prop="CompetitorListingDate" />
      <el-table-column label="竞对评论数" align="center" prop="CompetitorReviews" />
      <el-table-column label="竞对星级评分" align="center" prop="CompetitorRating" />
      <el-table-column label="竞对文案质量" align="center" prop="CompetitorCopyQuality" />
      <el-table-column label="竞对是否重铺" align="center" prop="CompetitorRelisting" />
      <el-table-column label="竞对ASIN-2" align="center" prop="CompetitorASIN2" />
      <el-table-column label="市场月容量" align="center" prop="MarketMonthlyCapacity" />
      <el-table-column label="目标日均销量" align="center" prop="TargetDailySales" />
      <el-table-column label="目标售价" align="center" prop="TargetPrice" />
      <el-table-column label="目标日均销售额" align="center" prop="TargetDailyRevenue" />
      <el-table-column label="目标毛利率" align="center" prop="TargetGrossMargin" />
      <el-table-column label="目标日利润" align="center" prop="TargetDailyProfit" />
      <el-table-column label="目标小类目排名" align="center" prop="TargetSubRank" />
      <el-table-column label="目标大类目排名" align="center" prop="TargetMainRank" />
      <el-table-column label="目标资金使用率" align="center" prop="TargetCapitalUtilization" />
      <el-table-column label="上一个月利润" align="center" prop="LastMonthProfit" />
      <el-table-column label="上月日均利润" align="center" prop="LastMonthDailyProfit" />
      <el-table-column label="近30天目标总利润" align="center" prop="TargetLast30DaysTotalProfit" />
      <el-table-column label="近30天实际总利润" align="center" prop="ActualLast30DaysTotalProfit" />
      <el-table-column label="近14天实际总利润" align="center" prop="ActualLast14DaysTotalProfit" />
      <el-table-column label="近7天实际总利润" align="center" prop="ActualLast7DaysTotalProfit" />
      <el-table-column label="近30天总库存金额" align="center" prop="TotalInventoryAmountLast30Days" />
      <el-table-column label="近30天资金利用率" align="center" prop="CapitalUtilizationLast30Days" />
      <el-table-column label="近7天销量" align="center" prop="ActualLast7DaysSales" />
      <el-table-column label="上个月总销售额" align="center" prop="LastMonthTotalSales" />
      <el-table-column label="上月日均销售额" align="center" prop="LastMonthDailySales" />
      <el-table-column label="近30天目标销售额" align="center" prop="TargetLast30DaysTotalSales" />
      <el-table-column label="近30天实际销售额" align="center" prop="ActualLast30DaysTotalSales" />
      <el-table-column label="近14天实际销售额" align="center" prop="ActualLast14DaysTotalSales" />
      <el-table-column label="近7天实际销售额" align="center" prop="ActualLast7DaysTotalSales" />
      <el-table-column label="分析-执行-复盘" align="center" prop="AnalysisExecutionReview" />
      <el-table-column label="上个月利润率" align="center" prop="LastMonthProfitRate" />
      <el-table-column label="近30天目标利润率" align="center" prop="TargetLast30DaysProfitRate" />
      <el-table-column label="近30天利润率" align="center" prop="ActualLast30DaysProfitRate" />
      <el-table-column label="近14天利润率" align="center" prop="ActualLast14DaysProfitRate" />
      <el-table-column label="近7天利润率" align="center" prop="ActualLast7DaysProfitRate" />
      <el-table-column label="分析-执行-复盘" align="center" prop="AnalysisExecutionReview2" />
      <el-table-column label="上个月月库存周转天数" align="center" prop="LastMonthInventoryTurnoverDays" />
      <el-table-column label="当月目标库存周转天数" align="center" prop="CurrentTargetInventoryTurnoverDays" />
      <el-table-column label="近7天周转天数库存" align="center" prop="ActualLast7DaysInventoryTurnoverDays" />
      <el-table-column label="分析-执行-复盘" align="center" prop="AnalysisExecutionReview3" />
      <el-table-column label="近14天广告计划-预算" align="center" prop="TargetLast14DaysAdBudget" />
      <el-table-column label="近14天广告实际消耗" align="center" prop="ActualLast14DaysAdSpending" />
      <el-table-column label="近30天总广告花费" align="center" prop="TotalAdSpendingLast30Days" />
      <el-table-column label="上一个月广告花费占比" align="center" prop="LastMonthAdSpendingRatio" />
      <el-table-column label="30天【目标】广告花费占比" align="center" prop="TargetLast30DaysAdSpendingRatio" />
      <el-table-column label="近30天广告花费占比" align="center" prop="ActualLast30DaysAdSpendingRatio" />
      <el-table-column label="近14天广告花费占比" align="center" prop="ActualLast14DaysAdSpendingRatio" />
      <el-table-column label="近7天广告花费占比" align="center" prop="ActualLast7DaysAdSpendingRatio" />
      <el-table-column label="近30天广告曝光" align="center" prop="TotalAdExposureLast30Days" />
      <el-table-column label="近14天广告曝光" align="center" prop="TotalAdExposureLast14Days" />
      <el-table-column label="近7天广告曝光" align="center" prop="TotalAdExposureLast7Days" />
      <el-table-column label="近30天广告点击量" align="center" prop="TotalAdClicksLast30Days" />
      <el-table-column label="近14天广告点击量" align="center" prop="TotalAdClicksLast14Days" />
      <el-table-column label="近7天广告点击量" align="center" prop="TotalAdClicksLast7Days" />
      <el-table-column label="近30天广告转化率" align="center" prop="AdConversionRateLast30Days" />
      <el-table-column label="近14天广告转化率" align="center" prop="AdConversionRateLast14Days" />
      <el-table-column label="近7天广告转化率" align="center" prop="AdConversionRateLast7Days" />
      <el-table-column label="近30天ACOS" align="center" prop="ACOSLast30Days" />
      <el-table-column label="近14天ACOS" align="center" prop="ACOSLast14Days" />
      <el-table-column label="近7天ACOS" align="center" prop="ACOSLast7Days" />
      <el-table-column label="近30天目标ACOS" align="center" prop="TargetACOSLast30Days" />
      <el-table-column label="分析-执行-复盘" align="center" prop="AnalysisExecutionReview4" />
      <el-table-column label="上一个月总页面浏览次数" align="center" prop="TotalPageViewsLastMonth" />
      <el-table-column label="近30天目标页面浏览次数" align="center" prop="TargetTotalPageViewsLast30Days" />
      <el-table-column label="近30天页面浏览次数" align="center" prop="ActualTotalPageViewsLast30Days" />
      <el-table-column label="近14天页面浏览次数" align="center" prop="ActualTotalPageViewsLast14Days" />
      <el-table-column label="近7天页面浏览次数" align="center" prop="ActualTotalPageViewsLast7Days" />
      <el-table-column label="分析-执行-复盘" align="center" prop="AnalysisExecutionReview5" />
      <el-table-column label="上个月总转化率" align="center" prop="ConversionRateLastMonth" />
      <el-table-column label="近30天目标总转化率" align="center" prop="TargetTotalConversionRateLast30Days" />
      <el-table-column label="近30天总转化率" align="center" prop="ActualTotalConversionRateLast30Days" />
      <el-table-column label="近14天总转化率" align="center" prop="ActualTotalConversionRateLast14Days" />
      <el-table-column label="近7天总转化率" align="center" prop="ActualTotalConversionRateLast7Days" />
      <el-table-column label="分析-执行-复盘" align="center" prop="AnalysisExecutionReview6" />
      <el-table-column label="SP广告" align="center" prop="SPAd" />
      <el-table-column label="近30天广告ROI" align="center" prop="ROILast30DaysSPAd" />
      <el-table-column label="近14天广告花费占比" align="center" prop="ROILast14DaysSPAd" />
      <el-table-column label="近30天广告曝光" align="center" prop="TotalAdExposureLast30DaysSPAd" />
      <el-table-column label="近14天广告曝光" align="center" prop="TotalAdExposureLast14DaysSPAd" />
      <el-table-column label="近30天广告点击量" align="center" prop="TotalAdClicksLast30DaysSPAd" />
      <el-table-column label="近14天广告点击量" align="center" prop="TotalAdClicksLast14DaysSPAd" />
      <el-table-column label="近30天广告转化率" align="center" prop="AdConversionRateLast30DaysSPAd" />
      <el-table-column label="近14天广告转化率" align="center" prop="AdConversionRateLast14DaysSPAd" />
      <el-table-column label="近30天ACOS" align="center" prop="ACOSLast30DaysSPAd" />
      <el-table-column label="近14天ACOS" align="center" prop="ACOSLast14DaysSPAd" />
      <el-table-column label="SP分析-执行-复盘" align="center" prop="AnalysisExecutionReviewSPAd" />
      <el-table-column label="SD广告" align="center" prop="SDAd" />
      <el-table-column label="近30天广告ROI" align="center" prop="ROILast30DaysSDAd" />
      <el-table-column label="近14天广告花费占比" align="center" prop="ROILast14DaysSDAd" />
      <el-table-column label="近30天广告曝光" align="center" prop="TotalAdExposureLast30DaysSDAd" />
      <el-table-column label="近14天广告曝光" align="center" prop="TotalAdExposureLast14DaysSDAd" />
      <el-table-column label="近30天广告点击量" align="center" prop="TotalAdClicksLast30DaysSDAd" />
      <el-table-column label="近14天广告点击量" align="center" prop="TotalAdClicksLast14DaysSDAd" />
      <el-table-column label="近30天广告转化率" align="center" prop="AdConversionRateLast30DaysSDAd" />
      <el-table-column label="近14天广告转化率" align="center" prop="AdConversionRateLast14DaysSDAd" />
      <el-table-column label="近30天ACOS" align="center" prop="ACOSLast30DaysSDAd" />
      <el-table-column label="近14天ACOS" align="center" prop="ACOSLast14DaysSDAd" />
      <el-table-column label="SD分析-执行-复盘" align="center" prop="AnalysisExecutionReviewSDAd" />
      <el-table-column label="SB广告" align="center" prop="SBad" />
      <el-table-column label="近30天广告ROI" align="center" prop="ROILast30DaysSBad" />
      <el-table-column label="近14天广告花费占比" align="center" prop="ROILast14DaysSBad" />
      <el-table-column label="近30天广告曝光" align="center" prop="TotalAdExposureLast30DaysSBad" />
      <el-table-column label="近14天广告曝光" align="center" prop="TotalAdExposureLast14DaysSBad" />
      <el-table-column label="近30天广告点击量" align="center" prop="TotalAdClicksLast30DaysSBad" />
      <el-table-column label="近14天广告点击量" align="center" prop="TotalAdClicksLast14DaysSBad" />
      <el-table-column label="近30天广告转化率" align="center" prop="AdConversionRateLast30DaysSBad" />
      <el-table-column label="近14天广告转化率" align="center" prop="AdConversionRateLast14DaysSBad" />
      <el-table-column label="近30天ACOS" align="center" prop="ACOSLast30DaysSBad" />
      <el-table-column label="近14天ACOS" align="center" prop="ACOSLast14DaysSBad" />
      <el-table-column label="SB分析-执行-复盘" align="center" prop="AnalysisExecutionReviewSBad" />
      <el-table-column label="上个月退款率" align="center" prop="RefundRateLastMonth" />
      <el-table-column label="近30天目标退款率" align="center" prop="TargetRefundRateLast30Days" />
      <el-table-column label="近30天退款率" align="center" prop="ActualRefundRateLast30Days" />
      <el-table-column label="近14天退款率" align="center" prop="ActualRefundRateLast14Days" />
      <el-table-column label="近7天退款率" align="center" prop="ActualRefundRateLast7Days" />
      <el-table-column label="分析-执行-复盘" align="center" prop="AnalysisExecutionReview7" />
      <el-table-column label="上架是否大于3个月(90天)" align="center" prop="ListingAgeMoreThan3Months" />
      <el-table-column label="动销" align="center" prop="SalesVelocity" />
      <el-table-column label="上月广告花费" align="center" prop="AdSpendingLastMonth" />
      <el-table-column label="上月广告销售额" align="center" prop="AdSalesLastMonth" />
      <el-table-column label="上月广告ROI" align="center" prop="ROILastMonth" />
      <el-table-column label="本地库存" align="center" prop="LocalInventory" />
      <el-table-column label="本地采购在途" align="center" prop="LocalProcurementInTransit" />
      <el-table-column label="FBA可售库存" align="center" prop="FBASellableInventory" />
      <el-table-column label="FBA在途库存" align="center" prop="FBAInTransitInventory" />
      <el-table-column label="本地库存金额" align="center" prop="LocalInventoryValue" />
      <el-table-column label="本地采购在途金额" align="center" prop="LocalProcurementInTransitValue" />
      <el-table-column label="FBA可售库存金额" align="center" prop="FBASellableInventoryValue" />
      <el-table-column label="FBA在途库存金额" align="center" prop="FBAInTransitInventoryValue" />
      <el-table-column label="总库存金额" align="center" prop="TotalInventoryValue" />
      <el-table-column label="上月资金利用率" align="center" prop="CapitalUtilizationLastMonth" />
      <el-table-column label="是否删除" align="center" prop="isDelete" />
      <el-table-column label="创建时间" align="center" prop="createdAt" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['amzlog:analysis:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['amzlog:analysis:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改amzlog对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="analysisRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="亚马逊标准识别号" prop="ASIN">
          <el-input v-model="form.ASIN" placeholder="请输入亚马逊标准识别号" />
        </el-form-item>
        <el-form-item label="马帮SKU" prop="MSKU">
          <el-input v-model="form.MSKU" placeholder="请输入马帮SKU" />
        </el-form-item>
        <el-form-item label="销售部门" prop="Sales">
          <el-input v-model="form.Sales" placeholder="请输入销售部门" />
        </el-form-item>
        <el-form-item label="开发部门" prop="Development">
          <el-input v-model="form.Development" placeholder="请输入开发部门" />
        </el-form-item>
        <el-form-item label="美工部门" prop="Designer">
          <el-input v-model="form.Designer" placeholder="请输入美工部门" />
        </el-form-item>
        <el-form-item label="上架时间" prop="ListingDate">
          <el-input v-model="form.ListingDate" placeholder="请输入上架时间" />
        </el-form-item>
        <el-form-item label="自定义标签" prop="CustomTags">
          <el-input v-model="form.CustomTags" placeholder="请输入自定义标签" />
        </el-form-item>
        <el-form-item label="SKU更新日志" prop="SKULog">
          <el-input v-model="form.SKULog" placeholder="请输入SKU更新日志" />
        </el-form-item>
        <el-form-item label="分析类别" prop="AnalysisCategory">
          <el-input v-model="form.AnalysisCategory" placeholder="请输入分析类别" />
        </el-form-item>
        <el-form-item label="分析内容">
          <editor v-model="form.AnalysisContent" :min-height="192" />
        </el-form-item>
        <el-form-item label="动作内容">
          <editor v-model="form.ActionContent" :min-height="192" />
        </el-form-item>
        <el-form-item label="竞对ASIN" prop="CompetitorASIN">
          <el-input v-model="form.CompetitorASIN" placeholder="请输入竞对ASIN" />
        </el-form-item>
        <el-form-item label="竞对品牌" prop="CompetitorBrand">
          <el-input v-model="form.CompetitorBrand" placeholder="请输入竞对品牌" />
        </el-form-item>
        <el-form-item label="竞对小类目排名" prop="CompetitorSubRank">
          <el-input v-model="form.CompetitorSubRank" placeholder="请输入竞对小类目排名" />
        </el-form-item>
        <el-form-item label="竞对大类目排名" prop="CompetitorMainRank">
          <el-input v-model="form.CompetitorMainRank" placeholder="请输入竞对大类目排名" />
        </el-form-item>
        <el-form-item label="竞对月均销量" prop="CompetitorMonthlySales">
          <el-input v-model="form.CompetitorMonthlySales" placeholder="请输入竞对月均销量" />
        </el-form-item>
        <el-form-item label="竞对日均销量" prop="CompetitorDailySales">
          <el-input v-model="form.CompetitorDailySales" placeholder="请输入竞对日均销量" />
        </el-form-item>
        <el-form-item label="竞对售价" prop="CompetitorPrice">
          <el-input v-model="form.CompetitorPrice" placeholder="请输入竞对售价" />
        </el-form-item>
        <el-form-item label="竞对毛利率" prop="CompetitorGrossMargin">
          <el-input v-model="form.CompetitorGrossMargin" placeholder="请输入竞对毛利率" />
        </el-form-item>
        <el-form-item label="竞对日均毛利" prop="CompetitorDailyProfit">
          <el-input v-model="form.CompetitorDailyProfit" placeholder="请输入竞对日均毛利" />
        </el-form-item>
        <el-form-item label="竞对变体" prop="CompetitorVariants">
          <el-input v-model="form.CompetitorVariants" placeholder="请输入竞对变体" />
        </el-form-item>
        <el-form-item label="竞对上架日期" prop="CompetitorListingDate">
          <el-input v-model="form.CompetitorListingDate" placeholder="请输入竞对上架日期" />
        </el-form-item>
        <el-form-item label="竞对评论数" prop="CompetitorReviews">
          <el-input v-model="form.CompetitorReviews" placeholder="请输入竞对评论数" />
        </el-form-item>
        <el-form-item label="竞对星级评分" prop="CompetitorRating">
          <el-input v-model="form.CompetitorRating" placeholder="请输入竞对星级评分" />
        </el-form-item>
        <el-form-item label="竞对文案质量" prop="CompetitorCopyQuality">
          <el-input v-model="form.CompetitorCopyQuality" placeholder="请输入竞对文案质量" />
        </el-form-item>
        <el-form-item label="竞对是否重铺" prop="CompetitorRelisting">
          <el-input v-model="form.CompetitorRelisting" placeholder="请输入竞对是否重铺" />
        </el-form-item>
        <el-form-item label="竞对ASIN-2" prop="CompetitorASIN2">
          <el-input v-model="form.CompetitorASIN2" placeholder="请输入竞对ASIN-2" />
        </el-form-item>
        <el-form-item label="市场月容量" prop="MarketMonthlyCapacity">
          <el-input v-model="form.MarketMonthlyCapacity" placeholder="请输入市场月容量" />
        </el-form-item>
        <el-form-item label="目标日均销量" prop="TargetDailySales">
          <el-input v-model="form.TargetDailySales" placeholder="请输入目标日均销量" />
        </el-form-item>
        <el-form-item label="目标售价" prop="TargetPrice">
          <el-input v-model="form.TargetPrice" placeholder="请输入目标售价" />
        </el-form-item>
        <el-form-item label="目标日均销售额" prop="TargetDailyRevenue">
          <el-input v-model="form.TargetDailyRevenue" placeholder="请输入目标日均销售额" />
        </el-form-item>
        <el-form-item label="目标毛利率" prop="TargetGrossMargin">
          <el-input v-model="form.TargetGrossMargin" placeholder="请输入目标毛利率" />
        </el-form-item>
        <el-form-item label="目标日利润" prop="TargetDailyProfit">
          <el-input v-model="form.TargetDailyProfit" placeholder="请输入目标日利润" />
        </el-form-item>
        <el-form-item label="目标小类目排名" prop="TargetSubRank">
          <el-input v-model="form.TargetSubRank" placeholder="请输入目标小类目排名" />
        </el-form-item>
        <el-form-item label="目标大类目排名" prop="TargetMainRank">
          <el-input v-model="form.TargetMainRank" placeholder="请输入目标大类目排名" />
        </el-form-item>
        <el-form-item label="目标资金使用率" prop="TargetCapitalUtilization">
          <el-input v-model="form.TargetCapitalUtilization" placeholder="请输入目标资金使用率" />
        </el-form-item>
        <el-form-item label="上一个月利润" prop="LastMonthProfit">
          <el-input v-model="form.LastMonthProfit" placeholder="请输入上一个月利润" />
        </el-form-item>
        <el-form-item label="上月日均利润" prop="LastMonthDailyProfit">
          <el-input v-model="form.LastMonthDailyProfit" placeholder="请输入上月日均利润" />
        </el-form-item>
        <el-form-item label="近30天目标总利润" prop="TargetLast30DaysTotalProfit">
          <el-input v-model="form.TargetLast30DaysTotalProfit" placeholder="请输入近30天目标总利润" />
        </el-form-item>
        <el-form-item label="近30天实际总利润" prop="ActualLast30DaysTotalProfit">
          <el-input v-model="form.ActualLast30DaysTotalProfit" placeholder="请输入近30天实际总利润" />
        </el-form-item>
        <el-form-item label="近14天实际总利润" prop="ActualLast14DaysTotalProfit">
          <el-input v-model="form.ActualLast14DaysTotalProfit" placeholder="请输入近14天实际总利润" />
        </el-form-item>
        <el-form-item label="近7天实际总利润" prop="ActualLast7DaysTotalProfit">
          <el-input v-model="form.ActualLast7DaysTotalProfit" placeholder="请输入近7天实际总利润" />
        </el-form-item>
        <el-form-item label="近30天总库存金额" prop="TotalInventoryAmountLast30Days">
          <el-input v-model="form.TotalInventoryAmountLast30Days" placeholder="请输入近30天总库存金额" />
        </el-form-item>
        <el-form-item label="近30天资金利用率" prop="CapitalUtilizationLast30Days">
          <el-input v-model="form.CapitalUtilizationLast30Days" placeholder="请输入近30天资金利用率" />
        </el-form-item>
        <el-form-item label="近7天销量" prop="ActualLast7DaysSales">
          <el-input v-model="form.ActualLast7DaysSales" placeholder="请输入近7天销量" />
        </el-form-item>
        <el-form-item label="上个月总销售额" prop="LastMonthTotalSales">
          <el-input v-model="form.LastMonthTotalSales" placeholder="请输入上个月总销售额" />
        </el-form-item>
        <el-form-item label="上月日均销售额" prop="LastMonthDailySales">
          <el-input v-model="form.LastMonthDailySales" placeholder="请输入上月日均销售额" />
        </el-form-item>
        <el-form-item label="近30天目标销售额" prop="TargetLast30DaysTotalSales">
          <el-input v-model="form.TargetLast30DaysTotalSales" placeholder="请输入近30天目标销售额" />
        </el-form-item>
        <el-form-item label="近30天实际销售额" prop="ActualLast30DaysTotalSales">
          <el-input v-model="form.ActualLast30DaysTotalSales" placeholder="请输入近30天实际销售额" />
        </el-form-item>
        <el-form-item label="近14天实际销售额" prop="ActualLast14DaysTotalSales">
          <el-input v-model="form.ActualLast14DaysTotalSales" placeholder="请输入近14天实际销售额" />
        </el-form-item>
        <el-form-item label="近7天实际销售额" prop="ActualLast7DaysTotalSales">
          <el-input v-model="form.ActualLast7DaysTotalSales" placeholder="请输入近7天实际销售额" />
        </el-form-item>
        <el-form-item label="分析-执行-复盘" prop="AnalysisExecutionReview">
          <el-input v-model="form.AnalysisExecutionReview" placeholder="请输入分析-执行-复盘" />
        </el-form-item>
        <el-form-item label="上个月利润率" prop="LastMonthProfitRate">
          <el-input v-model="form.LastMonthProfitRate" placeholder="请输入上个月利润率" />
        </el-form-item>
        <el-form-item label="近30天目标利润率" prop="TargetLast30DaysProfitRate">
          <el-input v-model="form.TargetLast30DaysProfitRate" placeholder="请输入近30天目标利润率" />
        </el-form-item>
        <el-form-item label="近30天利润率" prop="ActualLast30DaysProfitRate">
          <el-input v-model="form.ActualLast30DaysProfitRate" placeholder="请输入近30天利润率" />
        </el-form-item>
        <el-form-item label="近14天利润率" prop="ActualLast14DaysProfitRate">
          <el-input v-model="form.ActualLast14DaysProfitRate" placeholder="请输入近14天利润率" />
        </el-form-item>
        <el-form-item label="近7天利润率" prop="ActualLast7DaysProfitRate">
          <el-input v-model="form.ActualLast7DaysProfitRate" placeholder="请输入近7天利润率" />
        </el-form-item>
        <el-form-item label="分析-执行-复盘" prop="AnalysisExecutionReview2">
          <el-input v-model="form.AnalysisExecutionReview2" placeholder="请输入分析-执行-复盘" />
        </el-form-item>
        <el-form-item label="上个月月库存周转天数" prop="LastMonthInventoryTurnoverDays">
          <el-input v-model="form.LastMonthInventoryTurnoverDays" placeholder="请输入上个月月库存周转天数" />
        </el-form-item>
        <el-form-item label="当月目标库存周转天数" prop="CurrentTargetInventoryTurnoverDays">
          <el-input v-model="form.CurrentTargetInventoryTurnoverDays" placeholder="请输入当月目标库存周转天数" />
        </el-form-item>
        <el-form-item label="近7天周转天数库存" prop="ActualLast7DaysInventoryTurnoverDays">
          <el-input v-model="form.ActualLast7DaysInventoryTurnoverDays" placeholder="请输入近7天周转天数库存" />
        </el-form-item>
        <el-form-item label="分析-执行-复盘" prop="AnalysisExecutionReview3">
          <el-input v-model="form.AnalysisExecutionReview3" placeholder="请输入分析-执行-复盘" />
        </el-form-item>
        <el-form-item label="近14天广告计划-预算" prop="TargetLast14DaysAdBudget">
          <el-input v-model="form.TargetLast14DaysAdBudget" placeholder="请输入近14天广告计划-预算" />
        </el-form-item>
        <el-form-item label="近14天广告实际消耗" prop="ActualLast14DaysAdSpending">
          <el-input v-model="form.ActualLast14DaysAdSpending" placeholder="请输入近14天广告实际消耗" />
        </el-form-item>
        <el-form-item label="近30天总广告花费" prop="TotalAdSpendingLast30Days">
          <el-input v-model="form.TotalAdSpendingLast30Days" placeholder="请输入近30天总广告花费" />
        </el-form-item>
        <el-form-item label="上一个月广告花费占比" prop="LastMonthAdSpendingRatio">
          <el-input v-model="form.LastMonthAdSpendingRatio" placeholder="请输入上一个月广告花费占比" />
        </el-form-item>
        <el-form-item label="30天【目标】广告花费占比" prop="TargetLast30DaysAdSpendingRatio">
          <el-input v-model="form.TargetLast30DaysAdSpendingRatio" placeholder="请输入30天【目标】广告花费占比" />
        </el-form-item>
        <el-form-item label="近30天广告花费占比" prop="ActualLast30DaysAdSpendingRatio">
          <el-input v-model="form.ActualLast30DaysAdSpendingRatio" placeholder="请输入近30天广告花费占比" />
        </el-form-item>
        <el-form-item label="近14天广告花费占比" prop="ActualLast14DaysAdSpendingRatio">
          <el-input v-model="form.ActualLast14DaysAdSpendingRatio" placeholder="请输入近14天广告花费占比" />
        </el-form-item>
        <el-form-item label="近7天广告花费占比" prop="ActualLast7DaysAdSpendingRatio">
          <el-input v-model="form.ActualLast7DaysAdSpendingRatio" placeholder="请输入近7天广告花费占比" />
        </el-form-item>
        <el-form-item label="近30天广告曝光" prop="TotalAdExposureLast30Days">
          <el-input v-model="form.TotalAdExposureLast30Days" placeholder="请输入近30天广告曝光" />
        </el-form-item>
        <el-form-item label="近14天广告曝光" prop="TotalAdExposureLast14Days">
          <el-input v-model="form.TotalAdExposureLast14Days" placeholder="请输入近14天广告曝光" />
        </el-form-item>
        <el-form-item label="近7天广告曝光" prop="TotalAdExposureLast7Days">
          <el-input v-model="form.TotalAdExposureLast7Days" placeholder="请输入近7天广告曝光" />
        </el-form-item>
        <el-form-item label="近30天广告点击量" prop="TotalAdClicksLast30Days">
          <el-input v-model="form.TotalAdClicksLast30Days" placeholder="请输入近30天广告点击量" />
        </el-form-item>
        <el-form-item label="近14天广告点击量" prop="TotalAdClicksLast14Days">
          <el-input v-model="form.TotalAdClicksLast14Days" placeholder="请输入近14天广告点击量" />
        </el-form-item>
        <el-form-item label="近7天广告点击量" prop="TotalAdClicksLast7Days">
          <el-input v-model="form.TotalAdClicksLast7Days" placeholder="请输入近7天广告点击量" />
        </el-form-item>
        <el-form-item label="近30天广告转化率" prop="AdConversionRateLast30Days">
          <el-input v-model="form.AdConversionRateLast30Days" placeholder="请输入近30天广告转化率" />
        </el-form-item>
        <el-form-item label="近14天广告转化率" prop="AdConversionRateLast14Days">
          <el-input v-model="form.AdConversionRateLast14Days" placeholder="请输入近14天广告转化率" />
        </el-form-item>
        <el-form-item label="近7天广告转化率" prop="AdConversionRateLast7Days">
          <el-input v-model="form.AdConversionRateLast7Days" placeholder="请输入近7天广告转化率" />
        </el-form-item>
        <el-form-item label="近30天ACOS" prop="ACOSLast30Days">
          <el-input v-model="form.ACOSLast30Days" placeholder="请输入近30天ACOS" />
        </el-form-item>
        <el-form-item label="近14天ACOS" prop="ACOSLast14Days">
          <el-input v-model="form.ACOSLast14Days" placeholder="请输入近14天ACOS" />
        </el-form-item>
        <el-form-item label="近7天ACOS" prop="ACOSLast7Days">
          <el-input v-model="form.ACOSLast7Days" placeholder="请输入近7天ACOS" />
        </el-form-item>
        <el-form-item label="近30天目标ACOS" prop="TargetACOSLast30Days">
          <el-input v-model="form.TargetACOSLast30Days" placeholder="请输入近30天目标ACOS" />
        </el-form-item>
        <el-form-item label="分析-执行-复盘" prop="AnalysisExecutionReview4">
          <el-input v-model="form.AnalysisExecutionReview4" placeholder="请输入分析-执行-复盘" />
        </el-form-item>
        <el-form-item label="上一个月总页面浏览次数" prop="TotalPageViewsLastMonth">
          <el-input v-model="form.TotalPageViewsLastMonth" placeholder="请输入上一个月总页面浏览次数" />
        </el-form-item>
        <el-form-item label="近30天目标页面浏览次数" prop="TargetTotalPageViewsLast30Days">
          <el-input v-model="form.TargetTotalPageViewsLast30Days" placeholder="请输入近30天目标页面浏览次数" />
        </el-form-item>
        <el-form-item label="近30天页面浏览次数" prop="ActualTotalPageViewsLast30Days">
          <el-input v-model="form.ActualTotalPageViewsLast30Days" placeholder="请输入近30天页面浏览次数" />
        </el-form-item>
        <el-form-item label="近14天页面浏览次数" prop="ActualTotalPageViewsLast14Days">
          <el-input v-model="form.ActualTotalPageViewsLast14Days" placeholder="请输入近14天页面浏览次数" />
        </el-form-item>
        <el-form-item label="近7天页面浏览次数" prop="ActualTotalPageViewsLast7Days">
          <el-input v-model="form.ActualTotalPageViewsLast7Days" placeholder="请输入近7天页面浏览次数" />
        </el-form-item>
        <el-form-item label="分析-执行-复盘" prop="AnalysisExecutionReview5">
          <el-input v-model="form.AnalysisExecutionReview5" placeholder="请输入分析-执行-复盘" />
        </el-form-item>
        <el-form-item label="上个月总转化率" prop="ConversionRateLastMonth">
          <el-input v-model="form.ConversionRateLastMonth" placeholder="请输入上个月总转化率" />
        </el-form-item>
        <el-form-item label="近30天目标总转化率" prop="TargetTotalConversionRateLast30Days">
          <el-input v-model="form.TargetTotalConversionRateLast30Days" placeholder="请输入近30天目标总转化率" />
        </el-form-item>
        <el-form-item label="近30天总转化率" prop="ActualTotalConversionRateLast30Days">
          <el-input v-model="form.ActualTotalConversionRateLast30Days" placeholder="请输入近30天总转化率" />
        </el-form-item>
        <el-form-item label="近14天总转化率" prop="ActualTotalConversionRateLast14Days">
          <el-input v-model="form.ActualTotalConversionRateLast14Days" placeholder="请输入近14天总转化率" />
        </el-form-item>
        <el-form-item label="近7天总转化率" prop="ActualTotalConversionRateLast7Days">
          <el-input v-model="form.ActualTotalConversionRateLast7Days" placeholder="请输入近7天总转化率" />
        </el-form-item>
        <el-form-item label="分析-执行-复盘" prop="AnalysisExecutionReview6">
          <el-input v-model="form.AnalysisExecutionReview6" placeholder="请输入分析-执行-复盘" />
        </el-form-item>
        <el-form-item label="SP广告" prop="SPAd">
          <el-input v-model="form.SPAd" placeholder="请输入SP广告" />
        </el-form-item>
        <el-form-item label="近30天广告ROI" prop="ROILast30DaysSPAd">
          <el-input v-model="form.ROILast30DaysSPAd" placeholder="请输入近30天广告ROI" />
        </el-form-item>
        <el-form-item label="近14天广告花费占比" prop="ROILast14DaysSPAd">
          <el-input v-model="form.ROILast14DaysSPAd" placeholder="请输入近14天广告花费占比" />
        </el-form-item>
        <el-form-item label="近30天广告曝光" prop="TotalAdExposureLast30DaysSPAd">
          <el-input v-model="form.TotalAdExposureLast30DaysSPAd" placeholder="请输入近30天广告曝光" />
        </el-form-item>
        <el-form-item label="近14天广告曝光" prop="TotalAdExposureLast14DaysSPAd">
          <el-input v-model="form.TotalAdExposureLast14DaysSPAd" placeholder="请输入近14天广告曝光" />
        </el-form-item>
        <el-form-item label="近30天广告点击量" prop="TotalAdClicksLast30DaysSPAd">
          <el-input v-model="form.TotalAdClicksLast30DaysSPAd" placeholder="请输入近30天广告点击量" />
        </el-form-item>
        <el-form-item label="近14天广告点击量" prop="TotalAdClicksLast14DaysSPAd">
          <el-input v-model="form.TotalAdClicksLast14DaysSPAd" placeholder="请输入近14天广告点击量" />
        </el-form-item>
        <el-form-item label="近30天广告转化率" prop="AdConversionRateLast30DaysSPAd">
          <el-input v-model="form.AdConversionRateLast30DaysSPAd" placeholder="请输入近30天广告转化率" />
        </el-form-item>
        <el-form-item label="近14天广告转化率" prop="AdConversionRateLast14DaysSPAd">
          <el-input v-model="form.AdConversionRateLast14DaysSPAd" placeholder="请输入近14天广告转化率" />
        </el-form-item>
        <el-form-item label="近30天ACOS" prop="ACOSLast30DaysSPAd">
          <el-input v-model="form.ACOSLast30DaysSPAd" placeholder="请输入近30天ACOS" />
        </el-form-item>
        <el-form-item label="近14天ACOS" prop="ACOSLast14DaysSPAd">
          <el-input v-model="form.ACOSLast14DaysSPAd" placeholder="请输入近14天ACOS" />
        </el-form-item>
        <el-form-item label="SP分析-执行-复盘" prop="AnalysisExecutionReviewSPAd">
          <el-input v-model="form.AnalysisExecutionReviewSPAd" placeholder="请输入SP分析-执行-复盘" />
        </el-form-item>
        <el-form-item label="SD广告" prop="SDAd">
          <el-input v-model="form.SDAd" placeholder="请输入SD广告" />
        </el-form-item>
        <el-form-item label="近30天广告ROI" prop="ROILast30DaysSDAd">
          <el-input v-model="form.ROILast30DaysSDAd" placeholder="请输入近30天广告ROI" />
        </el-form-item>
        <el-form-item label="近14天广告花费占比" prop="ROILast14DaysSDAd">
          <el-input v-model="form.ROILast14DaysSDAd" placeholder="请输入近14天广告花费占比" />
        </el-form-item>
        <el-form-item label="近30天广告曝光" prop="TotalAdExposureLast30DaysSDAd">
          <el-input v-model="form.TotalAdExposureLast30DaysSDAd" placeholder="请输入近30天广告曝光" />
        </el-form-item>
        <el-form-item label="近14天广告曝光" prop="TotalAdExposureLast14DaysSDAd">
          <el-input v-model="form.TotalAdExposureLast14DaysSDAd" placeholder="请输入近14天广告曝光" />
        </el-form-item>
        <el-form-item label="近30天广告点击量" prop="TotalAdClicksLast30DaysSDAd">
          <el-input v-model="form.TotalAdClicksLast30DaysSDAd" placeholder="请输入近30天广告点击量" />
        </el-form-item>
        <el-form-item label="近14天广告点击量" prop="TotalAdClicksLast14DaysSDAd">
          <el-input v-model="form.TotalAdClicksLast14DaysSDAd" placeholder="请输入近14天广告点击量" />
        </el-form-item>
        <el-form-item label="近30天广告转化率" prop="AdConversionRateLast30DaysSDAd">
          <el-input v-model="form.AdConversionRateLast30DaysSDAd" placeholder="请输入近30天广告转化率" />
        </el-form-item>
        <el-form-item label="近14天广告转化率" prop="AdConversionRateLast14DaysSDAd">
          <el-input v-model="form.AdConversionRateLast14DaysSDAd" placeholder="请输入近14天广告转化率" />
        </el-form-item>
        <el-form-item label="近30天ACOS" prop="ACOSLast30DaysSDAd">
          <el-input v-model="form.ACOSLast30DaysSDAd" placeholder="请输入近30天ACOS" />
        </el-form-item>
        <el-form-item label="近14天ACOS" prop="ACOSLast14DaysSDAd">
          <el-input v-model="form.ACOSLast14DaysSDAd" placeholder="请输入近14天ACOS" />
        </el-form-item>
        <el-form-item label="SD分析-执行-复盘" prop="AnalysisExecutionReviewSDAd">
          <el-input v-model="form.AnalysisExecutionReviewSDAd" placeholder="请输入SD分析-执行-复盘" />
        </el-form-item>
        <el-form-item label="SB广告" prop="SBad">
          <el-input v-model="form.SBad" placeholder="请输入SB广告" />
        </el-form-item>
        <el-form-item label="近30天广告ROI" prop="ROILast30DaysSBad">
          <el-input v-model="form.ROILast30DaysSBad" placeholder="请输入近30天广告ROI" />
        </el-form-item>
        <el-form-item label="近14天广告花费占比" prop="ROILast14DaysSBad">
          <el-input v-model="form.ROILast14DaysSBad" placeholder="请输入近14天广告花费占比" />
        </el-form-item>
        <el-form-item label="近30天广告曝光" prop="TotalAdExposureLast30DaysSBad">
          <el-input v-model="form.TotalAdExposureLast30DaysSBad" placeholder="请输入近30天广告曝光" />
        </el-form-item>
        <el-form-item label="近14天广告曝光" prop="TotalAdExposureLast14DaysSBad">
          <el-input v-model="form.TotalAdExposureLast14DaysSBad" placeholder="请输入近14天广告曝光" />
        </el-form-item>
        <el-form-item label="近30天广告点击量" prop="TotalAdClicksLast30DaysSBad">
          <el-input v-model="form.TotalAdClicksLast30DaysSBad" placeholder="请输入近30天广告点击量" />
        </el-form-item>
        <el-form-item label="近14天广告点击量" prop="TotalAdClicksLast14DaysSBad">
          <el-input v-model="form.TotalAdClicksLast14DaysSBad" placeholder="请输入近14天广告点击量" />
        </el-form-item>
        <el-form-item label="近30天广告转化率" prop="AdConversionRateLast30DaysSBad">
          <el-input v-model="form.AdConversionRateLast30DaysSBad" placeholder="请输入近30天广告转化率" />
        </el-form-item>
        <el-form-item label="近14天广告转化率" prop="AdConversionRateLast14DaysSBad">
          <el-input v-model="form.AdConversionRateLast14DaysSBad" placeholder="请输入近14天广告转化率" />
        </el-form-item>
        <el-form-item label="近30天ACOS" prop="ACOSLast30DaysSBad">
          <el-input v-model="form.ACOSLast30DaysSBad" placeholder="请输入近30天ACOS" />
        </el-form-item>
        <el-form-item label="近14天ACOS" prop="ACOSLast14DaysSBad">
          <el-input v-model="form.ACOSLast14DaysSBad" placeholder="请输入近14天ACOS" />
        </el-form-item>
        <el-form-item label="SB分析-执行-复盘" prop="AnalysisExecutionReviewSBad">
          <el-input v-model="form.AnalysisExecutionReviewSBad" placeholder="请输入SB分析-执行-复盘" />
        </el-form-item>
        <el-form-item label="上个月退款率" prop="RefundRateLastMonth">
          <el-input v-model="form.RefundRateLastMonth" placeholder="请输入上个月退款率" />
        </el-form-item>
        <el-form-item label="近30天目标退款率" prop="TargetRefundRateLast30Days">
          <el-input v-model="form.TargetRefundRateLast30Days" placeholder="请输入近30天目标退款率" />
        </el-form-item>
        <el-form-item label="近30天退款率" prop="ActualRefundRateLast30Days">
          <el-input v-model="form.ActualRefundRateLast30Days" placeholder="请输入近30天退款率" />
        </el-form-item>
        <el-form-item label="近14天退款率" prop="ActualRefundRateLast14Days">
          <el-input v-model="form.ActualRefundRateLast14Days" placeholder="请输入近14天退款率" />
        </el-form-item>
        <el-form-item label="近7天退款率" prop="ActualRefundRateLast7Days">
          <el-input v-model="form.ActualRefundRateLast7Days" placeholder="请输入近7天退款率" />
        </el-form-item>
        <el-form-item label="分析-执行-复盘" prop="AnalysisExecutionReview7">
          <el-input v-model="form.AnalysisExecutionReview7" placeholder="请输入分析-执行-复盘" />
        </el-form-item>
        <el-form-item label="上架是否大于3个月(90天)" prop="ListingAgeMoreThan3Months">
          <el-input v-model="form.ListingAgeMoreThan3Months" placeholder="请输入上架是否大于3个月(90天)" />
        </el-form-item>
        <el-form-item label="动销" prop="SalesVelocity">
          <el-input v-model="form.SalesVelocity" placeholder="请输入动销" />
        </el-form-item>
        <el-form-item label="上月广告花费" prop="AdSpendingLastMonth">
          <el-input v-model="form.AdSpendingLastMonth" placeholder="请输入上月广告花费" />
        </el-form-item>
        <el-form-item label="上月广告销售额" prop="AdSalesLastMonth">
          <el-input v-model="form.AdSalesLastMonth" placeholder="请输入上月广告销售额" />
        </el-form-item>
        <el-form-item label="上月广告ROI" prop="ROILastMonth">
          <el-input v-model="form.ROILastMonth" placeholder="请输入上月广告ROI" />
        </el-form-item>
        <el-form-item label="本地库存" prop="LocalInventory">
          <el-input v-model="form.LocalInventory" placeholder="请输入本地库存" />
        </el-form-item>
        <el-form-item label="本地采购在途" prop="LocalProcurementInTransit">
          <el-input v-model="form.LocalProcurementInTransit" placeholder="请输入本地采购在途" />
        </el-form-item>
        <el-form-item label="FBA可售库存" prop="FBASellableInventory">
          <el-input v-model="form.FBASellableInventory" placeholder="请输入FBA可售库存" />
        </el-form-item>
        <el-form-item label="FBA在途库存" prop="FBAInTransitInventory">
          <el-input v-model="form.FBAInTransitInventory" placeholder="请输入FBA在途库存" />
        </el-form-item>
        <el-form-item label="本地库存金额" prop="LocalInventoryValue">
          <el-input v-model="form.LocalInventoryValue" placeholder="请输入本地库存金额" />
        </el-form-item>
        <el-form-item label="本地采购在途金额" prop="LocalProcurementInTransitValue">
          <el-input v-model="form.LocalProcurementInTransitValue" placeholder="请输入本地采购在途金额" />
        </el-form-item>
        <el-form-item label="FBA可售库存金额" prop="FBASellableInventoryValue">
          <el-input v-model="form.FBASellableInventoryValue" placeholder="请输入FBA可售库存金额" />
        </el-form-item>
        <el-form-item label="FBA在途库存金额" prop="FBAInTransitInventoryValue">
          <el-input v-model="form.FBAInTransitInventoryValue" placeholder="请输入FBA在途库存金额" />
        </el-form-item>
        <el-form-item label="总库存金额" prop="TotalInventoryValue">
          <el-input v-model="form.TotalInventoryValue" placeholder="请输入总库存金额" />
        </el-form-item>
        <el-form-item label="上月资金利用率" prop="CapitalUtilizationLastMonth">
          <el-input v-model="form.CapitalUtilizationLastMonth" placeholder="请输入上月资金利用率" />
        </el-form-item>
        <el-form-item label="是否删除" prop="isDelete">
          <el-input v-model="form.isDelete" placeholder="请输入是否删除" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createdAt">
          <el-date-picker clearable v-model="form.createdAt" type="date" value-format="YYYY-MM-DD"
            placeholder="请选择创建时间">
          </el-date-picker>
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

<script setup name="Analysis">
import { listAnalysis, getAnalysis, delAnalysis, addAnalysis, updateAnalysis } from "@/api/amzlog/analysis";

const { proxy } = getCurrentInstance();

const analysisList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    ASIN: null,
    MSKU: null,
    Sales: null,
    Development: null,
    Designer: null,
    ListingDate: null,
    CustomTags: null,
    SKULog: null,
    Status: null,
    AnalysisCategory: null,
    AnalysisContent: null,
    ActionContent: null,
    CompetitorASIN: null,
    CompetitorBrand: null,
    CompetitorSubRank: null,
    CompetitorMainRank: null,
    CompetitorMonthlySales: null,
    CompetitorDailySales: null,
    CompetitorPrice: null,
    CompetitorGrossMargin: null,
    CompetitorDailyProfit: null,
    CompetitorVariants: null,
    CompetitorListingDate: null,
    CompetitorReviews: null,
    CompetitorRating: null,
    CompetitorCopyQuality: null,
    CompetitorRelisting: null,
    CompetitorASIN2: null,
    MarketMonthlyCapacity: null,
    TargetDailySales: null,
    TargetPrice: null,
    TargetDailyRevenue: null,
    TargetGrossMargin: null,
    TargetDailyProfit: null,
    TargetSubRank: null,
    TargetMainRank: null,
    TargetCapitalUtilization: null,
    LastMonthProfit: null,
    LastMonthDailyProfit: null,
    TargetLast30DaysTotalProfit: null,
    ActualLast30DaysTotalProfit: null,
    ActualLast14DaysTotalProfit: null,
    ActualLast7DaysTotalProfit: null,
    TotalInventoryAmountLast30Days: null,
    CapitalUtilizationLast30Days: null,
    ActualLast7DaysSales: null,
    LastMonthTotalSales: null,
    LastMonthDailySales: null,
    TargetLast30DaysTotalSales: null,
    ActualLast30DaysTotalSales: null,
    ActualLast14DaysTotalSales: null,
    ActualLast7DaysTotalSales: null,
    AnalysisExecutionReview: null,
    LastMonthProfitRate: null,
    TargetLast30DaysProfitRate: null,
    ActualLast30DaysProfitRate: null,
    ActualLast14DaysProfitRate: null,
    ActualLast7DaysProfitRate: null,
    AnalysisExecutionReview2: null,
    LastMonthInventoryTurnoverDays: null,
    CurrentTargetInventoryTurnoverDays: null,
    ActualLast7DaysInventoryTurnoverDays: null,
    AnalysisExecutionReview3: null,
    TargetLast14DaysAdBudget: null,
    ActualLast14DaysAdSpending: null,
    TotalAdSpendingLast30Days: null,
    LastMonthAdSpendingRatio: null,
    TargetLast30DaysAdSpendingRatio: null,
    ActualLast30DaysAdSpendingRatio: null,
    ActualLast14DaysAdSpendingRatio: null,
    ActualLast7DaysAdSpendingRatio: null,
    TotalAdExposureLast30Days: null,
    TotalAdExposureLast14Days: null,
    TotalAdExposureLast7Days: null,
    TotalAdClicksLast30Days: null,
    TotalAdClicksLast14Days: null,
    TotalAdClicksLast7Days: null,
    AdConversionRateLast30Days: null,
    AdConversionRateLast14Days: null,
    AdConversionRateLast7Days: null,
    ACOSLast30Days: null,
    ACOSLast14Days: null,
    ACOSLast7Days: null,
    TargetACOSLast30Days: null,
    AnalysisExecutionReview4: null,
    TotalPageViewsLastMonth: null,
    TargetTotalPageViewsLast30Days: null,
    ActualTotalPageViewsLast30Days: null,
    ActualTotalPageViewsLast14Days: null,
    ActualTotalPageViewsLast7Days: null,
    AnalysisExecutionReview5: null,
    ConversionRateLastMonth: null,
    TargetTotalConversionRateLast30Days: null,
    ActualTotalConversionRateLast30Days: null,
    ActualTotalConversionRateLast14Days: null,
    ActualTotalConversionRateLast7Days: null,
    AnalysisExecutionReview6: null,
    SPAd: null,
    ROILast30DaysSPAd: null,
    ROILast14DaysSPAd: null,
    TotalAdExposureLast30DaysSPAd: null,
    TotalAdExposureLast14DaysSPAd: null,
    TotalAdClicksLast30DaysSPAd: null,
    TotalAdClicksLast14DaysSPAd: null,
    AdConversionRateLast30DaysSPAd: null,
    AdConversionRateLast14DaysSPAd: null,
    ACOSLast30DaysSPAd: null,
    ACOSLast14DaysSPAd: null,
    AnalysisExecutionReviewSPAd: null,
    SDAd: null,
    ROILast30DaysSDAd: null,
    ROILast14DaysSDAd: null,
    TotalAdExposureLast30DaysSDAd: null,
    TotalAdExposureLast14DaysSDAd: null,
    TotalAdClicksLast30DaysSDAd: null,
    TotalAdClicksLast14DaysSDAd: null,
    AdConversionRateLast30DaysSDAd: null,
    AdConversionRateLast14DaysSDAd: null,
    ACOSLast30DaysSDAd: null,
    ACOSLast14DaysSDAd: null,
    AnalysisExecutionReviewSDAd: null,
    SBad: null,
    ROILast30DaysSBad: null,
    ROILast14DaysSBad: null,
    TotalAdExposureLast30DaysSBad: null,
    TotalAdExposureLast14DaysSBad: null,
    TotalAdClicksLast30DaysSBad: null,
    TotalAdClicksLast14DaysSBad: null,
    AdConversionRateLast30DaysSBad: null,
    AdConversionRateLast14DaysSBad: null,
    ACOSLast30DaysSBad: null,
    ACOSLast14DaysSBad: null,
    AnalysisExecutionReviewSBad: null,
    RefundRateLastMonth: null,
    TargetRefundRateLast30Days: null,
    ActualRefundRateLast30Days: null,
    ActualRefundRateLast14Days: null,
    ActualRefundRateLast7Days: null,
    AnalysisExecutionReview7: null,
    ListingAgeMoreThan3Months: null,
    SalesVelocity: null,
    AdSpendingLastMonth: null,
    AdSalesLastMonth: null,
    ROILastMonth: null,
    LocalInventory: null,
    LocalProcurementInTransit: null,
    FBASellableInventory: null,
    FBAInTransitInventory: null,
    LocalInventoryValue: null,
    LocalProcurementInTransitValue: null,
    FBASellableInventoryValue: null,
    FBAInTransitInventoryValue: null,
    TotalInventoryValue: null,
    CapitalUtilizationLastMonth: null,
    isDelete: null,
    createdAt: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询amzlog列表 */
function getList() {
  loading.value = true;
  listAnalysis(queryParams.value).then(response => {
    analysisList.value = response.rows;
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
    ASIN: null,
    MSKU: null,
    Sales: null,
    Development: null,
    Designer: null,
    ListingDate: null,
    CustomTags: null,
    SKULog: null,
    Status: null,
    AnalysisCategory: null,
    AnalysisContent: null,
    ActionContent: null,
    CompetitorASIN: null,
    CompetitorBrand: null,
    CompetitorSubRank: null,
    CompetitorMainRank: null,
    CompetitorMonthlySales: null,
    CompetitorDailySales: null,
    CompetitorPrice: null,
    CompetitorGrossMargin: null,
    CompetitorDailyProfit: null,
    CompetitorVariants: null,
    CompetitorListingDate: null,
    CompetitorReviews: null,
    CompetitorRating: null,
    CompetitorCopyQuality: null,
    CompetitorRelisting: null,
    CompetitorASIN2: null,
    MarketMonthlyCapacity: null,
    TargetDailySales: null,
    TargetPrice: null,
    TargetDailyRevenue: null,
    TargetGrossMargin: null,
    TargetDailyProfit: null,
    TargetSubRank: null,
    TargetMainRank: null,
    TargetCapitalUtilization: null,
    LastMonthProfit: null,
    LastMonthDailyProfit: null,
    TargetLast30DaysTotalProfit: null,
    ActualLast30DaysTotalProfit: null,
    ActualLast14DaysTotalProfit: null,
    ActualLast7DaysTotalProfit: null,
    TotalInventoryAmountLast30Days: null,
    CapitalUtilizationLast30Days: null,
    ActualLast7DaysSales: null,
    LastMonthTotalSales: null,
    LastMonthDailySales: null,
    TargetLast30DaysTotalSales: null,
    ActualLast30DaysTotalSales: null,
    ActualLast14DaysTotalSales: null,
    ActualLast7DaysTotalSales: null,
    AnalysisExecutionReview: null,
    LastMonthProfitRate: null,
    TargetLast30DaysProfitRate: null,
    ActualLast30DaysProfitRate: null,
    ActualLast14DaysProfitRate: null,
    ActualLast7DaysProfitRate: null,
    AnalysisExecutionReview2: null,
    LastMonthInventoryTurnoverDays: null,
    CurrentTargetInventoryTurnoverDays: null,
    ActualLast7DaysInventoryTurnoverDays: null,
    AnalysisExecutionReview3: null,
    TargetLast14DaysAdBudget: null,
    ActualLast14DaysAdSpending: null,
    TotalAdSpendingLast30Days: null,
    LastMonthAdSpendingRatio: null,
    TargetLast30DaysAdSpendingRatio: null,
    ActualLast30DaysAdSpendingRatio: null,
    ActualLast14DaysAdSpendingRatio: null,
    ActualLast7DaysAdSpendingRatio: null,
    TotalAdExposureLast30Days: null,
    TotalAdExposureLast14Days: null,
    TotalAdExposureLast7Days: null,
    TotalAdClicksLast30Days: null,
    TotalAdClicksLast14Days: null,
    TotalAdClicksLast7Days: null,
    AdConversionRateLast30Days: null,
    AdConversionRateLast14Days: null,
    AdConversionRateLast7Days: null,
    ACOSLast30Days: null,
    ACOSLast14Days: null,
    ACOSLast7Days: null,
    TargetACOSLast30Days: null,
    AnalysisExecutionReview4: null,
    TotalPageViewsLastMonth: null,
    TargetTotalPageViewsLast30Days: null,
    ActualTotalPageViewsLast30Days: null,
    ActualTotalPageViewsLast14Days: null,
    ActualTotalPageViewsLast7Days: null,
    AnalysisExecutionReview5: null,
    ConversionRateLastMonth: null,
    TargetTotalConversionRateLast30Days: null,
    ActualTotalConversionRateLast30Days: null,
    ActualTotalConversionRateLast14Days: null,
    ActualTotalConversionRateLast7Days: null,
    AnalysisExecutionReview6: null,
    SPAd: null,
    ROILast30DaysSPAd: null,
    ROILast14DaysSPAd: null,
    TotalAdExposureLast30DaysSPAd: null,
    TotalAdExposureLast14DaysSPAd: null,
    TotalAdClicksLast30DaysSPAd: null,
    TotalAdClicksLast14DaysSPAd: null,
    AdConversionRateLast30DaysSPAd: null,
    AdConversionRateLast14DaysSPAd: null,
    ACOSLast30DaysSPAd: null,
    ACOSLast14DaysSPAd: null,
    AnalysisExecutionReviewSPAd: null,
    SDAd: null,
    ROILast30DaysSDAd: null,
    ROILast14DaysSDAd: null,
    TotalAdExposureLast30DaysSDAd: null,
    TotalAdExposureLast14DaysSDAd: null,
    TotalAdClicksLast30DaysSDAd: null,
    TotalAdClicksLast14DaysSDAd: null,
    AdConversionRateLast30DaysSDAd: null,
    AdConversionRateLast14DaysSDAd: null,
    ACOSLast30DaysSDAd: null,
    ACOSLast14DaysSDAd: null,
    AnalysisExecutionReviewSDAd: null,
    SBad: null,
    ROILast30DaysSBad: null,
    ROILast14DaysSBad: null,
    TotalAdExposureLast30DaysSBad: null,
    TotalAdExposureLast14DaysSBad: null,
    TotalAdClicksLast30DaysSBad: null,
    TotalAdClicksLast14DaysSBad: null,
    AdConversionRateLast30DaysSBad: null,
    AdConversionRateLast14DaysSBad: null,
    ACOSLast30DaysSBad: null,
    ACOSLast14DaysSBad: null,
    AnalysisExecutionReviewSBad: null,
    RefundRateLastMonth: null,
    TargetRefundRateLast30Days: null,
    ActualRefundRateLast30Days: null,
    ActualRefundRateLast14Days: null,
    ActualRefundRateLast7Days: null,
    AnalysisExecutionReview7: null,
    ListingAgeMoreThan3Months: null,
    SalesVelocity: null,
    AdSpendingLastMonth: null,
    AdSalesLastMonth: null,
    ROILastMonth: null,
    LocalInventory: null,
    LocalProcurementInTransit: null,
    FBASellableInventory: null,
    FBAInTransitInventory: null,
    LocalInventoryValue: null,
    LocalProcurementInTransitValue: null,
    FBASellableInventoryValue: null,
    FBAInTransitInventoryValue: null,
    TotalInventoryValue: null,
    CapitalUtilizationLastMonth: null,
    isDelete: null,
    createdAt: null,
    updateTime: null,
    createBy: null,
    updateBy: null
  };
  proxy.resetForm("analysisRef");
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
  title.value = "添加amzlog";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getAnalysis(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改amzlog";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["analysisRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateAnalysis(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addAnalysis(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除amzlog编号为"' + _ids + '"的数据项？').then(function () {
    return delAnalysis(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('amzlog/analysis/export', {
    ...queryParams.value
  }, `analysis_${new Date().getTime()}.xlsx`)
}

getList();
</script>
