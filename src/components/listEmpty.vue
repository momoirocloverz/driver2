<template>
  <div class="_list-empty flex-ajc" :style="customStyle">
    <img :src="icon" class="_empty-icon">
    <div class="_empty-title">{{ title }}</div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '暂无数据'
    },
    icon: {
      type: String,
      default:
        'https://img.hzanchu.com/acimg/7ca7c3d2f5367f2e7789bfc20ee4a8e8.png'
    },
    customStyle: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="scss">
.flex-ajc {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
._list-empty {
  width: 100%;
  height: 300px;
  padding: 10px 30px;
  box-sizing: border-box;
  overflow: hidden;

  ._empty-icon {
    width: 260px;
    height: 280px;
  }

  ._empty-title {
    margin-top: -20px;
    font-size: 26px;
    color: #bbd7fa;
  }
}
</style>
