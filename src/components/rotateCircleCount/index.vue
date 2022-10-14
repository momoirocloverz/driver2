<template>
  <div class="outerRotateCircle">
    <div class="left-box">
      <img class="rotate-img" src="https://img.hzanchu.com/acimg/4452e7d2932434f09af56f439f50f703.png" alt="" />
      <div class="inner">{{ count < 10 ? '0' + count : count }}</div>
      <!-- <img class="inner" src="https://img.hzanchu.com/acimg/7aed040aa383e2a5f5caec24edb8a23b.png" alt="" /> -->
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    count: {
      type: Number,
      default: 0
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
  width: 100%;
  height: 16px;
  text-align: center;
  top: 11px;
  font-family: YouSheBiaoTiHei;
}
.left-box {
  position: relative;
}
.outerRotateCircle {
  width: 38px;
  height: 38px;
}
</style>
