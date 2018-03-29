<template>
  <div class="main" :class="{newBox:newBox}">
    <div class="fr" style="margin-top:16px;margin-right:32px;">
        <screenfull class="screenfull right-menu-item"></screenfull>
    </div>
    <div class="returnBack" @click="goBack"></div>
    <div class="mainTitle">
      <div class="title">实验教学统计分析平台</div>
    </div>
    <div class="topMap">
      <div class="t_left">
        <div id="carsu" ref="carsu" :class="{anim:animate==true}" @click="stopInt">
          <div class="cars">

            <div class="tlTop">
              <div class="title">实验开出趋势</div>
               <lineSth id="adss2" :style="{width:'320px',height:'30vh'}" :dataNum="TdData" key="trandc1"></lineSth>
            </div>
             <div class="tlTop">
              <div class="title">学段开出率</div>
              <stageCount :style="{width:'320px', height:'30vh'}" :unitId="unitId" key="randa1" ></stageCount>
            </div>

          </div>
          <div class="cars">
            <div class="tlTop">
               <div class="title">平台流量统计</div>
                <div class="countent">
                    <span>{{uvTotal}}
                      <br>
                      <span>用户总数</span>
                    </span>
                    <span>{{uvToday}}
                      <br>
                      <span>当日UV</span>
                    </span>
                    <span>{{uvMax}}
                      <br>
                      <span>最高UV</span>
                    </span>
                </div>
              <lineSth id="adss1" :style="{width:'320px',height:'30vh'}" :dataNum="uvData" key="uv"></lineSth>
            </div>
            <div class="tlTop">
                  <div class="title">资源统计</div>
                  <PieDot :style="{width:'320px',height:'30vh'}" :dataNum="srcCount"></PieDot>
                </div>
          </div>
          <div class="cars">
              <div class="tlTop">
                  <div class="title">实验知识自测情况</div>
                  <moreSth id="selfTest" :style="{width:'320px',height:'30vh'}" :dataNum="testData"></moreSth>
                </div>
                 <div class="tlTop">
                   <div class="title">实验资源使用情况</div>
                  <moreSth id="srcUse" :style="{width:'320px',height:'30vh'}" :dataNum="srcData"></moreSth>
                </div>
          </div>
          <div class="cars">
            <div class="tlTop">
              <div class="title">实验开出趋势</div>
               <lineSth id="adss3" :style="{width:'320px',height:'30vh'}" :dataNum="TdData" key="trandc"></lineSth>
            </div>
             <div class="tlTop">
              <div class="title">学段开出率</div>
              <stageCount  id="adss4" :style="{width:'320px', height:'30vh'}" :unitId="unitId" key="randa"></stageCount>
            </div>
          </div>
        </div>
        </div>
      <div class="t_center">
        <div class="fdsx" >
          <img src="~assets/visual/fangda.png" v-if="!newBox" alt="放大" title="点击后：‘隐藏两侧信息，只显示数据分析平台’" @click="showNewBox('big')">
          <img src="~assets/visual/suoxiao.png" v-else alt="缩小" title="点击后：‘显示全部信息"  @click="showNewBox('little')">
        </div>
        <div class="title">数据分析平台({{orgName}})</div>
        <div class="tc_top">
          <div class="ttLeft">
            <div class="title">实验开出排行榜</div>
            <rank :unitId="orgId"></rank>
          </div>
          <div class="ttRight">
            <template v-if="orgType!='223'">
              <cityMap @showSchl="showSchl"  :unitId="orgId" :mapLoaded="loadMapJs"  :unitName="orgName" :key="orgId+'city'" ref="map"></cityMap>
            </template>
            <template v-if="orgType=='223'">
              <district  :unitId="orgId" :unitName="orgName" :mapLoaded="loadMapJs" key="district" ref="map"></district>
            </template>
          </div>
        </div>
        <img src="~assets/visual/return.png" alt="图片引入失败"  class="rtIn" @click="reback"   v-if="orgType!=unitType">
        <div class="tc_below">
          <div  class="tcbR">
            <div  class="pbar" v-for="(item,i) in subCountData" :key="item.color" >
              <pctBar  :id="`canvas${i}`" :color="item.color" :stagesub="item.stagesub" :percent="item.percent" ></pctBar>
            </div>
          </div>
        </div>
      </div>
      <div class="t_right">
        <div class="title">实验开出实时情况</div>
        <notice :unitId="unitId"></notice>
      </div>
    </div>
  </div>
</template>

