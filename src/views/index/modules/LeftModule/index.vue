<template>
  <HeaderTypes class="mb-30" @onTabChange="onTabChange" />
  <BaseLayer ref="baseLayerRef" class="flex-1" v-show="activeLayerCategoryTab === '基础图层'" @activeModuleChange="activeModuleChange" @valueChange="valueChange" />
  <ThemeLayer
    ref="themeLayerRef"
    class="flex-1"
    v-show="activeLayerCategoryTab === '专题图层'"
    v-bind="$attrs"
    :activeLayerCategoryTab="activeLayerCategoryTab"
    @activeModuleChange="activeModuleChange"
    @valueChange="valueChange"
  />
</template>
<script setup>
import HeaderTypes from './HeaderTypes'
import BaseLayer from './Layer/BaseLayer'
import ThemeLayer from './Layer/ThemeLayer'
import { ref, defineEmits, defineProps, defineExpose, nextTick, watch } from 'vue'
import { cloneDeep } from 'lodash-es'
const props = defineProps({
  mapInit: {
    // 地图是否初始化
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['onTabChange', 'sendMessage'])
const activeLayerCategoryTab = ref('') // 顶部选择的类型 【基础图层、专题图层】
const baseLayerRef = ref(null) // 基础图层实例
const themeLayerRef = ref() // 专题图层
const activeModule = ref('') // 激活的小tab 【资源、产业、农村、农民、精品】
const activeModuleChange = (v) => {
  activeModule.value = v
  nextTick(() => {
    sendMessage()
  })
}
const onTabChange = (v) => {
  activeLayerCategoryTab.value = v
  activeModuleChange(v === '基础图层' ? baseLayerRef.value.activeModule : themeLayerRef.value.activeModule)
  emits('onTabChange', activeLayerCategoryTab.value)
}
const sendMessageValue = ref({})
watch(
  () => {
    return props.mapInit
  },
  () => {
    sendMessage()
  }
)

const dealValue = () => {
  let value = {
    obj: {}
  }
  let baseLayerValue = baseLayerRef?.value?.getSendMessageInfo(activeModule.value) || {}
  let themeLayerValue = themeLayerRef?.value?.getSendMessageInfo() || {}
  if (activeModule.value === '农村') {
    value = baseLayerValue
  } else {
    Object.assign(value.obj, baseLayerValue.obj || {}, themeLayerValue.obj || {})
    value.name = baseLayerValue.name
    // [产业基地点] 的值为基础图层和专题图层的合并项
    value.obj['产业基地点'] = [].concat(baseLayerValue.obj?.产业基地点 || [], themeLayerValue.obj?.产业基地点 || [])
  }
  sendMessageValue.value = value
}
const valueChange = () => {
  nextTick(() => {
    sendMessage()
  })
}
const sendMessage = () => {
  dealValue()
  if (!props.mapInit) return
  let sendValue = cloneDeep(sendMessageValue.value)
  if (activeModule.value === '精品') {
    sendValue = {
      obj: {
        精品线路: cloneDeep(sendMessageValue.value.obj['精品线路'][0])
      }
    }
  }
  nextTick(() => {
    emits('sendMessage', {
      key: 'changeLayerByOption',
      value: {
        option: sendValue
      }
    })
  })
}
defineExpose({
  activeModule
})
</script>
<style lang="scss" scoped>
.mb-30 {
  margin-bottom: 30px;
}
.flex-1 {
  flex: 1;
  overflow: auto;
}
</style>
