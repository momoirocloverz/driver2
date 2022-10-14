<template>
  <div class="statistics">
    <div>
      <div style="display: flex">
        <div class="item" style="margin-right: 20px">
          <!-- <div class="icon_box">
          <img class="icon-wrap" :src="require('../image/statistics_cycle.png')" alt="" />
          <img class="icon" :src="require('../image/statistics_icon_3.png')" alt="" />
        </div> -->
          <div class="info">
            <div class="title">耕地</div>
            <div class="num">
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
            <div class="title">永农</div>
            <div class="num">
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
            <div class="title">高标农</div>
            <div class="num">
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
            <div class="title">粮功区面积</div>
            <div class="num">
              <p>{{ (total / 10000).toFixed(2) }}</p>
              {{ '万亩' }}
            </div>
          </div>
        </div>
      </div>
      <div style="display: flex">
        <div class="item" style="margin-right: 20px">
          <div class="info">
            <div class="title">已接入高台设备</div>
            <div class="num">
              <p>{{ 58 }}</p>
              {{ '个' }}
            </div>
          </div>
        </div>
        <div class="item">
          <div class="info">
            <div class="title">已接入基地监控</div>
            <div class="num">
              <p>{{ 6 }}</p>
              {{ '个' }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="industrial-area-data">
      <template v-for="(item, index) in showAreaList" :key="index">
        <div :style="{ marginRight: (index + 1) % 2 ? '12px' : '0' }">
          <p class="title">{{ item?.name }}</p>
          <p class="unit">
            <span>{{ item?.value }}</span
            >{{ item?.unit }}
          </p>
          <p class="status">
            <span :style="{ color: item.type === 'up' ? '#4CE77D' : '#FF5B40' }">{{ item?.proportion }}</span> <img :src="item.type === 'up' ? imgObj.upSrc : imgObj.downSrc" alt="" />
          </p>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from 'vue'
import { industrialAreaDataList } from '../modal/const'
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
    const showAreaList = ref([])
    const isThousandTotal = ref(true) //当前选择区域是否是市（第一级）并且是宁波市
    const imgObj = {
      upSrc: 'https://img.hzanchu.com/acimg/a14ed408ff5a5f288d08a8b22a805a1a.png',
      downSrc: 'https://img.hzanchu.com/acimg/2f592ffe567d4befe966d8e88b548540.png'
    }
    onMounted(() => {
      getAreaData('宁波市') //默认加载宁波市
    })
    const getAreaData = (area) => {
      // 筛选当前地区的数据
      const arr = JSON.parse(JSON.stringify(industrialAreaDataList)) // 深拷贝防止改变原数组
      const newArr = arr.filter((item) => item.area == area)
      showAreaList.value = newArr
    }
    watch(
      () => props.selectVal,
      (val) => {
        //监听选择地域变化
        const selectValArr = val.split('/')
        const SelectVal = selectValArr[selectValArr.length - 1]
        // 只处理区县和市 镇和村无数据
        if ((selectValArr[0] == '宁波市' && selectValArr.length <= 2) || (selectValArr[0] != '宁波市' && selectValArr.length <= 1)) getAreaData(SelectVal) // 拿当前选中的
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
      },
      { immediate: true, deep: true }
    )
    return {
      total,
      farming,
      unfarming,
      isThousandTotal,
      showAreaList,
      imgObj
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
    // background: url('../image/statistics_bg.png') no-repeat;
    // background-size: 100% 100%;
    flex: 1;
    box-sizing: border-box;
    height: 62px;
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
      .title {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #d8ebff;
      }
      .num {
        display: flex;
        align-items: center;
        p {
          font-size: 22px;
          font-family: PangMenZhengDao-3, PangMenZhengDao;
          font-weight: normal;
          color: #15dbff;
          margin-right: 2px;
        }
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #90b1d2;
      }
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
  .industrial-area-data {
    display: flex;
    flex-wrap: wrap;
    div {
      margin-bottom: 13px;
      width: 40%;
      height: 106px;
      background: url('https://img.hzanchu.com/acimg/ca6ef453beb5eda0021eea99e2256a7c.png') no-repeat;
      background-size: 100% 100%;
      padding-left: 21px;
      padding-top: 17px;
      .title {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #ffffff;
        margin-bottom: 14px;
      }
      .unit {
        height: 22px;
        font-size: 12px;
        font-family: MicrosoftYaHei;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 10px;
        span {
          font-size: 22px;
          font-family: PangMenZhengDao-3, PangMenZhengDao;
          font-weight: normal;
          color: #ffffff;
          margin-bottom: 2px;
          margin-right: 4px;
        }
      }
      .status {
        height: 21px;
        font-size: 16px;
        font-family: MicrosoftYaHei;
        display: flex;
        align-items: center;
        img {
          width: 7px;
          height: 12px;
          margin-left: 2px;
        }
      }
    }
  }
}
</style>