<script>
import { loadAMapJS } from 'utils/asyncLoad';
import PieDot from "components/Charts/pieDoughnut";
import Screenfull from "@/components/Screenfull";
import lineSth from "components/Charts/lineSmooth";
import moreSth from "components/Charts/moreSmooth";
import pctBar from "components/Charts/percentBar";
import cityMap from "./cityMap";
import rank from "./rank";
import notice from "./notice";
import stageCount from "./stageCount";
import district from "./district";
import { openCountAll, getSourceCount } from "api/sourceIndex";
import {
  getTestData,
  getUvInfo,
  gettrandency,
  getsrcUseData
} from "api/visual";
import { mapGetters } from "vuex";
export default {
  components: {
    PieDot,
    lineSth,
    moreSth,
    cityMap,
    rank,
    pctBar,
    Screenfull,
    notice,
    stageCount,
    district
  },
  data() {
    return {
      loadMapJs: null,
      animate: true,
      tab: 0,
      newBox:false,
      unitId: null,
      unitName: null,
      unitType: null,
      orgId: null,
      orgType: null,
      orgName: null,
      subQueryData: {
        unitId: null,
        groups: "subject,stage"
      },
      subCountData: [],
      testData: [],
      intList: [],
      uvTotal: 0,
      uvMax: 0,
      uvToday: 0,
      timer: null,
      uvData: {},
      TdData: {},
      srcData: [],
      srcCount: []
    };
  },
  created() {
    this.$store.dispatch("GetUserUnit").then(res => {
      this.getUnit();
    });
    this.loadMapJs = loadAMapJS();
    // loadAMapJS().then(() => {
    //   this.mapLoaded = true;
    // });
  },
  watch: {
    orgId() {
      this.getsubCount();
    }
  },
  computed: {
    ...mapGetters(["userUnit"])
  },
  methods: {
    getUnit() {
      this.unitId = this.$store.state.commonData.userUnit.unitId;
      this.orgId = this.$store.state.commonData.userUnit.unitId;
      this.unitType = this.$store.state.commonData.userUnit.unitType;
      this.orgType = this.$store.state.commonData.userUnit.unitType;
      this.unitName = this.$store.state.commonData.userUnit.unitName;
      this.orgName = this.$store.state.commonData.userUnit.unitName;
      this.interval(); // 在钩子函数中调用我在method 里面写的scroll()方法，注意此处不要忘记加this,我在这个位置掉了好几次坑，都是因为忘记写this。
      this.getallTestData();
      this.getUvInfoData();
      this.gettrandencyData();
      this.getsrcUse();
      this.getSrcCount();
    },
    showSchl(val) {
      const vm = this;
      vm.orgType = val.level == "city" ? "222" : "223";
      var a = val.level == "city" ? "a" : "b";
      vm.orgId = val.adcode + "";
      vm.orgName = val.name;
      vm.intList[a] = { orgId: vm.orgId, orgName: vm.orgName };
    },

    goBack(){
      this.$router.go(-1);
    },
    reback() {
      const vm = this;
      vm.orgId = null;
      if (vm.orgType == "222") {
        vm.orgType = "221";
        vm.orgId = vm.unitId;
        vm.orgName = vm.unitName;
      } else if (vm.orgType == "223") {
        vm.orgType = "222";
        if (vm.intList["a"]) {
          vm.orgId = vm.intList["a"].orgId;
          vm.orgName = vm.intList["a"].orgName;
        } else {
          vm.orgId = vm.unitId;
          vm.orgName = vm.unitName;
        }
      }
    },
    //获取自测试题报表
    getallTestData() {
      const vm = this;
      vm.testData = [];
      getTestData({ unitId: this.orgId }).then(res => {
        res.forEach(e => {
          var month = [];
          var data = [];
          for (var x in e.monthCount) {
            month.push(x);
            data.push(e.monthCount[x]);
          }
          e = {
            name: e.stageName,
            month: month,
            type: "line",
            stack: "总量",
            data: data,
            smooth: true,
            showSymbol: false
          };
          vm.testData.push(e);
        });
      });
    },
    //获取资源类目统计
    getSrcCount() {
      const vm = this;
      getSourceCount().then(res => {
        res.forEach(e => {
          var data = {
            value: e.ersCount,
            name: e.resourceTypeName
          };
          vm.srcCount.push(data);
        });
      });
    },
    getUvInfoData() {
      const vm = this;
      getUvInfo({ dailyCount:5 }).then(res => {
        vm.uvTotal = res.total;
        vm.uvToday = res.today;
        vm.uvMax = res.max;
        var months = [];
        var datas = [];
        var list = res.history;
        list.forEach(e => {
          months.push(e.date);
          datas.push(e.count);
        });
        vm.uvData = {
          months: months,
          datas: datas
        };
      });
    },
    //资源使用统计
    getsrcUse() {
      const vm = this;
      getsrcUseData({ months: 5 }).then(res => {
        for (var x in res) {
          var month = [];
          var arr = [];
          res[x].forEach(e => {
            month.push(e.date);
            arr.push(e.count);
          });
          var data = {
            name: x,
            month: month,
            type: "line",
            stack: "总量",
            data: arr,
            smooth: true,
            showSymbol: false
          };
          vm.srcData.push(data);
        }
      });
    },
    //趋势使用统计
    gettrandencyData() {
      const vm = this;
      gettrandency({ days: 7 }).then(res => {
        var months = [];
        var datas = [];
        var list = res;
        list.forEach(e => {
          months.push(e.date);
          datas.push(e.count);
        });
        vm.TdData = {
          months: months,
          datas: datas
        };
      });
    },
    getsubCount() {
      var colors = [
        "#fd6631",
        "#ffd426",
        "#73e4e8",
        "#6359db",
        "#25bf95",
        "#f59964",
        "#178cf3"
      ];
      const vm = this;
      vm.subCountData = [];
      this.subQueryData.unitId = this.orgId;
      openCountAll(this.subQueryData).then(res => {
        if (res && res.length > 0) {
          res.forEach((e, index) => {
            var percent;
            if (!e.finalAmount || e.finalAmount == 0) {
              percent = 0;
            } else if (!e.totalAmount || e.totalAmount == 0) {
              percent = 100;
            } else {
              percent = Math.round(e.finalAmount / e.totalAmount * 100);
              if (percent > 100) {
                percent = 100;
              }
            }
            var subOb = {
              stagesub: e.stageName + e.subjectName,
              percent: percent,
              color: colors[index]
            };
            vm.subCountData.push(subOb);
          });
        }
      });
    },
    stopInt(){
      if(window.visual_index_timer){
        clearInterval(window.visual_index_timer);
        window.visual_index_timer=null;
        this.$message({type:'success',message:"已暂停，再次点击将继续滚动"});
      }else{
        this.interval();
        this.$message({type:'success',message:"滚动中"});
      }

    },
    interval() {
      window.visual_index_timer = setInterval(scroll, 10000);
      const vm = this;
      function scroll() {
        vm.tab = vm.tab + 1;
        let carsu = vm.$refs.carsu;
        vm.animate = true;
        if (vm.tab == 1) {
          carsu.style.marginTop = "-90vh";
        }
        if (vm.tab == 2) {
          carsu.style.marginTop = "-180vh";
        }
        if (vm.tab == 3) {
          carsu.style.marginTop = "-270vh";
        }
        if (vm.tab == 4) {
          clearInterval(window.visual_index_timer);
          vm.animate = false;
          carsu.style.marginTop = "0";
          vm.tab = 0;
          window.visual_index_timer = setInterval(scroll, 10000);
        }
      }
    },
    showNewBox(text){
      if(text==='big'){
        this.newBox=true;
      }
      if(text==='little'){
        this.newBox=false;
      }
    }
  },
  beforeRouteLeave: (to, from, next) => {
    if (window.visual_index_timer) {
      clearInterval(window.visual_index_timer);
      window.visual_index_timer = null;
    }
    if (window.timer_visual_notice) {
      clearInterval(window.timer_visual_notice);
      window.timer_visual_notice = null;
    }
    if (window.visual_rank_timer) {
      clearInterval(window.visual_rank_timer);
      window.visual_rank_timer = null;
    }
    next();
  }
};
</script>

