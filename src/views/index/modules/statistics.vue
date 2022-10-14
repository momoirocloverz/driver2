<template>
  <div class="statistics">
    <div style="display: flex">
      <div class="item" style="margin-right: 20px">
        <!-- <div class="icon_box">
          <img class="icon-wrap" :src="require('../image/statistics_cycle.png')" alt="" />
          <img class="icon" :src="require('../image/statistics_icon_3.png')" alt="" />
        </div> -->
        <div class="info">
          <div>耕地</div>
          <div>
            <!-- <p>{{ isThousandTotal ? (220.90 / 10000).toFixed(2) : total }}</p> -->
            <p>{{ 220.9 }}</p>
            万亩
          </div>
        </div>
      </div>
      <div class="item">
        <!-- <div class="icon_box">
          <img class="icon-wrap" :src="require('../image/statistics_cycle.png')" alt="" />
          <img class="icon" :src="require('../image/statistics_icon_3.png')" alt="" />
        </div> -->
        <div class="info">
          <div>永农</div>
          <div>
            <p>{{ 195.49 }}</p>
            万亩
          </div>
        </div>
      </div>
    </div>
    <div style="display: flex">
      <div class="item" style="margin-right: 20px">
        <!-- <div class="icon_box">
          <img class="icon-wrap" :src="require('../image/statistics_cycle.png')" alt="" />
          <img class="icon" :src="require('../image/statistics_icon_3.png')" alt="" />
        </div> -->
        <div class="info">
          <div>高标农</div>
          <div>
            <!-- <p>{{ isThousandTotal ? (220.90 / 10000).toFixed(2) : total }}</p> -->
            <p>{{ 221.28 }}</p>
            万亩
          </div>
        </div>
      </div>
      <div class="item">
        <!-- <div class="icon_box">
          <img class="icon-wrap" :src="require('../image/statistics_cycle.png')" alt="" />
          <img class="icon" :src="require('../image/statistics_icon_3.png')" alt="" />
        </div> -->
        <div class="info">
          <div>粮功区面积</div>
          <div>
            <p>{{ (total / 10000).toFixed(2) }}</p>
            {{ '万亩' }}
          </div>
        </div>
      </div>
    </div>
    <!--    选中的农田-->
    <div class="bar-list" v-if="selectList && selectList.length > 0">
      <div class="bar-item" v-for="(val, i) in selectList" :key="i" :style="`display:${selectList.includes(val) ? 'block' : 'none'}`">
        <div class="info">
          <div>
            <span>{{ val ?? '-' }}</span>
          </div>
          <div>
            <p>{{ Math.round(state.listObj[val] * 100) / 100 }}</p>
            万亩
          </div>
        </div>

        <div class="progress-bg">
          <div class="progress" :style="{ width: (Number(state.listObj[val]) / state.total) * 100 + '%' }"></div>
          <img :style="{ left: (Number(state.listObj[val]) / state.total) * 100 + '%' }" :src="require('./../image/progress-point.png')" alt="" />
        </div>
      </div>
    </div>
    <div class="bar-item">
      <div class="info">
        <div>农业用地面积</div>
        <div>
          <p>{{ isThousandTotal ? (farming / 10000).toFixed(2) : farming }}</p>
          {{ isThousandTotal ? '万亩' : '亩' }}
        </div>
      </div>
      <div class="progress-bg">
        <div class="progress" :style="{ width: (farming / total) * 100 + '%' }"></div>
        <img :style="{ left: (farming / total) * 100 + '%' }" :src="require('./../image/progress-point.png')" alt="" />
      </div>
    </div>
    <div class="bar-item">
      <div class="info">
        <div>非农业用地面积</div>
        <div>
          <p>{{ isThousandTotal ? (unfarming / 10000).toFixed(2) : unfarming }}</p>
          {{ isThousandTotal ? '万亩' : '亩' }}
        </div>
      </div>
      <div class="progress-bg">
        <div class="progress" :style="{ width: (unfarming / total) * 100 + '%' }"></div>
        <img :style="{ left: (unfarming / total) * 100 + '%' }" :src="require('./../image/progress-point.png')" alt="" />
      </div>
    </div>
    <!--    <div class="item">
          <div class="icon_box">
            <img class="icon-wrap" :src="require('../image/statistics_cycle.png')" alt="" />
            <img class="icon" :src="require('../image/statistics_icon_1.png')" alt="" />
          </div>
          <div class="info">
            <div>
             <p>{{ isThousandTotal ? (farming / 10000).toFixed(2) : farming }}</p>
              {{ isThousandTotal ? "万亩" : "亩" }}
            </div>
            <div>农业用地面积</div>
          </div>
        </div>-->
    <!--    <div class="item">
          <div class="icon_box">
            <img class="icon-wrap" :src="require('../image/statistics_cycle.png')" alt="" />
            <img class="icon" :src="require('../image/statistics_icon_2.png')" alt="" />
          </div>
          <div class="info">
            <div>
              <p>{{ isThousandTotal ? (unfarming / 10000).toFixed(2) : unfarming }}</p>
              {{ isThousandTotal ? "万亩" : "亩" }}
            </div>
            <div>非农业用地面积</div>
          </div>
        </div>-->
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref, watch } from 'vue'

