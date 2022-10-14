<template>
  <div :class="{ 'warn-control': true, ['warn-control_' + props.position]: true }">
    <div class="types-wrap">
      <div :class="{ type: true, type_active: one.value === activeType }" v-for="one in types" :key="one.value" @click="typeChange(one)">
        <img :src="one.img" />
        <span class="value">{{ warnControlData[one.value].length + '条' }}</span>
      </div>
    </div>

    <TableList :size="$attrs.size" :columns="columns" :list="list" class="table-list" :key="activeType">
      <template #operate="{ row }">
        <span :class="{ 'btn-text': true, 'btn-text-small': $attrs.size === 'small', 'btn-text-disabled': !row.id }" @click="linkToPosition(row)">查看位置</span>
      </template>
    </TableList>
  </div>
</template>
<script setup>
import { ref, defineProps, computed, useAttrs } from 'vue'
import TableList from './TableList'
import { warnControlData, warnControlColumns } from '../modal/const'
import { cloneDeep } from 'lodash-es'
import router from '@/router'
const $attrs = useAttrs()
const props = defineProps({
  position: {
    default: 'horizontal', // 横向horizontal 纵向 vertical
    type: String
  }
})
// 码类型
const activeType = ref('yellow')
const types = [
  {
    img: require('../images/ma-yellow.png'),
    value: 'yellow'
  },
  {
    img: require('../images/ma-green.png'),
    value: 'green'
  },

  {
    img: require('../images/ma-red.png'),
    value: 'red'
  }
]
const typeChange = (one) => {
  activeType.value = one.value
}
// 列表数据
const columns = computed(() => {
  let list = cloneDeep(warnControlColumns).map((one) => {
    one.width = one['width-' + $attrs.size] || one.width
    return one
  })
  if (activeType.value === 'green') {
    list = list.filter((one) => one.label !== '操作')
  }
  return list
})
const list = computed(() => {
  return warnControlData[activeType.value]
})
//查看位置
const linkToPosition = (row) => {
  if (!row.id) {
    return
  }
  router.push({
    path: '/wilsonWasBorn',
    query: {
      id: row.id,
      type: row.type
    }
  })
  //  row.id row.type
}
</script>
<style lang="scss" scoped>
.warn-control {
  .types-wrap {
    .type {
      cursor: pointer;
      width: 120px;
      min-width: 120px;
      height: 60px;
      background: url('../images/maBac.png') no-repeat;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      padding-left: 16px;
      box-sizing: border-box;
      &.type_active {
        background: url('../images/maBac_active.png') no-repeat;
      }
      img {
        width: 36px;
        height: 36px;
      }
      .value {
        margin-left: 12px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
      }
    }
  }
  .btn-text {
    font-size: 16px;
    font-family: MicrosoftYaHei;
    color: #15dbff;
    margin-right: 4px;
    cursor: pointer;
    &:last-child {
      margin-right: 0;
    }
    &.btn-text-small {
      font-size: 14px;
    }
    &.btn-text-disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
  &.warn-control_horizontal {
    display: flex;
    .types-wrap {
      margin-right: 16px;
      .type {
        margin-bottom: 10px;
      }
    }
    .table-list {
      flex: 1;
      overflow: hidden;
    }
  }
  &.warn-control_vertical {
    display: flex;
    flex-direction: column;
    .types-wrap {
      display: flex;
      justify-content: center;
      margin-left: 25px;
      margin-bottom: 10px;
      .type {
        margin-right: 30px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .table-list {
      flex: 1;
      overflow: hidden;
    }
  }
}
</style>
