<template>
  <div>
    <div class="module" v-for="item in resourceTypes" :key="item.name">
      <LayerModuleHeader @expandChange="(v) => expandChange(v, item.name)" :imgUrl="item.imgUrl" :title="item.name" :isExpand="expandList.includes(item.name)" />
      <div v-show="expandList.includes(item.name)" class="module-content">
        <LandModule v-if="item.name === '土地'" @valueChange="valueChange" ref="landModuleRef" />
        <IOTEquipment v-if="item.name === '物联网设备'" @valueChange="valueChange" ref="iOTEquipmentRef" />
      </div>
    </div>
  </div>
</template>
<script setup>
import LayerModuleHeader from './Components/LayerModuleHeader'
import LandModule from './Module/LandModule'
import IOTEquipment from './Module/IOTEquipment'
import { ref, defineEmits, defineExpose } from 'vue'
import { cloneDeep } from 'lodash-es'
const emits = defineEmits(['valueChange'])
const resourceTypes = ref([
  {
    name: '土地',
    imgUrl: 'https://img.hzanchu.com/acimg/bb4db9ea32c5f4a51613f10dff488618.png'
  },
  {
    name: '物联网设备',
    imgUrl: 'https://img.hzanchu.com/acimg/7173dac75488eebc40f27270cbd155e1.png'
  }
])
const expandList = ref(['土地'])
const expandChange = (v, type) => {
  if (v) {
    expandList.value.push(type)
  } else {
    let index = expandList.value.indexOf(type)
    expandList.value.splice(index, 1)
  }
}
// 获取所选数据
const sendMessageInfo = ref({})
const landModuleRef = ref() // 土地实例
const iOTEquipmentRef = ref() // 物联网设备实例
const valueChange = (v) => {
  sendMessageInfo.value = Object.assign(sendMessageInfo.value, v)
  emits('valueChange', cloneDeep(sendMessageInfo.value))
}
const getSendMessageInfo = () => {
  let obj = Object.assign({}, landModuleRef?.value[0]?.getSendMessageInfo(), iOTEquipmentRef?.value[0]?.getSendMessageInfo())
  return obj
}
defineExpose({
  getSendMessageInfo
})
</script>
<style lang="scss" scoped>
.module {
}
</style>
