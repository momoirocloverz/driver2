<template>
  <div class="fenghua-travel-layer">
    <h3 class="vd__section-title">奉化旅游资源</h3>
    <div v-for="(item, index) in fenghuaTravelData.typeData" :key="index">
      <div class="list">
        <div class="left-box">
          {{ item.name }}
        </div>
        <div class="right-box">{{ item.value + ' 全优' }}</div>
      </div>
    </div>
    <div class="module-select__layer-category-selector">
      <el-radio-group v-model="selectedCultureTab" @change="CultureTabChange">
        <template v-for="(item, index) in fenghuaTravelData.cultureData" :key="index">
          <el-radio-button :label="item.name">{{ item.name }}</el-radio-button>
        </template>
      </el-radio-group>
    </div>
    <div class="centent">
      {{ selectedCultureText }}
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { fenghuaTravelData } from '../../rightJsonData.js'
const selectedCultureTab = ref(fenghuaTravelData.cultureData[0].name)
const selectedCultureText = ref(fenghuaTravelData.cultureData[0].value)
const CultureTabChange = (val) => {
  selectedCultureText.value = fenghuaTravelData.cultureData.filter((item) => item.name === val)[0].value
}
</script>
<style lang="scss" scoped>
.fenghua-travel-layer {
  .vd__section-title {
    box-sizing: border-box;
    width: 298px;
    height: 40px;
    padding: 0 0 12px 34px;
    font-size: 22px;
    font-family: PangMenZhengDao;
    font-weight: 400;
    color: #ffffff;
    background: no-repeat center / 100% auto url('~@/views/index/image/block_bg.png');
  }
  .list {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    margin-top: 16px;
    .left-box {
      flex: 1;
      text-align: left;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #00deff;
      position: relative;
    }
    .right-box {
      text-align: right;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #ffffff;
    }
  }
  .module-select__layer-category-selector {
    :deep(.el-radio-group) {
      display: flex;
      // flex-wrap: nowrap;
      width: 100%;
      margin: 23px 0 20px 0px;
      // justify-content: center;
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
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: #ffffff;
        font-weight: normal;
        background: #155e93;
        opacity: 0.5;
        border: 1px solid #159cff;
        margin-bottom: 5px;
        margin-right: 5px;
        // width: 84px;
        height: 29px;

        &.is-active {
          // width: 84px;
          height: 29px;
          background: #00446f;
          box-shadow: inset 0px 0px 6px 0px #29a4ff;
          border: 1px solid #159cff;
          font-size: 16px;
          opacity: 1;
          font-family: MicrosoftYaHei;
          color: #ffffff;
        }
        .el-radio-button__inner {
          font-size: 16px;
          font-family: MicrosoftYaHei;
          color: #ffffff;
        }
      }
    }
  }
  .centent {
    text-indent: 24px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #ffffff;
    line-height: 26px;
  }
}
</style>
