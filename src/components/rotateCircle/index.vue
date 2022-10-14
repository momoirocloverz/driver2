<template>
  <div class="outerRotateCircle">
    <div class="left-box">
      <img class="rotate-img" src="https://img.hzanchu.com/acimg/4452e7d2932434f09af56f439f50f703.png" alt="" />
      <img class="inner" src="https://img.hzanchu.com/acimg/f2c00453246d2159b600bbf342b5d05c.png" alt="" />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    title: {
      type: String,
      default: '标题'
    },
    type: {
      type: String
    }
  },
  setup() {
    return {}
  }
})
</script>

<style scoped lang="scss">
@keyframes whirling {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.rotate-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 38px;
  height: 38px;
  animation: whirling 4s linear infinite; // 图片旋转
}
.inner {
  position: absolute;
  width: 16px;
  height: 16px;
  left: 11px;
  top: 11px;
}
.left-box {
  position: relative;
}
.outerRotateCircle {
  width: 38px;
  height: 38px;
}
</style>
