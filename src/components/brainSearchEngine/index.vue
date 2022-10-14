<template>
  <div class="brainEngine">
    <div class="center">
      <div class="engineTitle">大脑搜索引擎</div>
      <img class="shutDownImg" @click="shutDown" src="https://img.hzanchu.com/acimg/aba30a5dacaca4cbb2ff1f8605670213.png" />
      <div class="searchCon">
        <div class="inputCon">
          <img src="https://img.hzanchu.com/acimg/5f295b26ac3d299efb61a0ff6564093b.png" />
          <input placeholder="请输入" v-model.trim="state.searchValue" />
        </div>
        <img @click="searchAction" class="searchBtn" src="https://img.hzanchu.com/acimg/86b88c3085670b44c53aee6f468ec2f7.png" />
      </div>

      <div class="selectArea">
        <div class="ableSelect">文件</div>
        <div class="disableSelect">应用</div>
        <div class="disableSelect">项目</div>
      </div>
      <div class="divideLine"></div>
      <div class="tableCon" v-if="state.searchResult && state.searchResult.length">
        <el-row class="scrollModalHeader">
          <el-col :span="1" class="centerCol">序号</el-col>
          <el-col :span="10">标题名</el-col>
          <el-col :span="6">来源</el-col>
          <el-col :span="3">发表时间</el-col>
          <el-col :span="2">下载次数</el-col>
          <el-col :span="2">操作</el-col>
        </el-row>
        <el-row v-for="(item, index) in state.searchResult" :key="index" :class="['normalmodalScrollItemHeight']">
          <el-col :span="1" class="centerCol">
            <div class="centerCol">
              <div class="indexBg">{{ index + 1 }}</div>
            </div>
          </el-col>
          <el-col :span="10" class="flexCenter">
            <div class="nameContainer">
              {{ item.name }}
            </div>
          </el-col>
          <el-col :span="6">中华人民共和国国务院公报</el-col>
          <el-col :span="3">{{ item.time }}</el-col>
          <el-col :span="2">{{ item.count }}</el-col>
          <el-col :span="2">
            <a :href="item.link" target="_blank" :download="item.name">
              <div class="downLoadCon"><img src="https://img.hzanchu.com/acimg/3be365f30db434750605cd730f2f2ab0.png" /><span>下载</span></div>
            </a>
          </el-col>
        </el-row>
      </div>
      <div class="emptyCon" v-else>暂无数据</div>
      <div class="pagCon">
        <el-pagination :current-page.sync="state.currentPage" :page-size="state.pageSize" layout="total,prev, pager, next" :total="state.total" @current-change="handleCurrentChange" />
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, reactive, onMounted } from 'vue'
export default defineComponent({
  props: {
    left: {
      type: Number,
      default: 540
    }
  },
  setup(props, context) {
    const state = reactive({
      showBrain: true,
      searchValue: '',
      originList: [
        {
          name: '国务院关于印发“十四五”推进农业农村现代化规划的通知',
          link: './pdfs/国务院关于印发“十四五”推进农业农村现代化规划的通知-.pdf',
          time: '2022-1-4',
          count: '12'
        },
        {
          name: '于全面推进乡村振兴加快农业农村现代化的意见',
          link: './pdfs/于全面推进乡村振兴加快农业农村现代化的意见-.pdf',
          time: '2021-12-6',
          count: '24'
        },
        {
          name: '中共中央国务院关于实施乡村振兴战略的意见',
          link: './pdfs/中共中央  国务院关于实施乡村振兴战略的意见-.pdf',
          time: '2021-10-7',
          count: '35'
        },
        {
          name: '中共中央国务院关于做好二〇二二年全面推进乡村振兴重点工作的意见',
          link: './pdfs/中共中央  国务院关于做好二〇二二年全面推进乡村振兴重点工作的意见-.pdf',
          time: '2021-11-11',
          count: '12'
        },
        {
          name: '全国农村集体经济组织登记赋码管理系统',
          link: './pdfs/中共中央  国务院印发《乡村振兴战略规划(2018-2022年)》-.pdf',
          time: '2022-2-23',
          count: '67'
        },
        {
          name: '中共中央__国务院关于坚持做好“三农”工作的若干意见',
          link: './pdfs/中共中央__国务院关于坚持...做好“三农”工作的若干意见.pdf',
          time: '2021-2-2',
          count: '145'
        }
      ],
      searchResult: [],
      total: 0,
      pageSize: 10,
      currentPage: 1
    })
    const triggerAction = () => {}
    const shutDown = () => {
      context.emit('shutCurrent')
    }
    onMounted(() => {
      state.searchResult = state.originList
      state.total = state.originList.length
    })
    const searchAction = () => {
      if (state.searchValue) {
        state.searchResult = state.originList.filter((ele) => {
          return ele.name.indexOf(state.searchValue) != -1
        })
        state.total = state.searchResult.length
      } else {
        state.searchResult = state.originList
        state.total = state.searchResult.length
      }
    }
    const handleCurrentChange = (e) => {
      state.currentPage = e
      searchAction()
    }
    return {
      state,
      triggerAction,
      shutDown,
      searchAction,
      handleCurrentChange
    }
  }
})
</script>
<style scoped lang="scss">
.brainEngine {
  transition: all 0.3s;
  .center {
    width: 1242px;
    z-index: 99999;
    height: 845px;
    background-image: url(https://img.hzanchu.com/acimg/e4df101ec80c868ac306991cf9d171a9.png);
    background-size: 100% 100%;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    box-sizing: border-box;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto !important;
  }
  .engineTitle {
    width: 290px;
    height: 50px;
    margin: 0 auto;
    text-align: center;
    font-size: 24px;
    color: #fff;
    line-height: 50px;
    letter-spacing: 2px;
    text-shadow: 0px 6px 6px #002160;
  }
  .shutDownImg {
    position: absolute;
    right: 24px;
    top: 46px;
    cursor: pointer;
  }
  .searchCon {
    margin: 0 auto;
    width: 732px;
    height: 41px;
    margin-top: 36px;
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
  }
  .searchBtn {
    cursor: pointer;
    width: 80px;
    height: 41px;
  }
}

.inputCon {
  width: 628px;
  height: 37px;
  background: rgba(0, 77, 168, 0.3);
  border-radius: 4px;
  border: 1px solid #14e8ff;
  position: relative;
  input {
    background: none;
    outline: none;
    border: 0px;
    width: 600px;
    height: 37px;
    line-height: 37px;
    box-sizing: border-box;
    padding-left: 10px;
    color: #fff;
    font-size: 16px;
    position: absolute;
    left: 25px;
    top: 0;
  }

  input::-webkit-input-placeholder {
    /* Chrome/Opera/Safari */
    // font-size: 16px;
    // font-family: PangMenZhengDao;
    // color: #14e8ff;
    // line-height: 16px;

    color: #61bcfc;
  }
  input::-moz-placeholder {
    /* Firefox 19+ */
    // font-size: 16px;
    // font-family: PangMenZhengDao;
    // color: #14e8ff;
    // line-height: 16px;

    color: #61bcfc;
  }
  input:-ms-input-placeholder {
    /* IE 10+ */
    // font-size: 16px;
    // font-family: PangMenZhengDao;
    // color: #14e8ff;
    // line-height: 16px;

    color: #61bcfc;
  }
  input:-moz-placeholder {
    /* Firefox 18- */
    // font-size: 16px;
    // font-family: PangMenZhengDao;
    // color: #14e8ff;
    // line-height: 16px;

    color: #61bcfc;
  }
  img {
    position: absolute;
    left: 12px;
    top: 11px;
  }
}
.divideLine {
  width: 1200px;
  height: 1px;
  background: linear-gradient(90deg, rgba(46, 206, 255, 0) 0%, #26ccff 54%, rgba(46, 206, 255, 0) 100%);
  margin-bottom: 5px;
}
.selectArea {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  margin-top: 38px;
  margin-bottom: 2px;
}
.ableSelect {
  cursor: pointer;
  text-align: center;
  line-height: 35px;
  width: 107px;
  height: 35px;
  background-image: url(https://img.hzanchu.com/acimg/1ef70adbfa944a686ef053bcef76c21b.png);
  background-size: 100% 100%;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}
.disableSelect {
  cursor: not-allowed;
  margin-left: 10px;
  text-align: center;
  line-height: 35px;
  width: 107px;
  height: 35px;
  background-image: url(https://img.hzanchu.com/acimg/5173cd39a840a4afdcbf49a8e3cada1b.png);
  background-size: 100% 100%;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}
.tableCon {
  padding-left: 89px;
  padding-right: 89px;
  box-sizing: border-box;
  height: 512px;
}
.emptyCon {
  height: 512px;
  text-align: center;
  padding-top: 50px;
}
.scrollModalHeader {
  height: 38px;
  font-size: 16px;
  color: #fff;
  //   padding-bottom: 10px;
  box-sizing: border-box;
  &:deep .el-col {
    line-height: 38px;
  }
}
.downLoadCon {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  cursor: pointer;
  img {
    width: 22px;
    height: 22px;
  }
  span {
    font-size: 16px;
    margin-left: 6px;
    color: #fff;
  }
}
.normalmodalScrollItemHeight {
  height: 64px;
  line-height: 64px;
  &:nth-child(even) {
    background-color: #033068;
    //   background-color: rgba(25, 152, 248, 0.1);
  }
  .nameContainer {
    width: 444px;
    line-height: 32px;
  }
}
.flexCenter {
  display: flex;
  justify-content: center;
  align-items: center;
}
.centerCol {
  text-align: center;
}
.indexBg {
  width: 24px;
  height: 24px;
  background: #043572;
  box-shadow: inset 0px 0px 3px 0px #3a8fff;
  opacity: 0.92;
  border-radius: 50%;
  line-height: 24px;
  text-align: center;
  margin: 0 auto;
  margin-top: 20px;
}
.pagCon {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
  margin-top: 20px;
  padding-right: 89px;
  box-sizing: border-box;
}

.pagCon {
  &:deep {
    .el-pagination__total {
      color: #fff !important;
    }
    .el-pagination__jump {
      color: #fff !important;
    }
    .el-pagination button:disabled {
      background-color: transparent !important;
    }
    .el-pagination__editor.el-input .el-input__inner {
      background-color: transparent !important;
      color: #fff;
    }
    .el-pager li {
      background-color: transparent !important;
    }
    .el-pagination .btn-next {
      background-color: transparent !important;
      color: #fff !important;
    }
    .el-pagination .btn-prev {
      background-color: transparent !important;
      color: #fff !important;
    }
    .el-pager li.btn-quickprev {
      color: #fff !important;
    }
    .el-pager li.btn-quicknext {
      color: #fff !important;
    }

    .number {
      &.active {
        color: #fff !important;
        background-color: #5ea0f7 !important;
      }
      color: #a6a7a9 !important;
    }
  }
}
</style>
