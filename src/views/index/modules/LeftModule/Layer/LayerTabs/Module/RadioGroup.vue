<template>
  <div class="radioGroup">
    <template v-for="radio in props.list" :key="radio.name">
      <div class="radio" @click="radioChange(radio)" v-if="!radio.isHide">
        <!-- 单选，如果子选项超过1个，父单选图标不展示 -->
        <span v-if="radio.children && radio.children.list.length > 1" class="status"></span>
        <img v-else class="status" :src="getStatusImg(radio)" alt="" />
        <span class="circle" v-if="radio.color" :style="{ background: radio.color }"></span>
        <span class="name">{{ radio.name }}</span>
        <img
          v-if="radio.children"
          class="arrow"
          @click.stop="expandChange(radio)"
          :class="['arrow', radio.expand ? 'arrow_expand' : '']"
          :src="require('../../../../../image/arrow_icon_down.png')"
          alt=""
        />
      </div>
      <div class="radio_children" v-show="radio.expand" v-if="radio.children">
        <RadioGroup @radioChange="radioChange" :list="radio.children.list" :modelValue="modelValue" @update:modelValue="emits('update:modelValue', $event)" />
        <div class="close-btn" @click="radio.expand = false">
          <img :src="require('../../../../../image/select_close.png')" alt="" />
        </div>
      </div>
    </template>
  </div>
</template>
<script setup>
import { defineProps, defineEmits } from 'vue'
import { cloneDeep } from 'lodash'
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emits = defineEmits(['update:modelValue', 'radioChange'])
const radioChange = (item) => {
  // 多个子项，则父项取消点击事件
  if (item.children && item.children.list.length > 1) return
  let name = item.name
  let index = props.modelValue.indexOf(name)
  let newList = cloneDeep(props.modelValue)
  if (!item.children) {
    if (index > -1) {
      newList = []
    } else {
      newList = [name]
    }
  } else {
    newList = parentRadioChangeDo(item, newList)
  }
  emits('update:modelValue', newList)
  emits('radioChange', item)
}
// 父选影响子选
const parentRadioChangeDo = (item) => {
  let checkList = []
  if (!item.children || item.children.list.length > 1) return
  if (props.modelValue[0] === item.children.list[0].name) {
    checkList = []
  } else {
    checkList = [item.children.list[0].name]
  }
  return checkList
}
const expandChange = (item) => {
  item.expand = !item.expand
}
const getStatusImg = (item) => {
  let name = item.name
  if (props.modelValue.indexOf(name) > -1 || (item.children && item.children.list.length === 1 && item.children.list[0].name === props.modelValue[0])) {
    // 选择
    return 'https://img.hzanchu.com/acimg/634f714268ba500435a4d53986deb7d8.png'
  } else {
    // 未选
    return 'https://img.hzanchu.com/acimg/c648bb8778c071d65facbc0a3b98ebad.png'
  }
}
</script>
<style lang="scss" scoped>
.radioGroup {
  .radio {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    box-sizing: border-box;
    padding: 0 0 0 48px;
    min-height: 22px;
    cursor: pointer;
    .status {
      width: 18px;
      height: 18px;
      margin-right: 14px;
    }
    .circle {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-right: 9px;
    }
    .name {
      flex: 1;
      line-height: 22px;
      font-weight: 600;
      background: linear-gradient(180deg, #ffffff 0%, #65c7ff 100%);
      -webkit-background-clip: text;
      color: transparent;
      padding: 10px 0;
    }
    .arrow {
      cursor: pointer;
      width: 16px;
      height: 16px;
      transition: all 0.3s;
      position: absolute;
      top: 12px;
      right: 0px;
      &.arrow_expand {
        transform: rotate(-180deg);
      }
    }
  }
  .radio_children {
    padding-left: 48px;
    padding-right: 20px;
    .radio {
      &:nth-of-type(2n-1) {
        background: #0f3d6c;
      }
    }
    .close-btn {
      text-align: center;
      img {
        height: 22px;
        width: 127px;
      }
    }
  }
}
</style>
