<template>
  <div class="county-pie">
    <div class="chert-wrap" :style="{ height: chartsWidth}">
      <div  v-if="chartData.length" class="chart" ref="myRef"></div>
      <div v-if="!chartData.length" class="data-none">暂无非粮化数据</div>
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
  reactive,
  ref,
  watch,
} from "vue";
import lodash from "lodash";
import { color, compare, countyList } from "./const";
import * as echarts from "echarts";
import nonGrainData from "@/assets/js/nonGrainData.json";

export default defineComponent({
  props: {
    chartsWidth: {
      type: String,
      default: "240px",
    },
    landType: {
      type: String,
      default: "",
    },
    selectVal: {
      type: String,
      default: "宁波市",
    }, // 地区筛选 xx市/xx区县/xx镇街
    selectAreaVal: {
      type:String
    }
  },
  setup(props, { emit }) {
    const chartData = ref([]);
    const areaValue = ref(props.landType);
    const chartsWidth = ref(props.chartsWidth);
    const totalArea = ref(0);
    const isGhmc = ref(false);
    const myRef = ref(null);
    const unit = inject("unit");
    let interval = null;
    let myEcharts = null;
    const areaArr = ref([]);

    const formatData = () => {
      for (let i = 0; i < areaArr.value.length; i++) {
        for (let j = 0; j < nonGrainData.length; j++) {
          if (areaArr.value[i].name === nonGrainData[j].name) {
            areaArr.value[i].num = nonGrainData[j].area;
            areaArr.value[i].rate = nonGrainData[j].rate;
          }
        }
      }
      initEcharts();
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
        legend: [
          {
            data: ["面积"],
            right: "50%",
            textStyle: {
              color: "#fff",
            },
            icon: 'circle'
          },
          {
            data: ["占比"],
            right: "40%",
            textStyle: {
              color: "#fff",
            },
          },
        ],
        color: color,
        grid: {
          left: "4%",
          right: "5%",
          bottom: "0%",
          top: "18%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: chartData.value.map((e) => e.name),
            // 
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
              fontSize: isGhmc.value?18 * unit.value:12 * unit.value,
              lineHeight: 20 * unit.value,
              color: "rgba(255, 255, 255, .7)",
              rotate: !isGhmc.value ? 60 : 0,
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
            position: "left",
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
              align: "right",
            },
          },
          {
            type: "value",
            name: "占比（%）",
            axisLabel: {
              formatter: "{value}",
              fontSize: 14 * unit.value,
              color: "rgba(255, 255, 255, .7)",
            },
            position: "right",
            splitLine: {
              show: false, // 轴刻度线
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
            barWidth: 26 * unit.value,
            color: ['rgba(0, 168, 255, 1)'],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: 'rgba(0, 114, 123, 0.5)' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(42, 235, 234, 1)' // 100% 处的颜色
                }], false)
            },
            // label: {
            //   show: true,
            //   position: 'top',
            //   fontSize: 14 * unit.value,
            //   color: 'rgba(255, 255, 255, 1)',
            //   fontFamily: 'PangMenZhengDao',
            // },
            data: chartData.value.map((e) => Number(e.area).toFixed(1)),
          },
          {
            name: "占比",
            type: "line",
            yAxisIndex: 1,
            color: "#d09235",
            lineStyle: {
              color: "#d09235",
            },
            symbol: "none",
            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                1,
                0,
                0,
                [
                  {
                    offset: 0,
                    color: "rgba(229, 160, 55, 0)", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(229, 160, 55, 0.2)", // 100% 处的颜色
                  },
                ],
                false
              ),
            },
            data: chartData.value.map((e) => Number(e.rate).toFixed(1)),
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
      myEcharts.on("click", (e) => {
        emit("update:areaName", e.name);
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

    watch(
      () => props.selectVal,
      (val) => {
        if (val) {
          const valArr = val.split("/");
          let targetArea = [];
          isGhmc.value = false
          if (valArr.length == 1 && valArr[0] == '宁波市') {
            // 宁波市
            targetArea = nonGrainData.filter((v) => v.bCity == "宁波市");
          } else if (valArr.length == (props.selectAreaVal?1:2)) {
            // 某区县 显示乡镇街道
            const countyName = valArr[(props.selectAreaVal ? 0 : 1)];
            targetArea = nonGrainData.filter((v) => v.bCity == countyName);
          } else if (valArr.length == (props.selectAreaVal?2:3)) {
            // 某乡镇街道 显示功能区
            const townshipName = valArr[(props.selectAreaVal?1:2)];
            targetArea = nonGrainData.filter((v) => v.bCity == townshipName);
          } else { 
            // 显示某功能区
            const ghmcShipName = valArr[(props.selectAreaVal?2:3)];
            targetArea = nonGrainData.filter((v) => v.bCity + '' + v.name == ghmcShipName);
            isGhmc.value=true
          }
          targetArea.sort(compare("rate"));//排序
          chartData.value = targetArea;
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
        initEcharts();
      });
      // areaArr.value = lodash.cloneDeep(countyTotalArea);
      // areaArr.value.map((item) => {
      //   item.value = item.value * 0.0015;
      // });
      // areaArr.value.sort(compare("value"));
      // nextTick(() => {
      //   formatData();
      // });
    });

    return {
      myRef,
      color,
      totalArea,
      chartData,
      areaValue,
      chartsWidth
    };
  },
});
</script>

<style scoped lang="scss">
.chert-wrap {
  position: relative;
  height: 240px;
  margin: 10px 0;
  .data-none{
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
  }
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
