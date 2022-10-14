<template>
  <div class="index">
    <area-select
      class="area-select"
      v-if="activeLayerCategoryTab"
      v-model:selectVal="selectVal"
      :selectCode="selectCode"
      :selectAreaVal="selectAreaVal"
      :area-list="selecetAreaList"
      @sendMessage="sendMessage"
    />
    <SearchLiang class="search-btn" :initAreaName="selectAreaVal" @linkToArea="linkToArea" />
    <MapToolkitComponent @sendMessage="sendMessage" />
    <SideBar class="side-bar--left" style="height: 901px; top: 156px" position="left">
      <LeftModule :mapInit="mapInit" ref="layerPickerRef" @sendMessage="sendMessage" @onTabChange="activeLayerCategoryTabChange" @overallPlanChange="overallPlanChange" />
    </SideBar>
    <SideBar class="side-bar--right" position="right">
      <RightModule
        :activeLayerCategoryTab="activeLayerCategoryTab"
        :activeModule="layerPickerRef?.activeModule"
        :changeLayerByOptionMessageObj="changeLayerByOptionMessageObj"
        :content="rightPanelContent"
        :initAreaName="selectAreaVal"
      />
      <template #left-bottom-toolbox>
        <!-- //selectValueList: 专题图层生产力布局[
          "产业-资源-畜牧",
          "产业-资源-粮食",
          "产业-资源-食用植物油",
          "产业-资源-蔬菜",
          "产业-资源-水产"
        ] -->
        <!-- todo lsq-待补充 -->
        <AdditionalControlsComponent
          ref="additionalControlsComponentRef"
          selectValueList="产业-资源-水产"
          :changeLayerByOptionMessageObj="changeLayerByOptionMessageObj"
          :activeLayerCategoryTab="activeLayerCategoryTab"
          :active-module="layerPickerRef?.activeModule"
          :selectAreaVal="selectAreaVal"
          @sendMessage="sendMessage"
        />
      </template>
    </SideBar>
    <!-- 临时展示一个地图图片 当专题图层-生产力布局-总布局 打开时候展示 -->
    <img v-if="activeLayerCategoryTab === '专题图层' && isOverallPlan" :style="{ width: '100%', height: '100%' }" src="./image/zbj-image.png" alt="" />
    <iframe id="gisIframe" ref="mapRef" :src="iframeSrc" frameborder="0" width="100%" height="100%" />
    <bottomReel />
  </div>
