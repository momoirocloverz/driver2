<template>
  <div class="county-pie">
    <div class="chert-wrap">
      <div class="chart" ref="myRef"></div>
    </div>
  </div>
</template>

<script>
import { defineComponent, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import lodash from 'lodash'
import { color, compare, countyList } from './const'
import * as echarts from 'echarts'
import countyTotalArea from '@/assets/js/countyTotalArea.json'

export default defineComponent({
  props: {
    selectVal: {
      type: String,
      default: "奉化区",
    },// 地区筛选 xx市/xx区县/xx镇街}
    cityArea: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  setup(props, {emit}) {
    const chartData = ref([])
    const totalArea = ref(0)
    const myRef = ref(null)
    const unit = inject('unit')
    let interval = null
    let myEcharts = null
    const areaArr = ref([]);

    const formatData = () => {
      initEcharts();
    }

    const initEcharts = () => {
      console.log(props,'props')
      myEcharts = echarts.init(myRef.value)
      const seriesData= [
          {
            name: '粮功区面积',
            type: 'bar',
            barWidth: 35 * unit.value,
            color: ['rgba(0, 168, 255, 1)'],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: 'rgba(222, 255, 255, 0.04)' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(45, 222, 225, .6)' // 100% 处的颜色
                }], false)
            },
            data: props.cityArea.lgq
          },
      ]
      if (props.selectVal == '宁波市') {
        seriesData.push(   {
            name: '在高标准农田范围内面积',
            type: props.cityArea.gbznt?.[0] !== '' ? 'bar' : '',
            barGap: "-100%",
            barWidth: 35 * unit.value,
            color: ['rgba(0, 168, 255, 1)'],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: 'rgba(222, 255, 255, 0.04)' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(255, 232, 30, .6)' // 100% 处的颜色
                }], false)
            },
            data: props.cityArea.gbznt
          })
      }
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
        color: color,
        grid: {
          left: '4%',
          right: '4%',
          bottom: '0%',
          top: '18%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: props.cityArea.name.map((name) => name),
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
              rotate: 60,
              formatter: (params) => {
                let arrStr =params.length >= 6? params.substr(0, 6) + '...': params;
                return arrStr;
              },
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '面积（亩）',
            axisLabel: {
              formatter: '{value}',
              fontSize: 14 * unit.value,
              color: 'rgba(255, 255, 255, .7)'
            },
            position: "left",
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
        series: seriesData
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
        var dataLen = areaArr.value.length
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
      areaArr.value = lodash.cloneDeep(countyTotalArea);
      areaArr.value.map(item => {
        item.value = item.value * .0015
      })
      areaArr.value.sort(compare('value'));
      nextTick(() => {
        formatData();
      })
    })

    return {
      myRef,
      color,
      totalArea,
      chartData,
    }
  }
})
</script>

<style scoped lang="scss">
.chert-wrap {
  position: relative;
  height: 270px;
  margin: 10px 0;
  .chart {
    width: 100%;
    height: 100%;
  }
  .legends {
    position: absolute;
    z-index: 0;
    height: 100%;
    width: 60%;
    top: 0;
    left: 45%;
    padding: 30px 50px 30px 0;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    .item {
      width: 50%;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding: 0 20px;
      span {
        width: 12px;
        height: 12px;
        margin-right: 12px;
      }
      p {
        &:nth-of-type(1) {
          opacity: .7;
        }
        &:nth-of-type(2) {
          opacity: .7;
          text-indent: 12px;
        }
      }
    }
  }
}
</style>
