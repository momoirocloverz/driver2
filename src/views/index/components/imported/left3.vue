<template>
  <div class="_left3">
    <title-bar title="粮食产量" />
    <select-c :list="selectList" @reload="changeSelect" />

    <div v-if="list.length > 0" class="_chart">
      <div id="left3-chart" class="_chart-chart" />
    </div>

    <list-empty v-else custom-style="height: 200px;" />
  </div>
</template>

<script>
import TitleBar from './titleBar.vue'
import * as echarts from 'echarts'
import SelectC from './select.vue'
import { cl } from './data.js'
import ListEmpty from '@/components/listEmpty.vue'
export default {
  components: { TitleBar, SelectC, ListEmpty },
  props: {
    locationName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectList: [
        { text: '晚稻', select: true },
        { text: '早稻', select: false },
        { text: '小麦', select: false },
        { text: '油菜', select: false }
      ],
      list: [], // 当前数据列表
      curPos: 0, // 当前选择的位置
      chartInstance: null,
      timers: null,
      pos: 0,
      curArea: '奉化区', // 当前的地区
      curType: '晚稻', // 当前的种类

      start: 0,
      end: 4,
      roomTimers: null

    }
  },
  watch: {
    locationName(newLocationName) {
      // console.log('newLocationName' + newLocationName)
      this.reload(newLocationName)
    }
  },

  mounted() {
    this.reload()
    window.addEventListener('resize', this.resizeHandler)
  },
  beforeDestroy() {
    this.chartInstance.dispose()
    window.removeEventListener('resize', this.resizeHandler)
  },
  methods: {
    // 调整当前
    changeSelect: function(item) {
      // console.log(item)
      this.curType = item.text
      this.chartInstance.dispose()
      this.reload()
    },
    reload: function() {
      const list = []
      for (const item of cl) {
        if (item.address == this.curArea && item.type == this.curType) {
          list.push({
            text: item.sub_type,
            value: parseFloat(item.total / 10000).toFixed(2)
          })
        }
      }
      for (let index = 0; index < list.length; index++) {
        for (let index1 = index; index1 < list.length; index1++) {
          if (list[index].value < list[index1].value) {
            const temp = list[index]
            list[index] = list[index1]
            list[index1] = temp
          }
        }
      }
      this.list = list
      setTimeout(() => {
        this.initChart(list)
      }, 0)
    },
    initChart: function(list) {
      const data1 = []
      const dataX = []
      for (const index in list) {
        data1.push({
          name: list[index].text,
          value: list[index].value
        }) //
        dataX.push(list[index].text)
      }
      const chart = echarts.init(document.getElementById('left3-chart'))
      const option = {
        color: ['#00BAFE'],
        legend: {
          show: false,
          top: '5%',
          right: '5%',
          // icon: "rect",
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          borderColor: '#278BFF',
          borderWidth: 1,
          backgroundColor: '#07266C',
          formatter: function(params) {
            return (
              "<div style='width: 100%; font-size: 14px;font-weight: bold;color: #fff;'>" +
              params[0].name +
              '</div>' +
              "<div style='width: 100%;margin-top: vh(6);font-size: 12px;color: #6CD0FF'>产量：" +
              "<span style='margin-left: 8px;font-size: 14px;color: #FFFFFF;'> " +
              params[0].value +
              '万公斤</span>' +
              '</div>'
            )
          }
        },
        xAxis: {
          type: 'category',
          data: dataX,
          nameRotate: 45,
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.14)',
              type: 'dashed'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#90B6D2'
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '万公斤',
            nameLocation: 'end',
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: 'rgba(255, 255, 255, 0.14)'
              }
            },
            splitNumber: 5,
            axisLabel: {
              color: '#90B6D2',
              fontSize: 12
            },
            nameTextStyle: {
              color: '#90B6D2',
              fontSize: 12
            }
          }
        ],
        dataZoom: {
          type: 'inside',
          startValue: this.start,
          endValue: this.end
        },
        grid: {
          top: '18%',
          left: '3%',
          right: '10%',
          bottom: '10%',
          containLabel: true
        },
        series: [
          {
            name: '产量',
            data: data1,
            barWidth: '20px',
            type: 'bar'
          }
        ]
      }
      chart.setOption(option)
      this.chartInstance = chart
      // this.initTimer()
      this.initZoomTimer()
    },
    // 自动滚动
    initTimer: function() {
      if (this.timers) {
        clearInterval(this.timers)
      }
      this.timers = setInterval(() => {
        if (this.pos > 0) {
          this.chartInstance.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            dataIndex: this.pos - 1
          })
        } else {
          this.chartInstance.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            dataIndex: this.list.length - 1
          })
        }
        this.chartInstance.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: this.pos
        })
        // tooltip 跟随显示
        this.chartInstance.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: this.pos
        })
        this.pos++

        if (this.pos > this.list.length - 1) {
          this.pos = 0
        }
      }, 2000)
    },

    //  开启柱状图滚动展示
    initZoomTimer: function() {
      if (this.roomTimers) {
        clearInterval(this.roomTimers)
      }

      this.roomTimers = setInterval(() => {
        ++this.start
        ++this.end

        if (this.start > this.list.length - 4) {
          this.start = 0
          this.end = 4
        }
        setTimeout(() => {
          this.chartInstance.setOption({
            dataZoom: {
              type: 'inside',
              startValue: this.start,
              endValue: this.end
            }
          })
        }, 0)
      }, 2000)
    },

    resizeHandler: function() {
      this.chartInstance?.resize()
    }
  }
}
</script>

<style scoped lang="scss">
._left3 {
  width: 100%;
  margin-top: 16px;
  ._select {
    margin-top: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    ._select-select {
      width: 99px;
      height: 38px;
      line-height: 36px;
      margin-left: 8px;
      background-color: #0053b4;
      border: 1px solid #1db9ff;
      text-align: center;
      font-size: 16px;
      color: #ffffff;
      cursor: pointer;
    }
    ._select-unselect {
      width: 99px;
      height: 38px;
      line-height: 36px;
      margin-left: 8px;
      background-color: #16326e;
      border: 1px solid #29478d;
      text-align: center;
      font-size: 16px;
      color: #6c9fe6;
      cursor: pointer;
    }
  }

  ._chart {
    position: relative;
    width: 100%;
    height: 200px;

    ._chart-chart {
      width: 92%;
      height: 200px;
      margin-top: 20px;
      margin-left: 3%;
    }
  }
}
</style>
