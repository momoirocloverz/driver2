<template>
  <iframe id="gisIframe" :key="src" :src="src" frameborder="0" width="100%" height="100%" />
</template>
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const Route = useRoute()
const src = computed(() => {
  return Route.meta.url
})
</script>
