<template>
  <Container>
    <div class="district-page">
      <AreaSelect ref="areaSelectRef" class="area-select" @areaChange="areaChange" />
      <Module class="left" width="482px">
        <BlockModule titleText="产业兴旺" headMarginBottom="25px">
          <circelTypeList titleText="产业<br/>兴旺" :list="data.产业兴旺" />
        </BlockModule>
        <BlockModule titleText="生态宜居" headMarginBottom="25px" style="margin-top: 20px">
          <moduleTypeList :isShowPopper="true" :list="data.生态宜居" :src="require('./images/styj.png')" />
        </BlockModule>
        <BlockModule titleText="乡风文明" headMarginBottom="25px" style="margin-top: 20px">
          <CountryCivilization :list="data.乡风文明" />
        </BlockModule>
      </Module>
      <Module class="right" width="482px">
        <BlockModule titleText="治理有效" headMarginBottom="25px">
          <circelTypeList titleText="治理<br/>有效" :list="data.治理有效" />
        </BlockModule>
        <BlockModule titleText="生活富裕" headMarginBottom="25px" style="margin-top: 20px">
          <moduleTypeList :isShowPopper="true" :list="data.生活富裕" :src="require('./images/shfy.png')" />
        </BlockModule>
        <BlockModule titleText="业务科室核心指标" headMarginBottom="25px" style="margin-top: 20px">
          <normalTypelist :list="data.业务科室核心指标">
            <template #item="{ row }">
              <normalTypeItem3 :item="row" style="cursor: pointer" @click="linkPage(row)" />
            </template>
          </normalTypelist>
        </BlockModule>
      </Module>
      <BottomContent class="bottom-content" :key="COUNTY" />
      <iframe id="gisIframe" src="/NBJSC_SE/NBJSC_SY.html" frameborder="0" width="100%" height="100%" />
    </div>
  </Container>
</template>
<script setup>
import Container from './components/Container'
import AreaSelect from './components/AreaSelect'
import BottomContent from './components/BottomContent.vue'
import Module from './components/Module/Module'
import BlockModule from './components/Module/BlockModule'
import moduleTypeList from './components/Module/BlockModules/moduleTypeList.vue'
import circelTypeList from './components/Module/BlockModules/circelTypeList.vue'
import normalTypelist from './components/Module/BlockModules/normalTypelist.vue'
import normalTypeItem3 from './components/Module/BlockModules/normalTypeItem3'
import CountryCivilization from './components/Module/BlockModules/CountryCivilization'
import { ruralVitalizationAssessmentData } from './modal/const'
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import router from '@/router'
import { useRoute } from 'vue-router'
const Route = useRoute()
const COUNTY = ref(Route.query.COUNTY)
const data = reactive({
  产业兴旺: [],
  生态宜居: [],
  乡风文明: [],
  治理有效: [],
  生活富裕: [],
  业务科室核心指标: []
})
const dealData = (areaCity) => {
  const keys = Object.keys(data)
  keys.forEach((key) => {
    let list = []
    if (key === '业务科室核心指标') {
      const childCityData = ruralVitalizationAssessmentData.find((one) => one.broadHeading === '业务处室核心指标').childCityData
      list = childCityData.find((o) => areaCity.indexOf(o.name) === 0).list
    } else {
      const targetData = ruralVitalizationAssessmentData.find((one) => one.broadHeading === key).targetData
      list = targetData.map((one) => {
        let item = one.childCityData.find((o) => areaCity.indexOf(o.name) === 0)
        return {
          targetName: one.targetName,
          cityNum: item.value,
          unit: item.unit
        }
      })
    }
    if (key === '产业兴旺') {
      list = list.filter((one) => one.cityNum)
    }
    data[key] = list
  })
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
// 进入业务核心指标页面
const linkPage = (row) => {
  router.push({
    path: '/RuralBrain/businessCoreIndicatorPage',
    query: {
      targetName: row.targetName,
      COUNTY: COUNTY.value
    }
  })
}
// 区域下拉框chang
const areaChange = (v) => {
  if (v.length === 1 && v[0] === '宁波市') {
    // 返回局长页面
    router.push({
      path: '/RuralBrain'
    })
  } else {
    // 数据刷新，地图刷新
    COUNTY.value = v[1]
    dealData(COUNTY.value)
    sendMessage('gisLayerMessage', {
      key: 'changeAreaByName',
      value: { name: v[v.length - 1] }
    })
  }
}
// 地图改变区域下拉框
const areaSelectRef = ref()
const changAreaValue = (v) => {
  areaSelectRef.value?.setSelectCode(v)
}
</script>

<style lang="scss" scoped>
.district-page {
  height: 100%;
  position: relative;
  .bottom-content {
    width: calc(100% - 1004px);
    position: absolute;
    bottom: 0;
    left: 502px;
    z-index: 2;
  }
  :deep() {
    .area-select {
      position: absolute;
      top: 20px;
      left: 502px;
      z-index: 100;
    }
  }
  #gisIframe {
    height: 70%;
  }
}
</style>
