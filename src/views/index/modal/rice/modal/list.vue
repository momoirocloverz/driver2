<template>
  <div class="_list">
    <div
      v-if="list.length > 0 && isLoad"
      class="_item-main"
      :style="
        '--scroll: ' +
          (total - 8 > 0 ? total - 8 : 0) +
          ';--time: ' +
          (total - 8 > 0 ? total - 8 : 0)
      "
    >
      <div
        v-for="(item, index) in list"
        :key="index"
        :class="index == 0 ? '_item _item-select ' : '_item '"
      >
        <div class="rank">NO.{{ index + 1 }} {{ item.text }}</div>
        <div class="center">
          <div class="bg" />
          <div
            class="current"
            :style="'width: calc(' + item.value / max + '* 100%)'"
          />
        </div>
        <div class="detail">
          <div>{{ item.value }}斤/亩</div>
          <!-- <div>{{ item.area }}亩</div> -->
        </div>
      </div>
    </div>

    <list-empty v-else />
  </div>
</template>

<script>
import ListEmpty from '@/components/listEmpty.vue'
export default {
  components: {
    ListEmpty
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      list: [],
      total: 1,
      isLoad: false,
      max: 1
    }
  },
  methods: {
    // 重新加载数据
    reload: function(area, type) {
      this.isLoad = false
      const list = JSON.parse(JSON.stringify(this.data))
      this.list = list
      this.max = 0

      for (let index = 0; index < list.length; index++) {
        for (let index1 = index; index1 < list.length; index1++) {
          if (parseFloat(list[index].value) < parseFloat(list[index1].value)) {
            const temp = list[index]
            list[index] = list[index1]
            list[index1] = temp
          }
        }
      }

      for (const item of list) {
        if (parseFloat(item.value) > this.max) {
          this.max = parseFloat(item.value)
        }
      }
      this.total = list.length
      this.isLoad = true
    }
  }
}
</script>

<style scoped lang="scss">
._list {
  width: 100%;
  margin-top: 16px;

  .w-30 {
    width: 30%;
  }

  ._item-main {
    width: 100%;
    height: 270px;
    margin-top: 30px;
    // padding: 0 37px;
    box-sizing: border-box;
    overflow: hidden;

    ._item {
      width: 100%;
      height: 36px;
      margin-bottom: 2px;
      display: flex;
      flex-direction: row;
      align-items: center;
      cursor: pointer;
      font-size: 14px;
      color: #fff;
      animation: move calc(var(--time) * 4s) linear infinite normal;
      animation-fill-mode: forwards;

      .rank {
        width: 30%;
        height: 36px;
        line-height: 36px;
        font-size: 16px;
        color: #fff;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .center {
        position: relative;
        width: 0;
        flex: 1;
        height: 10px;
        margin-left: 12px;
        margin-right: 12px;
        border-radius: 20px;
        overflow: hidden;
        .bg {
          position: absolute;
          z-index: 1;
          top: 0;
          left: 0;
          width: 100%;
          height: 10px;
          background-color: #264580;
        }
        .current {
          position: absolute;
          z-index: 2;
          top: 0;
          left: 0;
          height: 10px;
          border-radius: 20px;
          background: linear-gradient(90deg, #006dff 0%, #34e8ff 100%);
        }
      }

      .detail {
        width: 25%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        div:nth-of-type(1) {
          margin-right: 10px;
        }
      }
    }

    @keyframes move {
      0% {
        transform: translateY(0px);
      }
      100% {
        transform: translateY(calc(var(--scroll) * -36px));
      }
    }

    ._item-select {
      background-color: rgba(95, 175, 249, 0.16);
    }

    ._item:hover {
      background-color: rgba(95, 175, 249, 0.16);
      //   animation-play-state: paused;
      //   -webkit-animation-play-state: paused;
    }
  }
}
</style>
