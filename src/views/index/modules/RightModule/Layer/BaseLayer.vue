<template>
  <div>
    <!-- 资源tab -->
    <ResourceLayer v-if="allData.activeModule === '资源'" :flhArea="flhArea" :cleanList="cleanList" :areaListFarm="areaListFarm" :selectList="selectList" :areaList="areaList" />
    <!-- 资源tab -->
    <VillageLayer v-if="allData.activeModule === '农村'" :allData="allData" />
  </div>
</template>
<script setup>
import ResourceLayer from './LayerTabs/ResourceLayer.vue'
import VillageLayer from './LayerTabs/VillageLayer.vue'
import cleanData from '@/assets/js/cleanData.json'
import compensateData from '@/assets/js/compensateData.json'
import qyfbData from '@/assets/js/qyfbData.json'
import flhData from '@/assets/js/flhData.json'
import areaTown from '@/assets/js/areaTown.json'
import ribbon from '@/assets/js/ribbon.json'
import { ref, reactive, inject, watch, defineProps } from 'vue'
const regionNames = inject('regionNamePath') // 地区切换
let props = defineProps({
  allData: {
    default: {},
    type: Object
  }
})
const { allData } = props
const { initAreaName } = allData
// 监听地图交互事件
const areaList = ref([
  { name: '农业用地', value: 0 },
  { name: '农村道路', value: 0 },
  { name: '河流水面', value: 0 },
  { name: '公路用地', value: 0 },
  { name: '农村宅基地', value: 0 },
  { name: '工业用地', value: 0 },
  { name: '其他(非农业用地)', value: 0 }
])
const areaListFarm = ref([
  { name: '耕地', value: 0 },
  { name: '园地', value: 0 },
  { name: '林地', value: 0 },
  { name: '其他(农业用地)', value: 0 }
])
const countyArea = ['海曙区', '江北区', '北仑区', '镇海区', '鄞州区', '奉化区', '象山县', '宁海县', '余姚市', '慈溪市']
const cleanList = reactive({
  cleanVal: 0,
  compensateVal: 0,
  isShow: false
})
const selectList = ref([])
// 区域分布
const cityArea = reactive({
  name: [],
  lgq: [],
  gbznt: []
})
const flhArea = ref({}) // 非粮化数据
// 根据地区变动获取粮功区面积
const onReset = () => {
  areaList.value.map((item) => {
    item.value = 0
  })
  areaListFarm.value.map((item) => {
    item.value = 0
  })
  cleanList.cleanVal = 0
  cleanList.compensateVal = 0
  cleanList.isShow = true
}
const getAreaInfo = (val) => {
  onReset()
  const areaArr = val.split('/')
  if (val === '宁波市' || val === '宁波市/宁波市') {
    // 选择市本级
    cleanData.map((item) => {
      cleanList.cleanVal += +item.area
    })
    compensateData.map((item) => {
      cleanList.compensateVal += +item.area
    })

    areaTown.map((item) => {
      areaList.value.map((key) => {
        if (item.DKLX === key.name) {
          key.value += +item.AREA
        }
      })
      areaListFarm.value.map((key) => {
        if (item.DKLX === key.name) {
          key.value += +item.AREA
        }
      })
    })
  } else if (countyArea.includes(areaArr[areaArr.length - 1])) {
    // 选择到区
    cleanData.map((item) => {
      if (item.county === areaArr[areaArr.length - 1]) cleanList.cleanVal += +item.area
    })
    compensateData.map((item) => {
      if (item.county === areaArr[areaArr.length - 1]) cleanList.compensateVal += +item.area
    })
    areaTown.map((item) => {
      areaList.value.map((key) => {
        if (item.COUNTY === areaArr[areaArr.length - 1] && item.DKLX === key.name) {
          key.value += +item.AREA
        }
      })
      areaListFarm.value.map((key) => {
        if (item.COUNTY === areaArr[areaArr.length - 1] && item.DKLX === key.name) {
          key.value += +item.AREA
        }
      })
    })
  } else if (areaArr.length === (initAreaName ? 3 : 4)) {
    // 选择到 粮食功能区
    cleanList.isShow = false // 粮食功能区不展示 清理腾退数据
    if (areaArr[initAreaName ? 1 : 2] === areaArr[initAreaName ? 2 : 3]) {
      areaTown.map((item) => {
        areaList.value.map((key) => {
          if (item.TOWN === areaArr[areaArr.length - 1] && item.DKLX === key.name) {
            key.value += +item.AREA
          }
        })
        areaListFarm.value.map((key) => {
          if (item.TOWN === areaArr[areaArr.length - 1] && item.DKLX === key.name) {
            key.value += +item.AREA
          }
        })
      })
    } else {
      ribbon.map((item) => {
        areaList.value.map((key) => {
          if (item.GHMC === areaArr[areaArr.length - 1] && item.DKLX === key.name) {
            key.value += +item.AREA
          }
        })
        areaListFarm.value.map((key) => {
          if (item.GHMC === areaArr[areaArr.length - 1] && item.DKLX === key.name) {
            key.value += +item.AREA
          }
        })
      })
    }
  } else {
    // 选择到镇
    areaTown.map((item) => {
      cleanData.map((item) => {
        if (item.town === areaArr[areaArr.length - 1]) cleanList.cleanVal = +item.area
      })
      compensateData.map((item) => {
        if (item.town === areaArr[areaArr.length - 1]) cleanList.compensateVal = +item.area
      })
      areaList.value.map((key) => {
        if (item.TOWN === areaArr[areaArr.length - 1] && item.DKLX === key.name) {
          key.value = +item.AREA
        }
      })
      areaListFarm.value.map((key) => {
        if (item.TOWN === areaArr[areaArr.length - 1] && item.DKLX === key.name) {
          key.value = +item.AREA
        }
      })
    })
  }
}
const getCityArea = (val) => {
  cityArea.name = []
  cityArea.lgq = []
  cityArea.gbznt = []
  const areaArr = val.split('/')
  if (val === '宁波市' || val === '宁波市/宁波市') {
    // 市级
    qyfbData.map((item) => {
      if (item.city === '宁波市') {
        cityArea.name.push(item.name)
        cityArea.lgq.push((+item.lgqmj)?.toFixed(1))
        cityArea.gbznt.push((+item.gbzntmj)?.toFixed(1))
      }
    })
  } else if (areaArr.length === (initAreaName ? 1 : 2)) {
    qyfbData.map((item) => {
      if (item.city === (initAreaName ? areaArr[0] : areaArr[1])) {
        cityArea.name.push(item.name)
        cityArea.lgq.push((+item.lgqmj).toFixed(1))
      }
    })
  } else if (areaArr.length === (initAreaName ? 2 : 3) || areaArr.length === (initAreaName ? 3 : 4)) {
    qyfbData.map((item) => {
      if (item.city === (initAreaName ? areaArr[1] : areaArr[2])) {
        cityArea.name.push(item.name)
        cityArea.lgq.push((+item.lgqmj).toFixed(1))
      }
    })
  }
}
const getFLHData = (val) => {
  const areaArr = val.split('/')
  if (areaArr.length === (initAreaName ? 3 : 4)) {
    areaArr.pop()
  }
  flhArea.value = {}
  flhData.map((item) => {
    if (item.name === areaArr[areaArr.length - 1]) {
      flhArea.value = item
    }
  })
}
watch(
  () => allData,
  () => {
    console.log(allData, 'allData')
  },
  { immediate: true }
)
// 获取统计信息
watch(
  () => regionNames,
  (val) => {
    console.log(val, 'val')
    getAreaInfo(val._value)
    getCityArea(val._value)
    getFLHData(val._value)
  },
  { immediate: true }
)
</script>
<style lang="scss" scoped></style>
