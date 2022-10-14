<template>
  <div class="rice-page">
  <module-title title="粮食稳产保供" position="right" />
  <div class="fuaranteed-all-box">
    <div class="fuaranteed-value-box" :style="{ marginRight: [1, 3].includes(index) ? '0px' : '12px' }" v-for="(item,index) in GuaranteedList" :key="index">
        <div class="_num">
          <div class="_title">{{ item.title }}</div>
          <div class="_main">
            <span class="_value">{{ (isFenghua && item.title == '粮食总产量')? item.num :  Number(item.num).toFixed(2) }}</span>
            <span class="_unit">{{ item.unit }}</span>
          </div>
        </div>
    </div>
  </div>
  <module-title title="种植产能" position="right" />
   <select-c :list="selectList" @reload="reload" />
    <right-2-item
      title="晚稻亩产"
      :value="total.value1"
      unit="万亩"
    />
   <div class="flex-row">
      <right-2-item
        title="种植大户亩产"
        :value="total.value2"
        unit="斤/亩"
      />
      <right-2-item title="种植散户亩产" :value="total.value3" unit="斤/亩" />
    </div>

    <list v-if="echartsList.length > 0 && isLoad" ref="listRef" :data="echartsList" />
    <list-empty v-else custom-style="height: 300px;" />
  </div>
</template>
<script setup>
import { onMounted , ref , defineProps, watch } from 'vue'
import moduleTitle from '@/components/moduleTitle'
import { hxzb , zzmc , cl } from '@/assets/js/data.js'
import SelectC from './modal/select.vue'
import Right2Item from './modal/right2Item.vue'
import List from './modal/list.vue'
import ListEmpty from '@/components/listEmpty.vue'
const props = defineProps({
  selectVal: {
    type:String
  }
})
const isFenghua = ref(true)
const curType = ref('晚稻');
const isLoad = ref(false);
const listRef = ref(null);
const selectList = ref([
  { text: '晚稻', select: true },
  { text: '早稻', select: false },
  { text: '小麦', select: false },
  { text: '油菜', select: false }
])
const echartsList = ref([])
const total = ref({
  value1: '0',
  value2: '0',
  value3: '0'
})
const curArea = ref('奉化区')
const GuaranteedList = ref([
  { title: '耕地面积', num: 0, unit: '万亩', decimals: 2 },
  { title: '粮食种植面积', num: 0, unit: '万亩', decimals: 2 },
  {
    title: '复种指数',
    num: 0,
    unit: '',
    decimals: 2
  },
  { title: '粮食总产量', num: 0, unit: '万公斤', decimals: 0 }
])
const reload = (item) => {
  curType.value = item.text
  init(curArea.value)
}
const init = (selectAddress) => { 
  isLoad.value = false
  const list = []
  for (const item of zzmc) {
    if (item.address == (selectAddress || curArea.value) && item.type == curType.value) {
      if (item.user_type == '行政区划总计') {
        total.value.value1 = parseFloat(item.average).toFixed(2)
      } else if (item.user_type == '大户') {
        total.value.value2 = parseFloat(item.average).toFixed(2)
      } else if (item.user_type == '散户') {
        total.value.value3 = parseFloat(item.average).toFixed(2)
      }
    }
  }
  for (const item of cl) {
    if (item.address == (selectAddress || curArea.value) && item.type == curType.value) {
      list.push({
        text: item.sub_type,
        value: parseFloat(item.average).toFixed(2)
      })
    }
  }
  echartsList.value = list;
  setTimeout(() => {
    isLoad.value = true
    setTimeout(() => {
    listRef.value && listRef.value.reload() 
    }, 0)
  }, 200)
}
const getHeaderData = (address) => { // 获取头部数据
let newArr = JSON.parse(JSON.stringify(GuaranteedList.value))
  for (const item of hxzb) {
    if (item.address == address) {
      newArr[0].num = parseFloat(parseFloat(item.gdmj) / 10000)
      newArr[1].num = parseFloat(parseFloat(item.lszzmj) / 10000)
      newArr[2].num = parseFloat(item.fgzs)
      if (address == '奉化区') {
        newArr[3].num = parseInt(parseFloat(item.lszcl) / 10000) // 当前单位万公斤
        newArr[3].decimals = 0
      } else {
        newArr[3].num = parseInt(parseFloat(item.lszcl) / 10000) // 当前单位万公斤
        newArr[3].decimals = 2
      }
      break
    }
  }
  GuaranteedList.value = newArr;
}
onMounted(() => { 
  init()
  getHeaderData('宁波市')
})
watch(() => props.selectVal, (val) => { 
  const selectAddress = val.split('/')[val.split('/').length - 1]; // 当前选中层级
  getHeaderData(selectAddress) // 只有奉化区有值 所以宁波市默认展示奉化区
  init(selectAddress)
  curArea.value = selectAddress;
  isFenghua.value = selectAddress == '奉化区'||selectAddress == '宁波市';
})
</script>
<style scoped lang="scss">
.rice-page{
  .flex-row {
    display: flex;
    flex-direction: row;
  }
  .fuaranteed-all-box{
    margin-top: 20px;
    margin-bottom: 24px;
    display: flex;
    flex-wrap:wrap;
    .fuaranteed-value-box{
      width: 119px;
      height: 82px;
      padding-left: 24px;
      padding-top: 18px;
      margin-right: 12px;
      margin-bottom: 12px;
      background: url('https://img.hzanchu.com/acimg/217a63d729578c73be80fb49addd6845.png') no-repeat;
      background-size: 100% 100%;
      ._num{
        ._title{
          font-size: 14px;
          font-family: MicrosoftYaHei-, MicrosoftYaHei;
          font-weight: normal;
          color: #00DEFF;
          margin-bottom: 13px;
        }
        ._value{
          font-size: 24px;
          font-family: DIN Alternate-Bold, DIN Alternate;
          font-weight: bold;
          color: #FFFFFF;
          margin-right: 5px;
        }
        ._unit{
          font-size: 12px;
          font-family: MicrosoftYaHei-, MicrosoftYaHei;
          font-weight: normal;
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }
  }
}
</style>