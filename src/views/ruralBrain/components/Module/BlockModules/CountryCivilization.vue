<template>
  <!-- 乡风文明 -->
  <div class="country-civilization">
    <div class="item-wrap" v-for="(item, index) in props.list" :key="index" @mouseenter="mouseenter(item)" @mouseleave="mouseleave">
      <div class="item">
        <div class="img-wrap">
          <img class="rotate-img" src="https://img.hzanchu.com/acimg/4452e7d2932434f09af56f439f50f703.png" />
          <img class="nei-img" src="https://img.hzanchu.com/acimg/f2c00453246d2159b600bbf342b5d05c.png" />
        </div>
        <div class="name">{{ item.targetName }}</div>
        <div class="value">
          <span class="count">{{ item.cityNum }}</span>
          <span class="unit">{{ item.unit }}</span>
        </div>
      </div>
    </div>
    <BlockModuleDetailPopper v-if="show" :titleText="activeItem.targetName" :childCityData="activeItem.childCityData" />
  </div>
</template>
<script setup>
import { ref, defineProps } from 'vue'
import BlockModuleDetailPopper from './BlockModuleDetailPopper'
const props = defineProps({
  list: {
    default: () => [],
    type: Array
  },
  isShowPopper: {
    default: false,
    type: Boolean
  }
})
const show = ref(false)
const activeItem = ref({})
const mouseenter = (item) => {
  if (!props.isShowPopper) {
    return
  }
  activeItem.value = item
  show.value = true
}
const mouseleave = () => {
  activeItem.value = {}
  show.value = false
}
</script>
<style lang="scss" scoped>
.country-civilization {
  .item-wrap {
    &:after {
      content: '';
      display: block;
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, rgba(46, 206, 255, 0) 0%, #26ccff 54%, rgba(46, 206, 255, 0) 100%);
    }
    &:last-child {
      &::after {
        height: 0;
      }
    }
    .item {
      display: flex;
      align-items: center;
      padding: 12px 0px;
      .img-wrap {
        position: relative;
        margin-right: 16px;
        @keyframes whirling {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .rotate-img {
          width: 40px;
          height: 40px;
          animation: whirling 4s linear infinite;
        }
        .nei-img {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-11px);
          width: 20px;
          height: 20px;
        }
      }
      .name {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 20px;
        flex: 1;
        overflow: hidden;
        padding-right: 20px;
      }
      .count {
        font-size: 24px;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        color: #15dbff;
        line-height: 28px;
        text-shadow: 0px 2px 6px rgba(5, 27, 86, 0.5);
        margin-right: 4px;
      }
      .unit {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #ffffff;
        line-height: 16px;
      }
    }
  }
}
</style>