</template>
<script setup>
import SideBar from './components/SideBar.vue'
import areaSelect from '@/components/areaSelect'
import bottomReel from '@/components/bottomReel'
import SearchLiang from './components/SearchLiang'
import MapToolkitComponent from './components/MapToolkitComponent'
import LeftModule from './modules/LeftModule/index'
import RightModule from './modules/RightModule/index'
import AdditionalControlsComponent from './components/AdditionalControlsComponent.vue'
import { areaSelectedList } from '../ruralBrain/modal/const'
import regionData from '@/assets/js/area.json' // 无粮功区版本
import { ref, onMounted, onBeforeUnmount, reactive, computed, watch, watchEffect, toRaw, nextTick, provide } from 'vue'
import { lineIntroduce, shuiProduct, STXVideoList, villageIntroduce } from './modal/const'
import { useRoute } from 'vue-router'
import { klona } from 'klona' // 有粮功区版本
import { set, get, union, cloneDeep } from 'lodash'
const Route = useRoute()
let area = reactive(Route.query.area)
const activeLayerCategoryTab = ref('') // 左侧选择的tab 基础图层、专题图层
const selectVal = ref('宁波市') // 选择的地区
const selecetAreaList = ref(regionData) // 地域选项数据
const selectAreaVal = ref('') // 初始地区数据
const selectCode = ref(null) // 地区编码
const mapRef = ref(null) // iframe实例
const mapInit = ref(false) // 地图初始化是否成功
const layerPickerRef = ref(null) // 左侧实例
const isOverallPlan = ref(false) // 专题图层的总布局是否打开
const changeLayerByOptionMessageObj = ref({}) // changeLayerByOption事件的信息
const additionalControlsComponentRef = ref(null)
const rightPanelContent = ref(null) // 右侧模块需要使用的信息
const mainLayerState = ref(null) // 待确认
// const additionalLayerState = ref([]) // 待确认
const oldIframeSrc = ref('')
const iframeSrc = computed(() => {
  let src = ''
  if (['农村', '精品'].includes(layerPickerRef.value?.activeModule)) {
    src = '/NBJSC_SE/NBJSC_NMNC.html'
  } else {
    src = '/NBJSC_SE/NBJSC_CYZY.html'
  }
  if (oldIframeSrc.value !== src) {
    mapInit.value = false
    oldIframeSrc.value = src
  }
  return src
})
provide('regionNamePath', selectVal)
onMounted(() => {
  if (area) initArea(area) //初始化进行地区限制
  window.addEventListener('message', receiveMsg, false)
})
onBeforeUnmount(() => {
  window.removeEventListener('message', receiveMsg, false)
})
const initArea = (area) => {
  //初始化进行地区限制
  let selectArea = areaSelectedList[area]
  let newAreaList = []
  regionData.city.children.forEach((item) => {
    if (item.name == selectArea) {
      newAreaList = { city: item }
    }
  })
  selecetAreaList.value = newAreaList
  selectAreaVal.value = selectArea
  selectVal.value = selectArea
  selectCode.value = [selectArea]
}
watch(
  () => selectVal.value,
  (val) => {
    console.log('首页===>', val)
  },
  { immediate: true }
)
// 接受地图的消息
const receiveMsg = (e) => {
  // todo lsq-优化待补充的欠缺的
  let obj = e.data
  if (obj.type === 'gisMapMessage' && obj.data.value.initType) {
    onMapLoaded()
  }
  // 双击地图默认选中当前区域
  if (obj.type === 'gisLayerMessage') {
    if (obj.data.key == 'areaInfo') {
      // 单击或双击地图操作
      let val = obj.data.value.areaInfo
      const { CITY, COUNTY, TOWN, VILLAGE, LEVEL } = val
      if (LEVEL === 'lgq') {
        // 双击粮功区
        selectVal.value = selectAreaVal.value ? val.COUNTY + '/' + val.TOWN + '/' + val.GHMC : '宁波市/' + val.COUNTY + '/' + val.TOWN + '/' + val.GHMC
        selectCode.value = selectAreaVal.value ? [val.COUNTY, val.TOWN, val.GHMC] : ['宁波市', val.COUNTY, val.TOWN, val.GHMC]
      } else {
        // 地图下钻
        if (layerPickerRef.value?.activeModule === '农村') {
          Promise.all([
            import('@/assets/js/产业大脑/村庄_图片路径.json'),
            import('@/assets/js/产业大脑/未来乡村.json'),
            import('@/assets/js/产业大脑/小集镇式中心村.json'),
            import('@/assets/js/产业大脑/梳理式改造村.json'),
            import('@/assets/js/产业大脑/浙江省美丽乡村特色精品村.json')
          ]).then((results) => {
            const path = selectVal.value.split('/')
            const fullPath = [CITY, COUNTY, TOWN, VILLAGE].map((v, idx) => v ?? path[idx])
            const queryPath = fullPath.slice(1)
            rightPanelContent.value = {
              fullPath,
              图片: get(results[0], queryPath, []),
              未来乡村: get(results[1], queryPath, []),
              小集镇式中心村: get(results[2], queryPath, []),
              梳理式改造村: get(results[3], queryPath, []),
              浙江省美丽乡村特色精品村: get(results[4], queryPath, [])
            }
          })
        }
        if (LEVEL === 'city') {
          selectVal.value = selectAreaVal.value ? selectAreaVal.value : '宁波市'
          selectCode.value = [selectAreaVal.value ? selectAreaVal.value : '宁波市']
          return
        }
        if (LEVEL === 'town') {
          selectVal.value = selectAreaVal.value ? COUNTY + '/' + TOWN : '宁波市/' + COUNTY + '/' + TOWN
          selectCode.value = selectAreaVal.value ? [val.COUNTY, val.TOWN] : ['宁波市', val.COUNTY, val.TOWN]
          return
        }
        if (LEVEL === 'county') {
          selectVal.value = selectAreaVal.value ? COUNTY : '宁波市/' + COUNTY
          selectCode.value = selectAreaVal.value ? [val.COUNTY] : ['宁波市', val.COUNTY]
          return
        }
      }
    }
    // todo lsq-优化待补充的欠缺的
    else if (obj.data.key == 'pointInfo') {
      // 单击打产业基地图标
      const val = obj.data.value.pointInfo
      // changeTab(2, industryData.value) // 高亮产业基地tab
      if (val.type === 'JPX') {
        // lsq-do lsq-精品点击出现的
        for (let item of lineIntroduce) {
          if (item.name.indexOf(val.NAME) != -1) {
            // selectInfo.value = {
            //   TYPE: 'JPX',
            //   NAME: item.name,
            //   最佳观光季节: item.season,
            //   线路安排: item.line,
            //   主要特色: item.special,
            //   农副特产: item.goods,
            //   特色小吃: item.eat,
            //   农事节庆活动: item.event,
            //   预定咨询电话: item.phone,
            //   介绍: item.introduce,
            //   二维码: val.url ? val.url : ''
            // }
            // images.value = item.imageList
            break
          }
        }
        return
      } else if (val.TYPE == 'SHUI') {
        val.type = 3
        shuiProduct.forEach((shuiProductItem) => {
          if (shuiProductItem.name == val.养殖主体) val.二维码 = shuiProductItem.url
        })
      } else if (val.TYPE == 'SHU') {
        val.type = 2
        // val.address = `${val.COUNTY}${val.TOWN}${val.VILLAGE}`
      } else if (val.TYPE == 'XM') {
        val.type = 1
      } else if (val.TYPE == 'SXT') {
        STXVideoList.forEach((item) => {
          if (item.name == val.NAME) {
            // lsq-do
            // if (item.type == 'inSide') {
            //   // 两种展示形式一种是新开页面 一种是弹窗内嵌
            //   isShowSxt.value = true
            //   selectVideo.value = item.src
            // } else {
            //   window.open(item.src)
            // }
          }
        })
      } else if (val.type === 'JPC') {
        const { NAME, TOWN, COUNTY } = val
        const address = '' + COUNTY + TOWN + NAME // 地址拼接
        for (let item of villageIntroduce) {
          if (item.name.indexOf(address) != -1) {
            // lsq-do
            // selectInfo.value = {
            //   TYPE: 'JPC',
            //   NAME: item.name,
            //   INTRODUCE: item.introduce
            // }
            // images.value = item.imageList
            break
          }
        }
        return
      } else if (val.type === 'NZFB') {
        // 农资分布
        val.TYPE = 'NZFB'
      } else if (val.type === 'XCWL') {
        // 乡村物流
        val.TYPE = 'XCWL'
      }
      if (val.TYPE != 'SXT') {
        // lsq-do
        // selectInfo.value = val
      }
      // console.log(val, 'val', selectInfo.value)
    } else if (obj.data.key == 'pointInfo1') {
      // 暂时这么写 手动调整的pointInfo1
      const val = obj.data.value.pointInfo
      if (val.TYPE == 'SXT') {
        window.open('http://211.91.60.222:81/dispatch.asp?user=admin&pass=NBtt123456#&page=preview.asp')
      }
    }
  }
}
// 农村的地图不会自动读取需要手动更改地区
const onMapLoaded = () => {
  mapInit.value = false
  const regionPath = selectVal.value.split('/')
  const message = { key: 'changeAreaByName', value: { name: regionPath[regionPath.length - 1] } }
  sendMessage(message)
  nextTick(() => {
    mapInit.value = true
  })
  return
}
// 给iframe发送信息
const sendMessage = (e) => {
  if (e.key === 'changeLayerByOption') {
    if (activeLayerCategoryTab.value === '基础图层') {
      e.value.option.obj.产业基地规划面 = cloneDeep(additionalControlsComponentRef.value?.otherParams.产业基地规划面 || [])
    }
    if (JSON.stringify(e.value.option.obj) === JSON.stringify(changeLayerByOptionMessageObj.value)) {
      return
    }
    changeLayerByOptionMessageObj.value = e.value.option.obj
  }
  console.log('iframe事件：', e.key)
  let iframe = document.getElementById('gisIframe')
  iframe &&
    iframe.contentWindow.postMessage(
      {
        type: 'gisLayerMessage',
        data: e
      },
      '*'
    )
}
// 粮仓跳转地图
const linkToArea = ({ selectValValue, selectCodeValue, sendMessageInfo }) => {
  selectVal.value = selectValValue
  selectCode.value = selectCodeValue
  if (sendMessageInfo) {
    sendMessage(sendMessageInfo)
  }
}
// 左侧顶部类型切换 基础图层、专题图层
const activeLayerCategoryTabChange = (v) => {
  activeLayerCategoryTab.value = v
}
// 专题图层的总布局切换
const overallPlanChange = (v) => {
  isOverallPlan.value = v
}
</script>
<style lang="scss" scoped>
.index {
  $top-align: 118px;
  $bottom-padding: 24px;
  position: relative;
  .area-select {
    position: absolute;
    top: 105px;
    left: 40px;
    width: 346px;
    z-index: 1000;
  }
  :deep(.search-btn) {
    position: absolute;
    z-index: 1000;
    left: 393px;
    top: 100px;
    width: 60.1px;
    height: 48px;
  }
  :deep() {
    // 地图工具箱
    .home__map-toolkit {
      position: absolute;
      bottom: $bottom-padding;
      left: 400px;
    }
    .home__map-toolkit-coordinates {
      position: absolute;
      top: 103px;
      left: 486px;
      padding: 8px 12px;
      font-size: 16px;
      font-weight: 400;
      color: #ffffff;
      line-height: 26px;
      border: 1px solid #2ca2fc;
      border-radius: 4px;
      background: #004da880;
    }
  }
  .gisIframe-box {
    margin-left: 560px;
    margin-top: 159px;
  }
  .side-bar {
    top: $top-align;
    transition: all 0.8s ease-out;
    &--left {
      left: 40px;
      height: 938px;
      :deep() {
        .side-bar__wrapper {
          display: flex;
          flex-direction: column;
        }
      }
    }
    &--right {
      right: 40px;
      height: 938px;
    }
  }
}
</style>
