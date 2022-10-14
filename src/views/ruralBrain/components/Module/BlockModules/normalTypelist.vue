<template>
  <el-row class="list-wrap">
    <el-col :span="8" class="item" v-for="(item, index) in props.list" :key="index" @mouseenter="mouseenter(item)" @mouseleave="mouseleave">
      <slot name="item" :row="item"></slot>
    </el-col>
    <BlockModuleDetailPopper v-if="show" :titleText="activeItem.targetName" :childCityData="activeItem.childCityData" />
  </el-row>
</template>
<script setup>
import { ref, defineProps } from 'vue'
import BlockModuleDetailPopper from './BlockModuleDetailPopper'
const props = defineProps({
  list: {
    default: () => [],
    type: Array
  },
  isShowPopper: {
    default: false,
    type: Boolean
  }
})
const show = ref(false)
const activeItem = ref({})
const mouseenter = (item) => {
  if (!props.isShowPopper) {
    return
  }
  activeItem.value = item
  show.value = true
}
const mouseleave = () => {
  activeItem.value = {}
  show.value = false
}
</script>
<style lang="scss" scoped>
.list-wrap {
  width: calc(100% + 36px);
  transform: translateX(-12px);
}
</style>
