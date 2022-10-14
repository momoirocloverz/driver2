<template>
  <teleport to=".container">
    <transition name="rac-chart-elem">
      <div class="detail-popper">
        <div class="title">各区指标</div>
        <div class="title">{{ props.titleText }}</div>
        <div class="list">
          <div class="item" v-for="item in props.childCityData" :key="item.name">
            <span calss="name">{{ item.name }}</span>
            <progressBar class="process-bar" :percent="100" />
            <img :src="imgSrc[0]" alt="" />
            <span class="value">{{ item.value + item.unit }}</span>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>
<script setup>
import { ref, defineProps } from 'vue'
import progressBar from '@/components/progressBar'
const props = defineProps({
  titleText: {
    default: '',
    type: String
  },
  childCityData: {
    default: () => [],
    type: Array
  }
})
const imgSrc = ref(['https://img.hzanchu.com/acimg/2669790ae68859ba79bbcd653ffbe552.png', 'https://img.hzanchu.com/acimg/34075d4f171c4cae99a35a8f64090794.png'])
</script>
<style lang="scss" scoped>
.rac-chart-elem-enter-active,
.rac-chart-elem-leave-active {
  transition: all 0.5s ease-out;
}
.rac-chart-elem-enter-from,
.rac-chart-elem-leave-to {
  opacity: 0;
  transform: translateY(30%);
}
.detail-popper {
  position: fixed;
  bottom: 20px;
  left: 50%;
  z-index: 10;
  transform: translateX(-50%);
  width: 728px;
  height: 496px;
  box-sizing: border-box;
  background: no-repeat center / 100% 100% url('../../../images/bottom-chart-bg.svg');
  .title {
    font-size: 24px;
    color: #ffffff;
    line-height: 52px;
    text-shadow: 0px 6px 6px #002160;
    text-align: center;
    width: 100%;
  }
  .list {
    .item {
      display: flex;
      align-items: center;
      height: 20px;
      font-size: 14px;
      font-family: PangMenZhengDao;
      color: #ffffff;
      padding-left: 50px;
      margin-bottom: 11px;
      .process-bar {
        width: 450px;
        margin: 0 10px 0 20px;
      }
      .name {
      }
      img {
        width: 24px;
        height: 24px;
        margin-right: 8px;
        position: relative;
        top: -4px;
      }
      .value {
        color: #27e0fd;
        letter-spacing: 2px;
      }
    }
  }
}
</style>
