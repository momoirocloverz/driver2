<template>
  <div class="header-custom">
    <div>
      <div class="item-box">
        <div
          :style="{ float: item.float, marginLeft: item.marginLeft, marginRight: item.marginRight }"
          :class="['item', { item_iscenter: item.isCenter, item_select: !item.isCenter && activeMenuItem === item.name, ['item_select_' + item.float]: activeMenuItem === item.name }]"
          v-for="item in list"
          :key="item.title"
          @click="linkPage(item)"
        >
          <b> {{ item.title }}</b>
        </div>
      </div>
      <Catalogue class="catalogue-icon" />
      <!-- <PPTComponent v-if="state.pptShow" class="ppt-icon" /> -->
      <!-- <SearchComponent class="search-icon" /> -->
    </div>
    <FullScreen v-show="!selectAreaVal" v-model="isFullScreen" />
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import FullScreen from './FullScreen'
import Catalogue from './Catalogue'
import PPTComponent from './PPTComponent'
import SearchComponent from './SearchComponent'
import { headerMenus } from '../modal/headerMenus'
import { cloneDeep } from 'lodash'
// 处理顶部导航菜单-start
let headerMenuMap = {
  leftItems: [],
  centerItems: [],
  rightItems: []
}
let headerMenusClone = cloneDeep(headerMenus)
headerMenusClone.forEach((one, index) => {
  if (one.isCenter) {
    headerMenuMap.centerItems.push(one)
  } else {
    let hasCenterItem = headerMenuMap.centerItems.length > 0
    if (!hasCenterItem) {
      one.float = 'left'
    } else {
      one.float = 'right'
    }
    if (one.float === 'left') {
      if (headerMenuMap.leftItems.length > 0) {
        // 左边的菜单第一个外都要有左间距
        one.marginLeft = '50px'
      }
      headerMenuMap.leftItems.push(one)
    } else if (one.float === 'right') {
      if (index !== headerMenusClone.length - 1) {
        // 左边的菜单最后一个外都要有右间距
        one.marginRight = '50px'
      }
      headerMenuMap.rightItems.unshift(one)
    }
  }
})
headerMenusClone = [].concat(headerMenuMap.leftItems).concat(headerMenuMap.centerItems).concat(headerMenuMap.rightItems)
const list = ref(headerMenusClone)
// 处理顶部导航菜单-end
const isFullScreen = ref(false) // 全屏
const selectAreaVal = ref(null)
const state = reactive({
  pptShow: true
})
const Route = useRoute()
const activeMenuItem = ref('')
onMounted(() => {
  const area = Route.query.area
  if (area) {
    selectAreaVal.value = area
  }
})
watch(
  () => Route.name,
  (value) => {
    if (value === 'RuralBrain') {
      state.pptShow = false
    } else {
      state.pptShow = false
    }
    activeMenuItem.value = value
  },
  { immediate: true }
)

// 页面跳转
const linkPage = (item) => {
  if (item.url) {
    window.open(item.url, item.openType || '_blank')
  } else {
    router.replace({ name: item.name })
  }
}
</script>

<style scoped lang="scss">
.header-custom {
  width: 100%;
  height: 110px;
  background-image: url('https://img.hzanchu.com/acimg/59d41089327bb6371dc266177fa556cd.png');
  background-size: 100% 100%;
  box-sizing: border-box;
  padding: 0 80px;
  position: relative;
  z-index: 99;
  .full-screen-icon {
    position: absolute;
    z-index: 999;
    width: 25px;
    height: 25px;
    cursor: pointer;
    top: 17px;
    right: 24px;
  }
  :deep(.search-icon) {
    width: 36px;
    height: 36px;
    position: absolute;
    cursor: pointer;
    right: 680px;
    top: 20px;
  }
  :deep(.catalogue-icon) {
    width: 25px;
    height: 25px;
    position: absolute;
    cursor: pointer;
    left: 25px;
    top: 17px;
  }
  .fenghua-img {
    position: absolute;
    z-index: 999;
    top: -8px;
    left: 0;
    width: 1178px;
    height: 131px;
    display: block;
    margin-left: 20%;
  }
  .item-box {
    width: 100%;
    position: relative;
    .item {
      cursor: pointer;
      img {
        width: 149px;
        height: 31px;
      }
      b {
        font-size: 34px;
        font-family: PangMenZhengDao-3, PangMenZhengDao;
        font-weight: normal;
        color: rgba(102, 102, 102, 0.7);
        line-height: 60px;
        letter-spacing: 2px;
        text-shadow: 1px 2px 3px rgb(0 11 28 / 70%);
        background: linear-gradient(180deg, #ffffff 0%, #a3d2ff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      &.item_select {
        &.item_select_left {
          background: url('https://img.hzanchu.com/acimg/3d00f54a9a070e12d7eb92fa41cacfba.png') no-repeat;
          background-size: 100% 100%;
        }
        &.item_select_right {
          background: url('https://img.hzanchu.com/acimg/06d5dec685133565c9a299e5d53560d6.png') no-repeat;
          background-size: 100% 100%;
        }
        margin-right: 0 !important;
        width: 303px;
        height: 88px;
        padding-left: 62px;
        text-align: center;
        display: flex;
        box-sizing: border-box;
        align-items: center;
        position: relative;
        top: -14px;
        b {
          font-size: 34px;
          font-family: PangMenZhengDao-3, PangMenZhengDao;
          font-weight: normal;
          color: #666666;
          letter-spacing: 2px;
          text-shadow: none;
          background: linear-gradient(180deg, #ffffff 0%, #a3d2ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        + .item {
          margin-left: 0 !important;
        }
      }
      &.item_iscenter {
        b {
          color: #fff;
          font-size: 50px;
          line-height: 57px;
          letter-spacing: 9px;
          background: #fff;
          text-shadow: none;
          -webkit-background-clip: text;
        }
        position: absolute !important;
        left: 50%;
        transform: translateX(-50%) translateY(10px);
        &.item_select {
          background: none;
          width: auto;
          padding: 0 !important;
        }
      }
    }
  }
}
</style>
