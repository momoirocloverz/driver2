<template>
  <div :class="['rural-brain-module-title']">
    <div class="upperCon">{{ title }}</div>
    <div class="gradientLine"></div>
    <!-- <div class="icon" v-show="type != 'ruralBrain'">
      <slot name="icon">
        <img :src="require('./image/default_icon.png')" class="icon" />
      </slot>
    </div> -->
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
.rural-brain-module-title {
  justify-content: space-between;
  width: 420px;
}
.gradientLine {
  width: 220px;
  height: 2px;
  background: linear-gradient(90deg, #2978ff 0%, rgba(30, 98, 214, 0) 100%);
  margin-top: 3px;
  margin-left: 24px;
}
.upperCon {
  background: url('https://img.hzanchu.com/acimg/bf990d879e16573abace21ba49786216.png') no-repeat;
  background-size: 100% 100%;
  height: 34px;
  width: 100%;
  font-size: 22px;
  text-indent: 46px;
  font-weight: 600;
  line-height: 35px;
  align-items: center;
  font-family: Microsoft YaHei-Semibold, Microsoft YaHei;
  position: relative;
}
.module-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 298px;
  height: 46px;
  line-height: 50px;
  background: url('image/title_bg.png') no-repeat;
  background-size: 100% 100%;
  font-size: 26px;
  text-indent: 46px;
  font-family: PangMenZhengDao;
  position: relative;

  .icon {
    width: 30px;
    height: 30px;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    text-indent: 0;
    line-height: 30px;

    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
