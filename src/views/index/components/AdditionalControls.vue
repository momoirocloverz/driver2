<template>
  <div class="rac-container">
    <section class="rac-menu" v-if="activeModule === '产业-资源-粮食'">
      <button class="rac-menu-item">
        <img :src="icon1" class="rac-menu-item__icon" alt="icon"/>
        分析
        <div class="rac-menu-item__sub-menu">
          <button class="rac-menu-item" @click="state['产业-资源-粮食'].种植面积与产量分析.visible = !state['产业-资源-粮食'].种植面积与产量分析.visible">
            种植面积与产量分析
            <img :src="orangeArrow" class="rac-menu-item__arrow" alt="arrow"/>
          </button>
          <custom-dialog v-model:visible="state['产业-资源-粮食'].种植面积与产量分析.visible" :width="600" top="5vh" title="种植面积与产量分析">
            <modalContentPart1 />
            <modalContentPart2 />
          </custom-dialog>
        </div>
      </button>
      <button class="rac-menu-item">
        <img :src="icon2" class="rac-menu-item__icon" alt="icon"/>
        图例
        <div class="rac-menu-item__sub-menu">
          <Legend1 />
        </div>
      </button>
      <button class="rac-menu-item">
        <img :src="icon3" class="rac-menu-item__icon" alt="icon"/>
        规划
        <div class="rac-menu-item__sub-menu">
