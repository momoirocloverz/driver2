<template>
  <div class="title">
    <span>{{ props.text }}</span>
    <slot />
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps({
  text: {
    type: String,
    default: ''
  }
})
</script>

<style scoped lang="scss">
  .title {
    width: 611px;
    height: 40px;
    display: flex;
    align-items: center;
    background: url('../images/组9032备份5@2x.png') no-repeat;
    background-size: 100%;
    span {
      margin-left: 44px;
      font-size: 22px;
    }
  }
</style>