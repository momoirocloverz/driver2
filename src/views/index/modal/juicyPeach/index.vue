<template>
  <div class="juicy-peach">
    <module-title title="种植分布" position="right" />
        <div class="juicy-peach-all-box">
      <div class="juicy-peach-value-box">
        <div class="_num">
          <div class="_title">种植主体</div>
          <div class="_main">
            <span class="_value">{{ taoshuTitleData?.cropnum || 0 }}</span>
            <span class="_unit">户</span>
          </div>
        </div>
      </div>
      <div class="juicy-peach-value-box" style="margin-right:0px">
        <div class="_num">
          <div class="_title">平均树龄</div>
          <div class="_main">
            <span class="_value">{{ taoshuTitleData?.averyear || 0 }}</span>
            <span class="_unit">年</span>
          </div>
        </div>
      </div>
    </div>
     <template v-if="level == '' || level == 'town'">
      <div class="_left1-total">
        种植总面积 <span>{{ total }}</span>
        <span>{{ level == '' ? '万亩' : '亩' }}</span>
      </div>
      <div v-if="echartsData.length > 0" class="_chart">
        <div ref="echartRef" class="_chart-chart" />
      </div>
      <list-empty v-else custom-style="height: 200px;" />
    </template>
    <div class="area-list">
      <div class="item mode-title">
        <p>编号</p>
        <p>品种</p>
        <p>面积（亩）</p>
        <p>平均树龄（年）</p>
      </div>
      <div class="item-wrap">
        <div class="item" v-for="(row,index) in taoshuTableList" :key="index">
          <p>{{ index+1 }}</p>
          <p>{{ row.other }}</p>
          <p>{{ row.area }}</p>
          <p style="width:30%">{{ row.averyear }}</p>
        </div>
      </div>
    </div>
  </div>  
</template>
<script setup>
import { ref, onMounted , watch } from 'vue'
import { xzzzmj, czzmj } from '@/assets/js/data1.js';
import { taoshu_props , taoshu_props_crop } from '@/assets/js/props.js';
import * as echarts from 'echarts';
import moduleTitle from '@/components/moduleTitle';
import ListEmpty from '@/components/listEmpty.vue';
const props = defineProps({
  selectVal: {
    type:String
  }
})
const allJuicyTableData=[ // 奉化区水蜜桃图表数据
{"other":"其它","Statistic_Count":"39","cropnum_Sum":"464","area":"691.8","averyear":"7.38"},
{"other":"其它中熟品种","Statistic_Count":"6","cropnum_Sum":"26","area":"33","averyear":"6.17"},
{"other":"其它早熟品种","Statistic_Count":"4","cropnum_Sum":"38","area":"89.6","averyear":"7.92"},
{"other":"其它晚熟品种","Statistic_Count":"8","cropnum_Sum":"62","area":"113.2","averyear":"8.29"},
{"other":"新玉","Statistic_Count":"18","cropnum_Sum":"68","area":"159.2","averyear":"8.36"},
{"other":"早凤凰","Statistic_Count":"12","cropnum_Sum":"62","area":"86.5","averyear":"9.54"},
{"other":"湖景蜜露","Statistic_Count":"94","cropnum_Sum":"10298","area":"21589.56","averyear":"7.85"},
{"other":"玉露","Statistic_Count":"76","cropnum_Sum":"2034","area":"3681.14","averyear":"8.4"},
{"other":"白丽","Statistic_Count":"46","cropnum_Sum":"408","area":"892.22","averyear":"8.27"},
{"other":"白凤","Statistic_Count":"36","cropnum_Sum":"318","area":"510.3","averyear":"9.22"},
{"other":"良方","Statistic_Count":"95","cropnum_Sum":"4126","area":"9849.38","averyear":"7.69"},
{"other":"蟠桃","Statistic_Count":"2","cropnum_Sum":"16","area":"389.2","averyear":"3.5"},
{"other":"赤月","Statistic_Count":"26","cropnum_Sum":"224","area":"440.7","averyear":"7.48"},
{"other":"锦绣黄桃","Statistic_Count":"2","cropnum_Sum":"2","area":"18.6","averyear":"5"},
{"other":"雨花露","Statistic_Count":"15","cropnum_Sum":"46","area":"59.4","averyear":"9"}
]
const level = ref('')
const chartInstance = ref(null)
const echartsData = ref([]) // echarts数据
const echartRef = ref(null)
const total = ref(0) // 种植总面积
const start = ref(0) 
const end = ref(4) 
const timers = ref(null)
const roomTimers = ref(null)
const pos = ref(0);
const taoshuTitleData = ref([]); // 桃树头部数据展示
const taoshuTableList = ref([]); // 桃树列表数据展示
const reload = (level,selectAddress) => { 
      const list = [];
      let totals = 0;
      // 如果是请求的镇
      if (!level) {
        for (let item of xzzzmj) {
          list.push({
            text: item.town,
            value: item.area * 2,
          });
          totals += parseFloat(item.area * 2);
        }
        echartsData.value = list;
        setTimeout(() => {
          initChart(list);
        }, 0);
      } else if (level  == 'town') {
        for (const item of czzmj) {
          if (item.town == selectAddress) {
            list.push({
              text: item.village,
              value: item.area * 2,
            });
            totals += parseFloat(item.area * 2);
          }
        }
        echartsData.value  = list;
        setTimeout(() => {
          initChart(list);
        }, 0);
      } else if (level == 'village') {
        for (const item of czzmj) {
          if (item.village == selectAddress) {
            totals += parseFloat(item.area * 2);
          }
        }
      }
      if (!level) {
        total.value =  parseFloat(totals / 10000).toFixed(2)
      } else {
        total.value = parseFloat(totals).toFixed(2);
      }
}
const init = (name) => { //初始化数据数据
  if (name == '奉化区') { // 奉化区没有数据 需求总和
    let newAveryear = 0;
    let newCropnum = 0;
    let newArea = 0;
    let num = 0;
    for (const key in taoshu_props) {
       newAveryear += taoshu_props[key].averyear;
      newCropnum += taoshu_props[key].cropnum;
      newArea += taoshu_props[key].area;
      num++;
    }
     taoshuTitleData.value = { "cropnum": newCropnum, "area": newArea, "averyear": (newAveryear/num).toFixed(2), "name": "奉化区" };
  } else { 
    taoshuTitleData.value = taoshu_props[name];
  }
  let res_crop_arr = []
  if (name == '奉化区') {
    res_crop_arr = allJuicyTableData;
  } else { 
    taoshu_props_crop.forEach((e) => {
    if (e['name'] === name) res_crop_arr.push(e);
    });
  }
  res_crop_arr.sort(function (a, b) { return b.area - a.area });
  taoshuTableList.value = res_crop_arr;
}

