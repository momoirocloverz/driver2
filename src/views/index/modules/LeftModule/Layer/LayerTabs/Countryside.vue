<template>
  <div>
    <div class="item" v-for="item in countrysideTypes" :key="item.name">
      <ModuleHeader
        v-model="item.value"
        :hideSwitch="item.hideSwitch"
        :isExpand="item.expand"
        :name="item.name"
        :color="item.color"
        @switchChange="valueChange"
        :hideArrow="!item.children"
        @expandChange="item.expand = !item.expand"
      />
      <div class="content" v-show="item.expand" v-if="item.children">
        <RadioGroup class="mlr-20" :list="item.children.list" v-model="item.children.value" @radioChange="valueChange" />
      </div>
    </div>
  </div>
</template>
<script setup>
import ModuleHeader from './Module/ModuleHeader'
import RadioGroup from './Module/RadioGroup'
import { ref, defineExpose, defineEmits } from 'vue'
import { cloneDeep } from 'lodash-es'
const emits = defineEmits(['valueChange'])
const countrysideTypes = ref([
  {
    name: '村庄',
    expand: true,
    hideSwitch: true,
    children: {
      type: 'radio',
      value: [],
      list: [
        {
          name: '新时代美丽乡村达标村',
          color: '#005AC1'
        },
        {
          name: '未来乡村',
          color: '#648212'
        },
        {
          name: '小集镇式中心村',
          color: '#168577'
        },
        {
          name: '梳理式改造村',
          color: '#7C641B'
        },
        {
          name: '省特色精品村',
          color: '#7446A8'
        }
      ]
    }
  },
  {
    name: '示范镇',
    value: false
  },
  {
    name: '乡村振兴示范带',
    value: false
  },
  {
    name: '农资分布',
    value: false
  },
  {
    name: '乡村物流',
    value: false
  },
  {
    name: '乡村振兴学院',
    value: false
  },
  {
    name: '集体三资',
    value: false
  }
])

// 获取数据
const sendMessageInfo = ref({
  obj: {}
})
const valueChange = () => {
  emits('valueChange', getValues())
}
const getValues = (list = countrysideTypes.value, obj = {}) => {
  list.forEach((one) => {
    if (!one.children) {
      obj[one.name] = one.value
    } else {
      obj[one.name] = cloneDeep(one.children.value) || []
    }
  })
  return obj
}
const getSendMessageInfo = () => {
  let valueObj = getValues()
  let obj = {
    村庄: valueObj['村庄'].length ? valueObj['村庄'][0] : '',
    示范镇: valueObj['示范镇'],
    示范带: valueObj['乡村振兴示范带'],
    集体三资: valueObj['集体三资'],
    乡村振兴学院: valueObj['乡村振兴学院'],
    乡村物流: valueObj['乡村物流'] ? '乡村物流' : '',
    农资分布: valueObj['农资分布'] ? '农资分布' : ''
  }
  return obj
}
defineExpose({
  getSendMessageInfo
})
</script>
<style lang="scss" scoped>
.mlr-20 {
  margin: 0 20px;
}
</style>
