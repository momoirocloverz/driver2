<template>
  <div class="student-windows">
    <div class="close-btn" @click="updateVisible"><img src="https://img.hzanchu.com/acimg/63d5b3a4cc53e5428d029e391a62f6f3.png" alt="" /></div>
    <div class="title">
      <h3 class="vd__section-title">{{ title }}</h3>
    </div>
    <div class="centent">{{ contentValue }}</div>
  </div>
</template>
<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue'
const emit = defineEmits(['updateVisible'])
const props = defineProps({
  contentValue: {
    default: '',
    type: String
  },
  title: {
    default: '',
    type: String
  }
})
const updateVisible = () => {
  emit('updateVisible', false)
}
</script>
<style scoped lang="scss">
.student-windows {
  position: fixed;
  top: 20%;
  left: 30%;
  width: 821px;
  height: 620px;
  overflow: auto;
  padding: 28px 36px 10px 36px;
  box-sizing: border-box;
  background: url('https://img.hzanchu.com/acimg/d6ad67abe7da376a27393c0a4f1b816a.png') no-repeat;
  background-size: 100% 100%;
  .centent {
    text-indent: 24px;
    font-size: 16px;
    font-family: MicrosoftYaHei;
    color: #ffffff;
    line-height: 36px;
    white-space: pre-wrap;
  }
  .title {
    display: flex;
    justify-content: center;
    margin-bottom: 25px;
    .vd__section-title {
      margin-top: 12px;
      box-sizing: border-box;
      width: 298px;
      height: 40px;
      // padding: 0 0 12px 34px;
      font-size: 22px;
      font-family: PangMenZhengDao;
      font-weight: 400;
      text-align: center;
      color: #ffffff;
      background: no-repeat center / 100% auto url('~@/views/index/image/block_bg.png');
    }
  }

  .close-btn {
    display: flex;
    position: absolute;
    right: 6px;
    top: 3px;
    width: 58px;
    height: 52px;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
