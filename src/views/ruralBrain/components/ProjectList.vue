<template>
  <TableList :size="$attrs.size" :columns="tabelColumns" :list="props.list">
    <template #资金执行率="{ row }">
      <div v-if="$attrs.size === 'small'">{{ row['资金执行率'] }}</div>
      <div v-else>
        <progressBar style="width: 70%; display: inline-block; margin-right: 4px" :percent="parseFloat(row['资金执行率'])" />
        <span style="font-size: 12px">{{ row['资金执行率'] }}</span>
      </div>
    </template>
  </TableList>
</template>
<script setup>
import TableList from './TableList'
import progressBar from '@/components/progressBar'
import { computed, defineProps, useAttrs } from 'vue'
import { cloneDeep } from 'lodash'
const $attrs = useAttrs()
const props = defineProps({
  columns: {
    default: () => [],
    type: Array
  },
  list: {
    default: () => [],
    type: Array
  }
})
const tabelColumns = computed(() => {
  return cloneDeep(props.columns).map((one) => {
    one.width = one['width-' + $attrs.size] || one.width
    return one
  })
})
</script>
