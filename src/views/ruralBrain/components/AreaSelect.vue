<template>
  <div class="area-select">
    <el-cascader
      :append-to-body="false"
      v-model="selectCode"
      :options="areaOptions"
      :props="{ expandTrigger: 'hover', label: 'name', value: 'name', checkStrictly: true }"
      @change="onAreaChange"
      @visible-change="onStatusChange"
      ref="cascaderHandleRef"
    >
      <template #default="{ data }">
        <span>{{ data.name }}</span>
      </template>
    </el-cascader>
    <img class="select-btn" :style="{ transform: 'rotate(' + (selectStatus ? -180 : 0) + 'deg)' }" :src="require('../images/arrow_icon.png')" alt="" />
    <img class="back" @click="backLevel" v-if="backShow" src="https://img.hzanchu.com/acimg/65be1bba8bde8166b8ab188c3e89c0ba.png" />
  </div>
</template>
<script setup>
import areaJson from '@/assets/js/area.json'
import { ref, computed, onMounted, defineEmits, defineExpose } from 'vue'
import { cloneDeep } from 'lodash'
import { useRoute } from 'vue-router'
const Route = useRoute()
const emit = defineEmits('areaChange')
const COUNTY = Route.query.COUNTY
const selectCode = ref('宁波市')
const backShow = computed(() => {
  if (typeof selectCode.value === 'string') {
    return selectCode.value !== '宁波市'
  } else {
    return selectCode.value.length !== 1
  }
})
onMounted(() => {
  if (COUNTY) {
    selectCode.value = ['宁波市', COUNTY]
  }
})
// 变化
const areaOptions = computed(() => {
  return [areaJson.city]
})
const onAreaChange = (v) => {
  handleCloseCasader()
  emit('areaChange', selectCode.value)
}
// 返回上一级
const backLevel = () => {
  let selectCodeCopy = cloneDeep(selectCode.value)
  selectCodeCopy.splice(selectCodeCopy.length - 1, 1)
  selectCode.value = selectCodeCopy
  emit('areaChange', selectCode.value)
}
// 展开收起
const selectStatus = ref(false)
const onStatusChange = (v) => {
  selectStatus.value = v
}
//关闭层级选择框
const cascaderHandleRef = ref()
const handleCloseCasader = () => {
  if (cascaderHandleRef?.value?.popperVisible) {
    cascaderHandleRef?.value?.togglePopperVisible()
  }
}
// 外界改变值
const setSelectCode = (v) => {
  selectCode.value = v
}
defineExpose({ setSelectCode })
</script>
<style lang="scss" scoped>
.area-select {
  position: relative;
  img.back {
    width: 90px;
    height: 68px;
    display: block;
    margin-top: 24px;
    cursor: pointer;
  }
  img.select-btn {
    position: absolute;
    right: 16px;
    top: 10px;
    transition: all 0.3s;
    width: 24px;
    height: 12px;
  }
  :deep() {
    .el-cascader {
      width: 270px;
      .el-input__wrapper {
        box-shadow: none;
        background: rgba(0, 77, 168, 0.3);
        border-radius: 4px;
        border: 1px solid #2ca2fc;
        input {
          font-size: 16px;
          font-family: PangMenZhengDao-3, PangMenZhengDao;
          color: #fff;
        }
        .el-input__suffix-inner {
          display: none;
        }
      }
    }
  }
}
</style>
