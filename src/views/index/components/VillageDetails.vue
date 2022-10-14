<template>
  <div class="vd__container">
    <template v-if="showVillageDetails">
      <h3 class="vd__title">
        {{ regionName }}
      </h3>
      <div class="vd__images-container">
        <el-carousel
          trigger="click"
          class="vd__images"
          height="160px"
          indicator-position="none"
          arrow="never"
          ref="carouselRef"
        >
          <el-carousel-item v-for="url in images" :key="url">
          <!-- 对oss图片进行裁剪 -->
            <el-image
              :src="url"
              fit="cover"
              :preview-src-list="[url]" 
              preview-teleported
            >
              <template #error>
                <el-image :src="NoImage" fit="cover" />
              </template>
            </el-image>
          </el-carousel-item>
        </el-carousel>
        <img :src="CarouselArrow" class="vd__images-arrow--left" @click="carouselRef?.prev" alt="prev">
        <img :src="CarouselArrow" class="vd__images-arrow--right" @click="carouselRef?.next" alt="next">
      </div>
      <div class="vd__award_section" :style="{ minWidth: '258px' }">
        <div class="vd__award_section-row">
          <span class="vd__award_section-row-label">所属区（县、市）</span>
          <span class="vd__award_section-row-value">{{ regionName2 }}</span>
        </div>
        <div class="vd__award_section-row">
          <span class="vd__award_section-row-label">所属乡镇街道</span>
          <span class="vd__award_section-row-value">{{ regionName3 }}</span>
        </div>
      </div>
      <h3 class="vd__section-title">所获荣誉</h3>
      <template v-for="section in sections" :key="section.key">
        <div
          class="vd__award_section"
          v-if="content[section.key]?.[0] !== undefined"
        >
          <h4 class="vd__award_section-title">
            {{ section.label || section.key }}
          </h4>
          <div
            class="vd__award_section-row"
            v-for="item in section.rows"
            :key="item.key"
          >
            <span class="vd__award_section-row-label">{{ item.key }}</span>
            <span class="vd__award_section-row-value">{{ content[section.key][0][item.key] }}{{ item.unit }}</span>
          </div>
        </div>
      </template>
      <div class="vd__award_section-row-value-box" v-if="(content['未来乡村'][0])&&content['未来乡村'][0]['二维码']">
        <img :src="(content['未来乡村'][0])&&content['未来乡村'][0]['二维码']" alt="">
      </div>
    </template>
    <template v-else>
      <h3 class="vd__section-title" :style="{ paddingLeft: '12px' }">
        乡村振兴示范带乡镇(20个)
      </h3>
      <el-table
        class="vd__default-view-table"
        :data="defaultViewTableData"
        stripe
        row-key="镇"
        :row-style="customRowStyles"
      >
        <el-table-column prop="区" label="区(县、市)" width="100" />
        <el-table-column prop="镇" label="镇名称" />
        <el-table-column prop="称号" label="称号" />
      </el-table>
    </template>
  </div>
</template>

<script setup>
import { defineProps, computed, watch, ref } from "vue";
import NoImage from "@/assets/image/default-image.svg";
import CarouselArrow from "@/views/index/image/carousel-arrow.svg";

const props = defineProps({
  content: {
    type: Object,
    default(v) {
      return {
        fullPath: [],
        图片: [],
        未来乡村: [],
        小集镇式中心村: [],
        梳理式改造村: [],
        浙江省美丽乡村特色精品村: [],
      };
    },
  },
});

const regionName = computed(() => {
  const pathWithValue = props.content.fullPath.filter(Boolean);
  return pathWithValue[pathWithValue.length - 1] ?? "--";
});
const carouselRef = ref(null)
const regionName2 = computed(() => {
  return props.content?.fullPath[1] ?? "--";
});
const regionName3 = computed(() => {
  return props.content?.fullPath[2] ?? "--";
});
const showVillageDetails = computed(() => {
  return !!props.content?.fullPath[3];
});

const images = computed(() => {
  if (
    Array.isArray(props.content["图片"]) &&
    props.content["图片"].length > 0
  ) {
    const newArr = props.content["图片"].map(item => item+'?x-oss-process=image/resize,l_300')// 对oss图片进行裁剪 加速图片加载
    return newArr;
  }
  return [NoImage];
});

