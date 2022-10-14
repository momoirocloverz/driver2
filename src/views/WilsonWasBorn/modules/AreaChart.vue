<template>
  <div class="area-chart" id="areaChart">
    
  </div>
</template>

<script setup>
  import { defineProps, onMounted, nextTick, watch } from 'vue';
  import * as echarts from 'echarts';

  const props = defineProps({
    data: {
      type: Object,
      default: {}
    }
  })

  const init = () => {
    var option = {
      color: ['#2691FF', '#5BD31A', '#FA5C23'],
      legend: {
        data: ['健壮', '良好', '较差'],
        left: '10%',
        textStyle: {
          color: '#fff'
        }
      },
      tooltip: {},
      xAxis: {
        data: props.data.city_arr,
        name: '',
        axisLine: {
          onZero: false,
          lineStyle: {
            color: '#fff'
          }
        },
        axisLabel: {
          color: '#fff',
          fontSize: 14
        },
        axisTick: {
          show: false
        }
      },
      yAxis: {
        axisLabel: {
          color: '#fff',
          fontSize: 14
        },
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      grid: {
        top: '20%',
        bottom: '15%',
        right: 0
      },
      series: [
        {
          name: '健壮',
          type: 'bar',
          stack: 'one',
          data: props.data.data1
        },
        {
          name: '良好',
          type: 'bar',
          stack: 'one',
          data: props.data.data2
        },
        {
          name: '较差',
          type: 'bar',
          stack: 'one',
          data: props.data.data3
        }
      ]
    }
    var myChart = echarts.init(document.getElementById('areaChart'));
    myChart.setOption(option);
  }

  onMounted(() => {
    nextTick(() => {
      init();
    })
  })

  watch(
    () => props.data,
    (val) => {
      console.log(val, 'props.data')
      nextTick(() => {
        init();
      })
    }
  )
</script>

<style lang="scss" scoped>
  .area-chart {
    width: 100%;
    height: 200px;
  }
</style>