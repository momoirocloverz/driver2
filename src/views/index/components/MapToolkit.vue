<template>
  <div class="map-toolkit">
    <div
      class="map-toolkit__toggle"
      @click="state.isExpanded = !state.isExpanded"
    >
      <img :src="require('@/views/index/image/icon_toolbox.svg')" width="16" alt="icon" />
      <span >地图工具箱</span>
      <img
        :src="require('@/views/index/image/arrow_icon.png')"
        width="20"
        :style="{
          transform: state.isExpanded ? 'rotate(360deg)' : 'rotate(180deg)',
          transition: 'transform 1s ease'
        }"
        alt="indicator"
      >
    </div>
    <div
      ref="contentRef"
      :class="[
        'map-toolkit__content',
        {
          'map-toolkit__content--show': state.isExpanded,
        },
      ]"
    >
     <!-- 地图方向暂时没时间做地图工具箱 等后面gis开发完后接入 -->
      <div class="map-toolkit__item">
        <span class="map-toolkit__base-map-item-label"> 点位读取 </span>
        <el-switch
          inline-prompt
          active-text="打开"
          inactive-text="关闭"
          active-color="#4EC2FF"
          style="margin-left:auto"
          inactive-color="#30587E"
          v-model="state.usePoint"
          @change="(value)=>switchChange(value,'Point')"
        />
      </div>
      <div class="map-toolkit__item">
        <span class="map-toolkit__base-map-item-label"> 距离量测 </span>
        <el-switch
          inline-prompt
          active-text="打开"
          inactive-text="关闭"
          active-color="#4EC2FF"
          style="margin-left:auto"
          inactive-color="#30587E"
          v-model="state.useLineString"
          @change="(value)=>switchChange(value,'LineString')"
        />
      </div>
      <div class="map-toolkit__item">
        <span class="map-toolkit__base-map-item-label"> 圆量测 </span>
        <el-switch
          inline-prompt
          active-text="打开"
          inactive-text="关闭"
          active-color="#4EC2FF"
          inactive-color="#30587E"
          style="margin-left:auto"
          v-model="state.useCircle"
          @change="(value)=>switchChange(value,'Circle')"
        />
      </div>
      <div class="map-toolkit__item">
        <span class="map-toolkit__base-map-item-label"> 矩形量测 </span>
        <el-switch
          inline-prompt
          active-text="打开"
          inactive-text="关闭"
          active-color="#4EC2FF"
          inactive-color="#30587E"
          style="margin-left:auto"
          v-model="state.useRectangle"
          @change="(value)=>switchChange(value,'Rectangle')"
        />
      </div>
      <div class="map-toolkit__item">
        <span class="map-toolkit__base-map-item-label"> 多边形量测 </span>
        <el-switch
          inline-prompt
          active-text="打开"
          inactive-text="关闭"
          active-color="#4EC2FF"
          style="margin-left:auto"
          inactive-color="#30587E"
          v-model="state.usePolygon"
          @change="(value)=>switchChange(value,'Polygon')"
        />
      </div>
      <div class="map-toolkit__item">
      <el-button style="width:100%" @click="clearMeasure()" type="primary" :icon="Delete">清除操作</el-button>
        <!-- <span class="map-toolkit__base-map-item-label">清除操作 </span>
        <el-switch
          inline-prompt
          active-text="打开"
          inactive-text="关闭"
          active-color="#4EC2FF"
          inactive-color="#30587E"
          v-model="state.useClear"
          @change="(value) => {value?clearMeasure():''}"
        /> -->
      </div>
      <button class="map-toolkit__item map-toolkit__base-map-switcher">
        <span class="map-toolkit__base-map-item-label"> 切换底图 </span>
        <img  :style="{width: '19px',marginLeft:'auto'}" alt="arrow" :src="require('@/assets/image/right-arrow--neon-orange.png')" />
        <div class="map-toolkit__base-map-switcher-popup">
          <map-status @sendMessage="sendMessage" />
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { toRef, reactive, inject, defineExpose, watchEffect, ref } from "vue";
import MapStatus from "@/views/index/modules/mapStatus.vue";
import { Delete } from '@element-plus/icons-vue';
// const sendMessage = inject("sendMessage");

