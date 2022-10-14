<template>
  <div class="progress-bar">
    <div :class="['progress-bar_inner']" :style="{ width: percent + '%' }"></div>
  </div>
</template>
// :src="dynamicSrc(index)"
<script>
import { defineComponent, ref } from 'vue'
export default defineComponent({
  props: {
    percent: {
      type: Number,
      default: 70
    }
  },
  setup() {
    return {}
  }
})
</script>

<style scoped lang="scss">
.progress-bar {
  height: 10px;
  //   border-radius: 3px;
  //   background-color: rgba(255, 255, 255, 0.1);
  width: 100%;
  position: relative;
}
.progress-bar_inner {
  position: absolute;
  z-index: 2;
  height: 10px;
  width: 50%;
  left: 1px;
  top: 0;
  background: linear-gradient(270deg, #74fff4 0%, rgba(69, 96, 255, 0.27) 100%);
  border-radius: 0 16px 16px 0;
}
</style>
