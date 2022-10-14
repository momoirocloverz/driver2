<template>
  <div class="search-popup">
    <div class="search-popup-form">
        <el-form :model="form" label-width="170px" label-height="42px">
            <el-form-item label="粮功区名称：">
                <el-input placeholder="请输入粮功区名称" class="input-con" v-model="form.name" />
            </el-form-item>
            <el-form-item label="粮功区面积：" :inline="true">
                <div class="number-area">
                    <div style="position:relative;width: 100%;"><el-input  type="number"  placeholder="请输入粮功区面积下限"  class="input-con number-area-input" v-model="form.numberAreaStart" /><div class="number-area-icon">亩</div></div>
                        <span>~</span>
                    <div style="position:relative;width: 100%;"><el-input  type="number"  placeholder="请输入粮功区面积上限" class="input-con number-area-input" v-model="form.numberAreaEnd" /><div class="number-area-icon">亩</div></div>
                </div>
            </el-form-item>
            <el-form-item label="粮功区所在区域：" :inline="true" class="address-checked">
                <el-cascader
                    :append-to-body="false"
                    v-model="form.selectCode"
                    :options="areaOptions"
                    :props="{ expandTrigger:'hover',label: 'name', value: 'name',checkStrictly:true }"
                    @change="onAreaConfirm"
                    class="input-con"
                    @visible-change	="onStatusChange"
                    ref="cascaderHandleRef"
                >
                    <template #default="{ data }">
                        <span>{{ data.name }}</span>
                        <span v-if="data.value" > ({{ data.value }}) </span>
                    </template>
                </el-cascader>
                <img
                    :style="{ transform: 'rotate(' + (selectStatus ? -180 : 0) + 'deg)',marginLeft:'auto'  }"
                    :src="require('./img/arrow_icon.png')"
                    alt=""
                />
            </el-form-item>
            <el-form-item label="" >
                <el-button class="reset-btn" @click="onReset">重置</el-button>
                <el-button class="submit-btn" type="primary" @click="onSubmit">搜索</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="search-popup-table">
        <div v-if="showDataList.length==0&&isSearchDone" class="content-null-box">暂无查询数据！</div>
        <div v-if="showDataList.length>0&&isSearchDone" class="table-title">个数总计：<b>{{(tableDataList.length||0)}}</b>个<span>面积总计<b>{{(areaInfo||0)}}</b>亩</span></div>
        <el-table v-if="showDataList.length>0&&isSearchDone" :data="showDataList" style="width: 100%">
            <el-table-column label="所在地区" >
             <template #default="scope">
                    <div style="display: flex; align-items: center">
                        {{(scope?.row?.COUNTY+scope?.row?.TOWN||'-')}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="粮功区名称" >
                <template #default="scope">
                    <el-tooltip
                        popper-class="search-tooltip"
                        :content="(scope?.row?.GHMC||'-')"
                        placement="top-start"
                    >
                        <span class="box-item">{{(scope?.row?.GHMC||'-')}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="粮功区面积(亩)" >
                <template #default="scope">
                    <div style="text-align: center;">
                        {{(Number(scope?.row?.AREA) ||0).toFixed(2)}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="地图查看" >
             <template #default="scope">
                    <div style="text-align: left;">
                        <img @click="()=>goMapDetail(scope?.row?.COUNTY,scope?.row?.TOWN,scope?.row?.GHMC)" :src="require('./img/tip_icon.png')" style="width: 32px;height: 32px;" alt="">
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-box" v-if="tableDataList.length>=5&&isSearchDone">
            <span>共{{tableDataList.length}}条</span>
            <el-pagination small :default-page-size="5" v-model:current-page="currentPage" @current-change="pageChange" background layout="prev, pager, next" :total="tableDataList.length" />
         </div>
    </div>
  </div>
</template>

<script setup>
import areaList from '@/assets/js/areaList.json'
import tableData from '@/assets/js/searchRibbon.json'
import { defineEmits, ref,reactive,onMounted  } from 'vue'
const form = reactive({
  name: '',
  numberAreaStart: '',
  numberAreaEnd: '',
  selectCode: '',
})
const emit = defineEmits({
  setSelectVal: null,
});
const selectStatus = ref(false)
const isSearchDone = ref(false)
const areaOptions = ref([])
const tableDataList = ref([])
const showDataList = ref([])
const areaInfo = ref(0)
const currentPage = ref(1)
const cascaderHandleRef = ref();//获取层级选择框的dom
const onSubmit = () => {
   const newArr = [];
    let num=0;
   tableData.forEach((item)=>{
        const {AREA,GHMC,TOWN,COUNTY}=(item||{})
        const {name,numberAreaStart,numberAreaEnd,selectCode}=form
        let selectArea='';
        (selectCode||[]).forEach(item=>selectArea+=item)
        const nameSearch=(GHMC||'').indexOf(name)!=-1||!name;//名称判断
        const numberSearchStart=Number(AREA)>=Number(numberAreaStart)||!numberAreaStart
        const numberSearchEnd=Number(AREA)<=Number(numberAreaEnd)||!numberAreaEnd//面积区间判断
        const areaSearch=('宁波市'+COUNTY+''+TOWN+''+GHMC).indexOf(selectArea||'')!=-1||!selectArea//地区判断
        const isReset=!name&&!numberSearchStart&&!numberSearchEnd&&!numberAreaEnd&&!selectArea //没有搜索条件的时候是默认全部数据
        if((nameSearch&&numberSearchEnd&&numberSearchStart&&areaSearch)||isReset){
            newArr.push(item)
            num=num+Number((item?.AREA||0))
        }
    })
    tableDataList.value=newArr
    areaInfo.value=num.toFixed(2)
    currentPage.value = 1
    getTableList(1)
    isSearchDone.value=true
}
const handleCloseCasader=()=>{//关闭层级选择框
    //每次选中后关闭层级选择框 如果面板没有关闭，则手动关闭
    if (cascaderHandleRef?.value?.popperVisible) {
    cascaderHandleRef?.value?.togglePopperVisible()
    }
}
const onReset = () =>{
    for (const key in form) {
       form[key]=''//清空
    }
    tableDataList.value = tableData
    getTableList(1)
    isSearchDone.value=false
}
const pageChange = (value) =>{
    currentPage.value=value
    getTableList(value)
}
const getTableList = (currentPage) =>{//分页
    const newArr=[];
    (tableDataList.value||[]).forEach((item,index)=>{
        if((currentPage-1)*5<=index&&index<currentPage*5){
            newArr.push(item)
        }
    })
    showDataList.value=newArr
}
const onAreaConfirm = (e) => {
    let newArr = [];
    (areaOptions.value||[]).forEach(item=>{
        const {value,name}=item
        e.forEach(items=>{
            console.log(items,name,value)
            if(items==name&&value){
                newArr.push(name+'('+value+')')
            }else{
                newArr.push(name)
            }
        })
    })
    form.selectCode=e
    handleCloseCasader()
}
const onStatusChange = (e) => {
    selectStatus.value = e
}
onMounted(() => {
    areaOptions.value = [areaList.city]
    // getTableList(1)
    // formarArea(areaOptions.value)
})
const goMapDetail=(COUNTY,TOWN,GHMC)=>{
    emit('setSelectVal', {
       COUNTY,TOWN,GHMC
    })
}
</script>

<style scoped lang="scss">
.search-popup{
    font-family: PingFangSC-Medium-, PingFangSC-Medium;
    .search-popup-form{
        .input-con{
            background: rgba(0, 27, 54, 0.8980392156862745);
            height: 40px;
            width: 100%;
            box-sizing: border-box;
            opacity: 1;
            border: 1px solid rgba(42, 171, 219, 0.5019607843137255);
        }
        .number-area{
            width: 100%;
            height: 100%;
            display: flex;
            span{
                margin: 0 25px;
                line-height:40px;
            }
            .number-area-input{
                // width: 50%;
            }
            .number-area-icon{
                position: absolute;
                background: rgba(4, 51, 98, 1);
                top: 0;
                right:0;
                width: 40px;
                height: 38px;
                border: 1px solid #1E6B98;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
        .address-checked{
            position: relative;
            img{
                position: absolute;
                right: 14px;
                top: 13px;
                width: 24px;
                height: 12.47px;
            }
        }
        :deep(.el-form-item__label){
            font-size: 18px;
            line-height: 38px;
            font-family: PingFangSC-Medium-, PingFangSC-Medium;
        }
        :deep(.el-cascader){
            width: 100%;
            background: rgba(0, 27, 54, 0.8980392156862745);
            height: 40px;
            opacity: 1;
            border: 1px solid rgba(42, 171, 219, 0.5019607843137255);
        }
        :deep(.el-input__wrapper) {
            background-color: rgba(0, 27, 54, 0.8980392156862745) !important;
            border: none;
            box-shadow:none;
        }
        :deep(.el-input__inner){
            color: #fff;
            font-size: 16px;
            font-family: PingFangSC-Medium-, PingFangSC-Medium;
        }
        // .el-popper{
        //     width: 634px;
        // }
        // .el-cascader-menu__wrap{
        //     width: 634px;
        // }
        :deep(.el-cascader) {

        .el-input__wrapper{
        box-shadow: none;
        }
        .el-input__suffix{
            display: none;
        }
        .el-input {
        height: 100%;
        .el-input__inner {
            height: 100%;
        }
        }
    }
        .submit-btn{
            background: url("img/submit-btn-icon.png") no-repeat;
            background-size: 100% 100%;
            border: none;
            box-sizing: border-box;
            width: 84px;
            height: 36px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: MicrosoftYaHei-, MicrosoftYaHei;
            font-size: 16px;
            color: #fff;
        }
        .reset-btn{
            margin-left: auto;
            background: url("img/reset-btn-icon.png") no-repeat;
            border: none;
            width: 84px;
            box-sizing: border-box;
            height: 36px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 16px;
            background-size: 100% 100%;
            font-family: MicrosoftYaHei-, MicrosoftYaHei;
        }
    }
    .search-popup-table{
        height: 394px;
        .content-null-box{
            color: #999;
            font-size: 16px;
        }
        .table-title{
            margin-bottom: 20px;
            color: rgba(255,255,255,0.65);
            font-size: 16px;
            span{
                margin-left: 78px;
            }
            b{
                color: #fff;
                font-size: 32px;
            }
        }
        .box-item{
             overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        :deep(.el-table__header){
                  background: #0F283B;
              tr{
                  height: 50px;
                  th{
                      background: #0F283B;
                      color: #FFFFFF;
                      font-size: 16px;
                  }
              }
          }
        :deep(.el-table__body){
            tr{
                td{
            background: rgba(4,22,42,1);
            border-bottom: 1px solid ;
                    color:rgba(255,255,255,0.65);
                    height: 50px;
                }
            }
        }
        .pagination-box{
            display: flex;
            margin-top: 16px;
            height: 26px;
            align-items: center;
            span{
                margin-left: auto;
                margin-right: 20px;
                color: #89B0CC;
            }
            :deep(.is-active){
                background: #043362 !important;
                border: none;
            }
            :deep(.btn-prev){
                background: rgba(4,22,42,1);
            }
            :deep(.btn-next){
                background: rgba(4,22,42,1);
            }
            :deep(.more){
                background: rgba(4,22,42,1);
            }
            :deep(.number){
                background: rgba(4,22,42,1);
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
