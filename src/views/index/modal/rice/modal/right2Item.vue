<template>
  <div class="_left1-item" :style="customStyle">
    <div class="_target">
    <el-tooltip
        class="box-item"
        effect="dark"
        :content="title"
        placement="top"
      >
        <div class="_target-title">{{ title }}</div>
      </el-tooltip>
      <div class="_target-value">
        {{ value }}
        <span>{{ unit }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    customStyle: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    unit: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="scss">
._left1-item {
  width: 100%;
  margin-top: 28px;
  display: flex;
  flex-direction: row;
  align-items: center;
  ._target {
    ._target-title {
      font-size: 16px;
      font-family: MicrosoftYaHei-, MicrosoftYaHei;
      color: #ffffff;
    }
    ._target-value {
      margin-top: 5px;
      font-size: 24px;
      font-family: HuXiaoBo-NanShen-Regular, HuXiaoBo-NanShen;
      color: #26e3ff;
      text-shadow: 0px 0px 6px rgba(16, 237, 255, 0.5);
      span {
        font-size: 12px;
      }
    }
  }
}
</style>
