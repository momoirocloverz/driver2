<template>
  <div class="masterCon"  @mouseenter="fun" @mouseleave="isShowTip = false">
    <rotateCircle />
    <div class="rightCon">
      <div class="betweenText">
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="props.title"
          placement="top"
        >
          <div class="_left">{{props.title}}</div>
        </el-tooltip>
        <div class="_right"><span>{{showData.cityNum}}</span>{{props.unit}}</div>
      </div>
      <div class="progress-box" :style="{ width: props.barWidth + 'px' }">
        <progressBar />
        <img :src="percent==100?imgSrc[0]:imgSrc[1]" alt="">
      </div>
    </div>
    <transition name="rac-chart-elem">
      <div class="rac-chart-container" v-show="isShowTip && props.selectCode.length == 1 && !selectAreaVal">
        <h3 class="rac-chart-container__title">各区指标</h3>
        <h3 class="rac-chart-container__title">{{props.title}}</h3>
        <div class="rac-chart-container__close-btn" @click="isShowTip = false">x</div>
        <!-- <div style="margin-bottom:30px"></div> -->
        <template v-for="(item,index) in childCityData" :key="index">
          <div class="town-box">
            <!-- <div style="marginLeft:20px;width:42px">NO.{{index+1}}</div> -->
            <div style="marginLeft:8px;width:60px;">{{item.name}}</div>
            <div class="progress-box margin-box" :style="{ width: props.barWidth + 'px' }">
              <progressBar :percent="100" />
              <img :src="percent==100?imgSrc[0]:imgSrc[1]" alt="">
            </div>
            <div class="unit-box">{{item.value}}{{item.unit}}</div>
          </div>
        </template>
      </div>
    </transition>
    <!-- <div class="leftFirstBack" v-show="isShowTip">
      <template v-for="(item,index) in childCityData" :key="index">
        <div class="town-box">
          <div style="marginLeft:20px;width:42px">NO.{{index+1}}</div>
          <div style="marginLeft:8px;width:60px;">{{item.name}}</div>
          <div class="progress-box margin-box" :style="{ width: props.barWidth + 'px' }">
            <progressBar :percent="100" />
            <img :src="percent==100?imgSrc[0]:imgSrc[1]" alt="">
          </div>
          <div class="unit-box">{{item.value}}{{item.unit}}</div>
        </div>
      </template>
    </div> -->
  </div>
