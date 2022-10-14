<template>
  <div class="area-select">
    <div class="city_wrap">
      {{ selectVal }}
    </div>
    <img
      :style="{ transform: 'rotate(' + ( selectStatus ? -180 : 0) + 'deg)',  }"
      :src="require('../image/arrow_icon.png')"
      alt=""
    />

    <el-cascader
      v-model="selectCode"
      :options="areaOptions"
      :props="props"
      @change="onAreaConfirm"
      @visible-change="onStatusChange"
    />
  </div>
</template>

<script>
import { defineComponent, nextTick, onMounted, ref } from 'vue'
import areaList from '@/assets/js/areaList.json'
import lodash from 'lodash'

export default defineComponent({
  name: 'areaSelect',
  props: {
    selectVal: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const selectStatus = ref(false)
    const selectCode = ref([])
    const areaOptions = ref([])
    const onAreaConfirm = (e) => {

      const countyArr = []
      // areaOptions.value.map(city => {
      //   city.isSelect = false
      //   if (!city.children?.length) return
      //   city.children.map(county => {
      //     county.isSelect = false
      //   })
      // })

      e.map(item => {
        if (item.length === 3) return
        const currentNode = item[item.length - 1]
        countyArr.push(currentNode)
        areaOptions.value.map(city => {
          if (city.name === currentNode) {
            city.isSelect = true
          } else if (city.children?.length) {
            city.children.map(county => {
              if (county.name === currentNode) county.isSelect = true
            })
          }
        })
      })

      nextTick(() => {
        if (areaOptions.value[0].isSelect = true) areaOptions.value[0].isSelect = undefined
        areaOptions.value[0]?.children.map(county => {
          if (!countyArr.includes(county.name) && county.isSelect === true) {
            county.isSelect = false
          }
        })
      })
    }
    const formarArea = (array) => {
      array.map(item => {
        if (item.children && item.children.length) {
          if (item.children[0].name !== item.name) {
            item.children.unshift({ name: item.name, code: item.code })
          }
          formarArea(item.children)
        }
      })
    }
    const onStatusChange = (e) => {
      selectStatus.value = e
    }
    onMounted(() => {
      areaOptions.value = lodash.cloneDeep([areaList.city])
      // formarArea(areaOptions.value)
    })
    return {
      areaList,
      areaOptions,
      onAreaConfirm,
      selectCode,
      onStatusChange,
      selectStatus,
      props: {
        label: 'name',
        value: 'name',
        multiple: true,
        checkStrictly: true,
        emitPath: true,
        leaf: 'isSelect'
      }
    }
  }
})
</script>

<style scoped lang="scss">
  .area-select {
    position: relative;
    width: 274px;
    height: 40px;
    .city_wrap {
      height: 40px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 42px;
      background: url("../image/area_select_bg.png") no-repeat;
      background-size: 100% 100%;
      font-size: 18px;
      text-indent: 20px;
      box-sizing: border-box;
      padding-right: 60px;
    }
    img {
      position: absolute;
      right: 20px;
      top: 14px;
      transition: all .3s;
      width: 24px;
      height: 12px;
    }
    :deep(.el-cascader) {
      opacity: 0;
      position: absolute;
      width: 100%;
      height: 40px;
      top: 0;
      left: 0;
      .el-input {
        height: 100%;
        .el-input__inner {
          height: 100%;
        }
      }
    }
  }
</style>