export default defineComponent({
  props: {
    areaList: {
      type: Array,
      default: () => {
        return []
      }
    },
    areaListFarm: {
      type: Array,
      default: () => {
        return []
      }
    },
    selectList: {
      type: Array,
      default: () => {
        return []
      }
    },
    selectVal: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  setup(props) {
    const farming = ref(0)
    const unfarming = ref(0)
    const total = ref(0)
    const isThousandTotal = ref(true) //当前选择区域是否是市（第一级）并且是宁波市
    // 写死的数据
    const state = reactive({
      total: 0,
      listObj: {
        永农内高标农: '131.168',
        永农外高标农: '90.004',
        耕地内永农: '192.862',
        耕地内高标农: '137.091',
        耕地外永农: '2.541',
        耕地外高标农: '84.081',
        '同时在耕地、永农内高标农': '129.276',
        粮功区外高标农: '10.882',
        高标农内粮功区: '71.207'
      }
    })
    onMounted(() => {
      // 求 总数
      let num = 0
      for (let i in state.listObj) {
        num += Number(state.listObj[i])
      }
      state.total = Math.round(num * 100) / 100
    })

    watch(
      () => props.selectVal,
      (val) => {
        //监听选择地域变化
        console.log('地区====》', val)
        const selectValArr = val.split('/')
        //当前选择地区是市（第一级）并且是宁波市
        isThousandTotal.value = Array.isArray(selectValArr) && selectValArr.length == 1 && selectValArr[0] == '宁波市' //直接拿地域中文名判断后期可能出现变动后面试着更改一下
      }
    )

    watch(
      () => props.areaListFarm,
      (val) => {
        if (val.length) {
          farming.value = 0
          val.map((item) => {
            farming.value += +item.value
          })
          farming.value = Math.round(farming.value * 0.0015 * 100) / 100
          total.value = Math.round((Number(farming.value) + Number(unfarming.value)) * 100) / 100
        }
      },
      { immediate: true, deep: true }
    )
    watch(
      () => props.areaList,
      (val) => {
        if (val.length) {
          unfarming.value = 0
          val.map((item) => {
            if (item.name !== '农业用地') {
              unfarming.value += +item.value
            }
          })
          unfarming.value = Math.round(unfarming.value * 0.0015 * 100) / 100
          total.value = Math.round((Number(farming.value) + Number(unfarming.value)) * 100) / 100
        }
        console.log('statisticsval====>', val)
      },
      { immediate: true, deep: true }
    )
    return {
      state,
      total,
      farming,
      unfarming,
      isThousandTotal
    }
  }
})
</script>

<style scoped lang="scss">
.statistics {
  width: 298px;
  margin: 24px 0;
  display: flex;
  flex-direction: column;
  // align-items: center;
  gap: 20px;

  .bar-list {
    .bar-item {
      margin-bottom: 30px;
      &:last-of-type {
        margin-bottom: 10px;
      }
      .info {
        div {
          max-width: 60%;
          span {
            display: block;
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            /*超出隐藏*/
            text-overflow: ellipsis;
            /*超出显示为省略号*/
            -webkit-box-orient: vertical;
            font-size: 16px;
          }
        }
      }
    }
  }
  .bar-item {
    margin: 0 12px 10px;

    .info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 22px;

      div {
        display: flex;
        align-items: flex-end;

        p {
          font-size: 22px;
          font-family: PangMenZhengDao;
        }
      }
    }

    .progress-bg {
      position: relative;
      margin-top: 12px;
      width: 100%;
      height: 4px;
      background: rgba(38, 218, 248, 0.14);

      .progress {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background: linear-gradient(90deg, rgba(44, 225, 255, 0.10196078431372549) 0%, #26daf8 91%, #26daf8 100%);
      }

      img {
        position: absolute;
        top: 50%;
        width: 26px;
        height: 26px;
        transform: translateY(-50%) translateX(-50%);
      }
    }
  }

  .item {
    display: flex;
    align-items: center;
    background: url('../image/statistics_bg.png') no-repeat;
    background-size: 100% 100%;
    flex: 1;
    box-sizing: border-box;
    height: 82px;

    .icon_box {
      position: relative;
      margin: 0 16px 0 20px;
      width: 48px;
      height: 48px;

      img {
        position: absolute;

        &:nth-of-type(1) {
          width: 44px;
          height: 44px;
          animation: recycle 4s linear infinite;
        }

        &:nth-of-type(2) {
          width: 20px;
          height: 20px;
          top: 12px;
          left: 12px;
        }
      }
    }

    .info {
      padding-left: 20px;
      box-sizing: border-box;

      div {
        display: flex;
        height: 22px;
        align-items: flex-end;
        letter-spacing: 1px;
        margin-bottom: 6px;

        &:nth-of-type(1) {
          line-height: 22px;
          margin-right: 10px;
        }

        p {
          font-size: 24px;
          line-height: 22px;
          font-family: PangMenZhengDao;
        }
      }
    }
  }
}
</style>
