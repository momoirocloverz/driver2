<template>
  <div class="collective-vapital-box">
    <module-title title="村级财务收支" />
    <div class="village-level-chart" ref="villageLevelChartRef"></div>
    <module-title title="农村资源" />
    <div class="_chart">
      <div class="rural-resources-chart" ref="ruralResourcesChartRef"></div>
      <div class="age-legend">
        <div v-for="(item, index) in ploughData" :key="index" class="age-legend-item">
          <div class="age-legend-left">
            <div :style="'background-color: ' + colors[index]"></div>
            {{ item.name }}
          </div>
          <div class="age-legend-right" :style="'color: ' + colors[index]">{{ (Number(item.value) / allValueData).toFixed(2) * 100 }}%</div>
        </div>
      </div>
    </div>
    <module-title title="村级债务" />
    <div class="progress-box">
      <vue3-seamless-scroll :list="progressList" class="scroll" hover="true" step="0.3" singleHeight="34">
        <div v-for="(item, index) in progressList" :key="index" style="margin-bottom: 15px">
          <div class="progress-info">
            <div class="left-box">{{ item['乡镇街道'] }}</div>
            <div class="right-box">
              <span>{{ item['2021年总收入'] }}</span> 万
            </div>
          </div>
          <el-progress :stroke-width="14" :percentage="item['债务']" :text-inside="true" />
        </div>
      </vue3-seamless-scroll>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import moduleTitle from '@/components/moduleTitle'
