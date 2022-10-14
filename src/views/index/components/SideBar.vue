<template>
  <div
    :data-position="position"
    :class="[
      'side-bar',
      {
        hidden: isHidden,
      },
    ]"
  >
    <div class="side-bar__wrapper">
      <slot />
      <button class="side-bar__visibility-toggle" @click="isHidden = !isHidden">
        <div class="side-bar__visibility-toggle-content-wrapper">
          <span>{{ isHidden ? "展开" : "收起" }}</span>
          <img
            class="side-bar__visibility-toggle-bg"
            :src="require('@/views/index/image/hide-sidebar-btn.png')"
            alt="toggle bg"
          />
          <img
            class="side-bar__visibility-toggle_arrow"
            :src="require('@/views/index/image/arrow_icon.png')"
            alt="arrow"
          />
        </div>
      </button>
      <div
        class="side-bar__left-bottom-toolbox"
        v-if="Boolean($slots['left-bottom-toolbox'])"
      >
        <slot name="left-bottom-toolbox" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  position: {
    type: String,
    default: "left",
    validator(value) {
      return ["left", "right"].includes(value);
    },
  },
});

const isHidden = ref(false);
</script>

<style scoped lang="scss">
$vis-toggle-width: 30px;
$vis-toggle-height: 80px;
$panel-to-border-dist: 40px;
.side-bar {
  width: 346px;
  height: 850px;
  position: absolute;
  z-index: 100;
  &[data-position="left"] {
    &.hidden {
      transform: translateX(calc(-100% - $panel-to-border-dist));
      .side-bar__visibility-toggle_arrow {
        transform: rotate(270deg);
      }
    }
    .side-bar__visibility-toggle {
      left: calc(100% - 2px);
    }
    .side-bar__visibility-toggle_arrow {
      transform: rotate(90deg);
      transition: transform 1s ease;
    }
  }
  &[data-position="right"] {
    &.hidden {
      transform: translateX(calc(100% + $panel-to-border-dist));
      .side-bar__visibility-toggle_arrow {
        transform: rotate(90deg);
      }
    }
    .side-bar__wrapper {
      &::before {
        transform: scaleX(-1);
      }
    }
    .side-bar__visibility-toggle {
      right: calc(100% - 2px);
    }
    .side-bar__visibility-toggle-bg {
      transform: scaleX(-1);
    }
    .side-bar__visibility-toggle_arrow {
      transform: rotate(270deg);
      transition: transform 1s ease;
    }
  }
}
.side-bar__wrapper {
  position: relative;
  box-sizing: border-box;
  padding: 20px 24px;
  height: 100%;
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    background: no-repeat center / 100% 100%
    url("~@/views/index/image/side-panel--left.svg");
  }
}
.side-bar__visibility-toggle {
  width: $vis-toggle-width;
  height: $vis-toggle-height;
  position: absolute;
  top: calc(50% - $vis-toggle-height / 2);
  cursor: pointer;
  background: none;
  .side-bar__visibility-toggle-content-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    > span {
      writing-mode: vertical-lr;
      color: white;
      font-size: 14px;
      font-weight: 400;
      line-height: 18px;
      letter-spacing: 4px;
    }
  }
  .side-bar__visibility-toggle-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: fill;
    z-index: -1;
  }
}
.side-bar__left-bottom-toolbox {
  position: absolute;
  bottom: 0px;
  right: 100%;
  display: flex;
  flex-flow: column;
}
</style>
