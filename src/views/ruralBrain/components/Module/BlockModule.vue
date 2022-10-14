<template>
  <div class="block-module">
    <BlockModuleTitle :titleText="$attrs.titleText" :style="{ 'margin-bottom': $attrs.headMarginBottom || 0 }" />
    <slot></slot>
  </div>
</template>
<script setup>
import BlockModuleTitle from './BlockModuleTitle'
</script>
<style lang="scss" scoped></style>