import { ztsz } from './imported/data'
import * as echarts from 'echarts'
import { Vue3SeamlessScroll } from 'vue3-seamless-scroll'
const villageLevelChartRef = ref(null) // 柱状echarts
const ruralResourcesChartRef = ref(null) // 环形echarts
let ruralResourcesChartInstance
const timers = ref(null)
const pos = ref(0)
const roomTimers = ref(null)
const chartInstance = ref(null)
const villageLevelChartStart = ref(0) // 轮播柱状图起始坐标
const villageLevelChartEnd = ref(2) // 轮播柱状图结束坐标
const allValueData = ref(0) // 总数
const progressList = ref([])
const colors = ['#ED9D1A', '#DED82E', '#17C4EB', '#16E5AA', '#8BBC1E', '#7C61FF']
// 环状图数据
const ploughData = ref([
  {
    name: '耕地',
    value: '17.60'
  },
  {
    name: '园地',
    value: '8.98'
  },
  {
    name: '林地',
    value: '128.63'
  },
  {
    name: '草地',
    value: '0.48'
  },
  {
    name: '湿地',
    value: '4.14'
  },
  {
    name: '其他',
    value: '30.89'
  }
])
onMounted(() => {
  createVillageLevelChart()
  createRuralResourcesChart()
  progressList.value = ztsz.map((item) => {
    item['债务'] = (((item['2021年总收入'] - item['2021年总支出']) / item['2021年总收入']) * 100).toFixed(2)
    return item
  })
})
// 生成柱状图echarts
const createVillageLevelChart = () => {
  const chartDom = villageLevelChartRef.value
  const myChart = echarts.init(chartDom)
  const option = {
    color: ['rgba(45, 222, 225, 1)', 'rgba(229, 160, 55, 1)'],
    tooltip: {
      show: true,
      trigger: 'axis',
      // borderWidth: 1,
      confine: true // 解决tooltip被遮挡
    },
    grid: {
      top: 70,
      left: 75,
      right: 20,
      bottom: 50
    },
    legend: {
      show: true,
      top: '5%',
      right: '5%',
      bottom: '10%',
      textStyle: {
        color: '#fff'
      }
    },
    dataset: {
      // ['乡镇街道', '2021年总收入', '2021年经营性收入','2021年总支出'],
      source: ztsz.map((item) => item)
    },
    dataZoom: {
      type: 'inside',
      startValue: villageLevelChartStart.value,
      endValue: villageLevelChartEnd.value
    },
    xAxis: {
      type: 'category',
      splitLine: {
        show: false
      },
      axisLabel: {
        color: '#FFF',
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      name: '万元',
      axisLabel: {
        formatter: `{value} 万元`,
        color: '#FFF'
      },
      splitNumber: 5,
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dotted',
          color: 'rgba(255, 255, 255,0.3)'
        }
      },
      nameTextStyle: {
        color: '#fff'
      }
    },
    series: [
      {
        type: 'bar',
        itemStyle: {
          normal: {
            label: {
              show: true, //开启显示
              position: 'top', //在上方显示
              textStyle: {
                //数值样式
                color: '#fff',
                fontSize: 14
              }
            },
            color: new echarts.graphic.LinearGradient(1, 1, 1, 0, [
              { offset: 0, color: 'rgba(127, 145, 145, 0.0400)' },
              { offset: 1, color: 'rgba(45, 222, 225, 1)' }
            ])
          }
        },
        smooth: true
      },
      {
        type: 'bar',
        itemStyle: {
          normal: {
            label: {
              show: true, //开启显示
              position: 'top', //在上方显示
              textStyle: {
                //数值样式
                color: '#fff',
                fontSize: 14
              }
            },
            color: new echarts.graphic.LinearGradient(1, 1, 1, 0, [
              { offset: 0, color: 'rgba(229, 160, 55, 0.0400)' },
              { offset: 1, color: 'rgba(229, 160, 55, 1)' }
            ])
          }
        }
      }
    ]
  }
  option && myChart.setOption(option)
  chartInstance.value = myChart
  initZoomTimer()
}
// 生成环形图echarts
const createRuralResourcesChart = () => {
  let allValue = 0
  const legendData = []
  ploughData.value.forEach((item, index) => {
    allValue += Number(item.value) // 获取总数
    legendData.push({
      name: item.name,
      value: item.value,
      icon: 'roundRect',
      itemStyle: {
        color: colors[index]
      }
    }) // 图列列表
  })
  allValueData.value = allValue
  const chartDom = ruralResourcesChartRef.value
  const myChart = echarts.init(chartDom)
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
              return `${params.name}\n\n{value|${((params.value * allValue) / 100).toFixed(2)}}万亩\n\n(${params.value}%)`
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
        data: ploughData.value.map((item) => {
          return { name: item.name, value: (Number(item.value) / allValue).toFixed(2) * 100 } // 转成百分比
        })
      }
    ]
  }

  option && myChart.setOption(option)
  ruralResourcesChartInstance = myChart
  initTimer()
}
//  开启柱状图滚动展示
const initZoomTimer = () => {
  if (roomTimers.value) {
    clearInterval(roomTimers.value)
  }

  roomTimers.value = setInterval(() => {
    ++villageLevelChartStart.value
    ++villageLevelChartEnd.value

    if (villageLevelChartStart.value > ztsz.length - 2) {
      villageLevelChartStart.value = 0
      villageLevelChartEnd.value = 2
    }

    setTimeout(() => {
      chartInstance.value.setOption({
        dataZoom: {
          type: 'inside',
          startValue: villageLevelChartStart.value,
          endValue: villageLevelChartEnd.value
        }
      })
      // tooltip 跟随显示
      // chartInstance.value && chartInstance.value.dispatchAction({
      //   type: "showTip",
      //   seriesIndex: villageLevelChartStart.value,
      //   dataIndex: villageLevelChartStart.value,
      // });
    }, 0)
  }, 2000)
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
        dataIndex: ploughData.value.length - 1
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
    // console.log(pos.value);

    if (pos.value > ploughData.value.length - 1) {
      pos.value = 0
    }
  }, 2000)
}
</script>
<style scoped lang="scss">
.collective-vapital-box {
  .village-level-chart {
    height: 217px;
  }
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

  .progress-box {
    padding-top: 20px;
    .scroll {
      height: 250px;
      width: 100%;
      overflow: hidden;
    }
    .progress-info {
      display: flex;
      align-items: center;
      margin-bottom: 7px;
      .left-box {
        flex: 1;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #cceaff;
      }
      .right-box {
        text-align: right;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.8);
        span {
          font-size: 18px;
          font-family: DINAlternate-Bold, DINAlternate;
          font-weight: bold;
          color: #ffffff;
          margin-right: 4px;
        }
      }
    }
  }
}
</style>
