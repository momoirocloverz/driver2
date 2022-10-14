<template>
  <RadioGroup classkey="mlr-20" @radioChange="valueChange" :list="industryTypes.list" v-model="industryTypes.value" />
</template>
<script setup>
import RadioGroup from './Module/RadioGroup'
import { ref, defineEmits, defineExpose } from 'vue'
import { cloneDeep } from 'lodash'
const emits = defineEmits(['valueChange'])
const isFengHua = ref(window.location.search.split('area=')[1] === 'fenghua') // 是否为奉化驾驶舱
const industryTypes = ref({
  type: 'radio',
  value: [],
  list: [
    {
      name: '粮食',
      color: 'transparent'
    },
    {
      name: '蔬菜',
      color: '#FFA8A8'
    },
    {
      name: '畜牧',
      color: '#E6A3FF'
    },
    {
      name: '水产',
      color: '#FEC561'
    },
    {
      name: '水果',
      color: 'transparent',
      children: {
        list: [{ name: '水蜜桃' }]
      }
    },
    {
      name: '茶叶',
      color: '#9EFD6B'
    },
    {
      name: '农家乐',
      color: '#FFFF00'
    },
    {
      name: '农产品加工',
      color: '#00BFFF'
    },
    {
      name: '竹子',
      color: '#A7BF1F',
      isHide: !isFengHua.value,
      children: {
        list: [
          {
            name: '毛竹'
          },
          {
            name: '杂竹'
          }
        ]
      }
    },
    {
      name: '花卉苗木',
      color: '#44A0CC',
      isHide: !isFengHua.value
    }
  ]
})

// 获取所选数据
const valueChange = (v) => {
  emits('valueChange', getSendMessageInfo())
}
const getValues = (list, values, obj = {}) => {
  list.forEach((one) => {
    obj[one.name] = values.includes(one.name)
    // radio中如果父选项没选，但存在有子选项被选择了，那父选项的值就是子选项
    if (!obj[one.name] && one.children) {
      obj[one.name] = values.find((item) => one.children.list.map((one) => one.name).includes(item))
    }
    if (one.children) {
      getValues(one.children.list, values, obj)
    }
  })
  return obj
}
const getSendMessageInfo = () => {
  let valueObj = getValues(industryTypes.value.list, industryTypes.value.value, {})
  let value = industryTypes.value.value
  let obj = {
    花卉苗木: valueObj['花卉苗木'] ? '2020' : '',
    竹子: valueObj['竹子'] || '',
    产业基地面: [valueObj['水果'] || (valueObj['粮食'] ? '粮食' : '')].filter((one) => one), // '粮食'或水果类
    产业基地点: ['粮食', '水果', '竹子', '花卉苗木'].some((one) => valueObj[one]) ? '' : value // '粮食', '水果', '竹子', '花卉苗木'外的选项
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
