<template>
  <!-- 左侧地图区 -->
  <div class="wison-was-born-box">
    <div class="map-area">
      <div class="head">
        <Title text="水稻监测+农机分布" />
        <div class="tab" id="tab">
          <div v-for="(item, index) in tabList" @click="slider(index)">
            {{ item.text }}
          </div>
          <span class="slider" id="slider"></span>
        </div>
      </div>

      <iframe class="gis-iframe" id="gisIframe" :src="iframeUrl" frameborder="0" width="100%" height="80%" />
    </div>
    <!-- 右侧指标区 -->
    <div class="data-area">
      <!-- ==== 处置结果 ==== -->
      <Title text="处置信息" />
      <div class="message">
        <div class="item">
          <span>处置状态</span>
          <span>{{ messageInfo?.backlogStatus ? (messageInfo?.backlogStatus === '1' ? '代办' : '已处理') : '-' }}</span>
        </div>
        <div class="item">
          <span>下发时间</span>
          <span>{{ messageInfo?.backlogStatus ? messageInfo?.createTime : '-' }}</span>
        </div>
        <div class="item">
          <span>处置人员</span>
          <span>{{ messageInfo?.backlogStatus ? '李永华' : '-' }}</span>
        </div>
        <div class="item">
          <span>处置部门</span>
          <span>{{ messageInfo?.backlogStatus ? '宁波市农业农村局' : '-' }}</span>
        </div>
        <!-- <div class="item">
          <span>处置反馈</span>
          <span>{{ messageInfo.backlogAbstract || '-' }}</span>
        </div> -->
      </div>
      <!-- ==== 分析结果 ==== -->
      <Title text="分析结果">
        <div class="status">总体良好</div>
      </Title>
      <div class="result">
        <div class="top">
          <LooksLikeChart :data="tableData" />
          <div class="table">
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="name" label="长势" />
              <el-table-column prop="value" label="面积（公顷）" />
              <el-table-column prop="percent" label="占比（%）" />
            </el-table>
          </div>
        </div>
        <div class="bottom" v-if="areaData?.city_arr?.length">
          <AreaChart :data="areaData" />
        </div>
      </div>
      <!-- ==== 地块列表 ==== -->
      <Title text="地块列表" />
      <div class="land">
        <div class="header">
          <span>地块编号</span>
          <span>长势</span>
          <span>面积（亩）</span>
          <span>操作</span>
        </div>
        <vue3-seamless-scroll :list="progressList" class="scroll" hover="true" step="0.2">
          <div v-for="(item, index) in progressList" :key="index">
            <span>{{ item.id }}</span>
            <span>{{ item.type }}</span>
            <span>{{ item.value }}</span>
            <span @click="location(item)">{{ item.handle }}</span>
          </div>
        </vue3-seamless-scroll>
      </div>
      <!-- ==== 说明 ==== -->
      <!-- <div class="instructions">
        <p>说明：</p>
        <p>方案1：方案内容描述方案内容描述方案内容描述方案内容描述方案内容描述…</p>
        <p>方案2：方案内容描述方案内容描述方案内容描述方案内容描述方案内容描述…</p>
      </div> -->
    </div>

    <img class="message-icon" src="./images/组8564@2x.png" @click="sendNotice" />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
import Title from './modules/Title.vue'
import { _getMessageInfoList, _sendMessageInfo } from '@/service/api'
import LooksLikeChart from './modules/LooksLikeChart.vue'
import AreaChart from './modules/AreaChart.vue'
import { useRoute } from 'vue-router'
import { Vue3SeamlessScroll } from 'vue3-seamless-scroll'
import { ElMessage } from 'element-plus'

const route = useRoute()
const iframeUrl = ref('')
const tabList = ref([
  { text: '水稻长势', value: '1' },
  { text: '稻瘟病', value: '2' }
])

const iframeEL = ref(null)
const tableData = ref([])
const looksLikeData = ref([])
const areaData = ref({})
const messageInfo = ref({})
const myInterval = ref(null) // 定时器
const progressList = ref([
  { id: 1, type: '健壮', value: 0.3, handle: '定位' },
  { id: 2, type: '良好', value: 0.5, handle: '定位' },
  { id: 3, type: '较差', value: 0.6, handle: '定位' },
  { id: 4, type: '良好', value: 0.5, handle: '定位' },
  { id: 5, type: '较差', value: 0.5, handle: '定位' }
])

const getData = (type) => {
  fetch('./mock.json')
    .then((response) => response.json())
    .then((data) => {
      tableData.value = data[type].result
      areaData.value = data[type].area
    })
}
const getNotice = async () => {
  // 获取消息返回接口
  const result = await _getMessageInfoList({
    messageTemplateType: 1,
    messageStatus: 2,
    pageSize: 10,
    pageNum: 1
  })
  const { data = {} } = result
  const { list = [] } = data
  if (list.length) {
    messageInfo.value = list[0]
  }
}
const initList = () => {
  // 轮询获取接口
  myInterval.value = window.setInterval(() => {
    setTimeout(() => {
      getNotice() //调用接口的方法
    }, 1)
  }, 5000)
}
const sendNotice = async () => {
  // 发送接口
  const data = {
    backlogTemplateCode: 'BACKLOG_2378491436',
    receiveUserIds: [13, 14, 17],
    params: {
      countyName: '宁波',
      streetName: '奉化',
      xyName: '121.477212,29.6892312',
      warnName: '奉化区西坞街道，监测分析发现共计13亩晚稻，有特重病虫害。',
      WgradeName: '紧急',
      squareName: '13亩'
    }
  }
  const result = await _sendMessageInfo(data)
  ElMessage.success('推送成功')
  getNotice()
}

