<template>
  <div class="bamboo-page">
    <module-title title="产业基地详情" position="right" />
    <!-- <div class="title-box">
      <div class="_title">蔬菜基地总数</div>
      <div class="_num">
        <span>17</span>
        个
      </div>
    </div> -->
    <div class="emphy-box" v-if="!dataList.length">暂无数据</div>
    <div class="value-box" v-for="(item, index) in dataList" :key="index">
      <div class="_title">{{ item.name }}</div>
      <div class="_num">
        <span>{{ item.value }}</span
        >{{ item.unit }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, defineProps, watch } from 'vue'
import moduleTitle from '@/components/moduleTitle'
import { bamboo } from './const'
const props = defineProps({
  selectIndustryData: {
    type: String
  },
  selectVal: {
    type: Array
  }
})
const dataList = ref([])
const getbamlooData = (area, type) => {
  // 对数据进行处理
  const data = bamboo.filter((v) => v.type == type)[0]
  const newArr = []
  data?.bambooData?.forEach((item) => {
    if (item.area == area) newArr.push(item)
  })
  dataList.value = newArr
  console.log(newArr, area, type, data)
}
watch(
  () => props,
  () => {
    console.log(props, 'props')
    const { selectIndustryData, selectVal } = props
    getbamlooData(selectVal.split('/')[selectVal.split('/').length - 1], selectIndustryData)
  },
  { deep: true, immediate: true }
)
</script>
<style scoped lang="scss">
.bamboo-page {
  .emphy-box {
    height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
  }
  ._title {
    font-size: 16px;
    font-family: MicrosoftYaHei-, MicrosoftYaHei;
    font-weight: normal;
    color: #00deff;
  }
  .title-box {
    width: 297px;
    height: 68px;
    background: url('https://img.hzanchu.com/acimg/296a9d8d194655129d528a0f4c6337a7.png') no-repeat;
    background-size: 100% 100%;
    margin-top: 20px;
    margin-bottom: 31px;
    display: flex;
    align-items: center;
    padding: 0 24px;
    box-sizing: border-box;
  }
  ._num {
    margin-left: auto;
    font-size: 12px;
    font-family: MicrosoftYaHei-, MicrosoftYaHei;
    font-weight: normal;
    color: rgba(255, 255, 255, 0.8);
    span {
      font-size: 24px;
      font-family: DIN Alternate-Bold, DIN Alternate;
      font-weight: bold;
      color: #ffffff;
      margin-right: 6px;
    }
  }
  .value-box {
    display: flex;
    margin-top: 34px;
  }
}
</style>