<!--          <el-radio-group class="rac-menu-item__checkbox-group" v-model="state['产业-资源-粮食'].规划.activeMapLayer">-->
<!--            <div class="rac-menu-item__checkbox-item"><el-radio label="水稻发展规划" /></div>-->
<!--            <div class="rac-menu-item__checkbox-item"><el-radio label="小麦发展规划" /></div>-->
<!--          </el-radio-group>-->
          <el-checkbox-group class="rac-menu-item__checkbox-group" v-model="state['产业-资源-粮食'].规划.activeMapLayer">
            <div class="rac-menu-item__checkbox-item">
              <el-checkbox label="水稻发展规划" />
            </div>
            <div class="rac-menu-item__checkbox-item">
              <el-checkbox label="小麦发展规划" />
            </div>
          </el-checkbox-group>
        </div>
      </button>
    </section>
    <!--  ***************************************************  -->
    <section class="rac-menu" v-if="activeModule === '产业-资源-畜牧'">
      <button class="rac-menu-item">
        <img :src="icon3" class="rac-menu-item__icon" alt="icon"/>
        规划
        <div class="rac-menu-item__sub-menu">
          <el-checkbox-group class="rac-menu-item__checkbox-group" v-model="state['产业-资源-畜牧'].规划.activeMapLayer" >
            <div class="rac-menu-item__checkbox-item" v-for="item in options.特色畜牧业布局" :key="item">
              <el-checkbox :label="item" />
            </div>
          </el-checkbox-group>
        </div>
      </button>
    </section>
    <!--  ***************************************************  -->
    <section class="rac-menu" v-if="activeModule === '产业-资源-水产'||(props.activeLayerCategoryTab == '专题图层' && props.selectValueList.includes('产业-资源-水产'))">
      <button class="rac-menu-item">
        <img :src="icon3" class="rac-menu-item__icon" alt="icon"/>
        {{ props.activeLayerCategoryTab == '专题图层'?'水产图例': '水产规划' }}
        <div class="rac-menu-item__sub-menu">
          <button class="rac-menu-item" >
            水产总布局
            <div class="rac-menu-item__sub-menu">
              <el-checkbox-group class="rac-menu-item__checkbox-group" v-model="state['产业-资源-水产'].规划.水产总布局.activeMapLayer" >
                <div class="rac-menu-item__checkbox-item" v-for="item in options.水产总布局" :key="item">
                  <div class="legend-box" :style="{background:item.color}"></div>
                  <div v-if="props.activeLayerCategoryTab == '专题图层'">{{item.name}}</div>
                  <el-checkbox :label="item.name" v-if="props.activeLayerCategoryTab != '专题图层'" />
                </div>
              </el-checkbox-group>
            </div>
          </button>
          <button class="rac-menu-item" >
            特色水产品养殖区域布局
            <div class="rac-menu-item__sub-menu">
              <el-checkbox-group class="rac-menu-item__checkbox-group" v-model="state['产业-资源-水产'].规划.特色水产品养殖区域布局.activeMapLayer" >
                <div class="rac-menu-item__checkbox-item" v-for="item in options.特色水产品养殖区域布局" :key="item">
                  <div class="legend-box" :style="{background:item.color}"></div>
                  <div v-if="props.activeLayerCategoryTab == '专题图层'">{{item.name}}</div>
                  <el-checkbox :label="item.name" v-if="props.activeLayerCategoryTab != '专题图层'" />
                </div>
              </el-checkbox-group>
            </div>
          </button>
        </div>
      </button>
    </section>
    <!--  ***************************************************  -->
    <section class="rac-menu" v-if="activeModule === '产业-资源-蔬菜'||(props.activeLayerCategoryTab == '专题图层' && props.selectValueList.includes('产业-资源-蔬菜'))">
      <button class="rac-menu-item">
        <img :src="icon3" class="rac-menu-item__icon" alt="icon"/>
          {{ props.activeLayerCategoryTab == '专题图层'?'蔬菜图例': '蔬菜规划' }}
        <div class="rac-menu-item__sub-menu">
          <button class="rac-menu-item">
            蔬菜总布局
            <div class="rac-menu-item__sub-menu">
              <el-checkbox-group class="rac-menu-item__checkbox-group" v-model="state['产业-资源-蔬菜'].规划.蔬菜总布局.activeMapLayer" >
                <div class="rac-menu-item__checkbox-item" v-for="item in options.蔬菜总布局" :key="item">
                  <div class="legend-box" :style="{background:item.color}"></div>
                  <div v-if="props.activeLayerCategoryTab == '专题图层'">{{item.name}}</div>
                  <el-checkbox :label="item.name" v-if="props.activeLayerCategoryTab != '专题图层'" />
                </div>
              </el-checkbox-group>
            </div>
          </button>
          <button class="rac-menu-item">
            特色品种区域布局
            <div class="rac-menu-item__sub-menu">
              <el-checkbox-group class="rac-menu-item__checkbox-group" v-model="state['产业-资源-蔬菜'].规划.特色品种区域布局.activeMapLayer" >
                <div class="rac-menu-item__checkbox-item" v-for="item in options.特色品种区域布局" :key="item">
                  <div class="legend-box" :style="{background:item.color}"></div>
                  <div v-if="props.activeLayerCategoryTab == '专题图层'">{{item.name}}</div>
                  <el-checkbox :label="item.name" v-if="props.activeLayerCategoryTab != '专题图层'" />
                </div>
              </el-checkbox-group>
            </div>
          </button>
        </div>
      </button>
    </section>
    <!--  ***************************************************  -->
    <section class="rac-menu" v-if="activeModule === '产业-资源-水蜜桃'">
      <button class="rac-menu-item">
        <img :src="icon2" class="rac-menu-item__icon" alt="icon"/>
        图例
        <div class="rac-menu-item__sub-menu">
          <Legend2 />
        </div>
      </button>
    </section>
    <!--  ***************************************************  -->
    <section class="rac-menu" v-if="activeModule === '产业-资源-食用植物油'">
      <button class="rac-menu-item">
        <img :src="icon3" class="rac-menu-item__icon" alt="icon"/>
        规划
        <div class="rac-menu-item__sub-menu">
          <el-checkbox-group class="rac-menu-item__checkbox-group" v-model="state['产业-资源-食用植物油'].规划.activeMapLayer">
            <div class="rac-menu-item__checkbox-item">
              <el-checkbox label="油菜籽重点乡镇" />
            </div>
            <div class="rac-menu-item__checkbox-item">
              <el-checkbox label="油茶重点乡镇" />
            </div>
          </el-checkbox-group>
        </div>
      </button>
    </section>
    <!--  ***************************************************  -->
    <section class="rac-menu" v-if="activeModule === '产业-资源-粮功区内高标农'">
      <button class="rac-menu-item">
        <img :src="icon1" class="rac-menu-item__icon" alt="icon"/>
        分析
        <div class="rac-menu-item__sub-menu">
          <button class="rac-menu-item" @click="state['产业-资源-粮功区内高标农'].区域分布.visible = true; _temp_onOpenModal('产业-资源-粮功区内高标农::区域分布')">
            区域分布
            <img :src="orangeArrow" class="rac-menu-item__arrow" alt="arrow"/>
          </button>
          <!--  ***************************************************  -->
          <button class="rac-menu-item" @click="state['产业-资源-粮功区内高标农'].三调分析.visible = true; _temp_onOpenModal('产业-资源-粮功区内高标农::三调分析')">
            三调分析
            <img :src="orangeArrow" class="rac-menu-item__arrow" alt="arrow"/>
          </button>
          <!--  ***************************************************  -->
          <button class="rac-menu-item" @click="state['产业-资源-粮功区内高标农'].整治进展.visible = true; _temp_onOpenModal('产业-资源-粮功区内高标农::整治进展')">
            整治进展
            <img :src="orangeArrow" class="rac-menu-item__arrow" alt="arrow"/>
          </button>
        </div>
      </button>
    </section>
    <!--  ***************************************************  -->
    <!--  ***************************************************  -->
    <button class="rac-menu-item" v-if="Object.keys(availableCharts).includes(activeModule)&&props.activeLayerCategoryTab != '专题图层'" @click="showChart = !showChart">目标<img :src="orangeArrow" class="rac-menu-item__arrow" alt="arrow"/></button>
    <transition name="rac-chart-elem">
      <div class="rac-chart-container" v-show="showChart">
        <h3 class="rac-chart-container__title">目标</h3>
        <div class="rac-chart-container__close-btn" @click="showChart = false">x</div>
        <div class="rac-chart-tabs">
          <el-radio-group v-model="activeChart">
            <el-radio-button v-for="item in availableModuleCharts" :key="item.name" :label="item.name" >{{ item.name }}</el-radio-button>
          </el-radio-group>
        </div>
        <div class="rac-chart" ref="chartRef" />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { inject, watch, reactive, ref, computed, defineEmits, onBeforeUnmount, watchEffect } from "vue";
