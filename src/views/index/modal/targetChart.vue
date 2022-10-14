<template>
  <div class="title">{{props.selectedObj.name}}</div>
  <div class="rac-chart-container">
  <div class="rac-chart" ref="chartRef" />
</div>
</template>
<script setup>
import { inject, watch, ref,defineProps, computed, onBeforeUnmount, watchEffect, onMounted } from "vue";
import echartTheme from '@/assets/js/产业大脑/charts/echart-theme.json';
import {init, graphic} from 'echarts';
import { round } from "lodash";
const props = defineProps({
  selectedObj: {
    type: Object,
  },
})
// charts
const regionNames = inject("regionNamePath");// 地区切换
const currentRegionName = computed(()=>{
  const path = regionNames.value.split('/');
  return path[path.length - 1];
})
// 全局变量定时器timeId 用来轮播选中
const timeId = ref(null);
const pos = ref(0);
const allData = ref([]);
const chartColors = ['#2DDEE1', '#FFE81E', '#E5A037']
const showChart = ref(false)
const chartRef = ref(null)
let chartInstanceRef = null;
const availableCharts = {
  '产业-资源-畜牧': [
      {
        name: '家禽生产供给目标',
        fileName: '畜牧_家禽生产供给目标',
      },
      {
        name: '肉牛生产供给目标',
        fileName: '畜牧_肉牛生产供给目标',
      },
      {
        name: '肉羊生产供给目标',
        fileName: '畜牧_肉羊生产供给目标',
      },
      {
        name: '生猪生产供给目标',
        fileName: '畜牧_生猪生产供给目标',
      },
    ],
  '产业-资源-粮食': [
    {
      name: '水稻生产保供目标',
      fileName: '粮食_水稻生产保供目标',
    },
    {
      name: '小麦生产保供目标',
      fileName: '粮食_小麦生产保供目标',
    },
  ],
  '产业-资源-水产': [
    {
      name: '水产养殖生产供给目标',
      fileName: '水产养殖生产供给目标',
    }
  ],
  '产业-资源-蔬菜': [
    {
      name: '蔬菜生产供给目标',
      fileName: '蔬菜生产供给目标',
    }
  ],
  '产业-资源-食用植物油': [
    {
      name: '油菜籽生产保供目标',
      fileName: '食用植物油_油菜籽生产保供目标',
    },
    {
      name: '油茶生产保供目标',
      fileName: '食用植物油_油茶生产保供目标',
    }
  ],
}
onMounted(() => { 
  creatCharts()
})
const creatCharts = () => { 
  const chartConfig = props.selectedObj;
  chartInstanceRef?.clear();
  if (chartConfig) {
    import(`@/assets/js/产业大脑/charts/${chartConfig.fileName}.json`).then(v => {
      loadChartData(generateEchartOptions(v.default, regionNames.value.split('/')[regionNames.value.split('/').length-1]));
    }).catch(console.error)
  } else {
    showChart.value = false
  }
}

const generateEchartOptions = (src, activeRegionName = currentRegionName.value) => {
  const xAxisValues = src.xAxis;
  allData.value = src.xAxis; // 记录总数据
  const yAxis = Array.from(new Set(src.series.map(e=>e.unit))).map(unit=>{
    return {
      type: 'value',
      name: unit,
      axisLabel: {
        formatter: `{value} ${unit}`,
        color: '#FFF',
      },
      splitLine: {
        show: false,
      },
      nameTextStyle: {
        color: '#fff'
      }
    }
  })
  const seriesData = src.series.map((series, idx)=>{
    let data = series.data[activeRegionName];
    if (activeRegionName === '宁波市') {
      data = Object.values(series.data).reduce((prev, curr)=>{
        prev.forEach((v,idx)=>{
          prev[idx] = Number(prev[idx]) +  Number(curr[idx]);
        })
        return prev;
      })
    }
    data = data?.map(v=>round(v, 2))
    const guessedChartType = series.unit.includes('吨') ? 'line' : 'bar';2
    let additionalProps = {
        tooltip: {
          trigger: 'axis',
          valueFormatter: (value) => `${value}${series.unit}`
        },
      }
    switch (guessedChartType) {
      case 'line': {
        additionalProps = {
          ...additionalProps,
          color: chartColors[idx]
        }
        break;
      }
      case 'bar': {
        additionalProps = {
          ...additionalProps,
          barWidth: 22,
          color: new graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 1,
            color: `${chartColors[idx]}40`
          }, {
            offset: 0,
            color: chartColors[idx]
          }]),
        }
        break;
      }
    }
    const yAxisIndex = yAxis.findIndex(e=>e.name === series.unit)
    return {
      name: series.name,
      type: guessedChartType,
      data,
      yAxisIndex,
      ...additionalProps,
    }
  })
