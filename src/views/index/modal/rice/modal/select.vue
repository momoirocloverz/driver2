<template>
  <div class="_select">
    <div
      v-for="(item, index) in selectList"
      :key="index"
      :class="item.select ? '_select-select' : '_select-unselect'"
      :style="
        selectList.length == 4
          ? '  width: 99px;'
          : selectList.length == 3
            ? 'width: 134px;'
            : ''
      "
      @click="changeSelect(index)"
    >
      {{ item.text }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => [1]
    }
  },
  data() {
    return {
      curPos: 0,
      selectList: []
    }
  },
  created: function() {
    this.selectList = JSON.parse(JSON.stringify(this.list))
  },

  methods: {
    changeSelect: function(pos) {
      if (this.curPos == pos) {
        return
      }
      this.selectList[this.curPos].select = false
      this.selectList[pos].select = true
      setTimeout(() => {
        this.curPos = pos
        this.$emit('reload', this.list[pos])
      }, 0)
    }
  }
}
</script>

<style scoped lang="scss">
._select {
  margin-top: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  ._select-select {
    height: 38px;
    line-height: 36px;
    margin-left: 8px;
    background-color: #0053b4;
    border: 1px solid #1db9ff;
    text-align: center;
    font-size: 16px;
    color: #ffffff;
    cursor: pointer;
  }
  ._select-unselect {
    height: 38px;
    line-height: 36px;
    margin-left: 8px;
    background-color: #16326e;
    border: 1px solid #29478d;
    text-align: center;
    font-size: 16px;
    color: #6c9fe6;
    cursor: pointer;
  }
}
</style>
