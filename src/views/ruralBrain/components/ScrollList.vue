<template>
  <Vue3SeamlessScroll
    :class="['scroll-list', props.list.length % 2 === 1 ? 'scroll-list_odd' : 'scroll-list_even', !props.list.length ? 'scroll-list_empty' : '']"
    :list="props.list"
    :hover="true"
    :step="0.3"
    :limitScrollNum="4"
  >
    <slot></slot>
    <div class="empty" v-if="!list.length">暂无数据</div>
  </Vue3SeamlessScroll>
</template>
<script setup>
import { Vue3SeamlessScroll } from 'vue3-seamless-scroll'
import { defineProps } from 'vue'
const props = defineProps({
  list: {
    default: () => [],
    type: Array
  }
})
</script>
<style lang="scss" scoped>
.scroll-list {
  overflow: hidden;
  &.scroll-list_empty {
    display: flex;
    justify-content: center;
    align-items: center;
    .empty {
      color: #fff;
      font-size: 14px;
    }
  }
}
</style>
