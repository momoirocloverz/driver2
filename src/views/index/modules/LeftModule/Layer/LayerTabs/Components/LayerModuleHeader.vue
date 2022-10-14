<template>
  <div class="module-header">
    <img v-if="imgUrl" class="icon" :src="imgUrl" alt="" />
    <span class="text">{{ title }}</span>
    <img :class="['arrow', isExpand_ ? 'arrow_expand' : '']" @click="expandChange" :src="require('../../../../../image/arrow_icon_down.png')" alt="" />
  </div>
</template>
<script setup>
import { defineProps, ref, defineEmits } from 'vue'
const props = defineProps({
  imgUrl: {
    default: '',
    type: String
  },
  title: {
    default: '',
    type: String
  },
  isExpand: {
    default: false,
    type: Boolean
  }
})

const emits = defineEmits(['expandChange'])
const isExpand_ = ref(props.isExpand)
const expandChange = () => {
  isExpand_.value = !isExpand_.value
  emits('expandChange', isExpand_.value)
}
</script>
<style lang="scss" scoped>
.module-header {
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
  box-sizing: border-box;
  .icon {
    width: 18px;
    height: 18px;
    margin-right: 30px;
  }
  .text {
    flex: 1;
  }
  .arrow {
    cursor: pointer;
    width: 16px;
    height: 16px;
    transition: all 0.3s;
    &.arrow_expand {
      transform: rotate(-180deg);
    }
  }
}
</style>
