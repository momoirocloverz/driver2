<template>
  <div class="header-types">
    <el-radio-group v-model="activeLayerCategoryTab" @change="tabChange">
      <el-radio-button v-for="radio in headerTypes" :key="radio.value" :label="radio.value"> {{ radio.label }} </el-radio-button>
    </el-radio-group>
  </div>
</template>
<script setup>
import { headerTypes } from './const'
import { ref, defineEmits, onMounted } from 'vue'
const emit = defineEmits(['onTabChange'])
const activeLayerCategoryTab = ref('基础图层') // 顶部选择的类型
onMounted(() => {
  emit('onTabChange', activeLayerCategoryTab.value)
})
const tabChange = () => {
  emit('onTabChange', activeLayerCategoryTab.value)
}
</script>
<style lang="scss" scoped>
.header-types {
  :deep(.el-radio-group) {
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    // border-image: url('https://img.hzanchu.com/acimg/fdfeca6e76bcaff7ea93bc8504ce0e2b.png') 100%;
    // border-bottom: 2px solid;
    .el-radio-button {
      --el-radio-button-checked-bg-color: transparent;
      --el-radio-button-checked-text-color: transparent;
      --el-radio-button-checked-border-color: transparent;
      --el-radio-button-disabled-checked-fill: transparent;
      --el-button-bg-color: transparent;
      --el-border: none;
      --el-button-text-color: transparent;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      font-family: PangMenZhengDao-3, PangMenZhengDao;
      font-weight: normal;
      color: #c4d9f1;
      margin-bottom: -2px;
      background: url('https://img.hzanchu.com/acimg/fdfeca6e76bcaff7ea93bc8504ce0e2b.png') no-repeat;
      background-size: 100% 100%;
      // background: no-repeat center / auto 100% url('https://img.hzanchu.com/acimg/fdfeca6e76bcaff7ea93bc8504ce0e2b.png');
      width: 147px;
      height: 36px;
      &.is-active {
        font-size: 24px;
        font-family: PangMenZhengDao-3, PangMenZhengDao;
        font-weight: normal;
        color: #ffffff;
        text-shadow: 0px 1px 2px #042767;
        background: no-repeat center / auto 100% url('https://img.hzanchu.com/acimg/b6bdb5a715450ec322c9facc035ebc20.png');
      }
      .el-radio-button__inner {
        font-size: 24px;
        font-family: PangMenZhengDao;
        font-weight: 400;
        color: #ffffff;
        line-height: 34px;
      }
    }
  }
}
</style>
