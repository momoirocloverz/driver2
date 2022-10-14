<template>
  <div class="progress-bar">
    <div :class="[percent==100?'progress-bar_inner':'progress-bad-bar_inner']" :style="{ width: percent + '%' }"></div>
  </div>
</template>
// :src="dynamicSrc(index)"
<script>
import { defineComponent, ref } from 'vue'
export default defineComponent({
  props: {
    title: {
      type: String,
      default: '标题'
    },
    percent: {
      type: Number,
      default: 100
    },
  },
  setup() {
    return {}
  }
})
</script>

<style scoped lang="scss">
.progress-bar {
  height: 7px;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.1);
  width: 90%;
  position: relative;
  margin-top: 11px;
}
.progress-bar_inner {
  position: absolute;
  z-index: 2;
  height: 8px;
  width: 50%;
  left: 1px;
  top: 0;
  height: 6px;
  background: linear-gradient(270deg, #74fff4 0%, #4560ff 100%);
  border-radius: 3px;
}
.progress-bad-bar_inner {
  position: absolute;
  z-index: 2;
  height: 8px;
  width: 50%;
  left: 1px;
  top: 0;
  height: 6px;
  background: linear-gradient(270deg, rgba(255, 72, 72, 1) 0%, rgba(255, 213, 69, 1) 100%);
  border-radius: 3px;
}
</style>
