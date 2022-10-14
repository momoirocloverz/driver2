<template>
  <img :class="$attrs.class" @click="isShowPPTPlayer = true" src="https://img.hzanchu.com/acimg/542cd9e27b8efe4aa56b93f1beecfdd0.png" alt="" />
  <Teleport :to="teleportTo">
    <PPTPlayerDialog v-if="isShowPPTPlayer" @shutCurrent="closeModel" :visible="isShowPPTPlayer" :width="1400" top="5vh" title="宁波乡村大脑">
      <div class="PPT-player-box">
        <el-carousel height="806px" indicator-position="outside" :autoplay="false">
          <el-carousel-item v-for="item in PPTImgList" :key="item">
            <img :src="item" alt="" />
          </el-carousel-item>
        </el-carousel>
      </div>
    </PPTPlayerDialog>
  </Teleport>
</template>
<script setup>
import PPTPlayerDialog from '@/components/PPTPlayerDialog'
import { PPTImgList } from '../modal/const'
import { ref, onMounted } from 'vue'
const isShowPPTPlayer = ref(false)
const teleportTo = ref('#app')
onMounted(() => {
  teleportTo.value = '.container'
})
const closeModel = () => {
  isShowPPTPlayer.value = false
}
</script>
