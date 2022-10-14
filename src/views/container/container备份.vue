<template>
  <div class="container" :style="{ backgroundImage:isYuyao?'url(' + (require('./image/yuyao-bg.png')) + ')':'url(' + (require('./image/textBg.jpg')) + ')'}" ref="myRef">
    <customDialog  v-model:visible="isShowMl" :width="840" top="5vh" title="目录">
      <cataloguePage />
      <!-- <div style="display:flex;justify-content: center;align-items: center;">
          <img style="width:100%;height:100%" src="https://img.hzanchu.com/acimg/2ff32941a0b39b42e029c64efbb6b9f7.png" alt="">
        </div> -->
    </customDialog>
    <!-- 奉化单独展示 -->
    <div v-show="state.shutDown && !selectAreaVal">
      <img class="header" v-show="isFengHua" :src="isFengHua ? require('./image/fenghua-page_header.png') : require('./image/page_header.png')" alt="" />
      <div class="header-box" v-show="!isFengHua">
        <img
          v-show="!isSelectTimePage"
          @click="goPage('index')"
          src="https://img.hzanchu.com/acimg/c64c3fb57c7697d2d5d4b981ee04f386.png"
          style="marginright: 103px; margin-top: 13px;cursor: pointer;"
          alt=""
          srcset=""
        />
        <div class="title"  @click="handleGoPage('capacityCenter')" style="marginRight: 64px;" >
          能力中心
        </div>
        <div class="title"  @click="handleGoPage('CompetencyCenter')" style="marginRight: 64px;" >
          应用场景
        </div>
        <div class="handle-btn"><b @click="goPage('RuralBrain')">宁波数字乡村大脑</b><img class="search-icon" src="https://img.hzanchu.com/acimg/cddc159874d55ee3869eead913fcef79.png" alt="" @click="showBrainAction" />
        <!-- <img @click="isShowPPTPlayer = true" src="https://img.hzanchu.com/acimg/542cd9e27b8efe4aa56b93f1beecfdd0.png" alt="" /> -->
        </div>
        <div class="right-btn">
          <div class="selected-title" v-show="isSelectTimePage" style="cursor: pointer;">
            <b>全域时空图</b>
          <!-- <img src="https://img.hzanchu.com/acimg/c64c3fb57c7697d2d5d4b981ee04f386.png" alt="" srcset="" /> -->
           <!-- 暂时隐藏目录 -->
          <!-- <img @click="show" style="width: 36px; height: 36px; margin-left: 18px;cursor: pointer;" src="https://img.hzanchu.com/acimg/542cd9e27b8efe4aa56b93f1beecfdd0.png" alt="" /> -->
        </div>
        <div class="title"  @click="handleGoPage('smartCockpit')" >
          智能驾舱
        </div>
          <!-- <img class="go-icon" style="cursor: pointer;" @click="handleGoPage('CompetencyCenter')" src="https://img.hzanchu.com/acimg/e75dd165de98e91f88e921cd8d8d0b77.png" alt="" srcset="" /> -->
        </div>
      </div>
    </div>
    <!-- <img  src="https://img.hzanchu.com/acimg/94ef305ca37e730682d71ae530ce733c.png" @click="handleGoPage('CompetencyCenter')" style="marginRight:103px;margin-top:13px" alt="" srcset=""> -->
    <!-- <span style="margin-top:19px">{{yearText}}</span> @click="handleGoPage('CompetencyCenter')" 
      <span class="minute-box" >{{minuteText}}</span> 时间暂时不要了 -->
    <img  v-show="!selectAreaVal" class="show-icon" @click="handleOpen" :src="require(showOpenWindow ? './image/all_show_icon.png' : './image/all_in_icon.png')" alt="" />
    <router-view class="page-container" />
    <brainSearchEngine  v-show="state.showBrain && !selectAreaVal" @shutCurrent="popBrain" />
    <PPTPlayerDialog v-if="isShowPPTPlayer"  @shutCurrent="closeModel"  :visible="isShowPPTPlayer" :width="1400" top="5vh" title="宁波乡村大脑">
      <div class="PPT-player-box">
        <el-carousel height="806px" indicator-position="outside" :autoplay="false">
          <el-carousel-item v-for="item in PPTImgList" :key="item">
            <img :src="item" alt="">
          </el-carousel-item>
        </el-carousel>
      </div>
    </PPTPlayerDialog>
  </div>
