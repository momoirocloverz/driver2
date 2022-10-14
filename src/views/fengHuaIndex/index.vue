<!-- 奉化区农业农村一张图（用于紧急展示 与宁波一张图功能基本一致 只是切到了奉化区层级） -->
<template>
  <div :class="['index',  '' ]">
    <div v-if="mapInit">
      <side-bar @sendMessage="sendMessage" :class="[leftSideBarType? '':'hide-side-bar','']" position="left">
        <module-select @setTab="changeTab" @sendMessage="sendMessage" />
      </side-bar>
      <side-bar :class="[rightSideBarType? '':'hide-side-bar','']"  position="right">
        <div class="tabs">
          <div class="tab-item" :class="{active: activeIndex == 1}" @click="changeTab(1)">粮功区</div>
          <div class="tab-item" :class="{active: activeIndex == 2}" @click="changeTab(2)">产业基地</div>
        </div>
        <div class="panel panel-1" v-show="activeIndex == 1">
          <module-title title="统计分析" position="right" />
          <statistics :areaList="areaList" :areaListFarm="areaListFarm" :selectVal="selectVal" />
          <non-agricultural :areaList="areaList" :areaListFarm="areaListFarm" :selectVal="selectVal" :cleanList="cleanList" :flhArea="flhArea" />
        </div>
        <div class="panel panel-2" v-show="activeIndex == 2">
          <template  v-if="selectInfo">
            <div class="content-list" v-if="selectInfo">
              <module-title :title="baseTitleMap[1]" position="right" v-if="selectInfo.type == 1">
                <template #icon>
                  <img :src="require('@/components/moduleTitle/image/husbandry_icon.png')" />
                </template>
              </module-title>
              <module-title :title="baseTitleMap[2]" position="right" v-if="selectInfo.type == 2">
                <template #icon>
                  <img :src="require('@/components/moduleTitle/image/vegetable_icon.png')" />
                </template>
              </module-title>
              <module-title :title="baseTitleMap[3]" position="right" v-if="selectInfo.type == 3">
                <template #icon>
                  <img :src="require('@/components/moduleTitle/image/aquatic_icon.png')" />
                </template>
              </module-title>
              <div class="list">
                <template v-for="item in rightList" :key="item.key">
                  <div class="line">
                    <div class="name">{{item.key}}</div>
                    <div class="value">{{selectInfo[item.dataIndex]||'-'}}</div>
                  </div>
                </template>
              </div>
            </div>
          </template>
          <!-- 奉化区默认开启查看产业基地详情 -->
            <div class="empty-holder" v-if="!selectInfo">
              <module-title title="产业基地详情" position="right" />
              <img :src="require('@/assets/image/empty.png')">
              <div>请到某个镇街中选中基地，查看详情。</div>
            </div>
            <!-- 奉化区版本不展示简介 -->
          <div class="basic-info" v-if="false">
            <module-title title="简介" position="right" />
            <div class="text">
              产业兴旺是解决农村一切问题的前提，要
              推动乡村产业振兴，紧紧围绕发展现代农
              业，围绕农村一二三产业融合发展，构建
              乡村产业体系。
            </div>
            <template v-for="item in boardData" :key="item.title">
              <div class="board">
                <div class="title">{{item.title}}</div>
                <div style="display: flex;align-items: baseline;">
                  <div class="number">{{item.number}}</div>
                  <div class="suffix">{{item.suffix}}</div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </side-bar>
      <div :class="[leftSideBarType? 'handle-left-btn':'hide-handle-left-btn','handle-left-btn']"  @click="leftSideBarType = !leftSideBarType">
        <p>{{leftSideBarType?"收起":"展开"}}</p>
        <img
          :style="{ transform: 'rotate(' + (leftSideBarType ? 90 : -90) + 'deg)',  }"
          :src="require('./image/arrow_icon.png')"
          alt=""
        />
      </div>
      <div :class="[rightSideBarType? 'handle-right-btn':'hide-handle-right-btn','handle-right-btn']" @click="rightSideBarType = !rightSideBarType">
        <p>{{rightSideBarType?"收起":"展开"}}</p>
        <img
          :style="{ transform: 'rotate(' + (rightSideBarType ? -90 : 90) + 'deg)',  }"
          :src="require('./image/arrow_icon.png')"
          alt=""
        />
      </div>
      <map-status  @sendMessage="sendMessage" />
      <area-select @sendMessage="sendMessage" v-model:selectVal="selectVal" :selectCode="selectCode"/>
       <!-- 奉化区版本暂无搜索按钮 -->
      <!-- <img class="search-btn"  @click="searcnPopupVisible = true" :src="require('./image/search-icon.png')" alt=""> -->
      <div class="dialog-btn" @click="visible2 = true">
        区域分布
        <img :src="require('./image/icon_arrow_db.png')" alt="" />
      </div>
      <div class="dialog-btn secondBtn" @click="visible = true">
        三调分析
        <img :src="require('./image/icon_arrow_db.png')" alt="" />
      </div>
      <div class="dialog-btn thirdBtn" @click="visible3 = true">
        整治进展
        <img :src="require('./image/icon_arrow_db.png')" alt="" />
      </div>
    </div>

    <iframe id="gisIframe" src="/NBJSC_SE/NBJSC12_5.html" frameborder="0" width="100%" height="100%" />
    <custom-dialog v-model:visible="searcnPopupVisible" :width="840" top="5vh" title="粮功区搜索">
      <SearchPopup @setSelectVal="setSelectVal" />
    </custom-dialog>

    <custom-dialog v-model:visible="visible" :width="840" top="5vh" title="三调分析">
      <second-title title="地类占比" />
      <city-bar :selectVal="selectVal" />
      <city-pie :selectVal="selectVal" @select="selectType"/>
      <county-pie :selectVal="selectVal" :landType="landType"/>
    </custom-dialog>

    <custom-dialog v-model:visible="visible2" :width="840" top="5vh" title="区域分布">
      <second-title title="粮功区分析" />
      <county-chart v-model:areaName="areaName"  :selectVal="selectVal" :cityArea="cityArea" />
      <second-title title="面积占比" />
      <area-chart :areaName="areaName"  :cityArea="cityArea" />
