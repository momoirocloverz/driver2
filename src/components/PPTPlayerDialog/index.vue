<!-- 弹窗组件 -->
<template>
  <div class="pop-up-box" v-show="visible">
    <div class="center">
      <div class="title">{{title}}</div>
      <img class="shutDownImg" @click="shutDown" src="https://img.hzanchu.com/acimg/aba30a5dacaca4cbb2ff1f8605670213.png" />
       <div
        class="dialog_content"
        ref="myRef"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref , defineProps , defineEmits } from "vue";
const emit = defineEmits(['shutCurrent']);
const myRef = ref(null)
const props = defineProps({
  title: {
    type: Object,
  },
  visible: {
    type: Boolean,
    default: false
  },
})

const shutDown = () => { 
  emit("shutCurrent", false)
}

</script>
<style scoped  lang="scss">
.pop-up-box{
  transition: all 0.3s;
  .center {
    width: 1456px;
    z-index: 99999;
    height: 991px;
    background-image: url(https://img.hzanchu.com/acimg/e4df101ec80c868ac306991cf9d171a9.png);
    background-size: 100% 100%;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    box-sizing: border-box;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto !important;
  }
  .title{
    width: 290px;
    height: 50px;
    margin: 0 auto;
    text-align: center;
    font-size: 24px;
    color: #fff;
    line-height: 50px;
    letter-spacing: 2px;
    text-shadow: 0px 6px 6px #002160;
  }
  .shutDownImg {
    position: absolute;
    right: 24px;
    top: 46px;
    cursor: pointer;
  }
  .dialog_content{
    padding-top: 20px;
  }
}
</style>