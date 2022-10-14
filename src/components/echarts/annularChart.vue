<template>
  <div class="_chart">
    <div class="rural-resources-chart" ref="ruralResourcesChartRef" />
    <div class="age-legend">
      <div v-for="(item, index) in lengthData" :key="index" class="age-legend-item">
        <div class="age-legend-left">
          <div :style="'background-color: ' + colors[index]"></div>
          {{ item.name }}
        </div>
        <div class="age-legend-right" :style="'color: ' + colors[index]">{{ item.value }}%</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import * as echarts from 'echarts'
import { ref, onMounted, defineProps, onUnmounted } from 'vue'
const colors = ['#ED9D1A', '#DED82E', '#17C4EB', '#16E5AA', '#8BBC1E', '#7C61FF']
const ruralResourcesChartRef = ref(null) // 环形echarts
const timers = ref(null)
const pos = ref(0)
let ruralResourcesChartInstance

const props = defineProps({
  chartsData: {
    default: [],
    type: Array
  },
  lengthData: {
    default: [],
    type: Array
  }
})
const { chartsData = [] } = props
onMounted(() => {
  createRuralResourcesChart()
})
// 生成环形图echarts
const createRuralResourcesChart = () => {
  const chartDom = ruralResourcesChartRef.value
  const myChart = echarts.init(chartDom)
  console.log(chartsData, 'chartsData')
  const option = {
    color: colors,
    tooltip: {
      show: false,
      trigger: 'item',
      borderColor: '#278BFF',
      borderWidth: 1,
      backgroundColor: '#07266C',
      formatter: function (params) {
        return (
          "<div style='width: 100%; font-size: 14px;font-weight: bold;color: #fff;'>" +
          params.name +
          '</div>' +
          "<div style='width: 100%;margin-top: vh(6);font-size: 12px;color: #6CD0FF'>占比：" +
          "<span style='margin-left: 8px;font-size: 14px;color: #FFFFFF;'> " +
          params.value +
          '%</span>' +
          '</div>'
        )
      }
    },
    // legend: {
    //   show: false,
    //   type: "scroll",
    //   orient: "vertical",
    //   left: "56%",
    //   top: "20%",
    //   padding: [5, 5, 5, 5],
    //   data: legendData,
    //   textStyle: {
    //     color: "#fff",
    //     // fontSize: 16,
    //   },
    //   formatter: " {name} ",
    //   pageTextStyle: {
    //     color: "#fff",
    //   },
    //   pageIconColor: "#fff",
    // },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['60%', '70%'],
        right: '40%',
        label: {
          show: false,
          position: 'center'
        },
        labelLine: {
          show: true
        },
        silent: true,
        emphasis: {
          label: {
            color: '#fff',
            show: true,
            fontSize: '14',
            formatter: function (params) {
              return `${params.name}\n\n{value|${params.value}}${chartsData[0].unit}`
            },
            rich: {
              value: {
                color: '#FFFFFF',
                fontSize: '24',
                fontWeight: 'bold',
                padding: [0, 8, 0, 0]
              }
            }
          }
        },
        data: chartsData
      }
    ]
  }

  option && myChart.setOption(option)
  ruralResourcesChartInstance = myChart
  initTimer()
}
// 环形图自动滚动
const initTimer = () => {
  if (timers.value) {
    clearInterval(timers.value)
  }
  timers.value = setInterval(() => {
    if (pos.value > 0) {
      ruralResourcesChartInstance.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: pos.value - 1
      })
    } else {
      ruralResourcesChartInstance.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: chartsData.length - 1
      })
    }
    ruralResourcesChartInstance.dispatchAction({
      type: 'highlight',
      seriesIndex: 0,
      dataIndex: pos.value
    })
    // tooltip 跟随显示
    ruralResourcesChartInstance.dispatchAction({
      type: 'showTip',
      seriesIndex: 0,
      dataIndex: pos.value
    })
    pos.value++

    if (pos.value > chartsData.length - 1) {
      pos.value = 0
    }
  }, 2000)
}

// 销毁echarts实例
onUnmounted(() => {
  console.log(ruralResourcesChartInstance, 'ruralResourcesChartRef.value')
  ruralResourcesChartInstance.dispose // 销毁实例
  // echarts.init(ruralResourcesChartInstance).dispose() // 销毁实例
})
</script>
<style scoped lang="scss">
._chart {
  width: 100%;
  position: relative;
  .rural-resources-chart {
    height: 212px;
  }
  .age-legend {
    position: absolute;
    right: -40px;
    top: 40px;
    width: 160px;
    height: 110px;
    // background-color: rgba($color: #fff, $alpha: 0.2);
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .age-legend-item {
      margin-bottom: 7px;
      width: 113px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      .age-legend-left {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 16px;
        color: #a1ceef;
        div {
          width: 12px;
          height: 12px;
          margin-right: 8px;
        }
      }

      .age-legend-right {
        font-size: 14px;
        font-weight: 600;
      }
    }
  }
}
</style>
