<template>
  <div class="block-module-title">
    <div class="title">{{ props.titleText }}</div>
    <div class="gradientLine"></div>
  </div>
</template>
<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  titleText: {
    default: '',
    type: String
  }
})
</script>
<style lang="scss" scoped>
.block-module-title {
  .title {
    height: 34px;
    line-height: 34px;
    font-size: 22px;
    text-indent: 40px;
    background: url('https://img.hzanchu.com/acimg/bf990d879e16573abace21ba49786216.png') no-repeat;
    background-size: 100% 100%;
    font-weight: 600;
  }
  .gradientLine {
    width: 220px;
    height: 2px;
    background: linear-gradient(90deg, #2978ff 0%, rgba(30, 98, 214, 0) 100%);
    margin-top: 3px;
    margin-left: 24px;
  }
}
</style>
