<template>
  <div class="bottomCon" :style="{ left: left + 'px', paddingBottom: state.isHide ? 0 : '24px', bottom: state.isHide ? '-500px' : '0' }">
    <div class="topCon" v-if="state.isHide">
      <img class="topMain" src="https://img.hzanchu.com/acimg/c42279e357a9f448d08c94fd7398e882.png" />
      <img class="topArrow" @click="goBack" src="https://img.hzanchu.com/acimg/d37847ed34f86cb83543313edd1db4e4.png" />
    </div>
    <div class="blockCon">
      <div class="searchCon">
        <div class="inputCon">
          <input placeholder="请搜索..." v-model.trim="state.searchValue" />
          <img @click="searchAction" src="https://img.hzanchu.com/acimg/4941f10f45831009329d1dcefa7a0609.png" />
        </div>
        <div class="scrollTrigger" @click="triggerAction">
          <div>收起</div>
          <img :style="{ transform: 'rotate(' + (state.isHide ? 180 : 360) + 'deg)' }" src="https://img.hzanchu.com/acimg/a22988c0f91b5992afb76f73976727af.png" />
        </div>
      </div>
      <div class="listCon">
        <div class="inner" v-if="state.searchResult && state.searchResult.length">
          <template v-for="(item, index) in state.searchResult" :key="index">
            <div class="searchItem" @click="openPage(item.link)">
              <div class="searchItemName">{{ item.name }}</div>
              <img src="https://img.hzanchu.com/acimg/847bf505f8110f2b0ccc358c5447c4a1.png" />
            </div>
          </template>
        </div>
        <div class="emptyCon" v-else>暂无数据</div>
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
    },
    defaultHide: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const state = reactive({
      isHide: true,
      originList: [
        {
          name: '浙江省农机监理业务系统',
          link: 'http://223.4.70.33/login'
        },
        {
          name: '农机购置补贴辅助管理系统',
          link: 'nbnjgzbt.nyncj.ningbo.gov.cn'
        },
        {
          name: '全国农村集体经济组织登记赋码管理系统',
          link: 'https://202.127.46.230/por/service.csp?showsvc=&autoOpen=1&rnd=dgopimnfepp'
        },
        {
          name: '全国农村集体资产清产核资管理系统',
          link: 'https://jtzcjg.moa.gov.cn/acvs/main/index?sysId=1&isSwitch=0'
        },
        {
          name: '宁波市农经观察点调查平台',
          link: 'https://njtj1.kingyi.net/gcd_nb/user/login.jsp'
        },
        {
          name: '新型农业经营主体数据库系统',
          link: 'http://fylz.zjagri.cn/nnyzt/login.jsp'
        },
        {
          name: '国家农民合作社示范社管理系统',
          link: 'http://202.127.42.56/'
        },
        {
          name: '象山港基地视频监控平台',
          link: 'http://10.19.152.84:88/'
        },
        {
          name: '浙江省农村集体经济数字管理系统',
          link: 'https://zjnj.zjagri.gov.cn/'
        },
        {
          name: '宁波市渔船动态管理系统',
          link: 'http://183.131.242.70:8089/ship/main.aspx'
        },
        {
          name: '浙江省渔船精密智控系统',
          link: 'http://112.124.240.228:18003/monitoring/monitor-warning'
        },

        {
          name: '浙江省千万农民素质提升工程',
          link: 'http://nmpx.zjagri.gov.cn/system/index!index.action'
        },
        {
          name: '浙江省农民教育培训信息管理系统',
          link: 'https://zj.yszn.net.cn/state/web/zheny/index.html#/Login?VNK=7adff0cb'
        },
        {
          name: '农民教育培训信息管理系统',
          link: 'https://ims.ngx.net.cn/state/web/common/index.html#/Login?VNK=054ee9e9'
        },
        {
          name: '外来入侵物种普查管理系统',
          link: 'http://wlrq.agsoso.com/login?redirect=%2Findex'
        },
        {
          name: '中国农技推广信息平台',
          link: 'http://njtg.nercita.org.cn/user/index.shtml'
        },
        {
          name: '“浙农优品”应用',
          link: 'https://fylz.zjagri.cn/zhejiang/pub/login/initLogin.xhtml'
        },
        {
          name: '浙农帮扶',
          link: 'http://223.4.71.171/'
        },
        {
          name: '宁波市农业投入品智慧监管系统',
          link: 'https://jyy.nyzwjy.cn/quarantine/home/home_list'
        },
      ],
      searchResult: [],
      searchValue: ''
    })

    const triggerAction = () => {
      state.isHide = !state.isHide
    }

    onMounted(() => {
      if (props.defaultHide) {
        state.isHide = true
      }
      state.searchResult = state.originList
    })

    const goBack = () => {
      state.isHide = !state.isHide
    }

    const searchAction = () => {
      if (state.searchValue) {
        state.searchResult = state.originList.filter((ele) => {
          return ele.name.indexOf(state.searchValue) != -1
        })
      } else {
        state.searchResult = state.originList
      }
    }

    const openPage = (url) => { 
      window.open(url) // 打开新页面
    }

    return {
      state,
      triggerAction,
      goBack,
      searchAction,
      openPage
    }
  }
})
</script>
<style scoped lang="scss">
.bottomCon {
  transition: all 0.3s;
  position: absolute;
  bottom: 0;
  box-sizing: border-box;
  left: 540px;
  .blockCon {
    width: 841px;
    height: 500px;
    background-image: url(https://img.hzanchu.com/acimg/665fc77b35301a6d6088efc8edb0acfb.png);
    background-size: 100% 100%;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    padding-top: 25px;
    padding-bottom: 25px;
    padding-left: 36px;
    padding-right: 36px;
    box-sizing: border-box;
    .inner {
      //   height: 600px;
      width: 100%;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
    }
    .listCon {
      overflow-y: scroll;
      height: 413px;
      padding-top: 28px;
      box-sizing: border-box;
    }
  }
  .emptyCon {
    text-align: center;
  }
  .searchItem {
    width: 357px;
    height: 37px;
    background-color: rgba(0, 77, 168, 0.3);
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    margin-bottom: 20px;
    padding-left: 12px;
    padding-right: 12px;
    box-sizing: border-box;
    border: 1px solid transparent;
    cursor: pointer;
    &:nth-child(odd) {
      margin-right: 50px;
    }

    img {
    }
    .searchItemName {
      font-size: 16px;
      font-family: PangMenZhengDao;
      color: #fff;
      line-height: 16px;
    }
    &:hover {
      border: 1px solid #14e8ff;
      .searchItemName {
        color: #14e8ff;
      }
    }
  }

  .topCon {
    width: 911px;
    height: 32px;
    position: absolute;
    left: -35px;
    top: -32px;
  }
  .topMain {
  }
  .topArrow {
    position: absolute;
    top: 4px;
    left: 450px;
    cursor: pointer;
  }
}
.searchCon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
}
.inputCon {
  width: 696px;
  height: 37px;
  background: rgba(0, 77, 168, 0.3);
  border-radius: 4px;
  border: 1px solid #14e8ff;
  position: relative;
  input {
    background: none;
    outline: none;
    border: 0px;
    width: 650px;
    height: 37px;
    line-height: 37px;
    box-sizing: border-box;
    padding-left: 10px;
    color: #fff;
    font-size: 16px;
  }

  input::-webkit-input-placeholder {
    /* Chrome/Opera/Safari */
    font-size: 16px;
    font-family: PangMenZhengDao;
    color: #14e8ff;
    line-height: 16px;
  }
  input::-moz-placeholder {
    /* Firefox 19+ */
    font-size: 16px;
    font-family: PangMenZhengDao;
    color: #14e8ff;
    line-height: 16px;
  }
  input:-ms-input-placeholder {
    /* IE 10+ */
    font-size: 16px;
    font-family: PangMenZhengDao;
    color: #14e8ff;
    line-height: 16px;
  }
  input:-moz-placeholder {
    /* Firefox 18- */
    font-size: 16px;
    font-family: PangMenZhengDao;
    color: #14e8ff;
    line-height: 16px;
  }
  img {
    position: absolute;
    right: 5px;
    top: 6px;
    cursor: pointer;
  }
}
.scrollTrigger {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  cursor: pointer;
  div {
    font-size: 14px;
    font-family: YouSheBiaoTiHei;
    color: #fff;
  }
}
</style>
