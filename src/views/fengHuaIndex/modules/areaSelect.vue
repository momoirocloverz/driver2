<template>
  <div class="area-select ">
    <div class="city_wrap">
      {{ selectVal }} <b>{{SelectValNum?`(${SelectValNum}个粮功区) `:''}}</b>
    </div>
    <img
      :style="{ transform: 'rotate(' + (selectStatus ? -180 : 0) + 'deg)',  }"
      :src="require('../image/arrow_icon.png')"
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
        <span v-if="data.value" > ({{ data.value }}) </span>
      </template>
    </el-cascader>
    <div v-if="selectAreaTime" class="handle-return-btn" @click="returnlastLevel">
      <img :src="require('../image/return-btn.png')" alt="" />
      <span>返回</span>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from 'vue'
import areaList from '@/assets/js/fengHuaAreaList.json'

export default defineComponent({
  name: 'areaSelect',
  props: {
    selectVal: {
      type: String,
      default: ''
    },
  },
  setup(props, { emit }) {
    const selectStatus = ref(false)
    // const oldSelectVal = ref([{name:'宁波市'}])//记录每次地图改变后的selcetVal
    const selectAreaTime = ref(false) //是否显示返回
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
      if (val === '奉化区') {//如果地图回到了宁波市不显示返回按钮
        selectAreaTime.value = false
      } else {
        selectAreaTime.value = true
      }
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
      areaOptions.value = [areaList.city]
      // window.addEventListener('message', receiveMsg, false); 暂时不要规则更改为返回上一级行政机构
      formarArea(areaOptions.value)
      onAreaConfirm(['奉化区'])
    })
    return {
      areaList,
      areaOptions,
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
      returnlastLevel
    }
  },
})
</script>

<style scoped lang="scss">
.area-select {
  position: relative;
  width: 274px;
  height: 40px;
  .city_wrap {
    height: 40px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 42px;
    background: url("../image/area_select_bg.png") no-repeat;
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
  img {
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
    width: 92px;
    height: 40px;
    color: #fff;
    position: absolute;
    // padding: 0 10px;
    text-align: right;
    display: flex;
    flex-direction:column-reverse;
    left: -15px;
    line-height: 40px;
    top: -43px;
    font-family: Microsoft YaHei-Regular;
    // background: url("../image/return-btn-background.png") ;
    // background-size: 100%;
    span{
      margin-right:16px ;
      font-family: Microsoft YaHei-Regular;
    }
    img{
      position: absolute;
      left: 16px;
      top: 10px;
      transition: all .3s;
      width: 20px;
      height: 20px;
    }
  }
}
</style>
