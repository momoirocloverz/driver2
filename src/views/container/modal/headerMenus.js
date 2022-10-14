// 顶部导航菜单,需要遵循展示的方向从左到右
/* 
  title:菜单文字
  url:跳转的地址
  openType:跳转的方式 // _self _blank 默认_blank
  name:跳转的路由
  isCenter:居中的菜单
*/
export const headerMenus = [
  {
    title: '能力中心',
    name: 'abilityCenter'
    // url: 'https://ph.anchu.cn/shareScreen/eyJzY3JlZW5JZCI6MzY2MX0='
  },
  {
    title: '应用场景',
    name: 'applicationScenarios'
    // url: 'https://ph.anchu.cn/shareScreen/eyJzY3JlZW5JZCI6MzY5MX0='
  },
  {
    title: '宁波数字乡村大脑',
    name: 'RuralBrain',
    isCenter: true
  },
  {
    title: '全域时空图',
    name: 'index'
  },
  {
    title: '数字孪生',
    name: 'wilsonWasBorn'
    // url: 'https://ph.anchu.cn/shareScreen/eyJzY3JlZW5JZCI6NDE5Nn0='
  }
]
