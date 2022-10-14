<template>
  <div class="city-pie">
    <div class="chart" ref="myRef"></div>
    <div class="legends">
      <div class="item" v-for="(item, index) in cityData" :key="index">
        <span :style="{ background: color[index] }"></span>
        <p>{{ item.name }}</p>
        <p :style="{ color: color[index] }">{{ item.percent }}%</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import lodash from 'lodash'
import { color, compare } from './const'
import * as echarts from 'echarts'
import numberOfLGQ from '@/assets/js/theNumberOfLGQ.json';

export default defineComponent({
  name: 'cityPie',
  props: {
    areaName: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const cityData = ref([])
    const totalArea = ref(0)
    const myRef = ref(null)
    const unit = inject('unit')
    let interval = null
    let myEcharts = null

    const initEcharts = () => {
      myEcharts = echarts.init(myRef.value)

      let currentIndex = -1
      let dataLen = cityData.value.length
      currentIndex = (currentIndex + 1) % dataLen
      // 高亮当前图形

      let totalData = 0
      cityData.value.map(item => {
        totalData += +item.num
      })

      myEcharts.setOption({
        tooltip: {
          show: false,
          trigger: 'item',
        },
        legend: {
          show: false,
          selectedMode: false, // 取消点击事件
          icon: 'square',
          itemGap: 22 * unit.value,
          itemHeight: 12 * unit.value,  // 设置图例图形的高
          orient: 'vertical',
          top: 'center',
          left: '40%',
          width: '60%',
          textStyle: {
            color: '#fff',  // 图例文字颜色
            fontSize: 14 * unit.value,
            rich: {
              a: {
                width: 60 * unit.value,
                fontSize: 14 * unit.value,
                color: 'rgba(255, 255, 255, .8)',
              },
              b: {
                width: 150 * unit.value,
                fontSize: 14 * unit.value,
                padding: [0, 0, 0, -10],
                color: 'rgba(255, 255, 255, .8)',
              }
            }
          },
          formatter: function (name) {
            let target
            cityData.value.forEach(item => {
              if (item.name === name) {
                target = +item.num
              }
            })
            return ['{b|' + name + '}', '{a|' + percent + '}'].join('')
          }
        },
        color: color,
        grid: {
          left: '0%',
          right: '0%',
          bottom: '0%',
          top: '0%',
          containLabel: true,
        },
        series: [
          {
            type: 'pie',
            avoidLabelOverlap: true,
            center: ['18%', '50%'],
            radius: ['60%', '75%'],
            label: {
              show: false,
              position: 'center',
              lineHeight: 28 * unit.value,
              formatter: function (params) {
                return [
                  '{title|' + params.data.name + '}',
                  '{bule|' + +params.data.value + '}{default|个}',
                  '{bule|' + params.data.percent + '}{default|%}'
                ].join('\n')
              },
              // formatter:  [
              //   '{title|{}}',
              //   // '{bule|{c}}{default|亩}',
              //   '{bule|{d}}{default|%}'
              // ].join('\n\n'),
              rich: {
                title: {
                  color: '#fff',
                  fontSize: 16 * unit.value
                },
                bule: {
                  color: '#26E3FF',
                  fontSize: 20 * unit.value,
                  fontFamily: 'PangMenZhengDao',
                  padding: [0, 4, 0, 0],
                  textShadowBlur: 8,
                  textShadowOffsetX: 0,
                  textShadowOffsetY: 0,
                  textShadowColor: 'rgba(43, 228, 255, 0.3)'
                },
                default: {
                  fontSize: 14 * unit.value,
                  color: '#fff'
                }
              }
            },
            emphasis: {
              blurScope: 'coordinateSystem',
              label: {
                show: true,
                fontSize: 14 * unit.value,
                fontWeight: 'bold',
              }
            },
            data: cityData.value
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
      startInterval()
    }
    
    const startInterval = (index) => {
      interval && clearInterval(interval)
      let currentIndex = -1
      interval = setInterval(() => {
        var dataLen = cityData.value.length
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
          dataIndex: index ?? currentIndex //如果index是0会默认走currentIndex
        })
      }, index===0||index ? 10 : 3000) //如果index是0会默认走3000 但是逻辑应该index是可以包含0的
    }

    watch(() => unit.value, () => {
      setTimeout(() => {
        if (myEcharts) myEcharts.dispose()
        initEcharts()
      }, 1000)
    })
    
    watch(() => props.areaName, val => {
      cityData.value.map((e, i) => {
        if(e.name === val) {
          console.log(i, 'iiiiii')
          startInterval(i)
        }
      })
    })

    onBeforeUnmount(() => {
      interval && clearInterval(interval)
    })

    onMounted(() => {
      cityData.value = lodash.cloneDeep(numberOfLGQ);
      cityData.value.map(item => {
        item.value = item.num
        
      })
      cityData.value.sort(compare('percent'));//echarts 增加图例按百分比排序功能
      nextTick(() => {
        // 高亮当前图形
        initEcharts()
      })
    })

    return {
      myRef,
      cityData,
      color,
      totalArea
    }
  }
})
</script>

<style scoped lang="scss">
  .city-pie {
    position: relative;
    height: 230px;
    .chart {
      width: 100%;
      height: 100%;
    }
    .legends {
      position: absolute;
      z-index: 0;
      height: 100%;
      width: 68%;
      top: 0;
      left: 32%;
      padding: 30px 30px 30px 0;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      .item {
        width: 50%;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding-left: 20px;
        span {
          width: 12px;
          height: 12px;
          margin-right: 12px;
        }
        p {
          &:nth-of-type(1) {
            flex: 1;
            opacity: .7;
          }
          &:nth-of-type(1) {
            flex: 1;
          }
        }
      }
    }
  }
</style>
