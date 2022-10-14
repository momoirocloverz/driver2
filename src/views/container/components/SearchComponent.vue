<template>
  <img :class="$attrs.class" src="https://img.hzanchu.com/acimg/cddc159874d55ee3869eead913fcef79.png" alt="" @click="showBrainAction" />
  <Teleport :to="teleportTo">
    <brainSearchEngine v-show="showBrain" @shutCurrent="popBrain" />
  </Teleport>
</template>
<script setup>
import brainSearchEngine from '@/components/brainSearchEngine'
import { ref, onMounted } from 'vue'
const showBrain = ref(false)
const teleportTo = ref('#app')
onMounted(() => {
  teleportTo.value = '.container'
})
// 查询-start
const showBrainAction = () => {
  showBrain.value = true
}
const popBrain = () => {
  showBrain.value = false
}
// 查询-end
</script>