const  initChart = (list) => {
      const data1 = [];
      const dataX = [];
      for (const index in list) {
        data1.push({
          name: list[index].text,
          value: list[index].value,
        }); 
        dataX.push(list[index].text);
      }
      const chart = echarts.init(echartRef.value);
      const option = {
        color: ['#00BAFE'],
        legend: {
          show: false,
          top: '5%',
          right: '5%',
          bottom:'10%',
          // icon: "rect",
          textStyle: {
            color: '#fff',
          },
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          borderColor: '#278BFF',
          borderWidth: 1,
          backgroundColor: '#07266C',
          formatter: function (params) {
            return (
              "<div style='width: 100%; font-size: 14px;font-weight: bold;color: #fff;'>" +
              params[0].name +
              '</div>' +
              "<div style='width: 100%;margin-top: vh(6);font-size: 12px;color: #6CD0FF'>种植面积：" +
              "<span style='margin-left: 8px;font-size: 14px;color: #FFFFFF;'> " +
              params[0].value +
              '亩</span>' +
              '</div>'
            );
          },
        },
        xAxis: {
          type: 'category',
          data: dataX,
          nameRotate: 45,
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.14)',
              type: 'dashed',
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#90B6D2',
            rotate: 45,
          },
        },
        yAxis: [
          {
            type: 'value',
            name: '亩',
            nameLocation: 'end',
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: 'rgba(255, 255, 255, 0.14)',
              },
            },
            splitNumber: 5,
            axisLabel: {
              color: '#90B6D2',
              fontSize: 12,
            },
            nameTextStyle: {
              color: '#90B6D2',
              fontSize: 12,
            },
          },
        ],
        dataZoom: {
          type: 'inside',
          startValue: start.value,
          endValue: end.value,
        },
        grid: {
          top: '18%',
          left: '3%',
          right: '3%',
          bottom: '10%',
          containLabel: true,
        },
        series: [
          {
            name: '产量',
            data: data1,
            barWidth: '20px',
            type: 'bar',
            itemStyle: {
							normal: {
								label: {
									show: true, //开启显示
									position: 'top', //在上方显示
									textStyle: { //数值样式
										color: '#fff',
										fontSize: 16
									}
								}
							}
						}
          },
        ],
      };
      chart.setOption(option);
      chartInstance.value = chart;
      // initTimer()
      initZoomTimer();
}