<!--      <second-title title="个数占比" />-->
<!--      <num-chart :areaName="areaName"/>-->
      <second-title title="高标准农田分析" v-if="selectVal?.length === 2" />
      <gbznt-chart :cityArea="cityArea" v-if="selectVal?.length === 2" />
    </custom-dialog>

    <custom-dialog v-model:visible="visible3" :width="775" top="5vh" title="整治进展">
      <second-title title="非粮化分析" />
      <non-grain-chart :chartsWidth="(!isShowOptimizeEcharts&&!isShowClearEcharts)||(selectVal||'').split('/').length>2?'420px':'240px'" :selectVal="selectVal"></non-grain-chart>
      <br>
      <br>
      <second-title  v-if="(isShowOptimizeEcharts||isShowClearEcharts)&&(selectVal||'').split('/').length<=2"  :title="subTitle" />
      <div class="double-chart" v-if="(isShowOptimizeEcharts||isShowClearEcharts)&&(selectVal||'').split('/').length<=2">
        <optimize-chart v-if="isShowOptimizeEcharts&&(selectVal||'').split('/').length<=2" :selectVal="selectVal"></optimize-chart>
        <clean-chart v-if="isShowClearEcharts&&(selectVal||'').split('/').length<=2" :selectVal="selectVal"></clean-chart>
      </div>
        <img v-if="isShowOptimizeEcharts&&isShowClearEcharts&&(selectVal||'').split('/').length<=2" class="arrow" style="left: 20px;" :src="require('@/assets/image/left_arrow.png')" @click="toggle(1)">
        <img v-if="isShowOptimizeEcharts&&isShowClearEcharts&&(selectVal||'').split('/').length<=2" class="arrow" style="right: 20px;" :src="require('@/assets/image/right_arrow.png')" @click="toggle(2)">
    </custom-dialog>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref, watch, computed } from 'vue'
