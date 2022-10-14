<template>
  <div class="city-bar">
    <div class="chart" ref="myRef"></div>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  inject,
  onMounted,
  nextTick,
  reactive,
  watch,
} from "vue";
import * as echarts from "echarts";
// import areaPercent from "@/assets/js/percent.json";
// import cityPercent from "@/assets/js/percentCity.json";
import threeData from "@/assets/js/three.json";
// import lodash from "lodash";
// import { compare } from "./const";
import common from "@/assets/js/common"; //全局JS方法

export default defineComponent({
  name: "cityBar",
  props: {
    selectVal: {
      type: String,
      default: "宁波市",
    }, // 地区筛选 xx市/xx区县/xx镇街
  },
  setup(props) {
    let myEcharts = null;
    const chartData = reactive({
      xData: [],
      yData: [],
    });
    const unit = inject("unit");
    const myRef = ref(null);
    const initEcharts = () => {
      myEcharts = echarts.init(myRef.value);
      myEcharts.setOption({
        tooltip: {
          show: true,
          trigger: "axis",
        },
        // 暂时不需要展示图例
        // legend: {
        //   selectedMode: false, // 取消点击事件
        //   icon: 'race',
        //   itemHeight: 2 * unit.value,  // 设置图例图形的高
        //   itemWidth: 16 * unit.value,
        //   orient: 'horizontal',
        //   top: '7%',
        //   right: '7%',
        //   textStyle: {
        //     color: '#fff',  // 图例文字颜色
        //     fontSize: 14 * unit.value,
        //   }
        // },
        xAxis: {
          type: "category",
          data: chartData.xData,
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
            rotate: 30,
            margin: 20 * unit.value,
            fontSize: 12 * unit.value,
            lineHeight: 20 * unit.value,
            color: "rgba(255, 255, 255, .7)",
            formatter: (params) => {
              let arr = params.split("");
              let arrStr = "";
              arr.map((item, index) => {
                arrStr += item;
                if ((index + 1) % 5 === 0) {
                  arrStr += "\n";
                }
              });
              return arrStr;
            },
          },
        },
        yAxis: {
          type: "value",
          name: "面积（亩）",
          nameGap: 25,
          splitLine: {
            show: true, // 轴刻度线
            lineStyle: {
              type: "dashed",
              color: "rgba(255, 255, 255, .08)",
            },
          },
          axisLabel: {
            formatter: "{value}",
            fontSize: 14 * unit.value,
            color: "rgba(255, 255, 255, .7)",
          },
          nameTextStyle: {
            fontSize: 14 * unit.value,
            color: "rgba(255, 255, 255, .7)",
            align: "left",
          },
        },
        grid: {
          left: "0%",
          right: "0%",
          bottom: "2%",
          top: "18%",
          containLabel: true,
        },
        series: [
          {
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
            data: chartData.yData,
          },
        ],
      });
    };

    onMounted(() => {
      nextTick(() => {
        initEcharts();
      });
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
          newThreeData.map((item) => {
            chartData.xData.push(item.name);
            chartData.yData.push((+item.value).toFixed(1));
            // sum += +item.area;
          });
          if (myEcharts) {
            initEcharts();
          }
        }
      },
      { immediate: true }
    );

    return {
      myRef,
    };
  },
});
</script>

<style scoped lang="scss">
.city-bar {
  height: 240px;
  margin-top: 30px;
  .chart {
    width: 100%;
    height: 100%;
  }
}
</style>
