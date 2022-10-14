<template>
  <div class="non-agricultural">

    <div class="flh-area" v-show="selectVal.split('/').length < 4">
      <div class="item">
        <h5>非粮化图斑</h5>
        <div>
<!--          <p>{{ isThousandTotal ? (cleanList?.compensateVal * .0015 / 10000).toFixed(2) : (cleanList?.compensateVal * .0015).toFixed(2) }}</p>-->
<!--          <p>{{ isThousandTotal ? '万亩' : '亩' }}</p>-->
          <p>{{ flhArea?.area || '--' }}</p>
          <!-- <p>{{ +flhArea.area === 21.74 ? '万亩' : '亩' }}</p> -->
          <p>{{ isThousandTotal ? '(万亩)' : '(亩)' }}</p>
        </div>
      </div>
      <div class="item">
        <h5>非粮化占比</h5>
        <div>
          <p>{{ flhArea?.rate || '--'}}</p>
          <p>%</p>
        </div>
      </div>
    </div>

    <div class="other-area" v-if="cleanList?.isShow">
      <div class="item">
        <h5>优化补入</h5>
        <div>
          <p>{{ isThousandTotal ? (cleanList?.compensateVal * .0015 / 10000).toFixed(2) : (cleanList?.compensateVal * .0015).toFixed(2) }}</p>
          <p>{{ isThousandTotal ? '面积 (万亩)' : '面积 (亩)' }}</p>
        </div>
      </div>
      <div class="item">
        <h5>清理腾退</h5>
        <div>
          <p>{{ isThousandTotal ? (cleanList?.cleanVal / 10000).toFixed(2) : (cleanList?.cleanVal).toFixed(2) }}</p>
          <p>{{ isThousandTotal ? '面积 (万亩)' : '面积 (亩)' }}</p>
        </div>
      </div>
    </div>

    <div class="title">
      <p>面积统计</p>
      <img :src="require('../image/line_bg.png')" alt="" />
      <div class="title-tab">
        <div :class="`tab ${state.defaultIndex === 0 && 'tab-active'}`" @click="changeActive(0)">农业用地</div>
        <div :class="`tab ${state.defaultIndex === 1 && 'tab-active'}`" @click="changeActive(1)">非农业用地</div>
      </div>
    </div>

    <div class="chart-wrap">
      <!--      农业用地-->
      <!-- v-show="state.defaultIndex===0" 原图表功能要求隐藏 怕后续有调整先注释 -->
      <div class="chart" ref="myRefFarm" v-show="false"></div>
      <!--      非农业用地-->
      <!-- v-show="state.defaultIndex===1" 原图表功能要求隐藏 怕后续有调整先注释 -->
      <div class="chart" ref="myRef" v-show="false"></div>
    </div>
    <div class="area-list">
      <div class="item mode-title">
        <p>地类</p>
        <p>{{ isThousandTotal ? '面积（万亩）' : '面积（亩）' }}</p>
        <p>占比（%）</p>
      </div>
      <div class="item-wrap">
        <div class="item" v-for="row in state.defaultIndex === 0 ? typeListFarm : typeList">
          <p>{{ row.name }}</p>
          <p>{{ isThousandTotal ? (row.value / 10000).toFixed(2) : row.value }}</p>
          <p>{{ totalAreaFarm ? Math.round(row.value / totalAreaFarm * 100 * 100) / 100 : 0 }}</p>
        </div>
      </div>
    </div>

    <!--    <div class="area-list" v-show="state.defaultIndex === 1">-->
    <!-- <div
      class="item"
      v-for="(item, index) in typeList"
      :key="item.id"
      :style="{ backgroundImage: 'url(' + require('./../image/type_index_bg_' + (index + 1) + '.png') + ')' }"
    >
      <img :src="require('./../image/type_index_' + (index + 1) + '.png')" alt="" />
      <p>{{ item.name.indexOf('其他')>-1?'其他':item.name }}</p>
      <p>{{ totalArea ?  Math.round(item.value / totalArea * 100*100)/100 : 0 }}%</p>
    </div> -->
    <!--    </div>-->
    <!--    <div class="area-list-farm" v-show="state.defaultIndex=== 0">-->
    <!-- <div
      class="item-farm"
      v-for="(item) in typeListFarm"
      :key="item.id"
    >
      <div :style="{ backgroundColor: item.color }"></div>
      <p>{{ item.name.indexOf('其他')>-1?'其他':item.name }}</p>
      <p>{{ totalAreaFarm ? Math.round(item.value / totalAreaFarm * 100 *100)/100 : 0 }}%</p>
    </div> -->
    <!--    </div>-->
    <!--    <div class="tips" v-show="state.defaultIndex === 1">*图中分类为非农业用地占比最高的6类</div>-->
  </div>