import sideBar from '@/components/sideBar'
import moduleTitle from '@/components/moduleTitle'
import statistics from './modules/statistics'
import nonAgricultural from './modules/nonAgricultural'
import moduleSelect from './modules/moduleSelect'
import mapStatus from './modules/mapStatus'
import areaSelect from './modules/areaSelect'
import areaTown from '@/assets/js/areaTown.json'
import ribbon from '@/assets/js/ribbon.json'
import customDialog from '@/components/customDialog'
import cityPie from './modal/cityPie'
import cityBar from './modal/cityBar'
import gbzntChart from './modal/gbzntChart'
import secondTitle from '@/components/secondTitle'
import SearchPopup from '@/components/SearchPopup'
import countyPie from './modal/countyPie'
import countyChart from './modal/countyChart'
import areaChart from './modal/areaChart.vue'
import nonGrainChart from './modal/nonGrainChart.vue'
import optimizeChart from './modal/optimizeChart.vue'
import cleanChart from './modal/cleanChart.vue'
import cleanData from '@/assets/js/cleanData.json'
import compensateData from '@/assets/js/compensateData.json'
import anime from 'animejs'
import qyfbData from '@/assets/js/qyfbData.json'
import flhData from '@/assets/js/flhData.json'
import clearData from "@/assets/js/clearData.json";
import optimizeData from "@/assets/js/optimizeData.json";
import {husbandryList, vegetableList, aquaticList, boardData, baseTitleMap} from './modal/const'

