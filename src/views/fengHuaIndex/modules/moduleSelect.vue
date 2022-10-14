<template>
  <div class="module-select">
    <module-title title="图层" />
    <div class="switch-box">
      <span style="background: #006ff0"></span>
      <p>产业基地</p>
      <el-switch
        v-model="isSelectBaseAll"
        inline-prompt
        active-text="打开"
        inactive-text="关闭"
        active-color="#4EC2FF"
        inactive-color="#30587E"
        @change="onBaseChange"
      />
    </div>
    <div class="select-box">
      <div class="item-wrap">
        <div class="select-item" v-for="(item, index) in baseList" :key="index">
          <img
            class="status"
            @click="onBaseCheckboxChange(item)"
            :src="
              item?.isSelect === 1
                ? require('./../image/select_icon_active.png')
                : item?.isSelect === 0
                ? require('./../image/select_icon_empty.png')
                : require('./../image/select_icon_selecting.png')
            "
            alt=""
          />
          <span :style="{ background: item.color }"></span>
          <p>{{ item?.name }}</p>
          <img
            class="arrow"
            v-if="item.children?.length"
            @click="onArrowChange(item)"
            :style="{
              transform: 'rotate(' + (item.showChild ? -180 : 0) + 'deg)',
            }"
            :src="require('./../image/arrow_icon_down.png')"
            alt=""
          />
          <div
            @click.stop
            class="children-box"
            :style="{
              '--children-box-height': item.showChild
                ? 40 * (item.children.length + 1)
                : 0,
            }"
          >
            <div
              class="children-item"
              v-for="child in item.children"
              :key="child.name"
            >
              <img
                class="status"
                @click.stop="onCheckboxChange(child)"
                :src="
                  child?.isSelect === 1
                    ? require('./../image/select_icon_active.png')
                    : child?.isSelect === 0
                    ? require('./../image/select_icon_empty.png')
                    : require('./../image/select_icon_selecting.png')
                "
                alt=""
              />
              <p>{{ child.name }}</p>
            </div>
            <div class="close-btn" @click="item.showChild = false">
              <img
                v-show="item.showChild"
                :src="require('./../image/select_close.png')"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="switch-box">
      <span style="background: #006ff0"></span>
      <p>粮功区</p>
    </div>
    <div class="select-box">
      <div class="select-title">
        三调地类
        <!-- <el-switch
          v-model="isSelectAll"
          inline-prompt
          active-text="打开"
          inactive-text="关闭"
          active-color="#4EC2FF"
          inactive-color="#30587E"
          @change="onFarmingChange"
        /> -->
        <img
          class="arrow"
          @click="onThreeArrowChange()"
          :style="{
            transform: 'rotate(' + (showThreeChild ? -180 : 0) + 'deg)',
          }"
          :src="require('./../image/arrow_icon_down.png')"
          alt=""
        />
      </div>
      <div
        class="item-wrap item-wrap-three"
        :style="{
          height: showThreeChild ? '260px' : 0,
          overflow: showThreeChild ? 'auto' : 'hidden',
        }"
      >
        <div
          class="select-item"
          v-for="(item, index) in selectList"
          :key="index"
        >
          <img
            class="status"
            @click="onCheckboxChange(item)"
            :src="
              item?.isSelect === 1
                ? require('./../image/select_icon_active.png')
                : item?.isSelect === 0
                ? require('./../image/select_icon_empty.png')
                : require('./../image/select_icon_selecting.png')
            "
            alt=""
          />
          <span :style="{ background: item.color }"></span>
          <p>{{ item?.name }}</p>
          <img
            class="arrow"
            v-if="item.children?.length"
            @click="onArrowChange(item)"
            :style="{
              transform: 'rotate(' + (item.showChild ? -180 : 0) + 'deg)',
            }"
            :src="require('./../image/arrow_icon_down.png')"
            alt=""
          />
          <div
            @click.stop
            class="children-box"
            :style="{
              '--children-box-height': item.showChild
                ? 40 * (item.children.length + 1)
                : 0,
            }"
          >
            <div
              class="children-item"
              v-for="child in item.children"
              :key="child.name"
            >
              <img
                class="status"
                @click.stop="onCheckboxChange(child)"
                :src="
                  child?.isSelect === 1
                    ? require('./../image/select_icon_active.png')
                    : child?.isSelect === 0
                    ? require('./../image/select_icon_empty.png')
                    : require('./../image/select_icon_selecting.png')
                "
                alt=""
              />
              <p>{{ child.name }}</p>
            </div>
            <div class="close-btn" @click="item.showChild = false">
              <img
                v-show="item.showChild"
                :src="require('./../image/select_close.png')"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      <div class="select-title">
        非粮化图斑
        <el-switch
          v-model="flhtb"
          inline-prompt
          active-text="打开"
          inactive-text="关闭"
          active-color="#4EC2FF"
          inactive-color="#30587E"
        />
      </div>
      <div class="select-title">
        清理腾退
        <el-switch
          v-model="isClean"
          inline-prompt
          active-text="打开"
          inactive-text="关闭"
          active-color="#4EC2FF"
          inactive-color="#30587E"
        />
      </div>
      <div class="select-title">
        优化补入
        <el-switch
          v-model="isCompensate"
          inline-prompt
          active-text="打开"
          inactive-text="关闭"
          active-color="#4EC2FF"
          inactive-color="#30587E"
        />
      </div>
    </div>
    <div class="switch-box">
      <span style="background: #4a0bff"></span>
      <p>高标准农田</p>
      <el-switch
        v-model="gbznt"
        inline-prompt
        active-text="打开"
        inactive-text="关闭"
        active-color="#4EC2FF"
        inactive-color="#30587E"
        @change="onFarmingChange"
      />
    </div>
    <div class="select-box">
      <div class="item-wrap">
        <div
          class="select-item"
          v-for="(item, index) in farmingList"
          :key="index"
        >
          <img
            class="status"
            @click="onCheckboxChange(item, 'stop')"
            :src="
              item?.isSelect === 1
                ? require('./../image/select_icon_active.png')
                : item?.isSelect === 0
                ? require('./../image/select_icon_empty.png')
                : require('./../image/select_icon_selecting.png')
            "
            alt=""
          />
          <span :style="{ background: item.color }"></span>
          <p>{{ item?.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import moduleTitle from "@/components/moduleTitle";

export default defineComponent({
  components: {
    moduleTitle,
  },
  setup(props, { emit }) {
    const isSelectAll = ref(true); // 粮功区
    const isSelectBaseAll = ref(true); // 产业基地
    const isClean = ref(false); // 清理腾退
    const isCompensate = ref(false); // 优化补入
    const flhtb = ref(false); // 非粮化图斑
    const gbznt = ref(false); // 高标准农田
    const selectList = ref([
      {
        name: "耕地",
        color: "#71D964",
        isSelect: 1,
        showChild: false,
        children: [
          { name: "水田", isSelect: 1 },
          { name: "旱地", isSelect: 1 },
        ],
      },
      {
        name: "种植园用地",
        color: "#38D672",
        isSelect: 1,
        showChild: false,
        children: [
          { name: "果园", isSelect: 1 },
          { name: "茶园", isSelect: 1 },
          { name: "其他园地", isSelect: 1 },
        ],
      },
      {
        name: "林地",
        color: "#18CC00",
        isSelect: 1,
        showChild: false,
        children: [
          { name: "乔木林地", isSelect: 1 },
          { name: "竹林地", isSelect: 1 },
          { name: "灌木林地", isSelect: 1 },
          { name: "其他林地", isSelect: 1 },
        ],
      },
      {
        name: "其他农业用地",
        color: "#009942",
        isSelect: 1,
        showChild: false,
        children: [
          { name: "其他土地", isSelect: 1 },
          { name: "可调整乔木林地", isSelect: 1 },
          { name: "可调整其他园地", isSelect: 1 },
          { name: "可调整其他林地", isSelect: 1 },
          { name: "可调整养殖坑塘", isSelect: 1 },
          { name: "可调整果园", isSelect: 1 },
          { name: "可调整茶园", isSelect: 1 },
          { name: "坑塘水面", isSelect: 1 },
          { name: "水库水面", isSelect: 1 },
          { name: "沟渠", isSelect: 1 },
          { name: "设施农用地", isSelect: 1 },
        ],
      },
      {
        name: "农村道路",
        color: "#26B4FD",
        isSelect: 1,
      },
      {
        name: "河流水面",
        color: "#22D0D0",
        isSelect: 1,
      },
      {
        name: "公路用地",
        color: "#9389FC",
        isSelect: 1,
      },
      {
        name: "农村宅基地",
        color: "#C3BB27",
        isSelect: 1,
      },
      {
        name: "工业用地",
        color: "#FD9C48",
        isSelect: 1,
      },
      {
        name: "其他",
        color: "#FD642C",
        isSelect: 1,
        showChild: false,
        children: [
          { name: "交通服务场站用地", isSelect: 1 },
          { name: "公园与绿地", isSelect: 1 },
          { name: "公用设施用地", isSelect: 1 },
          { name: "其他草地", isSelect: 1 },
          { name: "养殖坑塘", isSelect: 1 },
          { name: "内陆滩涂", isSelect: 1 },
          { name: "商业服务业设施用地", isSelect: 1 },
          { name: "城镇住宅用地", isSelect: 1 },
          { name: "城镇村道路用地", isSelect: 1 },
          { name: "广场用地", isSelect: 1 },
          { name: "机关团体新闻出版用地", isSelect: 1 },
          { name: "水工建筑用地", isSelect: 1 },
          { name: "沿海滩涂", isSelect: 1 },
          { name: "物流仓储用地", isSelect: 1 },
          { name: "特殊用地", isSelect: 1 },
          { name: "科教文卫用地", isSelect: 1 },
          { name: "管道运输用地", isSelect: 1 },
          { name: "轨道交通用地", isSelect: 1 },
          { name: "采矿用地", isSelect: 1 },
          { name: "铁路用地", isSelect: 1 },
        ],
      },
    ]);
    const farmingList = ref([
      // {
      //   name: "高标农外粮功区",
      //   color: "#DE5887",
      //   isSelect: 0,
      // },
      {
        name: "高标农内粮功区",
        color: "#A8325B",
        isSelect: 0,
      },
    ]);
    const baseList = ref([ // 奉化区没有蔬菜和水产
      // {
      //   name: "蔬菜",
      //   color: "#FF5C5C",
      //   isSelect: 1,
      // },
      {
        name: "畜牧",
        color: "#DB85FF",
        isSelect: 1,
      },
      // {
      //   name: "水产",
      //   color: "#FFAC1D",
      //   isSelect: 1,
      // },
    ]);
    const showThreeChild = ref(true);
    /*
     *   高标准农田内、外粮功区 点击要求
     *   1 粮功区 打开
     *   2 高标准农田 打开
     * */
    const onCheckboxChange = (item, stop) => {
      if (stop) {
        if (isSelectAll.value && gbznt.value) onCheckboxChange(item);
        return;
      }
      item.isSelect = item.isSelect === 1 ? 0 : 1;
      if (item?.children?.length) {
        item.children.map((child) => {
          child.isSelect = item.isSelect;
        });
      }
    };
    const onFarmingChange = () => {
      selectList.value.map((item) => {
        item.isSelect = isSelectAll.value ? 1 : 0;
        if (item.children?.length) {
          item.children.map((child) => {
            child.isSelect = isSelectAll.value ? 1 : 0;
          });
        }
      });
      if (!isSelectAll.value || !gbznt.value) {
        farmingList.value.map((item) => {
          item.isSelect = 0;
        });
      }
    };
    const onBaseChange = () => {
      baseList.value.map((item) => {
        item.isSelect = isSelectBaseAll.value ? 1 : 0;
        if (item.children?.length) {
          item.children.map((child) => {
            child.isSelect = isSelectBaseAll.value ? 1 : 0;
          });
        }
      });
      if (!isSelectBaseAll.value) {
        baseList.value.map((item) => {
          item.isSelect = 0;
        });
      }
    }
    const onBaseCheckboxChange = (item) => {
      item.isSelect = item.isSelect === 1 ? 0 : 1;
      if (baseList.value.filter(v => v.isSelect).length == 3) {
        isSelectBaseAll.value = true
      } else {
        isSelectBaseAll.value = false
      }
    };
    const onArrowChange = (item) => {
      item.showChild = !item.showChild;
    };
    const onThreeArrowChange = () => {
      showThreeChild.value = !showThreeChild.value;
    };
    const onEmit = () => {
      const object = {};
      selectList.value.map((item) => {
        let arr = [];
        if (item.children?.length) {
          item.children?.map((child) => {
            if (child.isSelect === 1) arr.push(child.name);
          });
        } else {
          if (item.isSelect === 1) {
            arr = [item.name];
          } else {
            arr = [];
          }
        }
        object[item.name === "其他" ? "其他非农用地" : item.name] = arr;
      });
  
      emit("sendMessage", {
        key: "changeLayerByOption",
        value: {
          option: {
            name: "土地非农化",
            obj: {
              三调地类: object,
              非粮化图斑: flhtb.value ? "非粮化图斑" : "",
              清理腾退: isClean.value ? "清理腾退" : "",
              优化补入: isCompensate.value ? "优化补入" : "",
              高标准农田: gbznt.value ? "高标准农田" : "",
              高标农外粮功区: farmingList.value[0]?.isSelect
                ? "高标农外粮功区"
                : "",
              高标农内粮功区: farmingList.value[1]?.isSelect
                ? "高标农外粮功区"
                : "",
              产业基地: baseList.value.filter(v => v.isSelect == 1).map(v => v.name)
            },
          },
        },
      });
    };
    watch(
      () => selectList.value,
      (val) => {
        val.map((item) => {
          if (!item?.children?.length) return;
          let allTrue = true; // 全部为1
          let allFalse = true; // 全部为0
          item.children.map((child) => {
            if (child.isSelect === 0) allTrue = false;
            if (child.isSelect === 1) allFalse = false;
          });
          if (!allTrue && !allFalse) {
            item.isSelect = 2;
          } else if (allTrue) {
            item.isSelect = 1;
          } else if (allFalse) {
            item.isSelect = 0;
          }
        });
        const getIndex = val.findIndex((item) => item.isSelect !== 1);
        isSelectAll.value = getIndex === -1;
        onEmit();
      },
      { deep: true, immediate: true }
    );
    watch(
      () => farmingList.value,
      () => {
        onEmit();
      },
      { deep: true, immediate: true }
    );
    watch(
      () => [isCompensate.value, isClean.value, flhtb.value, gbznt.value],
      () => {
        onEmit();
      },
      { deep: true, immediate: true }
    );
    watch(
      () => baseList.value,
      (val) => {
        onEmit();
        if (baseList.value.some(v => v.isSelect == 1)) {
          // 如果有产业基地图层选中 切换到产业基地tab
          emit("setTab", 2);
        } else {
          emit("setTab", 1);
        }
      },
      { deep: true, immediate: true }
    );
    return {
      selectList,
      onCheckboxChange,
      isSelectAll,
      onFarmingChange,
      onBaseChange,
      onArrowChange,
      isCompensate,
      isClean,
      flhtb,
      gbznt,
      farmingList,
      baseList,
      onThreeArrowChange,
      showThreeChild,
      isSelectBaseAll,
      onBaseCheckboxChange,
    };
  },
});
</script>

<style scoped lang="scss">
.module-select {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .select-title {
    height: 38px;
    line-height: 38px;
    background: linear-gradient(
      271deg,
      rgba(68, 185, 237, 0) 0%,
      rgba(68, 185, 237, 0.4) 65%,
      rgba(68, 185, 237, 0) 100%
    );
    padding: 0 50px 0 70px;
    font-family: PangMenZhengDao;
    font-size: 22px;
    margin-top: 10px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .arrow {
      position: absolute;
      top: 12px;
      right: 20px;
      cursor: pointer;
      width: 16px;
      height: 16px;
      transition: all 0.3s;
    }
  }
  .switch-box {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 16px 0 5px;
    height: 22px;
    padding: 0 50px 16px;
    span {
      position: absolute;
      top: 8px;
      left: 35px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }
    p {
      font-size: 22px;
      font-family: PangMenZhengDao;
    }

    &:after {
      content: "";
      position: absolute;
      z-index: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 24px;
      background: url("../image/block_bg.png") no-repeat;
      background-size: 100% 100%;
    }
  }

  .select-box {
    //flex: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;
    .check-title {
      position: relative;
      margin: 24px 20px 5px;
      height: 22px;
      padding: 0 50px 16px;
      font-size: 22px;
      font-family: PangMenZhengDao;

      &:after {
        content: "";
        position: absolute;
        z-index: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 24px;
        background: url("../image/block_bg.png") no-repeat;
        background-size: 100% 100%;
      }
    }

    .check-title-sec {
      margin-top: 16px;
    }

    .item-wrap {
      margin: 0 20px;
      // max-height: calc(42px * 10);
      &.item-wrap-three {
        transition: all 0.3s;
      }
    }

    .select-item {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      box-sizing: border-box;
      padding: 0 0 0 48px;
      min-height: 22px;

      p {
        flex: 1;
        line-height: 22px;
        font-weight: 600;
        background: linear-gradient(180deg, #ffffff 0%, #65c7ff 100%);
        -webkit-background-clip: text;
        color: transparent;
        padding: 10px 0;
      }

      span {
        width: 6px;
        height: 6px;
        border-radius: 3px;
        margin: 0 9px 0 24px;
      }

      .status {
        width: 18px;
        height: 18px;
        cursor: pointer;
      }

      .arrow {
        position: absolute;
        top: 12px;
        right: 0;
        cursor: pointer;
        width: 16px;
        height: 16px;
        transition: all 0.3s;
      }

      .children-box {
        margin-right: 20px;
        width: 100%;
        height: calc(var(--children-box-height) * 1px);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transition: all 0.3s;

        .children-item {
          display: flex;
          flex-direction: row;
          height: 20px;
          line-height: 20px;
          padding: 10px 36px;

          &:nth-of-type(2n-1) {
            background: #0f3d6c;
          }

          p {
            padding: 0 0 0 17px;
          }
        }

        .close-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;

          img {
            height: 22px;
            width: 127px;
          }
        }
      }
    }
  }
}
</style>
