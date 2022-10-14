<template>
  <div class="container" :style="{ backgroundImage: isYuyao ? 'url(' + require('./image/yuyao-bg.png') + ')' : 'url(' + require('./image/textBg.jpg') + ')' }" ref="myRef">
    <Header v-if="!headerHide" />
    <router-view class="page-container" />
  </div>
</template>
<script>
import { defineComponent, onBeforeUnmount, onMounted, ref, computed, reactive } from 'vue'
import { useRoute } from 'vue-router'
import lodash from 'lodash'
import Header from './components/Header.vue'
export default defineComponent({
  components: { Header },
  setup() {
    const myRef = ref('')
    const Route = useRoute()
    const area = reactive(Route.query.area)
    const headerHide = computed(() => {
      // 奉化和余姚都不展示头部
      return area === 'yuyao' || area === 'fenghua'
    })
    const isYuyao = ref(area === 'yuyao') // 是否为余姚驾驶舱
    const onResize = lodash.debounce(
      () => {
        myRef.value.style.transform = `scaleX(${window.innerWidth / 1920}) scaleY(${window.innerHeight / 1080})`
      },
      { leading: true, trailing: true }
    )
    onMounted(() => {
      onResize()
      window.addEventListener('resize', () => {
        onResize()
      })
    })
    onBeforeUnmount(() => {
      window.removeEventListener('resize')
    })

    return {
      myRef,
      isYuyao,
      headerHide
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
  .page-container {
    position: absolute;
    top: 0;
    height: 1080px;
    width: 100%;
    background-size: 100% 100%;
    overflow: hidden;
  }
  :deep(.PPT-player-box) {
    height: 896px;
    padding-top: 40px;
    box-sizing: border-box;
    img {
      width: 100%;
      height: 806px;
    }
  }
}
</style>
