<template>
  <div class="item3">
    {{ item.targetName }}
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
  }
})
</script>
<style lang="scss" scoped>
.item3 {
  margin: 0 4px 12px;
  padding: 8px 20px;
  height: 52px;
  background: url('../../../images/coreIndicatorBac.png') no-repeat;
  background-size: 100% 100%;

  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  line-height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
