<template>
  <CheckBoxGroup @checkBoxChange="valueChange" class="mlr-20" :list="IOTEquipmentTypes.list" v-model="IOTEquipmentTypes.value" />
</template>
<script setup>
import CheckBoxGroup from './CheckBoxGroup'
import { ref, defineEmits, onMounted, defineExpose } from 'vue'
import { cloneDeep } from 'lodash'
const emits = defineEmits(['valueChange'])
const IOTEquipmentTypes = ref({
  value: [],
  list: [
    {
      name: '基地'
      // color: "#DE5887",
    },
    {
      name: '铁塔'
      // color: "#A8325B",
    }
  ]
})
const valueChange = () => {
  emits('valueChange', getSendMessageInfo())
}
const getSendMessageInfo = () => {
  let obj = {
    物联网设备: cloneDeep(IOTEquipmentTypes.value.value)
  }
  return obj
}
defineExpose({
  getSendMessageInfo
})
</script>
<style lang="scss" scoped>
.mlr-20 {
  margin: 0 20px;
}
</style>
