<template>
  <div class="module-select">
    <div class="module-select__layer-category-selector">
      <el-radio-group v-model="activeLayerCategoryTab">
        <!-- <el-radio-button label="产业-资源">资源·产业</el-radio-button>
        <el-radio-button label="农民-农村">农村·农民</el-radio-button> -->
        <el-radio-button label="基础图层">基础图层</el-radio-button>
        <el-radio-button label="专题图层">专题图层</el-radio-button>
      </el-radio-group>
    </div>
    <div v-if="activeLayerCategoryTab === '基础图层'">
      <div class="all-tab-list">
        <template v-for="(item, index) in tabList" :key="index">
          <div @click="tabChange(index)" :class="item.isSelect ? 'selected-tab' : 'tab'" :style="{ marginRight: index == tabList.length - 1 ? '0px' : '14px' }">
            {{ item.name }}
          </div>
        </template>
      </div>
      <!-- <module-title title="资源" :showThreeChild="showResourceChild" :isPackUp="true" @sendPankUpMessage="sendPankUpMessage"/> -->
      <div
        :style="{
          height: tabList[0].isSelect ? 'auto' : 0,
          overflow: tabList[0].isSelect ? 'auto' : 'hidden'
        }"
      >
        <div class="seconde-title">
          <img class="icon" src="https://img.hzanchu.com/acimg/bb4db9ea32c5f4a51613f10dff488618.png" alt="" />
          <span>土地</span>
          <img
            class="arrow"
            @click="showLandChild = !showLandChild"
            :style="{
              transform: 'rotate(' + (showLandChild ? -180 : 0) + 'deg)'
            }"
            :src="require('./../image/arrow_icon_down.png')"
            alt=""
          />
        </div>
        <div
          :style="{
            height: showLandChild ? 'auto' : 0,
            overflow: showLandChild ? 'auto' : 'hidden'
          }"
        >
          <div class="switch-box">
            <span style="background: #ff1493"></span>
            <p>耕地</p>
            <el-switch v-model="gd" inline-prompt active-text="打开" inactive-text="关闭" active-color="#4EC2FF" inactive-color="#30587E" />
          </div>
          <div class="switch-box">
            <span style="background: #67caff"></span>
            <p>永久基本农田</p>
            <el-switch v-model="ygjbnt" inline-prompt active-text="打开" inactive-text="关闭" active-color="#4EC2FF" inactive-color="#30587E" />
            <img
              class="arrow"
              @click="showTallLevelChildPermanent = !showTallLevelChildPermanent"
              :style="{
                transform: 'rotate(' + (showTallLevelChildPermanent ? -180 : 0) + 'deg)'
              }"
              :src="require('./../image/arrow_icon_down.png')"
              alt=""
            />
          </div>

          <div
            :style="{
              height: showTallLevelChildPermanent ? 'auto' : 0,
              overflow: showTallLevelChildPermanent ? 'auto' : 'hidden'
            }"
          >
            <div class="select-box">
              <div class="item-wrap">
                <div class="select-item" v-for="(item, index) in permanentFarmingList" :key="index" @click="onCheckboxChange(item)">
                  <img
                    class="status"
                    :src="
                      item?.isSelect === 1
                        ? require('./../image/select_icon_active.png')
                        : item?.isSelect === 0
                        ? require('./../image/select_icon_empty.png')
                        : require('./../image/select_icon_selecting.png')
                    "
                    alt=""
                  />
                  <span :style="{ background: item.color }"></span>
                  <p>{{ item?.name }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="switch-box">
            <span style="background: #4a0bff"></span>
            <p>高标准农田</p>
            <el-switch v-model="gbznt" inline-prompt active-text="打开" inactive-text="关闭" active-color="#4EC2FF" inactive-color="#30587E" />
            <img
              class="arrow"
              @click="showTallLevelChild = !showTallLevelChild"
              :style="{
                transform: 'rotate(' + (showTallLevelChild ? -180 : 0) + 'deg)'
              }"
              :src="require('./../image/arrow_icon_down.png')"
              alt=""
            />
          </div>
          <div
            :style="{
              height: showTallLevelChild ? 'auto' : 0,
              overflow: showTallLevelChild ? 'auto' : 'hidden'
            }"
          >
            <div class="select-box">
              <div class="item-wrap">
                <div class="select-item" @click="onCheckboxChange(item)" v-for="(item, index) in farmingList" :key="index">
                  <img
                    class="status"
                    :src="
                      item?.isSelect === 1
                        ? require('./../image/select_icon_active.png')
                        : item?.isSelect === 0
                        ? require('./../image/select_icon_empty.png')
                        : require('./../image/select_icon_selecting.png')
                    "
                    alt=""
                  />
                  <span :style="{ background: item.color }"></span>
                  <p>{{ item?.name }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="switch-box">
            <span style="background: #006ff0"></span>
            <p>粮食生产功能区</p>
            <el-switch v-model="isSelectAll" inline-prompt active-text="打开" inactive-text="关闭" active-color="#4EC2FF" inactive-color="#30587E" @change="onFarmingChange" />
            <img
              class="arrow"
              @click="showProductionChild = !showProductionChild"
              :style="{
                transform: 'rotate(' + (showProductionChild ? -180 : 0) + 'deg)'
              }"
              :src="require('./../image/arrow_icon_down.png')"
              alt=""
            />
          </div>
          <div
            :style="{
              height: showProductionChild ? 'auto' : 0,
              overflow: showProductionChild ? 'auto' : 'hidden'
            }"
          >
            <div class="select-box" style="margin-bottom: 30px">
              <div class="select-title">
                利用现状
                <img
                  class="arrow"
                  @click="onThreeArrowChange()"
                  :style="{
                    transform: 'rotate(' + (showThreeChild ? -180 : 0) + 'deg)'
                  }"
                  :src="require('./../image/arrow_icon_down.png')"
                  alt=""
                />
              </div>
              <div
                class="item-wrap item-wrap-three"
                :style="{
                  height: showThreeChild ? '260px' : 0,
                  overflow: showThreeChild ? 'auto' : 'hidden'
                }"
              >
                <div class="select-item" v-for="(item, index) in selectList" :key="index">
                  <img
                    class="status"
                    @click="onCheckboxChange(item)"
                    :src="
                      item?.isSelect === 1
                        ? require('./../image/select_icon_active.png')
                        : item?.isSelect === 0
                        ? require('./../image/select_icon_empty.png')
                        : require('./../image/select_icon_selecting.png')
                    "
                    alt=""
                  />
                  <span :style="{ background: item.color }"></span>
                  <p>{{ item?.name }}</p>
                  <img
                    class="arrow"
                    v-if="item.children?.length"
                    @click="onArrowChange(item)"
                    :style="{
                      transform: 'rotate(' + (item.showChild ? -180 : 0) + 'deg)'
                    }"
                    :src="require('./../image/arrow_icon_down.png')"
                    alt=""
                  />
                  <div
                    @click.stop
                    class="children-box"
                    :style="{
                      '--children-box-height': item.showChild ? 40 * (item.children.length + 1) : 0
                    }"
                  >
                    <div class="children-item" v-for="child in item.children" :key="child.name">
                      <img
                        class="status"
                        @click.stop="onCheckboxChange(child)"
                        :src="
                          child?.isSelect === 1
                            ? require('./../image/select_icon_active.png')
                            : child?.isSelect === 0
                            ? require('./../image/select_icon_empty.png')
                            : require('./../image/select_icon_selecting.png')
                        "
                        alt=""
                      />
                      <p>{{ child.name }}</p>
                    </div>
                    <div class="close-btn" @click="item.showChild = false">
                      <img v-show="item.showChild" :src="require('./../image/select_close.png')" alt="" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="select-title">
                非粮化图斑
                <el-switch v-model="flhtb" inline-prompt active-text="打开" inactive-text="关闭" active-color="#4EC2FF" inactive-color="#30587E" />
              </div>
              <div class="select-title">
                清理腾退
                <el-switch v-model="isClean" inline-prompt active-text="打开" inactive-text="关闭" active-color="#4EC2FF" inactive-color="#30587E" />
              </div>
              <div class="select-title">
                优化补入
                <el-switch v-model="isCompensate" inline-prompt active-text="打开" inactive-text="关闭" active-color="#4EC2FF" inactive-color="#30587E" />
              </div>
            </div>
          </div>
        </div>
        <div class="seconde-title">
          <img class="icon" src="https://img.hzanchu.com/acimg/7173dac75488eebc40f27270cbd155e1.png" alt="" />
          <span>物联网设备</span>
          <img
            class="arrow"
            @click="showWebChild = !showWebChild"
            :style="{
              transform: 'rotate(' + (showWebChild ? -180 : 0) + 'deg)'
            }"
            :src="require('./../image/arrow_icon_down.png')"
            alt=""
          />
        </div>
        <div
          :style="{
            height: showWebChild ? '72px' : 0,
            overflow: 'hidden'
          }"
        >
          <div class="select-box">
            <div class="item-wrap">
              <div class="select-item" v-for="(item, index) in WebOfThingsList" :key="index">
                <img
                  class="status"
                  @click="onCheckboxChange(item)"
                  :src="
                    item?.isSelect === 1
                      ? require('./../image/select_icon_active.png')
                      : item?.isSelect === 0
                      ? require('./../image/select_icon_empty.png')
                      : require('./../image/select_icon_selecting.png')
                  "
                  alt=""
                />
                <span :style="{ background: item.color }"></span>
                <p>{{ item?.name }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <module-title title="产业" :showThreeChild="showIndustryChild" :isPackUp="true" @sendPankUpMessage="sendPankUpMessage" /> -->
      <div
        :style="{
          height: tabList[1].isSelect ? 'auto' : 0,
          overflow: tabList[1].isSelect ? 'auto' : 'hidden',
          paddingTop: tabList[1].isSelect ? '10px' : 0,
          boxSizing: 'border-box'
        }"
      >
        <!-- <div class="switch-box"> -->
        <!-- <span style="background: #006ff0"></span>
        <p>产业基地</p>
        <el-switch
          v-model="isSelectBaseAll" 改成单选 无全选按钮
          inline-prompt
          active-text="打开"
          inactive-text="关闭"
          active-color="#4EC2FF"
          inactive-color="#30587E"
          @change="onBaseChange"
        />
      </div> -->
        <div class="select-box">
          <div class="item-wrap">
            <div class="select-item" v-for="(item, index) in baseList" v-show="item.isShow" :key="index">
              <img
                class="status"
                v-if="item?.name !== '竹子'"
                @click="onBaseCheckboxChange(item, 'baseList')"
                :src="item?.isSelect ? 'https://img.hzanchu.com/acimg/634f714268ba500435a4d53986deb7d8.png' : 'https://img.hzanchu.com/acimg/c648bb8778c071d65facbc0a3b98ebad.png'"
                alt=""
              />
              <span :style="{ background: item.color, marginLeft: item?.name == '竹子' ? '32px' : '' }"></span>
              <p>{{ item?.name }}</p>
              <img
                class="arrow"
                v-if="item.children?.length"
                @click="onArrowChange(item)"
                :style="{
                  transform: 'rotate(' + (item.showChild ? -180 : 0) + 'deg)'
                }"
                :src="require('./../image/arrow_icon_down.png')"
                alt=""
              />
              <div
                @click.stop
                class="children-box"
                :style="{
                  '--children-box-height': item.showChild ? 40 * (item.children.length + 1) : 0
                }"
              >
                <div class="children-item" v-for="child in item.children" :key="child.name">
                  <img
                    class="status"
                    @click.stop="onBaseCheckboxChange(child, 'baseList')"
                    :src="child?.isSelect ? 'https://img.hzanchu.com/acimg/634f714268ba500435a4d53986deb7d8.png' : 'https://img.hzanchu.com/acimg/c648bb8778c071d65facbc0a3b98ebad.png'"
                    alt=""
                  />
                  <p>{{ child.name }}</p>
                </div>
                <div class="close-btn" @click="item.showChild = false">
                  <img v-show="item.showChild" :src="require('./../image/select_close.png')" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <module-title title="农村"  :showThreeChild="showVillageChild" :isPackUp="true" @sendPankUpMessage="sendPankUpMessage"/> -->
      <div
        :style="{
          height: tabList[2].isSelect ? 'auto' : 0,
          overflow: tabList[2].isSelect ? 'auto' : 'hidden'
        }"
      >
        <div v-for="[key, item] in Object.entries(villageLayers)" v-show="item.isShow" :key="key" :class="Array.isArray(item.child) ? 'village-box' : 'switch-box'">
          <div :class="Array.isArray(item.child) ? 'switch-box' : ''">
            <p>{{ key }}</p>
            <img
              class="arrow"
              v-if="Array.isArray(item.child)"
              @click="isShowVillageChild = !isShowVillageChild"
              :style="{
                transform: 'rotate(' + (isShowVillageChild ? -180 : 0) + 'deg)'
              }"
              :src="require('./../image/arrow_icon_down.png')"
              alt=""
            />
          </div>
          <div
            :style="{
              height: isShowVillageChild ? 'auto' : 0,
              overflow: isShowVillageChild ? 'auto' : 'hidden'
            }"
            v-if="Array.isArray(item.child)"
          >
            <div class="select-box">
              <div class="item-wrap">
                <div class="select-item" v-for="(items, indexs) in villageChildLayers" :key="indexs">
                  <img
                    class="status"
                    @click="onVillageLayerChange(items.name, items)"
                    :src="items?.isSelect ? 'https://img.hzanchu.com/acimg/634f714268ba500435a4d53986deb7d8.png' : 'https://img.hzanchu.com/acimg/c648bb8778c071d65facbc0a3b98ebad.png'"
                    alt=""
                  />
                  <span :style="{ background: items?.color }"></span>
                  <p>{{ items.name }}</p>
                </div>
              </div>
            </div>
            <!-- <div  v-for="([keys, items]) in Object.entries(villageChildLayers)" :key="keys"  class="switch-box" >
          <p>{{keys}}</p>
          <el-switch
            v-model="items.checked"
            inline-prompt
            active-text="打开"
            inactive-text="关闭"
            active-color="#4EC2FF"
            inactive-color="#30587E"
            @change="onVillageLayerChange(keys, items)"
          />
          </div> -->
          </div>
          <el-switch
            v-if="!Array.isArray(item.child)"
            v-model="item.checked"
            inline-prompt
            active-text="打开"
            inactive-text="关闭"
            active-color="#4EC2FF"
            inactive-color="#30587E"
            @change="onVillageLayerChange(key, item)"
          />
        </div>
      </div>
      <!-- <module-title title="农民" :showThreeChild="showPeasantChild" :isPackUp="true" @sendPankUpMessage="sendPankUpMessage"/> -->
      <div
        :style="{
          height: tabList[3].isSelect ? 'auto' : 0,
          overflow: tabList[3].isSelect ? 'auto' : 'hidden'
        }"
      >
        <div v-for="[key, item] in Object.entries(peasantLayers)" :key="key" class="switch-box">
          <p>{{ key }}</p>
          <el-switch v-model="item.checked" inline-prompt active-text="打开" inactive-text="关闭" active-color="#4EC2FF" inactive-color="#30587E" />
        </div>
      </div>
    </div>
    <div v-if="activeLayerCategoryTab === '专题图层'">
      <!-- <module-title title="人口分布" :showThreeChild="LineChild" :isPackUp="true" @sendPankUpMessage="sendPankUpMessage" />
      
      <module-title title="交通出行" :showThreeChild="LineChild" :isPackUp="true" @sendPankUpMessage="sendPankUpMessage" />
      <module-title title="四明红资源" :showThreeChild="LineChild" :isPackUp="true" @sendPankUpMessage="sendPankUpMessage" />
       <div class="seconde-title" style="margin-top: 20px">
          <img class="icon" src="https://img.hzanchu.com/acimg/6eba4ecee81d43654df509ca7c531b68.png" alt="" />
          <span>红色资源</span>
        </div>
         <div class="seconde-title" style="margin-top: 20px">
          <img class="icon" src="https://img.hzanchu.com/acimg/6eba4ecee81d43654df509ca7c531b68.png" alt="" />
          <span>绿色资源</span>
        </div>
         <div class="seconde-title" style="margin-top: 20px">
          <img class="icon" src="https://img.hzanchu.com/acimg/6eba4ecee81d43654df509ca7c531b68.png" alt="" />
          <span>特色资源</span>
        </div> -->
      <module-title title="生产力布局" :showThreeChild="showProductivityChild" :isPackUp="true" @sendPankUpMessage="sendPankUpMessage" />
      <div
        :style="{
          height: showProductivityChild ? 'auto' : 0,
          overflow: showProductivityChild ? 'auto' : 'hidden',
          marginBottom: '23px'
        }"
      >
        <div class="switch-box">
          <!-- <span style="background: #ff1493"></span> -->
          <p>总布局</p>
          <el-switch v-model="ZBJ" inline-prompt active-text="打开" inactive-text="关闭" active-color="#4EC2FF" @change="changeZBJ" inactive-color="#30587E" />
        </div>
        <div class="seconde-title" style="margin-top: 20px">
          <img class="icon" src="https://img.hzanchu.com/acimg/6eba4ecee81d43654df509ca7c531b68.png" alt="" />
          <span>粮食</span>
          <img
            class="arrow"
            @click="showCerealChild = !showCerealChild"
            :style="{
              transform: 'rotate(' + (showCerealChild ? -180 : 0) + 'deg)'
            }"
            :src="require('./../image/arrow_icon_down.png')"
            alt=""
          />
        </div>
        <div
          :style="{
            height: showCerealChild ? 'auto' : 0,
            overflow: showCerealChild ? 'auto' : 'hidden',
            marginBottom: '23px'
          }"
        >
          <div class="select-box">
            <div class="select-item" v-for="(item, index) in cerealList" :key="index">
              <img
                class="status"
                @click="onCheckboxChange(item)"
                :src="
                  item?.isSelect === 1
                    ? require('./../image/select_icon_active.png')
                    : item?.isSelect === 0
                    ? require('./../image/select_icon_empty.png')
                    : require('./../image/select_icon_selecting.png')
                "
                alt=""
              />
              <span :style="{ background: item.color }"></span>
              <p>{{ item?.name }}</p>
            </div>
          </div>
        </div>
        <div class="seconde-title" style="margin-top: 20px">
          <img class="icon" src="https://img.hzanchu.com/acimg/f948ef17153b0f7dd563833195a22f79.png" alt="" />
          <span>畜牧</span>
          <img
            class="arrow"
            @click="showRaiseLivestockChild = !showRaiseLivestockChild"
            :style="{
              transform: 'rotate(' + (showRaiseLivestockChild ? -180 : 0) + 'deg)'
            }"
            :src="require('./../image/arrow_icon_down.png')"
            alt=""
          />
        </div>
        <div
          :style="{
            height: showRaiseLivestockChild ? 'auto' : 0,
            overflow: showRaiseLivestockChild ? 'auto' : 'hidden',
            marginBottom: '23px'
          }"
        >
          <div class="select-box">
            <div class="select-item" v-for="(item, index) in raiseLivestockList" :key="index">
              <img
                class="status"
                @click="onCheckboxChange(item)"
                :src="
                  item?.isSelect === 1
                    ? require('./../image/select_icon_active.png')
                    : item?.isSelect === 0
                    ? require('./../image/select_icon_empty.png')
                    : require('./../image/select_icon_selecting.png')
                "
                alt=""
              />
              <span :style="{ background: item.color }"></span>
              <p>{{ item?.name }}</p>
            </div>
          </div>
        </div>
        <div class="seconde-title" style="margin-top: 20px">
          <img class="icon" src="https://img.hzanchu.com/acimg/6ab72d6a19e48374d18e89bfb20d14ee.png" alt="" />
          <span>水产</span>
          <img
            class="arrow"
            @click="showAquaticProductChild = !showAquaticProductChild"
            :style="{
              transform: 'rotate(' + (showAquaticProductChild ? -180 : 0) + 'deg)'
            }"
            :src="require('./../image/arrow_icon_down.png')"
            alt=""
          />
        </div>
        <div
          :style="{
            height: showAquaticProductChild ? 'auto' : 0,
            overflow: showAquaticProductChild ? 'auto' : 'hidden',
            marginBottom: '23px'
          }"
        >
          <div class="select-box">
            <div class="select-item" v-for="(item, index) in aquaticProductList" :key="index">
              <img
                class="status"
                @click="onCheckboxChange(item)"
                :src="
                  item?.isSelect === 1
                    ? require('./../image/select_icon_active.png')
                    : item?.isSelect === 0
                    ? require('./../image/select_icon_empty.png')
                    : require('./../image/select_icon_selecting.png')
                "
                alt=""
              />
              <span :style="{ background: item.color }"></span>
              <p>{{ item?.name }}</p>
            </div>
          </div>
        </div>
        <div class="seconde-title" style="margin-top: 20px">
          <img class="icon" src="https://img.hzanchu.com/acimg/60f183302606640e6722b04f4d097bcc.png" alt="" />
          <span>蔬菜</span>
          <img
            class="arrow"
            @click="showVegetableChild = !showVegetableChild"
            :style="{
              transform: 'rotate(' + (showVegetableChild ? -180 : 0) + 'deg)'
            }"
            :src="require('./../image/arrow_icon_down.png')"
            alt=""
          />
        </div>
        <div
          :style="{
            height: showVegetableChild ? 'auto' : 0,
            overflow: showVegetableChild ? 'auto' : 'hidden',
            marginBottom: '23px'
          }"
        >
          <div class="select-box">
            <div class="select-item" v-for="(item, index) in vegetableList" :key="index">
              <img
                class="status"
                @click="onCheckboxChange(item)"
                :src="
                  item?.isSelect === 1
                    ? require('./../image/select_icon_active.png')
                    : item?.isSelect === 0
                    ? require('./../image/select_icon_empty.png')
                    : require('./../image/select_icon_selecting.png')
                "
                alt=""
              />
              <span :style="{ background: item.color }"></span>
              <p>{{ item?.name }}</p>
            </div>
          </div>
        </div>
        <div class="seconde-title" style="margin-top: 20px">
          <img class="icon" src="https://img.hzanchu.com/acimg/61aa6f4eeb098d7feb9f18591b51a6b0.png" alt="" />
          <span>食用植物油</span>
          <img
            class="arrow"
            @click="showFoodVegetableOilChild = !showFoodVegetableOilChild"
            :style="{
              transform: 'rotate(' + (showFoodVegetableOilChild ? -180 : 0) + 'deg)'
            }"
            :src="require('./../image/arrow_icon_down.png')"
            alt=""
          />
        </div>
        <div
          :style="{
            height: showFoodVegetableOilChild ? 'auto' : 0,
            overflow: showFoodVegetableOilChild ? 'auto' : 'hidden',
            marginBottom: '23px'
          }"
        >
          <div class="select-box">
            <div class="select-item" v-for="(item, index) in foodVegetableOilList" :key="index">
              <img
                class="status"
                @click="onCheckboxChange(item)"
                :src="
                  item?.isSelect === 1
                    ? require('./../image/select_icon_active.png')
                    : item?.isSelect === 0
                    ? require('./../image/select_icon_empty.png')
                    : require('./../image/select_icon_selecting.png')
                "
                alt=""
              />
              <span :style="{ background: item.color }"></span>
              <p>{{ item?.name }}</p>
            </div>
          </div>
        </div>
      </div>
      <module-title title="农业经营主体" :showThreeChild="AgriculturalBusinessEntityChild" :isPackUp="true" @sendPankUpMessage="sendPankUpMessage" />
      <div
        :style="{
          height: AgriculturalBusinessEntityChild ? 'auto' : 0,
          overflow: AgriculturalBusinessEntityChild ? 'auto' : 'hidden',
          marginBottom: '23px'
        }"
      >
        <div class="select-box">
          <div class="item-wrap">
            <div class="select-item" v-for="(item, index) in featureVillageList" :key="index">
              <img
                class="status"
                @click="onBaseCheckboxChange(item, 'featureVillageList')"
                :src="item?.isSelect ? 'https://img.hzanchu.com/acimg/634f714268ba500435a4d53986deb7d8.png' : 'https://img.hzanchu.com/acimg/c648bb8778c071d65facbc0a3b98ebad.png'"
                alt=""
              />
              <span :style="{ background: item.color }"></span>
              <p>{{ item?.name }}</p>
              <img
                class="arrow"
                v-if="item.children?.length"
                @click="onArrowChange(item)"
                :style="{
                  transform: 'rotate(' + (item.showChild ? -180 : 0) + 'deg)'
                }"
                :src="require('./../image/arrow_icon_down.png')"
                alt=""
              />
              <div
                @click.stop
                class="children-box"
                :style="{
                  '--children-box-height': item.showChild ? 40 * (item.children.length + 1) : 0
                }"
              >
                <div class="children-item" v-for="child in item.children" :key="child.name">
                  <img
                    class="status"
                    @click.stop="onBaseCheckboxChange(item, 'featureVillageList')"
                    :src="
                      child?.isSelect ? require('./../image/select_icon_active.png') : !child?.isSelect ? require('./../image/select_icon_empty.png') : require('./../image/select_icon_selecting.png')
                    "
                    alt=""
                  />
                  <p>{{ child.name }}</p>
                </div>
                <div class="close-btn" @click="item.showChild = false">
                  <img v-show="item.showChild" :src="require('./../image/select_close.png')" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <module-title :title="!isFengHua ? '乡村旅游精品线路' : '乡村旅游'" :showThreeChild="LineChild" :isPackUp="true" @sendPankUpMessage="sendPankUpMessage" />
      <div
        :style="{
          height: LineChild ? 'auto' : 0,
          overflow: LineChild ? 'auto' : 'hidden',
          marginBottom: '23px'
        }"
      >
        <div class="select-box" v-if="!isFengHua">
          <div class="select-item" v-for="(item, index) in yearList" :key="index">
            <img
              class="status"
              @click="onCheckboxChange(item)"
              :src="
                item?.isSelect === 1
                  ? require('./../image/select_icon_active.png')
                  : item?.isSelect === 0
                  ? require('./../image/select_icon_empty.png')
                  : require('./../image/select_icon_selecting.png')
              "
              alt=""
            />
            <span></span>
            <p>{{ item?.name }}</p>
          </div>
        </div>
        <div class="select-box" v-if="isFengHua">
          <div class="select-item" v-for="(item, index) in travelList" :key="index">
            <img
              class="status"
              @click="trvalSelected(item)"
              :src="
                item?.isSelect === 1
                  ? require('./../image/select_icon_active.png')
                  : item?.isSelect === 0
                  ? require('./../image/select_icon_empty.png')
                  : require('./../image/select_icon_selecting.png')
              "
              alt=""
            />
            <img class="travel-icon" :src="item.icon" alt="" />
            <p>{{ item?.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, reactive, defineExpose, ref, watch, computed, watchEffect } from 'vue'
import moduleTitle from '@/components/moduleTitle'
import { klona } from 'klona'
import { forEach } from 'lodash-es'
import lodash from 'lodash'
import moment from 'moment'

const emit = defineEmits(['getTravelSelectData', 'sendMessage', 'onTabChange', 'getThematicLayerData', 'getVillageLayers'])
// tab
const activeLayerCategoryTab = ref('基础图层') // 产业 · 资源/农民 · 农村
const isFengHua = ref(window.location.search.split('area=')[1] === 'fenghua') // 是否为奉化驾驶舱
const showResourceChild = ref(false) // 资源
const showIndustryChild = ref(false) // 产业
const showVillageChild = ref(false) // 农村
const isShowVillageChild = ref(false) // 农村子项
const showPeasantChild = ref(false) // 农民
const showLandChild = ref(true) // 土地
const showTallLevelChild = ref(false) // 土地
const showTallLevelChildPermanent = ref(false)
const showProductionChild = ref(false) // 土地
const showWebChild = ref(false) // 物联网
const showRaiseLivestockChild = ref(false) // 畜牧
const showCerealChild = ref(false) // 粮食
const showAquaticProductChild = ref(false) // 水产
const showVegetableChild = ref(false) // 蔬菜
const showFoodVegetableOilChild = ref(false) // 食用植物油
const showProductivityChild = ref(false) // 生产力布局
const AgriculturalBusinessEntityChild = ref(false) // 农业经营主体
const LineChild = ref(false) // 当前精品线路图展示
const yearList = ref([{ name: 2022, isSelect: 0 }])
const travelList = ref([
  { name: '2022精品旅游路线', isSelect: 0, icon: 'https://img.hzanchu.com/acimg/1b241e2f368187f7fdc18379aa502f0b.png' },
  { name: '景区', isSelect: 0, icon: 'https://img.hzanchu.com/acimg/ec572cb16d1ed84ee02ea8ef8f11a022.png' },
  { name: '旅行社', isSelect: 0, icon: 'https://img.hzanchu.com/acimg/b72605a11c45b4148edc92ca8a40978c.png' },
  { name: '酒店', isSelect: 0, icon: 'https://img.hzanchu.com/acimg/95f98cd25e6a829d8dafd137def2d2d8.png' },
  { name: '餐馆', isSelect: 0, icon: 'https://img.hzanchu.com/acimg/375e4cee27c1ac0c8f57adaba11cfd2a.png' },
  { name: '景点旅游路线', isSelect: 0, icon: 'https://img.hzanchu.com/acimg/1b241e2f368187f7fdc18379aa502f0b.png' },
  { name: '农家乐', isSelect: 0, icon: 'https://img.hzanchu.com/acimg/f3568e8ab3258ab78bb821ae708de188.png' },
  { name: '购物商店', isSelect: 0, icon: 'https://img.hzanchu.com/acimg/cddf015a5a989529b2750b4aa3561024.png' }
])
const isShowAgriculturalBusinessEntityChild = ref({
  artel: true, //合作社
  familyFarm: true, //家庭农场
  agriculturalEnterprise: true, //农业企业
  richFamily: true, //大户
  NJL: true, //农家乐
  other: true //其他
}) // 农业经营主体子项
const activeModule = ref(true)
const selectValueList = ref([])
const activePeasant = ref(false) // 农民选中
const tabList = ref([
  { name: '资源', isSelect: true },
  { name: '产业', isSelect: false },
  { name: '农村', isSelect: false },
  { name: '农民', isSelect: false }
])
// ====
const isSelectAll = ref(true) // 粮功区
const isSelectBaseAll = ref(true) // 产业基地
const isClean = ref(false) // 清理腾退
const isCompensate = ref(false) // 优化补入
const gd = ref(false) // 耕地
const ZBJ = ref(false) // 总布局
const sd = ref(false) // 水稻
const xm = ref(false) // 小麦
const wlwsb = ref(true) // 物联网设备
const ygjbnt = ref(false) // 永久基本农田
const flhtb = ref(false) // 非粮化图斑
const gbznt = ref(false) // 高标准农田
const initialData = {
  selectList: [
    {
      name: '耕地',
      color: '#71D964',
      isSelect: 0,
      showChild: false,
      children: [
        { name: '水田', isSelect: 0 },
        { name: '旱地', isSelect: 0 }
      ]
    },
    {
      name: '种植园用地',
      color: '#38D672',
      isSelect: 0,
      showChild: false,
      children: [
        { name: '果园', isSelect: 0 },
        { name: '茶园', isSelect: 0 },
        { name: '其他园地', isSelect: 0 }
      ]
    },
    {
      name: '林地',
      color: '#18CC00',
      isSelect: 0,
      showChild: false,
      children: [
        { name: '乔木林地', isSelect: 0 },
        { name: '竹林地', isSelect: 0 },
        { name: '灌木林地', isSelect: 0 },
        { name: '其他林地', isSelect: 0 }
      ]
    },
    {
      name: '其他农业用地',
      color: '#009942',
      isSelect: 0,
      showChild: false,
      children: [
        { name: '其他土地', isSelect: 0 },
        { name: '可调整乔木林地', isSelect: 0 },
        { name: '可调整其他园地', isSelect: 0 },
        { name: '可调整其他林地', isSelect: 0 },
        { name: '可调整养殖坑塘', isSelect: 0 },
        { name: '可调整果园', isSelect: 0 },
        { name: '可调整茶园', isSelect: 0 },
        { name: '坑塘水面', isSelect: 0 },
        { name: '水库水面', isSelect: 0 },
        { name: '沟渠', isSelect: 0 },
        { name: '设施农用地', isSelect: 0 }
      ]
    },
    {
      name: '农村道路',
      color: '#26B4FD',
      isSelect: 0
    },
    {
      name: '河流水面',
      color: '#22D0D0',
      isSelect: 0
    },
    {
      name: '公路用地',
      color: '#9389FC',
      isSelect: 0
    },
    {
      name: '农村宅基地',
      color: '#C3BB27',
      isSelect: 0
    },
    {
      name: '工业用地',
      color: '#FD9C48',
      isSelect: 0
    },
    {
      name: '其他',
      color: '#FD642C',
      isSelect: 0,
      showChild: false,
      children: [
        { name: '交通服务场站用地', isSelect: 0 },
        { name: '公园与绿地', isSelect: 0 },
        { name: '公用设施用地', isSelect: 0 },
        { name: '其他草地', isSelect: 0 },
        { name: '养殖坑塘', isSelect: 0 },
        { name: '内陆滩涂', isSelect: 0 },
        { name: '商业服务业设施用地', isSelect: 0 },
        { name: '城镇住宅用地', isSelect: 0 },
        { name: '城镇村道路用地', isSelect: 0 },
        { name: '广场用地', isSelect: 0 },
        { name: '机关团体新闻出版用地', isSelect: 0 },
        { name: '水工建筑用地', isSelect: 0 },
        { name: '沿海滩涂', isSelect: 0 },
        { name: '物流仓储用地', isSelect: 0 },
        { name: '特殊用地', isSelect: 0 },
        { name: '科教文卫用地', isSelect: 0 },
        { name: '管道运输用地', isSelect: 0 },
        { name: '轨道交通用地', isSelect: 0 },
        { name: '采矿用地', isSelect: 0 },
        { name: '铁路用地', isSelect: 0 }
      ]
    }
  ],
  WebOfThingsList: [
    {
      name: '基地',
      // color: "#DE5887",
      isSelect: 0
    },
    {
      name: '铁塔',
      // color: "#A8325B",
      isSelect: 0
    }
  ],
  permanentFarmingList: [
    {
      name: '耕地内永农',
      color: '#9FAA45',
      isSelect: 0
    },
    {
      name: '耕地外永农',
      color: '#73BA74',
      isSelect: 0
    }
  ],
  farmingList: [
    {
      name: '耕地内高标农',
      color: '#A7BF1F',
      isSelect: 0
    },
    {
      name: '耕地外高标农',
      color: '#44A0CC',
      isSelect: 0
    },
    {
      name: '永农内高标农',
      color: '#BFA51F',
      isSelect: 0
    },
    {
      name: '永农外高标农',
      color: '#CC8A1F',
      isSelect: 0
    },
    {
      name: '同时在耕地、永农内高标农',
      color: '#FD7E3F',
      isSelect: 0
    },
    {
      name: '粮功区外高标农',
      color: '#C85C9D',
      isSelect: 0
    },
    {
      name: '高标农内粮功区',
      color: '#DE5887',
      isSelect: 0
    }
  ],
  baseList: [
    {
      name: '粮食',
      isShow: true,
      isSelect: 0
    },
    {
      name: '蔬菜',
      isShow: true,
      color: '#FFA8A8',
      isSelect: 0
    },
    {
      name: '畜牧',
      color: '#E6A3FF',
      isShow: true,
      isSelect: 0
    },
    {
      name: '水产',
      color: '#FEC561',
      isShow: true,
      isSelect: 0
    },
    {
      name: '水果',
      isShow: true,
      isSelect: 0,
      showChild: false,
      children: [
        {
          name: '水蜜桃',
          isSelect: 0
        }
      ]
    },
    {
      name: '茶叶',
      color: '#9EFD6B',
      isShow: true,
      isSelect: 0
    },
    {
      name: '农家乐',
      color: '#FFFF00',
      isShow: true,
      isSelect: 0
    },
    {
      name: '农产品加工',
      color: '#00BFFF',
      isShow: true,
      isSelect: 0
    },
    {
      name: '竹子',
      color: '#A7BF1F',
      isSelect: 0,
      showChild: false,
      isShow: isFengHua.value,
      children: [
        {
          name: '毛竹',
          isSelect: 0
        },
        {
          name: '杂竹',
          isSelect: 0
        }
      ]
    },
    {
      name: '花卉苗木',
      color: '#44A0CC',
      isShow: isFengHua.value,
      isSelect: 0
    }
    // {
    //   name: "食用植物油",
    //   isSelect: 0,
    // },
  ],
  featureVillageList: [
    {
      name: '合作社',
      color: '#FF984C',
      isSelect: 0
    },
    {
      name: '家庭农场',
      color: '#22DAD7',
      isSelect: 0
    },
    {
      name: '农业企业',
      color: '#3C81FF',
      isSelect: 0
    },
    {
      name: '大户',
      color: '#C773FF',
      isSelect: 0
    },
    {
      name: '农家乐',
      color: '#FFFF00',
      isSelect: 0
    },
    {
      name: '其他',
      color: '#69EF68',
      isSelect: 0
    }
  ],
  cerealList: [
    {
      name: '小麦',
      color: '#A7BF1F',
      isSelect: 0
    },
    {
      name: '水稻',
      color: '#63CC2B',
      isSelect: 0
    }
  ],
  raiseLivestockList: [
    {
      name: '宁海岔路黑猪',
      color: '#BA8DCB',
      isSelect: 0
    },
    {
      name: '宁海县土鸡',
      color: '#C577E5',
      isSelect: 0
    },
    {
      name: '象山白鹅',
      color: '#B542E5',
      isSelect: 0
    },
    {
      name: '慈溪蜜蜂',
      color: '#9C88EF',
      isSelect: 0
    },
    {
      name: '余姚蜜蜂',
      color: '#8062FB',
      isSelect: 0
    },
    {
      name: '余姚番鸭',
      color: '#5A45B2',
      isSelect: 0
    },
    {
      name: '江北奶牛',
      color: '#A67996',
      isSelect: 0
    },
    {
      name: '镇海鹌鹑',
      color: '#CE5FA4',
      isSelect: 0
    },
    {
      name: '余姚家禽',
      color: '#BF3B8D',
      isSelect: 0
    }
  ],
  aquaticProductList: [
    {
      name: '水产总布局',
      color: '#9FAA45',
      isSelect: 0
    },
    {
      name: '特色水产品养殖区域布局',
      color: '#73BA74',
      isSelect: 0
    }
  ],
  vegetableList: [
    {
      name: '蔬菜总布局',
      color: '#C85C9D',
      isSelect: 0
    },
    {
      name: '特色品种区域布局',
      color: '#AD6A63',
      isSelect: 0
    }
  ],
  foodVegetableOilList: [
    {
      name: '油菜籽重点乡镇',
      color: '#44A0CC',
      isSelect: 0
    },
    {
      name: '油茶重点乡镇',
      color: '#1070F4',
      isSelect: 0
    }
  ]
}
// const reset = () => {
//   isSelectAll.value = true;
//   isSelectBaseAll.value = true;
//   isClean.value = false;
//   isCompensate.value = false;
//   flhtb.value = false;
//   gbznt.value = false;
//   //
//   selectList.value = initialData.selectList;
//   farmingList.value = initialData.farmingList;
//   baseList.value = initialData.baseList;
// //
//   showThreeChild.value = false;
//   console.log('resetting')
// }

const permanentFarmingList = ref(klona(initialData.permanentFarmingList))
const selectList = ref(klona(initialData.selectList))
const raiseLivestockList = ref(klona(initialData.raiseLivestockList))
const cerealList = ref(klona(initialData.cerealList))
const aquaticProductList = ref(klona(initialData.aquaticProductList))
const vegetableList = ref(klona(initialData.vegetableList))
const foodVegetableOilList = ref(klona(initialData.foodVegetableOilList))
const farmingList = ref(klona(initialData.farmingList))
const WebOfThingsList = ref(klona(initialData.WebOfThingsList)) // 互联网设备
const baseList = ref(klona(initialData.baseList))
const featureVillageList = ref(klona(initialData.featureVillageList))
const showThreeChild = ref(false)
// 选中的地块并且需要在右侧展示的数据
const state = reactive({
  list: []
})

/*
 *   高标准农田内、外粮功区 点击要求
 *   1 粮功区 打开
 *   2 高标准农田 打开
 * */
const onCheckboxChange = (item, stop) => {
  if (stop) {
    if (isSelectAll.value && gbznt.value) onCheckboxChange(item)
    return
  }
  item.isSelect = item.isSelect === 1 ? 0 : 1
  if (item?.children?.length) {
    item.children.map((child) => {
      child.isSelect = item.isSelect
    })
  }
  if (item.name == '新时代美丽乡村达标村') {
    activePeasant.value = item.isSelect
    emit('getThematicLayerData', []) // 关闭生产力布局-总布局图片
    ZBJ.value = false // 关闭生产力布局-总布局按钮
  }
  if (['耕地内永农', '耕地外永农', '高标农', '耕地内高标农', '耕地外高标农', '永农内高标农', '永农外高标农', '同时在耕地、永农内高标农', '粮功区外高标农', '高标农内粮功区'].includes(item.name)) {
    const oldData = lodash.cloneDeep(state.list)
    if (item.isSelect === 1) {
      // 选中
      oldData.push(item.name)
    } else {
      // 取消选中
      oldData.splice(oldData.indexOf(item.name), 1)
    }
    state.list = oldData
    // console.log('state.list------------',state.list);
    emit('checkBoxChange', state.list)
    onEmit()
  }
}
const onFarmingChange = () => {
  selectList.value.map((item) => {
    item.isSelect = isSelectAll.value ? 1 : 0
    if (item.children?.length) {
      item.children.map((child) => {
        child.isSelect = isSelectAll.value ? 1 : 0
      })
    }
  })
  // if (!isSelectAll.value || !gbznt.value) {
  //   farmingList.value.map((item) => {
  //     item.isSelect = 0
  //   })
  // }
}
const onBaseChange = () => {
  baseList.value.map((item) => {
    item.isSelect = isSelectBaseAll.value ? 1 : 0
    if (item.children?.length) {
      item.children.map((child) => {
        child.isSelect = isSelectBaseAll.value ? 1 : 0
      })
    }
  })
  if (!isSelectBaseAll.value) {
    baseList.value.map((item) => {
      item.isSelect = 0
    })
  }
}
const onBaseCheckboxChange = (items, type) => {
  // 产业选中
  const newData = JSON.parse(JSON.stringify(type == 'featureVillageList' ? featureVillageList.value : baseList.value))
  const newArr = []
  newData.forEach((item) => {
    if (items.name == item.name) {
      item.isSelect = !item.isSelect
    } else {
      item.isSelect = 0
      // 子级选中
      if (Array.isArray(item.children) && item.children.length > 0) {
        item.children.forEach((childrenItem) => {
          if (childrenItem.name == items.name) {
            childrenItem.isSelect = !items.isSelect
          } else {
            childrenItem.isSelect = 0
          }
        })
      }
    }
    newArr.push(item)
  })
  if (type != 'featureVillageList') baseList.value = newArr
  if (type == 'featureVillageList') featureVillageList.value = newArr
  // if (["粮食", "水蜜桃"].includes(items.name)) { // 面需要单独处理
  //   console.log(items)
  // } else {

  // }
  // items.isSelect = !items.isSelect;
  // if (baseList.value.filter(v => v.isSelect).length == 3) { // 产业改成单选 全选按钮隐藏
  //   isSelectBaseAll.value = true
  // } else {
  //   isSelectBaseAll.value = false
  // }
}
const onArrowChange = (item) => {
  item.showChild = !item.showChild
}
const onThreeArrowChange = () => {
  showThreeChild.value = !showThreeChild.value
}
const tabChange = (index) => {
  // tab选中
  const array = JSON.parse(JSON.stringify(tabList.value))
  // if (array[index].name === '农民') return;  //农民暂时无功能
  array.forEach((item) => {
    if (item.name != array[index].name) item.isSelect = false
  })
  array[index].isSelect = !array[index].isSelect
  tabList.value = array
  if ([0, 1].includes(index) && array[index].isSelect) emit('setTab', index + 1)
  if (index == 2 && array[index].isSelect) {
    // 选中农村时 主动打开农村模块地图
    activePeasant.value = true
  } else {
    activePeasant.value = false
  }
}
const sendPankUpMessage = (item) => {
  // 控制一级title展示-隐藏
  switch (item.key) {
    case '资源':
      showResourceChild.value = item.value.type
      break
    case '产业':
      showIndustryChild.value = item.value.type
      break
    case '农村':
      showVillageChild.value = item.value.type
      break
    case '农民':
      showPeasantChild.value = item.value.type
      break
    case '生产力布局':
      showProductivityChild.value = item.value.type
      break
    case '农业经营主体':
      AgriculturalBusinessEntityChild.value = item.value.type
      break
    case '乡村旅游精品线路':
      LineChild.value = item.value.type
      break
    case '乡村旅游':
      LineChild.value = item.value.type
      activeModule.value = '农民-农村'
      emit(
        'getTravelSelectData',
        travelList.value.filter((item) => item.isSelect).map((item) => item.name),
        item.value.type
      )
      break
  }
}
// 村庄
const villageChildLayers = ref([
  {
    name: '新时代美丽乡村达标村',
    color: '#005AC1',
    isSelect: 0
  },
  {
    name: '未来乡村',
    color: '#648212',
    isSelect: 0
  },
  {
    name: '小集镇式中心村',
    color: '#168577',
    isSelect: 0
  },
  {
    name: '梳理式改造村',
    color: '#7C641B',
    isSelect: 0
  },
  {
    name: '省特色精品村',
    color: '#7446A8',
    isSelect: 0
  }
])
// 专题图层
const villageLayers = reactive({
  村庄: {
    checked: false,
    isShow: true, // 是否展示
    disabled: true, // 是否禁用
    child: [] // 有子节点
  },
  示范镇: {
    checked: false,
    disabled: true,
    isShow: true // 是否展示
  },
  乡村振兴示范带: {
    checked: false,
    disabled: true,
    isShow: true // 是否展示
  },
  农资分布: {
    checked: false,
    disabled: true,
    isShow: isFengHua.value
  },
  乡村物流: {
    checked: false,
    disabled: true,
    isShow: isFengHua.value
  },
  乡村振兴学院: {
    checked: false,
    disabled: true,
    isShow: isFengHua.value
  },
  集体三资: {
    checked: false,
    disabled: true,
    isShow: isFengHua.value
  }
})
// 农民
const peasantLayers = reactive({
  低收入农户分布: {
    checked: false,
    disabled: true
  },
  低收入项目: {
    checked: false,
    disabled: true
  },
  低收入综合性保险: {
    checked: false,
    disabled: true
  }
})
// 乡村旅游选中
const trvalSelected = (item) => {
  item.isSelect = item.isSelect === 1 ? 0 : 1
  if (item?.children?.length) {
    item.children.map((child) => {
      child.isSelect = item.isSelect
    })
  }
  const selectedList = travelList.value.filter((item) => item.isSelect && item.name != '2022精品旅游路线').map((item) => item.name)
  console.log(selectedList, 'selectedList')
  const obj = {
    村庄: villageChildLayers.value.filter((v) => v.isSelect)[0]?.name,
    示范镇: villageLayers['示范镇'].checked,
    示范带: villageLayers['乡村振兴示范带'].checked,
    集体三资: villageLayers['集体三资'].checked,
    乡村振兴学院: villageLayers['乡村振兴学院'].checked,
    精品线路: travelList.value.filter((item) => item.name === '2022精品旅游路线')[0].isSelect ? 2022 : '',
    乡村物流: villageLayers['乡村物流'].checked ? '乡村物流' : '',
    农资分布: villageLayers['农资分布'].checked ? '农资分布' : '',
    乡村旅游: selectedList
  }
  const message = { key: 'changeLayerByOption', value: { option: { obj } } }
  emit('sendMessage', message)
}
// 农村选中
const onVillageLayerChange = (key, item) => {
  const newVillageChildLayers = JSON.parse(JSON.stringify(villageChildLayers.value)) // 深拷贝
  if (!['示范镇', '乡村振兴示范带'].includes(key)) {
    newVillageChildLayers.forEach((item) => {
      if (item.name === key) {
        item.isSelect = !item.isSelect
      } else {
        item.isSelect = 0
      }
    }) // 清空逻辑
    villageChildLayers.value = newVillageChildLayers
  }
  const obj = {
    村庄: villageChildLayers.value.filter((v) => v.isSelect)[0]?.name,
    示范镇: villageLayers['示范镇'].checked,
    示范带: villageLayers['乡村振兴示范带'].checked,
    集体三资: villageLayers['集体三资'].checked,
    乡村振兴学院: villageLayers['乡村振兴学院'].checked,
    乡村物流: villageLayers['乡村物流'].checked ? '乡村物流' : '',
    农资分布: villageLayers['农资分布'].checked ? '农资分布' : ''
  }
  const selectedList = []
  for (const key in villageLayers) {
    if (villageLayers[key].checked) selectedList.push(key)
  }
  emit('getVillageLayers', selectedList)
  let message = { key: 'changeLayerByOption', value: { option: { obj } } }
  emit('sendMessage', message)
}
const changeZBJ = (value) => {
  // 总布局改变传值给父组件
  emit('getThematicLayerData', value ? ['overallPlan'] : [])
}
const onEmit = () => {
  const object = {}
  villageChildLayers.value[0].isSelect = 0 // 其他模块选中时手动关闭新时代美丽乡村达标村模块 因为是不同的地图
  activePeasant.value = false
  emit('getThematicLayerData', []) // 关闭生产力布局-总布局图片
  ZBJ.value = false // 关闭生产力布局-总布局按钮
  selectList.value.map((item) => {
    let arr = []
    if (item.children?.length) {
      item.children?.map((child) => {
        if (child.isSelect === 1) arr.push(child.name)
      })
    } else {
      if (item.isSelect === 1) {
        arr = [item.name]
      } else {
        arr = []
      }
    }
    object[item.name === '其他' ? '其他非农用地' : item.name] = arr
  })
  const webList = [] // 互联网设备
  WebOfThingsList.value.forEach((item) => {
    if (item.isSelect) webList.push(item.name)
  })
  let productList = [] //产业基地面
  // 拼接产业基地面数据
  JSON.parse(JSON.stringify(raiseLivestockList.value))
    .filter((v) => v.isSelect == 1)
    .map((v) => v.name)
    .forEach((item) => {
      productList.push(item)
    })
  if (cerealList.value[0].isSelect) productList.push('小麦发展规划')
  if (cerealList.value[1].isSelect) productList.push('水稻发展规划')
  if (vegetableList.value[0].isSelect) productList.push('蔬菜总布局')
  if (foodVegetableOilList.value[0].isSelect) productList.push('油菜籽重点乡镇')
  if (foodVegetableOilList.value[1].isSelect) productList.push('油茶重点乡镇')
  if (aquaticProductList.value[0].isSelect) {
    ;['沿岸海洋渔业产业片区', '淡水渔业产业片区'].forEach((item) => {
      productList.push(item)
    })
  }
  if (aquaticProductList.value[1].isSelect) {
    ;['海淡水虾类', '海水贝藻类', '海水蟹类', '生态鳖', '岱衢族大黄鱼'].forEach((item) => {
      productList.push(item)
    })
  }
  if (vegetableList.value[1].isSelect) {
    ;['加工出口蔬菜（榨菜、花椰菜）', '加工出口蔬菜（雪菜）', '鲜食大豆（蚕豌豆）', '马铃薯', '山地特色蔬菜（芋艿）', '水生蔬菜（茭白）', '西甜瓜', '食用菌', '草莓'].forEach((item) => {
      productList.push(item)
    })
  }
  const newPointArr = featureVillageList.value.concat(baseList.value)
  const bambooSelected = newPointArr.filter((v) => v.name == '竹子')[0].children.filter((v) => v.isSelect)[0]?.name
  emit('sendMessage', {
    key: 'changeLayerByOption',
    value: {
      option: {
        name: '土地非农化',
        obj: {
          三调地类: object,
          非粮化图斑: flhtb.value ? '非粮化图斑' : '',
          清理腾退: isClean.value ? '清理腾退' : '',
          优化补入: isCompensate.value ? '优化补入' : '',

          耕地: gd.value ? '耕地' : '',
          永久基本农田: ygjbnt.value ? '永久基本农田' : '',
          耕地内永农: permanentFarmingList.value[0].isSelect ? '耕地内永农' : '',
          耕地外永农: permanentFarmingList.value[1].isSelect ? '耕地外永农' : '',

          高标准农田: gbznt.value ? '高标准农田' : '',
          耕地内高标农: farmingList.value[0]?.isSelect ? '耕地内高标农' : '',
          耕地外高标农: farmingList.value[1]?.isSelect ? '耕地外高标农' : '',
          永农内高标农: farmingList.value[2]?.isSelect ? '永农内高标农' : '',
          永农外高标农: farmingList.value[3]?.isSelect ? '永农外高标农' : '',
          耕地和永农内高标农: farmingList.value[4]?.isSelect ? '耕地和永农内高标农' : '',
          高标农外粮功区: farmingList.value[5]?.isSelect ? '高标农外粮功区' : '',
          高标农内粮功区: farmingList.value[6]?.isSelect ? '高标农内粮功区' : '',
          花卉苗木: JSON.parse(JSON.stringify(newPointArr)).filter((v) => v.isSelect == 1 && ['花卉苗木'].includes(v.name))[0]?.isSelect ? '2020' : '', // 只有2020年有值
          竹子: bambooSelected || '',
          产业基地面: JSON.parse(JSON.stringify(newPointArr))
            .filter((v) => v.isSelect == 1 && ['粮食', '水果'].includes(v.name))
            .map((v) => {
              if (v.children && v.children.length > 0) {
                return v.children[0].name
              } else {
                return v.name
              }
            }),
          产业基地点: JSON.parse(JSON.stringify(newPointArr))
            .filter((v) => v.isSelect == 1 && !['粮食', '水果', '竹子', '花卉苗木'].includes(v.name))
            .map((v) => v.name),
          产业基地规划面: productList,
          物联网设备: webList
        }
      }
    }
  })
}
watchEffect(() => {
  //     <!-- <el-radio-button label="产业-资源">资源·产业</el-radio-button>
  // <el-radio-button label="农民-农村">农村·农民</el-radio-button> -->
  // 临时这样处理下
  if (!activePeasant.value) {
    activeModule.value = '产业-资源'
    // reset();
  } else {
    // 后面细分
    activeModule.value = '农民-农村'
  }
})
watch(
  () => [gd.value, gbznt.value, ygjbnt.value, flhtb.value, isClean.value, isCompensate.value],
  (val) => {
    onEmit()
    activeModule.value = val.includes(true) ? '产业-资源-粮功区内高标农' : ''
  },
  { deep: true, immediate: true }
)
watch(
  () => WebOfThingsList.value,
  () => {
    onEmit()
    activeModule.value = ''
  },
  { deep: true, immediate: true }
)
watch(
  () => farmingList.value,
  () => {
    onEmit()
    activeModule.value = '产业-资源-粮功区内高标农'
  },
  { deep: true, immediate: true }
)
watch(
  () => activeLayerCategoryTab.value,
  (val) => {
    const selectTab = tabList.value.filter((v) => v.isSelect)
    if (selectTab[0].name === '农村' && val == '基础图层') {
      activePeasant.value = true
    } else {
      onVillageLayerChange() // 清空农村选中
      onEmit()
    }
    emit('onTabChange', activeLayerCategoryTab.value)
  },
  { deep: true, immediate: true }
)
watch(
  () => [cerealList.value, foodVegetableOilList.value, vegetableList.value, xm.value, sd.value, raiseLivestockList.value, aquaticProductList.value],
  () => {
    onEmit()
    activeModule.value = ''
  },
  { deep: true, immediate: true }
)
watch(
  () => [yearList.value],
  (val) => {
    let isSelect = false
    val.forEach((element) => {
      for (let item of element) {
        if (item.isSelect) {
          isSelect = true
          break
        }
      }
    })
    if (isSelect) {
      activeModule.value = '精品'
    } else {
      activeModule.value = ''
    }
  },
  { deep: true, immediate: true }
)
watch(
  () => [travelList.value],
  (val) => {
    emit(
      'getTravelSelectData',
      val[0].filter((item) => item.isSelect).map((item) => item.name),
      LineChild.value
    )
  },
  { deep: true, immediate: true }
)
watch(
  () => [raiseLivestockList.value, cerealList.value, foodVegetableOilList.value, vegetableList.value, aquaticProductList.value],
  (val) => {
    let ishaveSelected = false
    // 如果有产业基地图层选中 切换到产业基地tab
    let selectValueList = []
    // activeModule.value = `产业-资源-${selectValue}`
    if (raiseLivestockList.value.some((v) => v.isSelect == 1)) {
      ishaveSelected = true
      selectValueList.push('产业-资源-畜牧')
    }
    if (cerealList.value.some((v) => v.isSelect == 1)) {
      ishaveSelected = true
      selectValueList.push('产业-资源-粮食')
    }
    if (foodVegetableOilList.value.some((v) => v.isSelect == 1)) {
      ishaveSelected = true
      selectValueList.push('产业-资源-食用植物油')
    }
    if (vegetableList.value.some((v) => v.isSelect == 1)) {
      ishaveSelected = true
      selectValueList.push('产业-资源-蔬菜')
    }
    if (aquaticProductList.value.some((v) => v.isSelect == 1)) {
      ishaveSelected = true
      selectValueList.push('产业-资源-水产')
    }
    if (ishaveSelected) {
      emit('setTab', 3, null, selectValueList)
    } else {
      emit('setTab', 1, null) // 没有选中的值
    }
    selectValueList.value = selectValueList
  },
  { deep: true, immediate: true }
)
watch(
  () => [baseList.value, featureVillageList.value],
  (val) => {
    onEmit()
    const newPointArr = featureVillageList.value.concat(baseList.value)
    // 增加子级选中
    if (newPointArr.some((v) => v.isSelect == 1) || newPointArr.some((v) => v.children && v.children.some((item) => item.isSelect))) {
      // 如果有产业基地图层选中 切换到产业基地tab
      let selectValue = ''
      newPointArr.forEach((item) => {
        // 将选中的产品tab传给父组件做显示判断
        if (item.isSelect) {
          selectValue = item.name
        } else {
          item.children?.forEach((childItem) => {
            if (childItem.isSelect) selectValue = childItem.name
          })
        }
      })
      activeModule.value = `产业-资源-${selectValue}`
      emit('setTab', 2, selectValue)
    } else {
      activeModule.value = ''
      emit('setTab', 1, null) // 没有选中的值
    }
  },
  { deep: true, immediate: true }
)
watch(
  () => selectList.value,
  (val) => {
    let allFalses = true // 全部为0
    val.map((item) => {
      if (!item?.children?.length) return
      let allTrue = true // 全部为1
      let allFalse = true // 全部为0
      item.children.map((child) => {
        if (child.isSelect === 0) allTrue = false
        if (child.isSelect === 1) allFalse = false
      })
      if (!allTrue && !allFalse) {
        item.isSelect = 2
      } else if (allTrue) {
        item.isSelect = 1
      } else if (allFalse) {
        item.isSelect = 0
      }
      allFalses = allFalse
    })
    activeModule.value = allFalses ? '' : '产业-资源-粮功区内高标农'
    const getIndex = val.findIndex((item) => item.isSelect !== 1)
    isSelectAll.value = getIndex === -1
    onEmit()
  },
  { deep: true, immediate: true }
)
defineExpose({
  activeModule: activeModule,
  activePeasant: activePeasant
})
</script>

<style scoped lang="scss">
.module-select {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: scroll;
  .all-tab-list {
    display: flex;
    margin-bottom: 16px;
    div {
      width: 74px;
      height: 54px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 14px;
      font-size: 22px;
      font-family: PangMenZhengDao-3, PangMenZhengDao;
      font-weight: normal;
      color: #5895dd;
      text-shadow: 0px 1px 2px #042767;
    }
    .selected-tab {
      background: url('https://img.hzanchu.com/acimg/10ee11b6411d277396c7d500f1377670.png') no-repeat;
      background-size: 100% 100%;
      color: #ffffff;
    }
    .tab {
      background: url('https://img.hzanchu.com/acimg/7c6a724dc9aa44e9cd0dbb294a591790.png') no-repeat;
      background-size: 100% 100%;
    }
  }
  .seconde-title {
    position: relative;
    display: flex;
    align-items: center;
    font-size: 20px;
    font-family: MicrosoftYaHeiSemibold;
    color: #89b0cc;
    line-height: 22px;
    background: linear-gradient(180deg, #ffffff 0%, #65c7ff 100%);
    -webkit-background-clip: text;
    height: 42px;
    padding-left: 48px;
    box-sizing: border-box;
    .icon {
      width: 18px;
      height: 18px;
      position: absolute;
      top: 12px;
      left: 8px;
    }
    .arrow {
      position: absolute;
      top: 12px;
      right: 0;
      cursor: pointer;
      width: 16px;
      height: 16px;
      transition: all 0.3s;
    }
  }
  .module-select__layer-category-selector {
    margin-bottom: 30px;
    :deep(.el-radio-group) {
      display: flex;
      flex-wrap: nowrap;
      width: 100%;
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
        font-size: 24px;
        font-family: PangMenZhengDao-3, PangMenZhengDao;
        font-weight: normal;
        color: #c4d9f1;
        margin-bottom: -2px;
        background: url('https://img.hzanchu.com/acimg/fdfeca6e76bcaff7ea93bc8504ce0e2b.png') no-repeat;
        background-size: 100% 100%;
        // background: no-repeat center / auto 100% url('https://img.hzanchu.com/acimg/fdfeca6e76bcaff7ea93bc8504ce0e2b.png');
        width: 147px;
        height: 36px;
        &.is-active {
          font-size: 24px;
          font-family: PangMenZhengDao-3, PangMenZhengDao;
          font-weight: normal;
          color: #ffffff;
          text-shadow: 0px 1px 2px #042767;
          background: no-repeat center / auto 100% url('https://img.hzanchu.com/acimg/b6bdb5a715450ec322c9facc035ebc20.png');
        }
        .el-radio-button__inner {
          font-size: 24px;
          font-family: PangMenZhengDao;
          font-weight: 400;
          color: #ffffff;
          line-height: 34px;
        }
      }
    }
  }

  .select-title {
    height: 38px;
    line-height: 38px;
    //background: linear-gradient(
    //  271deg,
    //  rgba(68, 185, 237, 0) 0%,
    //  rgba(68, 185, 237, 0.4) 65%,
    //  rgba(68, 185, 237, 0) 100%
    //);
    background: url('https://img.hzanchu.com/acimg/c6e284fabc4bc540b008553a89b47bae.png') no-repeat;
    background-size: 100% 100%;
    padding: 0 50px 0 70px;
    font-family: PangMenZhengDao;
    font-size: 22px;
    margin-top: 10px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .arrow {
      position: absolute;
      top: 12px;
      right: 20px;
      cursor: pointer;
      width: 16px;
      height: 16px;
      transition: all 0.3s;
    }
  }
  .village-box {
  }
  .switch-box {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 16px 0 5px;
    // height: 22px;
    // padding: 0 50px 16px;
    padding: 0 45px;
    height: 42px;
    background: rgba(21, 63, 132, 0.64);
    border-radius: 2px;
    .arrow {
      position: absolute;
      top: 12px;
      right: 10px;
      cursor: pointer;
      width: 16px;
      height: 16px;
      transition: all 0.3s;
    }
    span {
      position: absolute;
      top: 17px;
      left: 35px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }
    p {
      font-size: 20px;
      font-family: PangMenZhengDao;
    }

    //&:after {
    //  content: "";
    //  position: absolute;
    //  z-index: 0;
    //  bottom: 0;
    // left: 0;
    //  width: 100%;
    //  height: 24px;
    //  background: url("../image/block_bg.png") no-repeat;
    //  background-size: 100% 100%;
    //}
  }

  .select-box {
    //flex: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;
    .check-title {
      position: relative;
      margin: 24px 20px 5px;
      height: 22px;
      padding: 0 50px 16px;
      font-size: 22px;
      font-family: PangMenZhengDao;

      &:after {
        content: '';
        position: absolute;
        z-index: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 24px;
        background: url('../image/block_bg.png') no-repeat;
        background-size: 100% 100%;
      }
    }

    .check-title-sec {
      margin-top: 16px;
    }

    .item-wrap {
      margin: 0 20px;
      // max-height: calc(42px * 10);
      &.item-wrap-three {
        transition: all 0.3s;
      }
    }

    .select-item {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      box-sizing: border-box;
      padding: 0 0 0 48px;
      min-height: 22px;
      .travel-icon {
        height: 18px;
        width: 18px;
        margin: 0 10px;
      }
      p {
        flex: 1;
        line-height: 22px;
        font-weight: 600;
        background: linear-gradient(180deg, #ffffff 0%, #65c7ff 100%);
        -webkit-background-clip: text;
        color: transparent;
        padding: 10px 0;
      }

      span {
        width: 6px;
        height: 6px;
        border-radius: 3px;
        margin: 0 9px 0 14px;
      }

      .status {
        width: 18px;
        height: 18px;
        cursor: pointer;
      }

      .arrow {
        position: absolute;
        top: 12px;
        right: 0;
        cursor: pointer;
        width: 16px;
        height: 16px;
        transition: all 0.3s;
      }

      .children-box {
        margin-right: 20px;
        width: 100%;
        height: calc(var(--children-box-height) * 1px);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transition: all 0.3s;

        .children-item {
          display: flex;
          flex-direction: row;
          height: 20px;
          line-height: 20px;
          padding: 10px 36px;

          &:nth-of-type(2n-1) {
            background: #0f3d6c;
          }

          p {
            padding: 0 0 0 17px;
          }
        }

        .close-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;

          img {
            height: 22px;
            width: 127px;
          }
        }
      }
    }
  }

  .module-select__layer-checkbox {
    height: 38px;
    line-height: 38px;
    background: linear-gradient(271deg, rgba(68, 185, 237, 0) 0%, rgba(68, 185, 237, 0.4) 65%, rgba(68, 185, 237, 0) 100%);
    padding-inline: 12px;
    font-family: PangMenZhengDao;
    font-size: 22px;
    margin-top: 10px;
    position: relative;
    display: flex;
    align-items: center;
    // TODO: 重写
    .status {
      width: 18px;
      height: 18px;
      cursor: pointer;
      &[data-disabled='true'] {
        cursor: not-allowed;
      }
    }
  }
}
</style>
