<template>
  <div>
    <div class="item" v-for="item in countrysideTypes" :key="item.name">
      <ModuleHeader :hideSwitch="item.hideSwitch" :isExpand="item.expand" :name="item.name" :color="item.color" :hideArrow="!item.children" />
    </div>
  </div>
</template>
<script setup>
import ModuleHeader from './Module/ModuleHeader'
import { ref } from 'vue'
const countrysideTypes = ref([
  {
    name: '低收入农户分布',
    value: false
  },
  {
    name: '低收入项目',
    value: false
  },
  {
    name: '低收入综合性保险',
    value: false
  }
])
</script>
