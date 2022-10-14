<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="updateVisible"
    append-to-body
    destroy-on-close
    custom-class="dialog_custom"
    :width="width ? (width + 'px') : (800 * unit + 'px')"
    :top="top"
  >
    <div class="dialog_title">
      <div
        class="title"
        v-if="title"
        :style="{
          '--title-height': pageHeight > 650 ? 50 : 40,
          '--title-font-size': pageHeight > 650 ? 22 : 18
         }"
      >
        <p>{{ title }}</p>
      </div>
      <div class="custom_title">
        <slot name="title" />
      </div>
      <el-icon @click="updateVisible" :size="18" class="cursor-pointer">
        <close />
      </el-icon>
      <!-- <i class="el-icon-close" @click="updateVisible" /> -->
    </div>
    <div
      class="dialog_content"
      ref="myRef"
    >
      <slot />
    </div>
  </el-dialog>
</template>

<script>
import { defineComponent, inject, onMounted, ref, nextTick, watch } from 'vue'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    width: {
      type: [String, Number],
      default: 0
    },
    top: {
      type: String,
      default: '15vh'
    }
  },
  setup(props, { emit }) {
    const myRef = ref(null)
    const unit = inject('unit')
    const pageHeight = ref(0)
    const updateVisible = () => {
      emit('update:visible', false)
    }
    onMounted(() => {
      nextTick(() => {
        pageHeight.value = myRef?.value?.clientHeight
      })
    })
    watch(() => props.visible, val => {
      nextTick(() => {
        pageHeight.value = myRef?.value?.clientHeight
      })
    })
    return {
      updateVisible,
      unit,
      myRef,
      pageHeight
    }
  }
})
</script>

<style scoped lang="scss">
  .dialog_content {

  }
  .dialog_title {
        height: 71px;
        margin-bottom: 20px;
        .cursor-pointer{
         cursor:pointer;
        }
    .title {
      padding: 0 24px;
      height: calc(var(--title-height) * 1px);
      line-height: calc(var(--title-height) * 1px);
      font-size: calc(var(--title-font-size) * 1px);
      font-weight: 600;
      p{
        height: 71px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>
