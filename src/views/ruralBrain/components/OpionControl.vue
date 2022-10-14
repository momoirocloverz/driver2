<template>
  <div :class="{ 'opion-control': true, ['opion-control_' + props.position]: true }">
    <div class="manyCirclesCon">
      <div :class="{ manyCircle: true, ['manyCircle' + index]: true }" v-for="(item, index) in types" :key="item.name" :style="{ width: item.size, height: item.size }">
        <img src="https://img.hzanchu.com/acimg/61bf6acf05b6482370db8c0d56ed261f.png" alt="" />
        <div class="name-value">
          <div class="name">{{ item.name }}</div>
          <div class="value">{{ item.value }}</div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="guide-line-wrap">
        <div class="content-title">
          <div class="gradientCon">
            <div class="gradient gradient1"></div>
            <div class="gradient gradient2"></div>
          </div>
          <div class="rural-brain-second-text">近30天事件聚焦</div>
        </div>
      </div>
      <div class="list-wrap">
        <div class="list-item-wrap guide-line-wrap" v-for="(item, index) in spotList" :key="item.title">
          <div class="list-item">
            <div class="left-info">
              <img src="https://img.hzanchu.com/acimg/4452e7d2932434f09af56f439f50f703.png" />
              <span class="index">{{ index + 1 < 10 ? '0' + (index + 1) : index + 1 }}</span>
            </div>
            <div class="item-info">
              <div class="title">{{ item.title }}</div>
              <div class="time">{{ item.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  position: {
    default: 'horizontal', // 横向horizontal 纵向 vertical
    type: String
  }
})
const types = [
  { name: '流域地灾', value: '45', size: '69px' },
  { name: '防洪度汛', value: '45', size: '69px' },
  { name: '安全生产', value: '34', size: '63px' },
  { name: '群体事件', value: '65', size: '93px' },
  { name: '移民环保', value: '32', size: '87px' }
]
const spotList = [
  { title: '国家大渡河公司第一批主题教育融入中心求实', time: '2022/12/13' },
  { title: '国家大渡河公司第二批主题教育融入中心求实', time: '2022/12/13' }
]
</script>
<style lang="scss" scoped>
.opion-control {
  height: 100%;
  @keyframes whirling {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .guide-line-wrap {
    &:after {
      content: '';
      margin-top: -1px;
      display: block;
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, rgba(46, 206, 255, 0) 0%, #26ccff 54%, rgba(46, 206, 255, 0) 100%);
    }
  }
  .manyCirclesCon {
    position: relative;
    height: 134px;
    width: 360px;
    overflow: hidden;
    .manyCircle {
      font-size: 14px;
      font-family: PangMenZhengDao-3, PangMenZhengDao;
      position: absolute;
      img {
        height: 100%;
        width: 100%;
        animation: whirling 4s linear infinite;
      }
      .name-value {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-12px);
        text-align: center;
        .name {
          color: #ffffff;
          white-space: nowrap;
        }
        .value {
          margin-top: 4px;
          color: #ffd962;
        }
      }
      &.manyCircle0 {
        top: 47px;
        left: 0;
      }
      &.manyCircle1 {
        top: 0px;
        left: 73px;
      }
      &.manyCircle2 {
        top: 65px;
        left: 110px;
      }

      &.manyCircle3 {
        top: 0px;
        left: 174px;
      }
      &.manyCircle4 {
        top: 43px;
        left: 270px;
      }
    }
  }
  .content {
    .content-title {
      height: 35px;
      background: url('https://img.hzanchu.com/acimg/9a4bf2c894fb78e6d36756657fdfbb70.png') no-repeat;
      background-size: 100% 100%;
      line-height: 35px;
      font-size: 20px;
      font-family: Microsoft YaHei-Semibold, Microsoft YaHei;
      font-weight: 600;
      color: #ffffff;
      padding-left: 20px;
      display: flex;
      align-items: center;

      .gradientCon {
        width: 18px;
        height: 12px;
        position: relative;
        margin-right: 10px;
        .gradient {
          width: 14px;
          height: 12px;
          border-radius: 7px;
          position: absolute;
          &.gradient1 {
            background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, #00aff3 100%);
            opacity: 0.4;
            left: 0;
          }
          &.gradient2 {
            background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, #00aff3 100%);
            right: 0;
          }
        }
      }
    }
    .list-wrap {
      margin-top: 8px;
      .list-item-wrap {
        &:last-child {
          &:after {
            height: 0;
          }
        }
      }
      .list-item {
        display: flex;
        padding: 10px 0;
        .left-info {
          position: relative;
          margin-right: 12px;
          img {
            width: 38px;
            height: 38px;
            animation: whirling 4s linear infinite;
          }
          .index {
            font-size: 16px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-11px);
          }
        }
        .item-info {
          font-size: 14px;
          color: #ffffff;
          line-height: 20px;
          .title {
            font-size: 16px;
            font-family: PangMenZhengDao-3, PangMenZhengDao;
            margin-bottom: 5px;
          }
        }
      }
    }
  }
  &.opion-control_horizontal {
    display: flex;
    .content {
      margin-left: 63px;
      flex: 1;
      overflow: hidden;
    }
  }
  &.opion-control_vertical {
    .manyCirclesCon {
      margin: 0 auto;
    }
  }
}
</style>
