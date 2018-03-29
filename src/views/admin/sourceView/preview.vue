<template>
  <master-page :title="title">
    <div class="filter-container">
      <el-button class="pull-right main-return" type="text" @click="returnBefore">返回</el-button>
        <el-row :gutter="16">
          <el-col :span="18" >
            <div class="left-Content">
               <div style="font-size:12px;padding:8px 0 "  class="nav">
                <span v-for="(item ,index) in navList" :key="index" @click="goSource(item,index)" ><span v-if="index!=0">></span>{{item.nodeName}}</span>
                <span >>资源详情</span>
               </div>
              <div class="titleDiv">
                <h2>{{previewData.sourceName}}</h2>
                <div>
                  <span class="panelSpan">资源ID: {{previewData.serialNumber}}</span>
                  <span class="panelSpan"><img src="~assets/sourceImg/eye.png">  {{previewData.sourceViewCount}}次</span>
                  <span class="panelSpan"><img src="~assets/sourceImg/sizer.png"> {{previewData.sourceSize}}</span>
                  <span class="panelSpan1"  v-if="orgType != '225'" ><img   src="~assets/sourceImg/favorite.png" > {{previewData.sourceCollectCount}}次</span>
                  <span class="panelSpan" v-else >
                    <img  v-if="!previewData.collect" src="~assets/sourceImg/favorite.png" @click="addCollect(previewData.resourceId)">
                    <img v-else src="~assets/sourceImg/heart-blue.png" @click="CancelCollect(previewData.resourceId)">
                    {{previewData.sourceCollectCount}}次
                  </span>
                </div>
              </div>
              <div class="preview-box" v-if="Flash">
                  <img src="~assets/sourceImg/vip.png" v-if="previewData.isVip" class="vip">
                  <embed  :src="previewData.sourceUrl"  quality="high"  type="application/x-shockwave-flash" width="100%" height="300px" allowscriptaccess="always" allownetworking="all" pluginspage="http://www.macromedia.com/go/getflashplayer">
              </div>
              <div class="preview-box" v-if="Video" >
                <img src="~assets/sourceImg/vip.png" v-if="previewData.isVip" class="vip">
                <test class="test" :code="previewData.catalogueId" @testChange="testChange"  v-if="showTest"></test>
                <!-- <Nvideo v-if="fufei" :src="fufeiUrl" :isVip="isVip" ></Nvideo>     -->
                <Nvideo :src="previewData.sourceUrl" :isVip="isVip"  @showTest="testChange"></Nvideo>
              </div>
              <div  class="preview-box2"  v-if="thirdUrl"  >
                 <img src="~assets/sourceImg/vip.png" v-if="previewData.isVip" class="vip">
                 <img src="~assets/sourceImg/qqc.png" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);">
                 <h2 style="background:#3c3c3c;width:100%;color:#fff;height:100%;text-align:center;line-height:480px;">第三方资源暂不支持预览</h2>

                 <!-- <iframe    :src="previewData.sourceUrl" style="width:100%;height:480px;border:none;margin-top:16px;">您的浏览器暂不支持iframe请升级你的浏览器</iframe>         -->
              </div>
              <div class="preview-box2" v-if="isPic">
                <img src="~assets/sourceImg/vip.png" v-if="previewData.isVip" class="vip">
                <div v-loading.body="loading" style="min-height:300px;">
                  <template  v-if="!loading" >
                     <img  v-for="(item,index) in previewData.previewUrls" :src="item" :key="index"  class="imgcls" style=""/>
                  </template>
                </div>
                <div style="text-align:center;width:200px;margin:24px auto;">
                  <p>预览已结束<br>查看全部内容需要下载哦~</p>
                  <a class="uploadBtn" @click="downLoadFile" v-if="showDown">  立即下载</a>
                </div>
              </div>
            </div>
             <div class="link-source">
                  <div slot="header" class="clearfix">
                    <strong>相关资源</strong>
                    <el-button type="text" v-if="list.length>=6" class="fr" @click="goMore()">更多</el-button>
                  </div>
                  <template v-if="list.length>0">
                    <div  v-for="(item,index) in list" :key="index" class="itemBox" style="float:left;cursor:pointer" @click="toDetail(item)">
                      <div class="link_source_img" :class="item.sourceType"></div>
                      <!-- //写在commonLESS -->
                      <p >{{item.sourceName}}</p>
                      <div class="breifCont">
                        <strong>资源简介：</strong>
                        <p> &nbsp;&nbsp; {{item.sourceDescription}}...</p>
                        <h4  @click="toDetail(item)">查看更多</h4>
                      </div>
                    </div>
                  </template>
                  <p v-if="!list.length">该实验没有相关资源</p>
              </div>
          </el-col>
          <el-col :span="6" >
            <div class="right-Content">
              <!-- orgType == '225'&& -->
              <template v-if="isPic">
                   <a class="uploadBtn" @click="downLoadFile">  <img style="vertical-align:middle;" src="~assets/sourceImg/downLoad.png" > 立即下载</a>
              </template>
               <template v-if="thirdUrl">
                   <a class="uploadBtn" @click="downLoadA">  <img style="vertical-align:middle;" src="~assets/sourceImg/downLoad.png" > 点击访问</a>
              </template>
              <div class="right-ContentBox">
                <div class="brief">
                  <strong>资源简介</strong>
                  <p v-if="subtr">{{previewData.sourceDescription.substr(0,50)}}{{previewData.sourceDescription.length>50?'...':''}}</p>
                  <p v-else>{{previewData.sourceDescription}}</p>
                  <el-button v-if="subtr&&previewData.sourceDescription.length>50" type="text" class="fr" @click="subtr=false">查看更多</el-button>
                  <el-button v-if="!subtr" type="text"  class="fr" style="margin-top:-12px;" @click="subtr=true">收起</el-button>
                </div>
                <div class="brief">
                  <strong>资源标签</strong>
                  <p>
                    <span v-for="(item,index) in tags" :key="index" @click="goSearch(item)">{{item}}</span>
                  </p>
                </div>
                <div class="brief">
                  <strong>资源来源</strong>
                  <p>{{previewData.sourceOrigin?previewData.sourceOrigin:"本地资源"}}</p>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
    </div>
  </master-page>
