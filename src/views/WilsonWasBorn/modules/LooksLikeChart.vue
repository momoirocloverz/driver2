<template>
  <div class="looks-like-chart" id="looke_like_chart">
    
  </div>
</template>

<script setup>
  import { defineProps, onMounted, watch } from 'vue';
  import * as echarts from 'echarts';
import { nextTick } from 'process';
  const props = defineProps({
    data: {
      type: Array,
      default: []
    }
  })
  console.log(props.data, 'looksLikeData')
  const init = () => {
    var option = {
      color: ['#2691FF', '#5BD31A', '#FA5C23'],
      // tooltip: {
      //   trigger: 'item'
      // },
      legend: {
        show: false,
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['60%', '80%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 4,
            borderColor: 'transparent',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '14',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: props.data
        }
      ]
    }
    var myChart = echarts.init(document.getElementById('looke_like_chart'));
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
      nextTick(() => {
        init();
      })
    }
  )
</script>

<style lang="scss" scoped>
  .looks-like-chart {
    width: 150px;
    height: 150px;
  }
</style>