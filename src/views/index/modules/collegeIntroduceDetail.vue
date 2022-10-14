<template>
  <div class="college-introduce-box">
    <div class="title">
      {{ selectedInfo.title }}
      <span @click="openWindow(selectedInfo.developmentHistory, '发展历程')">发展历程</span>
    </div>
    <video class="video-box" controls :src="selectedInfo.video" poster="https://img.hzanchu.com/acimg/6cc936de89849b7225b6f0a2badcf2b6.png">您的浏览器不支持 video 标签。</video>
    <div v-for="(item, index) in selectedInfo.introduceData" :key="index">
      <div class="list">
        <div class="left-box">
          {{ item.name }}
          <div v-if="item.name === '帮扶解决了乡村发展难题'" @click="openWindow(selectedInfo.RecipientsPeople, '帮扶对象')">帮扶对象</div>
        </div>
        <div class="right-box">{{ item.value }}</div>
      </div>
    </div>
    <h3 class="vd__section-title" :style="{ paddingLeft: '34px' }">师资力量</h3>
    <div class="teachers-list">
      <el-carousel trigger="click" indicator-position="none">
        <el-carousel-item v-for="item in selectedInfo.teacherData" :key="item">
          <img :src="item.image" alt="" />
          <div class="teacher-info-box">
            <div class="name-box">
              {{ item.name }}
            </div>
            <div class="br-box"></div>
            <div v-for="(items, index) in item.intorduceList" :key="index">
              <p>{{ items }}</p>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="vd_tab-change">
      <el-radio-group v-model="studentSelectedInfo" @change="studentTabChange">
        <el-radio-button label="历年学员来源">历年学员来源</el-radio-button>
        <el-radio-button label="学员分布情况">学员分布情况</el-radio-button>
      </el-radio-group>
    </div>
    <annularChart :lengthData="studentSourceLengthData" :chartsData="selectedInfo.studentSource" v-if="studentSelectedInfo === '历年学员来源'" />
    <annularChart :lengthData="selectedInfo.DistributionStudents" :chartsData="selectedInfo.DistributionStudents" v-if="studentSelectedInfo === '学员分布情况'" />
  </div>
  <schoolWindows :title="windowTitle" v-if="isShowWindow" @updateVisible="updateVisible" :contentValue="introduceText" />
