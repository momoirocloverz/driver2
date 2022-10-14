<template>
  <div class="city-pie">
    <div class="chart" ref="myRef"></div>
    <div class="legends">
      <div
        class="item"
        v-for="(item, index) in chartData"
        :key="index"
        v-show="item.name !== '其他'"
        @click="selectType(item)"
      >
        <span :style="{ background: color[index] }"></span>
        <p>{{ item.name }}</p>
        <p :style="{ color: color[index] }">
          {{ ((+item.value / totalArea) * 100).toFixed(2) }}%
        </p>
      </div>
      <div
        class="item"
        v-for="(item, index) in chartData"
        :key="index"
        v-show="item.name === '其他'"
        @click="selectType(item)"
      >
        <span :style="{ background: color[index] }"></span>
        <p>{{ item.name }}</p>
        <p :style="{ color: color[index] }">
          {{ ((+item.value / totalArea) * 100).toFixed(2) }}%
        </p>
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
import common from "@/assets/js/common"; //全局JS方法
// import areaPercent from '@/assets/js/percent.json'
import threeData from "@/assets/js/three.json";
import cityPercent from "@/assets/js/percentCity.json";
import * as echarts from "echarts";

export default defineComponent({
  name: "cityPie",
  props: {
    selectVal: {
      type: String,
      default: "宁波市",
    }, // 地区筛选 xx市/xx区县/xx镇街
  },
  setup(props, { emit }) {
    const chartData = ref([]);
    const cityData = ref([]);
    const totalArea = ref(0);
    const myRef = ref(null);
    const unit = inject("unit");
    let interval = null;
    let myEcharts = null;

    const initEcharts = () => {
      myEcharts = echarts.init(myRef.value);

      let currentIndex = -1;
      let dataLen = cityData.value.length;
      currentIndex = (currentIndex + 1) % dataLen;
      // 高亮当前图形

      let totalData = 0;
      chartData.value.map((item) => {
        totalData += +item.value;
        totalArea.value += +item.value;
      });

      myEcharts.setOption({
        tooltip: {
          show: false,
          trigger: "item",
        },
        legend: {
          show: false,
          selectedMode: false, // 取消点击事件
          icon: "square",
          itemGap: 22 * unit.value,
          itemHeight: 12 * unit.value, // 设置图例图形的高
          orient: "vertical",
          top: "center",
          left: "40%",
          width: "60%",
          textStyle: {
            color: "#fff", // 图例文字颜色
            fontSize: 14 * unit.value,
            rich: {
              a: {
                width: 60 * unit.value,
                fontSize: 14 * unit.value,
                color: "rgba(255, 255, 255, .8)",
              },
              b: {
                width: 150 * unit.value,
                fontSize: 14 * unit.value,
                padding: [0, 0, 0, -10],
                color: "rgba(255, 255, 255, .8)",
              },
            },
          },
          formatter: function (name) {
            let target;
            chartData.value.forEach((item) => {
              if (item.name === name) {
                target = +item.value;
              }
            });
            return [
              "{b|" + name + "}",
              "{a|" + ((target / totalData) * 100).toFixed(2) + "%" + "}",
            ].join("");
          },
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
            center: ["18%", "50%"],
            radius: ["60%", "75%"],
            label: {
              show: false,
              position: "center",
              lineHeight: 28 * unit.value,
              formatter: function (params) {
                return [
                  "{title|" + params.data.name + "}",
                  "{bule|" + (+params.data.value).toFixed(1) + "}{default|亩}",
                  "{bule|" +
                    ((+params.data.value / totalArea.value) * 100).toFixed(2) +
                    "}{default|%}",
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
      emit("select", item.name);
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

    onBeforeUnmount(() => {
      interval && clearInterval(interval);
    });

    const genData = (data) => {
      let result = {};
      data.forEach((v) => {
        if (!result[v["地类"]]) {
          result[v["地类"]] = +v["面积（亩）"];
        } else {
          result[v["地类"]] = +result[v["地类"]] + +v["面积（亩）"];
        }
      });
      let resultArr = [];
      Object.keys(result).forEach((key) => {
        resultArr.push({ name: key, value: result[key] });
      });
      resultArr.sort((a, b) => b.value - a.value);
      return resultArr;
    };

    watch(
      () => props.selectVal,
      (val) => {
        if (val) {
          // console.log("区划选择 =》 ", val);
          let targetArea = val.split("/").pop();
          if (val.split("/").length == 4) {
            // 粮功区层级
            targetArea = val.split("/")[2];
          } else {
            targetArea = val.split("/").pop();
          }
          let newThreeData = common.compare(threeData, "面积（亩）", "down");
          newThreeData = newThreeData.filter((v) => v["层级"] == targetArea);
          newThreeData = genData(newThreeData);
          // 根据地类 累加每地类面积总和
          chartData.value = newThreeData;
          if (myEcharts) {
            initEcharts();
          }
        }
      },
      { immediate: true }
    );

    onMounted(() => {
      // chartData.value = lodash.cloneDeep(cityPercent)
      // chartData.value.map(item => {
      //   item.name = item.type
      //   item.value = (item.area * .0015)
      //   totalArea.value += (+item.area * .0015)
      // })
      // chartData.value.sort(compare('value'))
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
    };
  },
});
</script>

<style scoped lang="scss">
.city-pie {
  position: relative;
  height: 230px;
  .chart {
    width: 100%;
    height: 100%;
  }
  .legends {
    position: absolute;
    z-index: 0;
    height: 100%;
    width: 68%;
    top: 0;
    left: 32%;
    padding: 30px 30px 30px 0;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    .item {
      width: 50%;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding-left: 20px;
      cursor: pointer;
      span {
        width: 12px;
        height: 12px;
        margin-right: 12px;
      }
      p {
        &:nth-of-type(1) {
          flex: 1;
          opacity: 0.7;
        }
        &:nth-of-type(1) {
          flex: 1;
        }
      }
    }
  }
}
</style>
