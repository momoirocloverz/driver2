<template>
  <!-- 专题图层内容 -->
  <div class="theme-layer">
    <div class="item" v-for="item in themeLayerTypes" :key="item.name">
      <module-title
        :title="item.name"
        :showThreeChild="item.expand"
        :isPackUp="item.children"
        @sendPankUpMessage="
          (v) => {
            item.expand = v.value.type
          }
        "
      />
      <div class="content" v-if="item.children" v-show="item.expand">
        <CheckBoxGroup v-if="item.children.type === 'checkbox'" @checkBoxChange="valueChange($event, item.name)" :list="item.children.list" v-model="item.children.value" />
        <RadioGroup v-else-if="item.children.type === 'radio'" @radioChange="valueChange" :list="item.children.list" v-model="item.children.value" />
        <div v-else>
          <div class="content_item" v-for="one in item.children.list" :key="one.name">
            <ModuleHeader
              :class="{ 'custom-header': one.imgUrl }"
              :imgUrl="one.imgUrl"
              :name="one.name"
              :hideArrow="!one.children"
              v-model="one.value"
              :hideSwitch="one.hideSwitch"
              @switchChange="valueChange($event, one.name)"
              @expandChange="(v) => (one.expand = v)"
            />
            <CheckBoxGroup v-if="one.children && one.children.type === 'checkbox'" v-show="one.expand" @checkBoxChange="valueChange" :list="one.children.list" v-model="one.children.value" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, defineEmits, defineProps, watch, defineExpose } from 'vue'
import { cloneDeep } from 'lodash'
import moduleTitle from '@/components/moduleTitle'
import ModuleHeader from './LayerTabs/Module/ModuleHeader'
import CheckBoxGroup from './LayerTabs/Module/CheckBoxGroup'
import RadioGroup from './LayerTabs/Module/RadioGroup'
import emitter from 'tiny-emitter/instance'
const emits = defineEmits(['valueChange', 'activeModuleChange', 'overallPlanChange'])
const props = defineProps({
  activeLayerCategoryTab: {
    default: '',
    type: String
  }
})
const themeLayerTypes = ref([
  {
    name: '生产力布局',
    expand: true,
    children: {
      list: [
        {
          name: '总布局',
          value: false
        },
        {
          name: '粮食',
          imgUrl: 'https://img.hzanchu.com/acimg/6eba4ecee81d43654df509ca7c531b68.png',
          hideSwitch: true,
          children: {
            value: [],
            type: 'checkbox',
            list: [
              {
                name: '小麦',
                color: '#A7BF1F'
              },
              {
                name: '水稻',
                color: '#63CC2B'
              }
            ]
          }
        },
        {
          name: '畜牧',
          imgUrl: 'https://img.hzanchu.com/acimg/f948ef17153b0f7dd563833195a22f79.png',
          hideSwitch: true,
          children: {
            value: [],
            type: 'checkbox',
            list: [
              {
                name: '宁海岔路黑猪',
                color: '#BA8DCB'
              },
              {
                name: '宁海县土鸡',
                color: '#C577E5'
              },
              {
                name: '象山白鹅',
                color: '#B542E5'
              },
              {
                name: '慈溪蜜蜂',
                color: '#9C88EF'
              },
              {
                name: '余姚蜜蜂',
                color: '#8062FB'
              },
              {
                name: '余姚番鸭',
                color: '#5A45B2'
              },
              {
                name: '江北奶牛',
                color: '#A67996'
              },
              {
                name: '镇海鹌鹑',
                color: '#CE5FA4'
              },
              {
                name: '余姚家禽',
                color: '#BF3B8D'
              }
            ]
          }
        },
        {
          name: '水产',
          imgUrl: 'https://img.hzanchu.com/acimg/6ab72d6a19e48374d18e89bfb20d14ee.png',
          hideSwitch: true,
          children: {
            value: [],
            type: 'checkbox',
            list: [
              {
                name: '水产总布局',
                color: '#9FAA45'
              },
              {
                name: '特色水产品养殖区域布局',
                color: '#73BA74'
              }
            ]
          }
        },
        {
          name: '蔬菜',
          imgUrl: 'https://img.hzanchu.com/acimg/60f183302606640e6722b04f4d097bcc.png',
          hideSwitch: true,
          children: {
            value: [],
            type: 'checkbox',
            list: [
              {
                name: '蔬菜总布局',
                color: '#C85C9D'
              },
              {
                name: '特色品种区域布局',
                color: '#AD6A63'
              }
            ]
          }
        },
        {
          name: '食用植物油',
          imgUrl: 'https://img.hzanchu.com/acimg/61aa6f4eeb098d7feb9f18591b51a6b0.png',
          hideSwitch: true,
          children: {
            value: [],
            type: 'checkbox',
            list: [
              {
                name: '油菜籽重点乡镇',
                color: '#44A0CC'
              },
              {
                name: '油茶重点乡镇',
                color: '#1070F4'
              }
            ]
          }
        }
      ]
    }
  },
  {
    name: '农业经营主体',
    expand: false,
    children: {
      type: 'radio',
      value: [],
      list: [
        {
          name: '合作社',
          color: '#FF984C'
        },
        {
          name: '家庭农场',
          color: '#22DAD7'
        },
        {
          name: '农业企业',
          color: '#3C81FF'
        },
        {
          name: '大户',
          color: '#C773FF'
        },
        {
          name: '农家乐',
          color: '#FFFF00'
        },
        {
          name: '其他',
          color: '#69EF68'
        }
      ]
    }
  },
  {
    name: '乡村旅游精品线路',
    expand: false,
    children: {
      type: 'checkbox',
      value: [],
      list: [{ name: '2022' }]
    }
  }
])
// 切换图层，总布局的值要恢复false
watch(
  () => {
    return props.activeLayerCategoryTab
  },
  () => {
    setOverallPlanValue(false)
  }
)
// 获取数据
const sendMessageInfo = ref({
  name: '土地非农化',
  obj: {}
})
// 是否选择了【精品】
const isJingPin = ref('')
watch(
  () => {
    return '精品线路' in sendMessageInfo.value.obj
  },
  (v) => {
    isJingPin.value = v ? '精品' : ''
    emits('activeModuleChange', isJingPin.value)
  },
  { immediate: true }
)