</template>
<script setup>
import { defineProps, computed, watch, ref } from 'vue'
import { RuralRevitalizationCollegeList } from '../modal/const.js'
import annularChart from '@/components/echarts/annularChart.vue'
import schoolWindows from '@/components/popWindows/schoolWindows.vue'
const selectedInfo = ref({})
const studentSourceLengthData = ref([])
const studentSelectedInfo = ref('历年学员来源')
const introduceText = ref('') // 弹窗文案
const isShowWindow = ref(false) // 是否展开弹窗
const windowTitle = ref('') // 弹窗标题
const props = defineProps({
  selectVal: {
    type: String
  }
})
const studentTabChange = (value) => {}
const updateVisible = () => {
  isShowWindow.value = false
}
const getstudentSourceData = (data) => {
  let allValue = 0
  data.forEach((element) => {
    allValue += Number(element.value)
  })
  studentSourceLengthData.value = data.map((item) => {
    return { name: item.name, value: (item.value / allValue).toFixed(2) * 100 }
  })
}
const openWindow = (val, title) => {
  isShowWindow.value = true
  introduceText.value = val
  windowTitle.value = title
}
watch(
  () => props,
  (val) => {
    selectedInfo.value = RuralRevitalizationCollegeList.filter((item) => item.title === val.selectVal)[0]
    getstudentSourceData(selectedInfo.value.studentSource)
  },
  { immediate: true }
)
</script>
<style scoped lang="scss">
.college-introduce-box {
  overflow: auto;
  height: 100%;
  .title {
    position: relative;
    width: 288px;
    height: 33px;
    background: linear-gradient(270deg, rgba(51, 143, 249, 0) 0%, rgba(51, 143, 249, 0.56) 49%, rgba(51, 143, 249, 0) 100%);
    //opacity: 0.66;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    font-family: MicrosoftYaHei;
    color: #ffffff;
    margin-bottom: 23px;
    span {
      cursor: pointer;
      position: absolute;
      bottom: 7px;
      right: 0;
      font-size: 14px;
      font-family: PangMenZhengDao-3, PangMenZhengDao;
      font-weight: normal;
      color: #00deff;
    }
  }
  .video-box {
    width: 296px;
    height: 163px;
    border-radius: 8px;
    background: #11224b;
    box-shadow: 0px 0px 16px 0px #002144;
    border-radius: 8px;
    border: 1px solid #1985e1;
    margin-bottom: 26px;
    object-fit: fill;
  }
  .list {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .left-box {
      flex: 1;
      text-align: left;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #00deff;
      position: relative;
      div {
        position: absolute;
        right: 21px;
        top: -5px;
        width: 70px;
        height: 24px;
        box-shadow: inset 0px 0px 6px 0px #159cff;
        border: 1px solid #159cff;
        font-size: 14px;
        font-family: PangMenZhengDao-3, PangMenZhengDao;
        font-weight: normal;
        color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
    }
    .right-box {
      text-align: right;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #ffffff;
    }
  }
  .vd__section-title {
    margin-top: 12px;
    box-sizing: border-box;
    width: 298px;
    height: 40px;
    padding: 0 0 12px 34px;
    font-size: 22px;
    font-family: PangMenZhengDao;
    font-weight: 400;
    color: #ffffff;
    background: no-repeat center / 100% auto url('~@/views/index/image/block_bg.png');
  }
  .teachers-list {
    padding-left: 15px;
    padding-right: 15px;
    :deep(.el-carousel__container) {
      height: 331px;
    }
    .el-carousel__container {
      img {
        // width: 100%;
        height: 175px;
        border-radius: 8px;
      }
      .teacher-info-box {
        .name-box {
          margin-top: 25px;
          font-size: 16px;
          font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
          font-weight: bold;
          color: #ffffff;
        }
        .br-box {
          width: 258px;
          margin-top: 7px;
          margin-bottom: 8px;
          height: 1px;
          background: linear-gradient(90deg, rgba(46, 206, 255, 0) 0%, #26ccff 0%, rgba(46, 206, 255, 0) 100%);
        }
        p {
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #ffffff;
          line-height: 24px;
        }
      }
    }
  }
  .vd_tab-change {
    :deep(.el-radio-group) {
      display: flex;
      flex-wrap: nowrap;
      width: 100%;
      margin: 10px 0 20px 0px;
      justify-content: center;
      // border-image: url('https://img.hzanchu.com/acimg/fdfeca6e76bcaff7ea93bc8504ce0e2b.png') 100%;
      // border-bottom: 2px solid;
      .el-radio-button {
        --el-radio-button-checked-bg-color: transparent;
        --el-radio-button-checked-text-color: transparent;
        --el-radio-button-checked-border-color: transparent;
        --el-radio-button-disabled-checked-fill: transparent;
        --el-button-bg-color: transparent;
        --el-border: none;
        --el-button-text-color: transparent;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: #ffffff;
        font-weight: normal;
        background: #155e93;
        opacity: 0.5;
        border: 1px solid #159cff;
        margin-bottom: -2px;
        width: 149px;
        height: 29px;
        &.is-active {
          width: 149px;
          height: 29px;
          background: #00446f;
          box-shadow: inset 0px 0px 6px 0px #29a4ff;
          border: 1px solid #159cff;
          font-size: 16px;
          opacity: 1;
          font-family: MicrosoftYaHei;
          color: #ffffff;
        }
        .el-radio-button__inner {
          font-size: 16px;
          font-family: MicrosoftYaHei;
          color: #ffffff;
        }
      }
    }
  }
}
</style>
