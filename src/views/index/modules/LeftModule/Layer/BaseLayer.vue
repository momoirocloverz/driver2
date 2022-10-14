<template>
  <!-- 基础图层内容 -->
  <div class="base-layer">
    <div class="all-tab-list">
      <div v-for="(item, index) in baseLayerTabs" :key="index" @click="tabChange(index, item)" :class="{ tab: true, 'selected-tab': tabActive.index === index }">
        {{ item.name }}
      </div>
    </div>
    <!-- 资源 -->
    <Resources ref="resourcesRef" v-show="tabActive.name === '资源'" @valueChange="valueChange" />
    <!-- 产业 -->
    <Industry ref="industryRef" v-show="tabActive.name === '产业'" @valueChange="valueChange" />
    <!-- 农村 -->
    <Countryside ref="countrysideRef" v-show="tabActive.name === '农村'" @valueChange="valueChange('农村')" />
    <!-- 农民 -->
    <Farmer ref="farmer" v-show="tabActive.name === '农民'" />
  </div>
</template>
<script setup>
import Resources from './LayerTabs/Resources'
import Industry from './LayerTabs/Industry'
import Countryside from './LayerTabs/Countryside'
import Farmer from './LayerTabs/Farmer'
import { ref, reactive, computed, defineEmits, onMounted, defineExpose } from 'vue'
import { baseLayerTabs } from '../const'
import { clone, cloneDeep } from 'lodash-es'
import { emit } from 'process'
const emits = defineEmits(['valueChange', 'activeModuleChange'])
const tabActive = ref({
  index: 0,
  name: '资源'
})
const activeModule = computed(() => {
  return tabActive.value.name
})
onMounted(() => {
  // emits('activeModuleChange', tabActive.value.name)
})
const activePeasant = ref(false) // 是否选中农村
const resourcesRef = ref() // 资源实例
const industryRef = ref() // 产业实例
const countrysideRef = ref() // 农村实例
const sendMessageInfo = ref({
  name: '土地非农化',
  obj: {}
})
const sendMessageInfoCounrtySide = ref({
  obj: {}
})
const getSendMessageInfo = (activeModule) => {
  if (tabActive.value.name === '农村' && activeModule === '农村') {
    Object.assign(sendMessageInfoCounrtySide.value.obj, countrysideRef.value.getSendMessageInfo())
    return cloneDeep(sendMessageInfoCounrtySide.value)
  } else {
    Object.assign(sendMessageInfo.value.obj, resourcesRef.value.getSendMessageInfo())
    Object.assign(sendMessageInfo.value.obj, industryRef.value.getSendMessageInfo())
    return cloneDeep(sendMessageInfo.value)
  }
}
const valueChange = (type) => {
  if (type === '农村') {
    emits('valueChange', getSendMessageInfo())
  } else {
    emits('valueChange', getSendMessageInfo())
  }
}

const tabChange = (index, item) => {
  if (index === tabActive.value.index) {
    tabActive.value.index = null
    tabActive.value.name = ''
    emits('activeModuleChange', tabActive.value.name)
    return
  }
  let oldTabActiveName = tabActive.value.name
  tabActive.value.index = index
  tabActive.value.name = item.name
  emits('activeModuleChange', tabActive.value.name)
  // todo lsq-优化待补充的欠缺的
  // if ([0, 1].includes(index)) emit('setTab', index + 1)
  if (tabActive.value.name === '农村') {
    // 选中农村时 主动打开农村模块地图
    activePeasant.value = true
    valueChange('农村')
  } else {
    activePeasant.value = false
    // 如果上一个是【农村】，就需要刷新一下
    if (oldTabActiveName === '农村') {
      valueChange()
    }
  }
}
defineExpose({
  getSendMessageInfo,
  activeModule
})
</script>
<style lang="scss" scoped>
.base-layer {
  .all-tab-list {
    display: flex;
    margin-bottom: 16px;
    .tab {
      width: 74px;
      height: 54px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      font-size: 22px;
      font-family: PangMenZhengDao-3, PangMenZhengDao;
      font-weight: normal;
      color: #5895dd;
      text-shadow: 0px 1px 2px #042767;
      background: url('https://img.hzanchu.com/acimg/7c6a724dc9aa44e9cd0dbb294a591790.png') no-repeat;
      background-size: 100% 100%;
      margin-right: 14px;
      &:last-child {
        margin-right: 0;
      }
      &.selected-tab {
        background: url('https://img.hzanchu.com/acimg/10ee11b6411d277396c7d500f1377670.png') no-repeat;
        background-size: 100% 100%;
        color: #ffffff;
      }
    }
  }
}
</style>
