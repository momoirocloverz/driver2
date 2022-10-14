<template>
  <div class="module" :style="{ width: props.width }">
    <slot></slot>
  </div>
</template>
<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  width: {
    type: String,
    default: '482px'
  }
})
</script>
<style lang="scss" scoped>
.module {
  height: 100%;
  background: url('../../images/side_bg.png') no-repeat;
  background-size: 100% 100%;
  padding: 20px 20px 0px;
  box-sizing: border-box;
}
</style>
