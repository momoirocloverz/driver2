<template>
  <div v-for="(item, index) in rangeList" :key="index" class="range-list">
    <div class="sub" @click="rangeSubShow(index)">
      <div
        class="block"
        :style="'background-color: ' + item.color"
      />
      <div
        class="text"
        :style="item.has ? 'color: #fff' : 'color: #34C1FF'"
      >
        {{ item.text }}
      </div>
    </div>
    <div v-show="item.show" class="sub-item">
      <div
        v-for="(item1, index1) in item.children"
        :key="index1"
        :class="item1.select ? 'sub-item-select' : 'sub-item-unselect'"
      >
        {{ item1.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";

const rangeList = reactive([
  {
    text: '油菜',
    select: true,
    has: true, // 表示是否选中过相关品种，只要选中过1个就算
    show: false,
    color: '#F59766',
    children: [
      { text: '油菜', select: true },
      { text: '油菜浙油51', select: true },
      { text: '油菜浙油64', select: true },
      { text: '油菜秦油二号', select: true }
    ]
  },
  {
    text: '早稻',
    select: true,
    has: true, // 表示是否选中过相关品种，只要选中过1个就算
    show: false,
    color: '#82F694',
    children: [
      { text: '甬仙15', select: true },
      { text: '甬仙16', select: true },
      { text: '甬籼15', select: true },
      { text: '甬籼69', select: true },
      { text: '矮优73', select: true }
    ]
  },
  {
    text: '小麦',
    select: true,
    has: true, // 表示是否选中过相关品种，只要选中过1个就算
    show: false,
    color: '#FFF399',
    children: [
      { text: '制种', select: true },
      { text: '扬麦12', select: true },
      { text: '扬麦20', select: true },
      { text: '扬麦28', select: true },
      { text: '金丰2号', select: true },
      { text: '金永2号', select: true }
    ]
  },
  {
    text: '晚稻',
    select: true,
    has: true, // 表示是否选中过相关品种，只要选中过1个就算
    show: false,
    color: '#E498FF',
    children: [
      { text: '中浙优1号', select: true },
      { text: '中浙优8号', select: true },
      { text: '制种', select: true },
      { text: '华浙优261', select: true },
      { text: '南梗9018', select: true },
      { text: '嘉丰优2号', select: true },
      { text: '宁81', select: true },
      { text: '宁84', select: true },
      { text: '宁88', select: true },
      { text: '岳林1号', select: true },
      { text: '旱稻', select: true },
      { text: '杂交制种', select: true },
      { text: '杂交稻制种', select: true },
      { text: '浙优1253', select: true },
      { text: '浙优18', select: true },
      { text: '甬优088号', select: true },
      { text: '甬优12', select: true },
      { text: '甬优15', select: true },
      { text: '甬优1538', select: true },
      { text: '甬优1540', select: true },
      { text: '甬优17', select: true },
      { text: '甬优1840号', select: true },
      { text: '甬优538', select: true },
      { text: '甬优7850', select: true },
      { text: '甬优7860', select: true },
      { text: '甬优8', select: true },
      { text: '甬优9号', select: true },
      { text: '矮优73', select: true },
      { text: '粳稻', select: true },
      { text: '香粳', select: true }
    ]
  }
]) // 当前种植分布种类

// 点击展示range-list sub子模块
const rangeSubShow = (pos) => {
  rangeList[pos].show = !rangeList[pos].show
}
</script>

<style scoped lang="scss">

.range-list {
  width: 866px;
  .sub {
    width: 100%;
    height: 38px;
    background-color: #143d89;

    display: flex;
    flex-direction: row;
    align-items: center;
    .block {
      width: 16px;
      height: 16px;
      margin-left: 8px;
      margin-right: 8px;
      cursor: pointer;
    }
    .text {
      font-size: 20px;
      color: #ffffff;
      cursor: pointer;
    }
    img:nth-of-type(1) {
      width: 15px;
      height: 8px;
      margin-left: 38px;
      cursor: pointer;
    }
    img:nth-of-type(2) {
      width: 16px;
      height: 16px;
      margin-left: 16px;
      cursor: pointer;
    }
  }
  .sub-item {
    width: 100%;
    padding: 0 0px 13px 85px;
    box-sizing: border-box;
    background-color: #092c6f;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .sub-item-select {
      margin-top: 12px;
      margin-right: 24px;
      font-size: 16px;
      color: #ffffff;
      display: flex;
      flex-direction: row;
      align-items: center;
      img {
        width: 16px;
        height: 16px;
        margin-left: 9px;
        cursor: pointer;
      }
    }

    .sub-item-unselect {
      margin-top: 12px;
      margin-right: 24px;
      font-size: 16px;
      color: #63b0ea;
      display: flex;
      flex-direction: row;
      align-items: center;
      img {
        width: 16px;
        height: 16px;
        margin-left: 9px;
        cursor: pointer;
      }
    }
  }
}
</style>