</template>
<script>
import { defineComponent, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import lodash from 'lodash'
import moment from 'moment'
import router from '@/router'
import customDialog from '@/components/customDialog'
import PPTPlayerDialog from '@/components/PPTPlayerDialog'
import brainSearchEngine from '@/components/brainSearchEngine'
import cataloguePage from './modal/cataloguePage.vue'
import { PPTImgList } from './modal/const'
export default defineComponent({
  components: { customDialog, cataloguePage, brainSearchEngine,PPTPlayerDialog  },
  setup() {
    const myRef = ref('')
    const isShowMl = ref(false) // 目录页面
    const isShowPPTPlayer = ref(false) // ppt窗口
    const showOpenWindow = ref(true)
    const selectAreaVal = ref(null);
    const isFengHua = ref(false) // 是否是奉化驾驶舱页面
    const isSelectTimePage = ref(window.location.pathname == '/index') // 是否选中全域时空图
    const isRuralBrain = ref(false) // 是否是乡村大脑页面
    const minuteText = ref('') // 时间text
    const yearText = ref('') // 时间text
    const isYuyao = ref(window.location.search.split('area=')[1] === 'yuyao'); // 是否为余姚驾驶舱
    const onResize = lodash.debounce(
      () => {
        myRef.value.style.transform = `scaleX(${window.innerWidth / 1920}) scaleY(${window.innerHeight / 1080})`
      },
      { leading: true, trailing: true }
    )
    const show = () => {
      isShowMl.value = true
    }
    const state = reactive({
      shutDown: true,
      showBrain: false
    })
    const closeModel = () => { 
      isShowPPTPlayer.value = false
    }
    const popBrain = () => {
      state.showBrain = false
    }
    const showBrainAction = () => {
      state.showBrain = true
    }
    const Router = useRouter()
    const Route = useRoute()
    onMounted(() => {
      onResize()
      // 不同的页面 用路由区分 同时title图片不同
      if (window.location.pathname == '/fengHuaIndex') isFengHua.value = true
      if (window.location.pathname == '/RuralBrain') {
        isRuralBrain.value = true
        state.shutDown = false
      } else {
        state.shutDown = true
      }
      setInterval(() => {
        minuteText.value = moment().format('HH:mm:ss')
        getMomentTime()
      }, 1)
      window.addEventListener('resize', () => {
        onResize()
      })
      const { search = '' } = window.location; // 获取是否需要将数据进行区级限制
      const area = search.split('=')[1]
      if (area) { 
        selectAreaVal.value = area;
      } 
    })
    watch(
      () => Route.name,
      (val) => {
        isSelectTimePage.value = false
        if (val == 'RuralBrain') {
          state.shutDown = false
        } else if (val == 'index') {
          isSelectTimePage.value = true
          state.shutDown = true
        } else {
          state.shutDown = true
        }
      },
      { immediate: true }
    )
    const handleGoPage = (type) => {
      if (type === 'CompetencyCenter') {
        window.open('https://ph.anchu.cn/shareScreen/eyJzY3JlZW5JZCI6MzY5MX0=')
      } else if (type === 'capacityCenter') { 
        window.open('https://ph.anchu.cn/shareScreen/eyJzY3JlZW5JZCI6MzY2MX0=')
      } else {
        window.open('https://ph.anchu.cn/shareScreen/eyJzY3JlZW5JZCI6NDE5Nn0=')
      }
    }

    const goPage = (name) => {
      if (name == 'index') {
        isSelectTimePage.value = true
      } else {
        isSelectTimePage.value = false
      }
      router.replace({ name })
    }

    const handleOpen = () => {
      showOpenWindow.value ? open() : close()
      showOpenWindow.value = !showOpenWindow.value //切换img展示
    }

    // 获取年份和星期
    const getMomentTime = () => {
      let timeStr = ''
      timeStr = moment().format('YYYY-MM-DD ')
      let week = moment(moment()).day()
      switch (week) {
        case 1:
          timeStr += '星期一'
          break
        case 2:
          timeStr += '星期二'
          break
        case 3:
          timeStr += '星期三'
          break
        case 4:
          timeStr += '星期四'
          break
        case 5:
          timeStr += '星期五'
          break
        case 6:
          timeStr += '星期六'
          break
        case 0:
          timeStr += '星期日'
          break
      }
      yearText.value = timeStr
    }

    onBeforeUnmount(() => {
      window.removeEventListener('resize')
    })
    const open = () => {
      //进入全屏模式
      var docElm = document.getElementsByTagName('body')[0]
      console.log('进入全屏', docElm)
      //W3C
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen()
      }
      //firefox
      else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen()
      }
      //Chrome等
      else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen()
      }
      //IE11
      else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen()
      }
    }

    const close = () => {
      //退出全屏模式
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    }

    document.addEventListener(
      'fullscreenchange',
      function () {
        fullscreenState.INNERHTML = document.fullscreen ? '' : 'not '
      },
      false
    )

    document.addEventListener(
      'mozfullscreenchange',
      function () {
        fullscreenState.INNERHTML = document.mozFullScreen ? '' : 'not '
      },
      false
    )

    document.addEventListener(
      'webkitfullscreenchange',
      function () {
        fullscreenState.INNERHTML = document.webkitIsFullScreen ? '' : 'not '
      },
      false
    )

    document.addEventListener(
      'msfullscreenchange',
      function () {
        fullscreenState.INNERHTML = document.msFullscreenElement ? '' : 'not '
      },
      false
    )

    return {
      myRef,
      handleOpen,
      isFengHua,
      showOpenWindow,
      isRuralBrain,
      yearText,
      minuteText,
      isSelectTimePage,
      goPage,
      handleGoPage,
      isShowMl,
      show,
      state,
      popBrain,
      showBrainAction,
      selectAreaVal,
      isShowPPTPlayer,
      closeModel,
      PPTImgList,
      isYuyao
    }
  }
})
</script>

