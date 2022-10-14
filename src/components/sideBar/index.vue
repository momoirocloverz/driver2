<template>
  <div
    class="side-bar"
    :style="{
      backgroundImage: 'url(' + (require('./image/side_bg.png')) + ')',
      width:position != 'ruralBrain'?'346px':'480px',
      height:position != 'ruralBrain'?'850px':'944px'
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
    },
  },
  setup() {
      const ImgList = [
        './image/left_bg.png',
        './image/right_bg.png',
        './image/side_bg.png'
      ]
    const getImgSrc = (val) => {
      let str =  '';
      switch (val) { 
        case 'left':
          str = ImgList[0];
        break;
        case 'right':
          str = ImgList[1];
        break;
        case 'ruralBrain':
          str = ImgList[2];
        break;
      }
      return str
    }
    return {
      getImgSrc,
      ImgList
    }
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
    padding: 20px 24px;
  }
</style>