import orangeArrow from '@/assets/image/right-arrow--neon-orange.png';
import CustomDialog from '@/components/customDialog/index.vue'
import modalContentPart1 from '@/views/index/components/imported/left2.vue'
import modalContentPart2 from '@/views/index/components/imported/left3.vue'
import Legend1 from '@/views/index/components/imported/legend.vue' // 粮食
import Legend2 from '@/views/index/components/imported/Legend2.vue' // 水蜜桃
import icon1 from '@/views/index/image/icon_control-1.svg'
import icon2 from '@/views/index/image/icon_control-2.svg'
import icon3 from '@/views/index/image/icon_control-3.svg'
import {init, graphic} from 'echarts';
import echartTheme from '@/assets/js/产业大脑/charts/echart-theme.json';
import { round } from "lodash";

const props = defineProps({
  activeModule: {
    type: String,
  },
  selectValueList: { // 专题图层-生产力布局选中模块
    type: Array,
    default:[]
  },
  activeLayerCategoryTab: {
    type: String
  }
})

const options =  {
  "水稻发展规划": ["水稻发展规划"],
  "小麦发展规划": ["小麦发展规划"],
  "特色畜牧业布局": ["宁海岔路黑猪","宁海县土鸡","象山白鹅","慈溪蜜蜂","余姚蜜蜂","余姚番鸭","江北奶牛","镇海鹌鹑","余姚家禽"],
  "水产总布局": [{ name: "沿岸海洋渔业产业片区", color: '#9FAA45' }, { name: "淡水渔业产业片区" , color: '#73BA74'}],
  "特色水产品养殖区域布局": [{ name: "海淡水虾类", color: '#FFAC1D' }, { name: "海水贝藻类", color: '#CC8A1F' }, { name: "海水蟹类", color: '#FD7E3F' }, { name: "生态鳖" , color: '#DBBB0D'}, { name: "岱衢族大黄鱼", color: '#B29A20' }],
  "蔬菜总布局": [{ name: "蔬菜总布局", color: '#C85C9D' }],
  "特色品种区域布局": [{ name: "加工出口蔬菜（榨菜、花椰菜）", color: '#AD6A63' }, { name: "加工出口蔬菜（雪菜）", color: '#FD7D7D' }, { name: "鲜食大豆（蚕豌豆）", color: '#FF5C5C' }, { name: "马铃薯", color: '#FC4646' }, { name: "山地特色蔬菜（芋艿）", color: '#CC3333' }, { name: "水生蔬菜（茭白）", color: '#C46796' }, { name: "西甜瓜", color: '#FD76BA' }, { name: "食用菌", color: '#FC33A9' }, { name: "草莓" , color:'#CC1176' }],
  "油菜籽重点乡镇": ["油菜籽重点乡镇"],
  "油茶重点乡镇": ["油茶重点乡镇"],
}

