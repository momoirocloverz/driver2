<template>
  <div class="land">
    <div class="item" v-for="item in landTypes" :key="item.name">
      <ModuleHeader
        v-model="item.value"
        :color="item.color"
        :name="item.name"
        :isExpand="item.expand"
        :hideArrow="!item.children"
        @expandChange="(v) => expandChange(v, item)"
        @switchChange="valueChange($event, item.name)"
      />

      <div v-show="item.expand" v-if="item.children">
        <CheckBoxGroup @checkBoxChange="valueChange(item.name)" class="mlr-20" v-if="item.children.type === 'checkbox'" v-model="item.children.value" :list="item.children.list" />
        <GrainProduction v-if="item.children.type === 'GrainProduction'" @switchChange="valueChange" @checkBoxChange="valueChange" @valueChange="valueChange" :info="item.children" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch, defineEmits, onMounted, defineExpose, defineProps } from 'vue'
import { cloneDeep } from 'lodash'
import ModuleHeader from './ModuleHeader'
import CheckBoxGroup from './CheckBoxGroup'
import GrainProduction from './GrainProduction'
const emits = defineEmits(['valueChange'])
const landTypes = ref([
  {
    name: '耕地',
    // [getValueKey]用于获取key的关键字段，为空则读取name字段，之所以有这个字段是因为下面有个字段也叫【耕地】,重复了
    getValueKey: '1-耕地',
    color: '#ff1493',
    expand: false,
    value: false
  },
  {
    name: '永久基本农田',
    color: '#67caff',
    expand: false,
    value: false,
    children: {
      type: 'checkbox',
      value: [],
      list: [
        {
          name: '耕地内永农',
          color: '#9FAA45'
        },
        {
          name: '耕地外永农',
          color: '#73BA74'
        }
      ]
    }
  },
  {
    name: '高标准农田',
    color: '#4a0bff',
    expand: false,
    value: false,
    children: {
      type: 'checkbox',
      list: [
        {
          name: '耕地内高标农',
          color: '#A7BF1F'
        },
        {
          name: '耕地外高标农',
          color: '#44A0CC'
        },
        {
          name: '永农内高标农',
          color: '#BFA51F'
        },
        {
          name: '永农外高标农',
          color: '#CC8A1F'
        },
        {
          name: '同时在耕地、永农内高标农',
          color: '#FD7E3F'
        },
        {
          name: '粮功区外高标农',
          color: '#C85C9D'
        },
        {
          name: '高标农内粮功区',
          color: '#DE5887'
        }
      ]
    }
  },
  {
    name: '粮食生产功能区',
    color: '#006ff0',
    expand: false,
    value: false,
    children: {
      type: 'GrainProduction',
      list: [
        {
          name: '利用现状',
          expand: false,
          children: {
            value: [],
            list: [
              {
                name: '耕地',
                color: '#71D964',
                children: {
                  type: 'checkbox',
                  value: [],
                  list: [{ name: '水田' }, { name: '旱地' }]
                }
              },
              {
                name: '种植园用地',
                color: '#38D672',
                children: {
                  type: 'checkbox',
                  value: [],
                  list: [{ name: '果园' }, { name: '茶园' }, { name: '其他园地' }]
                }
              },
              {
                name: '林地',
                color: '#18CC00',
                children: {
                  type: 'checkbox',
                  value: [],
                  list: [{ name: '乔木林地' }, { name: '竹林地' }, { name: '灌木林地' }, { name: '其他林地' }]
                }
              },
              {
                name: '其他农业用地',
                color: '#009942',
                children: {
                  type: 'checkbox',
                  value: [],
                  list: [
                    { name: '其他土地' },
                    { name: '可调整乔木林地' },
                    { name: '可调整其他园地' },
                    { name: '可调整其他林地' },
                    { name: '可调整养殖坑塘' },
                    { name: '可调整果园' },
                    { name: '可调整茶园' },
                    { name: '坑塘水面' },
                    { name: '水库水面' },
                    { name: '沟渠' },
                    { name: '设施农用地' }
                  ]
                }
              },
              {
                name: '农村道路',
                color: '#26B4FD'
              },
              {
                name: '河流水面',
                color: '#22D0D0'
              },
              {
                name: '公路用地',
                color: '#9389FC'
              },
              {
                name: '农村宅基地',
                color: '#C3BB27'
              },
              {
                name: '工业用地',
                color: '#FD9C48'
              },
              {
                name: '其他',
                color: '#FD642C',
                children: {
                  type: 'checkbox',
                  value: [],
                  list: [
                    { name: '交通服务场站用地' },
                    { name: '公园与绿地' },
                    { name: '公用设施用地' },
                    { name: '其他草地' },
                    { name: '养殖坑塘' },
                    { name: '内陆滩涂' },
                    { name: '商业服务业设施用地' },
                    { name: '城镇住宅用地' },
                    { name: '城镇村道路用地' },
                    { name: '广场用地' },
                    { name: '机关团体新闻出版用地' },
                    { name: '水工建筑用地' },
                    { name: '沿海滩涂' },
                    { name: '物流仓储用地' },
                    { name: '特殊用地' },
                    { name: '科教文卫用地' },
                    { name: '管道运输用地' },
                    { name: '轨道交通用地' },
                    { name: '采矿用地' },
                    { name: '铁路用地' }
                  ]
                }
              }
            ]
          }
        },
        {
          name: '非粮化图斑',
          value: false,
          type: 'switch'
        },
        {
          name: '清理腾退',
          value: false,
          type: 'switch'
        },
        {
          name: '优化补入',
          value: false,
          type: 'switch'
        }
      ]
    }
  }
])
const expandChange = (v, item) => {
  item.expand = v
}
const valueChange = (v, name) => {
  // 粮食生产功能区 he 利用现状 有联动关系
  if (name === '粮食生产功能区') {
    GrainProductionChangeAfter(v)
  } else if (name === '利用现状') {
    utilizationStatusChangeAfter()
  }
  emits('valueChange', getSendMessageInfo())
}
const GrainProductionChangeAfter = (isCheck) => {
  let children = landTypes.value.find((one) => one.name === '粮食生产功能区').children
  utilizationStatusDeep(children, isCheck)
}
// 利用现状的value改变
const utilizationStatusDeep = (children, isCheck) => {
  children.value = isCheck ? children.list.map((one) => one.name) : []
  children.list.forEach((one) => {
    if (one.children) {
      utilizationStatusDeep(one.children, isCheck)
    }
  })
}
const utilizationStatusChangeAfter = () => {
  let utilizationStatusChildren = landTypes.value.find((one) => one.name === '粮食生产功能区').children.list.find((one) => one.name === '利用现状').children
  let isCheckAll = utilizationStatusChildren.value.length === utilizationStatusChildren.list.length
  console.log(
    utilizationStatusChildren.value.length === utilizationStatusChildren.list.length,
    landTypes.value.find((one) => one.name === '粮食生产功能区')
  )
  landTypes.value.find((one) => one.name === '粮食生产功能区').value = isCheckAll
}