</template>

<script>
import MasterPage from "views/layout/MasterPage";
// import Vvideo from 'views/components/video';
import Nvideo from "views/components/newVideo";
import test from "./test/test";
import {
  getSourcePreviewDetail,
  downloadSource,
  getLinkSource,
  sourceCollect,
  getThemeGuide,
  cancelCollect
} from "api/source";
export default {
  name: "sourcePreview",
  components: { MasterPage, Nvideo,test },
  data() {
    return {
      title: "",
      aaa: "http://sucai.flashline.cn/flash5/yinyue/csb.swf",
      collected: false,
      subjectName: "",
      isVip: false,
      previewData: {
        sourceName: "",
        sourceDescription: "",
        sourceLabel: "",
        sourceViewCount: "",
        sourceCollectCount: "",
        sourceOrigin: "",
        sourceUrl: "",
        sourcePic: "",
        sourceType: "",
        catalogueId: ""
      },
      list: [],
      navList: [],
      subtr: true,
      showDown: true,
      Video: false,
      Flash: false,
      thirdUrl: false,
      fufei: false,
      fufeiUrl: "",
      isPic: false,
      id: "",
      linksrc: "",
      loading: true,
      downLoadUrl: null,
      orgType: this.$store.state.user.userInfo.orgType,
      showTest:false
    };
  },
  computed: {
    tags() {
      return this.previewData.sourceLabel.length > 2
        ? this.previewData.sourceLabel
            .substring(1, this.previewData.sourceLabel.length - 1)
            .split("][")
        : [];
    }
  },
  created() {
    this.id = this.$route.params.id;
    this.downLoadUrl =
      this.$store.getters.objApi.BASE_API +
      "/api/resources/" +
      this.$route.params.id +
      "/download";
    this.getDetail();
  },
  watch: {
    video: {}
  },
  methods: {
    returnBefore() {
      this.$router.go(-1);
    },
    addCollect(id) {
      this.previewData.collect = true;
      sourceCollect(id).then(res => {
        this.$message({
          message: res,
          type: "success"
        });
        this.previewData.sourceCollectCount++;
      });
    },
    CancelCollect(id) {
      this.previewData.collect = false;
      cancelCollect(id).then(res => {
        this.$message({
          message: "已取消收藏",
          type: "success"
        });
        this.previewData.sourceCollectCount--;
      });
    },
    goOpen() {},
    getList() {
      getLinkSource({
        catalogueId: this.previewData.catalogueId,
        resourceId: this.previewData.resourceId
      })
        .then(res => {
          if (res.length > 5) {
            this.list = res.slice(0, 5);
          } else {
            this.list = res;
          }
        })
        .catch(err => {
          console.log("没有相关资源");
        });
    },
    testChange(data){
      if(data&&data.close=='test'){
        this.showTest=false
      }
      if(!data){
        this.showTest=true;
      }
    },
    getDetail() {
      getSourcePreviewDetail(this.id)
        .then(res => {
          this.previewData = res;
          this.navList = res.guides;
          if (res.sourceUrl) {
            //本地资源
            if (res.thirdUrl) {
              //是第三方资源
              var end = res.thirdUrl.slice(-3).toLowerCase();
              if (end == "mp4") {
                this.Video = true;
                this.previewData.sourceUrl = res.thirdUrl;
              } else {
                this.linksrc = res.thirdUrl;
                this.thirdUrl = true;
                //第三方其他的资源去哪里看*************
              }
            } else {
              //本地资源
              if (res.previewUrls) {
                //图片
                this.isPic = true;
                this.previewData.sourceUrl = res.previewUrls;
                this.loading = false;
              } else {
                //非图片
                var end = res.sourceUrl
                  .split("?")[0]
                  .slice(-3)
                  .toLowerCase();
                if (end == "mp4") {
                  this.Video = true;
                  this.previewData.sourceUrl = res.sourceUrl;
                } else if ("end" == "swf") {
                  this.Flash = true;
                  this.previewData.sourceUrl = res.sourceUrl;
                } else {
                  this.linksrc = res.sourceUrl;
                  this.thirdUrl = true;
                }
              }
            }
          } else {
            //联羿资源
            if (res.previewUrls) {
              //图片
              this.isPic = true;
              this.previewData.sourceUrl = res.previewUrls;
              this.loading = false;
            } else {
              downloadSource(this.id).then(res => {
                if (res.slice(0, 4) == "http") {
                  var test = res
                    .split("?")[0]
                    .slice(-3)
                    .toLowerCase();
                  if (test == "mp4") {
                    this.Video = true;
                    this.previewData.sourceUrl = res;
                  } else if ("end" == "swf") {
                    this.Flash = true;
                    this.previewData.sourceUrl = res;
                  } else {
                    this.linksrc = res;
                    this.thirdUrl = true;
                  }
                } else {
                  this.previewData.sourceUrl = "";
                  this.isVip = true;
                  this.Video = true;
                }
              });
            }
          }
          this.getList();
        })
        .catch(err => {
          this.$message({
            message: "没有找到相关信息",
            type: "warning"
          });
          // this.$router.go(-1);
        });
    },
    toDetail(item) {
      console.log(item);
      this.$router.push({
        name: "sourcePreview",
        params: { id: item.resourceId }
      });
    },
    goMore() {
      if (this.orgType == "225") {
        this.$router.push({ name: "srcIndex" });
      } else {
        this.$router.push({ name: "sourceView" });
      }
    },
    downLoadFile() {
      //window.open('https://test-1253997391.cosgz.myqcloud.com/xlsx/2017/09/21b7f37a8bdecf73d228b383ca22d831.xlsx');
      downloadSource(this.id)
        .then(res => {
          console.log(res.constructor === String);
          if (res.slice(0, 4) == "http") {
            var link = document.createElement("a");
            link.href = res;
            link.download = this.previewData.sourceName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            this.$confirm("该资源为vip资源，您暂无权利下载此资源。立即申请开通此资源？", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                this.$router.push({ name: "OpenSource" });
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消"
                });
              });
          }
        })
        .catch(err => {});
    },
    goSearch(name) {
      this.$router.push({ name: "SearchSource", params: { sourceName: name } });
    },
    goSource(item, index) {
      if (index == 0) {
        this.$router.push({
          name: "srcIndex",
          params: { subjectId: this.navList[0].textbookCode }
        });
      } else {
        this.$router.push({
          name: "srcIndex",
          params: {
            subjectId: this.navList[0].textbookCode,
            navData: this.navList.slice(0, index + 1)
          }
        });
      }
    },
    downLoadA() {
      var link = document.createElement("a");
      link.href = this.linksrc;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },
  mounted() {}
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.left-Content {
  min-width: 600px;
  min-height: 400px;
  // border:1px solid  #eeeeee;
  padding: 8px 16px 16px;
  // box-shadow:2px 2px 2px 2px #ccc;
  h2 {
    margin-top: 0;
  }
  .titleDiv {
    font-size: 12px;
    padding: 8px 0 16px 0;
    border-bottom: 1px solid #ccc;
    strong {
      font-size: 16px;
      display: block;
      padding-bottom: 8px;
    }
    .panelSpan {
      padding-right: 24px;
      &:nth-child(2) {
        cursor: pointer;
      }
    }
  }
}
.link-source {
  // border:1px solid  #eeeeee;
  padding: 16px 16px;
  font-size: 12px;
  margin-top: 18px;
  border-top: 1px dashed #ccc;
  .clearfix {
    margin-bottom: 16px;
  }
  strong {
    font-size: 14px;
  }
  h4 {
    color: #fad67f;
    text-align: center;
    position: relative;
    bottom: 10px;
    left: 0;
  }
  .itemBox {
    width: 100px;
    min-height: 106px;
    padding: 8px;
    position: relative;
    margin: 0 8px;
    margin-bottom: 16px;
    .breifCont {
      position: absolute;
      top: 0;
      left: -10%;
      width: 120%;
      height: 170px;
      background: rgba(0, 0, 0, 0.5);
      font-size: 12px;
      color: #fff;
      padding: 8px;
      overflow: hidden;
      opacity: 0;
      transition: opacity 0.3s linear;

      p {
        padding: 0;
        margin: 0;
        height: 96px;
        overflow: hidden;
      }
    }
    &:hover .breifCont {
      opacity: 1;
      transition: opacity 0.3s linear;
    }
  }
}
.right-Content {
  width: 20%;
  min-width: 200px;
  min-height: 500px;
  position: fixed;
  top: 130px;
  right: 2%;
  z-index: 1000;

  .right-ContentBox {
    //  border:1px solid  #eeeeee;
    font-size: 12px;
    //  padding:16px;
    box-shadow: 0 2px 5px #999;
    max-height: 380px;
    overflow: auto;
  }
  .brief {
    word-break: break-all;
    strong {
      font-size: 14px;
    }
    &:nth-child(1) {
      min-height: 200px;
      border-bottom: 1px dashed #ccc;
    }
    &:nth-child(2) {
      min-height: 100px;
      border-bottom: 1px dashed #ccc;
    }
    padding: 16px;

    span {
      display: inline-block;
      padding: 5px 8px;
      border: 1px solid #ccc;
      margin: 5px 4px 0 0;
      border-radius: 12px;
      cursor: pointer;
    }
  }
}
.preview-box {
  margin: 20px auto 0px;
  min-width: 600px;
  min-height: 480px;
  background: #fff;
  position: relative;

}
.preview-box2 {
  margin-top: 20px;
  min-height: 480px;
  position: relative;
}

.uploadBtn {
  display: block;
  background: #20a0ff;
  color: #fff;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  padding: 5px;
  margin: 0;
  margin-bottom: 16px;
  box-shadow: 0 2px 5px #999;
}
.preview-box2 .imgcls {
  display: block;
  width: 100%;
  border: 1px solid #ddd;
  width: 100%;
  min-height: 300px;
  height: auto;
}
.nav {
  span {
    cursor: pointer;
    &:hover {
      color: #00a0e9;
    }
  }
}
.vip {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
}
  .test{
    position: absolute;
    top:0;
    left:0;

    width:100%;
    height:100%;
    overflow-y: auto;
    overflow-x: hidden;
    background:rgba(200, 200, 200, 0.98);
    z-index: 20;
    box-sizing: border-box;
  }
</style>
