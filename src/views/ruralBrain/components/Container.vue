<template>
  <div class="page">
    <slot></slot>
  </div>
</template>
<style lang="scss" scoped>
.page {
  padding: 74px 23px 16px;
  box-sizing: border-box;
  background: url('../images/bac.png') no-repeat;
  background-size: 100% 100%;
  :deep() {
    .left {
      float: left;
    }
    .right {
      float: right;
    }
    .left,
    .right {
      overflow: auto;
      position: relative;
      z-index: 2;
    }
    iframe {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
</style>