</template>

<script>
import { defineComponent, inject, nextTick, onBeforeUnmount, computed, onMounted, reactive, ref, watch } from 'vue'
import * as echarts from "echarts";
import { compare } from "@/views/index/modal/const";

export default defineComponent({
  props: {
    cleanList: {
      type: Object,
      default: () => {
        return {}
      }
    },
    flhArea: {
      type: Object,
      default: () => {
        return {}
      }
    },
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
    const state = reactive({
      defaultIndex: 0
    });
    const typeList = ref([
      {
        id: 1,
        name: "农村道路",
        percent: 0,
        value: 0,
        color: "#26B4FD"
      },
      {
        id: 2,
        name: "公路用地",
        percent: 0,
        value: 0,
        color: "#9389FC"
      },
      {
        id: 3,
        name: "工业用地",
        percent: 0,
        value: 0,
        color: "#FD9C48"
      },
      {
        id: 4,
        name: "河流水面",
        percent: 0,
        value: 0,
        color: "#22D0D0"
      },
      {
        id: 5,
        name: "农村宅基地",
        percent: 0,
        value: 0,
        color: "#C3BB13"
      },
      {
        id: 6,
        name: "其他",
        percent: 0,
        value: 0,
        color: "#FD642C"
      }
    ]);
    const typeListFarm = ref([
      {
        id: 1,
        name: "耕地",
        percent: 0,
        value: 0,
        color: "#26B4FD"
      },
      {
        id: 2,
        name: "园地",
        percent: 0,
        value: 0,
        color: "#9389FC"
      },
      {
        id: 3,
        name: "林地",
        percent: 0,
        value: 0,
        color: "#FD9C48"
      },
      {
        id: 4,
        name: "其他",
        percent: 0,
        value: 0,
        color: "#22D0D0"
      }
    ]);
    const myRef = ref(null);
    const myRefFarm = ref(null);
    const unit = inject("unit");
    const totalArea = ref(0);
    const totalAreaFarm = ref(0);
    const isThousandTotal = ref(true);//当前选择区域是否是市（第一级）并且是宁波市

    let interval = null;
    let myEcharts = null;
    const changeActive = (val) => {
      state.defaultIndex = val;
      clearInterval(interval);
      if (val === 1) {
        // initEcharts();
      } else {
        // initFarmEcharts()
      }
    };
    //自定义斑马纹样式
    const farmTableRowClassName =({ row, rowIndex }) =>{
      if ((rowIndex + 1) % 2 === 0) {
        return "farm-warning-row"; //类名
      } else {
        return "farm-success-row"; //类名
      }
    };
    /*const initEcharts = () => {
      myEcharts = null;
      myEcharts = echarts.init(myRef.value);
      myEcharts.setOption({
        tooltip: {
          show: false,
          trigger: "item"
        },
        legend: {
          show: false // 取消点击事件
        },
        color: ["#26B4FD", "#9389FC", "#FD9C48", "#22D0D0", "#C3BB13", "#FD642C"],
        grid: {
          left: "0%",
          right: "0%",
          bottom: "0%",
          top: "0%",
          containLabel: true
        },
        series: [
          {
            type: "pie",
            avoidLabelOverlap: true,
            center: ["50%", "50%"],
            radius: ["55%", "73%"],
            label: {
              show: false,
              position: "center",
              lineHeight: 28 * unit.value,
              formatter: [
                "{title|{b}}",
                "{bule|{c}}{default|亩}",
                "{bule|{d}}{default|%}"
              ].join("\n"),
              rich: {
                title: {
                  color: "#fff",
                  fontSize: 16 * unit.value
                },
                bule: {
                  color: "#26E3FF",
                  fontSize: 20 * unit.value,
                  fontFamily: "PangMenZhengDao",
                  padding: [0, 4, 0, 0],
                  textShadowBlur: 8,
                  textShadowOffsetX: 0,
                  textShadowOffsetY: 0,
                  textShadowColor: "rgba(43, 228, 255, 0.3)"
                },
                default: {
                  fontSize: 14 * unit.value,
                  color: "#fff"
                }
              }
            },
            emphasis: {
              blurScope: "coordinateSystem",
              label: {
                show: true,
                fontSize: 14 * unit.value,
                fontWeight: "bold"
              }
            },
            data: typeList.value
          }
        ]
      });
      myEcharts.on("mouseover", (a) => {
        clearInterval(interval);
        myEcharts.dispatchAction({
          type: "downplay"
        });
        myEcharts.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: a.dataIndex
        });
      });
      myEcharts.on("mouseout", () => {
        myEcharts.dispatchAction({
          type: "downplay"
        });
        startInterval(3000);
      });
      myEcharts.dispatchAction({
        type: "downplay",
      });
      myEcharts.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: 0
      });
      startInterval(3000);
    };
    const startInterval = (delay) => {
      interval && clearInterval(interval);
      let currentIndex = -1;
      interval = setInterval(() => {
        let dataLen = (state.defaultIndex === 0 ? typeListFarm.value.length : typeList.value.length);
        // 取消之前高亮的图形
        myEcharts.dispatchAction({
          type: "downplay",
          seriesIndex: 0,
          dataIndex: currentIndex
        });
        currentIndex = (currentIndex + 1) % dataLen;
        // 高亮当前图形
        myEcharts.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: currentIndex
        });
      }, delay);
    };*/

    // 农业用地
   /* const initFarmEcharts = () => {
      myEcharts = null;
      myEcharts = echarts.init(myRefFarm.value);
      myEcharts.setOption({
        tooltip: {
          show: false,
          trigger: "item"
        },
        legend: {
          show: false // 取消点击事件
        },
        color: ["#26B4FD", "#9389FC", "#FD9C48", "#22D0D0"],
        grid: {
          left: "0%",
          right: "0%",
          bottom: "0%",
          top: "0%",
          containLabel: true
        },
        series: [
          {
            type: "pie",
            avoidLabelOverlap: true,
            center: ["50%", "50%"],
            radius: ["55%", "73%"],
            label: {
              show: false,
              position: "center",
              lineHeight: 28 * unit.value,
              formatter: [
                "{title|{b}}",
                "{bule|{c}}{default|亩}",
                "{bule|{d}}{default|%}"
              ].join("\n"),
              rich: {
                title: {
                  color: "#fff",
                  fontSize: 16 * unit.value
                },
                bule: {
                  color: "#26E3FF",
                  fontSize: 20 * unit.value,
                  fontFamily: "PangMenZhengDao",
                  padding: [0, 4, 0, 0],
                  textShadowBlur: 8,
                  textShadowOffsetX: 0,
                  textShadowOffsetY: 0,
                  textShadowColor: "rgba(43, 228, 255, 0.3)"
                },
                default: {
                  fontSize: 14 * unit.value,
                  color: "#fff"
                }
              }
            },
            emphasis: {
              blurScope: "coordinateSystem",
              label: {
                show: true,
                fontSize: 14 * unit.value,
                fontWeight: "bold"
              }
            },
            data: typeListFarm.value
          }
        ]
      });
      myEcharts.on("mouseover", (a) => {
        clearInterval(interval);
        myEcharts.dispatchAction({
          type: "downplay"
        });
        myEcharts.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: a.dataIndex
        });
      });
      myEcharts.on("mouseout", () => {
        myEcharts.dispatchAction({
          type: "downplay"
        });
        startInterval(3000);
      });
      // 取消之前高亮的图形
      myEcharts.dispatchAction({
        type: "downplay",
      });
      myEcharts.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: 0
      });
      startInterval(3000);
    };*/

    watch(()=> props.areaListFarm,(val)=>{
      if (!val.length && myEcharts) return;
      totalAreaFarm.value = 0;
      val.map(item => {
        // 农业用地
        typeListFarm.value.map(key => {
          let name =  key.name
          if(name === '其他'){
            name = '其他(农业用地)'
          }
          if (item.name === name ) {
            key.value = Math.round(item.value * .0015 * 100) / 100;
            totalAreaFarm.value += +key.value;
          }
        });
      });
      typeListFarm.value.sort(compare("value"));
     /* if (myEcharts) {
        myEcharts.dispose();
        initFarmEcharts();
      }*/
    }, { deep: true, immediate: true })
    watch(() => props.areaList, val => {
      if (!val.length && myEcharts) return;
      totalArea.value = 0;
      val.map(item => {
        // 非农业用地
        typeList.value.map(key => {
          let name =  key.name
          if(name === '其他'){
            name = '其他(非农业用地)'
          }
          if (item.name === name) {
            key.value = Math.round(item.value * .0015 * 100) / 100;
            totalArea.value += +key.value;
          }
        });
      });
      typeList.value.sort(compare('value'));
      // if (myEcharts) {
      //   myEcharts.dispose();
      //   nextTick(() => {
      //     initEcharts();
      //   })
      // }
    }, { deep: true, immediate: true });
    /*watch(() => unit.value, () => {
      setTimeout(() => {
        if (myEcharts) myEcharts.dispose();
        state.defaultIndex === 0 ? initFarmEcharts() : initEcharts();
      }, 1000);
    });*/
    watch(() => props.selectVal, (val) => {//监听选择地域变化
      const selectValArr=val.split('/')
      //当前选择地区是市（第一级）并且是宁波市
      isThousandTotal.value=Array.isArray(selectValArr)&&selectValArr.length==1&&selectValArr[0]=='宁波市'//直接拿地域中文名判断后期可能出现变动后面试着更改一下
    })
   /* onMounted(() => {
      if (state.defaultIndex === 0) { // 农业用地
        initFarmEcharts();
      } else {
        initEcharts();
      }
    });
    onBeforeUnmount(() => {
      interval && clearInterval(interval);
    });*/
    return {
      changeActive,
      state,
      typeList,
      typeListFarm, // 农业用地
      myRef,
      myRefFarm,
      totalAreaFarm,
      totalArea,
      farmTableRowClassName,
      isThousandTotal,
    };
  }
});
</script>

