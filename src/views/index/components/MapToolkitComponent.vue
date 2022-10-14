<template>
  <MapToolkit class="home__map-toolkit" @sendMessage="sendMessage" ref="mapToolkitRef" />
  <div class="home__map-toolkit-coordinates" v-if="mapToolkitRef?.useCoordinateTracker">经纬度：121.629265, 29.810974</div>
</template>
<script setup>
import MapToolkit from './MapToolkit.vue'
import { ref, defineEmits } from 'vue'
const emits = defineEmits(['sendMessage'])
const mapToolkitRef = ref(null)
const sendMessage = (e) => {
  emits('sendMessage', e)
}
</script>
