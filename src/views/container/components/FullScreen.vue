<template>
  <img class="full-screen-icon" @click="handleOpen" :src="require(modelValue ? '../image/all_in_icon.png' : '../image/all_show_icon.png')" alt="" />
</template>
<script setup>
import { defineProps, defineEmits, nextTick } from 'vue'
const props = defineProps({
  modelValue: {
    default: false,
    type: Boolean
  }
})
const emits = defineEmits(['update:modelValue'])

// 全屏-start
const handleOpen = () => {
  emits('update:modelValue', !props.modelValue)
  nextTick(() => {
    props.modelValue ? open() : close()
  })
}
const open = () => {
  //进入全屏模式
  var docElm = document.getElementsByTagName('body')[0]
  console.log('进入全屏', docElm)
  //W3C
  if (docElm.requestFullscreen) {
    docElm.requestFullscreen()
  }
  //firefox
  else if (docElm.mozRequestFullScreen) {
    docElm.mozRequestFullScreen()
  }
  //Chrome等
  else if (docElm.webkitRequestFullScreen) {
    docElm.webkitRequestFullScreen()
  }
  //IE11
  else if (docElm.msRequestFullscreen) {
    docElm.msRequestFullscreen()
  }
}
const close = () => {
  //退出全屏模式
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  }
}
// 全屏-end
</script>
<style lang="scss" scoped></style>