// const sendMessage = inject("sendMessage");
// controls
const state = reactive({
  '产业-资源-粮食': {
    种植面积与产量分析: {
      visible: false
    },
    规划: {
      activeMapLayer: [],
    },
  },
  '产业-资源-畜牧': {
    规划: {
      activeMapLayer: [],
    },
  },
  '产业-资源-水产': {
    规划: {
      水产总布局: {
        activeMapLayer: [],
      },
      特色水产品养殖区域布局: {
        activeMapLayer: [],
      }
    },
  },
  '产业-资源-蔬菜': {
    规划: {
      蔬菜总布局: {
        activeMapLayer: [],
      },
      特色品种区域布局: {
        activeMapLayer: [],
      }
    },
  },
  '产业-资源-食用植物油': {
    规划: {
      activeMapLayer: []
    },
  },
  // --------------
  '产业-资源-粮功区内高标农': {
    区域分布: {visible: false},
    三调分析: {visible: false},
    整治进展: {visible: false},
  }
});
const emits = defineEmits(['change', 'openModal']);

const computedResult = computed(()=>{
  let result = [];
  switch (props.activeModule) {
    case '产业-资源-粮食': {
      result = state["产业-资源-粮食"].规划.activeMapLayer;
      break;
    }
    case '产业-资源-畜牧': {
      result = state["产业-资源-畜牧"].规划.activeMapLayer;
      break;
    }
    case '产业-资源-水产': {
      result = [...state["产业-资源-水产"].规划.水产总布局.activeMapLayer, ...state["产业-资源-水产"].规划.特色水产品养殖区域布局.activeMapLayer];
      break;
    }
    case '产业-资源-蔬菜': {
      result = [...state["产业-资源-蔬菜"].规划.蔬菜总布局.activeMapLayer, ...state["产业-资源-蔬菜"].规划.特色品种区域布局.activeMapLayer];
      break;
    }
    case '产业-资源-食用植物油': {
      result = state["产业-资源-食用植物油"].规划.activeMapLayer;
      break;
    }
  }
  return result
})

const _temp_onOpenModal = (key) => {
  emits('openModal', key)
}

watch(computedResult, (v) => {
  emits('change', v)
})
// charts
const regionNames = inject("regionNamePath");
const currentRegionName = computed(()=>{
  const path = regionNames.value.split('/');
  return path[path.length - 1];
})
const chartColors = ['#2DDEE1', '#FFE81E', '#E5A037']
const showChart = ref(false)
const chartRef = ref(null)
let chartInstanceRef = null;
const activeChart = ref(undefined);
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
const availableModuleCharts = computed(()=>{
  return availableCharts[props.activeModule]
})


watchEffect(()=> {
  activeChart.value = availableCharts[props.activeModule]?.[0]?.name;
})
watch([activeChart,currentRegionName], ([chart, regionName])=>{
  const chartConfig = availableCharts[props.activeModule]?.find(e=>e.name === chart);
  chartInstanceRef?.clear();
  if (chartConfig) {
    import(`@/assets/js/产业大脑/charts/${chartConfig.fileName}.json`).then(v=>{
      loadChartData(generateEchartOptions(v.default, regionName));
    }).catch(console.error)
  } else {
    showChart.value = false
  }
})

