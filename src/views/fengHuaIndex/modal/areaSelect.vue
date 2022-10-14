<template>
  <div class="area-select">
    <second-title title="区县地类占比" />
    <div class="area-module">
      <div class="city_wrap">
        {{ selectVal }}
      </div>
      <img
        :style="{ transform: 'rotate(' + ( selectStatus ? -180 : 0) + 'deg)',  }"
        :src="require('../image/arrow_icon.png')"
        alt=""
      />
      <el-select
        v-model="selectVal"
        @visible-change="onStatusChange"
        @change="onSelectChange"
      >
        <el-option
          v-for="item in areaOption"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import secondTitle from '@/components/secondTitle'

export default defineComponent({
  name: 'areaSelect',
  components: {
    secondTitle
  },
  props: {
    areaValue: {
      type: String,
      default: ''
    },
    areaOption: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  setup(props, { emit }) {
    const selectStatus = ref(false)
    const selectVal = ref('')
    const onStatusChange = (e) => {
      selectStatus.value = e
    }
    const onSelectChange = (e) => {
      emit('update:areaValue', e)
    }
    watch(() => props.areaValue, val => {
      if (selectVal.value !== val)
      selectVal.value = val
    }, { immediate: true })
    return {
      selectVal,
      selectStatus,
      onStatusChange,
      onSelectChange
    }
  }
})
</script>

<style scoped lang="scss">
.area-select {
  display: flex;
  justify-content: space-between;
}
  .area-module {
    position: relative;
    width: 407px;
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
    :deep(.el-select) {
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
