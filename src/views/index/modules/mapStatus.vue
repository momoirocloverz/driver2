<template>
  <div class="map-status">
    <div
      class="item"
      v-for="item in mapList"
      :key="item.name"
      :class="{ active: active === item.name }"
      :style="{ backgroundImage: 'url(' + item.bg + ')' }"
      @click="onMapChange(item)"
    >
      <div class="name">{{ item.name }}</div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'mapStatus',
  setup(props, { emit }) {
    const active = ref('影像')
    const mapList = ref([
      {
        name: '地图',
        bg: require('./../image/map_icon_1.png'),
        id: 'vec'
      },
      {
        name: '影像',
        bg: require('./../image/map_icon_2.png'),
        id: 'img'
      },
      {
        name: '地形',
        bg: require('./../image/map_icon_3.png'),
        id: 'ter'
      }
    ])
    const onMapChange = (item) => {
      active.value = item.name
      emit('sendMessage', {
        key: 'changeTDTLayerByType',
        value: { type: item.id }
      })
    }
    return {
      mapList,
      onMapChange,
      active
    }
  }
})
</script>

<style scoped lang="scss">
  .map-status {
    display: flex;
    justify-content: space-between;
    width: 347px;
    height: 84px;
    box-sizing: border-box;
    padding: 12px;
    background: url("../image/map_icon_bg.png") no-repeat;
    background-size: 100% 100%;
    .item {
      position: relative;
      width: 100px;
      height: 59px;
      background-size: 100% 100%;
      box-sizing: border-box;
      cursor: pointer;
      border: 2px solid transparent;
      .name {
        position: absolute;
        left: -2px;
        bottom: -2px;
        font-size: 14px;
        text-align: center;
        width: 40px;
        height: 22px;
        line-height: 22px;
        background: rgba(0, 0, 0, .6);
        border-radius: 0 4px 0 0;
      }
    }
    .active {
      border: 2px solid #007CD6;
    }
  }
</style>
