<template>
  <div>
    <div class="circel-type-list">
      <div class="left-circel title" v-html="titleText"></div>
      <img class="left-pointer" src="../../../images/type1Pointer.png" />
      <div class="list">
        <div class="item" v-for="item in showList" :key="item.targetName" @mouseenter="mouseenter(item)" @mouseleave="mouseleave">
          <div class="name ellipsis">{{ item.targetName }}</div>
          <div class="value">
            <span class="count">{{ item.cityNum }}</span>
            <span class="unit">{{ item.unit }}</span>
          </div>
        </div>
      </div>
    </div>
    <BlockModuleDetailPopper v-if="show" :titleText="activeItem.targetName" :childCityData="activeItem.childCityData" />
  </div>
</template>
<script setup>
import { ref, computed, defineProps, onMounted, onBeforeMount } from 'vue'
import BlockModuleDetailPopper from './BlockModuleDetailPopper'
const props = defineProps({
  list: {
    default: () => [],
    type: Array
  },
  isShowPopper: {
    default: false,
    type: Boolean
  },
  titleText: {
    default: '',
    type: String
  }
})
const startIndex = ref(0)
let time = null
const showList = computed(() => {
  if (props.list.length <= 4) {
    return props.list
  } else {
    let newList = [].concat(props.list, props.list)
    return newList.slice(startIndex.value, startIndex.value + 4)
  }
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
.circel-type-list {
  display: flex;
  align-items: center;
  .left-circel {
    width: 160px;
    height: 155px;
    background: url('../../../images/type1Circel.png') no-repeat;
    background-size: 100% 1005;
    display: flex;
    align-items: center;
    justify-content: center;
    &.title {
      font-size: 22px;
      font-family: PangMenZhengDao-3, PangMenZhengDao;
      font-weight: normal;
      color: #ffffff;
    }
  }
  .left-pointer {
    width: 79px;
    height: 212px;
  }
  .list {
    flex: 1;
    overflow: hidden;
    margin-left: -20px;
    .scroll-list {
      height: 212px;
    }
    .item {
      background: url('../../../images/type1ItemBac.png') no-repeat;
      background-size: 100% 100%;
      height: 44px;
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      padding-left: 20px;
      &:last-child {
        margin-bottom: 0;
      }
      .name {
        flex: 1;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #ffffff;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-right: 4px;
      }
      .count {
        font-size: 24px;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        color: #15dbff;
      }
      .unit {
        font-size: 12px;
        margin-left: 4px;
      }
    }
  }
}
</style>