const slider = (index) => {
  let tab_el = document.getElementById('tab'),
    slider_el = document.getElementById('slider')
  slider_el.style.left = (tab_el.clientWidth / tabList.value.length) * index + (tab_el.clientWidth / tabList.value.length - slider_el.clientWidth) / 2 + 'px'
  if (index === 1) {
    // 稻瘟病tab
    getData('dis')
    iframeUrl.value = '/ningbo_twin_gis/LSPT_BCH.html'
  } else {
    // 水稻长势tab
    getData('sdzs')
    iframeUrl.value = '/ningbo_twin_gis/LSPT_SDZS.html'
  }
}

// 向子页面传递消息
const location = (item) => {
  let message = {
    key: 'panToSelect',
    value: {
      id: item.id
    }
  }
  sendMessage('gisLayerMessage', message)
}

const sendMessage = (type, data) => {
  iframeEL.value.contentWindow.postMessage({ type: type, data: data }, '*')
}

onMounted(() => {
  // sendNotice();
  getNotice()
  getData()
  nextTick(() => {
    iframeEL.value = document.getElementById('gisIframe')
    if (route.query.type === 'dis') {
      getData('dis')
      slider(1)
    } else {
      getData('sdzs')
      slider(0)
    }
    if (route.query.id) {
      if (iframeEL.value.attachEvent) {
        iframeEL.value.attachEvent('onload', () => {
          location({ id: route.query.id })
        })
      } else {
        iframeEL.value.onload = () => {
          location({ id: route.query.id })
        }
      }
    }
  })
})
// // 销毁定时器
// onUnmounted(() => {
//   clearInterval(myInterval.value)
// })
</script>

<style lang="scss" scoped>
.wison-was-born-box {
  padding-top: 120px;
  display: flex;
  justify-content: space-between;
  position: relative;
}
.message-icon {
  position: fixed;
  z-index: 999;
  bottom: 30px;
  width: 40px;
  left: 60%;
  cursor: pointer;
}
.map-area {
  width: 1180px;
  margin-left: 44px;
  .head {
    display: flex;
    align-items: center;
    .tab {
      display: flex;
      align-items: center;
      width: 400px;
      position: relative;
      height: 50px;
      margin-left: 70px;
      div {
        flex: 1;
        font-size: 30px;
        font-family: PangMenZhengDao-3, PangMenZhengDao;
        color: #fff;
        text-align: center;
        cursor: pointer;
      }
      span {
        width: 140px;
        height: 4px;
        background: #ade8ff;
        position: absolute;
        bottom: 0;
        transition: all 0.3s;
      }
    }
  }
}

.data-area {
  width: 611px;
  margin-right: 44px;
  overflow: hidden;
  .message {
    margin: 24px 0 24px 10px;
    .item {
      width: 600px;
      height: 34px;
      background: linear-gradient(90deg, rgba(23, 151, 255, 0.24) 0%, rgba(23, 151, 255, 0) 100%);
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      span:nth-of-type(1) {
        font-size: 16px;
        color: #14e8ff;
        margin-left: 20px;
      }
      span:nth-of-type(2) {
        font-size: 16px;
        color: #fff;
        margin-left: 60px;
      }
      &::before {
        content: '';
        display: block;
        width: 2px;
        height: 100%;
        background: #14e8ff;
      }
    }
  }
  .status {
    width: 80px;
    height: 26px;
    background: #2f96ff;
    border-radius: 2px;
    font-size: 14px;
    font-family: PangMenZhengDao-3, PangMenZhengDao;
    text-align: center;
    line-height: 26px;
    margin: 0 30px 0 auto;
  }
  .result {
    .top {
      overflow: hidden;
      display: flex;
      align-items: center;
      .table {
        width: 404px;
        margin-left: auto;
      }
    }
    .bottom {
      margin: 10px 0 24px 0;
    }
  }
  .land {
    overflow: hidden;
    margin-top: 24px;
    .header {
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(23, 151, 255, 0.4);
      padding: 0 10px;
      span {
        flex: 1;
      }
    }
    .scroll {
      height: 165px;
      overflow: hidden;
      div {
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
        span {
          flex: 1;
          &:nth-of-type(4) {
            color: #00deff;
            cursor: pointer;
          }
        }
      }
    }
  }
  .instructions {
    font-size: 14px;
    color: #90b1d2;
    line-height: 20px;
  }
}

.gis-iframe {
  margin-top: 30px;
}
</style>

<style lang="scss">
.wison-was-born-box {
  .el-table {
    background: transparent;
    .el-table__header {
      tr {
        background: transparent;
      }
      .el-table__cell {
        background: transparent;
        .cell {
          background: rgba(23, 151, 255, 0.4);
          color: #fff;
          line-height: 28px;
        }
      }
    }

    .el-table__row {
      background: transparent;
      color: #fff;
      &:nth-of-type(even) {
        background: rgba(23, 151, 255, 0.1);
      }
      .el-table__cell {
        border: none;
        .cell {
          line-height: 28px;
        }
      }
    }
    .el-table__inner-wrapper::before {
      background: transparent;
    }
  }
}
</style>
