<!-- 宁波农业农村一张图 -->
<template>
  <div :class="['index', '']">
    <div v-if="mapInit">
      <side-bar class="side-bar--left" style="height: 901px; top: 156px" position="left">
        <module-select
          ref="layerPickerRef"
          @getVillageLayers="getVillageLayers"
          @setTab="changeTab"
          @getThematicLayerData="getThematicLayerData"
          @onTabChange="onTabChange"
          @sendMessage="sendMessage"
          @checkBoxChange="checkBoxChange"
          @getTravelSelectData="getTravelSelectData"
        />
      </side-bar>
      <side-bar class="side-bar--right" position="right">
        <template v-if="layerPickerRef?.activeModule === '农民-农村' && !isShowFenghuaTarvelRight">
          <VillageDetails v-if="!villageLayersList.filter((item) => ['集体三资', '乡村物流', '农资分布', '乡村振兴学院'].includes(item)).length" :content="rightPanelContent" />
          <CollectiveCapital v-if="villageLayersList.includes('集体三资')" />
          <!-- 乡村振兴学院右侧 -->
          <CollegeIntroduceDetail :selectVal="selectInfo.NAME" v-if="villageLayersList.includes('乡村振兴学院') && selectInfo" />
          <div class="panel panel-2" v-show="activeIndex == 2 || villageLayersList.filter((item) => ['乡村物流', '农资分布', '乡村振兴学院'].includes(item)).length">
            <template v-if="selectInfo">
              <div class="content-list" v-if="selectInfo">
                <template v-if="selectInfo">
                  <module-title :title="baseTitleMap['NZFB']" position="right" v-if="selectInfo.TYPE == 'NZFB'">
                    <template #icon>
                      <img :src="require('@/components/moduleTitle/image/ruralResources-icon.png')" />
                    </template>
                  </module-title>
                  <module-title :title="baseTitleMap['XCWL']" position="right" v-if="selectInfo.TYPE == 'XCWL'">
                    <template #icon>
                      <img :src="require('@/components/moduleTitle/image/urbanLogistics-icon.png')" />
                    </template>
                  </module-title>
                  <div class="list">
                    <div class="vd__images-container" v-if="images.length > 0">
                      <el-carousel trigger="click" class="vd__images" height="160px" indicator-position="none" arrow="never" ref="carouselRef">
                        <el-carousel-item v-for="(item, index) in images" :key="index">
                          <el-image :src="item.url" fit="cover" :preview-src-list="[item.url]" preview-teleported>
                            <template #error>
                              <el-image :src="NoImage" fit="cover" />
                            </template>
                          </el-image>
                        </el-carousel-item>
                      </el-carousel>
                      <img :src="CarouselArrow" class="vd__images-arrow--left" @click="carouselRef?.prev" alt="prev" />
                      <img :src="CarouselArrow" class="vd__images-arrow--right" @click="carouselRef?.next" alt="next" />
                    </div>

                    <template v-for="item in rightList" :key="item.key">
                      <div class="line">
                        <el-image
                          v-if="item.key == '二维码'"
                          style="width: 140px; height: 140px; margin: auto; margin-top: 30px"
                          :src="selectInfo[item.dataIndex]"
                          fit="cover"
                          :preview-src-list="[selectInfo[item.dataIndex]]"
                          preview-teleported
                        >
                          <template #error>
                            <el-image :src="NoImage" fit="cover" />
                          </template>
                        </el-image>
                        <template v-else>
                          <div class="name">{{ item.key }}</div>
                          <div class="value">{{ selectInfo[item.dataIndex] || '-' }}</div>
                        </template>
                      </div>
                    </template>
                  </div>
                </template>
              </div>
            </template>
            <div class="empty-holder" v-if="villageLayersList.filter((item) => ['乡村物流', '农资分布', '乡村振兴学院'].includes(item)).length && !selectInfo">
              <module-title title="统计分析" position="right" />
              <img :src="require('@/assets/image/empty.png')" />
              <div>{{ getBaseText(villageLayersList[0]) }}</div>
            </div>
          </div>
          <!-- </div> -->
          <!-- <div v-if="layerPickerRef?.activeModule !== '农民-农村'&& !industryData"> -->
        </template>
        <template v-if="layerPickerRef?.activeModule !== '农民-农村' && !['粮食', '水果'].includes(industryData)">
          <!-- <div class="tabs" v-if="selectInfo || !['蔬菜'].includes(industryData) || (selectVal||'').split('/').length>1">
            <div class="tab-item"  :class="{active: activeIndex == 1}" @click="changeTab(1)">粮功区</div>
            <div class="tab-item" :class="{active: activeIndex == 2}" @click="changeTab(2)">产业基地</div>
          </div> -->
          <div class="panel panel-1" v-show="activeIndex == 1 && activeLayerCategoryTab == '基础图层'">
            <module-title title="统计分析" position="right" />
            <statistics :areaList="areaList" :areaListFarm="areaListFarm" :selectVal="selectVal" :selectList="state.selectList" />
            <non-agricultural :areaList="areaList" :areaListFarm="areaListFarm" :selectVal="selectVal" :cleanList="cleanList" :flhArea="flhArea" />
          </div>
          <div class="panel panel-2" v-show="activeIndex == 2 && layerPickerRef?.activeModule !== '精品'">
            <template v-if="selectInfo">
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
                <module-title :title="baseTitleMap['CCY']" position="right" v-if="selectInfo.TYPE == 'CCY'">
                  <template #icon>
                    <img :src="require('@/components/moduleTitle/image/tea-icon.png')" />
                  </template>
                </module-title>
                <module-title :title="baseTitleMap['NJL']" position="right" v-if="selectInfo.TYPE == 'NJL'">
                  <template #icon>
                    <img :src="require('@/components/moduleTitle/image/agritainment-icon.png')" />
                  </template>
                </module-title>
                <module-title :title="baseTitleMap['JGLTQY']" position="right" v-if="selectInfo.TYPE == 'JGLTQY'">
                  <template #icon>
                    <img :src="require('@/components/moduleTitle/image/agrotechny-icon.png')" />
                  </template>
                </module-title>
                <div class="list">
                  <div class="vd__images-container" v-if="images.length > 0">
                    <el-carousel trigger="click" class="vd__images" height="160px" indicator-position="none" arrow="never" ref="carouselRef">
                      <el-carousel-item v-for="(item, index) in images" :key="index">
                        <el-image :src="item.url" fit="cover" :preview-src-list="[item.url]" preview-teleported>
                          <template #error>
                            <el-image :src="NoImage" fit="cover" />
                          </template>
                        </el-image>
                      </el-carousel-item>
                    </el-carousel>
                    <img :src="CarouselArrow" class="vd__images-arrow--left" @click="carouselRef?.prev" alt="prev" />
                    <img :src="CarouselArrow" class="vd__images-arrow--right" @click="carouselRef?.next" alt="next" />
                  </div>

                  <template v-for="item in rightList" :key="item.key">
                    <div class="line">
                      <el-image
                        v-if="item.key == '二维码'"
                        style="width: 140px; height: 140px; margin: auto; margin-top: 30px"
                        :src="selectInfo[item.dataIndex]"
                        fit="cover"
                        :preview-src-list="[selectInfo[item.dataIndex]]"
                        preview-teleported
                      >
                        <template #error>
                          <el-image :src="NoImage" fit="cover" />
                        </template>
                      </el-image>
                      <template v-else>
                        <div class="name">{{ item.key }}</div>
                        <div class="value">{{ selectInfo[item.dataIndex] || '-' }}</div>
                      </template>
                    </div>
                  </template>
                </div>
              </div>
            </template>
            <!-- 产业选中蔬菜 并且为市级别 展示蔬菜数据模块 -->
            <vegetable v-if="(selectVal || '').split('/').length == 1 && (selectVal || '').split('/')[0] == '宁波市' && industryData === '蔬菜' && !selectInfo" />
            <!-- 单独展示竹子右侧模块交互 -->
            <bamboo :selectIndustryData="industryData" :selectVal="selectVal" v-if="['毛竹', '杂竹'].includes(industryData)" />
            <div
              class="empty-holder"
              v-if="((selectVal || '').split('/').length > 1 || (selectVal || '').split('/')[0] == selectAreaVal) && !selectInfo && !['毛竹', '杂竹', '花卉苗木'].includes(industryData)"
            >
              <module-title title="产业基地详情" position="right" />
              <img :src="require('@/assets/image/empty.png')" />
              <div>请到某个镇街中选中基地，查看详情。</div>
            </div>
            <!-- 单独展示花卉苗木右侧模块交互 -->
            <div class="flowers-nursery-stock-box" v-if="['花卉苗木'].includes(industryData)">
              <module-title title="产业基地详情" position="right" />
              <div class="module-select__layer-category-selector">
                <el-radio-group v-model="flowerNurseryStockData" @change="flowersTabChange">
                  <el-radio-button :label="moment().year()">{{ moment().year() }}</el-radio-button>
                  <el-radio-button label="2020">2020</el-radio-button>
                </el-radio-group>
                <div class="title-box">
                  <div class="_title">种植总面积</div>
                  <div class="_num">
                    <span>{{ flowerNurseryStockData == '2020' ? '300,727' : '0' }}</span>
                    亩
                  </div>
                </div>
              </div>
            </div>
            <div class="basic-info" v-if="!selectInfo && (selectVal || '').split('/').length == 1 && (selectVal || '').split('/')[0] == '宁波市' && !['蔬菜'].includes(industryData)">
              <module-title title="简介" position="right" />
              <div class="text">产业兴旺是解决农村一切问题的前提，要 推动乡村产业振兴，紧紧围绕发展现代农 业，围绕农村一二三产业融合发展，构建 乡村产业体系。</div>
              <template v-for="item in boardData" :key="item.title">
                <div class="board">
                  <div class="title" :style="{ color: item.titleColor ? item.titleColor : '' }">{{ item.title }}</div>
                  <div style="display: flex; align-items: baseline">
                    <div class="number">{{ item.number }}</div>
                    <div class="suffix">{{ item.suffix }}</div>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <!-- </div> -->
          <!-- industryData -->
        </template>
        <template v-if="activeLayerCategoryTab == '专题图层'">
          <div class="panel" v-if="!fenghuaTarvelSelect.length && (!isShowFenghuaTarvelRight || !isFengHua)">
            <div class="panel" v-show="activeIndex == 1">
              <!-- 专题图层-生产力布局-总布局 展示蔬菜数据模块 -->
              <allIndustry v-if="thematicLayerData.includes('overallPlan')" />
              <specialStatistics v-if="!thematicLayerData.length" :areaList="areaList" :areaListFarm="areaListFarm" :selectVal="selectVal" />
            </div>
            <div class="panel" v-show="activeIndex == 3">
              <module-title title="目标" position="right" />
              <farm-products-target :activeLayerCategoryTab="activeLayerCategoryTab" :activeModule="selectValueList" />
            </div>
            <div class="panel panel-2" v-show="activeIndex == 2 && layerPickerRef?.activeModule === '精品'">
              <template v-if="selectInfo">
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
                  <module-title :title="baseTitleMap['CCY']" position="right" v-if="selectInfo.TYPE == 'CCY'">
                    <template #icon>
                      <img :src="require('@/components/moduleTitle/image/tea-icon.png')" />
                    </template>
                  </module-title>
                  <module-title :title="baseTitleMap['NJL']" position="right" v-if="selectInfo.TYPE == 'NJL'">
                    <template #icon>
                      <img :src="require('@/components/moduleTitle/image/agritainment-icon.png')" />
                    </template>
                  </module-title>
                  <module-title :title="baseTitleMap['JGLTQY']" position="right" v-if="selectInfo.TYPE == 'JGLTQY'">
                    <template #icon>
                      <img :src="require('@/components/moduleTitle/image/agrotechny-icon.png')" />
                    </template>
                  </module-title>
                  <template v-if="selectInfo.TYPE == 'JPX' || selectInfo.TYPE == 'JPC'">
                    <div class="special-title">
                      <div class="_title">{{ selectInfo.NAME }}</div>
                      <div class="_line"></div>
                    </div>
                  </template>

                  <div class="list">
                    <div class="vd__images-container" v-if="images.length > 0">
                      <el-carousel trigger="click" class="vd__images" height="160px" indicator-position="none" arrow="never" ref="carouselRef">
                        <el-carousel-item v-for="(item, index) in images" :key="index">
                          <el-image :src="item.url || item" fit="cover" :preview-src-list="[item.url || item]" preview-teleported>
                            <template #error>
                              <el-image :src="NoImage" fit="cover" />
                            </template>
                          </el-image>
                        </el-carousel-item>
                      </el-carousel>
                      <img :src="CarouselArrow" class="vd__images-arrow--left" @click="carouselRef?.prev" alt="prev" />
                      <img :src="CarouselArrow" class="vd__images-arrow--right" @click="carouselRef?.next" alt="next" />
                    </div>
                    <template v-if="selectInfo.TYPE == 'JPC'">
                      <div class="line">
                        <div class="value">{{ selectInfo.INTRODUCE || '-' }}</div>
                      </div>
                    </template>
                    <template v-else>
                      <div v-for="item in rightList" :key="item.key" class="line">
                        <div class="name" v-if="item.dataIndex != '二维码'">{{ item.key }}</div>
                        <div class="value" v-if="item.dataIndex != '二维码'">{{ selectInfo[item.dataIndex] || '-' }}</div>
                      </div>
                    </template>
                    <div class="vd-img-box" v-if="selectInfo['二维码']">
                      <img :src="selectInfo['二维码']" alt="" />
                    </div>
                  </div>
                </div>
              </template>
              <!-- 产业选中蔬菜 并且为市级别 展示蔬菜数据模块 -->
              <vegetable v-if="(selectVal || '').split('/').length == 1 && (selectVal || '').split('/')[0] == '宁波市' && industryData === '蔬菜' && !selectInfo" />
              <div class="empty-holder" v-if="((selectVal || '').split('/').length > 1 || (selectVal || '').split('/')[0] == selectAreaVal) && !selectInfo">
                <module-title :title="layerPickerRef?.activeModule == '精品' ? '旅游精品线详情' : '产业基地详情'" position="right" />
                <img :src="require('@/assets/image/empty.png')" />
                <div>{{ layerPickerRef?.activeModule == '精品' ? '请到某个镇街中选中线路，查看详情。' : '请到某个镇街中选中基地，查看详情。' }}</div>
              </div>
              <div class="basic-info" v-if="!selectInfo && (selectVal || '').split('/').length == 1 && (selectVal || '').split('/')[0] == '宁波市' && !['蔬菜'].includes(industryData)">
                <module-title title="简介" position="right" />
                <div class="text">产业兴旺是解决农村一切问题的前提，要 推动乡村产业振兴，紧紧围绕发展现代农 业，围绕农村一二三产业融合发展，构建 乡村产业体系。</div>
                <template v-for="item in specialBoardData" :key="item.title">
                  <div class="board">
                    <div class="title" :style="{ color: item.titleColor ? item.titleColor : '' }">{{ item.title }}</div>
                    <div style="display: flex; align-items: baseline">
                      <div class="number">{{ item.number }}</div>
                      <div class="suffix">{{ item.suffix }}</div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <div v-if="isFengHua">
            <FenghuaTravelLayer v-if="isShowFenghuaTarvelRight && !fenghuaTarvelSelect.length" />
            <FenghuaTraveLayerDetail :selectInfo="selectInfo" v-if="isShowFenghuaTarvelRight && fenghuaTarvelSelect.length" />
          </div>
        </template>
        <template v-if="activeLayerCategoryTab == '基础图层' && layerPickerRef?.activeModule !== '农民-农村' && industryData === '粮食'">
          <rice v-model:selectVal="selectVal" :selectCode="selectCode" />
        </template>
        <template v-if="activeLayerCategoryTab == '基础图层' && layerPickerRef?.activeModule !== '农民-农村' && industryData === '水果'">
          <juicyPeach v-model:selectVal="selectVal" :selectCode="selectCode" />
        </template>
        <template #left-bottom-toolbox>
          <AdditionalControls
            :selectValueList="selectValueList"
            :activeLayerCategoryTab="activeLayerCategoryTab"
            :active-module="layerPickerRef?.activeModule"
            @change="additionalLayerState = $event"
            @openModal="_temp_onModalOpen"
          />
        </template>
      </side-bar>
      <area-select
        @sendMessage="sendMessage"
        v-if="activeLayerCategoryTab"
        v-model:selectVal="selectVal"
        :selectCode="selectCode"
        :selectAreaVal="selectAreaVal"
        :area-list="activeLayerCategoryTab === '农民-农村' ? selecetAreaList : selecetAreaList"
      />
      <!-- 临时展示一个地图图片 -->
      <img v-if="activeLayerCategoryTab == '专题图层' && thematicLayerData.includes('overallPlan')" :style="{ width: '100%', height: '100%' }" src="./image/zbj-image.png" alt="" />
      <img class="search-btn" @click="searcnPopupVisible = true" :src="require('./image/search-icon.png')" alt="" />
      <MapToolkit @sendMessage="sendMessage" ref="mapToolkitRef" class="home__map-toolkit" />
      <div class="home__map-toolkit-coordinates" v-if="mapToolkitRef?.useCoordinateTracker">经纬度：121.629265, 29.810974</div>
      <!-- <div class="bottom-tab">
        <img src="https://img.hzanchu.com/acimg/aaee5b8d6470e31146c366b08b9fc643.png" alt="">
      </div> -->
    </div>
    <iframe id="gisIframe" ref="mapRef" :src="iframeSrc" frameborder="0" width="100%" height="100%" />
    <custom-dialog v-model:visible="searcnPopupVisible" :width="840" top="5vh" title="粮功区搜索">
      <SearchPopup @setSelectVal="setSelectVal" />
    </custom-dialog>

    <custom-dialog v-model:visible="isShowSxt" :width="840" top="5vh" title="监控显示">
      <video ref="videoDom" style="width: 100%; height: 100%" class="video-js vjs-default-skin" preload="auto">
        <source :src="selectVideo" type="application/x-mpegURL" />
      </video>

      <!-- <object
        type="application/x-vlc-plugin"
        id="vlc"
        events="True"
        width="1300px"
        height="750px"
        pluginspage="http://www.videolan.org"
        codebase="http://downloads.videolan.org/pub/videolan/vlc-webplugins/2.0.6/npapi-vlc-2.0.6.tar.xz"
      >
        <param name="mrl" value="rtsp://dahua:dahua123@211.91.61.213:554/cam/realmonitor?channel=1&subtype=0" id="mrl" />
        <param name="volume" value="30" />
        <param name="autoplay" value="false" />
        <param name="loop" value="false" />
        <param name="fullscreen" value="false" />
      </object> -->
      <!-- <iframe src="https://open.ys7.com/v3/openlive/D48300667_6_2.m3u8?expire=1660123387&id=466655692170723328&t=d4c9ce5884e802139aa2e5e22cbbb009c3001cc3b30ab86bf9544110e611a8b4&ev=100" frameborder="0" width="100%" height="100%" /> -->
    </custom-dialog>
    <custom-dialog v-model:visible="visible" :width="840" top="5vh" title="三调分析">
      <second-title title="地类占比" />
      <city-bar :selectVal="selectVal" />
      <city-pie :selectVal="selectVal" @select="selectType" />
      <county-pie :selectVal="selectVal" :landType="landType" />
    </custom-dialog>

    <custom-dialog v-model:visible="visible2" :width="840" top="5vh" title="区域分布">
      <second-title title="分析比对" v-if="selectVal?.length === (selectAreaVal ? 2 : 3)" />
      <gbznt-chart :cityArea="cityArea" v-if="selectVal?.length === (selectAreaVal ? 2 : 3)" />
      <second-title title="粮功区分析" />
      <county-chart v-model:areaName="areaName" :selectVal="selectVal" :cityArea="cityArea" />
      <second-title title="面积占比" />
      <area-chart :areaName="areaName" :cityArea="cityArea" />
      <!--      <second-title title="个数占比" />-->
      <!--      <num-chart :areaName="areaName"/>-->
    </custom-dialog>

    <custom-dialog v-model:visible="visible3" :width="775" top="5vh" title="整治进展">
      <second-title title="非粮化分析" />
      <non-grain-chart
        :selectAreaVal="selectAreaVal"
        :chartsWidth="(!isShowOptimizeEcharts && !isShowClearEcharts) || (selectVal || '').split('/').length > 2 ? '420px' : '240px'"
        :selectVal="selectVal"
      ></non-grain-chart>
      <br />
      <br />
      <second-title v-if="(isShowOptimizeEcharts || isShowClearEcharts) && (selectVal || '').split('/').length <= (selectAreaVal ? 1 : 2)" :title="subTitle" />
      <div class="double-chart" v-if="(isShowOptimizeEcharts || isShowClearEcharts) && (selectVal || '').split('/').length <= (selectAreaVal ? 1 : 2)">
        <optimize-chart v-if="isShowOptimizeEcharts && (selectVal || '').split('/').length <= (selectAreaVal ? 1 : 2)" :selectVal="selectVal"></optimize-chart>
        <clean-chart v-if="isShowClearEcharts && (selectVal || '').split('/').length <= (selectAreaVal ? 1 : 2)" :selectVal="selectVal"></clean-chart>
      </div>
      <img
        v-if="isShowOptimizeEcharts && isShowClearEcharts && (selectVal || '').split('/').length <= (selectAreaVal ? 1 : 2)"
        class="arrow"
        style="left: 20px"
        :src="require('@/assets/image/left_arrow.png')"
        @click="toggle(1)"
      />
      <img
        v-if="isShowOptimizeEcharts && isShowClearEcharts && (selectVal || '').split('/').length <= (selectAreaVal ? 1 : 2)"
        class="arrow"
        style="right: 20px"
        :src="require('@/assets/image/right_arrow.png')"
        @click="toggle(2)"
      />
    </custom-dialog>
    <!-- <bottomReel /> -->
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, reactive, ref, watch, computed, provide, watchEffect, toRaw } from 'vue'
import videojs from 'video.js'
import 'videojs-contrib-hls'
import '@videojs/http-streaming'
import sideBar from './components/SideBar.vue'
import moduleTitle from '@/components/moduleTitle'
import statistics from './modules/statistics'
import specialStatistics from './modules/specialStatistics'
import farmProductsTarget from './modules/farmProductsTarget'
import nonAgricultural from './modules/nonAgricultural'
import moduleSelect from './modules/moduleSelect'
import mapStatus from './modules/mapStatus'
import areaSelect from '@/components/areaSelect'
import areaTown from '@/assets/js/areaTown.json'
import ribbon from '@/assets/js/ribbon.json'
import customDialog from '@/components/customDialog'
import cityPie from './modal/cityPie'
import rice from './modal/rice/rice.vue' // 粮食右侧数据模块
import vegetable from './modal/vegetable/index.vue' // 蔬菜市级展示模块
import bamboo from './modal/bamboo/index.vue' // 竹子展示模块
import allIndustry from './modal/industry/allIndustry.vue' // 生产力布局-总布局展示模块
import juicyPeach from './modal/juicyPeach/index.vue' // 水蜜桃右侧数据模块
import cityBar from './modal/cityBar'
import gbzntChart from './modal/gbzntChart'
import secondTitle from '@/components/secondTitle'
import SearchPopup from '@/components/SearchPopup'
import bottomReel from '@/components/bottomReel'
import countyPie from './modal/countyPie'
import countyChart from './modal/countyChart'
import areaChart from './modal/areaChart.vue'
import NoImage from '@/assets/image/default-image.svg'
import nonGrainChart from './modal/nonGrainChart.vue'
import optimizeChart from './modal/optimizeChart.vue'
import cleanChart from './modal/cleanChart.vue'
import cleanData from '@/assets/js/cleanData.json'
import compensateData from '@/assets/js/compensateData.json'
import anime from 'animejs'
import qyfbData from '@/assets/js/qyfbData.json'
import flhData from '@/assets/js/flhData.json'
import clearData from '@/assets/js/clearData.json'
import optimizeData from '@/assets/js/optimizeData.json'
import {
  agriculturalList,
  urbanLogisticsList,
  husbandryList,
  vegetableList,
  aquaticList,
  teaList,
  agritainmentList,
  agrotechnyList,
  happyFarmHouseImgList,
  processImgList,
  aquaticProductImgList,
  boardData,
  baseTitleMap,
  lineList,
  villageIntroduce,
  lineIntroduce,
  shuiProduct,
  STXVideoList
} from './modal/const'
import MapToolkit from './components/MapToolkit.vue'
import VillageDetails from './components/VillageDetails.vue'
import CollectiveCapital from './components/CollectiveCapital.vue' // 基础图层-农村-集体三资
import CollegeIntroduceDetail from './modules/collegeIntroduceDetail.vue'
import AdditionalControls from './components/AdditionalControls.vue'
import { set, get, cloneDeep } from 'lodash'
import { areaSelectedList } from '../ruralBrain/modal/const'
import regionData from '@/assets/js/area.json' // 无粮功区版本
import areaData from '@/assets/js/area.json'
import CarouselArrow from '@/views/index/image/carousel-arrow.svg'
import FenghuaTravelLayer from './modules/RightModule/Layer/LayerTabs/FenghuaTravelLayer.vue'
import FenghuaTraveLayerDetail from './modules/RightModule/Layer/LayerTabs/FenghuaTraveLayerDetail.vue' // 有粮功区版本
import moment from 'moment'
import { klona } from 'klona'
const state = reactive({
  selectList: []
})
const cityArea = reactive({
  name: [],
  lgq: [],
  gbznt: []
}) // 区域分布
const selectVideo = ref('')

