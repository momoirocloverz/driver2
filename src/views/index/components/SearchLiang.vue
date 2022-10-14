<template>
  <!-- 粮功区搜索 -->
  <img :class="['search-btn', $attrs.class]" @click="searcnPopupVisible = true" :src="require('../image/search-icon.png')" alt="" />
  <customDialog v-model:visible="searcnPopupVisible" :width="840" top="5vh" title="粮功区搜索">
    <SearchPopup @setSelectVal="setSelectVal" />
  </customDialog>
</template>
<script setup>
import SearchPopup from '@/components/SearchPopup'
import customDialog from '@/components/customDialog'
import { ref, defineEmits, defineProps } from 'vue'
const emits = defineEmits(['linkToArea'])
const props = defineProps({
  initAreaName: {
    default: '',
    type: String
  }
})
const searcnPopupVisible = ref(false)
const setSelectVal = (val) => {
  searcnPopupVisible.value = false //关闭弹窗
  const selectValValue = props.initAreaName ? val.COUNTY + '/' + val.TOWN + '/' + val.GHMC : '宁波市/' + val.COUNTY + '/' + val.TOWN + '/' + val.GHMC
  const selectCodeValue = props.initAreaName ? [val.COUNTY, val.TOWN, val.GHMC] : ['宁波市', val.COUNTY, val.TOWN, val.GHMC]
  const sendMessageInfo = {
    key: 'changeAreaByName',
    value: { name: val.GHMC }
  }
  emits('linkToArea', { selectValValue, selectCodeValue, sendMessageInfo })
}
</script>
