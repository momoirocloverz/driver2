<template>
  <div class="gbznt-chart">
    <div class="chart" ref="myRef"></div>
  </div>
</template>

<script>
import { defineComponent, inject, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import lodash from 'lodash'
import { color, compare } from './const'
import gbzntArea from '@/assets/js/gbzntArea.json'
import * as echarts from 'echarts'

export default defineComponent({
  props: {
    cityArea: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  setup(props, { emit }) {
    const myRef = ref(null)
    const unit = inject('unit')
    let interval = null
    let myEcharts = null
    const chartData = reactive({
      xData: [],
      yData: [],
      ySecondData: [],
      ploughData:[108174.0837,
        489637.1715,
        182231.566,
        153822.3785,
        55499.77763,
        341856.7734,
        209543.4782,
        193313.5362,
        380157.062,
        55454.81373,
        ]
    })

    const formatData = () => {
      const data = lodash.cloneDeep(gbzntArea)
      data.map((item,index) => {
        chartData.xData.push(item.city || '')
        chartData.yData.push((+item.area).toFixed(2) || 0)
        props.cityArea.name.forEach((items, indexs)=>{ 
          if (items == item.city) { 
            chartData.ySecondData.push((+props.cityArea.lgq[indexs]).toFixed(2) || 0)
          }
        })
      })
      initEcharts()
    }

    const initEcharts = () => {
      myEcharts = echarts.init(myRef.value)
      myEcharts.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          show: false,
        },
        color: color,
        grid: {
          left: '6%',
          right: '6%',
          bottom: '0%',
          top: '18%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: chartData.xData,
            axisTick: {
              show: false // 轴刻度线
            },
            axisLine: { // 轴线
              show: true,
              lineStyle: {
                color: 'rgba(185, 200, 218, .2)',
              }
            },
            axisLabel: {
              fontSize: 12 * unit.value,
              lineHeight: 20 * unit.value,
              color: 'rgba(255, 255, 255, .7)',
            }
          }
        ],
        legend: {
          show: true,
          selectedMode: false, // 取消点击事件
          itemGap: 30 * unit.value,
          itemHeight: 12 * unit.value,  // 设置图例图形的高
          top: '0',
          right: '0',
          textStyle: {
            color: "#fff",
          },
          icon: 'circle'
        },
        yAxis: [
          {
            type: 'value',
            name: '面积（亩）',
            axisLabel: {
              formatter: '{value}',
              fontSize: 14 * unit.value,
              color: 'rgba(255, 255, 255, .7)'
            },
            position: 'left',
            splitLine: {
              show: true, // 轴刻度线
              lineStyle: {
                type: 'dashed',
                color: 'rgba(255, 255, 255, .08)',
              }
            },
            nameTextStyle: {
              fontSize: 14 * unit.value,
              color: 'rgba(255, 255, 255, .7)',
              align: 'right',
            }
          },
        ],
        series: [
          {
            name: '高标准农田面积',
            type: 'bar',
            barWidth: 16 * unit.value,
            color: ['rgba(0, 168, 255, 1)'],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: 'rgba(222, 255, 255, 0.04)' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(45, 222, 225, 1)' // 100% 处的颜色
                }], false)
            },
            data: chartData.yData
          },
          {
            name: '粮功区面积',
            type: 'bar',
            // barGap: "-100%",
            barWidth: 16 * unit.value,
            color: ['rgba(0, 168, 255, 1)'],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: 'rgba(156, 207, 255, 0.04)' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(156, 207, 255, 1)' // 100% 处的颜色
                }], false)
            },
            data: chartData.ySecondData
          },
          {
            name: '耕地面积',
            type: 'bar',
            // barGap: "-100%",
            barWidth: 16 * unit.value,
            color: ['rgba(106, 150, 255, 1)'],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: 'rgba(106, 150, 255, 0.0400)' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(106, 150, 255, 1)' // 100% 处的颜色
                }], false)
            },
            data: chartData.ploughData
          }
        ]
      })
      myEcharts.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: 0
      })
      myEcharts.on('mouseover', (a) => {
        clearInterval(interval)
        myEcharts.dispatchAction({
          type: 'downplay',
        });
        myEcharts.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: a.dataIndex
        })
      })
      myEcharts.on('mouseout', () => {
        myEcharts.dispatchAction({
          type: 'downplay',
        });
        startInterval()
      })
      myEcharts.on('click', (e) => {
        emit('update:areaName', e.name)
      })
      startInterval();
    }
    const startInterval = () => {
      interval && clearInterval(interval)
      let currentIndex = -1
      interval = setInterval(() => {
        var dataLen = chartData.xData.length
        // 取消之前高亮的图形
        myEcharts.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: currentIndex
        });
        currentIndex = (currentIndex + 1) % dataLen
        // 高亮当前图形
        myEcharts.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: currentIndex
        })
      }, 3000)
    }

    watch(() => unit.value, () => {
      setTimeout(() => {
        if (myEcharts) myEcharts.dispose()
        initEcharts()
      }, 1000)
    })

    onBeforeUnmount(() => {
      interval && clearInterval(interval)
    })

    onMounted(() => {
      gbzntArea.sort(compare('area'));
      nextTick(() => {
        formatData()
      })
    })

    return {
      myRef,
    }
  }
})
</script>

<style scoped lang="scss">
.gbznt-chart {
  position: relative;
  height: 200px;
  margin: 10px 0;

  .chart {
    width: 100%;
    height: 100%;
  }
}
</style>
