<template>
  <!-- 粮食生产功能区 -->
  <div>
    <div class="item" v-for="item in props.info.list" :key="item.name">
      <div class="switch-wrap" v-if="item.type === 'switch'">
        <ModuleHeader v-bind="$attrs" :name="item.name" v-model="item.value" :hideArrow="!item.children" />
      </div>
      <div class="other-wrap" v-else>
        <div class="header">
          <span class="name">{{ item.name }}</span>
          <img v-if="item.children" class="arrow" @click="expandChange(item)" :class="['arrow', item.expand ? 'arrow_expand' : '']" :src="require('../../../../../image/arrow_icon_down.png')" alt="" />
        </div>
        <div v-show="item.expand" class="content">
          <CheckBoxGroup @checkBoxChange="checkBoxChange($event, item.name)" class="mlr-20" :list="item.children.list" v-model="item.children.value" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps, defineEmits } from 'vue'
import ModuleHeader from './ModuleHeader'
import CheckBoxGroup from './CheckBoxGroup'
const emits = defineEmits(['valueChange'])
const props = defineProps({
  info: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
const expandChange = (item) => {
  item.expand = !item.expand
}
const checkBoxChange = (v, name) => {
  emits('valueChange', v, name)
}
</script>
<style lang="scss" scoped>
.item {
  .mlr-20 {
    margin: 0 20px;
  }
  .switch-wrap {
    :deep(.item-header) {
      background: url('https://img.hzanchu.com/acimg/c6e284fabc4bc540b008553a89b47bae.png') no-repeat;
      background-size: 100% 100%;
      padding-left: 70px;
      padding-right: 50px;
    }
  }
  .other-wrap {
    .header {
      background: url('https://img.hzanchu.com/acimg/c6e284fabc4bc540b008553a89b47bae.png') no-repeat;
      background-size: 100% 100%;
      padding-left: 70px;
      padding-right: 50px;
      position: relative;
      display: flex;
      align-items: center;
      margin: 16px 0 5px;
      height: 42px;
      border-radius: 2px;
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
        right: 20px;
        &.arrow_expand {
          transform: rotate(-180deg);
        }
      }
    }
  }
}
</style>
