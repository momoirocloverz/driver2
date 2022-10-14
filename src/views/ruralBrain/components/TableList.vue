<template>
  <div :class="{ 'table-list': true, ['table-list_' + size]: true }">
    <div class="table-header">
      <div
        class="header-th"
        :style="{
          width: column.width,
          minWidth: column.width,
          maxWidth: column.width
        }"
        v-for="(column, columnIndex) in props.columns"
        :key="column.label + columnIndex"
      >
        <div class="cell cell_header">{{ column.label }}</div>
      </div>
    </div>
    <ScrollList class="table-body" :list="props.list">
      <div class="row" v-for="(row, index) in props.list" :key="index">
        <div
          class="body-td"
          :style="{
            width: column.width,
            minWidth: column.width,
            maxWidth: column.width
          }"
          v-for="(column, columnIndex) in props.columns"
          :key="column.label + columnIndex"
        >
          <div class="cell" :title="row[column.prop]">
            <slot :name="column.prop" :row="row" :column="column" :index="index">
              {{ row[column.prop] }}
            </slot>
          </div>
        </div>
      </div>
    </ScrollList>
  </div>
</template>
<script setup>
import ScrollList from './ScrollList'
import { defineProps } from 'vue'
const props = defineProps({
  columns: {
    default: () => [], // label prop width
    type: Array
  },
  list: {
    default: () => [],
    type: Array
  },
  size: {
    default: 'normal', // normal small
    type: String
  }
})
</script>
<style lang="scss" scoped>
.table-list {
  display: flex;
  flex-direction: column;
  :deep() {
    .table-body.scroll-list_odd {
      > div {
        > div:nth-child(2) {
          .row {
            &:nth-child(odd) {
              background: transparent;
            }
            &:nth-child(even) {
              background: rgba(95, 175, 255, 0.1);
            }
          }
        }
      }
    }
  }

  .table-header {
    display: flex;
    // background: linear-gradient(180deg, rgba(0, 202, 255, 0.38) 0%, rgba(0, 154, 255, 0.07) 100%);
    .header-th {
      display: inline-block;
      text-align: center;
      flex: 1;
      overflow: hidden;
    }
  }
  .table-body {
    flex: 1;
    .row {
      display: flex;
      position: relative;
      .body-td {
        display: inline-block;
        text-align: center;
        flex: 1;
        overflow: hidden;
      }
      &:nth-child(odd) {
        background: rgba(95, 175, 255, 0.1);
      }
    }
  }
  .cell {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
    font-family: MicrosoftYaHei;
    color: #fff;
    &.cell_header {
      white-space: normal;
    }
  }
  &.table-list_normal {
    .cell {
      padding: 0 8px;
      font-size: 16px;
      height: 42px;
      line-height: 42px;
    }
  }
  &.table-list_small {
    .cell {
      font-size: 14px;
      padding: 0 4px;
      height: 42px;
      line-height: 42px;
    }
  }
}
</style>
