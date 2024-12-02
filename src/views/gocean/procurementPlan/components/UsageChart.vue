<template>
  <div ref="chartContainer" class="chart-container">
    <div ref="chartEl" style="width: 100%; height: 100%;"></div>
  </div>
</template>

<script>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'

export default {
  name: 'UsageChart',
  props: {
    usageData: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const chartContainer = ref(null)
    const chartEl = ref(null)
    let chart = null

    const initChart = () => {
      if (!chartEl.value) return
      
      chart = echarts.init(chartEl.value)
      
      const option = {
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: props.usageData.map(d => d.usage_date),
          axisLabel: {
            interval: 'auto',
            rotate: 0
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        series: [{
          data: props.usageData.map(d => d.usage_amount),
          type: 'line',
          smooth: false,
          symbol: 'circle',
          symbolSize: 4,
          lineStyle: {
            width: 1.5
          },
          itemStyle: {
            color: '#409EFF'
          }
        }],
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            const data = params[0];
            return `${data.name}<br/>使用量: ${data.value}`;
          }
        }
      }
      
      chart.setOption(option)
    }

    const handleResize = () => {
      if (chart) {
        chart.resize()
      }
    }

    watch(() => props.usageData, () => {
      if (chart) {
        const option = {
          xAxis: {
            data: props.usageData.map(d => d.usage_date)
          },
          series: [{
            data: props.usageData.map(d => d.usage_amount)
          }]
        }
        chart.setOption(option)
      }
    }, { deep: true })

    onMounted(() => {
      initChart()
      window.addEventListener('resize', handleResize)
    })

    onUnmounted(() => {
      if (chart) {
        chart.dispose()
        window.removeEventListener('resize', handleResize)
      }
    })

    return {
      chartContainer,
      chartEl
    }
  }
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  position: relative;
}
</style> 