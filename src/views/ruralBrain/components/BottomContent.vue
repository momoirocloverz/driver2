<template>
  <div class="bottom-content">
    <div class="head">
      <div class="tab-wrap">
        <div :class="{ tab: true, tab_active: tab.name === activeTab }" v-for="tab in tabs" :key="tab.name" @click="tabChange(tab)">
          {{ tab.text }}
        </div>
      </div>
      <div class="radio-wrap" v-if="activeTab === 'project'">
        <div :class="{ radio: true }" v-for="radio in radios" :key="radio.name" @click="radioChange(radio)">
          <img :src="radio.name === activeRadio ? radioImgs.active : radioImgs.normal" />
          {{ radio.text }}
        </div>
      </div>
    </div>
    <div class="content">
      <ProjectList v-if="activeTab === 'project'" class="project-list" :columns="projectColumn" :list="projectList" />
      <WarnControl v-if="activeTab === 'warnControl'" class="warn-control" />
      <OpionControl style="margin-top: 20px; padding: 0 32px 0 40px" v-if="activeTab === 'opionControl'" />
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import ProjectList from './ProjectList'
import OpionControl from './OpionControl.vue'
import WarnControl from './WarnControl.vue'
import { projectColumns, projectData } from '../modal/const'
import { useRoute } from 'vue-router'
const Route = useRoute()
const COUNTY = Route.query.COUNTY || '宁波市'
// tab
const tabs = [
  {
    text: '预测预警',
    name: 'warnControl'
  },
  {
    text: '项目管理',
    name: 'project'
  },
  {
    text: '舆情监控',
    name: 'opionControl'
  }
]
const activeTab = ref('warnControl')
const tabChange = (tab) => {
  activeTab.value = tab.name
}
// 单选
const radioImgs = {
  normal: 'https://img.hzanchu.com/acimg/c648bb8778c071d65facbc0a3b98ebad.png',
  active: 'https://img.hzanchu.com/acimg/634f714268ba500435a4d53986deb7d8.png'
}
const radios = [
  {
    text: '处室排名',
    name: 'YWCS'
  }
  // {
  //   text: '区县排名',
  //   name: 'SX'
  // }
]
const activeRadio = ref('YWCS')
const radioChange = (radio) => {
  activeRadio.value = radio.name
}
// 项目管理列表
const projectColumn = computed(() => {
  return projectColumns[activeRadio.value]
})
const projectList = computed(() => {
  // return projectData.find((one) => COUNTY.indexOf(one.name) === 0).list || []
  return projectData.find((one) => '宁波市'.indexOf(one.name) === 0).list || []
})
onMounted(() => {})
</script>
<style lang="scss" scoped>
.bottom-content {
  box-sizing: border-box;
  height: 283px;
  padding: 15px 0;
  background: url('../images/bottomBac.png') no-repeat #072069;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  .head {
    margin-bottom: 10px;
    padding: 0 25px;
    display: flex;
    justify-content: space-between;
    .tab-wrap {
      display: flex;
      .tab {
        cursor: pointer;
        margin-right: 12px;
        height: 36px;
        width: 147px;
        font-size: 22px;
        font-family: PangMenZhengDao-3, PangMenZhengDao;
        font-weight: normal;
        color: #ffffff;
        line-height: 34px;
        background: url('../images/tabBac.png') no-repeat;
        background-size: 100% 100%;
        text-align: center;
        &.tab_active {
          text-shadow: 0px 1px 2px #042767;
          background: url('../images/tabBac_active.png') no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    .radio-wrap {
      display: flex;
      align-items: center;
      .radio {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #ffffff;
        line-height: 20px;
        display: flex;
        align-items: center;
        margin-right: 20px;
        cursor: pointer;
        &:last-child {
          margin: 0;
        }
        img {
          width: 18px;
          height: 18px;
          margin-right: 7px;
        }
      }
    }
  }
  .content {
    flex: 1;
    overflow: hidden;
    .project-list,
    .warn-control {
      height: 100%;
      padding: 0 17px;
    }
    .warn-control {
      margin-top: 6px;
      padding: 0 21px;
    }
  }
}
</style>