</template>
<script setup>
import { onMounted , ref , watch } from 'vue'
import rotateCircle from '@/components/rotateCircle'
import progressBar from '@/components/progressBar'
const isShowTip = ref(false) // 滑动展示提示框
const selectAdress = ref('宁波市') // 滑动展示提示框
const showData = ref({title:'',cityNum:0})
const imgSrc = ref(['https://img.hzanchu.com/acimg/2669790ae68859ba79bbcd653ffbe552.png','https://img.hzanchu.com/acimg/34075d4f171c4cae99a35a8f64090794.png'])
const props = defineProps({
  barWidth: {
    default: 260
  },
  title: {
    type: String,
    default: '标题'
  },
  cityNum: {
    type: String,
    default: '0'
  },
  unit: {
    type: String,
    default: ''
  },
  childCityData: {
    type: Array,
    default: []
  },
  selectCode: {
    type: Array,
    default: []
  },
  selectAreaVal: {
    type:String,
  },
  percent: {
    type: Number,
    default: 100
  },
})
const fun = () => { 
  isShowTip.value = true
}
onMounted(() => {
  changeTitleFun(props.selectCode)
})
watch(() => props.selectCode , (val) => { 
  if (props.selectAreaVal ? val.length == 1 : val.length == 2) { 
    selectAdress.value = val[val.length-1]
  }
  changeTitleFun(val)
})
const changeTitleFun = (val) => {  // 地图下转展示区的数据
  const newObj = { title: '', cityNum: 0 };
  if (val.length == 1&&!props.selectAreaVal) {  // 市级别
    newObj.title = props.title;
    newObj.cityNum = props.cityNum;
  } else { 
    props.childCityData.forEach(item => { 
      if (item.name == selectAdress.value.substring(0, 2)) { 
        newObj.title = item.name;
        newObj.cityNum = item.value;
      }
    })
  }
  showData.value = newObj;
}
</script>
<style lang="scss" scoped>
.masterCon {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  position: relative;
  margin: 16px 0;
    .leftFirstBack {
      position: absolute;
      bottom: -301px;
      left: 0;
      width: 382px;
      height: 301px;
      z-index: 999;
      background-image: url(https://img.hzanchu.com/acimg/e3748618cf7f9252d28e03f2654c87f6.png);
      background-size: 100% 100%;
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
      padding:28px 18px;
      box-sizing: border-box;
    }
}
.margin-box{
  flex: 1;
  .progress-bar{
    margin-top: 5px !important;
  }
}
.progress-box{
  display:flex;
   img{
    width: 24px;
    height: 24px;
    margin-left: 6px;
    margin-top: -5px;
  }
}
// chart css
.rac-chart-container {
  box-sizing: border-box;
  $rac-chart-container-width: 728px;
  $rac-chart-container-padding: 20px;
  position: fixed;
  width: $rac-chart-container-width;
  height: 496px;
  left: calc(50% - $rac-chart-container-width / 2);
  bottom: 20px;
  z-index: 10;
  background: no-repeat center / 100% 100% url('~@/views/index/image/bottom-chart-bg.svg');
  padding-inline: $rac-chart-container-padding;
      .town-box{
        padding-left: 30px;
        width: 100%;
        height: 20px;
        font-size: 14px;
        font-family: PangMenZhengDao;
        color: #FFFFFF;
        margin-bottom: 11px;
        display: flex;
        .unit-box{
          margin-left: 7px;
          color: #27E0FD;
          width: 150px;
        }
      }
  .rac-chart-container__title {
    font-size: 24px;
    color: #FFFFFF;
    line-height: 52px;
    text-shadow: 0px 6px 6px #002160;
    text-align: center;
    width: 100%;
  }
  .rac-chart-container__close-btn {
    color: #CBF7FF;
    font-size: 24px;
    position: absolute;
    right: 24px + 12px;
    top: 50px;
    cursor: pointer;
  }
  .rac-chart {
    width: $rac-chart-container-width - $rac-chart-container-padding * 2;
    height: 340px;
  }
}
.rac-chart-tabs {
  margin-block: 28px 20px;
  :deep(.el-radio-group) {
    column-gap: 32px;
    justify-content: center;
    width: 100%;
    .el-radio-button {
      --el-radio-button-checked-bg-color: #00446F;
      --el-button-bg-color: #0E4571;
      --el-radio-button-checked-text-color: white;
      --el-button-text-color: #9DB3C5;
      --el-color-primary: white;
      .el-radio-button__inner {
        border-color: #0E64A7;
      }
      &.is-active {
        .el-radio-button__inner {
          border-color: #159CFF;
        }
      }
    }
  }
}
.rac-chart-elem-enter-active,
.rac-chart-elem-leave-active {
  transition: all 0.5s ease-out;
}
.rac-chart-elem-enter-from, .rac-chart-elem-leave-to {
  opacity: 0;
  transform: translateY(30%);
}
.rightCon {
  margin-left: 10px;
}
.betweenText {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  ._left{
    font-size: 16px;
    font-family: PangMenZhengDao;
    color: #FFFFFF;
    line-height: 20px;
    height: 20px;
    width: 191px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  ._right{
    font-size: 14px;
    font-family: PangMenZhengDao;
    color: #90B6D2;
    span{
      font-size: 16px;
      color: #27E0FD;
      text-shadow: 0px 0px 12px rgba(39,224,253,0.3500);
    }
  }
}
</style>
