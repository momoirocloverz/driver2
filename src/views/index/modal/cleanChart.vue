<template>
  <div class="clean-pie" v-if="isShowEcharts">
    <div class="chart" ref="myRef"></div>
    <div class="legends">
      <div class="header">
        <div class="name">区域名称</div>
        <div class="area">清理腾退面积(亩)</div>
        <div class="rate">比例</div>
      </div>
      <div class="list-content">
        <div class="item" v-for="(item, i) in chartData" :key="i">
          <div class="name">
            <span class="block" :style="{ background: color[i] }"></span>
              <el-tooltip
                effect="dark"
                popper-class="search-tooltip"
                :content="item.name"
                placement="top-start"
              >
              {{ item.name }}
            </el-tooltip>
          </div>
          <div class="area" :style="{ color: color[i] }">
            {{ item.value }}
          </div>
          <div class="rate" :style="{ color: color[i] }">
            {{ item.rate }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import lodash from "lodash";
import { color, compare } from "./const";
import optimizeData from "@/assets/js/clearData.json";
// console.log("optimizeData", optimizeData);
import * as echarts from "echarts";

export default defineComponent({
  name: "optimizePie",
  props: {
    selectVal: {
      type: String,
      default: "宁波市",
    }, // 地区筛选 xx市/xx区县/xx镇街}
  },
  setup(props, { emit }) {
    const chartData = ref([]);
    const cityData = ref([]);
    const isShowEcharts = ref(true);
    const totalArea = ref(0);
    const myRef = ref(null);
    const total = ref(0);
    const unit = inject("unit");
    let interval = null;
    let myEcharts = null;

    const initEcharts = () => {
      myEcharts = echarts.init(myRef.value);

      let currentIndex = -1;
      let dataLen = cityData.value.length;
      currentIndex = (currentIndex + 1) % dataLen;

      myEcharts.setOption({
        tooltip: {
          show: false,
          trigger: "item",
        },
        legend: {
          show: false,
        },
        color: color,
        grid: {
          left: "0%",
          right: "0%",
          bottom: "0%",
          top: "0%",
          containLabel: true,
        },
        series: [
          {
            type: "pie",
            avoidLabelOverlap: true,
            center: ["24%", "50%"],
            radius: ["45%", "60%"],
            label: {
              show: false,
              position: "center",
              lineHeight: 28 * unit.value,
              formatter: function (params) {
                return [
                  "{title|" + params.data.name + "}",
                  "{bule|" + (+params.data.value).toFixed(1) + "}{default|亩}",
                  "{bule|" + params.data.rate + "}{default|%}",
                ].join("\n");
              },
              // formatter:  [
              //   '{title|{}}',
              //   // '{bule|{c}}{default|亩}',
              //   '{bule|{d}}{default|%}'
              // ].join('\n\n'),
              rich: {
                title: {
                  color: "#fff",
                  fontSize: 16 * unit.value,
                },
                bule: {
                  color: "#26E3FF",
                  fontSize: 20 * unit.value,
                  fontFamily: "PangMenZhengDao",
                  padding: [0, 4, 0, 0],
                  textShadowBlur: 8,
                  textShadowOffsetX: 0,
                  textShadowOffsetY: 0,
                  textShadowColor: "rgba(43, 228, 255, 0.3)",
                },
                default: {
                  fontSize: 14 * unit.value,
                  color: "#fff",
                },
              },
            },
            emphasis: {
              blurScope: "coordinateSystem",
              label: {
                show: true,
                fontSize: 14 * unit.value,
                fontWeight: "bold",
              },
            },
            data: chartData.value,
          },
        ],
      });
      myEcharts.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: 0,
      });
      myEcharts.on("mouseover", (a) => {
        clearInterval(interval);
        myEcharts.dispatchAction({
          type: "downplay",
        });
        myEcharts.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: a.dataIndex,
        });
      });
      myEcharts.on("mouseout", () => {
        myEcharts.dispatchAction({
          type: "downplay",
        });
        startInterval();
      });
      startInterval();
    };

    const startInterval = () => {
      interval && clearInterval(interval);
      let currentIndex = -1;
      interval = setInterval(() => {
        var dataLen = chartData.value.length;
        // 取消之前高亮的图形
        myEcharts.dispatchAction({
          type: "downplay",
          seriesIndex: 0,
          dataIndex: currentIndex,
        });
        currentIndex = (currentIndex + 1) % dataLen;
        // 高亮当前图形
        myEcharts.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: currentIndex,
        });
      }, 3000);
    };

    const selectType = (item) => {
      emit("select", item.type);
    };

    watch(
      () => unit.value,
      () => {
        setTimeout(() => {
          if (myEcharts) myEcharts.dispose();
          initEcharts();
        }, 1000);
      }
    );

    watch(
      () => props.selectVal,
      (val) => {
        if (val) {
          const targetArea = val.split("/").pop();
          const result = optimizeData.filter((v) => v.bCity == targetArea);
          if (!result.length) { isShowEcharts.value = false } else { isShowEcharts.value=true}//没数据不展示
          let totalData = 0;
          result.forEach((v) => {
            totalData = totalData + Number(v.value);
          });
          total.value = totalData;
          // result.forEach((v) => {
          //   v.rate = ((+v.value / totalData) * 100).toFixed(2) + "%";
          // });
          result.sort(compare("rate"));
          console.log(result,'result')
          chartData.value = result;
          if (myEcharts) {
            initEcharts();
          }
        }
      },
      { immediate: true }
    );

    onBeforeUnmount(() => {
      interval && clearInterval(interval);
    });

    onMounted(() => {
      nextTick(() => {
        // 高亮当前图形
        initEcharts();
      });
    });

    return {
      myRef,
      cityData,
      color,
      totalArea,
      selectType,
      chartData,
      isShowEcharts
    };
  },
});
</script>

<style scoped lang="scss">
.clean-pie {
  position: relative;
  width: 100%;
  height: 300px;
   display: inline-block;
  .chart {
    width: 100%;
    height: 100%;
  }
  .legends {
    position: absolute;
    z-index: 0;
    height: 100%;
    width: 425px;
    top: 0;
    left: 38%;
    // padding: 30px 30px 30px 0;
    box-sizing: border-box;
    > div {
      box-sizing: border-box;
    }

    .header {
      width: 100%;
      height: 30px;
      background: rgba(23, 151, 255, 0.4);
      opacity: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #fff;
      font-size: 16px;
      .name {
        width: 120px;
        text-align: center;
      }
      .area {
        width: 100px;
        text-align: right;
      }
      .rate {
        width: 100px;
        text-align: center;
      }
    }
    .list-content {
      height: calc(100% - 30px);
      overflow-y: auto;
      .item {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .name {
          width: 120px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          // text-align: center;
          .block {
            display: inline-block;
            width: 12px;
            height: 12px;
            margin-right: 12px;
            margin-left: 20px;
          }
        }
        .area {
          width: 100px;
          text-align: right;
        }
        .rate {
          width: 100px;
          text-align: center;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.search-tooltip{
        background: #002A55 !important;
    .el-tooltip__popper {
        background: #002A55 !important;
    }
    .el-popper__arrow:before{
        background: #002A55 !important;
    }
}
</style>