<template>
  <div
    class="_title-bar"
    :style="customStyle + (url || router ? ';cursor: pointer;' : '')"
  >
    <img src="@/assets/image/fenghua/rice/titlebar-bg.png" class="_bg">

    <div class="_title">{{ title }}</div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    customStyle: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    }, // 当前配置可跳转url
    router: {
      type: String,
      default: ''
    } // 当前配置可跳转Router，上下两者按上者为准
  }
}
</script>

<style scoped lang="scss">
._title-bar {
  position: relative;
  width: 100%;
  height: 48px;
  margin-left: 23px;
  margin-top: 30px;
  overflow: hidden;

  ._title {
    z-index: 2;
    position: absolute;
    top: 13px;
    left: 50px;
    font-size: 20px;
    font-weight: bold;
    // font-family: Microsoft YaHei;
    color: #fff;
  }
  ._bg {
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    width: 438px;
    height: 48px;
  }
}
</style>
