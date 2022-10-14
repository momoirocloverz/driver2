<template>
  <div class="map-legend">
    <div class="legend" v-for="legend in legends" :key="legend.name" @click="legendChange(legend)">
      <img :src="activeLegend === legend.name ? radioImgs.active : radioImgs.normal" />
      <span class="circel" :style="{ background: legend.color }"></span>
      <span class="name"> {{ legend.name }}{{ '（' + legend.unit + '）' }}</span>
    </div>
  </div>
</template>
<script setup>
import { ref, defineEmits, onMounted } from 'vue'
const emit = defineEmits(['legendChange'])
const legends = [
  {
    name: '农林牧渔业总产值',
    unit: '亿',
    color: '#9EFD6B'
  },
  {
    name: '省级星级农村公厕',
    unit: '座',
    color: '#FF984C'
  },
  {
    name: '创建省级民主法治村数',
    unit: '个',
    color: '#E6A3FF'
  },
  {
    name: '每万常住人口全科医生数',
    unit: '名',
    color: '#51ECFE'
  },
  {
    name: '第六批重点文化保护村',
    unit: '个',
    color: '#FEC561'
  }
]
const activeLegend = ref('农林牧渔业总产值')
const radioImgs = {
  normal: 'https://img.hzanchu.com/acimg/c648bb8778c071d65facbc0a3b98ebad.png',
  active: 'https://img.hzanchu.com/acimg/634f714268ba500435a4d53986deb7d8.png'
}
const legendChange = (one) => {
  activeLegend.value = one.name
  emit('legendChange', activeLegend.value)
}
onMounted(() => {
  emit('legendChange', activeLegend.value)
})
</script>
<style lang="scss" scoped>
.map-legend {
  width: 250px;
  height: 216px;
  background: url('../images/legendBac.png') no-repeat;
  background-size: 100% 100%;
  padding: 24px 0 24px 16px;
  box-sizing: border-box;
  .legend {
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
    img {
      width: 18px;
      height: 18px;
      margin-right: 8px;
    }
    .circel {
      width: 7px;
      height: 7px;
      display: inline-block;
      border-radius: 50%;
      margin-right: 8px;
    }
    .name {
      flex: 1;
      overflow: hidden;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #ffffff;
      line-height: 20px;
      white-space: nowrap;
    }
  }
}
</style>