const sections = [
  {
    key: "未来乡村",
    rows: [
      { key: "常住人口", unit: "人" },
      { key: "村级集体经济收入", unit: "万元" },
      { key: "村集体年经营性收入", unit: "万元" },
      { key: "投资预算", unit: "万元" },
      { key: "方案预算", unit: "万元" },
    ],
  },
  {
    key: "小集镇式中心村",
    rows: [{ key: "当选年份", unit: "年" }],
  },
  {
    key: "梳理式改造村",
    rows: [{ key: "当选年份", unit: "年" }],
    label: "梳理式村庄（改造项目）",
  },
  {
    key: "浙江省美丽乡村特色精品村",
    rows: [{ key: "批次" }, { key: "当选年份", unit: "年" }],
  },
];
// 非村级展示
const defaultViewTableData = ref([]);
import("@/assets/js/产业大脑/乡村振兴示范带乡镇.json").then((v) => {
  defaultViewTableData.value = v.default;
});
const rowColors = ["transparent", "#1797FF1A"];
const customRowStyles = ({ row, rowIndex }) => {
  return {
    background: rowColors[rowIndex % rowColors.length],
  };
};
</script>

<style scoped lang="scss">
.vd__container {
  row-gap: 24px;
  height: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
}
.vd__award_section-row-value-box{
  margin-left: -24px;
  img{
    width: 125px;
    height: 125px;
  }
}

.vd__title {
  width: 288px;
  min-height: 34px;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  line-height: 28px;
  text-align: center;
  background: no-repeat center / 100% 100%
    url("~@/components/moduleTitle/image/title_bg.png");
}

.vd__images {
  width: 264px;
  height: 160px;
  :deep(.el-image) {
    width: 100%;
    height: 100%;
  }
}
.vd__images-container {
  position: relative;
}
%_vd__images-arrow {
  position: absolute;
  top: 80px - 16px;
  z-index: 1;
  cursor: pointer;
}
.vd__images-arrow--left {
  @extend %_vd__images-arrow;
  right: 280px;
  &:active {
    transform: scale(0.9) ;
  }
}
.vd__images-arrow--right {
  @extend %_vd__images-arrow;
  left: 280px;
  transform: scaleX(-1);
  &:active {
    transform: scale(-0.9, 0.9) ;
  }
}

.vd__section-title {
  box-sizing: border-box;
  width: 298px;
  height: 40px;
  padding: 0 0 12px 34px;
  font-size: 22px;
  font-family: PangMenZhengDao;
  font-weight: 400;
  color: #ffffff;
  background: no-repeat center / 100% auto
    url("~@/views/index/image/block_bg.png");
}

.vd__award_section {
  font-size: 14px;
  font-weight: normal;
  color: #ffffff;
  line-height: 28px;
}

.vd__award_section-title {
  min-width: 258px;
  font-size: 16px;
  border-image: linear-gradient(to right, #26ccff, transparent) 10%;
  border-bottom: 1px solid;

  &:before {
    content: "";
    display: inline-block;
    height: 1em;
    width: 1em;
    vertical-align: middle;
    margin-right: 8px;
    background: no-repeat center / 100%
      url("~@/views/index/image/icon_award.svg");
  }
}

.vd__award_section-row {
  display: flex;
  align-items: flex-start;
}

.vd__award_section-row-label {
  color: #6cd0ff;
  flex: 1;
}

.vd__award_section-row-value {
  display: inline-block;
  width: 6em;
}

.vd__default-view-table {
  width: 100%;
  --el-table-border-color: var(--el-border-color-lighter);
  --el-table-border: transparent;
  --el-table-text-color: white;
  --el-table-header-text-color: white;
  --el-table-row-hover-bg-color: var(--el-fill-color-light);
  --el-table-current-row-bg-color: transparent;
  --el-table-header-bg-color: transparent;
  --el-table-fixed-box-shadow: var(--el-box-shadow-light);
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-expanded-cell-bg-color: transparent;
  --el-fill-color-lighter: none;
  --el-table-row-hover-bg-color: none;

  :deep(.el-table__inner-wrapper) {
    thead {
      tr {
        background-color: #1797ff66;
      }
    }
  }
}
</style>