const state = reactive({
  isExpanded: false,
  usePoint: false,
  useLineString: false,
  usePolygon: false,
  useCircle: false,
  useRectangle: false,
  useClear: false,
  baseMap: "", // 暂时没用
});

const switchChange = (value, type) => {
 if(type!='Point') state.usePoint = false;
if(type!='LineString') state.useLineString = false;
 if(type!='Polygon')  state.usePolygon = false;
 if(type!='Circle')  state.useCircle = false;
 if(type!='Rectangle')  state.useRectangle = false;
  if (value) {
    measureByType(type)
  } else { 
    closeMeasure() 
  }
}

/**
 * 选择量测类型
 * @param {String} type
 */
const measureByType = (type) => {
  let message = { 'key': 'measureByType', 'value':{ 'measureByType': type } };
  sendMessage('gisMapMessage', message);
}
/**
 * 关闭量测功能
 */
const closeMeasure=()=>{
  let message = { 'key': 'closeMeasure', 'value': { 'closeMeasure': true } };
  sendMessage('gisMapMessage', message);
}
/**
 * 清楚量测结果
 */
const clearMeasure=()=>{
  let message = { 'key': 'clearMeasure', 'value': { 'clearMeasure': true } };
  sendMessage('gisMapMessage', message);
}
// 发送消息
const sendMessage=(type,data)=>{
  // 向子页面传递消息
  let iframe = document.getElementById('gisIframe');
  iframe.contentWindow.postMessage({ type: type, data: data }, '*');
}

// anim
const contentRef = ref(null);
const targetHeight = `${7 * 36}px`;
let animation;
watchEffect(()=>{
  if (contentRef.value) {
    if (state.isExpanded) {
      const anim = contentRef.value.animate(
        [{ maxHeight: targetHeight}],
        {
          duration: 500,
          easing: "ease-out",
          fill: 'forwards',
        }
      );
      animation = anim;
      anim.onfinish = ()=> {
        // 确认当前状态没有变化
        if (animation === anim) {
          anim.commitStyles();
          // 切换底图的弹出需要overflow
          contentRef.value.style.overflow = "visible";
        }
      };
    } else {
      // 关闭时立即设置overflow为hidden防止展示溢出
      contentRef.value.style.overflow = 'hidden'
      const anim = contentRef.value.animate(
        [{ maxHeight: 0 }],
        {
          duration: 500,
          easing: "ease-out",
          fill: 'forwards',
        }
      );
      animation = anim;
      anim.onfinish = ()=> {
        // 确认当前状态没有变化
        if (animation === anim) {
          anim.commitStyles();
        }
      };
    }
  }
})



</script>

<style scoped lang="scss">
.map-toolkit {
  width: 182px;
  :deep(.el-switch) {
    .el-switch__core {
      width: 56px !important;
    }
  }
}
.map-toolkit__content {
  display: flex;
  flex-flow: column;
  max-height: 0;
  background: #002a8b;
  &--show {
    //max-height: 4 * 36px;
  }
}

.map-toolkit__toggle {
  padding-left: 12px;
  display: flex;
  align-items: center;
  min-height: 36px;
  font-size: 16px;
  font-weight: 400;
  color: #ffffff;
  cursor: pointer;
  background: no-repeat center/ 100%
    url("~@/views/index/image/toolkit_button-bg.svg");
  > span {
    margin-inline: 4px 8px;
    margin-left:10px;
    margin-right: 27px;
  }
}

.map-toolkit__item {
  display: flex;
  align-items: center;
  flex: 0;
  padding: 0 10px;
  min-height: 36px;
  padding-inline: 12px;
}
.map-toolkit__base-map-item-label {
  // flex: 0 0 4em;
  margin-right: 4px;
}
.map-toolkit__base-map-switcher {
  position: relative;
  background: none;
  color: inherit;
  font-size: inherit;
  line-height: inherit;
  font-family: inherit;
  .map-toolkit__base-map-switcher-popup {
    opacity: 0;
    left: 100%;
    bottom: 0;
    position: absolute;
    transition: all 0.5s ease;
    transform: translateX(30%);
    pointer-events: none;
  }
  &:hover,
  &:focus-within {
    .map-toolkit__base-map-switcher-popup {
      pointer-events: auto;
      opacity: 1;
      transform: translateX(0%);
    }
  }
}
</style>
