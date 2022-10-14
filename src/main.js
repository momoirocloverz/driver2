import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import 'lib-flexible'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import locale from 'element-plus/lib/locale/lang/zh-cn'
import 'dayjs/locale/zh-cn'

import '@/assets/css/animation.scss'
import '@/assets/css/element.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)
app.use(router).use(ElementPlus, { locale }).mount('#app')
// 引用element的icon图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})
