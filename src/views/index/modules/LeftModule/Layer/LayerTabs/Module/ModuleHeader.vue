<template>
  <div class="item-header">
    <img class="header-img" :src="props.imgUrl" v-if="props.imgUrl" />
    <span class="circle" v-if="props.color" :style="{ background: props.color }"></span>
    <p class="name">{{ props.name }}</p>
    <el-switch v-if="!hideSwitch" :value="modelValue" @change="onSwitchChange" inline-prompt active-text="打开" inactive-text="关闭" active-color="#4EC2FF" inactive-color="#30587E" />
    <img v-if="!hideArrow" class="arrow" @click="expandChange" :class="['arrow', isExpand_ ? 'arrow_expand' : '']" :src="require('../../../../../image/arrow_icon_down.png')" alt="" />
  </div>
</template>
<script setup>
import { ref, defineProps, defineEmits } from 'vue'
const props = defineProps({
  color: {
    default: '',
    type: String
  },
  imgUrl: {
    default: '',
    type: String
  },
  name: {
    default: '',
    type: String
  },
  modelValue: { default: false, type: Boolean },
  hideArrow: { default: false, type: Boolean },
  hideSwitch: { default: false, type: Boolean },
  isExpand: { default: false, type: Boolean }
})
const emits = defineEmits(['switchChange', 'update:modelValue', 'expandChange'])
const isExpand_ = ref(props.isExpand)
const onSwitchChange = (v) => {
  emits('update:modelValue', v)
  emits('switchChange', v)
}
const expandChange = () => {
  isExpand_.value = !isExpand_.value
  emits('expandChange', isExpand_.value)
}
</script>
<style lang="scss" scoped>
.item-header {
  position: relative;
  display: flex;
  align-items: center;
  margin: 16px 0 5px;
  height: 42px;
  background: rgba(21, 63, 132, 0.64);
  border-radius: 2px;
  padding-left: 40px;
  padding-right: 45px;
  .circle {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 4px;
  }
  .header-img {
    width: 18px;
    height: 18px;
    position: absolute;
    top: 12px;
    left: 8px;
  }
  .name {
    flex: 1;
    overflow: hidden;
    font-size: 20px;
    font-family: PangMenZhengDao;
  }
  .arrow {
    cursor: pointer;
    width: 16px;
    height: 16px;
    transition: all 0.3s;
    position: absolute;
    top: 12px;
    right: 10px;
    &.arrow_expand {
      transform: rotate(-180deg);
    }
  }
}
</style>
