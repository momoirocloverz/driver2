<template>
  <div class="all-industry-box">
    <module-title title="2025年规划目标" position="right" />
     <div class="value-box" v-for="(item,index) in dataList" :key="index">
      <div class="_title">{{item.name}}</div>
      <div class="_num"><span>{{item.value}}</span>{{item.unit}}</div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import moduleTitle from '@/components/moduleTitle'
const dataList = [
  {name:'粮食播种面积',value:'174',unit:'万亩'},
  {name:'粮食产量',value:'71.18',unit:'万吨'},
  {name:'生猪出栏',value:'149',unit:'万头'},
  {name:'猪肉产量',value:'12.8',unit:'万吨'},
  {name:'水产养殖面积',value:'59.71',unit:'万亩'},
  {name:'养殖产量',value:'43.67',unit:'万吨'},
  {name:'水产品总产量',value:'99.71',unit:'万吨'},
  {name:'油菜籽播种面积',value:'12.8',unit:'万亩'},
  {name:'油菜籽产量',value:'2',unit:'万吨'},
  {name:'蔬菜种植面积',value:'128',unit:'万亩'},
  {name:'蔬菜产量',value:'278',unit:'万吨'},
  {name:'奶牛存栏量',value:'8650',unit:'头'},
  {name:'牛奶产量',value:'3.81',unit:'万吨'},
  {name:'肉牛存栏',value:'0.59',unit:'万头'},
  {name:'肉羊存栏',value:'5.2',unit:'万头'},
  {name:'家禽出栏',value:'700',unit:'万只'},
]
</script>
<style scoped lang="scss">
.all-industry-box{
  .value-box{
    display: flex;
    margin-top: 34px;
    ._title{
      font-size: 16px;
      font-family: MicrosoftYaHei-, MicrosoftYaHei;
      font-weight: normal;
      color: #00DEFF;
    }
    ._num{
      margin-left: auto;
      font-size: 12px;
      font-family: MicrosoftYaHei-, MicrosoftYaHei;
      font-weight: normal;
      color: rgba(255, 255, 255, 0.8);
      span{
        font-size: 24px;
        font-family: DIN Alternate-Bold, DIN Alternate;
        font-weight: bold;
        color: #FFFFFF;
        margin-right: 6px;
      }
    }
  }
}
</style>