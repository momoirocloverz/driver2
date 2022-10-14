<template>
  <div class="county-pie">
    <second-title :title="landType" />
    <!-- <area-select
      :areaOption="areaOption"
      v-model:area-value="areaValue"
    /> -->
    <div class="chert-wrap">
      <div class="chart" ref="myRef"></div>
      <!-- <div class="legends">
        <div class="item" v-for="(item, index) in chartData" :key="index">
          <span :style="{ background: color[index] }"></span>
          <p>{{ item.name }}</p>
          <p :style="{ color: color[index] }">{{ (+item.value / totalArea * 100).toFixed(1) }}%</p>
        </div>
      </div> -->
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
import { color, compare, countyList } from "./const";
// import areaPercent from "@/assets/js/percent.json";
import common from "@/assets/js/common"; //全局JS方法
import threeData from "@/assets/js/three.json";
import countyPercent from "@/assets/js/percentCounty.json";
import * as echarts from "echarts";
import areaSelect from "./areaSelect";
import secondTitle from "@/components/secondTitle";

export default defineComponent({
  name: "cityPie",
  components: {
    areaSelect,
    secondTitle,
  },
  props: {
    landType: {
      type: String,
      default: "",
    },
    selectVal: {
      type: String,
      default: "宁波市",
    }, // 地区筛选 xx市/xx区县/xx镇街
  },
  setup(props, { emit }) {
    const chartData = ref([]);
    const areaValue = ref(props.landType);
    const totalArea = ref(0);
    const areaOption = ref([
      "耕地",
      "其他",
      "园地",
      "林地",
      "养殖坑塘",
      "农村宅基地",
      "工业用地",
      "水工建筑用地",
      "商业服务业设施用地",
    ]);
    const myRef = ref(null);
    const unit = inject("unit");
    let interval = null;
    let myEcharts = null;

    const formatData = (type) => {
      lodash.cloneDeep(countyPercent).map((area) => {
        if (area.type === type) {
          chartData.value.push({
            name: area.county,
            value: +area.area * 0.0015,
          });
          totalArea.value += +area.area * 0.0015;
        }
      });
      // lodash.cloneDeep(areaPercent).splice(1).map(first => {
      //   first?.data.map(second => {
      //     if (second.type === type) {
      //       chartData.value.push({ name: first.area, value: +second.area * .0015 })
      //       totalArea.value += (+second.area * .0015)
      //       return
      //     }
      //   })
      // })
      countyList.map((county) => {
        const index = chartData.value.findIndex((item) => item.name === county);
        if (index === -1) {
          chartData.value.push({ name: county, value: 0 });
        }
      });
      chartData.value.sort(compare("value"));
    };

    const initEcharts = () => {
      myEcharts = echarts.init(myRef.value);
      myEcharts.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        legend: {
          show: false,
        },
        color: color,
        grid: {
          left: "0%",
          right: "5%",
          bottom: "0%",
          top: "18%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: chartData.value.map((e) => e.name),
            axisTick: {
              show: false, // 轴刻度线
            },
            axisLine: {
              // 轴线
              show: true,
              lineStyle: {
                color: "rgba(185, 200, 218, .2)",
              },
            },
            axisLabel: {
              fontSize: 12 * unit.value,
              lineHeight: 20 * unit.value,
              color: "rgba(255, 255, 255, .7)",
              rotate: 60,
              formatter: (params) => {
                let arrStr =params.length >= 6? params.substr(0, 6) + '...': params;
                return arrStr;
              },
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "面积（亩）",
            axisLabel: {
              formatter: "{value}",
              fontSize: 14 * unit.value,
              color: "rgba(255, 255, 255, .7)",
            },
            splitLine: {
              show: true, // 轴刻度线
              lineStyle: {
                type: "dashed",
                color: "rgba(255, 255, 255, .08)",
              },
            },
            nameTextStyle: {
              fontSize: 14 * unit.value,
              color: "rgba(255, 255, 255, .7)",
              align: "left",
            },
          },
          {
            type: "value",
            name: "占比（%）",
            max: 100,
            axisLabel: {
              formatter: "{value}",
              fontSize: 14 * unit.value,
              color: "rgba(255, 255, 255, .7)",
            },
            splitLine: {
              show: true, // 轴刻度线
              lineStyle: {
                type: "dashed",
                color: "rgba(255, 255, 255, .08)",
              },
            },
            nameTextStyle: {
              fontSize: 14 * unit.value,
              color: "rgba(255, 255, 255, .7)",
              align: "left",
            },
          },
        ],
        series: [
          {
            name: "面积",
            type: "bar",
            barWidth: 24 * unit.value,
            color: ["rgba(0, 168, 255, 1)"],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                1,
                0,
                0,
                [
                  {
                    offset: 0,
                    color: "rgba(0, 114, 123, 1)", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(42, 235, 234, 1)", // 100% 处的颜色
                  },
                ],
                false
              ),
            },
            label: {
              show: true,
              position: "top",
              fontSize: 14 * unit.value,
              color: "rgba(255, 255, 255, 1)",
              fontFamily: "PangMenZhengDao",
            },
            data: chartData.value.map((e) => Number(e.value).toFixed(1)),
          },
          {
            name: "占比",
            type: "line",
            yAxisIndex: 1,
            tooltip: {
              valueFormatter: function (value) {
                return value + " %";
              },
            },
            data: chartData.value.map((e) => {
              return e.rate.split('%')[0] //只要数字
            }),
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

    watch(
      () => unit.value,
      () => {
        setTimeout(() => {
          if (myEcharts) myEcharts.dispose();
          initEcharts();
        }, 1000);
      }
    );

    // watch(() => areaValue.value, val => {
    //   chartData.value = []
    //   totalArea.value = 0
    //   formatData(val)
    //   if (myEcharts) {
    //     myEcharts.dispose()
    //     initEcharts()
    //   }
    // }, { immediate: true })

    // watch(
    //   () => props.landType,
    //   (val) => {
    //     chartData.value = [];
    //     totalArea.value = 0;
    //     formatData(val);
    //     if (myEcharts) {
    //       myEcharts.dispose();
    //       initEcharts();
    //     }
    //   },
    //   { immediate: true }
    // );

    const genData = (data, landType, ta) => {
      let result = {};
      result = data.filter((v) => v["地类"] == landType);
      // 计算比例
      totalArea.value = 0;
      result.forEach((v) => {
        totalArea.value += +v["面积（亩）"];
      });
      return result.map((v) => {
        return {
          name: v["下一级"],
          value: v["面积（亩）"],
          rate: v["占比"],
        };
      });
    };

    watch(
      [() => props.landType, () => props.selectVal],
      ([newVal1, newVal2], [oldVal1, oldVal2]) => {
        // console.log("landType, selectVal", newVal1, newVal2);
        // console.log("oldVal1, oldVal2", oldVal1, oldVal2);
        const landType = newVal1;
        const selectVal = newVal2;
        let targetArea = selectVal.split("/").pop();
        if (selectVal.split("/").length == 4) {
          // 粮功区层级 
          targetArea = selectVal.split("/")[2];
        } else {
          targetArea = selectVal.split("/").pop();
        }
        let newThreeData = common.compare(threeData, "面积（亩）", "down");
        newThreeData = newThreeData.filter((v) => v["层级"] == targetArea);
        newThreeData = genData(newThreeData, landType);
        console.log("newThreeData", newThreeData);
        chartData.value = newThreeData;
        if (myEcharts) {
          myEcharts.dispose();
          initEcharts();
        }
      },
      { immediate: true }
    );

    onBeforeUnmount(() => {
      interval && clearInterval(interval);
    });

    onMounted(() => {
      nextTick(() => {
        initEcharts();
      });
    });

    return {
      myRef,
      color,
      totalArea,
      chartData,
      areaValue,
      areaOption,
    };
  },
});
</script>

<style scoped lang="scss">
.chert-wrap {
  position: relative;
  height: 250px;
  margin-top: 10px;
  .chart {
    width: 100%;
    height: 100%;
  }
  .legends {
    position: absolute;
    z-index: 0;
    height: 100%;
    width: 60%;
    top: 0;
    left: 45%;
    padding: 30px 50px 30px 0;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    .item {
      width: 50%;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding: 0 20px;
      span {
        width: 12px;
        height: 12px;
        margin-right: 12px;
      }
      p {
        &:nth-of-type(1) {
          opacity: 0.7;
        }
        &:nth-of-type(2) {
          opacity: 0.7;
          text-indent: 12px;
        }
      }
    }
  }
}
</style>
