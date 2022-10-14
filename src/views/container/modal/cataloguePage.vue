<template>
  <div class="catalogue-page">
      <div class="left">
        <div @click="handleTabChange('产业')" :class="selectTab == '产业' ? 'select-btn' :'btn'">产业</div>
        <div @click="handleTabChange('农村')" :class="selectTab == '农村' ? 'select-btn' :'btn'">农村</div>
        <div @click="handleTabChange('农民与主体')" :class="selectTab == '农民与主体' ? 'select-btn' :'btn'">农民与主体</div>
        <div @click="handleTabChange('资源')" :class="selectTab == '资源' ? 'select-btn' :'btn'">资源</div>
        <div @click="handleTabChange('应用场景')" :class="selectTab == '应用场景' ? 'select-btn' :'btn'">应用场景</div>
      </div>
      <div class="right">
        <div class="title">
          <div class="title-left">类目总数</div>
          <div class="title-right"><span>{{selectData?.titleNum||0}}</span>个</div>
        </div>
        <div class="data-title">
          类目名称
          <span>个数（个）</span>
        </div>
        <div class="data-all-list-box">
          <div class="data-list-box" v-for="(item,index) in selectData.value" :key="index">
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="item.name"
            placement="top"
          >
            <b>{{item.name||''}}</b>
          </el-tooltip>
           <span>{{item.num||0}}</span>
          </div>
        </div>
      </div>
  </div>
