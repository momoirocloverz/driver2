<template>
  <img :class="$attrs.class" @click.stop="listShow = !listShow" src="https://img.hzanchu.com/acimg/542cd9e27b8efe4aa56b93f1beecfdd0.png" alt="" />
  <Teleport :to="teleportTo">
    <div class="list" v-if="listShow">
      <div class="item" v-for="item in list" :key="item.name" @click="linkTo(item)">
        {{ item.name }}
      </div>
    </div>
  </Teleport>
</template>
<script setup>
import { ref, onMounted, onBeforeMount } from 'vue'
const list = [
  { name: '工作台', url: 'http://ningbo-standard-admini.zjsszxc.com:20002' },
  { name: '数据分析平台', url: 'https://science.datacreating.com/cs-manage-demo/#/laboratoryManagement' },
  { name: '乡村资源监测平台', url: 'https://test-ningbo-rsp-admini.hzanchu.com/surveillance/artificial/satellite' },
  { name: '孪生平台', url: 'https://test-ningbo-twin-admini.hzanchu.com' },
  { name: '五库清单', url: 'https://ph.anchu.cn/shareScreen/eyJzY3JlZW5JZCI6NTA2N30=' },
  { name: '数据仓', url: 'http://dev-ningbo-data-admini.hzanchu.com/' }
]
const listShow = ref(false)
const teleportTo = ref('#app')
onMounted(() => {
  teleportTo.value = '.container'
  window.addEventListener('click', listClose, true)
})
onBeforeMount(() => {
  window.removeEventListener('click', listClose, true)
})
const linkTo = (item) => {
  listClose()
  window.open(item.url, '_blank')
}
const listClose = () => {
  listShow.value = false
}
</script>
<style lang="scss" scoped>
.list {
  position: absolute;
  top: 44px;
  left: 25px;
  z-index: 2000;
  background: #032b67;
  padding: 0 10px;
  border: 1px solid #23cbec;
  .item {
    text-align: center;
    line-height: 50px;
    cursor: pointer;
    border-bottom: 1px dashed #999;
    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
