<template>
  <Container>
    <div class="business-core-indicator-page">
      <AreaSelect ref="areaSelectRef" class="area-select" @areaChange="areaChange" />
      <div class="back-page" @click="backPage">
        {{ Route.query.COUNTY ? '返回区长驾驶舱' : '返回局长驾驶舱' }}
      </div>
      <Module class="left" width="482px">
        <BlockModule titleText="乡村振兴指标体系" headMarginBottom="25px">
          <circelTypeList titleText="乡村振兴<br/>指标体系" :list="data.乡村振兴指标体系" />
        </BlockModule>
        <BlockModule titleText="处室核心指标" headMarginBottom="25px" style="margin-top: 20px">
          <moduleTypeList :list="data.处室核心指标" :src="require('./images/cshxzb.png')" />
        </BlockModule>
      </Module>
      <Module class="right" width="482px">
        <BlockModule titleText="项目管理">
          <ProjectList class="scaletable" size="small" style="height: 260px" :columns="projectColumn" :list="projectList" />
        </BlockModule>
        <BlockModule titleText="预测预警" headMarginBottom="25px" style="margin-top: 20px">
          <WarnControl size="small" class="scaletable" style="height: 260px" position="vertical" />
        </BlockModule>
        <BlockModule titleText="舆情监控" headMarginBottom="25px" style="margin-top: 20px">
          <OpionControl position="vertical" />
        </BlockModule>
      </Module>
      <iframe id="gisIframe" src="/NBJSC_SE/NBJSC_SY.html" frameborder="0" width="100%" height="100%" />
    </div>
  </Container>
</template>
<script setup>
import Container from './components/Container'
import AreaSelect from './components/AreaSelect'
import Module from './components/Module/Module'
import BlockModule from './components/Module/BlockModule'
import circelTypeList from './components/Module/BlockModules/circelTypeList.vue'
import moduleTypeList from './components/Module/BlockModules/moduleTypeList'
import ProjectList from './components/ProjectList'
import WarnControl from './components/WarnControl'
import OpionControl from './components/OpionControl'
import { ruralVitalizationAssessmentData, projectData, projectColumns, coreIndicatorData } from './modal/const'
import router from '@/router'
import { useRoute } from 'vue-router'
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
const Route = useRoute()
const COUNTY = ref(Route.query.COUNTY || '宁波市')
const projectColumn = projectColumns.SX
const projectList = ref([])
const data = reactive({
  乡村振兴指标体系: [],
  处室核心指标: []
})
const dealData = (areaCity) => {
  if (areaCity === '宁波市') {
    data.乡村振兴指标体系 = ((ruralVitalizationAssessmentData.find((one) => one.broadHeading === '产业兴旺') || {}).targetData || []).filter((one) => one.cityNum)
  } else {
    const targetData = ruralVitalizationAssessmentData.find((one) => one.broadHeading === '产业兴旺').targetData
    data.乡村振兴指标体系 = targetData
      .map((one) => {
        let item = one.childCityData.find((o) => areaCity.indexOf(o.name) === 0)
        return {
          targetName: one.targetName,
          cityNum: item.value,
          unit: item.unit
        }
      })
      .filter((one) => one.cityNum)
  }
  data.处室核心指标 = coreIndicatorData
  // let projectName = COUNTY.value === '宁波市' ? '宁波' : COUNTY.value
  projectList.value = projectData.find((one) => '宁波市'.indexOf(one.name) === 0).list
}
onMounted(() => {
  dealData(COUNTY.value)
  window.addEventListener('message', receiveMsg, false)
})
onBeforeUnmount(() => {
  window.removeEventListener('message', receiveMsg, false)
})
// 初始化渲染地图
const isMapInit = ref(false)
const initMap = () => {
  isMapInit.value = true
  sendMessage('gisLayerMessage', {
    key: 'changeAreaByName',
    value: { name: COUNTY.value }
  })
}
// 接受消息信息
const receiveMsg = (e) => {
  if (e.data.type === 'gisMapMessage' && !isMapInit.value) {
    initMap()
  } else if (e.data.type === 'gisLayerMessage') {
    let { key, value } = e.data.data
    if (key === 'areaInfo' && value.areaInfo.LEVEL !== 'village') {
      // 区域下拉框值要改变
      let selectCode = ['宁波市', value.areaInfo.COUNTY, value.areaInfo.TOWN].filter((one) => one)
      changAreaValue(selectCode)
    }
  }
}
// 向子页面传递消息
const sendMessage = (type, data) => {
  let iframe = document.getElementById('gisIframe')
  iframe.contentWindow.postMessage({ type: type, data: data }, '*')
}
// 区域下拉框chang
const areaChange = (v) => {
  // 数据刷新，地图刷新
  COUNTY.value = v[1] || v[0]
  dealData(COUNTY.value)
  sendMessage('gisLayerMessage', {
    key: 'changeAreaByName',
    value: { name: v[v.length - 1] }
  })
}
// 地图改变区域下拉框
const areaSelectRef = ref()
const changAreaValue = (v) => {
  COUNTY.value = v[1] || v[0]
  dealData(COUNTY.value)
  areaSelectRef.value?.setSelectCode(v)
}
// 返回驾驶舱
const backPage = () => {
  if (!Route.query.COUNTY) {
    router.push({
      path: '/RuralBrain'
    })
  } else {
    router.push({
      path: '/RuralBrain/districtPage',
      query: {
        COUNTY: Route.query.COUNTY
      }
    })
  }
}
</script>
<style lang="scss" scoped>
.business-core-indicator-page {
  height: 100%;
  position: relative;
  :deep() {
    .area-select {
      position: absolute;
      top: 20px;
      left: 502px;
      z-index: 100;
    }
  }
  .back-page {
    position: absolute;
    top: 20px;
    right: 502px;
    z-index: 100;
    cursor: pointer;
    width: 124px;
    height: 41px;
    line-height: 41px;
    text-align: center;
    font-size: 14px;
    color: #ffffff;
    text-shadow: 0px 0px 2px #042148;
    background: url('./images/backPageBac.png') no-repeat;
    background-size: 100% 100%;
  }
  .scaletable {
    width: calc(100% + 24px);
    transform: translateX(-12px);
  }
  #gisIframe {
    margin-top: 5%;
    height: 80%;
  }
}
</style>
