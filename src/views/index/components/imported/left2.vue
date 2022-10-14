<template>
  <div class="_left2">
    <title-bar title="种植面积" />
    <select-c :list="selectList" @reload="changeSelect" />

    <div v-if="list.length > 0" class="_chart">
      <div id="left2-chart" class="_chart-chart" />
      <div class="_legend">
        <div v-for="(item, index) in list" :key="index" class="_legend-item">
          <div class="_legend-left">
            <div
              :style="'background-color: ' + colors[index % 7].color"
              class="_legend-block"
            />
            <span
              :style="'color: ' + colors[index % 7].color"
              class="_legend-title"
            >
              {{ item.text }}</span>
          </div>
          <div
            :style="'color: ' + colors[index % 7].color"
            class="_legend-value"
          >
            {{ item.value }}亩
          </div>
        </div>
      </div>
    </div>

    <list-empty v-else custom-style="height: 200px;" />
  </div>
</template>

<script>
import TitleBar from './titleBar.vue'
import * as echarts from 'echarts'
import SelectC from './select.vue'
import { pzzzmj } from './data.js'
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
      colors: [
        { color: '#26EEFF' },
        { color: '#05AAFF' },
        { color: '#EEFE6E' },
        { color: '#EB7A1A' },
        { color: '#17FF82' },
        { color: '#FFB9F7' },
        { color: '#E079FF' }
      ],
      list: [], // 当前数据列表
      chartInstance: null,
      timers: null,
      pos: 0,
      curArea: '奉化区', // 当前的地区
      curType: '晚稻' // 当前的种类
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
      this.curType = item.text
      this.chartInstance.dispose()
      this.reload()
    },
    reload: function() {
      const list = []
      for (const item of pzzzmj) {
        if (item.address == this.curArea && item.type == this.curType) {
          list.push({
            text: item.sub_type,
            value: parseInt(item.area)
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
          value: list[index].value,
          icon: 'roundRect',
          itemStyle: {
            color: this.colors[index % 7].color
          }
        }) //
        dataX.push(list[index].text)
      }
      const chart = echarts.init(document.getElementById('left2-chart'))
      const option = {
        legend: {
          show: false,
          type: 'scroll',
          orient: 'vertical',
          left: '56%',
          top: '20%',
          padding: [5, 5, 5, 5],
          data: data1,
          textStyle: {
            color: '#fff'
            // fontSize: 16,
          },
          formatter: ' {name} ',
          pageTextStyle: {
            color: '#fff'
          },
          pageIconColor: '#fff'
        },
        tooltip: {
          trigger: 'item',
          borderColor: '#278BFF',
          borderWidth: 1,
          backgroundColor: '#07266C',
          formatter: function(params) {
            return (
              "<div style='width: 100%; font-size: 14px;font-weight: bold;color: #fff;'>" +
              params.name +
              '</div>' +
              "<div style='width: 100%;margin-top: vh(6);font-size: 12px;color: #6CD0FF'>占比：" +
              "<span style='margin-left: 8px;font-size: 14px;color: #FFFFFF;'> " +
              params.value +
              '亩</span>' +
              '</div>'
            )
          }
        },
        series: [
          {
            name: '',
            data: data1,
            radius: ['60%', '70%'],
            type: 'pie',
            right: '40%',
            itemStyle: {
              // borderRadius: 2,
              // borderColor: "rgba(255,255,255,0.1)",
              // borderWidth: 12,
            },
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
                formatter: '{b}\n\n{value|{c}}亩',
                rich: {
                  value: {
                    color: '#26E3FF',
                    fontSize: '28',
                    fontWeight: 'bold',
                    padding: [0, 8, 0, 0]
                  }
                }
              }
            }
          }
        ]
      }
      chart.setOption(option)
      this.chartInstance = chart
      this.initTimer()
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
    resizeHandler: function() {
      this.chartInstance?.resize()
    }
  }
}
</script>

<style scoped lang="scss">
._left2 {
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

    ._chart-chart {
      width: 100%;
      height: 200px;
    }
    ._legend {
      position: absolute;
      top: 10px;
      right: 60px;
      width: 160px;
      height: 200px;
      overflow-x: hidden;
      overflow-y: scroll;
      ._legend-item {
        width: 100%;
        margin-bottom: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        ._legend-left {
          display: flex;
          flex-direction: row;
        }

        ._legend-block {
          width: 12px;
          height: 12px;
        }

        ._legend-title {
          width: 100px;
          margin-left: 3px;
          font-size: 14px;
          color: #fff;
        }

        ._legend-value {
          width: 0;
          flex: 1;
          font-size: 14px;
          text-align: right;
          white-space: nowrap;
        }
      }
    }
    ._legend::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
