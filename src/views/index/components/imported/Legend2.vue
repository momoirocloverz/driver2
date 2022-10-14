<template>
  <div class="legend-show-item">
    <div v-for="(item, index) in list2" :key="index" class="item">
      <div :style="'background-color: ' + item.color"></div>
      <div>{{ item.text }}</div>
    </div>
  </div>
</template>

<script setup>
const list2 = [
  { text: '早', color: '#fed5b5', select: false },
  { text: '中', color: '#fd9548', select: false },
  { text: '晚', color: '#934b10', select: false },
  { text: '中、晚', color: '#d95555', select: false },
  { text: '混种', color: '#a73131', select: false },
];
</script>

<style scoped lang="scss">
.legend-show-item {
  position: relative;
  width: 120px;
  height: 194px;
  padding: 15px 24px;
  box-sizing: border-box;
  font-size: 16px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  .item {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    div:nth-of-type(1) {
      width: 16px;
      height: 16px;
    }
    div:nth-of-type(2) {
      width: 0;
      flex: 1;
      margin-left: 8px;
      margin-right: 8px;
      font-size: 16px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #ffffff;
    }
    img {
      width: 16px;
      height: 16px;
      cursor: pointer;
    }
  }
}
</style>
