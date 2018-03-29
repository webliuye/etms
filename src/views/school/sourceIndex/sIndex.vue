//内部资源首页的资源列表
<template>
    <div class="dashborad tabsID">
      <div class='topB'>
        <el-row :gutter="16">
          <el-col :span="18">
              <el-carousel height="250px" :interval="5000">
                <el-carousel-item v-for="(item,index)  in picArray" :key="index">
                  <div style="width:100%;height:100%;position:relative;"><img :src="item.src" class="bBox"></div>
                </el-carousel-item>
              </el-carousel>
          </el-col>
          <el-col :span="6">
            <div class='r_tb'>
              <p  class="pbox">
                <el-row :gutter="12">
                  <el-col :span="8">
                    <div class="sourceBox" ></div>
                  </el-col>
                   <el-col :span="12">
                      <h3>资源数：</h3>
                      <h3>{{sourceNum}}套</h3>
                  </el-col>
                </el-row>
              </p>
              <p class="pcon">
                <span v-for="(item,index)  in countList" :key="index">{{item.resourceTypeName}}：<a>{{item.ersCount}}套</a></span>
              </p>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="ipBox">
        <el-row :gutter="24">
          <el-col :span="12">
            <div style="position:relative;">
              <div>
                <h4>最热资源</h4>
                <div class="listBox">
                  <p v-for=" (item,index) in hotList" :key='index' @click="toDetail(item)" class="listItem">
                     <span v-if="(index+(hotSearchData.page-1)*10)==0" class="firstA"></span>
                     <span v-if="(index+(hotSearchData.page-1)*10)==1" class="second"></span>
                     <span v-if="(index+(hotSearchData.page-1)*10)==2" class="third"></span>
                     <span v-if="(index+(hotSearchData.page-1)*10)>2">{{index+(hotSearchData.page-1)*10+1}}</span>{{item.resourceTypeName}}  | {{item.name}}
                  </p>
                </div>
                <div class="btnBox fr">
                   <span v-if="hotlt" @click="minus('hot')"><img src="~assets/sourceImg/lBt.png"></span>
                   <span v-else style="opacity:0"><img src="~assets/sourceImg/lBt.png"></span>
                   <span v-if="hotrt" @click="add('hot')"><img src="~assets/sourceImg/rBt.png"></span>
                   <span v-else style="opacity:0"><img src="~assets/sourceImg/rBt.png"></span>
                </div>
              </div>
              <div class="tabsBox" >
                <el-tabs v-model="hotName" @tab-click="hotClick">
                  <el-tab-pane v-for="(item,index)  in subjectList" :label="item.nodeName" :name="item.textbookCode" :key="index"> </el-tab-pane>
                </el-tabs>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div style="position:relative;">
              <div>
                <h4>推荐资源</h4>
                <div class="listBox">
                  <p v-for=" (item,index) in rcmList"  @click="toDetail(item)" class="listItem" :key="index">
                     <span v-if="(index+(rcmSearchData.page-1)*10)==0" class="firstA"></span>
                     <span v-if="(index+(rcmSearchData.page-1)*10)==1" class="second"></span>
                     <span v-if="(index+(rcmSearchData.page-1)*10)==2" class="third"></span>
                     <span v-if="(index+(rcmSearchData.page-1)*10)>2">{{index+(rcmSearchData.page-1)*10+1}}</span>{{item.resourceTypeName}}  | {{item.name}}
                  </p>
                </div>
               <div class="btnBox fr">
                   <span v-if="rcmlt" @click="minus('rcm')"><img src="~assets/sourceImg/lBt.png"></span>
                   <span v-else style="opacity:0"><img src="~assets/sourceImg/lBt.png"></span>
                   <span v-if="rcmrt" @click="add('rcm')"><img src="~assets/sourceImg/rBt.png"></span>
                   <span v-else style="opacity:0"><img src="~assets/sourceImg/rBt.png"></span>
               </div>
              </div>
              <div class="tabsBox" >
                <el-tabs v-model="rcmName" @tab-click="rcmClick">
                    <el-tab-pane v-for="(item,index)  in subjectList" :label="item.nodeName" :name="item.textbookCode" :key="index"> </el-tab-pane>
                </el-tabs>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="NewBox">
        <div style="position:relative;">
          <div>
            <h4>最新资源</h4>
            <div class="listBox ">
              <el-row :gutter="24">
                <el-col :span="12" v-for=" (item,index) in newList" :key="index"  >
                  <p class="newItem"  @click="toDetail(item)" >
                    <el-row>
                      <el-col :span="2">
                         <img v-for="(items,index) in allSourceType" v-if="item.resourceType == items.value" :key="index" :src="imgPaths[items.value]">
                      </el-col>
                      <el-col :span="18">{{item.name}}</el-col>
                      <el-col :span="4">{{item.createTime.substr(0,10)}}</el-col>
                    </el-row>
                  </p>
                </el-col>
              </el-row>
            </div>
            <div class="btnBox fr">
                <span v-if="newlt" @click="minus('new')"><img src="~assets/sourceImg/lBt.png"></span>
                <span v-else style="opacity:0"><img src="~assets/sourceImg/lBt.png"></span>
                <span v-if="newrt" @click="add('new')"><img src="~assets/sourceImg/rBt.png"></span>
                <span v-else style="opacity:0"><img src="~assets/sourceImg/rBt.png"></span>
            </div>
          </div>
          <div class="tabsBox" >
            <el-tabs v-model="newName" @tab-click="newClick">
                 <el-tab-pane v-for="(item,index)  in subjectList" :label="item.nodeName" :name="item.textbookCode" :key="index"> </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