</template>
<script setup>
import { onMounted , ref } from 'vue'
const selectTab = ref('产业')
const selectData = ref([]);
const data = ref([
  {
    title: '产业', titleNum: 16, value:[{
      name:'粮食',num:2
    },{
      name:'蔬菜',num:2
    },{
      name:'茶叶',num:1
    },{
      name:'水果',num:1
    },{
      name:'干果',num:1
    },{
      name:'花卉竹木',num:1
    },{
      name:'中药材',num:2
    },{
      name:'种业',num:2
    },{
      name:'畜牧',num:2
    },{
      name:'水产',num:1
    },{
      name:'农产品加工',num:1
    },{
      name:'农家乐',num:1
    },{
      name:'传统农业特色小吃',num:1
    }]
  },
  {
    title: '农村', titleNum: 22, value:[{
      name:'现代农业产业园',num:1
    },{
      name:'全国农村创业创新园',num:1
    },{
      name:'农业产业强镇',num:1
    },{
      name:'星创天地(国家级、省级、市级)',num:1
    },{
      name:'特色农产品优势区',num:1
    },{
      name:'一村一品示范村、镇',num:1
    },{
      name:'大学生创业园',num:1
    },{
      name:'未来乡村',num:1
    },{
      name:'数字乡村（县、村）',num:1
    },{
      name:'美丽乡村（达标村、特色精品村、示范县、示范镇、小集镇式中心村、梳理式村庄）',num:1
    },{
      name:'美丽休闲乡村',num:1
    },{
      name:'景区村庄',num:1
    },{
      name:'文明村',num:1
    },{
      name:'善治村',num:1
    },{
      name:'美丽庭院',num:1
    },{
      name:'集体经济薄弱村',num:1
    },{
      name:'农产品电商示范村、镇',num:1
    },{
      name:'文化礼堂',num:1
    },{
      name:'文化遗产（乡村博物馆、节气村、历史文化村落、古建筑遗址、非物质文化等）',num:1
    },{
      name:'农贸市场',num:1
    },{
      name:'农产品综合交易市场',num:1
    },{
      name:'人居环境（垃圾分类、公厕、沼气等）',num:1
    }]
  },{
    title: '农民与主体', titleNum: 15, value:[{
      name:'主体',num:9
    },{
      name:'人才',num:4
    },{
      name:'农民',num:2
    }]
  },{
    title: '资源', titleNum: 17, value:[{
      name:'土地',num:6
    },{
      name:'农业设施',num:1
    },{
      name:'渔港渔区',num:1
    },{
      name:'服务机构',num:3
    },{
      name:'技术装备',num:4
    },{
      name:'监测点',num:1
    },{
      name:'生态管理',num:1
    }]
  },{
    title: '应用场景', titleNum: 30, value:[{
      name:'应用场景',num:30
    }]
  }
])
const handleTabChange = (name) => { 
  selectTab.value = name;
  selectData.value = JSON.parse(JSON.stringify(data.value)).filter(item => item.title == name)[0]
}
onMounted(() => { 
  handleTabChange('产业')
})
</script>
<style scoped lang="scss">
.catalogue-page{
  display: flex;
  .left{
    width: 30%;
    margin-right: 44px;
    .btn{
      display: flex;
      align-items: center;
      justify-content: center;
      width: 167px;
      height: 46px;
      margin-bottom: 64px;
      background: url('https://img.hzanchu.com/acimg/1f33998efaf39fe5be0a1bebaa589edb.png') no-repeat;
      background-size: 100% 100%;
      font-size: 20px;
      font-family: MicrosoftYaHei-, MicrosoftYaHei;
      font-weight: normal;
      color: #39D9FF;
    }
    .select-btn{
      display: flex;
      align-items: center;
      justify-content: center;
      background: url('https://img.hzanchu.com/acimg/1500dcf4bf26e05cae62e956b22edf9b.png') no-repeat ;
      background-size: 100% 100% ;
      width: 167px;
      height: 46px;
      font-size: 20px;
      font-family: Microsoft YaHei-Semibold, Microsoft YaHei;
      font-weight: 600;
      color: #39D9FF;
      margin-bottom: 64px;
    }
  };
  .right{
    width: 366px;
    height: 505px;
    background: rgba(5,37,80,0.5020);
    border: 1px solid #1FBAF6;
    border-radius: 20px;
    padding-top: 24px;
    box-sizing: border-box;
    overflow: auto;
    padding-left: 41px;
    padding-right: 41px;
    .title{
      width: 216px;
      height: 50px;
      background: url('https://img.hzanchu.com/acimg/e6e1453a820df63a0dc260e50851ed4b.png') no-repeat;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      padding: 0 30px;
      font-size: 16px;
      font-family: MicrosoftYaHei-, MicrosoftYaHei;
      font-weight: normal;
      color: #CCEAFF;
      margin-left: 32px;
      box-sizing: border-box;
      margin-bottom: 22px;
      .title-left{
        margin-right: 47px;
      }
      .title-right{
        span{
          font-size: 20px;
          font-family: MicrosoftYaHei-, MicrosoftYaHei;
          font-weight: normal;
          color: #39D9FF;
          margin-right: 4px;
        }
      }
    }
    .data-title{
      font-size: 14px;
      font-family: MicrosoftYaHei-, MicrosoftYaHei;
      font-weight: normal;
      color: #A1CEEF;
      padding-left: 62px;
      padding-right: 19px;
      box-sizing: border-box;
      margin-bottom: 12px;
      span{
        margin-left: 60px;
        width: 70px;
      }
    }
    .data-all-list-box{
      height: 321px;
      overflow: auto;
      .data-list-box{
        box-sizing: border-box;
        margin-bottom: 20px;
        width: 284.09px;
        height: 36px;
        background: url('https://img.hzanchu.com/acimg/fe8ebe3fbb0f6738638416754328dc12.png') no-repeat ;
        background-size: 100% 100% ;
        padding-left: 58px;
        padding-right: 70px;
        display: flex;
        align-items: center;
        font-size: 14px;
        font-family: MicrosoftYaHei-, MicrosoftYaHei;
        font-weight: normal;
        color: #A1CEEF;
        line-height: 20px;
        b{
          display: block;
          width: 128px;
          margin-right: 33px;
          font-weight:500;
          overflow : hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2; /* 限制在一个块元素显示的文本的行数 */
          -webkit-box-orient: vertical; /* 垂直排列 */
          word-break: break-all;  /* 内容自动换行 */
        }
        span{
          display: block;
          width: 20px;
        }
      }
    }
  }
}
</style>
