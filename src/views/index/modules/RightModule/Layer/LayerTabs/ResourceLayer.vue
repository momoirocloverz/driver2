<template>
  <div class="panel panel-1">
    <module-title title="统计分析" position="right" />
    <statistics :areaList="areaList" :areaListFarm="areaListFarm" :selectVal="selectVal" :selectList="selectList" />
    <non-agricultural :areaList="areaList" :areaListFarm="areaListFarm" :selectVal="selectVal" :cleanList="cleanList" :flhArea="flhArea" />
  </div>
</template>
<script setup>
import moduleTitle from '@/components/moduleTitle'
import statistics from '../../../../modules/statistics.vue'
import nonAgricultural from '../../../../modules/nonAgricultural.vue'
import { ref, reactive, inject, watch, defineProps } from 'vue'
const regionNames = inject('regionNamePath') // 地区切换
const selectVal = ref('宁波市')
let props = defineProps({
  areaList: {
    default: [],
    type: Array
  },
  areaListFarm: {
    default: [],
    type: Array
  },
  selectList: {
    default: [],
    type: Array
  },
  flhArea: {
    default: [],
    type: Array
  },
  cleanList: {
    default: [],
    type: Array
  }
})
watch(
  () => regionNames,
  (val) => {
    console.log('地区一号===》', val)
    selectVal.value = val._value
  },
  { immediate: true }
)
console.log(regionNames, 'regionNames')
</script>
<style lang="scss" scoped>
.panel {
  height: 100%;
  overflow: auto;
  .flowers-nursery-stock-box {
    .title-box {
      width: 297px;
      height: 68px;
      background: url('https://img.hzanchu.com/acimg/296a9d8d194655129d528a0f4c6337a7.png') no-repeat;
      background-size: 100% 100%;
      margin-top: 20px;
      margin-bottom: 31px;
      display: flex;
      align-items: center;
      padding: 0 24px;
      box-sizing: border-box;
      ._num {
        margin-left: auto;
        font-size: 12px;
        font-family: MicrosoftYaHei-, MicrosoftYaHei;
        font-weight: normal;
        color: rgba(255, 255, 255, 0.8);
        span {
          font-size: 24px;
          font-family: DIN Alternate-Bold, DIN Alternate;
          font-weight: bold;
          color: #ffffff;
          margin-right: 6px;
        }
      }
      ._title {
        font-size: 16px;
        font-family: MicrosoftYaHei-, MicrosoftYaHei;
        font-weight: normal;
        color: #00deff;
      }
    }
    .module-select__layer-category-selector {
      :deep(.el-radio-group) {
        display: flex;
        flex-wrap: nowrap;
        width: 100%;
        margin: 23px 0 20px 0px;
        justify-content: center;
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
          margin-bottom: -2px;
          width: 84px;
          height: 29px;
          &.is-active {
            width: 84px;
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
  }
  .empty-holder {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: #fff;
    font-size: 16px;
    img {
      width: 54px;
      height: 54px;
      margin-top: 80px;
      margin-bottom: 24px;
    }
  }

  .list {
    overflow: auto;
    height: 772px;
    padding-top: 24px;
    .vd-img-box {
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 125px;
        height: 125px;
      }
    }
    .line {
      display: flex;
      align-items: flex-start;
      margin-bottom: 20px;
    }
    .name {
      flex-shrink: 0;
      width: 112px;
      white-space: normal;
      word-break: break-all;
      font-size: 16px;
      color: #6cd0ff;
      line-height: 28px;
      -webkit-background-clip: text;
      margin-right: 16px;
    }
    .value {
      color: #fff;
      font-size: 16px;
      line-height: 28px;
      white-space: normal;
      word-break: break-all;
      user-select: text; //增加文本可复制
    }
  }

  .basic-info {
    .text {
      margin: 24px 0;
      font-size: 16px;
      color: #ffffff;
      line-height: 28px;
      -webkit-background-clip: text;
    }
    .board {
      // height: 77px;
      background: url('~@/assets/image/board_bg.png') no-repeat;
      background-size: 100% 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 12px 0 12px 32px;
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }

      .title {
        font-size: 14px;
        font-weight: 400;
        color: #ffffff;
        -webkit-background-clip: text;
        margin-bottom: 4px;
      }
      .number {
        font-size: 26px;
        font-family: DIN Alternate-Bold, DIN Alternate;
        font-weight: bold;
        color: #27e0fd;
        line-height: 38px;
        -webkit-background-clip: text;
        margin-right: 2px;
      }
      .suffix {
        font-size: 12px;
      }
    }
  }
}
</style>
