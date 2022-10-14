<template>
  <div class="area-select ">
    <div :class="isRuralBrain? 'city_wrap ruralImg' : 'city_wrap'" >
      {{ selectVal }} 
    </div>
    <!-- <b>{{SelectValNum&&!isRuralBrain?`(${SelectValNum}个粮功区) `:''}}</b> -->
    <img
      class="select-btn"
      :style="{ transform: 'rotate(' + (selectStatus ? -180 : 0) + 'deg)',  }"
      :src="require('./image/arrow_icon.png')"
      alt=""
    />
    <el-cascader
      :append-to-body="false"
      v-model="selectCode"
      :options="areaOptions"
      :props="{ expandTrigger:'hover',label: 'name', value: 'name',checkStrictly:true }"
      @change="onAreaConfirm"
      @visible-change	="onStatusChange"
      ref="cascaderHandleRef"
    >
      <template #default="{ data }">
        <span>{{ data.name }}</span>
        <span v-if="data.value&&!isRuralBrain" > ({{ data.value }}) </span>
      </template>
    </el-cascader>
    <div v-if="selectAreaTime" class="handle-return-btn" :style="{ left: isIndex ? '1377px' : '715px' } " @click="returnlastLevel">
      <img src="https://img.hzanchu.com/acimg/65be1bba8bde8166b8ab188c3e89c0ba.png" alt="" />
      <!-- <span>返回</span> -->
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import defaultDataSrc from '@/assets/js/areaList.json'

export default defineComponent({
  name: 'areaSelect',
  props: {
    selectVal: {
      type: String,
      default: ''
    },
    areaList: {
      type: Object,
      default(v) {
        return defaultDataSrc;
      }
    },
    selectAreaVal: { // 用于区分是否只显示区数据
      type: String,
    }
  },
  setup(props, { emit }) {
    const areaList = computed(()=>props.areaList)
    const selectStatus = ref(false)
    const isRuralBrain = ref(false)
    // const oldSelectVal = ref([{name:'宁波市'}])//记录每次地图改变后的selcetVal
    const selectAreaTime = ref(false) //是否显示返回
    const isIndex = ref(window.location.pathname == '/index') // 是否是乡村大脑
    // const selectMapAreaTime = ref(0) //双击地图的频率
    const selectCode = ref([])
    const areaOptions = ref([])
    const SelectValNum = ref(419)
    const isShowSelectUlBox = ref(false)
    const cascaderHandleRef = ref();//获取层级选择框的dom

    const handleCloseCasader=()=>{//关闭层级选择框
      //每次选中后关闭层级选择框 如果面板没有关闭，则手动关闭
      if (cascaderHandleRef?.value?.popperVisible) {
        cascaderHandleRef?.value?.togglePopperVisible()
      }
    }
    const returnlastLevel = () => {
      const newArr = props.selectVal.split('/')
      newArr.pop()
      onAreaConfirm(newArr)
    }

    const onAreaConfirm = (e) => {
      emit('update:selectVal', e.join('/'))
      const selectArea = e[e.length - 1]
      emit('sendMessage', {
        key: 'changeAreaByName',
        value: { name: selectArea }
      })
      // selectMapAreaTime.value=0 //清空属性
      selectAreaTime.value=false //清空属性
      // oldSelectVal.value=[{name:'宁波市'}] //清空属性
      handleCloseCasader()
    }
    const formarArea = (array) => {
      array.map(item => {
        if (item.children && item.children.length) {
          // if (item.children[0].name !== item.name) { //使用element属性 让各个层级都可选中 所以暂时隐藏可以在第一位展示本级的功能
          //   item.children.unshift({ name: item.name, code: item.code })
          // }
          // 取当前选中地址的最后一个地区和cityList数组里区找他的粮功区↓
          if(item?.value&&item?.name==props.selectVal.split('/').slice('-1')[0]) SelectValNum.value=item?.value
          formarArea(item.children)
        }
      })
    }
    const onStatusChange = (e) => {
      selectStatus.value = e
    }

    watch(() => props.selectVal, val => {
      selectCode.value = val.split('/');
      // 取当前选中地址的最后一个地区和cityList数组里区找他的粮功区↓
      formarArea(areaOptions.value)
      if (val === props.selectAreaVal||val === '宁波市') {//如果地图回到了宁波市不显示返回按钮
        selectAreaTime.value = false
      } else {
        selectAreaTime.value = true
      }
    })
    watch(() => props.areaList, val => {
      areaOptions.value = [val.city]
    })

    //监听地图双击 记录来之前的位置
    const receiveMsg = (e) => {
      let obj = e.data;
      // 双击地图默认选中当前区域
      // if (obj.type === 'gisLayerMessage' && obj?.data?.value?.areaInfo?.TOWN) { //暂时不要限制
      // if (obj.type === 'gisLayerMessage') {
      // }
    }

    onMounted(() => {
      areaOptions.value = [areaList.value.city]
      if (window.location.pathname == '/RuralBrain') isRuralBrain.value = true;
      // window.addEventListener('message', receiveMsg, false); 暂时不要规则更改为返回上一级行政机构
      formarArea(areaOptions.value)
    })
    return {
      areaList,
      areaOptions,
      isRuralBrain,
      onAreaConfirm,
      selectCode,
      onStatusChange,
      selectStatus,
      // oldSelectVal,
      // selectMapAreaTime,
      selectAreaTime,
      SelectValNum,
      isShowSelectUlBox,
      cascaderHandleRef,
      handleCloseCasader,
      returnlastLevel,
      isIndex
    }
  },
})
</script>

<style scoped lang="scss">
.area-select {
  position: relative;
  width: 270px;
  height: 40px;
  .city_wrap {
      height: 40px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 42px;
      background: url("./image/area_select_bg.png") no-repeat;
      background-size: 100% 100%;
      font-size: 16px;
      text-indent: 20px;
      box-sizing: border-box;
      padding-right: 60px;
      b{
        font-family: Microsoft YaHei-Regular;
        color: rgba(255, 255, 255,0.6);
        font-size: 18px;
      }
    }
    .ruralImg{
      background: url("https://img.hzanchu.com/acimg/8409b80ff20f3a86dbbb08137f747ec7.png") no-repeat;
      background-size: 100% 100%;
    }
  .select-btn {
    position: absolute;
    right: 20px;
    top: 14px;
    transition: all .3s;
    width: 24px;
    height: 12px;
  }
  :deep(.el-cascader) {
    opacity: 0;
    position: absolute;
    width: 100%;
    height: 40px;
    top: 0;
    left: 0;
    .el-input {
      height: 100%;
      .el-input__inner {
        height: 100%;
      }
    }
  }
  .handle-return-btn{
    width: 90px;
    height: 68px;
    color: #fff;
    position: absolute;
    // padding: 0 10px;
    text-align: right;
    display: flex;
    flex-direction:column-reverse;
    left: 715px;
    line-height: 40px;
    top: 0px;
    font-family: Microsoft YaHei-Regular;
    // background: url("../image/return-btn-background.png") ;
    // background-size: 100%;
    span{
      margin-right:16px ;
      font-family: Microsoft YaHei-Regular;
    }
    img{
      transition: all .3s;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
