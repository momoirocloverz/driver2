<template>
<div class="target-all-box">
<template v-for="(item,index) in selectedList" :key="index">
  <targetChart :selectedObj="item"  />
</template>
</div>
</template>
<script setup>
import { inject, watch, ref,defineProps, computed } from "vue";
import targetChart from '../modal/targetChart.vue'
const props = defineProps({
  activeModule: {
    type: Array,
  },
  activeLayerCategoryTab: {
    type:String
  }
})
// chartConfig
// charts
const regionNames = inject("regionNamePath");// 地区切换
const selectedList = ref([]);
const currentRegionName = computed(()=>{
  const path = regionNames.value.split('/');
  return path[path.length - 1];
})
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
watch(() => [currentRegionName, props.activeModule], () => {
  const arr = [];
  Array.isArray(props.activeModule)&& props.activeModule.forEach(item => {
    availableCharts[item].forEach(items => { 
      arr.push(items)
    })
  })
  console.log(arr,'arr')
  selectedList.value = arr;
})
</script>
<style scoped  lang="scss">
.target-all-box{
padding-top: 23px;
}
</style>