const getValues = (list = themeLayerTypes.value, obj = {}) => {
  obj['精品线路'] = cloneDeep(list.find((one) => one.name === '乡村旅游精品线路').children.value)
  if (!obj['精品线路'].length) {
    delete obj['精品线路']
  }
  obj['产业基地点'] = cloneDeep(list.find((one) => one.name === '农业经营主体').children.value)
  obj['产业基地规划面'] = []
  let selectValues = []
  let childList = list.find((one) => one.name === '生产力布局').children.list.filter((one) => one.name !== '总布局')
  childList.forEach((one) => {
    selectValues = selectValues.concat(one.children.value)
  })
  let replaceObj = {
    水产总布局: ['沿岸海洋渔业产业片区', '淡水渔业产业片区'],
    特色水产品养殖区域布局: ['海淡水虾类', '海水贝藻类', '海水蟹类', '生态鳖', '岱衢族大黄鱼'],
    特色品种区域布局: ['加工出口蔬菜（榨菜、花椰菜）', '加工出口蔬菜（雪菜）', '鲜食大豆（蚕豌豆）', '马铃薯', '山地特色蔬菜（芋艿）', '水生蔬菜（茭白）', '西甜瓜', '食用菌', '草莓'],
    小麦: ['小麦发展规划'],
    水稻: ['水稻发展规划']
  }
  Object.keys(replaceObj).forEach((key) => {
    let index = selectValues.indexOf(key)
    if (index > -1) {
      selectValues.splice(index, 1)
      selectValues = selectValues.concat(replaceObj[key])
    }
  })
  obj['产业基地规划面'] = selectValues
  return obj
}
const valueChange = (changeV, name) => {
  emitter.emit('themeLayerTypesChange', cloneDeep(themeLayerTypes.value))
  if (name === '总布局') {
    emits('overallPlanChange', changeV)
    return
  } else {
    // 总布局为false
    setOverallPlanValue(false)
  }
  // 清空精品已选的选项
  if (name !== '乡村旅游精品线路') {
    themeLayerTypes.value.find((one) => one.name === '乡村旅游精品线路').children.value = []
  }
  sendMessageInfo.value.obj = getValues()
  emits('valueChange', cloneDeep(sendMessageInfo.value), changeV)
}
const getSendMessageInfo = () => {
  sendMessageInfo.value.obj = getValues()
  return cloneDeep(sendMessageInfo.value)
}
const setOverallPlanValue = (v) => {
  themeLayerTypes.value.find((one) => one.name === '生产力布局').children.list.find((one) => one.name === '总布局').value = v
  emits('overallPlanChange', v)
}
defineExpose({
  getSendMessageInfo,
  activeModule: isJingPin
})
</script>
<style lang="scss" scoped>
.theme-layer {
  .item {
    margin-bottom: 23px;
    .content {
      .item-header.custom-header {
        background: transparent;
        :deep() {
          .name {
            font-size: 20px;
            font-family: MicrosoftYaHeiSemibold;
            color: #89b0cc;
          }
        }
      }
    }
  }
}
</style>
