<template>
  <div
    class="side-bar"
    :style="{
      backgroundImage: 'url(' + require('./image/side_bg.png') + ')',
      width: '482px',
      height: '963px'
    }"
  >
    <slot />
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    position: {
      type: String,
      default: 'left'
    }
  },
  setup() {
    return {}
  }
})
</script>

<style scoped lang="scss">
.side-bar {
  width: 346px;
  height: 850px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: absolute;
  box-sizing: border-box;
  padding-right: 20px;
  padding-top: 19px;
  // padding: 20px 24px;
}
</style>