const flowerNurseryStockData = ref('2020')
const isFengHua = ref(window.location.search.split('area=')[1] === 'fenghua') // 是否为奉化驾驶舱
// window.open('http://211.91.60.222:81/dispatch.asp?user=admin&pass=NBtt123456#&page=preview.asp')
const flhArea = ref({}) // 非粮化数据
const industryData = ref('粮食') // 产业选中值
const thematicLayerData = ref([]) // 专题图层选中值
const villageLayersList = ref([]) // 基础图层-农村选中值
const carouselRef = ref(null)
const specialBoardData = ref(boardData)
const mapInit = ref(false)
const visible = ref(false)
const visible2 = ref(false)
const selectAreaVal = ref(null) // 初始对地图进行地域限制
const selecetAreaList = ref(regionData) // 地域选择
const isShowClearEcharts = ref(true)
const isShowOptimizeEcharts = ref(true)
const searcnPopupVisible = ref(false)
const activeLayerCategoryTab = ref(null)
const isShowSxt = ref(false) // 显示嵌入的页面
const visible3 = ref(false)
const areaName = ref('')
const selectVal = ref('宁波市') // 选择的地区
const selectValueList = ref([]) // 专题图层-生产力布局
provide('regionNamePath', selectVal)
const selectCode = ref([])
const fenghuaTarvelSelect = ref([])
const isShowFenghuaTarvelRight = ref(false)
const countyArea = ['海曙区', '江北区', '北仑区', '镇海区', '鄞州区', '奉化区', '象山县', '宁海县', '余姚市', '慈溪市']
const cleanList = reactive({
  cleanVal: 0,
  compensateVal: 0,
  isShow: false
})
// 专题图层农业经营主体 对应右侧显示数据
const agriculturalManagementEntityData = [
  {
    title: '农业经营主体-合作社',
    number: 549,
    suffix: '家',
    titleColor: '#27E0FD'
  },
  {
    title: '农业经营主体-家庭农场',
    number: 515,
    suffix: '家',
    titleColor: '#27E0FD'
  },
  {
    title: '农业经营主体-农业企业',
    number: 856,
    suffix: '家',
    titleColor: '#27E0FD'
  },
  {
    title: '农业经营主体-大户',
    number: 185,
    suffix: '家',
    titleColor: '#27E0FD'
  },
  {
    title: '农业经营主体-农家乐',
    number: 75,
    suffix: '家',
    titleColor: '#27E0FD'
  },
  {
    title: '农业经营主体-其他',
    number: 193,
    suffix: '家',
    titleColor: '#27E0FD'
  }
]
// 监听地图交互事件
const areaList = ref([
  { name: '农业用地', value: 0 },
  { name: '农村道路', value: 0 },
  { name: '河流水面', value: 0 },
  { name: '公路用地', value: 0 },
  { name: '农村宅基地', value: 0 },
  { name: '工业用地', value: 0 },
  { name: '其他(非农业用地)', value: 0 }
])
const landType = ref('耕地')
const areaListFarm = ref([
  { name: '耕地', value: 0 },
  { name: '园地', value: 0 },
  { name: '林地', value: 0 },
  { name: '其他(农业用地)', value: 0 }
])
const currentType = ref(1)
const subTitle = computed(() => (currentType.value == 1 ? '优化补入分析' : '清理腾退分析'))
const activeIndex = ref(1)
const videoDom = ref(null) // video dom
const selectInfo = ref(null) // 选中的产业基地点位数据
const images = ref([]) // 右侧轮播图数据
const rightList = computed(() => {
  console.log('selectInfo.value.TYPE', selectInfo.value)
  switch (selectInfo.value.TYPE) {
    case 'XM':
      return husbandryList
    case 'SHUI':
      getImgList(aquaticList, 'SHUI')
      return aquaticList
    case 'SHU':
      return vegetableList
    case 'CCY':
      return teaList
    case 'NJL':
      getImgList(agritainmentList, 'NJL')
      return agritainmentList
    case 'JGLTQY':
      getImgList(agrotechnyList, 'JGLTQY')
      return agrotechnyList
    case 'JPX':
      console.log(lineList, 'lineList1')
      return lineList
    case 'JPC':
      console.log(lineList, 'lineList2')
      return lineList
    case 'NZFB':
      return agriculturalList
    case 'XCWL':
      return urbanLogisticsList
    default:
      return []
  }
})
const getImgList = (data, type) => {
  let imgList = []
  if (['SHUI', 'JGLTQY'].includes(type)) {
    if (type === 'SHUI') {
      aquaticProductImgList.forEach((item) => {
        if (item.name == selectInfo.value.养殖主体) {
          imgList.push(item)
        }
      })
    } else {
      processImgList.forEach((item) => {
        if (item.name == selectInfo.value.企业名称) {
          imgList.push(item)
        }
      })
    }
  } else {
    happyFarmHouseImgList.forEach((item) => {
      if (item.name == selectInfo.value.农家乐名称) {
        imgList.push(item)
      }
    })
  }
  images.value = imgList
}
const receiveMsg = (e) => {
  let obj = e.data
  if (obj.type === 'gisMapMessage' && obj.data.value.initType) {
    mapInit.value = true
    onMapLoaded()
  }
  // console.log(obj)
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
        /***
         * 这是一段格式化 未来乡村图片的代码
         * 1、excel 转json
         * 2、json转
         * let obj={}
         arr.map(val=>{
              if(obj[val['区县']]){
                  if(obj[val['区县']][val['乡镇街道']]){
                      if(obj[val['区县']][val['乡镇街道']][val['村']]){
                          obj[val['区县']][val['乡镇街道']][val['村']].push(val['完整路径'])
                      }else{
                          obj[val['区县']][val['乡镇街道']][val['村']] =[val['完整路径']]
                      }
                  }else{
                      obj[val['区县']][val['乡镇街道']]={}
                      obj[val['区县']][val['乡镇街道']][val['村']]=[val['完整路径']]
                  }
              }else{
                  obj[val['区县']] = {}
                  obj[val['区县']][val['乡镇街道']]={}
                  obj[val['区县']][val['乡镇街道']][val['村']]=[val['完整路径']]
              }
          })
         console.log(obj)
         *
         * **/
        if (layerPickerRef.value?.activeModule === '农民-农村') {
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
    } else if (obj.data.key == 'pointInfo') {
      // 单击打产业基地图标
      const val = obj.data.value.pointInfo
      changeTab(2, industryData.value) // 高亮产业基地tab
      console.log('val.TYPE', val.TYPE)
      if (val.TYPE == 'SHUI') {
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
            if (item.type == 'inSide') {
              // 两种展示形式一种是新开页面 一种是弹窗内嵌
              isShowSxt.value = true
              selectVideo.value = item.src
            } else {
              window.open(item.src)
            }
          }
        })
      } else if (val.TYPE === 'JPX') {
        for (let item of lineIntroduce) {
          if (item.name.indexOf(val.NAME) != -1) {
            selectInfo.value = {
              TYPE: 'JPX',
              NAME: item.name,
              最佳观光季节: item.season,
              线路安排: item.line,
              主要特色: item.special,
              农副特产: item.goods,
              特色小吃: item.eat,
              农事节庆活动: item.event,
              预定咨询电话: item.phone,
              介绍: item.introduce,
              图片: item.imageList,
              二维码: val.url ? val.url : ''
            }
            images.value = item.imageList
            break
          }
        }
        return
      } else if (val.TYPE === 'JPC') {
        const { NAME, TOWN, COUNTY } = val
        const address = '' + COUNTY + TOWN + NAME // 地址拼接
        for (let item of villageIntroduce) {
          if (item.name.indexOf(address) != -1) {
            selectInfo.value = {
              TYPE: 'JPC',
              NAME: item.name,
              名称: item.name,
              INTRODUCE: item.introduce,
              介绍: item.introduce,
              图片: item.imageList
            }
            images.value = item.imageList
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
      if (val.TYPE != 'SXT') selectInfo.value = val

      console.log(val, 'val', selectInfo.value)
    } else if (obj.data.key == 'pointInfo1') {
      // 暂时这么写 手动调整的pointInfo1
      const val = obj.data.value.pointInfo
      if (val.TYPE == 'SXT') {
        // console.log('大图', val)
        window.open('http://211.91.60.222:81/dispatch.asp?user=admin&pass=NBtt123456#&page=preview.asp')
      }
    }
  }
}
// 向子页面传递消息
const onTabChange = (e) => {
  activeLayerCategoryTab.value = e
}
const mapRef = ref(null)
const mainLayerState = ref(undefined)
const additionalLayerState = ref([])
// 临时处理，因为弹窗牵连的东西太多不方便迁移
const _temp_onModalOpen = (key) => {
  if (key === '产业-资源-粮功区内高标农::区域分布') {
    visible2.value = true
  }
  if (key === '产业-资源-粮功区内高标农::三调分析') {
    visible.value = true
  }
  if (key === '产业-资源-粮功区内高标农::整治进展') {
    visible3.value = true
  }
}
const getBaseText = (type) => {
  let name = '请到某个镇街中选中站点，查看详情。'
  switch (type) {
    case '农资分布':
      name = '请到某个镇街中选中农资店，查看详情'
      break
    case '农村物流':
      name = '请到某个镇街中选中站点，查看详情。'
      break
  }
  return name
}
// TODO: 处理两次更新的问题
watchEffect(() => {
  const value = klona(toRaw(mainLayerState.value))
  const productData = mainLayerState.value?.option?.obj?.['产业基地规划面']
  // 添加”产业基地规划面“
  // set(value, ['option', 'obj', '产业基地规划面'], toRaw(additionalLayerState.value));
  set(value, ['option', 'obj', '产业基地规划面'], toRaw((productData || []).length > 0 ? productData : additionalLayerState.value))
  if (mapRef.value && mapInit.value) {
    mapRef.value.contentWindow.postMessage(
      {
        type: 'gisLayerMessage',
        data: {
          key: 'changeLayerByOption',
          value
        }
      },
      '*'
    )
  }
})
const checkBoxChange = (val) => {
  console.log(val, 'val')
  state.selectList = val
}
// 向子页面传递消息
const sendMessage = (e) => {
  console.log('e---', e)
  // 拦截changeLayerByOption,
  if (e.key === 'changeLayerByOption') {
    mainLayerState.value = e.value
    return
  }
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
provide('sendMessage', sendMessage)
const setSelectVal = (val) => {
  selectVal.value = selectAreaVal.value ? val.COUNTY + '/' + val.TOWN + '/' + val.GHMC : '宁波市/' + val.COUNTY + '/' + val.TOWN + '/' + val.GHMC
  selectCode.value = selectAreaVal.value ? [val.COUNTY, val.TOWN, val.GHMC] : ['宁波市', val.COUNTY, val.TOWN, val.GHMC]
  sendMessage({
    key: 'changeAreaByName',
    value: { name: val.GHMC }
  })
  searcnPopupVisible.value = false //关闭弹窗
}
const onReset = () => {
  areaList.value.map((item) => {
    item.value = 0
  })
  areaListFarm.value.map((item) => {
    item.value = 0
  })
  cleanList.cleanVal = 0
  cleanList.compensateVal = 0
  cleanList.isShow = true
}
const getAreaInfo = (val) => {
  onReset()
  const areaArr = val.split('/')
  if (val === '宁波市' || val === '宁波市/宁波市') {
    // 选择市本级
    cleanData.map((item) => {
      cleanList.cleanVal += +item.area
    })
    compensateData.map((item) => {
      cleanList.compensateVal += +item.area
    })

    areaTown.map((item) => {
      areaList.value.map((key) => {
        if (item.DKLX === key.name) {
          key.value += +item.AREA
        }
      })
      areaListFarm.value.map((key) => {
        if (item.DKLX === key.name) {
          key.value += +item.AREA
        }
      })
    })
  } else if (countyArea.includes(areaArr[areaArr.length - 1])) {
    // 选择到区
    cleanData.map((item) => {
      if (item.county === areaArr[areaArr.length - 1]) cleanList.cleanVal += +item.area
    })
    compensateData.map((item) => {
      if (item.county === areaArr[areaArr.length - 1]) cleanList.compensateVal += +item.area
    })
    areaTown.map((item) => {
      areaList.value.map((key) => {
        if (item.COUNTY === areaArr[areaArr.length - 1] && item.DKLX === key.name) {
          key.value += +item.AREA
        }
      })
      areaListFarm.value.map((key) => {
        if (item.COUNTY === areaArr[areaArr.length - 1] && item.DKLX === key.name) {
          key.value += +item.AREA
        }
      })
    })
  } else if (areaArr.length === (selectAreaVal.value ? 3 : 4)) {
    // 选择到 粮食功能区
    cleanList.isShow = false // 粮食功能区不展示 清理腾退数据
    if (areaArr[selectAreaVal.value ? 1 : 2] === areaArr[selectAreaVal.value ? 2 : 3]) {
      areaTown.map((item) => {
        areaList.value.map((key) => {
          if (item.TOWN === areaArr[areaArr.length - 1] && item.DKLX === key.name) {
            key.value += +item.AREA
          }
        })
        areaListFarm.value.map((key) => {
          if (item.TOWN === areaArr[areaArr.length - 1] && item.DKLX === key.name) {
            key.value += +item.AREA
          }
        })
      })
    } else {
      ribbon.map((item) => {
        areaList.value.map((key) => {
          if (item.GHMC === areaArr[areaArr.length - 1] && item.DKLX === key.name) {
            key.value += +item.AREA
          }
        })
        areaListFarm.value.map((key) => {
          if (item.GHMC === areaArr[areaArr.length - 1] && item.DKLX === key.name) {
            key.value += +item.AREA
          }
        })
      })
    }
  } else {
    // 选择到镇
    areaTown.map((item) => {
      cleanData.map((item) => {
        if (item.town === areaArr[areaArr.length - 1]) cleanList.cleanVal = +item.area
      })
      compensateData.map((item) => {
        if (item.town === areaArr[areaArr.length - 1]) cleanList.compensateVal = +item.area
      })
      areaList.value.map((key) => {
        if (item.TOWN === areaArr[areaArr.length - 1] && item.DKLX === key.name) {
          key.value = +item.AREA
        }
      })
      areaListFarm.value.map((key) => {
        if (item.TOWN === areaArr[areaArr.length - 1] && item.DKLX === key.name) {
          key.value = +item.AREA
        }
      })
    })
  }
}

const selectType = (e) => {
  // console.log('e',e);
  landType.value = e
}

const toggle = (type) => {
  currentType.value = type
  if (type == 1) {
    anime({
      targets: '.optimize-pie',
      translateX: '0',
      easing: 'easeInOutSine'
    })
    anime({
      targets: '.clean-pie',
      translateX: '0',
      easing: 'easeInOutSine'
    })
  }
  if (type == 2) {
    anime({
      targets: '.optimize-pie',
      translateX: '-100%',
      easing: 'easeInOutSine'
    })
    anime({
      targets: '.clean-pie',
      translateX: '-100%',
      easing: 'easeInOutSine'
    })
  }
}

const getTravelSelectData = (data, isShowFenghuaTarvel) => {
  fenghuaTarvelSelect.value = data
  isShowFenghuaTarvelRight.value = isShowFenghuaTarvel
}

const flowersTabChange = (value) => {
  const obj = { 花卉苗木: value === '2020' ? '2020' : '' }
  const message = { key: 'changeLayerByOption', value: { option: { name: '土地非农化', obj } } }
  sendMessage(message)
}

const getCityArea = (val) => {
  cityArea.name = []
  cityArea.lgq = []
  cityArea.gbznt = []
  const areaArr = val.split('/')
  if (val === '宁波市' || val === '宁波市/宁波市') {
    // 市级
    qyfbData.map((item) => {
      if (item.city === '宁波市') {
        cityArea.name.push(item.name)
        cityArea.lgq.push((+item.lgqmj)?.toFixed(1))
        cityArea.gbznt.push((+item.gbzntmj)?.toFixed(1))
      }
    })
  } else if (areaArr.length === (selectAreaVal.value ? 1 : 2)) {
    qyfbData.map((item) => {
      if (item.city === (selectAreaVal.value ? areaArr[0] : areaArr[1])) {
        cityArea.name.push(item.name)
        cityArea.lgq.push((+item.lgqmj).toFixed(1))
      }
    })
  } else if (areaArr.length === (selectAreaVal.value ? 2 : 3) || areaArr.length === (selectAreaVal.value ? 3 : 4)) {
    qyfbData.map((item) => {
      if (item.city === (selectAreaVal.value ? areaArr[1] : areaArr[2])) {
        cityArea.name.push(item.name)
        cityArea.lgq.push((+item.lgqmj).toFixed(1))
      }
    })
  }
}

const getFLHData = (val) => {
  const areaArr = val.split('/')
  if (areaArr.length === (selectAreaVal.value ? 3 : 4)) {
    areaArr.pop()
  }
  flhArea.value = {}
  flhData.map((item) => {
    if (item.name === areaArr[areaArr.length - 1]) {
      flhArea.value = item
    }
  })
}

// 子组件传参村庄选中tab
const getVillageLayers = (value) => {
  villageLayersList.value = value
  selectInfo.value = null
}

// 右侧tab切换  产业选中的tab
const changeTab = (type, value, list) => {
  activeIndex.value = type
  industryData.value = value
  selectValueList.value = list
  getRightData(value)
}
// 专题图层数据父子传参
const getThematicLayerData = (value) => {
  thematicLayerData.value = value
}

const getRightData = (name) => {
  //更新专题图层 右侧简介列表的数据展示
  const newArr = cloneDeep(boardData) // 深拷贝
  agriculturalManagementEntityData.forEach((item) => {
    if (item.title.split('-')[1] == name) {
      newArr.push(item)
    }
  })
  specialBoardData.value = newArr
}

const isShowThreeCharts = (val) => {
  const targetArea = val.split('/').pop()
  const clearDataResult = clearData.filter((v) => v.bCity == targetArea)
  const optimizeDataResult = optimizeData.filter((v) => v.bCity == targetArea)
  if (!clearDataResult.length) {
    isShowClearEcharts.value = false
  } else {
    isShowClearEcharts.value = true
    currentType.value = 2
  } //没数据不展示
  if (!optimizeDataResult.length) {
    isShowOptimizeEcharts.value = false
  } else {
    isShowOptimizeEcharts.value = true
    currentType.value = 1
  } //没数据不展示
}

// 获取统计信息
watch(
  () => selectVal.value,
  (val) => {
    getAreaInfo(val)
    getCityArea(val)
    getFLHData(val)
    // if (selectVal.value.split('/').length == 1) {
    // 非乡镇街道层级不展示右侧产业基地详情-
    selectInfo.value = null
    // }
    isShowThreeCharts(val)
  },
  { immediate: true }
)

const iframeSrc = computed(() => {
  if (['农民-农村', '精品'].includes(layerPickerRef.value?.activeModule)) {
    return '/NBJSC_SE/NBJSC_NMNC.html'
  }
  return '/NBJSC_SE/NBJSC_CYZY.html'
})
const rightPanelContent = ref(undefined)

const mapToolkitRef = ref(null)
const layerPickerRef = ref(null)

const initArea = (area) => {
  //初始化进行地区限制
  let selectArea = ''
  for (const key in areaSelectedList) {
    if (key == area) {
      selectArea = areaSelectedList[key]
    }
  }
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
  const message = { key: 'changeAreaByName', value: { name: selectArea } }
  sendMessage(message)
}
// 农村的地图不会自动读取需要手动更改地区
const onMapLoaded = () => {
  const regionPath = selectVal.value.split('/')
  const message = { key: 'changeAreaByName', value: { name: regionPath[regionPath.length - 1] } }
  sendMessage(message)
  if (layerPickerRef.value?.activeModule == '精品') {
    // 精品线路默认加载精品线路图层
    const obj = { 精品线路: '2022' }
    const message = { key: 'changeLayerByOption', value: { option: { obj } } }
    sendMessage(message)
  }
  return
}

onMounted(() => {
  const { search = '' } = window.location // 获取是否需要将数据进行区级限制
  const area = search.split('=')[1]
  if (area) initArea(area) //初始化进行地区限制
  window.addEventListener('message', receiveMsg, false)
})
onBeforeUnmount(() => {
  window.removeEventListener('message', receiveMsg, false)
})
watch(
  () => videoDom.value,
  (val) => {
    // 当dom元素有的时候 加载video数据
    if (val) {
      openVideo()
    }
  }
)

const openVideo = () => {
  videojs(
    videoDom.value,
    {
      bigPlayButton: false,
      textTrackDisplay: false,
      posterImage: true,
      errorDisplay: false,
      controlBar: false,
      control: false,
      muted: true //静音模式 、、 解决首次页面加载播放。
    },
    function () {
      this.play() // 自动播放
    }
  )
}
</script>

<style scoped lang="scss">
.index {
  $top-align: 118px;
  $bottom-padding: 24px;
  position: relative;
  .vd__images-container {
    position: relative;
    margin-bottom: 20px;
  }
  .vd__images {
    height: 160px;
    :deep(.el-image) {
      width: 100%;
      height: 100%;
    }
  }
  %_vd__images-arrow {
    position: absolute;
    top: 80px - 16px;
    z-index: 1;
    cursor: pointer;
  }
  .vd__images-arrow--left {
    @extend %_vd__images-arrow;
    right: 280px;
    &:active {
      transform: scale(0.9);
    }
  }
  .vd__images-arrow--right {
    @extend %_vd__images-arrow;
    left: 280px;
    transform: scaleX(-1);
    &:active {
      transform: scale(-0.9, 0.9);
    }
  }

  .bottom-tab {
    width: 957px;
    height: 36px;
    left: 482px;
    position: fixed;
    bottom: 0;
    background: url('https://img.hzanchu.com/acimg/00c1bd2a560cbda87b4ef28176510c6d.png') no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 20px;
      height: 20px;
    }
  }
  .side-bar {
    top: $top-align;
    transition: all 0.8s ease-out;
    &--left {
      left: 40px;
      height: 938px;
    }
    &--right {
      right: 40px;
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
      color: rgba(255, 255, 255, 0.5);
      background-image: url('~@/assets/image/tab_bg.png');
      background-size: 100% 100%;
      line-height: 29px;
      text-align: center;
      cursor: pointer;

      &.active {
        color: #fff;
        background-image: url('~@/assets/image/tab_bg_active.png');
        background-size: 100% 100%;
      }
    }
  }

  .panel {
    height: 100%;
    overflow: auto;
    .flowers-nursery-stock-box {
      .title-box {
        width: 297px;
        height: 68px;
        background: url('https://img.hzanchu.com/acimg/296a9d8d194655129d528a0f4c6337a7.png') no-repeat;
        background-size: 100% 100%;
        margin-top: 20px;
        margin-bottom: 31px;
        display: flex;
        align-items: center;
        padding: 0 24px;
        box-sizing: border-box;
        ._num {
          margin-left: auto;
          font-size: 12px;
          font-family: MicrosoftYaHei-, MicrosoftYaHei;
          font-weight: normal;
          color: rgba(255, 255, 255, 0.8);
          span {
            font-size: 24px;
            font-family: DIN Alternate-Bold, DIN Alternate;
            font-weight: bold;
            color: #ffffff;
            margin-right: 6px;
          }
        }
        ._title {
          font-size: 16px;
          font-family: MicrosoftYaHei-, MicrosoftYaHei;
          font-weight: normal;
          color: #00deff;
        }
      }
      .module-select__layer-category-selector {
        :deep(.el-radio-group) {
          display: flex;
          flex-wrap: nowrap;
          width: 100%;
          margin: 23px 0 20px 0px;
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
            width: 84px;
            height: 29px;
            &.is-active {
              width: 84px;
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
      overflow: auto;
      height: 772px;
      padding-top: 24px;
      .vd-img-box {
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 125px;
          height: 125px;
        }
      }
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
        color: #6cd0ff;
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
        user-select: text; //增加文本可复制
      }
    }

    .basic-info {
      .text {
        margin: 24px 0;
        font-size: 16px;
        color: #ffffff;
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

        .title {
          font-size: 14px;
          font-weight: 400;
          color: #ffffff;
          -webkit-background-clip: text;
          margin-bottom: 4px;
        }
        .number {
          font-size: 26px;
          font-family: DIN Alternate-Bold, DIN Alternate;
          font-weight: bold;
          color: #27e0fd;
          line-height: 38px;
          -webkit-background-clip: text;
          margin-right: 2px;
        }
        .suffix {
          font-size: 12px;
        }
      }
    }
  }
  .map-status {
    position: absolute;
    right: 40px;
    top: 980px;
  }
  .search-btn {
    position: absolute;
    z-index: 1000;
    left: 393px;
    top: 100px;
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
    top: 105px;
    left: 40px;
    width: 346px;
    z-index: 1000;
  }
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
.gisIframe-box {
  margin-left: 560px;
  margin-top: 159px;
}
.special-title {
  position: relative;
  width: 288px;
  height: 34px;
  background: linear-gradient(270deg, rgba(51, 143, 249, 0) 0%, rgba(51, 143, 249, 0.56) 49%, rgba(51, 143, 249, 0) 100%);
  ._title {
    position: absolute;
    top: 0;
    width: 100%;
    height: 33px;
    line-height: 33px;
    text-align: center;
    font-size: 18px;
    font-family: MicrosoftYaHei;
    color: #ffffff;
  }
  ._line {
    position: absolute;
    bottom: 0;
    width: 288px;
    height: 1px;
    background: linear-gradient(244deg, rgba(0, 186, 254, 0) 0%, #00bafe 78%, rgba(0, 186, 254, 0) 100%);
  }
}
//设置全局css
* {
  touch-action: pan-y;
}
/* 中间的播放箭头 */
::v-deep .vjs-text-track-settings {
  display: none;
}
/* 加载圆圈 */
::v-deep .vjs-loading-spinner {
  display: none;
}
</style>
