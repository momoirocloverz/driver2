<template>
  <div>
    <VillageDetails
      v-if="
        !allData.changeLayerByOptionMessageObj['集体三资'] &&
        !allData.changeLayerByOptionMessageObj['乡村物流'] &&
        !allData.changeLayerByOptionMessageObj['农资分布'] &&
        !allData.changeLayerByOptionMessageObj['乡村振兴学院']
      "
      :content="allData.content"
    />
    <CollectiveCapital v-if="allData.changeLayerByOptionMessageObj['集体三资']" />
  </div>
</template>
<script setup>
import VillageDetails from '../../../../components/VillageDetails.vue'
import CollectiveCapital from '../../../../components/CollectiveCapital.vue'
import { ref, defineProps } from 'vue'
let props = defineProps({
  allData: {
    default: {},
    type: Object
  }
})
</script>
<style lang="scss" scoped></style>
