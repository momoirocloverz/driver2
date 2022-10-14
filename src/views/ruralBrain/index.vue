<template>
  <Container>
    <div class="rural-brain">
      <Module class="left" width="482px">
        <BlockModule titleText="产业兴旺" headMarginBottom="25px">
          <circelTypeList titleText="产业<br/>兴旺" :list="data.产业兴旺" :isShowPopper="true" />
        </BlockModule>
        <BlockModule titleText="生态宜居" headMarginBottom="25px" style="margin-top: 20px">
          <moduleTypeList :isShowPopper="true" :list="data.生态宜居" :src="require('./images/styj.png')" />
        </BlockModule>
        <BlockModule titleText="乡风文明" headMarginBottom="25px" style="margin-top: 20px">
          <CountryCivilization :isShowPopper="true" :list="data.乡风文明" />
        </BlockModule>
      </Module>
      <Module class="right" width="482px">
        <BlockModule titleText="治理有效" headMarginBottom="25px">
          <circelTypeList titleText="治理<br/>有效" :list="data.治理有效" :isShowPopper="true" />
        </BlockModule>
        <BlockModule titleText="生活富裕" headMarginBottom="25px" style="margin-top: 20px">
          <moduleTypeList :isShowPopper="true" :list="data.生活富裕" :src="require('./images/shfy.png')" />
        </BlockModule>
        <BlockModule titleText="业务处室核心指标" headMarginBottom="25px" style="margin-top: 20px">
          <normalTypelist :list="data.业务处室核心指标">
            <template #item="{ row }">
              <normalTypeItem3 :item="row" style="cursor: pointer" @click="linkPage(row)" />
            </template>
          </normalTypelist>
        </BlockModule>
      </Module>
      <BottomContent class="bottom-content" />
      <MapLegend class="map-legend" v-if="isMapInit" @legendChange="legendChange" />
      <iframe id="gisIframe" src="/NBJSC_SE/NBJSC_SY.html" frameborder="0" width="100%" height="100%" />
    </div>
  </Container>
</template>
<script setup>
import Container from './components/Container'
import BottomContent from './components/BottomContent.vue'
import MapLegend from './components/MapLegend.vue'
import Module from './components/Module/Module'
import BlockModule from './components/Module/BlockModule'
import circelTypeList from './components/Module/BlockModules/circelTypeList.vue'
import moduleTypeList from './components/Module/BlockModules/moduleTypeList.vue'

import normalTypelist from './components/Module/BlockModules/normalTypelist.vue'
import normalTypeItem3 from './components/Module/BlockModules/normalTypeItem3'
import CountryCivilization from './components/Module/BlockModules/CountryCivilization'
import { ruralVitalizationAssessmentData } from './modal/const'
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import router from '@/router'
const data = reactive({
  产业兴旺: [],
  生态宜居: [],
  乡风文明: [],
  治理有效: [],
  生活富裕: [],
  业务处室核心指标: []
})
const dealData = () => {
  // 处理数据
  const keys = Object.keys(data)
  keys.forEach((key) => {
    data[key] = (ruralVitalizationAssessmentData.find((one) => one.broadHeading === key) || {}).targetData || []
  })
}
onMounted(() => {
  dealData()
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
    value: { name: '宁波市' }
  })
}
// 接受消息信息
const receiveMsg = (e) => {
  if (e.data.type === 'gisMapMessage' && !isMapInit.value) {
    initMap()
  } else if (e.data.type === 'gisLayerMessage') {
    let { key, value } = e.data.data
    if (key === 'areaInfo' && value && value.areaInfo.COUNTY) {
      router.push({
        path: '/RuralBrain/districtPage',
        query: {
          COUNTY: value.areaInfo.COUNTY
        }
      })
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
      targetName: row.targetName
    }
  })
}
// 地图展示对应图例数据
const legendChange = (field) => {
  const data = {
    key: 'lengedField',
    value: { field: field }
  }
  sendMessage('gisLayerMessage', data)
}
</script>
<style lang="scss" scoped>
.rural-brain {
  height: 100%;
  position: relative;
  #gisIframe {
    height: 80%;
  }
  .bottom-content {
    width: calc(100% - 1004px);
    position: absolute;
    bottom: 0;
    left: 502px;
    z-index: 2;
  }
  .map-legend {
    position: absolute;
    bottom: 310px;
    right: 502px;
    z-index: 2;
  }
}
</style>