import {
  getSourceSubject,
  getSourceCount,
  getListData,
  getSourceAllSize
} from "api/source";
import { mapGetters } from "vuex";
import {getInnerSourceSubject} from 'api/source'
export default {
  components: {},
  data() {
    return {
      sourceNum: 0,
      teachSrcNum: null,
      hotName: "",
      rcmName: "",
      newName: "",
      hotpages: null,
      rcmpages: null,
      newpages: null,
      hotList: [],
      rcmList: [],
      newList: [],
      subjectList: [],
      hotlt: false,
      hotrt: false,
      rcmlt: false,
      rcmrt: false,
      newlt: false,
      newrt: false,
      countList: [],
      imgPaths:[],
      sourceSubject:[],
      hotSearchData: {
        textbookCode: "",
        sort: "sourceViewCount",
        size: 10,
        page: 1
      },
      rcmSearchData: {
        textbookCode: "",
        sort: "recommend",
        recommend: true,
        size: 10,
        page: 1
      },
      newSearchData: {
        textbookCode: "",
        sort: "createTime",
        size: 10,
        page: 1
      },
      picArray: [
        { src: require("../../../assets/sourceImg/ba.png") },
        { src: require("../../../assets/sourceImg/bb.png") }
        // 'http://chuantu.biz/t6/101/1508218602x2936639052.png',
        // 'http://chuantu.biz/t6/101/1508218640x2918527206.png'
      ]
    };
  },
  computed: {
    ...mapGetters(['allSourceType'])
  },
  created() {
    var objTemp = this.$store.state.user.userInfo.orgType=='225'? {groups:'subject',onlyPublic:true,allStage:true} :{groups:'subject'};
      objTemp&&getInnerSourceSubject(objTemp).then(res=>{
            this.sourceSubject=res;
            this.subjectList = res;
            this.hotName = res[0].textbookCode;
            this.hotSearchData.textbookCode = this.hotName;
            this.rcmName = res[0].textbookCode;
            this.rcmSearchData.textbookCode = this.rcmName;
            this.newName = res[0].textbookCode;
            this.newSearchData.textbookCode = this.newName;
            this.$store.dispatch("GetInfo").then(res => {
              if (res.subjects && res.subjects.length > 0) {
                let t = Number(res.subjects[0]) - 1;
                this.hotName = this.sourceSubject[t].textbookCode;
                this.rcmName = this.sourceSubject[t].textbookCode;
                this.newName = this.sourceSubject[t].textbookCode;
                this.newSearchData.textbookCode = this.newName;
                this.rcmSearchData.textbookCode = this.rcmName;
                this.hotSearchData.textbookCode = this.hotName;
              }
              this.getHotList();
              this.getRcmList();
              this.getNewList();
            });
        })
     const vm = this;
		this.$store.dispatch("GetAllSourceType").then(res => {
			res.forEach(function(s) {
				let t = require(`src/assets/sourceImg/tiny/${s.value}.png`);
				vm.imgPaths[s.value] = t;
			});
		});
    getSourceAllSize({ pretty: true }).then(res => {
      console.log(res);
    });
    this.getCountData();
  },
  methods: {
    getMyInfo() {
      // 获取个人信息
    },
    getCountData() {
      getSourceCount().then(res => {
        res.forEach(e => {
          this.sourceNum += e.ersCount;
        });
        this.countList = res;
      });
    },
    hotClick(tab, event) {
      this.hotSearchData.textbookCode = tab.name;
      this.getHotList();
    },
    rcmClick(tab, event) {
      this.rcmSearchData.textbookCode = tab.name;
      this.getRcmList();
    },
    newClick(tab, event) {
      this.newSearchData.textbookCode = tab.name;
      this.getNewList();
    },
    getHotList() {
      getListData(this.hotSearchData)
        .then(res => {
          this.hotpages = res.pages;
          if (this.hotpages > 1) {
            this.hotrt = true;
          }
          if (this.hotSearchData.page > 1) {
            this.hotlt = true;
          } else {
            this.hotlt = false;
          }
          if (this.hotSearchData.page == this.hotpages) {
            this.hotrt = false;
          }
          this.hotList = res.data;
        })
        .catch(err => {
          console.log("没有数据");
        });
    },
    getRcmList() {
      getListData(this.rcmSearchData).then(res => {
        this.rcmpages = res.pages;
        if (this.rcmpages > 1) {
          this.rcmrt = true;
        }
        if (this.rcmSearchData.page > 1) {
          this.rcmlt = true;
        } else {
          this.rcmlt = false;
        }
        if (this.rcmSearchData.page == this.rcmpages) {
          this.rcmrt = false;
        }
        this.rcmList = res.data;
      });
    },
    getNewList() {
      getListData(this.newSearchData).then(res => {
        this.newpages = res.pages;
        if (this.newpages > 1) {
          this.newrt = true;
        }
        if (this.newSearchData.page > 1) {
          this.newlt = true;
        } else {
          this.newlt = false;
        }
        if (this.newSearchData.page == this.newpages) {
          this.newrt = false;
        }
        this.newList = res.data;
      });
    },
    minus(text) {
      if (text == "hot") {
        this.hotSearchData.page -= 1;
        if (this.hotSearchData.page > 0) {
          this.getHotList();
        }else{
          this.hotSearchData.page=1;
        }
      }
      if (text == "rcm") {
        this.rcmSearchData.page -= 1;
        if (this.rcmSearchData.page > 0) {
          this.getRcmList();
        }else{
          this.rcmSearchData.page=1
        }
      }
      if (text == "new") {
        this.newSearchData.page -= 1;
        if (this.newSearchData.page > 0) {
          this.getNewList();
        }else{
          this.newSearchData.page=1;
        }
      }
    },
    add(text) {
      if (text == "hot") {
        this.hotSearchData.page += 1;
        this.getHotList();
      }
      if (text == "rcm") {
        this.rcmSearchData.page += 1;
        this.getRcmList();
      }
      if (text == "new") {
        this.newSearchData.page += 1;
        this.getNewList();
      }
    },
    toDetail(item) {
      this.$router.push({
        name: "sourcePreview",
        params: { id: item.resourceId }
      });
    }
  }
};
</script>
<style  rel="stylesheet/less" lang="less" scoped>
.dashborad {
  padding: 8px;
  color: #333;
  font-size: 14px;
  .topB {
    margin-top: 8px;
    padding: 16px;
    background: #fff;
    .r_tb {
      border: 1px solid #ddd;
      height: 250px;
      padding: 16px 24px;
      color: #666;
      .pbox {
        border-bottom: 1px solid #ddd;
        padding: 0px 0 16px 0;
        margin: 16px 0;
      }
      .pcon {
        span {
          display: inline-block;
          width: 45%;
          margin: 16px 0;
          font-size: 16px;
          font-weight: bold;
          a {
            color: #00a0e9;
          }
        }
      }
      .sourceBox {
        background: url("~assets/sourceImg/sourceBox.png");
        width: 68px;
        height: 62px;
      }
      h3 {
        font-size: 16px;
        margin: 0;
        &:nth-child(2) {
          margin-top: 16px;
          color: #00a0e9;
        }
      }
    }

    .el-carousel__item {
      img {
        display: block;
        width: 1400px;
        height: 250px;
        margin: 0 50%;
        transform: translateX(-50%);
      }
      // background:url('~assets/sourceImg/carsoulPic.png');
      // background-size:cover;
    }
  }
  .ipBox {
    margin-top: 8px;
    padding: 24px 16px 0px;
    background: #fff;
  }

  .tabsBox {
    position: absolute;
    width: 100%;
    top: -12px;
    left: 0;
  }
  h4 {
    padding: 0px;
    font-size: 16px;
    padding-left: 16px;
    margin: 0;
    line-height: 16px;
    background: url("~assets/sourceImg/sqB.png") no-repeat;
  }

  .el-col-12 {
    border-right: 1px solid #ddd;
    &:nth-child(2n) {
      border-right: 1px solid transparent;
    }
  }
  .listBox {
    padding: 16px 8px 0px;
    // border-bottom:1px solid #ddd;
    margin-bottom: 8px;
    height: 350px;
    span {
      display: inline-block;
      width: 48px;
      padding-left: 5px;
      height: 20px;
      &.firstA {
        float: left;
        padding-left: 0px;
        background: url("~assets/sourceImg/firstA.png") no-repeat;
      }
      &.second {
        float: left;
        padding-left: 0px;
        background: url("~assets/sourceImg/second.png") no-repeat;
      }
      &.third {
        float: left;
        padding-left: 0px;
        background: url("~assets/sourceImg/third.png") no-repeat;
      }
    }
    .listItem {
      height: 19px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-right: 12px;
      cursor: pointer;
      &:hover {
        color: #00a0e9;
      }

      img {
        vertical-align: middle;
        padding-right: 16px;
      }
    }
  }
  .btnBox {
    margin-right: 24px;
    cursor: pointer;
    img {
      border: 1px solid #fff;
    }
    img:active {
      border-bottom: 1px solid #ccc;
      border-right: 1px solid #ccc;
    }
    span:first-child {
      padding-right: 16px;
    }
  }
}
.NewBox {
  margin-top: 8px;
  padding: 24px 16px 32px;
  background: #fff;
  .listBox {
    height: 186px;
    .el-col-12 {
      height: 35px;
    }
  }
  h4 {
    padding: 0px;
    font-size: 16px;
    padding-left: 16px;
    margin: 0;
    line-height: 16px;
    background: url("~assets/sourceImg/sqB.png") no-repeat;
  }
  .newItem {
    padding: 8px 0px;
    margin: 0;
    cursor: pointer;
    &:hover {
      color: #00a0e9;
    }
  }
}
</style>
