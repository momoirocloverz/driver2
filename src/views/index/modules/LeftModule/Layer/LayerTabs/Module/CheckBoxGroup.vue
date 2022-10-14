<template>
  <div class="checkboxgroup">
    <template v-for="checkbox in props.list" :key="checkbox.name">
      <div class="checkbox" @click="checkBoxChange(checkbox)" v-if="!checkbox.isHide">
        <img class="status" :src="getStatusImg(checkbox)" alt="" />
        <span class="circle" v-if="checkbox.color" :style="{ background: checkbox.color }"></span>
        <span class="name">{{ checkbox.name }}</span>
        <img
          v-if="checkbox.children"
          class="arrow"
          @click.stop="expandChange(checkbox)"
          :class="['arrow', checkbox.expand ? 'arrow_expand' : '']"
          :src="require('../../../../../image/arrow_icon_down.png')"
          alt=""
        />
      </div>
      <div class="checkbox_children" v-show="checkbox.expand" v-if="checkbox.children">
        <CheckBoxGroup @checkBoxChange="(child) => childCheckBoxChange(child, checkbox)" :list="checkbox.children.list" v-model="checkbox.children.value" />
        <div class="close-btn" @click="checkbox.expand = false">
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

const emits = defineEmits(['update:modelValue', 'checkBoxChange'])
const checkBoxChange = (item) => {
  let name = item.name
  let index = props.modelValue.indexOf(name)
  let newList = cloneDeep(props.modelValue)
  if (index > -1) {
    newList.splice(index, 1)
  } else {
    newList.push(name)
  }
  emits('update:modelValue', newList)
  emits('checkBoxChange', item)
  parentCheckChangeDo(item)
}
// 父选影响子选
const parentCheckChangeDo = (item) => {
  if (!item.children) return
  let name = item.name
  let isCheck = props.modelValue.indexOf(name)
  if (isCheck) {
    item.children.value = item.children.list.map((one) => one.name)
  } else {
    item.children.value = []
  }
}
// 子选影响父选
const childCheckBoxChange = (item, checkbox) => {
  let isCheckAll = checkbox.children.value.length === checkbox.children.list.length
  let newList = cloneDeep(props.modelValue)
  if (!isCheckAll) {
    let index = props.modelValue.indexOf(checkbox.name)
    newList.splice(index, 1)
  } else {
    newList.push(checkbox.name)
  }
  emits('update:modelValue', newList)
  emits('checkBoxChange', item)
}
const getStatusImg = (item) => {
  let name = item.name
  if (props.modelValue.indexOf(name) > -1 || (item.children && item.children.value.length === item.children.list.length)) {
    // 全选
    return require('../../../../../image/select_icon_active.png')
  } else if (item.children && item.children.value.length) {
    // 半选
    return require('../../../../../image/select_icon_selecting.png')
  }
  // 未选
  return require('../../../../../image/select_icon_empty.png')
}
const expandChange = (item) => {
  item.expand = !item.expand
}
</script>
<style lang="scss" scoped>
.checkboxgroup {
  .checkbox {
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
  .checkbox_children {
    padding-left: 48px;
    padding-right: 20px;
    .checkbox {
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
