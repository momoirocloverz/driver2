<template>
  <!-- todo lsq-右侧 -->
  <!-- <div>{{ changeLayerByOptionMessageObj }}</div> -->
  <div class="right-module">
    <BaseLayer v-if="activeLayerCategoryTab === '基础图层'" :allData="props" />
  </div>
</template>
<script setup>
import VillageDetails from '../../components/VillageDetails.vue'
import CollectiveCapital from '../../components/CollectiveCapital.vue'
import BaseLayer from './Layer/BaseLayer.vue'
import { ref, defineProps } from 'vue'
let props = defineProps({
  activeModule: {
    default: '',
    type: String
  },
  activeLayerCategoryTab: {
    // 基础图层、专题图层
    default: '',
    type: String
  },
  changeLayerByOptionMessageObj: {
    default: () => {
      return {}
    },
    type: Object
  },
  initAreaName: {
    // 初始地区数据
    default: '',
    type: String
  },
  content: {
    default: () => {
      return undefined
    },
    type: Object
  }
})
console.log(props, 'props')
</script>