export default defineComponent({
  name: 'index',
  components: {
    sideBar,
    moduleTitle,
    statistics,
    nonAgricultural,
    moduleSelect,
    mapStatus,
    areaSelect,
    customDialog,
    cityPie,
    cityBar,
    secondTitle,
    SearchPopup,
    countyPie,
    countyChart,
    nonGrainChart,
    optimizeChart,
    gbzntChart,
    cleanChart,
    areaChart
  },
  setup() {
    const cityArea = reactive({
      name: [],
      lgq: [],
      gbznt: [],
    }) // 区域分布
    const flhArea = ref({}) // 非粮化数据
    const mapInit = ref(false);
    const visible = ref(false);
    const visible2 = ref(false);
    const isShowClearEcharts = ref(true);
    const isShowOptimizeEcharts = ref(true);
    const searcnPopupVisible = ref(false);
    const visible3 = ref(false);
    const areaName  = ref('');
    const selectVal = ref('奉化区') // 选择的地区
    const selectCode = ref([]);
    const countyArea = ['海曙区', '江北区', '北仑区', '镇海区', '鄞州区', '奉化区', '象山县', '宁海县', '余姚市', '慈溪市']
    const cleanList = reactive({
      cleanVal: 0,
      compensateVal: 0,
      isShow: false
    })
    // 监听地图交互事件
    const areaList = ref([
      { name: '农业用地', value: 0 },
      { name: '农村道路', value: 0 },
      { name: '河流水面', value: 0 },
      { name: '公路用地', value: 0 },
      { name: '农村宅基地', value: 0 },
      { name: '工业用地', value: 0 },
      { name: '其他(非农业用地)', value: 0 },
    ])
    const landType = ref('耕地');
    const areaListFarm = ref([
      { name: '耕地', value: 0 },
      { name: '园地', value: 0 },
      { name: '林地', value: 0 },
      { name: '其他(农业用地)', value: 0 },
    ])
    const rightSideBarType = ref(true);//展示左侧sizeBar
    const leftSideBarType = ref(true);//展示右侧sizeBar
    const currentType = ref(1)
    const subTitle = computed(() => currentType.value == 1 ? '优化补入分析' : '清理腾退分析')
    const activeIndex = ref(1)
    const selectInfo = ref(null); // 选中的产业基地点位数据
    const rightList = computed(() => {
      switch(selectInfo.value.type) {
        case 1:
          return husbandryList;
        case 2:
          return vegetableList;
        case 3:
          return aquaticList;
        default:
          return []
      }
    })

    const receiveMsg = (e) => {
      let obj = e.data;
      if (obj.type === 'gisMapMessage' && obj.data.value.initType) {
        mapInit.value = true
      }
      // 双击地图默认选中当前区域
      if (obj.type === 'gisLayerMessage') {
        // console.log('obj',obj);
        if (obj.data.key == 'areaInfo') {
          // 单击或双击地图操作
          let val = obj.data.value.areaInfo;
          if (val.hasOwnProperty('GHMC')) {
            // 双击粮功区
            selectVal.value =  val.COUNTY + '/' + val.TOWN + '/' + val.GHMC
            selectCode.value = [ val.COUNTY, val.TOWN, val.GHMC];
          } else {
            // 地图下钻
            const {COUNTY,TOWN} = val
            // console.log('COUNTY,TOWN',COUNTY,TOWN);
            if (COUNTY && TOWN) {
              selectVal.value =  COUNTY + '/' + TOWN
              selectCode.value = [ val.COUNTY, val.TOWN,];
              return
            }
            if (COUNTY) {
              selectVal.value = COUNTY
              selectCode.value = [val.COUNTY,];
              return
            }
          }
        } else if (obj.data.key == 'pointInfo') {
          // 单击打产业基地图标
          const val = obj.data.value.pointInfo;
          console.log('点击图标', val);
          activeIndex.value == 2 // 高亮产业基地tab
          changeTab(2) // 高亮产业基地tab
          if (val.TYPE == 'SHUI') {
            val.type = 3
          } else if (val.TYPE == 'SHU') {
            val.type = 2
            // val.address = `${val.COUNTY}${val.TOWN}${val.VILLAGE}`
          } else if (val.TYPE == 'XM') {
            val.type = 1
          }
          // console.log('val', val);
          selectInfo.value = val
        }
      }
    }
    // 向子页面传递消息
    const sendMessage = (e) => {
      // console.log('sendMessage', e);
      let iframe = document.getElementById('gisIframe')
      iframe.contentWindow.postMessage({
        type: 'gisLayerMessage',
        data: e
      },'*')
    }
    const setSelectVal=(val)=>{
      selectVal.value =  val.COUNTY + '/' + val.TOWN + '/' + val.GHMC
      selectCode.value = [val.COUNTY, val.TOWN, val.GHMC];
      sendMessage({
        key: 'changeAreaByName',
        value: { name: val.GHMC }
      })
      searcnPopupVisible.value=false //关闭弹窗
    }
    const onReset = () => {
      areaList.value.map(item => {
        item.value = 0
      })
      areaListFarm.value.map(item => {
        item.value = 0
      })
      cleanList.cleanVal = 0
      cleanList.compensateVal = 0
      cleanList.isShow = true
    }
    const getAreaInfo = (val) => {
      onReset()
      const areaArr = val.split('/');
      if (val === '宁波市' || val === '宁波市/宁波市') { // 选择市本级
        cleanData.map(item => {
          cleanList.cleanVal += +item.area
        })
        compensateData.map(item => {
          cleanList.compensateVal += +item.area
        })

        areaTown.map(item => {
          areaList.value.map(key => {
            if (item.DKLX === key.name) {
              key.value += +item.AREA
            }
          })
          areaListFarm.value.map(key => {
            if (item.DKLX === key.name) {
              key.value += +item.AREA
            }
          });
        })
      } else if (countyArea.includes(areaArr[areaArr.length - 1])) { // 选择到区
        cleanData.map(item => {
          if (item.county === areaArr[areaArr.length - 1]) cleanList.cleanVal += +item.area
        })
        compensateData.map(item => {
          if (item.county === areaArr[areaArr.length - 1]) cleanList.compensateVal += +item.area
        })
        areaTown.map(item => {
          areaList.value.map(key => {
            if (item.COUNTY === areaArr[areaArr.length - 1] && item.DKLX === key.name) {
              key.value += +item.AREA
            }
          })
          areaListFarm.value.map(key => {
            if (item.COUNTY === areaArr[areaArr.length - 1] && item.DKLX === key.name) {
              key.value += +item.AREA
            }
          })
        })
      } else if (areaArr.length === 4 ) { // 选择到 粮食功能区
        cleanList.isShow = false // 粮食功能区不展示 清理腾退数据
        if(areaArr[2] === areaArr[3]) {
          areaTown.map(item => {
            areaList.value.map(key => {
              if (item.TOWN === areaArr[areaArr.length - 1] && item.DKLX === key.name) {
                key.value += +item.AREA
              }
            })
            areaListFarm.value.map(key => {
              if (item.TOWN === areaArr[areaArr.length - 1] && item.DKLX === key.name) {
                key.value += +item.AREA
              }
            })
          })
        } else {
          ribbon.map(item => {
            areaList.value.map(key => {
              if (item.GHMC === areaArr[areaArr.length - 1] && item.DKLX === key.name) {
                key.value += +item.AREA
              }
            })
            areaListFarm.value.map(key => {
              if (item.GHMC === areaArr[areaArr.length - 1] && item.DKLX === key.name) {
                key.value += +item.AREA
              }
            })
          })
        }
      } else { // 选择到镇
        areaTown.map(item => {
          cleanData.map(item => {
            if (item.town === areaArr[areaArr.length - 1]) cleanList.cleanVal = +item.area
          })
          compensateData.map(item => {
            if (item.town === areaArr[areaArr.length - 1]) cleanList.compensateVal = +item.area
          })
          areaList.value.map(key => {
            if (item.TOWN === areaArr[areaArr.length - 1] && item.DKLX === key.name) {
              key.value = +item.AREA
            }
          })
          areaListFarm.value.map(key => {
            if (item.TOWN === areaArr[areaArr.length - 1] && item.DKLX === key.name) {
              key.value = +item.AREA
            }
          })
        })
      }
    }

    const selectType = (e) => {
      // console.log('e',e);
      landType.value = e;
    }

    const toggle = (type) => {
      currentType.value = type
      if (type == 1) {
        anime({
          targets: '.optimize-pie',
          translateX: '0',
          easing: 'easeInOutSine'
        });
        anime({
          targets: '.clean-pie',
          translateX: '0',
          easing: 'easeInOutSine'
        });
      }
      if (type == 2) {
         anime({
          targets: '.optimize-pie',
          translateX: '-100%',
          easing: 'easeInOutSine'
        });
        anime({
          targets: '.clean-pie',
          translateX: '-100%',
          easing: 'easeInOutSine'
        });
      }
    }

    const getCityArea = (val) => {
      cityArea.name = []
      cityArea.lgq = []
      cityArea.gbznt = []
      const areaArr = val.split('/')
      //  if (val === '宁波市' || val === '宁波市/宁波市') { // 市级(奉化区版本不需要宁波市)
      //   qyfbData.map(item => {
      //     if (item.city === '宁波市') {
      //       cityArea.name.push(item.name)
      //       cityArea.lgq.push((+item.lgqmj)?.toFixed(1))
      //       cityArea.gbznt.push((+item.gbzntmj)?.toFixed(1))
      //     }
      //   })
      // } else
      if (areaArr.length === 1) {
        qyfbData.map(item => {
          if (item.city === areaArr[0]) {
            cityArea.name.push(item.name)
            cityArea.lgq.push((+item.lgqmj).toFixed(1))
          }
        })
      } else if (areaArr.length === 2 || areaArr.length === 3) {
        qyfbData.map(item => {
          if (item.city === areaArr[1]) {
            cityArea.name.push(item.name)
            cityArea.lgq.push((+item.lgqmj).toFixed(1))
          }
        })
      }
    }

    const getFLHData = (val) => {
      const areaArr = val.split('/')
      if (areaArr.length === 4) {
        areaArr.pop()
      }
      flhArea.value = {}
      flhData.map(item => {
        if (item.name === areaArr[areaArr.length - 1]) {
          flhArea.value = item
        }
      })
    }

    // 右侧tab切换
    const changeTab = (type) => {
      activeIndex.value = type
    }
    const isShowThreeCharts = (val) => {
      const targetArea = val.split("/").pop();
      const clearDataResult = clearData.filter((v) => v.bCity == targetArea);
      const optimizeDataResult = optimizeData.filter((v) => v.bCity == targetArea);
      if (!clearDataResult.length) {
        isShowClearEcharts.value = false
      } else {
        isShowClearEcharts.value = true
        currentType.value = 2
      }//没数据不展示
      if (!optimizeDataResult.length) {
        isShowOptimizeEcharts.value = false
      } else {
        isShowOptimizeEcharts.value = true
        currentType.value = 1
      }//没数据不展示
    }

    // 获取统计信息
    watch(() => selectVal.value, val => {
      console.log(val,'val')
      getAreaInfo(val)
      getCityArea(val)
      getFLHData(val)
      // if (selectVal.value.split('/').length == 1) {
        // 非乡镇街道层级不展示右侧产业基地详情
        selectInfo.value = null
      // }
      isShowThreeCharts(val)
    }, { immediate: true })



    onMounted(() => {
      window.addEventListener('message', receiveMsg, false);
    })

    return {
      mapInit,
      sendMessage,
      selectVal,
      areaList,
      areaListFarm,
      visible,
      visible2,
      searcnPopupVisible,
      visible3,
      rightSideBarType,
      leftSideBarType,
      selectType,
      landType,
      areaName,
      selectCode,
      cleanList,
      toggle,
      subTitle,
      cityArea,
      flhArea,
      setSelectVal,
      changeTab,
      activeIndex,
      husbandryList,
      vegetableList,
      aquaticList,
      boardData,
      selectInfo,
      baseTitleMap,
      rightList,
      isShowClearEcharts,
      isShowOptimizeEcharts
    }
  }
})
</script>

