//资源首页轮播图行的组件
<template>
    <div class="dashborad tabsID">
      <div class='topB'>

        <el-row :gutter="16">
          <el-col :span="24">
             <div v-if="showCout" style="width:100%;">
                <p class="srcType"> <img src="~assets/sourceImg/srcount.png" alt="图片丢失了">总资源数：<span class="blue">{{sourceNum||0}}套</span></p>
                <p class="srcType"  v-for="(item,index)  in countList" :key="index">
                      <span>{{item.resourceTypeName}}：<a class="blue">{{item.ersCount}}套</a></span>
                </p>
                <p class="srcType"> <img src="~assets/sourceImg/storage.png" alt="图片丢失了">总容量：<span class="blue">{{resourceSize}}</span></p>
              </div>
          </el-col>
          <el-col :span="16">
              <el-carousel height="250px" :interval="5000">
                <el-carousel-item v-for="(item,index)  in picArray" :key="index">
                  <div style="width:100%;height:100%;position:relative;"><img :src="item.src" class="bBox"></div>
                </el-carousel-item>
              </el-carousel>
          </el-col>
          <el-col :span="8">
              <div style="position:relative;">
              <div>
                <h4 style="padding-bottom:16px;border-bottom:1px solid #ddd;">公告</h4>
                <div class="noticeBox">
                  <div class="toscroll">
                    <p v-for=" (item,index) in noticeList"  @click="tonoticeDetail(item)" class="listItem" :title="item.title" :key="index">
                      <el-row>
                        <!-- 【{{item.unitName}}】| -->
                        <el-col :span="20"> <span style="white-space:nowrap;display:inline-block;width:100%;overflow:hidden; text-overflow: ellipsis;"> {{item.title}} </span></el-col>
                        <el-col :span="4">{{item.createTime.substr(5,5)}}</el-col>
                      </el-row>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
</template>
<script>
import {  getNoticeList } from "api/source";
import { getSourceCount, getSourceAllSize } from "api/sourceIndex";
import { mapGetters } from "vuex";
import {
  getRankData,
  getTestData,
  getTestopenData,
  testWarnData
} from "api/sourceIndex";
export default {
  props: {
    showCout: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      sourceNum: null,
      resourceSize: "",
      countList: [],
      noticeList: [],
      picArray: [
        { src: require("../../assets/sourceImg/ba.png") },
        { src: require("../../assets/sourceImg/bb.png") }
      ]
    };
  },
  created() {
    getSourceAllSize({ pretty: true }).then(res => {
      this.resourceSize = res;
    });
    this.getCountData();
    this.getNOtice();
  },
  methods: {
    getNOtice() {
      //获取公告信息
      getNoticeList().then(res => {
        this.noticeList = res;
      });
    },
    getCountData() {
      getSourceCount().then(res => {
        res.forEach(e => {
          this.sourceNum += e.ersCount;
        });
        this.countList = res;
      });
    },

    tonoticeDetail(item) {
      this.$router.push({ name: "NDetail", params: { id: item.id } });
    }
  },
  mounted() {}
};
</script>
<style  rel="stylesheet/less" lang="less" scoped>
.dashborad {
  padding: 0;
  color: #333;
  font-size: 14px;
  .topB {
    padding: 8px 16px;
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
        margin: 0 0 20px 0;
        span {
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
.noticeBox {
  padding: 8px 8px 0px;
  // border-bottom:1px solid #ddd;
  margin-bottom: 8px;
  height: 170px;
  overflow: hidden;
  .listItem {
    cursor: pointer;
    margin: 8px 0;
    &:hover {
      color: #00a0e9;
    }
  }
}

.srcType {
  color: #666;
  margin: 0;
  padding: 0 8px 8px 0;
  margin-right: 32px;
  float: left;
  .blue {
    color: #00a0e9;
  }
  img {
    vertical-align: middle;
    padding-right: 8px;
  }
}
.countBox {
  margin-top: 8px;
  padding: 24px 16px 16px;
  background: #fff;
  h4 {
    padding-bottom: 8px;
    border-bottom: 1px solid rgb(209, 219, 229);
  }
  .listBox {
    padding: 8px 8px 0px;
    height: 186px;
    overflow: hidden;
  }
}
.more {
  color: #00a0e9;
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
}
.listBox {
  .el-col {
    overflow: hidden;
    height: 19px;
  }
}
</style>
