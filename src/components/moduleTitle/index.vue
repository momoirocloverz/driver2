<template>
  <div :class="type == 'ruralBrain'?'rural-brain-module-title':'module-title'">
    {{ title }}
    <div class="icon" v-show="type != 'ruralBrain'">
      <slot name="icon">
        <img :src="require('./image/default_icon.png')" class="icon">
      </slot>
    </div>
    <img
      v-show="isPackUp"
      class="arrow"
      @click="onThreeArrowChange()"
      :style="{
      transform: 'rotate(' + (showThreeChilds ? -180 : 0) + 'deg)',
    }"
      :src="require('./image/arrow_icon_down.png')"
      alt=""
    />
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
      type: String,
    },
    isPackUp : {
      type: Boolean,
      default: false
    },
    showThreeChild: {
      type:Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const showThreeChilds = ref(props.showThreeChild)
    const onThreeArrowChange = () => {
      showThreeChilds.value = !props.showThreeChild;
      emit('sendPankUpMessage', {
        key: props.title,
        value: { type: !props.showThreeChild }
      })
    }
    return {
      onThreeArrowChange,
      showThreeChilds
    }
  }
})
</script>

<style scoped lang="scss">
.rural-brain-module-title{
  background: url("https://img.hzanchu.com/acimg/bf990d879e16573abace21ba49786216.png") no-repeat ;
  background-size: 100% 100% ;
  height: 34px ;
  justify-content: space-between;
  line-height: 35px;
  align-items: center;
  width: 420px;
  font-size: 22px;
  text-indent: 46px;
  font-weight: 600;
  font-family: Microsoft YaHei-Semibold, Microsoft YaHei;
  position: relative;
}
.arrow {
  position: absolute;
  top: 12px;
  right: 0;
  cursor: pointer;
  width: 16px;
  height: 16px;
  transition: all 0.3s;
}
  .module-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 298px;
    height: 46px;
    line-height: 50px;
    background: url("image/title_bg.png") no-repeat;
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