onMounted(() => { 
  reload()
  init('奉化区')
  window.addEventListener('resize', resizeHandler);
})
const resizeHandler =()=> { // echarts自适应
  chartInstance.value?.resize();
}
// 自动滚动
const initTimer= ()=> {
      if (timers.value) {
        clearInterval(timers.value);
      }
      timers.value = setInterval(() => {
        if (pos.value > 0) {
          chartInstance.value.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            dataIndex: pos.value - 1,
          });
        } else {
          chartInstance.value.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            dataIndex: echartsData.value.length - 1,
          });
        }
        chartInstance.value.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: pos.value,
        });
        // tooltip 跟随显示
        chartInstance.value.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: pos.value,
        });
        pos.value++;

        if (pos.value > echartsData.value.length - 1) {
          pos.value = 0;
        }
      }, 2000);
}
//  开启柱状图滚动展示
const initZoomTimer = () => {
      if (roomTimers.value) {
        clearInterval(roomTimers.value);
      }

      roomTimers.value = setInterval(() => {
        ++start.value;
        ++end.value;

        if (start.value > echartsData.value.length - 4) {
          start.value = 0;
          end.value = 4;
        }
        setTimeout(() => {
          chartInstance.value.setOption({
            dataZoom: {
              type: 'inside',
              startValue: start.value,
              endValue: end.value,
            },
          });
        }, 0);
      }, 2000);
}
watch(() => props.selectVal, (val) => { 
  const selectAddress = val.split('/')[val.split('/').length - 1]; // 当前选中层级
  if (val.split('/').length == 3) { // 只支持镇基本筛选
    init(selectAddress)
  } else { 
    init('奉化区')
  }
  reload(val.split('/').length == 3?'town':val.split('/').length == 4?'village':'',(selectAddress||'奉化区'))
})
</script>
<style scoped lang="scss">
.juicy-peach{
  ._left1-total {
    width: 100%;
    // margin-top: 26px;
    margin-bottom: 12px;
    padding-right: 30px;
    // text-align: right;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    font-size: 16px;
    color: #cceaff;
    span:nth-of-type(1) {
      margin-left: 10px;
      margin-right: 4px;
      font-size: 24px;
      font-family: PangMenZhengDao-Regular, PangMenZhengDao;
      font-weight: 400;
      color: #27e0fd;
    }
    span:nth-of-type(2) {
      font-size: 14px;
      font-weight: normal;
      color: #90b6d2;
    }
  }

  ._chart {
    position: relative;
    width: 100%;
    height: 200px;
    margin-top: -40px;

    ._chart-chart {
      width: 92%;
      height: 215px;
      // margin-top: 20px;
      margin-bottom: 20px;
      margin-left: 3%;
    }
  }
  .juicy-peach-all-box{
    margin-top: 20px;
    margin-bottom: 24px;
    display: flex;
    flex-wrap:wrap;
    .juicy-peach-value-box{
      width: 119px;
      height: 82px;
      padding-left: 24px;
      padding-top: 18px;
      margin-right: 12px;
      // margin-bottom: 12px;
      background: url('https://img.hzanchu.com/acimg/217a63d729578c73be80fb49addd6845.png') no-repeat;
      background-size: 100% 100%;
      ._num{
        ._title{
          font-size: 14px;
          font-family: MicrosoftYaHei-, MicrosoftYaHei;
          font-weight: normal;
          color: #00DEFF;
          margin-bottom: 13px;
        }
        ._value{
          font-size: 24px;
          font-family: DIN Alternate-Bold, DIN Alternate;
          font-weight: bold;
          color: #FFFFFF;
          margin-right: 5px;
        }
        ._unit{
          font-size: 12px;
          font-family: MicrosoftYaHei-, MicrosoftYaHei;
          font-weight: normal;
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }
  }
  .area-list {
    .item {
      display: flex;
      height: 32px;
      line-height: 32px;
      p {
        font-size: 14px;
        white-space: nowrap;
        &:nth-of-type(2) {
          flex: 1;
        }
        &:nth-of-type(1) {
          text-indent: 12px;
        }
        &:nth-of-type(1) {
         width: 17%;
        }
        &:nth-of-type(3){
        width: 22%;
        }
       // , &:nth-of-type(2) 
      }
    }
    .item-wrap {
      overflow: auto;
      height: 450px;
      .item:nth-of-type(2n) {
        background: rgba(23, 151, 255, .1);
      }
    }
    .mode-title {
      background: rgba(23, 151, 255, .4);
    }
  }
}
</style>