<style scoped lang="scss">
.non-agricultural {
  .title {
    display: flex;
    flex-direction: column;
    position: relative;
    margin-top: 24px;
    .title-tab {
      position: absolute;
      width: 200px;
      display: flex;
      justify-content: space-between;
      height: 30px;
      right: 0;
      bottom: 0;

      div {
        color: rgba(255, 255, 255, 0.6);
        background-image: url("../../../assets/image/tab_bg.png");
        background-size: 100% 100%;
        width: 100px;
        text-align: center;
        line-height: 30px;
        font-size: 16px;
        cursor: pointer;
      }

      .tab-active {
        background-image: url("../../../assets/image/tab_bg_active.png");
        background-size: 100% 100%;
        color: rgba(255, 255, 255, 1);
      }
    }

    p {
      font-size: 18px;
      height: 24px;
      line-height: 24px;
      margin-bottom: 2px;
    }

    img {
      height: 2px;
      width: 100%;
    }
  }

  .chart-wrap {
    display: flex;
    justify-content: center;
    width: 100%;
    // height: 45px;
    .chart {
      width: 240px;
      height: 240px;
    }
  }

  .area-list {
    margin: 16px 0;
    .item {
      display: flex;
      height: 32px;
      line-height: 32px;
      p {
        font-size: 14px;
        white-space: nowrap;
        &:nth-of-type(3) {
          flex: 1;
        }
        &:nth-of-type(1) {
          text-indent: 12px;
        }
        &:nth-of-type(1), &:nth-of-type(2) {
          width: 40%;
        }
      }
    }
    .item-wrap {
      overflow: auto;
      height: 150px;
      .item:nth-of-type(2n) {
        background: rgba(23, 151, 255, .1);
      }
    }
    .mode-title {
      background: rgba(23, 151, 255, .4);
    }
  }

  .flh-area {
    display: flex;
    background: url("../image/right_area_bg.png") no-repeat;
    background-size: 100% 100%;
    width: 298px;
    height: 74px;
    .item {
      flex: 1;
      display: flex;
      justify-content: center;
      flex-direction: column;
      padding: 0 0 0 32px;
      div {
        display: flex;
        align-items: flex-end;
        margin-top: 8px;
        height: 26px;
        p {
          font-size: 14px;
          &:nth-of-type(1) {
            color: #27E0FD;
            font-family: PangMenZhengDao;
            font-size: 22px;
          }
        }
      }
    }
  }
  .other-area {
    margin-top: 14px;
    .item {
      width: 298px;
      height: 56px;
      background: url("../image/right_area_bg.png") no-repeat;
      background-size: 100% 100%;
      box-sizing: border-box;
      padding: 0 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &:nth-of-type(1) {
        margin-bottom: 14px;
      }
      div {
        p {
          font-size: 14px;
          &:nth-of-type(1) {
            color: #27E0FD;
            font-family: PangMenZhengDao;
            font-size: 20px;
            padding-bottom: 8px;
          }
        }
      }
    }
  }
}
</style>
