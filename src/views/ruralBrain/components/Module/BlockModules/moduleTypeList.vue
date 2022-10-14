<template>
  <div>
    <div class="module-type-list">
      <div class="">
        <moduleTypeItem class="item" v-for="item in showList[0]" :item="item" :key="item.targetName" @mouseenter="mouseenter(item)" @mouseleave="mouseleave" />
      </div>
      <img class="center-img" :src="props.src" />
      <div class="">
        <moduleTypeItem position="right" class="item" v-for="item in showList[1]" :item="item" :key="item.targetName" @mouseenter="mouseenter(item)" @mouseleave="mouseleave" />
      </div>
    </div>
    <BlockModuleDetailPopper v-if="show" :titleText="activeItem.targetName" :childCityData="activeItem.childCityData" />
  </div>
</template>
<script setup>
import { ref, computed, defineProps, onMounted, onBeforeMount } from 'vue'
import BlockModuleDetailPopper from './BlockModuleDetailPopper'
import moduleTypeItem from './moduleTypeItem'
const props = defineProps({
  list: {
    default: () => [],
    type: Array
  },
  isShowPopper: {
    default: false,
    type: Boolean
  },
  src: {
    default: ''
  }
})
const startIndex = ref(0)
let time = null
const showList = computed(() => {
  let tableList = []
  if (props.list.length <= 6) {
    tableList = props.list
  } else {
    let newList = [].concat(props.list, props.list)
    tableList = newList.slice(startIndex.value, startIndex.value + 6)
  }
  let sliceIndex = parseInt(tableList.length / 2)
  return [tableList.slice(0, sliceIndex), tableList.slice(sliceIndex)]
})
onMounted(() => {
  time = setInterval(() => {
    startIndex.value++
    if (startIndex.value > props.list.length - 1) {
      startIndex.value = 0
    }
  }, 3000)
})
onBeforeMount(() => {
  clearInterval(time)
})
// 弹出框
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
.module-type-list {
  display: flex;
  align-items: center;
  .center-img {
    width: 106px;
    height: 125px;
  }
}
</style>
