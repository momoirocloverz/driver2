<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <component :is="Component"></component>
      </transition>
    </router-view>
  </div>
</template>

<script>
import { onMounted, onBeforeUnmount, ref, provide } from 'vue'

export default {
  setup() {
    const unit = ref(1)
    onMounted(() => {
      unit.value = (document.body.clientWidth || document.documentElement.clientWidth) / 1920
      window.addEventListener('resize', () => {
        unit.value = (document.body.clientWidth || document.documentElement.clientWidth) / 1920
      })
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize')
    })
    provide('unit', unit)
  }
}
</script>

<style>
#app {
  font-family: PingFang-SC, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
  font-size: 16px;
  color: #fff;
  overflow: hidden;
}

@font-face {
  font-family: "PangMenZhengDao";
  src: url("../public/font/庞门正道标题体.ttf") format("opentype");
}
@font-face{
  font-family: 'YouSheBiaoTiHei';
  src: url('../public/font/YouSheBiaoTiHei-2.ttf');
  font-style: normal;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