const getValues = (list, obj = {}, values) => {
  list.forEach((one) => {
    if (!values || one.type === 'switch') {
      obj[one.getValueKey || one.name] = one.value
    } else {
      obj[one.getValueKey || one.name] = values.includes(one.name)
    }
    if (one.children) {
      getValues(one.children.list, obj, one.children.value || [])
    }
  })
  return obj
}
// 三调地类
const getSDDLValue = () => {
  let childrenMap = landTypes.value.find((one) => one.name === '粮食生产功能区').children.list.find((one) => one.name === '利用现状').children
  let list = childrenMap.list || []
  let value = childrenMap.value || []
  let obj = {}
  list.forEach((item) => {
    let name = item.name
    obj[name] = []
    if (!item.children) {
      obj[name] = value.includes[name] ? [name] : []
    } else {
      obj[name] = cloneDeep(item.children.value) || []
    }
    if (name === '其他') {
      obj['其他非农用地'] = obj['其他']
      delete obj['其他']
    }
  })
  return obj
}
const getSendMessageInfo = () => {
  let valueObj = getValues(landTypes.value)
  let obj = {
    三调地类: getSDDLValue(),
    非粮化图斑: valueObj['非粮化图斑'] ? '非粮化图斑' : '',
    清理腾退: valueObj['清理腾退'] ? '清理腾退' : '',
    优化补入: valueObj['优化补入'] ? '优化补入' : '',
    耕地: valueObj['1-耕地'] ? '耕地' : '',
    永久基本农田: valueObj['永久基本农田'] ? '永久基本农田' : '',
    耕地内永农: valueObj['耕地内永农'] ? '耕地内永农' : '',
    耕地外永农: valueObj['耕地外永农'] ? '耕地外永农' : '',
    高标准农田: valueObj['高标准农田'] ? '高标准农田' : '',
    耕地内高标农: valueObj['耕地内高标农'] ? '耕地内高标农' : '',
    耕地外高标农: valueObj['耕地外高标农'] ? '耕地外高标农' : '',
    永农内高标农: valueObj['永农内高标农'] ? '永农内高标农' : '',
    永农外高标农: valueObj['永农外高标农'] ? '永农外高标农' : '',
    耕地和永农内高标农: valueObj['同时在耕地、永农内高标农'] ? '耕地和永农内高标农' : '',
    高标农外粮功区: valueObj['粮功区外高标农'] ? '高标农外粮功区' : '',
    高标农内粮功区: valueObj['高标农内粮功区'] ? '高标农内粮功区' : ''
  }
  return obj
}
defineExpose({
  getSendMessageInfo
})
</script>
<style lang="scss" scoped>
.land {
  .mlr-20 {
    margin: 0 20px;
  }
}
</style>