<style lang="less" scoped>
div {
  font-size: 12px;
  color: #73e4e8;
}
.main {
  // padding: 8px;
  // position: fixed;
  position: absolute;
  width: 100vw;
  height: 100%;
  min-width: 1280px;
  margin: 0 auto;
  background: url(~assets/visual/bg.png);
  // overflow-x: hidden;
  // overflow-y: hidden;
    overflow-x: auto;
    overflow-y: hidden;

  .mainTitle {
    width: 100%;
    height: 7%;
    box-sizing: border-box;
    background-size: 100% 62px;
    .title {
      width: 31vw;
      margin: 0 auto;
      font-size: 24px;
      line-height: 3vw;
      height: 3vw;
      background: url(~assets/visual/title.png) no-repeat;
      background-size: 100% 100%;
    }
  }
  .title {
    line-height: 36px;
    text-align: center;
    white-space: nowrap;
    font-size: 14px;
    font-weight: bold;
  }
}
//1280*720
.topMap {
  position: absolute;
  height: 97%;
  width: 100%;
  padding: 16px 16px 16px;
  box-sizing: border-box;
  .t_left {
    width: 320px;
    height: 90vh;
    box-sizing: border-box;
    float: left;
    position: relative;
    overflow: hidden;
    #carsu {
      width: 100%;
      height: 340vh;
    }
    .anim {
      transition: all 0.5s;
    }
    .cars {
      width: 100%;
      height: 90vh;
      position: relative;
      padding: 0;
      margin: 0;
    }
    // >div{
    //   width:100%;
    //   height:50%;
    //   position: relative;
    //   padding:0;
    //   margin:0;
    // }
    .title {
      font-size: 16px;
      line-height: 36px;
    }
    .tlTop {
      width: 100%;
      height: calc(~"50% - 16px");
      &:nth-child(1) {
        margin-bottom: 16px;
      }
      &:nth-child(2) {
        margin-top: 16px;
      }
      background: url(~assets/visual/stage.png) no-repeat;
      background-size: 100% 100%;
      box-sizing: border-box;
      float: left;
      .countent {
        height: 40px;
        width: 100%;
        text-align: center;
        padding-top: 8px;
        span {
          display: inline-block;
          line-height: 16px;
          padding: 0 2px;
          span {
            color: #306cae;
          }
        }
      }
    }
    .tlbelow {
      width: 100%;
      height: calc(~"100% - 20px");
      background: url(~assets/visual/stage.png) no-repeat;
      background-size: 100% 100%;
      box-sizing: border-box;
      float: left;

      .countent {
        height: 32px;
        width: 100%;
        text-align: center;
        span {
          display: inline-block;
          line-height: 16px;
          padding: 0 2px;
          span {
            color: #306cae;
          }
        }
      }
    }
  }
  .t_center {
    width: calc(~"100% - 608px");
    margin: 0 16px;
    padding: 0 16px;
    height: 90vh;
    box-sizing: border-box;
    float: left;
    background: url(~assets/visual/mapbg.png) no-repeat;
    background-size: 100% 100%;
    position: relative;
    .fdsx{
      opacity: 0;
       position: absolute;
      top:8px;
      left:16px;
      img{
        width:24px;
        height:24px;
      }
      transition: all 0.3s linear;
    }
    &:hover{
       .fdsx{
         opacity: 1;
         transition: all 0.3s linear;
      }
    }
    .rtIn {
      position: absolute;
      top: 32px;
      right: 32px;
      width: 24px;
      height: 24px;
      z-index: 1200;
    }
    > .title {
      font-size: 16px;
    }
    .tc_top {
      width: 100%;
      height: calc(~"90% - 104px");
      box-sizing: border-box;
      .ttLeft {
        width: 220px;
        height: 100%;
        max-height: 523px;
        box-sizing: border-box;
        padding: 0 16px;
        overflow: hidden;
        float: left;
        background: url(~assets/visual/rank.png) no-repeat;
        background-size: 100% 100%;
      }
      .ttRight {
        width: calc(~"100% - 220px");
        height: 100%;
        box-sizing: border-box;
        float: left;
      }
    }
    .tc_below {
      width: 100%;
      height: 104px;

      .tcbR {
        width: 100%;
        height: 100%;
        .pbar {
          width: 100/7%;
          display: inline-block;
        }
      }
    }

    @media screen and (min-width: 1680px) {
      .tc_top {
        width: 100%;
        height: calc(~"90% - 104px");
        box-sizing: border-box;
        .ttLeft {
          width: 252px;
          height: 100%;
          max-height: 523px;
          box-sizing: border-box;
          padding: 0 16px;
          overflow: hidden;
          float: left;
          background: url(~assets/visual/rank.png) no-repeat;
          background-size: 100% 100%;
        }
        .ttRight {
          width: calc(~"100% - 252px");
          height: 100%;
          box-sizing: border-box;
          float: left;
        }
      }
    }
  }
  .t_right {
    height: 90vh;
    background: url(~assets/visual/rtOpen.png) no-repeat;
    background-size: 100% 100%;
    width: 256px;
    box-sizing: border-box;
    float: left;
    > .title {
      font-size: 16px;
    }
  }
}
.returnBack{
  position:fixed;
  top:16px;
  left:16px;
  width:32px;
  height:32px;
  cursor:pointer;
   background: url(~assets/visual/goBack.png) no-repeat;
}

.newBox{
  min-width: 1024px;
  overflow: hidden;
  .topMap{
    .t_left{
      display: none;
    }
    .t_right{
      display: none;
    }
    .t_center{
      width:100%;
      margin:0;
      .tc_top{
          width: calc(~"100% - 240px");
          height: 90%;
          float: left;
      }
      .tc_below{
          width: 240px;
          margin-top:32px;
          height: 90%;
          float: left;
          .pbar {
            width: 100px;
            display: inline-block;
          }
      }
    }
  }
}
</style>
