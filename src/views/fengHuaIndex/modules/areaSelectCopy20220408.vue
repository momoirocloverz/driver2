<template>
  <div class="area-box">
    <div class="area-select ">
      <div class="city_wrap">
        {{ selectVal }}
      </div>
      <img
        :style="{ transform: 'rotate(' + (selectStatus ? -180 : 0) + 'deg)',  }"
        :src="require('../image/arrow_icon.png')"
        alt=""
      />
      <el-cascader
        v-model="selectCode"
        :options="areaOptions"
        :props="{ label: 'name', value: 'name' }"
        @change="onAreaConfirm"
        @visible-change="onStatusChange"
      />
    </div>
    <div
      class="type-select"
      v-show="showFlag"
    >
      <!--FIXME: 更换背景图由于加载的原因会闪烁 ，需优化-->
      <div class="type-wrap" @click="state.typeStatus = !state.typeStatus" ref="typeRef" :style="`background: url(${
        state.top > 60 ? require('../image/type_select_bg2.png') : require('../image/type_select_bg.png')
      });background-size:100% 100%;`">
        {{ typeVal || "请选择粮功区" }}
      </div>
      <img
        :style="{ transform: 'rotate(' + (state.typeStatus ? -180 : 0) + 'deg)',  }"
        :src="require('../image/arrow_icon.png')"
        alt=""
        class="triangle"
        @click="state.typeStatus = !state.typeStatus"
      />
      <img
        v-show="typeVal"
        :src="require('../image/clear.png')"
        alt=""
        class="clear"
        @click="clearType"
      />
      <div class="type-value" v-show="state.typeStatus" :style="`top:${state.top}px`">
        <div :class="'type-info' + (state.selectArr.indexOf(index) > -1?' type-active':'')"
             v-for="(item,index) in state.typeArr"
             :key="item.RDBH"
             @click.stop="handleType(item,index)"
        >
          {{ item?.GHMC }}
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref } from "vue";
import areaList from "@/assets/js/areaList.json";
import ribbon from "@/assets/js/ribbon.json";

export default defineComponent({
  name: "areaSelect",
  props: {
    selectVal: {
      type: String,
      default: ""
    }
  },
  setup(props, { emit }) {
    const state = reactive({
      typeStatus: false,// 三角朝向
      typeArr: [],
      selectArr: [],
      top: 50
    });
    const typeRef = ref();
    const typeVal = ref("");
    const selectStatus = ref(false);
    const showFlag = ref(false);
    const selectCode = ref([]);
    const areaOptions = ref([]);
    const onAreaConfirm = (e) => {
      emit("update:selectVal", e.join("/"));
      const selectArea = e[e.length - 1];
      emit("sendMessage", {
        key: "changeAreaByName",
        value: { name: [selectArea] }
      });
      console.log("e", e);
      // 添加判断逻辑 如果 仅选择两级 或 选择三级三十第二项与第三项的值一致 不展示 第二个下拉框
      if (e.length && (e.length < 3 || (e.length === 3 && e[1] === e[2]))) {
        // 不展示
        showFlag.value = false;
      } else {
        formatData();
        filterData(selectArea);
        // 展示
        showFlag.value = true;
      }
    };
    const formatData = () => {
      state.top = 50;
      state.typeStatus = false;
      state.selectArr = [];
      typeVal.value = "";
    };
    const formarArea = (array) => {
      array.map(item => {
        if (item.children && item.children.length) {
          if (item.children[0].name !== item.name) {
            item.children.unshift({ name: item.name, code: item.code });
          }
          formarArea(item.children);
        }
      });
    };
    const onStatusChange = (e) => {
      selectStatus.value = e;
    };
    const clearType = () => {
      formatData();
      changeIframe("");
    };
    const handleType = (item, index) => {
      state.selectArr = [index];
      // 修改typeVal
      let nameArr = [];
      state.selectArr.map(item => {
        nameArr.push(state.typeArr[item].GHMC);
      });
      typeVal.value = nameArr.join(",");
      setTimeout(() => {
        state.top = typeRef.value.clientHeight + 10;
        console.log(state.top);
      }, 60);
      changeIframe(typeVal.value);
      // 隐藏
      state.typeStatus = false;
    };
    const changeIframe = (name) => {
      // 更改 iframe
      let iframe = document.getElementById("gisIframe");
      iframe.contentWindow.postMessage({
        type: "gisLayerMessage",
        data: {
          key: "changeLGQByName",
          value: { name }
        }
      }, "*");
    };
    const filterData = (name) => {
      let temp = [];
      for (let j = 0, len = ribbon.length; j < len; j++) {
        if (name === ribbon[j].TOWN) {
          temp.push(ribbon[j]);
        }
      }
      // console.log(temp)
      state.typeArr = temp;
    };
    onMounted(() => {
      areaOptions.value = [areaList.city];
      formarArea(areaOptions.value);

    });
    return {
      typeRef,
      state,
      typeVal,
      showFlag,
      areaList,
      areaOptions,
      clearType,
      handleType,
      onAreaConfirm,
      selectCode,
      onStatusChange,
      selectStatus
    };
  }
});
</script>

<style scoped lang="scss">
.area-box {
  position: relative;
  width: 774px;
  height: 40px;
  left: 522px;
  top: 138px;
  display: flex;
  justify-content: flex-start;

  .type-select {
    width: 360px;
    height: 40px;
    margin-left: 42px;
    position: relative;

    .type-value {
      position: absolute;
      left: 0;
      right: 0;
      top: 50px;
      height: 178px;
      overflow-y: auto;
      background: rgba(6, 62, 119, 1);
      padding: 5px 0;

      .type-info {
        width: 100%;
        min-height: 30px;
        line-height: 20px;
        box-sizing: border-box;
        padding: 9px 20px;
        font-size: 14px;
        color: #fff;
        cursor: pointer;
        margin-bottom: 5px;
      }

      .type-active {
        background: rgba(9, 71, 132, 0.92);
      }
    }

    .type-wrap {
      width: 360px;
      min-height: 40px;
      font-size: 16px;
      box-sizing: border-box;
      background: url("../image/type_select_bg.png") no-repeat;
      background-size: 100% 100%;
      padding: 10px 100px 10px 20px;
      line-height: 22px;
    }

    .triangle, .clear {
      position: absolute;
      right: 20px;
      top: 14px;
      transition: all .3s;
      width: 24px;
      height: 12px;
    }

    .clear {
      right: 60px;
      width: 16px;
      height: 16px;
    }
  }

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
  }
}
</style>
