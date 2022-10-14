<template>
  <div class="statistics">
    <div class="item">
      <div class="icon_box">
        <img class="icon-wrap" :src="require('../image/statistics_cycle.png')" alt="" />
        <img class="icon" :src="require('../image/statistics_icon_3.png')" alt="" />
      </div>
      <div class="info">
        <div>粮食功能区总面积</div>
        <div>
           <p>{{ isThousandTotal ? (total / 10000).toFixed(2) : total }}</p>
          {{ isThousandTotal ? "万亩" : "亩" }}
        </div>
      </div>
    </div>

    <div class="bar-item">
      <div class="info">
        <div>农业用地面积</div>
        <div>
          <p>{{ isThousandTotal ? (farming / 10000).toFixed(2) : farming }}</p>
          {{ isThousandTotal ? "万亩" : "亩" }}
        </div>
      </div>
      <div class="progress-bg">
        <div
          class="progress"
          :style="{ width: farming / total * 100 + '%' }"
        ></div>
        <img :style="{ left: farming / total * 100 + '%' }" :src="require('./../image/progress-point.png')" alt="" />
      </div>
    </div>

    <div class="bar-item">
      <div class="info">
        <div>非农业用地面积</div>
        <div>
          <p>{{ isThousandTotal ? (unfarming / 10000).toFixed(2) : unfarming }}</p>
          {{ isThousandTotal ? "万亩" : "亩" }}
        </div>
      </div>
      <div class="progress-bg">
        <div
          class="progress"
          :style="{ width: unfarming / total * 100 + '%' }"
        ></div>
        <img :style="{ left: unfarming / total * 100 + '%' }" :src="require('./../image/progress-point.png')" alt="" />
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
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  props: {
    areaList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    areaListFarm: {
      type: Array,
      default: () => {
        return [];
      }
    },
    selectVal: {
      type: String,
      default: () => {
        return "";
      }
    }
  },
  setup(props) {
    const farming = ref(0);
    const unfarming = ref(0);
    const total = ref(0);
    const isThousandTotal = ref(true);//当前选择区域是否是市（第一级）并且是宁波市

    watch(() => props.selectVal, (val) => {//监听选择地域变化
      const selectValArr=val.split('/')
      //当前选择地区是市（第一级）并且是宁波市
      isThousandTotal.value=Array.isArray(selectValArr)&&selectValArr.length==1&&selectValArr[0]=='宁波市'//直接拿地域中文名判断后期可能出现变动后面试着更改一下
    })

    watch(() => props.areaListFarm, (val) => {
      if (val.length) {
        farming.value = 0;
        val.map(item => {
          farming.value += +item.value;
        });
        farming.value = Math.round(farming.value * .0015 * 100) / 100;
        total.value = Math.round((Number(farming.value) + Number(unfarming.value)) * 100) / 100;
      }
    }, { immediate: true, deep: true });
    watch(() => props.areaList, val => {
      if (val.length) {
        unfarming.value = 0;
        val.map(item => {
          if (item.name !== "农业用地") {
            unfarming.value += +item.value;
          }
        });
        unfarming.value = Math.round(unfarming.value * .0015 * 100) / 100;
        total.value = Math.round((Number(farming.value) + Number(unfarming.value)) * 100) / 100;
      }
    }, { immediate: true, deep: true });
    return {
      total,
      farming,
      unfarming,
      isThousandTotal
    };
  }
});
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
      background: rgba(38, 218, 248, .14);
      .progress {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background: linear-gradient(90deg, rgba(44, 225, 255, 0.10196078431372549) 0%, #26DAF8 91%, #26DAF8 100%);
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
    width: 298px;
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
      div {
        display: flex;
        height: 22px;
        align-items: flex-end;
        letter-spacing:1px;
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
