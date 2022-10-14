<template>
  <div class="tarval-detail">
    <module-title title="旅游资源详情" position="right" />
    <template v-if="!selectInfo">
      <img class="picture-null" :src="require('@/assets/image/empty.png')" />
      <div>请到某个镇街中选中旅游资源，查看详情。</div>
    </template>
    <template v-if="selectInfo">
      <div class="list">
        <div class="vd-img-box" v-if="selectInfo['图片路径']">
          <el-image style="width: 100%; height: 250px" :src="selectInfo['图片路径']" fit="cover" :preview-src-list="selectInfo['图片路径']" preview-teleported>
            <template #error>
              <el-image :src="NoImage" style="width: 100%; height: 250px" fit="cover" />
            </template>
          </el-image>
        </div>
        <div class="vd__images-container" v-if="Array.isArray(selectInfo['图片']) && selectInfo['图片'].length">
          <el-carousel trigger="click" class="vd__images" height="160px" indicator-position="none" arrow="never" ref="carouselRef">
            <el-carousel-item v-for="(item, index) in selectInfo['图片']" :key="index">
              <el-image :src="item" fit="cover" :preview-src-list="[item]" preview-teleported>
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
          <div class="line" v-if="item.key != '图片'">
            <el-image
              v-if="item.key == '二维码' && selectInfo[item.dataIndex]"
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
<script setup>
import { ref, defineProps, watch } from 'vue'
import moduleTitle from '@/components/moduleTitle'
import CarouselArrow from '@/views/index/image/carousel-arrow.svg'
import NoImage from '@/assets/image/default-image.svg'
const props = defineProps({
  selectInfo: {
    default: [],
    type: Array
  }
})
const carouselRef = ref(null)
const rightList = ref([
  { key: '名称', dataIndex: '名称', value: '' },
  { key: '地址', dataIndex: '地址', value: '' },
  { key: '介绍', dataIndex: '介绍', value: '' }
])
const getRightListData = (val) => {
  const reg = /[\u4e00-\u9fa5]+/g // 匹配中文
  let newArr = []
  for (const key in val) {
    if (key.match(reg) && key != '图片路径') {
      newArr.push({ key: key, dataIndex: key })
    }
  }
  rightList.value = newArr
}
watch(
  () => props.selectInfo,
  (val) => {
    console.log(val, 'val')
    getRightListData(val)
  },
  { deep: true, immediate: true }
)
</script>
<style lang="scss" scoped>
.tarval-detail {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #fff;
  font-size: 16px;
  .picture-null {
    width: 54px;
    height: 54px;
    margin-top: 80px;
    margin-bottom: 24px;
  }
  .list {
    overflow: auto;
    height: 772px;
    padding-top: 24px;
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
    .vd-img-box {
      // display: flex;
      // justify-content: center;
      // align-items: center;
      img {
        width: 100%;
        height: 250px;
      }
      margin-bottom: 20px;
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
}
</style>