initTimer()
  return {
    tooltip: {
      trigger: 'axis',
      confine: true,// 解决tooltip被遮挡
    },
    grid: {
      top: 60,
      left: 65,
      right: 80,
      bottom: 20,
    },
    legend: {
      show: true,
      right: 80,
      textStyle: {
        color: 'white'
      }
    },
    xAxis: {
      type: 'category',
      data: xAxisValues,
      splitLine: {
        show: false
      },
      axisLabel: {
        color: '#FFF',
        interval: 0,
      }
    },
    yAxis,
    series: seriesData,
  }
}

const loadChartData = (echartOption) => {
  if (chartRef.value) {
    if (!chartInstanceRef) {
      chartInstanceRef = init(chartRef.value, echartTheme)
    }
    chartInstanceRef.setOption(echartOption);
  }
}

// 自动滚动
const initTimer = () => {
  if (timeId.value) {
    clearInterval(timeId.value);
  }
  timeId.value = setInterval(() => {
    if (pos.value > 0) {
      chartInstanceRef &&chartInstanceRef.dispatchAction({
        type: "downplay",
        seriesIndex: 0,
        dataIndex: pos.value - 1,
      });
    } else {
      chartInstanceRef &&chartInstanceRef.dispatchAction({
        type: "downplay",
        seriesIndex: 0,
        dataIndex: allData.value.length - 1,
      });
    }
    chartInstanceRef &&chartInstanceRef.dispatchAction({
      type: "highlight",
      seriesIndex: 0,
      dataIndex: pos.value,
    });
    // tooltip 跟随显示
    chartInstanceRef && chartInstanceRef.dispatchAction({
      type: "showTip",
      seriesIndex: 0,
      dataIndex: pos.value,
    });
    pos.value++;

    if (pos.value > allData.value.length - 1) {
      pos.value = 0;
    }
  }, 2000);
};

// onBeforeUnmount(()=>{
//   chartInstanceRef?.dispose();
//   chartInstanceRef = null;
// })
</script>
<style scoped  lang="scss">
  .title{
    display: flex;
    padding-left: 38px;
    align-items: center;
    background: url('https://img.hzanchu.com/acimg/d9f31efaf52972e88cb66dba246c3e96.png') no-repeat;
    background-size: 100% 100%;
    width: 294px;
    height: 30px;
    margin-bottom:22px;
    font-size: 16px;
    font-family: MicrosoftYaHeiSemibold;
    color: #FFFFFF;
    line-height: 22px;
    -webkit-text-stroke: 1px rgba(0,0,0,0);
    text-stroke: 1px rgba(0,0,0,0);
  }
.rac-chart-container {

  box-sizing: border-box;
  $rac-chart-container-width: 320px;
  $rac-chart-container-padding: 20px;
  width: $rac-chart-container-width;
  height: 254px;
  left: calc(50% - $rac-chart-container-width / 2);
  z-index: 10;
  padding-inline: $rac-chart-container-padding;
  .rac-chart-container__title {
    font-size: 24px;
    color: #FFFFFF;
    line-height: 52px;
    text-shadow: 0px 6px 6px #002160;
    text-align: center;
  }
  .rac-chart-container__close-btn {
    color: #CBF7FF;
    font-size: 24px;
    position: absolute;
    right: 24px + 12px;
    top: 50px;
    cursor: pointer;
  }
  .rac-chart {
    width: 320px;
    height: 240px;
  }
}
.rac-chart-elem-enter-active,
.rac-chart-elem-leave-active {
  transition: all 0.5s ease-out;
}
.rac-chart-elem-enter-from, .rac-chart-elem-leave-to {
  opacity: 0;
  transform: translateY(30%);
}
</style>