<style scoped lang="scss">
  .index {
    position: relative;
    .side-bar {
      top: 118px;
      left: 40px;
      transition: all .8s;
      &:nth-of-type(2) {
        left: auto;
        right: 40px;
      }
      &:nth-of-type(1) {
        height: 938px;
      }
    }

    .tabs {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      position: relative;
      z-index: 1000;

      .tab-item {
        width: 84px;
        height: 29px;
        border-radius: 0px 0px 0px 0px;
        color: rgba(255,255,255,.5);
        background-image: url("~@/assets/image/tab_bg.png");
        background-size: 100% 100%;
        line-height: 29px;
        text-align: center;
        cursor: pointer;

        &.active {
          color: #fff;
          background-image: url("~@/assets/image/tab_bg_active.png");
          background-size: 100% 100%;
        }
      }
    }

    .panel {
      .empty-holder {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        color: #fff;
        font-size: 16px;
        img {
          width: 54px;
          height: 54px;
          margin-top: 80px;
          margin-bottom: 24px;
        }
      }

      .list {
        padding-top: 24px;
        .line {
          display: flex;
          align-items: flex-start;
          margin-bottom: 20px;
        }
        .name {
          flex-shrink: 0;
          width: 112px;
          white-space: normal;
          word-break: break-all;
          font-size: 16px;
          color: #6CD0FF;
          line-height: 28px;
          -webkit-background-clip: text;
          margin-right: 16px;
        }
        .value {
          color: #fff;
          font-size: 16px;
          line-height: 28px;
          white-space: normal;
          word-break: break-all;
          user-select:text;//增加文本可复制
        }
      }

      .basic-info {
        .text {
          margin: 24px 0;
          font-size: 16px;
          color: #FFFFFF;
          line-height: 28px;
          -webkit-background-clip: text;
        }
        .board {
          // height: 77px;
          background: url('~@/assets/image/board_bg.png') no-repeat;
          background-size: 100% 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 12px 0 12px 32px;
          margin-bottom: 16px;

          &:last-child {
            margin-bottom: 0;
          }

          .title{
            font-size: 14px;
            font-weight: 400;
            color: #FFFFFF;
            -webkit-background-clip: text;
            margin-bottom: 4px;
          }
          .number {
            font-size: 26px;
            font-family: DIN Alternate-Bold, DIN Alternate;
            font-weight: bold;
            color: #27E0FD;
            line-height: 38px;
            -webkit-background-clip: text;
            margin-right: 2px;
          }
          .suffix{
            font-size: 12px;
          }
        }
      }
    }

    .hide-side-bar {
      top: 130px;
      left: -500px;
      &:nth-of-type(2) {
        left: auto;
        right: -500px;
      }

  }
    .map-status {
      position: absolute;
      right: 40px;
      top: 980px;
    }
    .hide-handle-left-btn {
      display: flex;
      width: 30px;
      height: 80px;
      flex-direction: column;
      position: absolute;
      top: 50%;
      left: 0px !important;
      z-index: 1000;
      display: flex;
      align-items: center;
      background: url("./image/hide-sidebar-btn.png") ;
      background-size: 100%;
      p {
        margin:10px 10px 8px 10px;
        line-height: 20px;
        font-family: Microsoft YaHei-Regular;
      }
    }
    .handle-left-btn {
      display: flex;
      width: 30px;
      height: 80px;
      flex-direction: column;
      position: absolute;
      top: 50%;
      left: 385px;
      z-index: 1000;
      display: flex;
      align-items: center;
      background: url("./image/hide-sidebar-btn.png") ;
      background-size: 100%;
      transition: all .7s;
      p {
        margin:10px 10px 8px 10px;
        line-height: 20px;
        font-family: Microsoft YaHei-Regular;
      }
    }
    .hide-handle-right-btn {
      display: flex;
      width: 30px;
      height: 80px;
      flex-direction: column;
      position: absolute;
      top: 50%;
      right: 0px !important;
      z-index: 1000;
      display: flex;
      align-items: center;
      background: url("./image/hide-sidebar-btn.png") ;
      background-size: 100%;
      p {
        margin:10px 10px 8px 10px;
        line-height: 20px;
        font-family: Microsoft YaHei-Regular;
      }
    }
    .handle-right-btn {
      display: flex;
      width: 30px;
      height: 80px;
      flex-direction: column;
      position: absolute;
      top: 50%;
      right: 383px;
      z-index: 1000;
      display: flex;
      align-items: center;
      background: url("./image/hide--right-sidebar-btn.png") ;
      background-size: 100%;
      transition: all .7s;
      p {
        margin:10px 10px 8px 10px;
        line-height: 20px;
        font-family: Microsoft YaHei-Regular;
      }
    }
    .search-btn{
      position: absolute;
      z-index: 1000;
      left: 393px;
      top: 67px;
      width: 60.1px;
      height: 48px;
    }

    .dialog-btn {
      position: absolute;
      z-index: 1000;
      cursor: pointer;
      background: url('image/percent_btn_bg.png') no-repeat;
      background-size: 100% 100%;
      right: 274px;
      top: 70px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 116px;
      height: 46px;
      img {
        width: 10px;
        height: 20px;
        margin-left: 6px;
      }
    }
    .secondBtn {
      right: 154px;
    }
    .thirdBtn {
      right: 34px;
    }

    .area-select {
      position: absolute;
      top: 70px;
      left: 40px;
      width: 346px;
      z-index: 1000;
    }

  }
  .double-chart {
    width: 100%;
    height: 300px;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    // display: flex;
  }
      .arrow {
        width: 60px;
        height: 60px;
        position: absolute;
        bottom: 20%;
        // margin-bottom: -30px;
        cursor: pointer;
      }

</style>
