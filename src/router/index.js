import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/RuralBrain',
    component: () => import('@/views/container/container'),
    children: [
      {
        path: '/indexCopy',
        name: 'indexCopy',
        component: () => import('@/views/index/indexCopy'),
        meta: {
          title: '宁波数字乡村大脑-全域时空图'
        }
      },
      {
        path: '/wilsonWasBorn',
        name: 'wilsonWasBorn',
        component: () => import('@/views/WilsonWasBorn/index'),
        meta: {
          title: '宁波数字乡村大脑-孪生平台'
        }
      },
      {
        path: '/index',
        name: 'index',
        component: () => import('@/views/index/index'),
        meta: {
          title: '宁波数字乡村大脑-全域时空图'
        }
      },
      {
        path: '/fengHuaIndex',
        name: 'fengHuaIndex',
        component: () => import('@/views/fengHuaIndex/index'),
        meta: {
          title: '奉化区农业产业一张图'
        }
      },
      {
        path: '/RuralBrain',
        name: 'RuralBrain',
        component: () => import('@/views/ruralBrain/index.vue'), // 临时用来展示
        meta: {
          title: '宁波数字乡村大脑'
        }
      },
      {
        path: '/RuralBrain/districtPage',
        name: 'districtPage',
        component: () => import('@/views/ruralBrain/districtPage.vue'), // 区长页面
        meta: {
          title: '宁波数字乡村大脑'
        }
      },
      {
        path: '/RuralBrain/businessCoreIndicatorPage',
        name: 'businessCoreIndicatorPage',
        component: () => import('@/views/ruralBrain/businessCoreIndicatorPage.vue'), // 业务核心指标页面
        meta: {
          title: '宁波数字乡村大脑'
        }
      },
      {
        path: '/abilityCenter',
        name: 'abilityCenter',
        component: () => import('@/views/iframePage/index.vue'), // 能力中心
        meta: {
          title: '能力中心',
          url: 'https://ph.anchu.cn/shareScreen/eyJzY3JlZW5JZCI6MzY2MX0='
        }
      },
      {
        path: '/applicationScenarios',
        name: 'applicationScenarios',
        component: () => import('@/views/iframePage/index.vue'), // 能力中心
        meta: {
          title: '应用场景',
          url: 'https://ph.anchu.cn/shareScreen/eyJzY3JlZW5JZCI6MzY5MX0='
        }
      },
      // {
      //   path: '/digitalTwins',
      //   name: 'digitalTwins',
      //   component: () => import('@/views/iframePage/index.vue'), // 数字孪生
      //   meta: {
      //     title: '数字孪生',
      //     url: 'https://ph.anchu.cn/shareScreen/eyJzY3JlZW5JZCI6NDE5Nn0='
      //   }
      // }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach((to, from, next) => {
  let token = from.query.token
  if (token) {
    localStorage.setItem('token', token)
  }
  next()
})
export default router
