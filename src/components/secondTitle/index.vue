<template>
  <div :class="type == 'ruralBrain'?'rural-brain-second-title':'second-title'">
    {{ title }}
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'index',
  props: {
    title: {
      type: String,
      default: '标题'
    },
    type: {
      type: String,
    }
  },
  setup() {
    return {}
  }
})
</script>

<style scoped lang="scss">
.rural-brain-second-title {
    position: relative;
    display: inline-block;
    width: 384px;
    height: 35px;
    background: url('https://img.hzanchu.com/acimg/9a4bf2c894fb78e6d36756657fdfbb70.png') no-repeat;
    background-size: 100% 100%;
    border-radius: 0px 0px 0px 0px;
    line-height: 35px;
    font-size: 20px;
    font-family: Microsoft YaHei-Semibold, Microsoft YaHei;
    font-weight: 600;
    color: #FFFFFF;
    box-sizing: border-box;
    padding-left: 36px;
}
  .second-title {
    position: relative;
    display: inline-block;
    height: 30px;
    line-height: 30px;
    //background: url("bg.png") no-repeat;
    background-size: 100% 100%;
    font-size: 22px;
    //font-family: PangMenZhengDao;
    //text-indent: 30px;
    color: #BAFEFF;
    font-weight: 600;
    &:after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, rgba(13, 225, 255, 0) 0%, rgba(13, 225, 255, .5) 53%, rgba(13, 225, 255, 0) 100%);
    }
  }
</style>