<style scoped lang="scss">
.container {
  overflow: hidden;
  position: relative;
  height: 1080px;
  width: 1920px;
  transform-origin: 0 0;
  transition: all 0.8s;
  //background: rgba(4, 50, 96, .8);
  // background: url('./image/bg.webp') no-repeat;
  // background: url('./image/bg.png') no-repeat;
  background: url('./image/textBg.jpg') no-repeat;
  background-size: 100% 100%;
  //background: url("https://changshan-ggfw-img.zjsszxc.com/dev/WechatIMG3586-rc-upload-1632637088051-2.jpeg") no-repeat;
  .header-box {
    display: flex;
    .handle-btn {
      flex: 1;
      // width: 750px;
      height: 72px;
      font-size: 50px;
      font-family: PangMenZhengDao-3, PangMenZhengDao;
      font-weight: normal;
      color: #ffffff;
      display: flex;
      // justify-content: center;
      align-items: center;
      padding-left: 246px;
      line-height: 57px;
      letter-spacing: 9px;
      text-shadow: 0px 6px 20px rgba(1, 14, 52, 0.63);
      b{
        cursor: pointer;
        font-weight: normal;
      }
      img{
        width: 36px;
        height: 36px; 
        margin-left: 18px;
        cursor: pointer;
      }
    }
    position: absolute;
    z-index: 999;
    top: 0px;
    left: 0;
    padding-left: 44px;
    padding-right: 122px;
    box-sizing: border-box;
    display: flex;
    width: 100%;
    height: 110px;
    background-image: url('https://img.hzanchu.com/acimg/59d41089327bb6371dc266177fa556cd.png');
    background-size: 100% 100%;
    box-sizing: border-box;
    justify-content: flex-end;
    .title{
      display: flex;
      align-items: center;
      font-size: 34px;
      height: 59px;
      font-family: PangMenZhengDao-3, PangMenZhengDao;
      font-weight: normal;
      color: rgba(102, 102, 102, 0.7);
      line-height: 30px;
      letter-spacing: 2px;
      text-shadow: 1px 2px 3px rgba(0,11,28,0.7000);
      background: linear-gradient(180deg, #FFFFFF 0%, #A3D2FF 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .selected-title {
      display: flex;
      justify-content: center;
     // padding-left: 62px;
      box-sizing: border-box;
      align-items: center;
      // padding-top: 10px;
      box-sizing: border-box;
      text-align: center;
      width: 303px;
      height: 88px;
      margin-top: -4px;
      // background: url('https://img.hzanchu.com/acimg/3d00f54a9a070e12d7eb92fa41cacfba.png') no-repeat;
      background: url('https://img.hzanchu.com/acimg/06d5dec685133565c9a299e5d53560d6.png') no-repeat;
      background-size: 100% 100%;
      b{
        font-size: 34px;
        font-family: PangMenZhengDao-3, PangMenZhengDao;
        font-weight: normal;
        color: #666666;
        line-height: 39px;
        letter-spacing: 2px;
        text-shadow: rgba(163, 210, 255, 1);
        background: linear-gradient(180deg, #FFFFFF 0%, #A3D2FF 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
    .right-btn {
     // width: 333px;
      margin-right: auto;
      height: 61px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      .search-icon {
        width: 36px;
        height: 36px;
        position: absolute;
        cursor: pointer;
        right: 0;
        top: 11px;
      }
    }
    .minute-box {
      margin-top: 17px;
      font-size: 20px;
      margin-right: 69px;
      font-weight: 600;
    }
    img {
      width: 149px;
      height: 31px;
    }
    span {
      display: inline-block;
      font-family: MicrosoftYaHei-, MicrosoftYaHei;
      font-weight: normal;
      color: #71c3ff;
      font-size: 16px;
      height: 21px;
      margin-right: 16px;
      text-shadow: 0px 1px 4px #002d6c;
    }
  }
  .header {
    position: absolute;
    z-index: 999;
    top: -8px;
    left: 0;
    width: 1178px;
    height: 131px;
    display: block;
    margin-left: 20%;
  }
  .show-icon {
    position: absolute;
    width: 25px;
    z-index: 999;
    height: 25px;
    cursor: pointer;
    top: 19px;
    right: 24px;
  }
  .page-container {
    position: absolute;
    top: 0;
    height: 1080px;
    width: 100%;
    background-size: 100% 100%;
    overflow: hidden;
  }
}
.PPT-player-box{
  height: 896px;
  padding-top: 40px;
  box-sizing: border-box;
  img{
    width: 100%;
    height: 806px;
  }
}
</style>
