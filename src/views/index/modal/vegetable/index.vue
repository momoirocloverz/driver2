<template>
  <div class="vegetable-page">
    <module-title title="蔬菜基地" position="right" />
    <div class="title-box">
      <div class="_title">蔬菜基地总数</div>
      <div class="_num">
        <span>17</span>
        个
      </div>
    </div>
    <div class="value-box" v-for="(item,index) in dataList" :key="index">
      <div class="_title">{{item.name}}</div>
      <div class="_num"><span>{{item.value}}</span>{{item.unit}}</div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import moduleTitle from '@/components/moduleTitle'
const dataList = ref([
  {name:'全市蔬菜播种面积',value:'129.4',unit:'万亩'},
  {name:'全市蔬菜总产量',value:'261.1',unit:'万吨'},
  {name:'设施蔬菜面积',value:'13.5',unit:'万亩'},
  {name:'省“放心菜园”示范基地',value:'50',unit:'个'},
  {name:'市级“放心菜园”示范基地',value:'50',unit:'个'},
  {name:'蔬菜质量安全合格',value:'>98%',unit:''},
  {name:'国家级农业龙头企业',value:'1',unit:'家'},
  {name:'省级农业龙头企业',value:'8',unit:'家'},
  {name:'宁波市农业龙头企业',value:'41',unit:'家'},
  {name:'蔬菜出口额',value:'12873',unit:'万/美元'},
])
</script>
<style scoped lang="scss">
.vegetable-page{
      ._title{
      font-size: 16px;
      font-family: MicrosoftYaHei-, MicrosoftYaHei;
      font-weight: normal;
      color: #00DEFF;
    }
  .title-box{
    width: 297px;
    height: 68px;
    background: url('https://img.hzanchu.com/acimg/296a9d8d194655129d528a0f4c6337a7.png') no-repeat;
    background-size: 100% 100%;
    margin-top:20px;
    margin-bottom: 31px;
    display: flex;
    align-items: center;
    padding: 0 24px;
    box-sizing: border-box;
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
  .value-box{
    display: flex;
    margin-bottom: 34px;
  }
}
</style>