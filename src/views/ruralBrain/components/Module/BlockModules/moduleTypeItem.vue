<template>
  <div :class="{ item1: true, ['item1_' + props.position]: true }">
    <img class="bac" src="../../../images/moduleItemBac.png" alt="" />
    <div class="name ellipsis">{{ item.targetName }}</div>
    <div class="value">
      <span class="count">{{ item.cityNum }}</span>
      <span class="unit">{{ item.unit }}</span>
    </div>
  </div>
</template>
<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  item: {
    default: () => {
      return {}
    },
    type: Object
  },
  position: {
    default: 'left', // left right
    type: String
  }
})
</script>
<style lang="scss" scoped>
.item1 {
  height: 86px;
  width: 158px;
  padding-top: 16px;
  position: relative;
  img.bac {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  &.item1_left {
    padding-left: 16px;
  }
  &.item1_right {
    text-align: right;
    padding-right: 16px;
    img.bac {
      transform: rotate(180deg);
    }
  }
  .ellipsis {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .name {
    margin-top: 10px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #ffffff;
    line-height: 19px;
  }
  .value {
    margin-top: 6px;
    height: 28px;
    white-space: nowrap;
  }
  .count {
    font-size: 24px;
    font-family: DINAlternate-Bold, DINAlternate;
    font-weight: bold;
    color: #15dbff;
  }
  .unit {
    margin-left: 4px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #ffffff;
  }
}
</style>