const generateEchartOptions = (src, activeRegionName = currentRegionName.value) => {
  const xAxisValues = src.xAxis;
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
    const guessedChartType = series.unit.includes('吨') ? 'line' : 'bar';
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
          barWidth: 24,
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

  return {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      top: 60,
      left: 80,
      right: 80,
      bottom: 30,
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

onBeforeUnmount(()=>{
  chartInstanceRef?.dispose();
  chartInstanceRef = null;
})
</script>

<style scoped lang="scss">
.rac-container {
  font-size: 14px;
  font-weight: 400;
  color: #FFFFFF;
  display: flex;
  flex-flow: column;
  row-gap: 8px;
  margin-right: 16px;
  align-items: flex-end;
}
.rac-menu {
  background: #042A8B;
}
.rac-menu-item__sub-menu {
  background: #042A8B;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  right: 100%;
  bottom: 0;
  z-index: 20;
}
.rac-menu-item__checkbox-group {
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  background: #042A8B;
  color: white;
  row-gap: 12px;
  padding: 12px 16px;
  font-size: 14px;
  .rac-menu-item__checkbox-item {
    display: flex;
    align-items: center;
    width: 100%;
    .legend-box{
      margin-right:8px;
      border-radius: 2px;
      width: 16px;
      height: 16px;
    }
    :deep(.el-radio) {
      margin-left: auto;
      display: flex;
      flex-flow: row-reverse;
      width: 100%;
      .el-radio__input {
        margin-left: 8px;
      }
      .el-radio__label {
        color: white;
        flex: 1;
        text-align: left;
        padding: 0;
      }
    }
    :deep(.el-checkbox) {
      margin-left: auto;
      display: flex;
      flex-flow: row-reverse;
      width: 100%;
      .el-checkbox__input {
        margin-left: 8px;
      }
      .el-checkbox__label {
        color: white;
        flex: 1;
        text-align: left;
        padding: 0;
      }
      .el-checkbox__inner {
        border-color: white;
        border-width: 2px;
        &::after {
          border-width: 2px;
          border-color: white;
        }
      }
    }
    .rac-menu-item__checkbox-item-label {
      font-size: 14px;
      line-height: 20px;
      width: max-content;
    }
  }
}
.rac-menu-item {
  position: relative;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: #FFFFFF;
  padding: 8px 12px;
  background: #042A8B;
  display: flex;
  align-items: center;
  column-gap: 8px;
  cursor: pointer;
  width: 100%;
  white-space: nowrap;
  &__arrow {
    height: 20px;
  }
  &:hover,
  &:focus-within {
    background: #064093;
     > .rac-menu-item__sub-menu {
      opacity: 1;
      pointer-events: auto;
    }
  }
  &:hover {
    > .rac-menu-item__sub-menu {
      z-index: 50;
    }
  }
}
// chart css
.rac-chart-container {
  box-sizing: border-box;
  $rac-chart-container-width: 728px;
  $rac-chart-container-padding: 20px;
  position: fixed;
  width: $rac-chart-container-width;
  height: 496px;
  left: calc(50% - $rac-chart-container-width / 2);
  bottom: 20px;
  z-index: 10;
  background: no-repeat center / 100% 100% url('~@/views/index/image/bottom-chart-bg.svg');
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
    width: $rac-chart-container-width - $rac-chart-container-padding * 2;
    height: 340px;
  }
}
.rac-chart-tabs {
  margin-block: 28px 20px;
  :deep(.el-radio-group) {
    column-gap: 32px;
    justify-content: center;
    width: 100%;
    .el-radio-button {
      --el-radio-button-checked-bg-color: #00446F;
      --el-button-bg-color: #0E4571;
      --el-radio-button-checked-text-color: white;
      --el-button-text-color: #9DB3C5;
      --el-color-primary: white;
      .el-radio-button__inner {
        border-color: #0E64A7;
      }
      &.is-active {
        .el-radio-button__inner {
          border-color: #159CFF;
        }
      }
    }
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
